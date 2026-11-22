import {
  AiDailyBriefing,
  DashboardLayoutPreferences,
  DashboardWidgetId,
  LifeProgressArea,
  ScheduleEvent,
  UpcomingCommitment,
  WorkspaceGoal,
  WorkspaceNotification,
  WorkspaceProject,
  WorkspaceTask,
} from '../types/workspace';

export const DEFAULT_WIDGET_ORDER: DashboardWidgetId[] = [
  'priorities',
  'schedule',
  'ai-briefing',
  'goals',
  'projects',
  'life-progress',
  'commitments',
  'quick-capture',
  'contextual-ai',
];

export const WIDGET_METADATA: Record<
  DashboardWidgetId,
  { title: string; description: string }
> = {
  priorities: {
    title: "Today's Priorities",
    description: 'Top daily tasks with priority levels, deadlines, and completion state.',
  },
  schedule: {
    title: "Today's Schedule",
    description: 'Compact timeline of today’s planned time blocks and current-time marker.',
  },
  'ai-briefing': {
    title: 'AI Daily Briefing',
    description: 'Structured synthesis of focus, conflicts, next step, and user-approved adjustments.',
  },
  goals: {
    title: 'Goals at a Glance',
    description: 'Up to three active goals with current milestones and target dates.',
  },
  projects: {
    title: 'Active Projects',
    description: 'Current stage, next milestone, and upcoming deadlines across projects.',
  },
  'life-progress': {
    title: 'Life Progress Snapshot',
    description: 'Multi-area progress bars without reducing your life to a single number.',
  },
  commitments: {
    title: 'Upcoming Commitments',
    description: 'Deadlines, applications, and events surfaced across modules.',
  },
  'quick-capture': {
    title: 'Quick Capture',
    description: 'Fast intake for ideas, tasks, notes, opportunities, and reminders.',
  },
  'contextual-ai': {
    title: 'Contextual AI Assistant',
    description: 'Workspace-integrated prompt suggestions and demonstration guidance.',
  },
};

export const DEFAULT_LAYOUT_PREFERENCES: DashboardLayoutPreferences = {
  hiddenWidgets: [],
  widgetOrder: DEFAULT_WIDGET_ORDER,
};

export const INITIAL_DEMO_INTENTION =
  'Protect uninterrupted morning focus on milestone deliverables before reviewing external applications.';

export const DEMO_TASKS: WorkspaceTask[] = [
  {
    id: 'task-1',
    title: 'Finalize Phase 2 architecture notes for Portfolio Case Study',
    priority: 'high',
    dueTime: '11:30',
    completed: false,
    associatedContext: 'Project Planner · Portfolio Redesign',
    source: 'demo',
  },
  {
    id: 'task-2',
    title: 'Draft fellowship personal statement outline (Section 2)',
    priority: 'high',
    dueTime: '16:00',
    completed: false,
    associatedContext: 'Programs & Opportunities Explorer',
    source: 'demo',
  },
  {
    id: 'task-3',
    title: 'Complete 45-min System Design spaced-repetition review',
    priority: 'medium',
    dueTime: '14:30',
    completed: true,
    associatedContext: 'Study Planner · Core Engineering',
    source: 'demo',
  },
  {
    id: 'task-4',
    title: 'Send follow-up note to mentor regarding product feedback',
    priority: 'medium',
    dueTime: '17:30',
    completed: false,
    associatedContext: 'Outreach Planner',
    source: 'demo',
  },
  {
    id: 'task-5',
    title: 'Evening 30-min mobility & strength session',
    priority: 'standard',
    dueTime: '19:00',
    completed: false,
    associatedContext: 'Health & Fitness Planner',
    source: 'demo',
  },
];

export const DEMO_SCHEDULE: ScheduleEvent[] = [
  {
    id: 'evt-1',
    startTime: '08:30',
    endTime: '09:30',
    durationLabel: '60m',
    title: 'Morning Reflection, Quran Reading & Daily Review',
    moduleContext: 'Quran & Sunnah Planner',
    status: 'completed',
    startMinutes: 8 * 60 + 30,
    endMinutes: 9 * 60 + 30,
    source: 'demo',
  },
  {
    id: 'evt-2',
    startTime: '10:00',
    endTime: '12:00',
    durationLabel: '2h',
    title: 'Deep Work: Portfolio Case Study Architecture',
    moduleContext: 'Project Planner',
    status: 'completed',
    startMinutes: 10 * 60,
    endMinutes: 12 * 60,
    source: 'demo',
  },
  {
    id: 'evt-3',
    startTime: '13:30',
    endTime: '15:00',
    durationLabel: '90m',
    title: 'System Design Study Block & Notes Synthesis',
    moduleContext: 'Study Planner',
    status: 'completed',
    startMinutes: 13 * 60 + 30,
    endMinutes: 15 * 60,
    source: 'demo',
  },
  {
    id: 'evt-4',
    startTime: '15:30',
    endTime: '17:15',
    durationLabel: '1h 45m',
    title: 'Fellowship Application Draft & Evidence Check',
    moduleContext: 'Programs & Opportunities Explorer',
    status: 'in-progress',
    startMinutes: 15 * 60 + 30,
    endMinutes: 17 * 60 + 15,
    source: 'demo',
  },
  {
    id: 'evt-5',
    startTime: '17:00',
    endTime: '17:45',
    durationLabel: '45m',
    title: 'Mentor Outreach & Weekly Follow-up Queue',
    moduleContext: 'Outreach Planner',
    status: 'conflict',
    startMinutes: 17 * 60,
    endMinutes: 17 * 60 + 45,
    source: 'demo',
  },
  {
    id: 'evt-6',
    startTime: '19:00',
    endTime: '19:45',
    durationLabel: '45m',
    title: 'Strength & Mobility Training Session',
    moduleContext: 'Health & Fitness Planner',
    status: 'upcoming',
    startMinutes: 19 * 60,
    endMinutes: 19 * 60 + 45,
    source: 'demo',
  },
];

export const DEMO_GOALS: WorkspaceGoal[] = [
  {
    id: 'goal-1',
    title: 'Ship Public Technical Portfolio & Case Studies',
    progress: 68,
    currentMilestone: 'Complete architecture & outcomes write-up (2 of 3)',
    targetDate: 'Nov 30',
    status: 'on-track',
    source: 'demo',
  },
  {
    id: 'goal-2',
    title: 'Complete Q4 Distributed Systems Study Track',
    progress: 54,
    currentMilestone: 'Finish Module 4 consensus & replication notes',
    targetDate: 'Dec 15',
    status: 'needs-attention',
    source: 'demo',
  },
  {
    id: 'goal-3',
    title: 'Maintain 4x Weekly Strength & Recovery Routine',
    progress: 80,
    currentMilestone: 'Week 6 of 8 consistent sessions logged',
    targetDate: 'Dec 01',
    status: 'ahead',
    source: 'demo',
  },
];

export const DEMO_PROJECTS: WorkspaceProject[] = [
  {
    id: 'proj-1',
    name: 'Technical Portfolio v2',
    stage: 'Drafting Case Studies',
    nextMilestone: 'Publish Interactive Systems Breakdown',
    deadline: 'Nov 22',
    health: 'on-schedule',
    source: 'demo',
  },
  {
    id: 'proj-2',
    name: '2027 Fellowship Application',
    stage: 'Essay & References',
    nextMilestone: 'Request advisor endorsement letter',
    deadline: 'Nov 18',
    health: 'review-needed',
    source: 'demo',
  },
  {
    id: 'proj-3',
    name: 'Personal Knowledge Taxonomy',
    stage: 'Active Structuring',
    nextMilestone: 'Tag 12 recent reading takeaways',
    deadline: 'Nov 28',
    health: 'active',
    source: 'demo',
  },
];

export const DEMO_LIFE_PROGRESS: LifeProgressArea[] = [
  {
    id: 'area-goals',
    label: 'Goals',
    percentage: 67,
    summaryMetric: '2 of 3 on track',
    moduleId: 'goal-planner',
    source: 'demo',
  },
  {
    id: 'area-study',
    label: 'Study & skills',
    percentage: 58,
    summaryMetric: '4.5h / 7h weekly',
    moduleId: 'study-planner',
    source: 'demo',
  },
  {
    id: 'area-health',
    label: 'Health & fitness',
    percentage: 80,
    summaryMetric: '4 / 5 sessions',
    moduleId: 'health-fitness-planner',
    source: 'demo',
  },
  {
    id: 'area-projects',
    label: 'Projects',
    percentage: 62,
    summaryMetric: '3 active builds',
    moduleId: 'project-planner',
    source: 'demo',
  },
  {
    id: 'area-habits',
    label: 'Habits & commitments',
    percentage: 78,
    summaryMetric: '11 / 14 check-ins',
    moduleId: 'personal-character-planner',
    source: 'demo',
  },
];

export const DEMO_COMMITMENTS: UpcomingCommitment[] = [
  {
    id: 'comm-1',
    title: 'Fellowship Statement & Reference Submission',
    dateLabel: 'Nov 18 · 18:00',
    moduleId: 'programs-opportunities-explorer',
    moduleName: 'Programs & Opportunities Explorer',
    urgency: 'urgent',
    statusLabel: 'Due in 5 days',
    source: 'demo',
  },
  {
    id: 'comm-2',
    title: 'Mentor Product Review Call Prep',
    dateLabel: 'Nov 15 · 10:00',
    moduleId: 'outreach-planner',
    moduleName: 'Outreach Planner',
    urgency: 'soon',
    statusLabel: 'Action needed',
    source: 'demo',
  },
  {
    id: 'comm-3',
    title: 'Systems Architecture Study Assessment',
    dateLabel: 'Nov 21 · All day',
    moduleId: 'study-planner',
    moduleName: 'Study Planner',
    urgency: 'scheduled',
    statusLabel: 'Scheduled',
    source: 'demo',
  },
  {
    id: 'comm-4',
    title: 'Quarterly Laptop & Desk Hardware Upgrade Review',
    dateLabel: 'Nov 25',
    moduleId: 'event-purchase-planner',
    moduleName: 'Event & Purchase Planner',
    urgency: 'scheduled',
    statusLabel: 'Planned',
    source: 'demo',
  },
];

export const DEMO_NOTIFICATIONS: WorkspaceNotification[] = [
  {
    id: 'notif-1',
    title: 'Schedule overlap flagged in sample timeline',
    detail: 'Fellowship Draft (15:30–17:15) overlaps Mentor Outreach (17:00–17:45) by 15 minutes.',
    timeLabel: 'Sample alert',
    category: 'conflict',
    read: false,
    source: 'demo',
  },
  {
    id: 'notif-2',
    title: 'Approaching fellowship milestone',
    detail: '2027 Fellowship Application advisor letter milestone is 5 days away (Nov 18).',
    timeLabel: 'Sample deadline',
    category: 'deadline',
    read: false,
    source: 'demo',
  },
  {
    id: 'notif-3',
    title: 'Development preview mode active',
    detail: 'Changes made in Quick Capture, Priorities, and Layout persist only in local browser memory/storage.',
    timeLabel: 'Workspace notice',
    category: 'system',
    read: true,
    source: 'demo',
  },
];

/**
 * Computes a transparent, deterministic demonstration briefing from current local state.
 * Does not claim to invoke a live LLM backend.
 */
export function buildDemoBriefing(
  tasks: WorkspaceTask[],
  schedule: ScheduleEvent[],
  adjustmentApplied: boolean,
  adjustmentDismissed: boolean
): AiDailyBriefing {
  const pendingHigh = tasks.filter((t) => !t.completed && t.priority === 'high');
  const pendingAll = tasks.filter((t) => !t.completed);
  const completedCount = tasks.filter((t) => t.completed).length;

  const overlappingEvent = schedule.find((e) => e.status === 'conflict');

  const topTask = pendingHigh[0] || pendingAll[0];

  const nowTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    generatedAtLabel: nowTime,
    basisNote: `Computed locally from ${tasks.length} sample/local tasks and ${schedule.length} schedule blocks.`,
    whatMatters: {
      summary:
        pendingHigh.length > 0
          ? `${pendingHigh.length} high-priority deliverables remain today, led by "${pendingHigh[0].title}".`
          : pendingAll.length > 0
          ? `All high-priority sample items are cleared. ${pendingAll.length} remaining task(s) await completion.`
          : 'All current daily priorities are marked complete. Consider reviewing upcoming commitments.',
      basis: `Based on ${completedCount}/${tasks.length} completed priorities and active deadline weighting.`,
    },
    potentialConflicts: overlappingEvent
      ? {
          summary: `15-minute overlap between Fellowship Application Draft (ends 17:15) and ${overlappingEvent.title} (starts 17:00).`,
          basis: 'Detected overlapping time windows between evt-4 and evt-5 in Today’s Schedule.',
          hasConflict: true,
        }
      : {
          summary: 'No time-block overlaps remain in today’s sample schedule.',
          basis: 'All scheduled time blocks currently have non-overlapping start and end windows.',
          hasConflict: false,
        },
    recommendedNextAction: {
      summary: topTask
        ? `Focus next on "${topTask.title}"${topTask.dueTime ? ` (due ${topTask.dueTime})` : ''}.`
        : 'Capture tomorrow’s top intention or review Upcoming Commitments.',
      basis: topTask
        ? `Selected highest-priority incomplete item (${topTask.priority}) from Today’s Priorities.`
        : 'No pending items left in Today’s Priorities.',
    },
    suggestedAdjustment:
      overlappingEvent && !adjustmentDismissed
        ? {
            id: 'adj-overlap-1700',
            summary: 'Shift Mentor Outreach block from 17:00 to 17:20 (35m) to protect Fellowship Draft completion.',
            beforeState: 'Mentor Outreach: 17:00 – 17:45 (15m overlap with Fellowship Draft)',
            afterState: 'Mentor Outreach: 17:20 – 17:55 (5m buffer after Fellowship Draft)',
            rationale:
              'Preserves full uninterrupted drafting time for the Nov 18 fellowship deadline while keeping outreach before evening training at 19:00.',
            targetScheduleId: overlappingEvent.id,
            applied: adjustmentApplied,
            dismissed: adjustmentDismissed,
          }
        : null,
  };
}
