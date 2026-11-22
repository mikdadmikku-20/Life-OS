export type FloatingPanelId = 'tier-top' | 'tier-mid' | 'tier-bot' | 'core-orb';

export interface FloatingPanelData {
  id: FloatingPanelId;
  name: string;
  shortLabel: string;
  edgeTitle: string;
  description: string;
  /** Base Y elevation in the 3-tier isometric tower */
  baseY: number;
  /** Subtle independent hover phase */
  phase: number;
  /** Vertical explosion delta when scrolling down */
  scrollLiftY: number;
  /** Slight horizontal/depth fan on scroll */
  scrollOffsetXZ: [number, number];
}

export const FLOATING_PANELS: FloatingPanelData[] = [
  {
    id: 'tier-top',
    name: 'Synthesis & Intelligence',
    shortLabel: 'Top Tier',
    edgeTitle: 'Connect Goals, Skills & Action',
    description:
      'Unifies learning, research, and intelligent guidance above every active area of your life.',
    baseY: 1.55,
    phase: 0.3,
    scrollLiftY: 0.72,
    scrollOffsetXZ: [0.16, -0.14],
  },
  {
    id: 'tier-mid',
    name: 'Focus & Execution',
    shortLabel: 'Mid Tier',
    edgeTitle: 'Eliminate Scattered Priorities',
    description:
      'Filters daily noise so urgent tasks and deep projects stay aligned with what matters most.',
    baseY: 0.42,
    phase: 1.6,
    scrollLiftY: 0.28,
    scrollOffsetXZ: [-0.18, 0.12],
  },
  {
    id: 'tier-bot',
    name: 'Core Life Foundation',
    shortLabel: 'Base Tier',
    edgeTitle: 'Align Every Layer of Your Life',
    description:
      'Organizes goals, schedules, health, and career milestones inside one connected foundation.',
    baseY: -0.68,
    phase: 2.9,
    scrollLiftY: -0.12,
    scrollOffsetXZ: [0.12, 0.2],
  },
  {
    id: 'core-orb',
    name: 'TRCK Intelligence Node',
    shortLabel: 'TRCK Core',
    edgeTitle: 'TRCK',
    description:
      'Central directional node linking daily decisions to long-term personal growth.',
    baseY: 2.38,
    phase: 4.1,
    scrollLiftY: 1.05,
    scrollOffsetXZ: [0.05, -0.18],
  },
];
