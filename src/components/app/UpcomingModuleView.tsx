import React from 'react';
import { ArrowLeft, Layers } from 'lucide-react';
import { APP_NAV_CATEGORIES, APP_SIDEBAR_ENTRIES } from '../../data/appHomeData';
import { SHARED_CAPABILITIES } from '../../data/sharedCapabilities';
import { AppSidebarEntryId } from '../../types/appHome';
import { ModuleIcon } from '../admin/ModuleIcon';

interface UpcomingModuleViewProps {
  entryId: AppSidebarEntryId;
  onReturnHome: () => void;
  cardSurfaceClass: string;
}

export const UpcomingModuleView: React.FC<UpcomingModuleViewProps> = ({
  entryId,
  onReturnHome,
  cardSurfaceClass,
}) => {
  const entry =
    APP_SIDEBAR_ENTRIES.find((e) => e.id === entryId) ?? APP_SIDEBAR_ENTRIES[1];
  const category = APP_NAV_CATEGORIES.find((c) => c.id === entry.categoryId);

  const relatedCapabilities = SHARED_CAPABILITIES.filter(
    (cap) =>
      cap.connectedModules.includes(entry.id as never) ||
      entry.futureCapabilities.includes(cap.name)
  );

  return (
    <div className="space-y-6">
      <section className={`rounded-[26px] border p-6 sm:p-8 ${cardSurfaceClass}`}>
        <button
          type="button"
          onClick={onReturnHome}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#8CA195] hover:text-[#6BFF9C] transition-colors cursor-pointer mb-5"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Return to Home</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#0E2017] border border-[#234734] flex items-center justify-center text-[#6BFF9C] shrink-0">
            <ModuleIcon iconName={entry.iconName} size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#8CA195]">
              <span className="font-mono tabular-nums text-[#6BFF9C]">
                Module {String(entry.order).padStart(2, '0')}
              </span>{' '}
              <span aria-hidden="true">·</span> {category?.label ?? 'Workspace'}{' '}
              <span aria-hidden="true">·</span> Upcoming implementation
            </p>

            <h1 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#F5F7F2]">
              {entry.name}
            </h1>

            <p className="mt-3 text-sm sm:text-[15px] leading-[1.65] text-[#A1B0A6] max-w-[65ch]">
              {entry.summary}
            </p>

            <div className="mt-5 rounded-2xl bg-[#07110C] border border-[#1E3B2B] p-4 sm:p-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#F5F7F2]">
                Scheduled Build Phase
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#8CA195]">
                Only the initial <strong className="text-[#F5F7F2]">Home</strong>{' '}
                workspace is active in this first post-landing release.{' '}
                <strong className="text-[#F5F7F2]">{entry.name}</strong> is
                preserved in the navigation architecture and will be implemented
                individually in a dedicated module prompt without replacing Home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {relatedCapabilities.length > 0 && (
        <section className={`rounded-[26px] border p-6 sm:p-7 ${cardSurfaceClass}`}>
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
            <Layers size={16} className="text-[#6BFF9C]" aria-hidden="true" />
            <h2 className="text-base font-semibold text-[#F5F7F2]">
              Planned Shared Capability Integrations
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {relatedCapabilities.map((cap) => (
              <div
                key={cap.id}
                className="rounded-2xl bg-[#07110C]/90 border border-[#1E3B2B] p-4"
              >
                <p className="text-[11px] font-medium text-[#6BFF9C]">
                  {cap.groupLabel}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-[#F5F7F2]">
                  {cap.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#8CA195]">
                  {cap.summary}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
