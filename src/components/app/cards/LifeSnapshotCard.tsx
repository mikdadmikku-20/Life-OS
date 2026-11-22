import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AppSidebarEntryId, LifeRingMetric } from '../../../types/appHome';

interface LifeSnapshotCardProps {
  rings: LifeRingMetric[];
  onNavigateEntry: (id: AppSidebarEntryId) => void;
  cardSurfaceClass: string;
}

export const LifeSnapshotCard: React.FC<LifeSnapshotCardProps> = ({
  rings,
  onNavigateEntry,
  cardSurfaceClass,
}) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <section
      aria-labelledby="card-life-snapshot-title"
      className={`rounded-[26px] border p-5 sm:p-6 flex flex-col justify-between ${cardSurfaceClass}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="card-life-snapshot-title"
              className="text-base sm:text-lg font-semibold text-[#F5F7F2]"
            >
              Life Snapshot &amp; Progress
            </h2>
            <p className="text-xs text-[#8CA195]">
              Sample domain completion · Select any ring to inspect module
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateEntry('progress-analytics')}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#6BFF9C] hover:underline cursor-pointer shrink-0 pt-0.5"
          >
            <span>Analytics</span>
            <ArrowRight size={12} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {rings.map((ring, idx) => {
            const offset =
              circumference - (ring.percentage / 100) * circumference;
            const strokeColor = idx % 2 === 0 ? '#3DF58B' : '#C5FF62';

            return (
              <button
                key={ring.id}
                type="button"
                onClick={() => onNavigateEntry(ring.moduleId)}
                className="group rounded-2xl bg-[#07120C]/90 border border-[#1B3A29] hover:border-[#6BFF9C]/55 p-3 flex flex-col items-center text-center transition-colors cursor-pointer"
              >
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg
                    viewBox="0 0 64 64"
                    className="w-full h-full -rotate-90"
                    aria-hidden="true"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r={radius}
                      fill="none"
                      stroke="#142C1F"
                      strokeWidth="6"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r={radius}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute font-mono text-xs font-bold tabular-nums text-[#F5F7F2]">
                    {ring.percentage}%
                  </span>
                </div>

                <span className="mt-2 text-xs font-semibold text-[#F5F7F2] group-hover:text-[#6BFF9C] transition-colors">
                  {ring.label}
                </span>
                <span className="mt-0.5 text-[11px] text-[#8CA195] leading-tight">
                  {ring.detail}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#7A8D81]">
        <span>Sample values across 5 core domains</span>
        <span>Progress &amp; Analytics planned</span>
      </div>
    </section>
  );
};
