import {
  ActivityTimelineEvent,
  AppNavCategory,
  AppSidebarEntry,
  CopilotStatusRow,
  GrowthLifeArea,
  LifeRingMetric,
  PreviewDocumentItem,
  ScheduleSlotItem,
} from '../types/appHome';
import { ADMIN_MODULES } from './adminModules';

export const APP_NAV_CATEGORIES: AppNavCategory[] = [
  { id: 'core', label: 'Core Workspace', defaultOpen: true },
  { id: 'plan-execute', label: 'Plan & Execute', defaultOpen: true },
  { id: 'career-opportunities', label: 'Career & Opportunities', defaultOpen: false },
  { id: 'learn-create', label: 'Learn & Create', defaultOpen: false },
  { id: 'health-growth', label: 'Health & Personal Growth', defaultOpen: false },
  { id: 'knowledge-research', label: 'Knowledge & Research', defaultOpen: false },
  { id: 'insights-ai', label: 'Insights & AI', defaultOpen: true },
  { id: 'system', label: 'System', defaultOpen: false },
];

const MODULE_TO_APP_CATEGORY: Record<string, AppNavCategory['id']> = {
  overview: 'core',
  'plan-execute': 'plan-execute',
  'career-opportunities': 'career-opportunities',
  'learn-create': 'learn-create',
  'health-growth': 'health-growth',
  'knowledge-research': 'knowledge-research',
  'insights-ai': 'insights-ai',
  settings: 'system',
};

/**
 * 24 initial navigation entries:
 * 1. Home (active) + 2. Daily Reflection + all remaining 22 original modules (2-24).
 */
export const APP_SIDEBAR_ENTRIES: AppSidebarEntry[] = [
  {
    id: 'home',
    order: 1,
    name: 'Home',
    categoryId: 'core',
    iconName: 'LayoutDashboard',
    status: 'active',
    summary:
      'Main TRCK MAIN workspace bringing today’s schedule, priorities, life areas, goals, documents, quick capture, and AI co-pilot together.',
    futureCapabilities: ['Life Command Center', 'Universal Capture Inbox', 'Life Connection Graph'],
  },
  {
    id: 'dashboard-daily-reflection',
    order: 2,
    name: 'Daily Reflection',
    categoryId: 'core',
    iconName: 'Sparkles',
    status: 'upcoming',
    summary:
      'Guided morning and evening reflection prompts, gratitude notes, and daily review aligned with your goals and character habits.',
    futureCapabilities: ['Weekly Life Review', 'Personal Timeline & Turning Points'],
  },
  ...ADMIN_MODULES.slice(1).map((mod, idx) => ({
    id: mod.id,
    order: idx + 3,
    name: mod.name,
    categoryId: MODULE_TO_APP_CATEGORY[mod.categoryId] ?? 'core',
    iconName: mod.iconName,
    status: 'upcoming' as const,
    summary: mod.shortDescription,
    futureCapabilities: mod.plannedCapabilities,
  })),
];

export const SAMPLE_SCHEDULE_SLOTS: ScheduleSlotItem[] = [
  {
    id: 'slot-today-1',
    dayOffset: 0,
    startHour: 9,
    durationHours: 1.5,
    timeRangeLabel: '09:00 – 10:30',
    title: 'Deep Focus: System Architecture Notes',
    categoryLabel: 'Project Planner · Core Build',
    status: 'completed',
    tone: 'emerald',
    source: 'sample',
  },
  {
    id: 'slot-today-2',
    dayOffset: 0,
    startHour: 11,
    durationHours: 1.5,
    timeRangeLabel: '11:00 – 12:30',
    title: 'Fellowship Statement & Evidence Review',
    categoryLabel: 'Programs & Opportunities',
    status: 'in-progress',
    tone: 'surface',
    source: 'sample',
  },
  {
    id: 'slot-today-3',
    dayOffset: 0,
    startHour: 14,
    durationHours: 1,
    timeRangeLabel: '14:00 – 15:00',
    title: 'Distributed Systems Study Block',
    categoryLabel: 'Study Planner',
    status: 'upcoming',
    tone: 'lime',
    source: 'sample',
  },
  {
    id: 'slot-today-4',
    dayOffset: 0,
    startHour: 16.5,
    durationHours: 0.75,
    timeRangeLabel: '16:30 – 17:15',
    title: 'Mentor Follow-up & Outreach Queue',
    categoryLabel: 'Outreach Planner',
    status: 'conflict',
    tone: 'surface',
    source: 'sample',
  },
  {
    id: 'slot-prev-1',
    dayOffset: -1,
    startHour: 9.5,
    durationHours: 1.5,
    timeRangeLabel: '09:30 – 11:00',
    title: 'Weekly Goal Milestone Audit',
    categoryLabel: 'Goal Planner',
    status: 'completed',
    tone: 'emerald',
    source: 'sample',
  },
  {
    id: 'slot-prev-2',
    dayOffset: -1,
    startHour: 13,
    durationHours: 1,
    timeRangeLabel: '13:00 – 14:00',
    title: 'Reading Notes Synthesis',
    categoryLabel: 'Reading Tracker',
    status: 'completed',
    tone: 'surface',
    source: 'sample',
  },
  {
    id: 'slot-next-1',
    dayOffset: 1,
    startHour: 10,
    durationHours: 2,
    timeRangeLabel: '10:00 – 12:00',
    title: 'Portfolio Interactive Prototype Sprint',
    categoryLabel: 'Project Planner',
    status: 'upcoming',
    tone: 'emerald',
    source: 'sample',
  },
  {
    id: 'slot-next-2',
    dayOffset: 1,
    startHour: 15,
    durationHours: 1,
    timeRangeLabel: '15:00 – 16:00',
    title: 'Strength & Mobility Training',
    categoryLabel: 'Health & Fitness Planner',
    status: 'upcoming',
    tone: 'lime',
    source: 'sample',
  },
];

export const GROWTH_LIFE_AREAS: GrowthLifeArea[] = [
  {
    id: 'strategy-dev',
    title: 'Strategy & Personal Development',
    shortLabel: 'Strategy',
    subtitle: 'Long-term direction, clarity, and intentional goal architecture.',
    focusPrompt: 'Connect weekly tasks directly to Q4 milestones before scheduling new commitments.',
    linkedModules: ['goal-planner', 'career-future-planner', 'personal-character-planner'],
  },
  {
    id: 'leadership-social',
    title: 'Leadership & Social Skills',
    shortLabel: 'Leadership',
    subtitle: 'Outreach cadence, community presence, and purposeful communication.',
    focusPrompt: 'Follow up with two mentors and prepare concise takeaways ahead of feedback calls.',
    linkedModules: ['social-skills-planner', 'social-character-planner', 'outreach-planner'],
  },
  {
    id: 'efficiency-prod',
    title: 'Efficiency & Productivity',
    shortLabel: 'Efficiency',
    subtitle: 'Protected deep-work blocks, project execution, and frictionless capture.',
    focusPrompt: 'Guard morning 90-minute focus intervals and consolidate outreach into late afternoon.',
    linkedModules: ['daily-schedule-tracker-planner', 'project-planner'],
  },
  {
    id: 'learning-health',
    title: 'Learning & Health',
    shortLabel: 'Learning & Health',
    subtitle: 'Deliberate study, skill mastery, physical vitality, and spiritual grounding.',
    focusPrompt: 'Pair spaced-repetition study sessions with consistent strength and recovery blocks.',
    linkedModules: ['study-planner', 'skill-planner', 'health-fitness-planner', 'quran-sunnah-planner'],
  },
];

export const SAMPLE_DOCUMENTS: PreviewDocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Q4 Systems Architecture Notes',
    fileType: 'PDF',
    updatedLabel: 'Sample · 2d ago',
    linkedModule: 'Study Planner',
    previewLines: [
      'Distributed Consensus Notes',
      '1. Leader Election & Term Safety',
      '2. Log Replication Guarantees',
      '3. Practical Failure Modes',
    ],
    source: 'sample',
  },
  {
    id: 'doc-2',
    title: '2027 Fellowship Statement Draft',
    fileType: 'DOCX',
    updatedLabel: 'Sample · Today',
    linkedModule: 'Programs & Opportunities',
    previewLines: [
      'Statement of Purpose — Sec 2',
      'Focus: Resilient Personal Systems',
      'Evidence: 3 Shipped Case Studies',
      'Reviewer Checklist Pending',
    ],
    source: 'sample',
  },
  {
    id: 'doc-3',
    title: 'Reading Takeaways: Deep Craft',
    fileType: 'MD',
    updatedLabel: 'Sample · 4d ago',
    linkedModule: 'Reading Tracker',
    previewLines: [
      '# Key Principles',
      '- Single-priority mornings',
      '- Weekly evidence vaulting',
      '- Clear boundary guardrails',
    ],
    source: 'sample',
  },
];

export const SAMPLE_LIFE_RINGS: LifeRingMetric[] = [
  {
    id: 'ring-goals',
    label: 'Goals',
    percentage: 68,
    detail: '2/3 active on track',
    moduleId: 'goal-planner',
  },
  {
    id: 'ring-study',
    label: 'Study',
    percentage: 58,
    detail: '4.5h / 7h weekly',
    moduleId: 'study-planner',
  },
  {
    id: 'ring-health',
    label: 'Health',
    percentage: 80,
    detail: '4/5 sessions',
    moduleId: 'health-fitness-planner',
  },
  {
    id: 'ring-projects',
    label: 'Projects',
    percentage: 64,
    detail: '3 active builds',
    moduleId: 'project-planner',
  },
  {
    id: 'ring-habits',
    label: 'Habits',
    percentage: 78,
    detail: '11/14 check-ins',
    moduleId: 'personal-character-planner',
  },
];

export const SAMPLE_COPILOT_ROWS: CopilotStatusRow[] = [
  {
    id: 'cp-1',
    slotLabel: 'Primary goal',
    title: 'Portfolio Architecture Case Studies',
    status: 'done',
    statusText: 'On track',
  },
  {
    id: 'cp-2',
    slotLabel: 'Goal 2',
    title: '2027 Fellowship Application Draft',
    status: 'in-progress',
    statusText: 'In progress',
  },
  {
    id: 'cp-3',
    slotLabel: 'Goal 3',
    title: 'Mentor Outreach Overlap Resolution',
    status: 'attention',
    statusText: 'Needs review',
  },
];

export const INITIAL_RECENT_ACTIVITY: ActivityTimelineEvent[] = [
  {
    id: 'act-1',
    title: 'Completed "System Design spaced-repetition review" block',
    category: 'task',
    timeLabel: 'Sample · 1h ago',
    source: 'sample',
  },
  {
    id: 'act-2',
    title: 'Updated milestone on "Ship Public Technical Portfolio" (68%)',
    category: 'goal',
    timeLabel: 'Sample · 3h ago',
    source: 'sample',
  },
  {
    id: 'act-3',
    title: 'Saved study note "Leader Election & Replication Guarantees"',
    category: 'note',
    timeLabel: 'Sample · Yesterday',
    source: 'sample',
  },
  {
    id: 'act-4',
    title: 'Logged Milestone 2 prep for "2027 Fellowship Application"',
    category: 'project',
    timeLabel: 'Sample · 2d ago',
    source: 'sample',
  },
];
