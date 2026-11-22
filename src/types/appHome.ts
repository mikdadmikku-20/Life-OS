import { AdminModuleId } from './workspace';

export type AppSidebarEntryId = 'home' | AdminModuleId;

export type AppNavCategoryId =
  | 'core'
  | 'plan-execute'
  | 'career-opportunities'
  | 'learn-create'
  | 'health-growth'
  | 'knowledge-research'
  | 'insights-ai'
  | 'system';

export interface AppSidebarEntry {
  id: AppSidebarEntryId;
  order: number;
  name: string;
  categoryId: AppNavCategoryId;
  iconName: string;
  status: 'active' | 'upcoming';
  summary: string;
  futureCapabilities: string[];
}

export interface AppNavCategory {
  id: AppNavCategoryId;
  label: string;
  defaultOpen: boolean;
}

export interface ScheduleSlotItem {
  id: string;
  dayOffset: number; // -1 yesterday, 0 today, 1 tomorrow, etc.
  startHour: number; // e.g., 9.5 for 09:30
  durationHours: number;
  timeRangeLabel: string;
  title: string;
  categoryLabel: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'conflict';
  tone: 'emerald' | 'surface' | 'lime';
  source: 'sample' | 'session';
}

export interface GrowthLifeArea {
  id: string;
  title: string;
  shortLabel: string;
  subtitle: string;
  focusPrompt: string;
  linkedModules: AppSidebarEntryId[];
}

export interface PreviewDocumentItem {
  id: string;
  title: string;
  fileType: 'PDF' | 'DOCX' | 'MD';
  updatedLabel: string;
  linkedModule: string;
  previewLines: string[];
  source: 'sample';
}

export interface ScoreWeightConfig {
  priorities: number;
  goals: number;
  habits: number;
}

export type QuickRecordType =
  | 'thought'
  | 'task'
  | 'idea'
  | 'goal'
  | 'note'
  | 'reminder'
  | 'opportunity';

export interface QuickCapturedRecord {
  id: string;
  type: QuickRecordType;
  content: string;
  createdAtLabel: string;
  destinationHint: string;
}

export interface ActivityTimelineEvent {
  id: string;
  title: string;
  category: 'task' | 'goal' | 'note' | 'project' | 'capture';
  timeLabel: string;
  source: 'sample' | 'session';
}

export interface CopilotStatusRow {
  id: string;
  slotLabel: string;
  title: string;
  status: 'done' | 'in-progress' | 'attention';
  statusText: string;
}

export interface LifeRingMetric {
  id: string;
  label: string;
  percentage: number;
  detail: string;
  moduleId: AppSidebarEntryId;
}

export type AppAtmosphereTheme = 'forest-glass' | 'deep-obsidian';
