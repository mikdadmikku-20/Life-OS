import React from 'react';
import { AdminModuleId, LifeProgressArea } from '../../../types/workspace';

interface LifeProgressWidgetProps {
  areas: LifeProgressArea[];
  onNavigateModule: (id: AdminModuleId) => void;
}

export const LifeProgressWidget: React.FC<LifeProgressWidgetProps> = ({
  areas,
  onNavigateModule,
}) => {
  return (
    <section
      aria-labelledby="widget-life-progress-title"
      className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#272A26]">
          <div>
            <h2
              id="widget-life-progress-title"
              className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-[#F5F6F2]"
            >
              Life Progress Snapshot
            </h2>
            <p className="mt-0.5 text-xs text-[#A0A39A]">
              Sample data · Separate domain progress without a single score
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateModule('progress-analytics')}
            className="text-xs font-medium text-[#C5FF62] hover:underline whitespace-nowrap cursor-pointer py-1"
          >
            Analytics
          </button>
        </div>

        {/* Visual Capsule Comparison Bars (inspired by Task Fusion clean vertical bars) */}
        <div
          aria-label="Domain progress capsule comparison chart"
          className="mt-5 grid grid-cols-5 gap-2.5 sm:gap-3 items-end h-[120px] px-1"
        >
          {areas.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => onNavigateModule(area.moduleId)}
              title={`${area.label}: ${area.percentage}% (${area.summaryMetric})`}
              className="group flex flex-col items-center h-full justify-end gap-2 cursor-pointer focus-visible:outline-[#C5FF62]"
            >
              <span className="font-mono text-[11px] font-medium tabular-nums text-[#F5F6F2] group-hover:text-[#C5FF62] transition-colors">
                {area.percentage}%
              </span>
              <div className="w-full max-w-[34px] flex-1 rounded-full bg-[#101110] border border-[#272A26] p-1 flex items-end overflow-hidden">
                <div
                  className="w-full rounded-full bg-gradient-to-t from-[#00A85A] via-[#00FF78]/85 to-[#C5FF62] transition-all duration-300 group-hover:brightness-110"
                  style={{ height: `${area.percentage}%` }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Clean Detailed Area Breakdown */}
        <ul className="mt-5 divide-y divide-[#272A26]">
          {areas.map((area) => (
            <li
              key={area.id}
              className="py-2.5 first:pt-2 last:pb-0 flex items-center justify-between gap-3 text-xs"
            >
              <button
                type="button"
                onClick={() => onNavigateModule(area.moduleId)}
                className="font-medium text-[#F5F6F2] hover:text-[#C5FF62] transition-colors text-left cursor-pointer truncate"
              >
                {area.label}
              </button>
              <span className="font-mono tabular-nums text-[#A0A39A] shrink-0">
                {area.summaryMetric}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
