import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AppSidebarEntryId, GrowthLifeArea } from '../../../types/appHome';

interface GrowthAreasCardProps {
  areas: GrowthLifeArea[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onNavigateEntry: (id: AppSidebarEntryId) => void;
}

export const GrowthAreasCard: React.FC<GrowthAreasCardProps> = ({
  areas,
  selectedAreaId,
  onSelectArea,
  onNavigateEntry,
}) => {
  const activeArea = areas.find((a) => a.id === selectedAreaId) ?? areas[0];

  return (
    <section
      aria-labelledby="card-growth-title"
      className="relative overflow-hidden rounded-[26px] border border-[#2C6B47] bg-gradient-to-br from-[#23B86A]/45 via-[#0E3A23] to-[#07150E] p-5 sm:p-6 flex flex-col justify-between"
    >
      {/* Subtle orbital ambient ring artwork matching Image 1 Growth points tone */}
      <svg
        viewBox="0 0 320 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -bottom-6 w-[250px] h-[220px] opacity-30"
      >
        <circle cx="95" cy="145" r="95" stroke="#6BFF9C" strokeWidth="1.2" />
        <circle cx="95" cy="145" r="65" stroke="#C5FF62" strokeWidth="1" />
        <circle cx="95" cy="145" r="32" fill="rgba(107,255,156,0.18)" />
      </svg>

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2
              id="card-growth-title"
              className="text-lg font-semibold tracking-[-0.015em] text-[#F5F7F2]"
            >
              Growth &amp; Life Areas
            </h2>
            <p className="mt-0.5 text-xs text-[#C6DCD0]">
              Connected personal development focus
            </p>
          </div>
        </div>

        {/* Connected Node Stems (Inspired by Image 1 Growth points diagram) */}
        <div className="mt-5 space-y-2.5">
          {areas.map((area, idx) => {
            const isSelected = area.id === selectedAreaId;
            // Subtle staggered horizontal indent mirroring Image 1's stepped nodes
            const indentClasses = ['pl-0', 'pl-5', 'pl-2', 'pl-6'];
            return (
              <div
                key={area.id}
                className={`flex items-center gap-2.5 ${indentClasses[idx % 4]}`}
              >
                <span
                  aria-hidden="true"
                  className={`h-px flex-1 max-w-[36px] transition-colors ${
                    isSelected ? 'bg-[#C5FF62]' : 'bg-[#6BFF9C]/40'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                    isSelected ? 'bg-[#C5FF62]' : 'bg-[#6BFF9C]/75'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => onSelectArea(area.id)}
                  aria-pressed={isSelected}
                  className={`flex-1 min-w-0 px-3.5 py-2 rounded-full border text-left text-xs font-medium transition-all cursor-pointer truncate ${
                    isSelected
                      ? 'bg-[#C5FF62] border-[#C5FF62] text-[#050C08] font-semibold shadow-[0_6px_20px_rgba(197,255,98,0.28)]'
                      : 'bg-[#081A11]/75 border-[#6BFF9C]/35 text-[#F5F7F2] hover:border-[#C5FF62]/70'
                  }`}
                >
                  {area.title}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Area Detail */}
      <div className="relative z-10 mt-5 rounded-2xl bg-[#06120B]/85 border border-[#245338] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-[#C5FF62]">
            {activeArea.shortLabel} focus
          </p>
          {activeArea.linkedModules[0] && (
            <button
              type="button"
              onClick={() => onNavigateEntry(activeArea.linkedModules[0])}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#F5F7F2]/85 hover:text-[#C5FF62] cursor-pointer"
            >
              <span>Module link</span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[#C6DCD0]">
          {activeArea.focusPrompt}
        </p>
      </div>
    </section>
  );
};
