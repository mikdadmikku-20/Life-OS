import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowUp,
  Check,
  Clock,
  Minus,
  Plus,
} from 'lucide-react';
import { AdminModuleId, TaskPriority, WorkspaceTask } from '../../../types/workspace';

interface PrioritiesWidgetProps {
  tasks: WorkspaceTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (payload: {
    title: string;
    priority: TaskPriority;
    dueTime?: string;
    associatedContext?: string;
  }) => void;
  onNavigateModule: (id: AdminModuleId) => void;
}

const PRIORITY_CONFIG: Record<
  TaskPriority,
  {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    textClass: string;
  }
> = {
  high: {
    label: 'High priority',
    icon: ArrowUp,
    textClass: 'text-[#C5FF62]',
  },
  medium: {
    label: 'Medium priority',
    icon: AlertCircle,
    textClass: 'text-[#F5F6F2]',
  },
  standard: {
    label: 'Standard',
    icon: Minus,
    textClass: 'text-[#A0A39A]',
  },
};

export const PrioritiesWidget: React.FC<PrioritiesWidgetProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onNavigateModule,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [dueTime, setDueTime] = useState('');
  const [context, setContext] = useState('');

  const visibleTasks = showAll ? tasks : tasks.slice(0, 5);
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title,
      priority,
      dueTime,
      associatedContext: context,
    });
    setTitle('');
    setDueTime('');
    setContext('');
    setShowAddForm(false);
  };

  return (
    <section
      aria-labelledby="widget-priorities-title"
      className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#272A26]">
          <div>
            <h2
              id="widget-priorities-title"
              className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F6F2]"
            >
              Today&apos;s Priorities
            </h2>
            <p className="mt-0.5 text-xs text-[#A0A39A]">
              <span className="font-mono tabular-nums text-[#F5F6F2]">
                {completedCount}/{tasks.length}
              </span>{' '}
              completed · Sample &amp; local session tasks
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 rounded-full bg-[#C5FF62] text-[#090A09] text-xs font-semibold hover:bg-[#D5FF8D] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus size={14} aria-hidden="true" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-4 rounded-2xl bg-[#101110] border border-[#2D312C] p-4 space-y-3"
          >
            <div>
              <label
                htmlFor="new-priority-title"
                className="block text-xs font-medium text-[#A0A39A] mb-1"
              >
                Task title
              </label>
              <input
                id="new-priority-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs focused progress today?"
                className="w-full h-9 px-3 rounded-lg bg-[#17181D] border border-[#2D312C] focus:border-[#C5FF62] focus:outline-none text-sm text-[#F5F6F2]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label
                  htmlFor="new-priority-level"
                  className="block text-xs font-medium text-[#A0A39A] mb-1"
                >
                  Priority
                </label>
                <select
                  id="new-priority-level"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full h-9 px-2.5 rounded-lg bg-[#17181D] border border-[#2D312C] focus:border-[#C5FF62] focus:outline-none text-xs text-[#F5F6F2]"
                >
                  <option value="high">High priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="new-priority-time"
                  className="block text-xs font-medium text-[#A0A39A] mb-1"
                >
                  Due time (optional)
                </label>
                <input
                  id="new-priority-time"
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="e.g. 16:30"
                  className="w-full h-9 px-3 rounded-lg bg-[#17181D] border border-[#2D312C] focus:border-[#C5FF62] focus:outline-none text-xs text-[#F5F6F2]"
                />
              </div>
              <div>
                <label
                  htmlFor="new-priority-context"
                  className="block text-xs font-medium text-[#A0A39A] mb-1"
                >
                  Project / Goal (optional)
                </label>
                <input
                  id="new-priority-context"
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Project Planner"
                  className="w-full h-9 px-3 rounded-lg bg-[#17181D] border border-[#2D312C] focus:border-[#C5FF62] focus:outline-none text-xs text-[#F5F6F2]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-[#A0A39A]">
                Saves to temporary local session state
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-full text-xs text-[#A0A39A] hover:text-[#F5F6F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-full bg-[#C5FF62] text-[#090A09] text-xs font-semibold hover:bg-[#D5FF8D] cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </div>
          </form>
        )}

        {visibleTasks.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-[#A0A39A]">
              No daily priorities added yet.
            </p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-3 px-4 py-2 rounded-full bg-[#222329] text-xs font-medium text-[#C5FF62] hover:bg-[#2A2D35] cursor-pointer"
            >
              Add First Priority
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-[#272A26] mt-1">
            {visibleTasks.map((task) => {
              const prio = PRIORITY_CONFIG[task.priority];
              const PrioIcon = prio.icon;
              return (
                <li
                  key={task.id}
                  className="py-3.5 first:pt-3 last:pb-1 flex items-start gap-3.5 group"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={task.completed}
                    aria-label={`Mark "${task.title}" as ${
                      task.completed ? 'incomplete' : 'complete'
                    }`}
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      task.completed
                        ? 'bg-[#C5FF62] border-[#C5FF62] text-[#090A09]'
                        : 'bg-[#101110] border-[#3B4039] group-hover:border-[#C5FF62]/60 text-transparent'
                    }`}
                  >
                    <Check size={13} strokeWidth={2.75} aria-hidden="true" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug transition-colors ${
                        task.completed
                          ? 'line-through text-[#A0A39A]/70'
                          : 'text-[#F5F6F2] font-medium'
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#A0A39A]">
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${prio.textClass}`}
                      >
                        <PrioIcon size={12} aria-hidden="true" />
                        <span>{prio.label}</span>
                      </span>

                      {task.dueTime && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 font-mono tabular-nums text-[#F5F6F2]/85">
                            <Clock size={11} aria-hidden="true" />
                            <span>Due {task.dueTime}</span>
                          </span>
                        </>
                      )}

                      {task.associatedContext && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{task.associatedContext}</span>
                        </>
                      )}

                      {task.source === 'local' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#C5FF62]">Added this session</span>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#272A26] flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="font-medium text-[#A0A39A] hover:text-[#F5F6F2] transition-colors cursor-pointer"
        >
          {showAll
            ? 'Show top 5 priorities'
            : `View All Tasks (${tasks.length})`}
        </button>

        <button
          type="button"
          onClick={() => onNavigateModule('project-planner')}
          className="font-medium text-[#C5FF62] hover:underline cursor-pointer"
        >
          Open Project Planner
        </button>
      </div>
    </section>
  );
};
