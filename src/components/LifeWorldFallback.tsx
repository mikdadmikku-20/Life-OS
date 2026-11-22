import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FLOATING_PANELS, FloatingPanelId } from '../data/lifeAreas';

interface LifeWorldFallbackProps {
  reason?: 'loading' | 'reduced-motion' | 'no-webgl';
}

const TIER_COORDS: Record<FloatingPanelId, { x: number; y: number }> = {
  'core-orb': { x: 42, y: 15 },
  'tier-top': { x: 52, y: 31 },
  'tier-mid': { x: 50, y: 50 },
  'tier-bot': { x: 48, y: 69 },
};

export const LifeWorldFallback: React.FC<LifeWorldFallbackProps> = ({
  reason = 'no-webgl',
}) => {
  const [selectedId, setSelectedId] = useState<FloatingPanelId | null>(
    'tier-top'
  );
  const selectedPanel =
    FLOATING_PANELS.find((p) => p.id === selectedId) ?? null;

  return (
    <div
      className="relative w-full h-[440px] sm:h-[520px] lg:h-[600px] rounded-[28px] bg-[#0A0D0A] border border-[#30372F]/80 overflow-hidden select-none"
      aria-label="TRCK MAIN stacked glass tower and glowing portal ring diagram"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_72%,rgba(0,255,120,0.16),rgba(0,168,90,0.05)_48%,transparent_72%)]"
      />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      >
        <ellipse
          cx="50"
          cy="74"
          rx="36"
          ry="14"
          fill="none"
          stroke="rgba(0, 255, 120, 0.3)"
          strokeWidth="2.4"
        />
        <ellipse
          cx="50"
          cy="74"
          rx="36"
          ry="14"
          fill="none"
          stroke="#C5FF62"
          strokeWidth="0.6"
          strokeDasharray="46 150"
        />
        <line
          x1="50"
          y1="74"
          x2="50"
          y2="20"
          stroke="rgba(212, 220, 214, 0.45)"
          strokeWidth="0.45"
        />
      </svg>

      {FLOATING_PANELS.map((panel) => {
        const coord = TIER_COORDS[panel.id];
        const isSelected = selectedId === panel.id;
        return (
          <button
            key={panel.id}
            type="button"
            onClick={() =>
              setSelectedId((prev) => (prev === panel.id ? null : panel.id))
            }
            style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
            aria-pressed={isSelected}
            className={`absolute -translate-x-1/2 -translate-y-1/2 min-h-[40px] px-4 py-2 rounded-2xl text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
              isSelected
                ? 'bg-[#191D19] text-[#C5FF62] border border-[#C5FF62]/60 shadow-[0_12px_30px_rgba(0,0,0,0.7)]'
                : 'bg-[#111411] text-[#F5F7F2] border border-[#30372F] hover:border-[#00FF78]/50'
            }`}
          >
            {panel.name}
          </button>
        );
      })}

      {selectedPanel && (
        <div
          role="status"
          className="absolute bottom-4 left-4 right-4 sm:left-5 sm:right-auto sm:max-w-xs rounded-2xl bg-[#111411] border border-[#30372F] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.75)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#C5FF62]">
                {selectedPanel.name}
              </p>
              <p className="mt-1 text-xs leading-[1.55] text-[#F5F7F2]/90">
                {selectedPanel.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Dismiss tier details"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[#A1A69E] hover:text-[#F5F7F2] hover:bg-[#191D19] transition-colors cursor-pointer shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {reason === 'loading' && (
        <span className="sr-only">Loading interactive 3D world</span>
      )}
    </div>
  );
};
