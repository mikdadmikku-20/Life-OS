import React from 'react';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import {
  AdminModuleId,
  CommitmentUrgency,
  UpcomingCommitment,
} from '../../../types/workspace';

interface CommitmentsWidgetProps {
  commitments: UpcomingCommitment[];
  onNavigateModule: (id: AdminModuleId) => void;
}

const URGENCY_STYLES: Record<
  CommitmentUrgency,
  {
    className: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  urgent: {
    className: 'text-amber-400',
    icon: AlertTriangle,
  },
  soon: {
    className: 'text-[#C5FF62]',
    icon: Clock,
  },
  scheduled: {
    className: 'text-[#A0A39A]',
    icon: Calendar,
  },
};

export const CommitmentsWidget: React.FC<CommitmentsWidgetProps> = ({
  commitments,
  onNavigateModule,
}) => {
  return (
    <section
      aria-labelledby="widget-commitments-title"
      className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#272A26]">
          <div>
            <h2
              id="widget-commitments-title"
              className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F6F2]"
            >
              Upcoming Commitments
            </h2>
            <p className="mt-0.5 text-xs text-[#A0A39A]">
              Sample deadlines, applications &amp; events
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateModule('programs-opportunities-explorer')}
            className="text-xs font-medium text-[#C5FF62] hover:underline whitespace-nowrap cursor-pointer py-1"
          >
            Explorer
          </button>
        </div>

        <ul className="divide-y divide-[#272A26] mt-1">
          {commitments.map((item) => {
            const urgencyCfg = URGENCY_STYLES[item.urgency];
            const UrgencyIcon = urgencyCfg.icon;
            return (
              <li key={item.id} className="py-3.5 first:pt-3.5 last:pb-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium text-[#F5F6F2] leading-snug">
                    {item.title}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium shrink-0 ${urgencyCfg.className}`}
                  >
                    <UrgencyIcon size={12} aria-hidden="true" />
                    <span>{item.statusLabel}</span>
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-[#A0A39A]">
                  <span className="font-mono tabular-nums text-[#F5F6F2]/85">
                    {item.dateLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => onNavigateModule(item.moduleId)}
                    className="hover:text-[#C5FF62] hover:underline transition-colors cursor-pointer text-left truncate"
                  >
                    {item.moduleName}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
