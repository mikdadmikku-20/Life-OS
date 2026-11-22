import React from 'react';
import { AssistantExchange } from '../../hooks/useWorkspaceState';
import {
  AdminModuleId,
  AiDailyBriefing,
  CapturedEntry,
  CaptureItemType,
  DashboardLayoutPreferences,
  DashboardWidgetId,
  LifeProgressArea,
  ScheduleEvent,
  TaskPriority,
  UpcomingCommitment,
  WorkspaceGoal,
  WorkspaceProject,
  WorkspaceTask,
} from '../../types/workspace';
import { ContextualAiPanel } from './ContextualAiPanel';
import { WelcomeHeader } from './WelcomeHeader';
import { AiBriefingWidget } from './widgets/AiBriefingWidget';
import { CommitmentsWidget } from './widgets/CommitmentsWidget';
import { GoalsWidget } from './widgets/GoalsWidget';
import { LifeProgressWidget } from './widgets/LifeProgressWidget';
import { PrioritiesWidget } from './widgets/PrioritiesWidget';
import { ProjectsWidget } from './widgets/ProjectsWidget';
import { QuickCaptureWidget } from './widgets/QuickCaptureWidget';
import { ScheduleWidget } from './widgets/ScheduleWidget';

interface DashboardHomeViewProps {
  dailyIntention: string;
  onUpdateIntention: (value: string) => void;
  tasks: WorkspaceTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (payload: {
    title: string;
    priority: TaskPriority;
    dueTime?: string;
    associatedContext?: string;
  }) => void;
  schedule: ScheduleEvent[];
  goals: WorkspaceGoal[];
  projects: WorkspaceProject[];
  lifeProgress: LifeProgressArea[];
  commitments: UpcomingCommitment[];
  capturedItems: CapturedEntry[];
  onCaptureItem: (payload: {
    text: string;
    type: CaptureItemType;
    destinationModuleId: AdminModuleId | 'universal-capture-inbox';
  }) => void;
  briefing: AiDailyBriefing;
  onRefreshBriefing: () => void;
  onApproveAdjustment: () => void;
  onDismissAdjustment: () => void;
  assistantHistory: AssistantExchange[];
  onRunAssistantPrompt: (prompt: string) => void;
  layoutPreferences: DashboardLayoutPreferences;
  onOpenCustomize: () => void;
  onRestoreDefaults: () => void;
  onNavigateModule: (id: AdminModuleId) => void;
  quickCaptureInputRef: React.RefObject<HTMLInputElement | null>;
  contextualAiInputRef: React.RefObject<HTMLInputElement | null>;
}

const WIDGET_GRID_SPANS: Record<DashboardWidgetId, string> = {
  priorities: 'md:col-span-3 xl:col-span-6',
  schedule: 'md:col-span-3 xl:col-span-6',
  'ai-briefing': 'md:col-span-6 xl:col-span-12',
  goals: 'md:col-span-3 xl:col-span-4',
  projects: 'md:col-span-3 xl:col-span-4',
  'life-progress': 'md:col-span-3 xl:col-span-4',
  commitments: 'md:col-span-3 xl:col-span-5',
  'quick-capture': 'md:col-span-6 xl:col-span-7',
  'contextual-ai': 'md:col-span-6 xl:col-span-12',
};

export const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({
  dailyIntention,
  onUpdateIntention,
  tasks,
  onToggleTask,
  onAddTask,
  schedule,
  goals,
  projects,
  lifeProgress,
  commitments,
  capturedItems,
  onCaptureItem,
  briefing,
  onRefreshBriefing,
  onApproveAdjustment,
  onDismissAdjustment,
  assistantHistory,
  onRunAssistantPrompt,
  layoutPreferences,
  onOpenCustomize,
  onRestoreDefaults,
  onNavigateModule,
  quickCaptureInputRef,
  contextualAiInputRef,
}) => {
  const pendingTaskCount = tasks.filter((t) => !t.completed).length;

  const visibleWidgets = layoutPreferences.widgetOrder.filter(
    (id) => !layoutPreferences.hiddenWidgets.includes(id)
  );

  const renderWidget = (widgetId: DashboardWidgetId) => {
    switch (widgetId) {
      case 'priorities':
        return (
          <PrioritiesWidget
            tasks={tasks}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            onNavigateModule={onNavigateModule}
          />
        );
      case 'schedule':
        return (
          <ScheduleWidget
            events={schedule}
            onNavigateModule={onNavigateModule}
          />
        );
      case 'ai-briefing':
        return (
          <AiBriefingWidget
            briefing={briefing}
            onRefresh={onRefreshBriefing}
            onApproveAdjustment={onApproveAdjustment}
            onDismissAdjustment={onDismissAdjustment}
          />
        );
      case 'goals':
        return (
          <GoalsWidget
            goals={goals}
            onNavigateModule={onNavigateModule}
          />
        );
      case 'projects':
        return (
          <ProjectsWidget
            projects={projects}
            onNavigateModule={onNavigateModule}
          />
        );
      case 'life-progress':
        return (
          <LifeProgressWidget
            areas={lifeProgress}
            onNavigateModule={onNavigateModule}
          />
        );
      case 'commitments':
        return (
          <CommitmentsWidget
            commitments={commitments}
            onNavigateModule={onNavigateModule}
          />
        );
      case 'quick-capture':
        return (
          <QuickCaptureWidget
            inputRef={quickCaptureInputRef}
            capturedItems={capturedItems}
            onCapture={onCaptureItem}
          />
        );
      case 'contextual-ai':
        return (
          <ContextualAiPanel
            inputRef={contextualAiInputRef}
            history={assistantHistory}
            onRunPrompt={onRunAssistantPrompt}
            onOpenFullModule={onNavigateModule}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <WelcomeHeader
        dailyIntention={dailyIntention}
        onUpdateIntention={onUpdateIntention}
        pendingTaskCount={pendingTaskCount}
        totalTaskCount={tasks.length}
        upcomingCommitmentCount={commitments.length}
        onOpenCustomize={onOpenCustomize}
      />

      {visibleWidgets.length === 0 ? (
        <div className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-10 text-center">
          <h2 className="text-lg font-semibold text-[#F5F6F2]">
            All dashboard widgets are currently hidden
          </h2>
          <p className="mt-2 text-sm text-[#A0A39A]">
            Use Customize Dashboard to show widgets or restore the default workspace layout.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenCustomize}
              className="min-h-[40px] px-4 py-2 rounded-full bg-[#222329] border border-[#34382F] text-xs font-medium text-[#F5F6F2] hover:border-[#C5FF62]/50 cursor-pointer"
            >
              Customize Dashboard
            </button>
            <button
              type="button"
              onClick={onRestoreDefaults}
              className="min-h-[40px] px-4 py-2 rounded-full bg-[#C5FF62] text-[#090A09] text-xs font-semibold hover:bg-[#D5FF8D] cursor-pointer"
            >
              Restore Default Layout
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-12 gap-5 items-stretch">
          {visibleWidgets.map((widgetId) => (
            <div
              key={widgetId}
              className={`${WIDGET_GRID_SPANS[widgetId]} flex flex-col [&>*]:flex-1`}
            >
              {renderWidget(widgetId)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
