import React, { useState } from 'react';
import { ArrowRight, Check, Pause, Play, RotateCcw } from 'lucide-react';
import { AppSidebarEntryId } from '../../../types/appHome';
import { WorkspaceTask } from '../../../types/workspace';

interface MainTaskCardProps {
  task: WorkspaceTask | undefined;
  tasks: WorkspaceTask[];
  onToggleTask: (id: string) => void;
  focusRunning: boolean;
  onToggleFocus: () => void;
  focusSecondsLeft: number;
  onResetFocus: () => void;
  onNavigateEntry: (id: AppSidebarEntryId) => void;
  cardSurfaceClass: string;
}

export const MainTaskCard: React.FC<MainTaskCardProps> = ({
  task,
  tasks,
  onToggleTask,
  focusRunning,
  onToggleFocus,
  focusSecondsLeft,
  onResetFocus,
  onNavigateEntry,
  cardSurfaceClass,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pct =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const mins = Math.floor(focusSecondsLeft / 60);
  const secs = focusSecondsLeft % 60;
  const timeDisplay = `${String(mins).padStart(2, '0')}:${String(secs).padStart(
    2,
    '0'
  )}`;

  // SVG circular gauge geometry
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.78; // Open bottom arc like Image 1 Main Task ring
  const totalArc = circumference * arcFraction;
  const filledArc = totalArc * Math.max(0.15, pct / 100);

  return (
    <section
      aria-labelledby="card-main-task-title"
      className={`rounded-[26px] border p-5 sm:p-6 flex flex-col justify-between ${cardSurfaceClass}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2
              id="card-main-task-title"
              className="text-base font-semibold text-[#F5F7F2]"
            >
              Main Task
            </h2>
            <p className="text-[11px] text-[#8CA195]">
              Priority focus · Sample/session task
            </p>
          </div>
          {task && (
            <button
              type="button"
              onClick={() => onToggleTask(task.id)}
              aria-label={`Mark "${task.title}" ${
                task.completed ? 'incomplete' : 'complete'
              }`}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium cursor-pointer transition-colors ${
                task.completed
                  ? 'bg-[#6BFF9C] border-[#6BFF9C] text-[#050C08]'
                  : 'bg-[#0E1E16] border-[#214231] text-[#A1B0A6] hover:text-[#F5F7F2]'
              }`}
            >
              <Check size={12} aria-hidden="true" />
              <span>{task.completed ? 'Done' : 'Complete'}</span>
            </button>
          )}
        </div>

        {/* Circular Arc Gauge (Inspired by Image 1 Main Task Ring) */}
        <div className="mt-3 flex flex-col items-center">
          <div className="relative w-[132px] h-[118px] flex items-center justify-center">
            <svg
              viewBox="0 0 130 130"
              className="w-full h-full rotate-[130deg]"
              aria-hidden="true"
            >
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="#132A1E"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${totalArc} ${circumference}`}
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke={focusRunning ? '#C5FF62' : '#3DF58B'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${filledArc} ${circumference}`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
              <span className="font-mono text-2xl font-bold tabular-nums text-[#F5F7F2]">
                {timeDisplay}
              </span>
              <span className="text-[11px] text-[#6BFF9C]">
                {focusRunning ? 'Focus active' : `${pct}% priorities`}
              </span>
            </div>
          </div>

          <p className="mt-1 text-center text-xs sm:text-sm font-medium text-[#F5F7F2] line-clamp-2">
            {task ? task.title : 'No priority tasks remaining'}
          </p>
        </div>
      </div>

      {/* Actions: Start Focus, Details, Schedule Route */}
      <div className="mt-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFocus}
            className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[38px] px-4 py-2 rounded-full bg-[#3DF58B] text-[#05100A] text-xs font-semibold hover:bg-[#6BFF9C] transition-colors cursor-pointer"
          >
            {focusRunning ? (
              <>
                <Pause size={13} aria-hidden="true" />
                <span>Pause Focus</span>
              </>
            ) : (
              <>
                <Play size={13} aria-hidden="true" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onResetFocus}
            aria-label="Reset 45-minute focus timer"
            title="Reset timer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0E1E16] border border-[#214231] text-[#A1B0A6] hover:text-[#F5F7F2] cursor-pointer shrink-0"
          >
            <RotateCcw size={13} />
          </button>

          <button
            type="button"
            onClick={() => setDetailsOpen((d) => !d)}
            aria-expanded={detailsOpen}
            className="min-h-[38px] px-3.5 py-2 rounded-full bg-[#0E1E16] border border-[#214231] text-xs font-medium text-[#F5F7F2] hover:border-[#6BFF9C]/55 cursor-pointer"
          >
            Details
          </button>
        </div>

        {detailsOpen && task && (
          <div className="rounded-xl bg-[#07110C] border border-[#1E3B2B] p-3 text-xs space-y-1">
            <p className="text-[#F5F7F2] font-medium">{task.title}</p>
            <p className="text-[#8CA195]">
              Context: {task.associatedContext ?? 'Daily Focus'} ·{' '}
              {task.dueTime ? `Due ${task.dueTime}` : '45m estimated focus'}
            </p>
            <button
              type="button"
              onClick={() => onNavigateEntry('daily-schedule-tracker-planner')}
              className="inline-flex items-center gap-1 pt-1 text-[#6BFF9C] font-medium hover:underline cursor-pointer"
            >
              <span>Route to Daily Schedule Tracker</span>
              <ArrowRight size={12} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
