import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ScoreWeightConfig } from '../../../types/appHome';

interface ScoreProgressCardProps {
  score: number;
  weights: ScoreWeightConfig;
  onChangeWeights: (next: ScoreWeightConfig) => void;
  cardSurfaceClass: string;
}

export const ScoreProgressCard: React.FC<ScoreProgressCardProps> = ({
  score,
  weights,
  onChangeWeights,
  cardSurfaceClass,
}) => {
  const [configuring, setConfiguring] = useState(false);

  // 18-dot matrix (6 columns x 3 rows) inspired by Image 1's Current Score dot cluster
  const totalDots = 18;
  const activeDots = Math.round((score / 100) * totalDots);

  const interpretation =
    score >= 80
      ? 'Strong daily alignment'
      : score >= 60
      ? 'Steady progress pace'
      : 'Open priorities awaiting focus';

  return (
    <section
      aria-labelledby="card-score-title"
      className={`rounded-[26px] border p-5 sm:p-6 ${cardSurfaceClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="card-score-title"
            className="text-sm font-medium text-[#A1B0A6]"
          >
            Current Progress Index
          </h2>
          <p className="text-[11px] text-[#8CA195]">
            Sample calculation · Transparent formula
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfiguring((c) => !c)}
          aria-expanded={configuring}
          aria-label="Configure score weighting"
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors cursor-pointer ${
            configuring
              ? 'bg-[#C5FF62] border-[#C5FF62] text-[#050C08]'
              : 'bg-[#0E1E16] border-[#214231] text-[#A1B0A6] hover:text-[#F5F7F2]'
          }`}
        >
          <SlidersHorizontal size={12} aria-hidden="true" />
          <span>Weights</span>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl sm:text-4xl font-bold tabular-nums text-[#F5F7F2]">
            {score}
          </span>
          <span className="font-mono text-xs text-[#8CA195]">/ 100</span>
        </div>

        {/* 6x3 Dot Matrix Indicator */}
        <div
          aria-hidden="true"
          className="grid grid-cols-6 gap-1.5"
        >
          {Array.from({ length: totalDots }).map((_, idx) => {
            const lit = idx < activeDots;
            return (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  lit
                    ? idx >= 12
                      ? 'bg-[#C5FF62]'
                      : 'bg-[#3DF58B]'
                    : 'bg-[#173022]'
                }`}
              />
            );
          })}
        </div>
      </div>

      <p className="mt-2 text-xs font-medium text-[#6BFF9C]">
        {interpretation}
      </p>

      {configuring && (
        <div className="mt-3.5 pt-3 border-t border-white/[0.08] space-y-2.5 text-xs">
          <p className="text-[11px] text-[#8CA195]">
            Adjust sample weighting across visible priorities, goals, and habits:
          </p>

          {(
            [
              ['priorities', 'Daily Priorities'],
              ['goals', 'Active Goals'],
              ['habits', 'Habit Check-ins'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <div className="flex justify-between text-[11px] text-[#F5F7F2] mb-1">
                <span>{label}</span>
                <span className="font-mono tabular-nums text-[#C5FF62]">
                  {weights[key]}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={weights[key]}
                onChange={(e) =>
                  onChangeWeights({
                    ...weights,
                    [key]: Number(e.target.value),
                  })
                }
                className="w-full accent-[#6BFF9C] cursor-pointer"
              />
            </label>
          ))}
        </div>
      )}
    </section>
  );
};
