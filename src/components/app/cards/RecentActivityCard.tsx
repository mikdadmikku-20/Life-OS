import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  FolderKanban,
  Sparkles,
  Target,
} from 'lucide-react';
import { ActivityTimelineEvent } from '../../../types/appHome';

interface RecentActivityCardProps {
  events: ActivityTimelineEvent[];
  cardSurfaceClass: string;
}

const CATEGORY_ICON: Record<ActivityTimelineEvent['category'], React.ReactNode> = {
  task: <CheckCircle2 size={14} className="text-[#6BFF9C]" aria-hidden="true" />,
  goal: <Target size={14} className="text-[#C5FF62]" aria-hidden="true" />,
  note: <BookOpen size={14} className="text-[#3DF58B]" aria-hidden="true" />,
  project: <FolderKanban size={14} className="text-[#6BFF9C]" aria-hidden="true" />,
  capture: <Sparkles size={14} className="text-[#C5FF62]" aria-hidden="true" />,
};

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  events,
  cardSurfaceClass,
}) => {
  return (
    <section
      aria-labelledby="card-recent-activity-title"
      className={`rounded-[26px] border p-5 sm:p-6 flex flex-col justify-between ${cardSurfaceClass}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="card-recent-activity-title"
              className="text-base sm:text-lg font-semibold text-[#F5F7F2]"
            >
              Recent Activity
            </h2>
            <p className="text-xs text-[#8CA195]">
              Chronological updates across tasks, goals, notes, and captures
            </p>
          </div>
          <span className="font-mono text-xs tabular-nums text-[#8CA195] pt-0.5">
            {events.length} items
          </span>
        </div>

        <ul className="mt-4 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
          {events.slice(0, 6).map((item) => (
            <li
              key={item.id}
              className="rounded-2xl bg-[#07120C]/90 border border-[#1B3A29] px-3.5 py-3 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="w-7 h-7 rounded-xl bg-[#0E2218] border border-[#214531] flex items-center justify-center shrink-0 mt-0.5">
                  {CATEGORY_ICON[item.category]}
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-[13px] font-medium text-[#F5F7F2] leading-snug">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8CA195]">
                    {item.source === 'session'
                      ? 'Recorded in active session'
                      : 'Sample baseline entry'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#7A8D81] whitespace-nowrap shrink-0">
                {item.timeLabel}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-[#7A8D81]">
        Session actions appear above sample workspace baseline events
      </p>
    </section>
  );
};
