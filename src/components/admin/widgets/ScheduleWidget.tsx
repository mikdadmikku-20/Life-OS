import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { AdminModuleId, ScheduleEvent, ScheduleStatus } from '../../../types/workspace';

interface ScheduleWidgetProps {
  events: ScheduleEvent[];
  onNavigateModule: (id: AdminModuleId) => void;
}

const STATUS_DISPLAY: Record<
  ScheduleStatus,
  {
    label: string;
    className: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  completed: {
    label: 'Completed',
    className: 'text-[#A0A39A]',
    icon: CheckCircle2,
  },
  'in-progress': {
    label: 'In progress',
    className: 'text-[#C5FF62]',
    icon: Clock,
  },
  upcoming: {
    label: 'Upcoming',
    className: 'text-[#F5F6F2]',
    icon: ArrowRight,
  },
  conflict: {
    label: 'Overlap conflict',
    className: 'text-amber-400',
    icon: AlertTriangle,
  },
};

export const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({
  events,
  onNavigateModule,
}) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const formattedNow = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Determine where the current-time indicator sits cleanly among today's timeline blocks
  let indicatorInsertIndex = events.findIndex(
    (evt) => currentMinutes < evt.startMinutes
  );
  if (indicatorInsertIndex === -1) {
    indicatorInsertIndex = events.length;
  }

  return (
    <section
      aria-labelledby="widget-schedule-title"
      className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#272A26]">
          <div>
            <h2
              id="widget-schedule-title"
              className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F6F2]"
            >
              Today&apos;s Schedule
            </h2>
            <p className="mt-0.5 text-xs text-[#A0A39A]">
              Demonstration schedule · Chronological timeline
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateModule('daily-schedule-tracker-planner')}
            className="text-xs font-medium text-[#C5FF62] hover:underline whitespace-nowrap cursor-pointer py-1"
          >
            View Schedule
          </button>
        </div>

        <div className="mt-4 relative">
          {/* Vertical timeline spine */}
          <div
            aria-hidden="true"
            className="absolute left-[74px] sm:left-[82px] top-2 bottom-2 w-px bg-[#272A26]"
          />

          <ul className="space-y-3">
            {events.map((evt, idx) => {
              const statusInfo = STATUS_DISPLAY[evt.status];
              const StatusIcon = statusInfo.icon;
              const isCurrent = evt.status === 'in-progress';
              const isConflict = evt.status === 'conflict';

              return (
                <React.Fragment key={evt.id}>
                  {idx === indicatorInsertIndex && (
                    <li
                      aria-label={`Current time marker ${formattedNow}`}
                      className="flex items-center gap-3 py-1"
                    >
                      <span className="w-[62px] sm:w-[70px] text-right font-mono text-[11px] font-semibold tabular-nums text-[#C5FF62] shrink-0">
                        {formattedNow}
                      </span>
                      <span
                        aria-hidden="true"
                        className="w-2.5 h-2.5 rounded-full bg-[#C5FF62] ring-4 ring-[#C5FF62]/15 shrink-0 z-10"
                      />
                      <span className="flex-1 h-px bg-[#C5FF62]/65" />
                      <span className="text-[11px] font-medium text-[#C5FF62] shrink-0">
                        Now
                      </span>
                    </li>
                  )}

                  <li className="flex items-start gap-3">
                    <div className="w-[62px] sm:w-[70px] text-right pt-2.5 shrink-0">
                      <span className="block font-mono text-xs font-medium tabular-nums text-[#F5F6F2]">
                        {evt.startTime}
                      </span>
                      <span className="block font-mono text-[11px] tabular-nums text-[#A0A39A]">
                        {evt.durationLabel}
                      </span>
                    </div>

                    <div className="pt-3.5 shrink-0 z-10">
                      <span
                        aria-hidden="true"
                        className={`block w-2.5 h-2.5 rounded-full border ${
                          isCurrent
                            ? 'bg-[#00FF78] border-[#C5FF62]'
                            : isConflict
                            ? 'bg-amber-400 border-amber-300'
                            : evt.status === 'completed'
                            ? 'bg-[#272A26] border-[#3B4039]'
                            : 'bg-[#101110] border-[#A0A39A]'
                        }`}
                      />
                    </div>

                    <div
                      className={`flex-1 min-w-0 rounded-xl px-3.5 py-2.5 border transition-colors ${
                        isCurrent
                          ? 'bg-[#222329] border-[#C5FF62]/40'
                          : isConflict
                          ? 'bg-[#1D1B16] border-amber-500/40'
                          : 'bg-[#101110]/75 border-[#272A26]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                        <p
                          className={`text-sm font-medium leading-snug ${
                            evt.status === 'completed'
                              ? 'text-[#A0A39A]'
                              : 'text-[#F5F6F2]'
                          }`}
                        >
                          {evt.title}
                        </p>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-[#A0A39A]">
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${statusInfo.className}`}
                        >
                          <StatusIcon size={12} aria-hidden="true" />
                          <span>{statusInfo.label}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {evt.startTime}–{evt.endTime}
                        </span>
                        {evt.moduleContext && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">{evt.moduleContext}</span>
                          </>
                        )}
                        {evt.source === 'local' && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#C5FF62]">Adjusted</span>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                </React.Fragment>
              );
            })}

            {indicatorInsertIndex === events.length && (
              <li
                aria-label={`Current time marker ${formattedNow}`}
                className="flex items-center gap-3 pt-1"
              >
                <span className="w-[62px] sm:w-[70px] text-right font-mono text-[11px] font-semibold tabular-nums text-[#C5FF62] shrink-0">
                  {formattedNow}
                </span>
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full bg-[#C5FF62] ring-4 ring-[#C5FF62]/15 shrink-0 z-10"
                />
                <span className="flex-1 h-px bg-[#C5FF62]/65" />
                <span className="text-[11px] font-medium text-[#C5FF62] shrink-0">
                  Now
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};
