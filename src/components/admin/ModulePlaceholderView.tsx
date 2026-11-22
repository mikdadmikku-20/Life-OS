import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { ADMIN_MODULES, MODULE_CATEGORIES } from '../../data/adminModules';
import { SHARED_CAPABILITIES } from '../../data/sharedCapabilities';
import { AdminModuleId, SharedCapabilityGroupId } from '../../types/workspace';
import { ModuleIcon } from './ModuleIcon';

interface ModulePlaceholderViewProps {
  moduleId: AdminModuleId;
  onBackToDashboard: () => void;
  onSelectModule: (id: AdminModuleId) => void;
}

const CAPABILITY_GROUPS: { id: SharedCapabilityGroupId; label: string }[] = [
  {
    id: 'capture-resources-knowledge',
    label: 'Capture, Resources & Knowledge',
  },
  {
    id: 'command-planning-decisions',
    label: 'Command, Planning & Decisions',
  },
  {
    id: 'execution-learning-improvement',
    label: 'Execution, Learning & Improvement',
  },
  {
    id: 'shared-interface-extensibility',
    label: 'Shared Interface & Extensibility',
  },
];

export const ModulePlaceholderView: React.FC<ModulePlaceholderViewProps> = ({
  moduleId,
  onBackToDashboard,
  onSelectModule,
}) => {
  const [showAllCapabilities, setShowAllCapabilities] = useState(
    moduleId === 'settings-personalization'
  );

  const mod =
    ADMIN_MODULES.find((m) => m.id === moduleId) ?? ADMIN_MODULES[0];
  const category = MODULE_CATEGORIES.find((c) => c.id === mod.categoryId);

  const connectedCapabilities = SHARED_CAPABILITIES.filter(
    (cap) =>
      cap.connectedModules.includes(mod.id) ||
      mod.plannedCapabilities.includes(cap.name)
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-6 sm:p-8">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A0A39A] hover:text-[#C5FF62] transition-colors cursor-pointer mb-5"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Return to Dashboard &amp; Daily Reflection</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#222329] border border-[#34382F] flex items-center justify-center text-[#C5FF62] shrink-0">
            <ModuleIcon iconName={mod.iconName} size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#A0A39A]">
              <span className="font-mono tabular-nums text-[#C5FF62]">
                Module {String(mod.number).padStart(2, '0')}
              </span>{' '}
              <span aria-hidden="true">·</span> {category?.label ?? 'Workspace'}{' '}
              <span aria-hidden="true">·</span> Planned route placeholder
            </p>

            <h1 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#F5F6F2]">
              {mod.name}
            </h1>

            <p className="mt-3 text-sm sm:text-[15px] leading-[1.65] text-[#A0A39A] max-w-[65ch]">
              {mod.shortDescription}
            </p>

            <div className="mt-5 rounded-2xl bg-[#101110] border border-[#272A26] p-4 sm:p-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#F5F6F2]">
                Module Implementation Status
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#A0A39A]">
                This screen is an architectural placeholder for{' '}
                <strong className="font-medium text-[#F5F6F2]">{mod.name}</strong>.
                Only the initial Admin Panel Dashboard shell and core daily
                workspace are active in this step. No backend persistence or
                module-specific workflows are wired here yet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Shared Capabilities */}
      <section
        aria-labelledby="module-capabilities-heading"
        className="rounded-[24px] bg-[#17181D] border border-[#2A2D28] p-6 sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#272A26]">
          <div>
            <h2
              id="module-capabilities-heading"
              className="text-base font-semibold text-[#F5F6F2]"
            >
              Connected Shared Capabilities
            </h2>
            <p className="mt-0.5 text-xs text-[#A0A39A]">
              Architectural integration points preserved for {mod.name}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllCapabilities((prev) => !prev)}
            className="inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 rounded-full bg-[#222329] border border-[#34382F] text-xs font-medium text-[#F5F6F2] hover:border-[#C5FF62]/50 hover:text-[#C5FF62] transition-colors cursor-pointer"
          >
            <Layers size={13} aria-hidden="true" />
            <span>
              {showAllCapabilities
                ? 'Hide Full 29-Capability Map'
                : 'Inspect All 29 Shared Capabilities'}
            </span>
            {showAllCapabilities ? (
              <ChevronDown size={13} aria-hidden="true" />
            ) : (
              <ChevronRight size={13} aria-hidden="true" />
            )}
          </button>
        </div>

        {connectedCapabilities.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {connectedCapabilities.map((cap) => (
              <div
                key={cap.id}
                className="rounded-2xl bg-[#101110]/85 border border-[#272A26] p-4"
              >
                <p className="text-[11px] font-medium text-[#C5FF62]">
                  {cap.groupLabel}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-[#F5F6F2]">
                  {cap.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#A0A39A]">
                  {cap.summary}
                </p>
              </div>
            ))}
          </div>
        )}

        {showAllCapabilities && (
          <div className="mt-6 pt-6 border-t border-[#272A26] space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F6F2]">
                Full TRCK MAIN Shared Capabilities Architecture (29)
              </h3>
              <p className="mt-0.5 text-xs text-[#A0A39A]">
                Preserved across 4 system groups for phased module integration.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {CAPABILITY_GROUPS.map((grp) => {
                const items = SHARED_CAPABILITIES.filter(
                  (c) => c.groupId === grp.id
                );
                return (
                  <div
                    key={grp.id}
                    className="rounded-2xl bg-[#101110] border border-[#272A26] p-4 sm:p-5"
                  >
                    <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#C5FF62]">
                      {grp.label} ({items.length})
                    </h4>
                    <ul className="mt-3 divide-y divide-[#272A26]">
                      {items.map((item) => (
                        <li key={item.id} className="py-2.5 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-medium text-[#F5F6F2]">
                              {item.name}
                            </p>
                            {item.connectedModules[0] && (
                              <button
                                type="button"
                                onClick={() =>
                                  onSelectModule(item.connectedModules[0])
                                }
                                className="text-[11px] text-[#A0A39A] hover:text-[#C5FF62] shrink-0 cursor-pointer"
                              >
                                View link
                              </button>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-[#A0A39A] leading-relaxed">
                            {item.summary}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
