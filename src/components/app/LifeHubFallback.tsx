import React, { useState } from 'react';
import { Activity, BookOpen, Calendar, Target, TrendingUp } from 'lucide-react';

export interface LifeHubPillar {
  id: 'schedule' | 'goals' | 'learning' | 'health' | 'progress';
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const LIFE_HUB_PILLARS: LifeHubPillar[] = [
  {
    id: 'schedule',
    label: 'Schedule',
    description: 'Time-blocked daily focus and calendar continuity.',
    icon: Calendar,
  },
  {
    id: 'goals',
    label: 'Goals',
    description: 'Long-horizon milestones connected to today’s priorities.',
    icon: Target,
  },
  {
    id: 'learning',
    label: 'Learning',
    description: 'Study tracks, reading notes, and deliberate skill craft.',
    icon: BookOpen,
  },
  {
    id: 'health',
    label: 'Health',
    description: 'Physical recovery, strength training, and sustainable energy.',
    icon: Activity,
  },
  {
    id: 'progress',
    label: 'Progress',
    description: 'Honest multi-domain momentum across active projects.',
    icon: TrendingUp,
  },
];

export const LifeHubFallback: React.FC = () => {
  const [activeId, setActiveId] = useState<LifeHubPillar['id']>('goals');
  const active =
    LIFE_HUB_PILLARS.find((p) => p.id === activeId) ?? LIFE_HUB_PILLARS[0];

  return (
    <div
      className="relative w-full h-[230px] sm:h-[260px] rounded-2xl bg-[#07110C] border border-[#1E3B2B] p-4 flex flex-col justify-between overflow-hidden"
      aria-label="Life hub orbital overview"
    >
      <svg
        viewBox="0 0 360 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-75 pointer-events-none"
      >
        <ellipse
          cx="180"
          cy="94"
          rx="132"
          ry="44"
          stroke="rgba(0, 255, 120, 0.25)"
          strokeWidth="2"
        />
        <ellipse
          cx="180"
          cy="94"
          rx="132"
          ry="44"
          stroke="#C5FF62"
          strokeWidth="2.5"
          strokeDasharray="110 400"
        />
      </svg>

      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-2">
        {LIFE_HUB_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const isSelected = pillar.id === activeId;
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setActiveId(pillar.id)}
              aria-pressed={isSelected}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#C5FF62] border-[#C5FF62] text-[#06100A]'
                  : 'bg-[#0C1912] border-[#214231] text-[#F5F7F2] hover:border-[#C5FF62]/50'
              }`}
            >
              <Icon size={13} aria-hidden="true" />
              <span>{pillar.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 rounded-xl bg-[#0A150F] border border-[#214231] px-3.5 py-2.5 text-center">
        <p className="text-xs font-semibold text-[#C5FF62]">{active.label}</p>
        <p className="mt-0.5 text-[11px] text-[#A1B0A6]">{active.description}</p>
      </div>
    </div>
  );
};
