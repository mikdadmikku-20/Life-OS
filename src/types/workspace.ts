export type ModuleCategoryId =
  | 'overview'
  | 'plan-execute'
  | 'career-opportunities'
  | 'learn-create'
  | 'health-growth'
  | 'knowledge-research'
  | 'insights-ai'
  | 'settings';

export type AdminModuleId =
  | 'dashboard-daily-reflection'
  | 'daily-schedule-tracker-planner'
  | 'career-future-planner'
  | 'health-fitness-planner'
  | 'programs-opportunities-explorer'
  | 'outreach-planner'
  | 'ideas-business-planner'
  | 'skill-planner'
  | 'reading-tracker'
  | 'news-information'
  | 'goal-planner'
  | 'social-character-planner'
  | 'personal-character-planner'
  | 'social-media-planner'
  | 'social-skills-planner'
  | 'quran-sunnah-planner'
  | 'talent-planner'
  | 'study-planner'
  | 'project-planner'
  | 'event-purchase-planner'
  | 'progress-analytics'
  | 'ai-assistant'
  | 'settings-personalization';

export interface AdminModuleDefinition {
  id: AdminModuleId;
  number: number;
  name: string;
  categoryId: ModuleCategoryId;
  iconName: string;
  shortDescription: string;
  plannedCapabilities: string[];
  isImplemented: boolean;
}

export interface ModuleCategoryGroup {
  id: ModuleCategoryId;
  label: string;
  defaultOpen?: boolean;
}

export type SharedCapabilityGroupId =
  | 'capture-resources-knowledge'
  | 'command-planning-decisions'
  | 'execution-learning-improvement'
  | 'shared-interface-extensibility';

export interface SharedCapabilityDefinition {
  id: string;
  name: string;
  groupId: SharedCapabilityGroupId;
  groupLabel: string;
  summary: string;
  connectedModules: AdminModuleId[];
}

export type TaskPriority = 'high' | 'medium' | 'standard';

export interface WorkspaceTask {
  id: string;
  title: string;
  priority: TaskPriority;
  dueTime?: string;
  completed: boolean;
  associatedContext?: string;
  source: 'demo' | 'local';
}

export type ScheduleStatus = 'completed' | 'in-progress' | 'upcoming' | 'conflict';

export interface ScheduleEvent {
  id: string;
  startTime: string;
  endTime: string;
  durationLabel: string;
  title: string;
  moduleContext?: string;
  status: ScheduleStatus;
  startMinutes: number;
  endMinutes: number;
  source: 'demo' | 'local';
}

export type GoalStatus = 'on-track' | 'needs-attention' | 'ahead';

export interface WorkspaceGoal {
  id: string;
  title: string;
  progress: number;
  currentMilestone: string;
  targetDate?: string;
  status: GoalStatus;
  source: 'demo';
}

export type ProjectHealth = 'active' | 'review-needed' | 'on-schedule';

export interface WorkspaceProject {
  id: string;
  name: string;
  stage: string;
  nextMilestone: string;
  deadline?: string;
  health: ProjectHealth;
  source: 'demo';
}

export interface LifeProgressArea {
  id: string;
  label: string;
  percentage: number;
  summaryMetric: string;
  moduleId: AdminModuleId;
  source: 'demo';
}

export type CommitmentUrgency = 'urgent' | 'soon' | 'scheduled';

export interface UpcomingCommitment {
  id: string;
  title: string;
  dateLabel: string;
  moduleId: AdminModuleId;
  moduleName: string;
  urgency: CommitmentUrgency;
  statusLabel: string;
  source: 'demo';
}

export type CaptureItemType = 'task' | 'idea' | 'note' | 'opportunity' | 'reminder';

export interface CapturedEntry {
  id: string;
  text: string;
  type: CaptureItemType;
  destinationLabel: string;
  destinationModuleId: AdminModuleId | 'universal-capture-inbox';
  createdAtLabel: string;
  promotedToTasks?: boolean;
}

export interface AiBriefingAdjustment {
  id: string;
  summary: string;
  beforeState: string;
  afterState: string;
  rationale: string;
  targetScheduleId?: string;
  targetTaskId?: string;
  applied: boolean;
  dismissed: boolean;
}

export interface AiDailyBriefing {
  generatedAtLabel: string;
  basisNote: string;
  whatMatters: {
    summary: string;
    basis: string;
  };
  potentialConflicts: {
    summary: string;
    basis: string;
    hasConflict: boolean;
  };
  recommendedNextAction: {
    summary: string;
    basis: string;
  };
  suggestedAdjustment: AiBriefingAdjustment | null;
}

export interface WorkspaceNotification {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  category: 'deadline' | 'conflict' | 'system';
  read: boolean;
  source: 'demo';
}

export type DashboardWidgetId =
  | 'priorities'
  | 'schedule'
  | 'ai-briefing'
  | 'goals'
  | 'projects'
  | 'life-progress'
  | 'commitments'
  | 'quick-capture'
  | 'contextual-ai';

export interface DashboardLayoutPreferences {
  hiddenWidgets: DashboardWidgetId[];
  widgetOrder: DashboardWidgetId[];
}
