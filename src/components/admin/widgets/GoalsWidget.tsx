import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { AdminModuleId, GoalStatus, WorkspaceGoal } from '../../../types/workspace';

interface GoalsWidgetProps {
  goals: WorkspaceGoal[];
  onNavigateModule: (id: AdminModuleId) => void;
}

const GOAL_STATUS_CONFIG: Record<
  GoalStatus,
  {
    label: string;
    className: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  'on-track': {
    label: 'On track',
    className: 'text-[#00FF78]',
    icon: CheckCircle2,
  },
  'needs-attention': {
    label: 'Needs attention',
    className: 'text-amber-400',
    icon: AlertCircle,
  },
  ahead: {
    label: 'Ahead',
    className: 'text-[#C5FF62]',
    icon: TrendingUp,
  },
};

export const GoalsWidget: React.FC<GoalsWidgetProps> = ({
  goals,
  onNavigateModule,
}) => {
  return (
    <section
      aria-labelledby="widget-goals-title"
      className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#272A26]">
          <div>
            <h2
              id="widget-goals-title"
              className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F6F2]"
            >
              Goals at a Glance
            </h2>
            <p className="mt-0.5 text-xs text-[#A0A39A]">
              Sample goals · Up to 3 active priorities
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateModule('goal-planner')}
            className="text-xs font-medium text-[#C5FF62] hover:underline whitespace-nowrap cursor-pointer py-1"
          >
            View Goals
          </button>
        </div>

        <ul className="divide-y divide-[#272A26] mt-1">
          {goals.slice(0, 3).map((goal) => {
            const statusCfg = GOAL_STATUS_CONFIG[goal.status];
            const StatusIcon = statusCfg.icon;
            return (
              <li key={goal.id} className="py-4 first:pt-3.5 last:pb-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium text-[#F5F6F2] leading-snug">
                    {goal.title}
                  </h3>
                  <span className="font-mono text-xs font-semibold tabular-nums text-[#C5FF62] shrink-0">
                    {goal.progress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  role="progressbar"
                  aria-valuenow={goal.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${goal.title} progress ${goal.progress}%`}
                  className="mt-2.5 h-2 w-full rounded-full bg-[#101110] overflow-hidden"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00A85A] to-[#C5FF62] transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#A0A39A] leading-snug">
                  Milestone: <span className="text-[#F5F6F2]/90">{goal.currentMilestone}</span>
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-[#A0A39A]">
                  <span className={`inline-flex items-center gap-1 font-medium ${statusCfg.className}`}>
                    <StatusIcon size={12} aria-hidden="true" />
                    <span>{statusCfg.label}</span>
                  </span>
                  {goal.targetDate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">Target {goal.targetDate}</span>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
