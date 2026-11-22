import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { AdminModuleId, ProjectHealth, WorkspaceProject } from '../../../types/workspace';

interface ProjectsWidgetProps {
  projects: WorkspaceProject[];
  onNavigateModule: (id: AdminModuleId) => void;
}

const HEALTH_CONFIG: Record<
  ProjectHealth,
  {
    label: string;
    className: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  'on-schedule': {
    label: 'On schedule',
    className: 'text-[#00FF78]',
    icon: CheckCircle2,
  },
  'review-needed': {
    label: 'Review needed',
    className: 'text-amber-400',
    icon: AlertCircle,
  },
  active: {
    label: 'Active',
    className: 'text-[#C5FF62]',
    icon: Clock,
  },
};

export const ProjectsWidget: React.FC<ProjectsWidgetProps> = ({
  projects,
  onNavigateModule,
}) => {
  return (
    <section
      aria-labelledby="widget-projects-title"
      className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#272A26]">
          <div>
            <h2
              id="widget-projects-title"
              className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F6F2]"
            >
              Active Projects
            </h2>
            <p className="mt-0.5 text-xs text-[#A0A39A]">
              Sample projects · Stage &amp; next milestone
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateModule('project-planner')}
            className="text-xs font-medium text-[#C5FF62] hover:underline whitespace-nowrap cursor-pointer py-1"
          >
            View Projects
          </button>
        </div>

        <ul className="divide-y divide-[#272A26] mt-1">
          {projects.map((proj) => {
            const healthCfg = HEALTH_CONFIG[proj.health];
            const HealthIcon = healthCfg.icon;
            return (
              <li key={proj.id} className="py-3.5 first:pt-3.5 last:pb-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium text-[#F5F6F2]">
                    {proj.name}
                  </h3>
                  {proj.deadline && (
                    <span className="font-mono text-xs tabular-nums text-[#A0A39A] shrink-0">
                      Due {proj.deadline}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-[#A0A39A]">
                  Next: <span className="text-[#F5F6F2]/90">{proj.nextMilestone}</span>
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-[#A0A39A]">
                  <span className={`inline-flex items-center gap-1 font-medium ${healthCfg.className}`}>
                    <HealthIcon size={12} aria-hidden="true" />
                    <span>{healthCfg.label}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Stage: {proj.stage}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
