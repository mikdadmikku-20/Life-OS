import { AdminModuleDefinition, ModuleCategoryGroup } from '../types/workspace';

export const MODULE_CATEGORIES: ModuleCategoryGroup[] = [
  { id: 'overview', label: 'Overview', defaultOpen: true },
  { id: 'plan-execute', label: 'Plan & Execute', defaultOpen: true },
  { id: 'career-opportunities', label: 'Career & Opportunities', defaultOpen: false },
  { id: 'learn-create', label: 'Learn & Create', defaultOpen: false },
  { id: 'health-growth', label: 'Health & Personal Growth', defaultOpen: false },
  { id: 'knowledge-research', label: 'Knowledge & Research', defaultOpen: false },
  { id: 'insights-ai', label: 'Insights & AI', defaultOpen: true },
  { id: 'settings', label: 'Settings', defaultOpen: true },
];

/**
 * All 23 original TRCK MAIN modules preserved verbatim in navigation architecture.
 */
export const ADMIN_MODULES: AdminModuleDefinition[] = [
  {
    id: 'dashboard-daily-reflection',
    number: 1,
    name: 'Dashboard & Daily Reflection',
    categoryId: 'overview',
    iconName: 'LayoutDashboard',
    shortDescription:
      'Unified daily command workspace connecting priorities, schedule, goals, active projects, and contextual AI reflection.',
    plannedCapabilities: ['Life Command Center', 'Weekly Life Review', 'Universal Capture Inbox'],
    isImplemented: true,
  },
  {
    id: 'daily-schedule-tracker-planner',
    number: 2,
    name: 'Daily Schedule Tracker & Planner',
    categoryId: 'plan-execute',
    iconName: 'CalendarClock',
    shortDescription:
      'Time-blocked daily planning, energy-aware scheduling, and commitment conflict resolution.',
    plannedCapabilities: ['Personal Capacity & Energy Planner', 'Execution Mode', 'Adaptive Life Planning'],
    isImplemented: false,
  },
  {
    id: 'career-future-planner',
    number: 3,
    name: 'Career & Future Planner',
    categoryId: 'career-opportunities',
    iconName: 'Briefcase',
    shortDescription:
      'Long-term career trajectory mapping, role milestones, portfolio readiness, and strategic positioning.',
    plannedCapabilities: ['Life Decision Simulator & Digital Twin mode', 'Personal Timeline & Turning Points'],
    isImplemented: false,
  },
  {
    id: 'health-fitness-planner',
    number: 4,
    name: 'Health & Fitness Planner',
    categoryId: 'health-growth',
    iconName: 'Activity',
    shortDescription:
      'Training routines, sleep and recovery patterns, nutrition habits, and physical energy sustainability.',
    plannedCapabilities: ['Personal Capacity & Energy Planner', 'Life Experiments & Improvement Lab'],
    isImplemented: false,
  },
  {
    id: 'programs-opportunities-explorer',
    number: 5,
    name: 'Programs & Opportunities Explorer',
    categoryId: 'career-opportunities',
    iconName: 'Compass',
    shortDescription:
      'Discover, evaluate, and track fellowships, scholarships, accelerators, grants, and strategic programs.',
    plannedCapabilities: ['Opportunity-to-Achievement Pipeline', 'Early-Warning & Risk Radar'],
    isImplemented: false,
  },
  {
    id: 'outreach-planner',
    number: 6,
    name: 'Outreach Planner',
    categoryId: 'career-opportunities',
    iconName: 'Send',
    shortDescription:
      'Structured relationship follow-ups, mentorship outreach, warm introductions, and communication cadences.',
    plannedCapabilities: ['Commitment & Accountability System', 'Opportunity-to-Achievement Pipeline'],
    isImplemented: false,
  },
  {
    id: 'ideas-business-planner',
    number: 7,
    name: 'Ideas & Business Planner',
    categoryId: 'career-opportunities',
    iconName: 'Lightbulb',
    shortDescription:
      'Capture venture concepts, validate hypotheses, map business models, and graduate viable ideas into projects.',
    plannedCapabilities: ['Universal Capture Inbox', 'Knowledge-to-Action Bridge', 'Life Experiments & Improvement Lab'],
    isImplemented: false,
  },
  {
    id: 'skill-planner',
    number: 8,
    name: 'Skill Planner',
    categoryId: 'learn-create',
    iconName: 'Layers',
    shortDescription:
      'Structured skill trees, deliberate practice logs, competency benchmarks, and capability gap analysis.',
    plannedCapabilities: ['Adaptive Learning & Mastery Engine', 'Achievement & Evidence Vault'],
    isImplemented: false,
  },
  {
    id: 'reading-tracker',
    number: 9,
    name: 'Reading Tracker',
    categoryId: 'knowledge-research',
    iconName: 'BookOpen',
    shortDescription:
      'Track books, papers, highlights, reading queues, and synthesized takeaways linked directly to goals.',
    plannedCapabilities: ['Personal Knowledge Brain', 'AI Content Intelligence', 'Resource Center'],
    isImplemented: false,
  },
  {
    id: 'news-information',
    number: 10,
    name: 'News & Information',
    categoryId: 'knowledge-research',
    iconName: 'Newspaper',
    shortDescription:
      'Curated domain briefings, signal-over-noise research feeds, and saved intelligence digests.',
    plannedCapabilities: ['AI Content Intelligence', 'Research & Evidence Workspace'],
    isImplemented: false,
  },
  {
    id: 'goal-planner',
    number: 11,
    name: 'Goal Planner',
    categoryId: 'plan-execute',
    iconName: 'Target',
    shortDescription:
      'Break long-horizon ambitions into measurable milestones, active projects, and weekly execution targets.',
    plannedCapabilities: ['Adaptive Life Planning', 'Life Connection Graph', 'Commitment & Accountability System'],
    isImplemented: false,
  },
  {
    id: 'social-character-planner',
    number: 12,
    name: 'Social Character Planner',
    categoryId: 'health-growth',
    iconName: 'Users',
    shortDescription:
      'Intentional stewardship of community presence, leadership conduct, reliability, and service to others.',
    plannedCapabilities: ['Personal Rules & Boundaries', 'Weekly Life Review'],
    isImplemented: false,
  },
  {
    id: 'personal-character-planner',
    number: 13,
    name: 'Personal Character Planner',
    categoryId: 'health-growth',
    iconName: 'ShieldCheck',
    shortDescription:
      'Core values alignment, discipline habits, integrity reflection, and self-mastery practices.',
    plannedCapabilities: ['Personal Rules & Boundaries', 'Personal Timeline & Turning Points'],
    isImplemented: false,
  },
  {
    id: 'social-media-planner',
    number: 14,
    name: 'Social Media Planner',
    categoryId: 'learn-create',
    iconName: 'Share2',
    shortDescription:
      'Intentional publishing calendar, public work log, audience notes, and distraction-free distribution.',
    plannedCapabilities: ['Knowledge-to-Action Bridge', 'Personal Workflow Automation Studio'],
    isImplemented: false,
  },
  {
    id: 'social-skills-planner',
    number: 15,
    name: 'Social Skills Planner',
    categoryId: 'health-growth',
    iconName: 'MessageSquareHeart',
    shortDescription:
      'Communication practice, active listening reflection, presentation readiness, and interpersonal confidence.',
    plannedCapabilities: ['Adaptive Learning & Mastery Engine', 'Life Experiments & Improvement Lab'],
    isImplemented: false,
  },
  {
    id: 'quran-sunnah-planner',
    number: 16,
    name: 'Quran & Sunnah Planner',
    categoryId: 'health-growth',
    iconName: 'BookMarked',
    shortDescription:
      'Daily recitation, memorization revision cycles, reflection notes, and consistent Sunnah habits.',
    plannedCapabilities: ['Commitment & Accountability System', 'Adaptive Learning & Mastery Engine'],
    isImplemented: false,
  },
  {
    id: 'talent-planner',
    number: 17,
    name: 'Talent Planner',
    categoryId: 'learn-create',
    iconName: 'Sparkles',
    shortDescription:
      'Cultivate natural strengths, creative craft, and distinctive output into durable personal leverage.',
    plannedCapabilities: ['Achievement & Evidence Vault', 'Life Connection Graph'],
    isImplemented: false,
  },
  {
    id: 'study-planner',
    number: 18,
    name: 'Study Planner',
    categoryId: 'learn-create',
    iconName: 'GraduationCap',
    shortDescription:
      'Course syllabi, exam timelines, spaced-repetition blocks, and deep study session tracking.',
    plannedCapabilities: ['Adaptive Learning & Mastery Engine', 'Resource Center'],
    isImplemented: false,
  },
  {
    id: 'project-planner',
    number: 19,
    name: 'Project Planner',
    categoryId: 'plan-execute',
    iconName: 'FolderKanban',
    shortDescription:
      'End-to-end project milestones, deliverables, blockers, and execution status connected to overarching goals.',
    plannedCapabilities: ['Execution Mode', 'Early-Warning & Risk Radar', 'Knowledge-to-Action Bridge'],
    isImplemented: false,
  },
  {
    id: 'event-purchase-planner',
    number: 20,
    name: 'Event & Purchase Planner',
    categoryId: 'plan-execute',
    iconName: 'ShoppingBag',
    shortDescription:
      'Plan upcoming events, travel logistics, and intentional major purchases with clear criteria and timing.',
    plannedCapabilities: ['Personal Resource & Budget Allocator', 'Early-Warning & Risk Radar'],
    isImplemented: false,
  },
  {
    id: 'progress-analytics',
    number: 21,
    name: 'Progress & Analytics',
    categoryId: 'insights-ai',
    iconName: 'BarChart3',
    shortDescription:
      'Cross-domain trends, consistency patterns, milestone velocity, and honest multi-area progress diagnostics.',
    plannedCapabilities: ['Personal Intelligence Engine', 'Weekly Life Review', 'Achievement & Evidence Vault'],
    isImplemented: false,
  },
  {
    id: 'ai-assistant',
    number: 22,
    name: 'AI Assistant',
    categoryId: 'insights-ai',
    iconName: 'Bot',
    shortDescription:
      'Dedicated workspace intelligence hub for planning reviews, synthesis, prioritization, and specialized advisors.',
    plannedCapabilities: ['Specialized AI Team', 'Personal Intelligence Engine', 'Universal Voice & Quick-Action Interface'],
    isImplemented: false,
  },
  {
    id: 'settings-personalization',
    number: 23,
    name: 'Settings & Personalization',
    categoryId: 'settings',
    iconName: 'Settings',
    shortDescription:
      'Workspace preferences, personal boundaries, notification rules, connected integrations, and extensions.',
    plannedCapabilities: ['Personal Rules & Boundaries', 'TRCK MAIN Extensions & Template Ecosystem'],
    isImplemented: false,
  },
];
