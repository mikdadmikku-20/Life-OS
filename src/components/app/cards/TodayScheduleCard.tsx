import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { AppSidebarEntryId, ScheduleSlotItem } from '../../../types/appHome';

interface TodayScheduleCardProps {
  selectedDayOffset: number;
  onChangeDayOffset: (offset: number) => void;
  slots: ScheduleSlotItem[];
  onNavigateEntry: (id: AppSidebarEntryId) => void;
  cardSurfaceClass: string;
}

const WEEK_OFFSETS = [-2, -1, 0, 1, 2, 3];

export const TodayScheduleCard: React.FC<TodayScheduleCardProps> = ({
  selectedDayOffset,
  onChangeDayOffset,
  slots,
  onNavigateEntry,
  cardSurfaceClass,
}) => {
  const today = new Date();
  const activeDate = new Date(today);
  activeDate.setDate(today.getDate() + selectedDayOffset);

  const monthHeading = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(activeDate);

  const daySlots = slots.filter((s) => s.dayOffset === selectedDayOffset);

  return (
    <section
      aria-labelledby="card-schedule-title"
      className={`rounded-[26px] border p-5 sm:p-6 flex flex-col justify-between ${cardSurfaceClass}`}
    >
      <div>
        {/* Top Week Navigation Row (Inspired by Image 1 Calendar Header) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onChangeDayOffset(Math.max(-2, selectedDayOffset - 1))}
            disabled={selectedDayOffset <= -2}
            className="inline-flex items-center gap-1 min-h-[34px] px-3 py-1 rounded-full bg-[#0E1E16] border border-[#1E3B2B] text-xs font-medium text-[#A1B0A6] hover:text-[#F5F7F2] hover:border-[#6BFF9C]/45 disabled:opacity-40 cursor-pointer transition-colors"
          >
            <ChevronLeft size={13} aria-hidden="true" />
            <span>Prev Day</span>
          </button>

          <div className="text-center">
            <h2
              id="card-schedule-title"
              className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F7F2]"
            >
              {monthHeading}
            </h2>
            <p className="text-[11px] text-[#8CA195]">
              Today&apos;s Schedule · Sample schedule data
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChangeDayOffset(Math.min(3, selectedDayOffset + 1))}
            disabled={selectedDayOffset >= 3}
            className="inline-flex items-center gap-1 min-h-[34px] px-3 py-1 rounded-full bg-[#0E1E16] border border-[#1E3B2B] text-xs font-medium text-[#A1B0A6] hover:text-[#F5F7F2] hover:border-[#6BFF9C]/45 disabled:opacity-40 cursor-pointer transition-colors"
          >
            <span>Next Day</span>
            <ChevronRight size={13} aria-hidden="true" />
          </button>
        </div>

        {/* Interactive 6-Day Selector Strip */}
        <div
          role="tablist"
          aria-label="Select schedule day"
          className="mt-5 grid grid-cols-6 gap-1.5 sm:gap-2 border-b border-white/[0.06] pb-3.5"
        >
          {WEEK_OFFSETS.map((offset) => {
            const d = new Date(today);
            d.setDate(today.getDate() + offset);
            const weekday = new Intl.DateTimeFormat('en-US', {
              weekday: 'short',
            }).format(d);
            const dayNum = d.getDate();
            const isSelected = offset === selectedDayOffset;

            return (
              <button
                key={offset}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onChangeDayOffset(offset)}
                className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#132A1E] border border-[#6BFF9C]/55 text-[#F5F7F2]'
                    : 'text-[#8CA195] hover:text-[#F5F7F2] hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <span className="text-[11px] font-medium">{weekday}</span>
                <span
                  className={`mt-0.5 font-mono text-xs sm:text-sm font-semibold tabular-nums ${
                    isSelected ? 'text-[#6BFF9C]' : ''
                  }`}
                >
                  {dayNum}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time Slots List */}
        {daySlots.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-[#8CA195]">
              No sample blocks scheduled for this day.
            </p>
            <button
              type="button"
              onClick={() => onChangeDayOffset(0)}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#0E1E16] border border-[#214231] text-xs font-medium text-[#6BFF9C] hover:border-[#6BFF9C]/60 cursor-pointer"
            >
              Return to Today
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {daySlots.map((slot) => {
              const isConflict = slot.status === 'conflict';
              const isEmerald = slot.tone === 'emerald' && !isConflict;
              const isLime = slot.tone === 'lime' && !isConflict;

              return (
                <div
                  key={slot.id}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <div className="col-span-4 sm:col-span-3 font-mono text-xs tabular-nums text-[#8CA195]">
                    {slot.timeRangeLabel}
                  </div>

                  <div className="col-span-8 sm:col-span-9">
                    <div
                      className={`rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border transition-colors ${
                        isEmerald
                          ? 'bg-[#3DF58B] border-[#6BFF9C] text-[#05100A]'
                          : isLime
                          ? 'bg-[#C5FF62] border-[#D5FF8D] text-[#050C08]'
                          : isConflict
                          ? 'bg-[#1D1810] border-amber-400/55 text-[#F5F7F2]'
                          : 'bg-[#F5F7F2] border-white text-[#08110C]'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold truncate">
                          {slot.title}
                        </p>
                        <p
                          className={`text-[11px] truncate ${
                            isEmerald || isLime
                              ? 'text-[#05100A]/80'
                              : isConflict
                              ? 'text-amber-300'
                              : 'text-[#08110C]/70'
                          }`}
                        >
                          {slot.categoryLabel}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-medium shrink-0">
                        {slot.status === 'completed' && (
                          <>
                            <CheckCircle2 size={13} aria-hidden="true" />
                            <span>Completed</span>
                          </>
                        )}
                        {slot.status === 'in-progress' && (
                          <>
                            <Clock size={13} aria-hidden="true" />
                            <span>In progress</span>
                          </>
                        )}
                        {slot.status === 'upcoming' && (
                          <>
                            <ArrowRight size={13} aria-hidden="true" />
                            <span>Upcoming</span>
                          </>
                        )}
                        {slot.status === 'conflict' && (
                          <>
                            <AlertTriangle
                              size={13}
                              className="text-amber-400"
                              aria-hidden="true"
                            />
                            <span className="text-amber-300">Conflict</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-[#8CA195]">
          Chronological daily blocks
        </span>
        <button
          type="button"
          onClick={() => onNavigateEntry('daily-schedule-tracker-planner')}
          className="inline-flex items-center gap-1 font-medium text-[#6BFF9C] hover:underline cursor-pointer"
        >
          <span>Daily Schedule Tracker &amp; Planner</span>
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
