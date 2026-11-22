import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  Target,
} from 'lucide-react';
import { AppSidebarEntryId } from '../../../types/appHome';
import {
  UpcomingCommitment,
  WorkspaceGoal,
  WorkspaceProject,
} from '../../../types/workspace';

interface GoalsProjectsCardProps {
  goals: WorkspaceGoal[];
  projects: WorkspaceProject[];
  commitments: UpcomingCommitment[];
  onNavigateEntry: (id: AppSidebarEntryId) => void;
  cardSurfaceClass: string;
}

type OverviewTab = 'goals' | 'projects' | 'commitments';

export const GoalsProjectsCard: React.FC<GoalsProjectsCardProps> = ({
  goals,
  projects,
  commitments,
  onNavigateEntry,
  cardSurfaceClass,
}) => {
  const [activeTab, setActiveTab] = useState<OverviewTab>('goals');

  return (
    <section
      aria-labelledby="card-goals-projects-title"
      className={`rounded-[26px] border p-5 sm:p-6 flex flex-col justify-between ${cardSurfaceClass}`}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              id="card-goals-projects-title"
              className="text-base sm:text-lg font-semibold text-[#F5F7F2]"
            >
              Goals, Projects &amp; Deadlines
            </h2>
            <p className="text-xs text-[#8CA195]">
              Sample workspace milestones · Linked modules preview
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Goals and projects view"
            className="inline-flex items-center gap-1 p-1 rounded-full bg-[#07110C] border border-[#1C3828]"
          >
            {(
              [
                ['goals', 'Goals'],
                ['projects', 'Projects'],
                ['commitments', 'Upcoming'],
              ] as const
            ).map(([tabId, label]) => {
              const selected = activeTab === tabId;
              return (
                <button
                  key={tabId}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tabId)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#6BFF9C] text-[#050C08] font-semibold'
                      : 'text-[#8CA195] hover:text-[#F5F7F2]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="mt-4 space-y-3">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="rounded-2xl bg-[#07120C]/90 border border-[#1B3A29] p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Target
                      size={15}
                      className="text-[#6BFF9C] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-[#F5F7F2] truncate">
                        {goal.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#8CA195]">
                        Milestone: {goal.currentMilestone}
                        {goal.targetDate ? ` · Target ${goal.targetDate}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold tabular-nums text-[#C5FF62] shrink-0">
                    {goal.progress}%
                  </span>
                </div>

                <div className="mt-2.5 h-1.5 rounded-full bg-[#132A1E] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      goal.status === 'needs-attention'
                        ? 'bg-[#FFB86B]'
                        : 'bg-[#3DF58B]'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      goal.status === 'needs-attention'
                        ? 'text-[#FFB86B]'
                        : 'text-[#6BFF9C]'
                    }`}
                  >
                    {goal.status === 'needs-attention' ? (
                      <AlertCircle size={12} aria-hidden="true" />
                    ) : (
                      <CheckCircle2 size={12} aria-hidden="true" />
                    )}
                    <span>
                      {goal.status === 'ahead'
                        ? 'Ahead of pace'
                        : goal.status === 'needs-attention'
                        ? 'Needs attention'
                        : 'On track'}
                    </span>
                  </span>
                  <span className="text-[#7A8D81]">Sample goal</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="mt-4 space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl bg-[#07120C]/90 border border-[#1B3A29] p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <FolderKanban
                      size={15}
                      className="text-[#C5FF62] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-[#F5F7F2] truncate">
                        {project.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#8CA195]">
                        Next: {project.nextMilestone}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#C5FF62] shrink-0">
                    {project.stage}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      project.health === 'review-needed'
                        ? 'text-[#FFB86B]'
                        : 'text-[#6BFF9C]'
                    }`}
                  >
                    {project.health === 'review-needed' ? (
                      <AlertCircle size={12} aria-hidden="true" />
                    ) : (
                      <CheckCircle2 size={12} aria-hidden="true" />
                    )}
                    <span>
                      {project.health === 'review-needed'
                        ? 'Review needed'
                        : project.health === 'on-schedule'
                        ? 'On schedule'
                        : 'Active build'}
                    </span>
                  </span>
                  {project.deadline && (
                    <span className="font-mono text-[#8CA195]">
                      Due {project.deadline}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Commitments Tab */}
        {activeTab === 'commitments' && (
          <div className="mt-4 space-y-2.5">
            {commitments.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateEntry(item.moduleId)}
                className="w-full text-left rounded-2xl bg-[#07120C]/90 border border-[#1B3A29] hover:border-[#6BFF9C]/45 p-3.5 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <CalendarClock
                      size={15}
                      className={
                        item.urgency === 'urgent'
                          ? 'text-[#FFB86B] shrink-0 mt-0.5'
                          : 'text-[#6BFF9C] shrink-0 mt-0.5'
                      }
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#F5F7F2] truncate">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[#8CA195]">
                        {item.moduleName} · {item.statusLabel}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-[#C5FF62] shrink-0">
                    {item.dateLabel}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigateEntry('goal-planner')}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#6BFF9C] hover:underline cursor-pointer"
        >
          <span>Goal Planner</span>
          <ArrowRight size={12} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onNavigateEntry('project-planner')}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#C5FF62] hover:underline cursor-pointer"
        >
          <span>Project Planner</span>
          <ArrowRight size={12} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
