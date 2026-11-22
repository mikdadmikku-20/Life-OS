import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LayoutGrid,
  X,
} from 'lucide-react';
import { BrandMark } from '../BrandMark';
import { ModuleIcon } from '../admin/ModuleIcon';
import {
  APP_NAV_CATEGORIES,
  APP_SIDEBAR_ENTRIES,
} from '../../data/appHomeData';
import {
  AppAtmosphereTheme,
  AppNavCategoryId,
  AppSidebarEntryId,
} from '../../types/appHome';

interface AppSidebarProps {
  activeEntryId: AppSidebarEntryId;
  onSelectEntry: (id: AppSidebarEntryId) => void;
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onExitToLanding: () => void;
  atmosphere: AppAtmosphereTheme;
}

const PRIMARY_CAPSULE_IDS: AppSidebarEntryId[] = [
  'home',
  'daily-schedule-tracker-planner',
  'goal-planner',
  'progress-analytics',
  'dashboard-daily-reflection',
];

const BOTTOM_CAPSULE_IDS: AppSidebarEntryId[] = [
  'ai-assistant',
  'settings-personalization',
];

interface RailIconButtonProps {
  label: string;
  sublabel?: string;
  isActive?: boolean;
  onClick: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
}

const RailIconButton: React.FC<RailIconButtonProps> = ({
  label,
  sublabel,
  isActive = false,
  onClick,
  ariaLabel,
  children,
}) => {
  const [revealed, setRevealed] = useState(false);
  const touchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (touchTimerRef.current !== null) {
        window.clearTimeout(touchTimerRef.current);
      }
    };
  }, []);

  const handleTouchStart = () => {
    setRevealed(true);
    if (touchTimerRef.current !== null) {
      window.clearTimeout(touchTimerRef.current);
    }
    touchTimerRef.current = window.setTimeout(() => {
      setRevealed(false);
    }, 1800);
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setRevealed(true)}
        onMouseLeave={() => setRevealed(false)}
        onFocus={() => setRevealed(true)}
        onBlur={() => setRevealed(false)}
        onTouchStart={handleTouchStart}
        aria-current={isActive ? 'page' : undefined}
        aria-label={ariaLabel ?? label}
        className={`relative w-11 h-11 rounded-full inline-flex items-center justify-center transition-all duration-200 cursor-pointer ${
          isActive
            ? 'bg-gradient-to-br from-[#9CFFBE] via-[#51F395] to-[#23D16B] text-[#041009] shadow-[0_0_22px_rgba(81,243,149,0.52)] scale-[1.03]'
            : 'text-[#B5C6BC] hover:text-[#F5F7F2] hover:bg-white/[0.08]'
        }`}
      >
        {children}
      </button>

      {/* Floating name label revealed when hovering, focusing, or touching the button */}
      <div
        role="tooltip"
        aria-hidden={!revealed}
        className={`pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-50 px-3 py-1.5 rounded-xl bg-[#0B1E14] border border-[#3DF58B]/40 shadow-[0_14px_32px_rgba(0,0,0,0.78)] whitespace-nowrap transition-all duration-150 ${
          revealed
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-1.5'
        }`}
      >
        <span className="text-xs font-semibold text-[#F5F7F2]">{label}</span>
        {sublabel && (
          <span className="ml-1.5 text-[11px] font-medium text-[#7FE8A9]">
            · {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeEntryId,
  onSelectEntry,
  collapsed,
  mobileOpen,
  onCloseMobile,
  onExitToLanding,
  atmosphere,
}) => {
  const [openCategories, setOpenCategories] = useState<
    Record<AppNavCategoryId, boolean>
  >(() => {
    const map = {} as Record<AppNavCategoryId, boolean>;
    for (const cat of APP_NAV_CATEGORIES) {
      map[cat.id] = cat.defaultOpen;
    }
    return map;
  });

  const [modulesFlyoutOpen, setModulesFlyoutOpen] = useState(false);
  const flyoutRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const active = APP_SIDEBAR_ENTRIES.find((e) => e.id === activeEntryId);
    if (active) {
      setOpenCategories((prev) =>
        prev[active.categoryId] ? prev : { ...prev, [active.categoryId]: true }
      );
    }
  }, [activeEntryId]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseMobile();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, onCloseMobile]);

  useEffect(() => {
    if (!modulesFlyoutOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setModulesFlyoutOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModulesFlyoutOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [modulesFlyoutOpen]);

  const toggleCategory = (catId: AppNavCategoryId) => {
    setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleEntrySelect = (id: AppSidebarEntryId) => {
    onSelectEntry(id);
    setModulesFlyoutOpen(false);
    onCloseMobile();
  };

  const surfaceBg =
    atmosphere === 'forest-glass'
      ? 'bg-[#07150E] border-[#173324]'
      : 'bg-[#080A09] border-[#202420]';

  const capsuleBg =
    atmosphere === 'forest-glass'
      ? 'bg-[#0F241A]/95 border-white/[0.08]'
      : 'bg-[#121513]/95 border-white/[0.08]';

  const primaryEntries = PRIMARY_CAPSULE_IDS.map((id) =>
    APP_SIDEBAR_ENTRIES.find((e) => e.id === id)
  ).filter((e): e is NonNullable<typeof e> => Boolean(e));

  const bottomEntries = BOTTOM_CAPSULE_IDS.map((id) =>
    APP_SIDEBAR_ENTRIES.find((e) => e.id === id)
  ).filter((e): e is NonNullable<typeof e> => Boolean(e));

  const isActiveInExtraModules =
    !PRIMARY_CAPSULE_IDS.includes(activeEntryId) &&
    !BOTTOM_CAPSULE_IDS.includes(activeEntryId);

  const renderCollapsedRail = () => (
    <div
      className={`flex flex-col items-center justify-between h-full border-r ${surfaceBg} py-4 px-2.5 transition-colors duration-200 select-none`}
    >
      {/* Top Group: Brand icon + Signature Floating Capsule + Modules Launcher */}
      <div className="flex flex-col items-center gap-5 w-full">
        <button
          type="button"
          onClick={() => handleEntrySelect('home')}
          aria-label="TRCK MAIN Home"
          className="inline-flex items-center justify-center rounded-xl p-1 cursor-pointer"
        >
          <BrandMark showWordmark={false} />
        </button>

        {/* Primary Floating Capsule (Matching Image 2 Reference) */}
        <nav
          aria-label="TRCK MAIN Primary Navigation"
          className={`flex flex-col items-center gap-1.5 p-1.5 rounded-full border ${capsuleBg} shadow-[0_14px_34px_rgba(0,0,0,0.48)]`}
        >
          {primaryEntries.map((entry) => {
            const isActive = activeEntryId === entry.id;
            return (
              <RailIconButton
                key={entry.id}
                label={entry.name}
                sublabel={entry.status === 'upcoming' ? 'Upcoming' : undefined}
                isActive={isActive}
                onClick={() => handleEntrySelect(entry.id)}
              >
                <ModuleIcon iconName={entry.iconName} size={18} />
              </RailIconButton>
            );
          })}
        </nav>

        {/* All 24 Modules Flyout Trigger */}
        <div ref={flyoutRef} className="relative">
          <div
            className={`p-1.5 rounded-full border ${capsuleBg} shadow-[0_10px_28px_rgba(0,0,0,0.4)]`}
          >
            <RailIconButton
              label="All Modules (24)"
              sublabel={modulesFlyoutOpen ? 'Close' : 'Browse'}
              isActive={modulesFlyoutOpen || isActiveInExtraModules}
              onClick={() => setModulesFlyoutOpen((o) => !o)}
              ariaLabel="Browse all 24 workspace modules"
            >
              <LayoutGrid size={18} />
            </RailIconButton>
          </div>

          {modulesFlyoutOpen && (
            <div
              role="dialog"
              aria-label="All 24 TRCK MAIN Modules"
              className="absolute left-[calc(100%+16px)] top-0 w-[296px] max-h-[72vh] overflow-y-auto scrollbar-trck rounded-[24px] bg-[#0B1C13]/98 border border-[#234B35] p-3.5 shadow-[0_24px_64px_rgba(0,0,0,0.88)] z-50"
            >
              <div className="flex items-center justify-between px-1.5 pb-2.5 mb-2.5 border-b border-white/[0.07]">
                <div>
                  <p className="text-xs font-semibold text-[#F5F7F2]">
                    TRCK MAIN Modules
                  </p>
                  <p className="text-[11px] text-[#8CA195]">
                    Home active · 23 modules mapped
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModulesFlyoutOpen(false)}
                  aria-label="Close modules menu"
                  className="w-7 h-7 rounded-full bg-[#11271C] border border-[#234B35] flex items-center justify-center text-[#A1B0A6] hover:text-[#F5F7F2] cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="space-y-3">
                {APP_NAV_CATEGORIES.map((category) => {
                  const entries = APP_SIDEBAR_ENTRIES.filter(
                    (e) => e.categoryId === category.id
                  );
                  return (
                    <div key={category.id} className="space-y-1">
                      <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#7A9486]">
                        {category.label}
                      </p>
                      <ul className="space-y-0.5">
                        {entries.map((entry) => {
                          const isActive = activeEntryId === entry.id;
                          return (
                            <li key={entry.id}>
                              <button
                                type="button"
                                onClick={() => handleEntrySelect(entry.id)}
                                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                                  isActive
                                    ? 'bg-[#6BFF9C] text-[#050C08] font-semibold'
                                    : 'text-[#C2D0C8] hover:text-[#F5F7F2] hover:bg-white/[0.06]'
                                }`}
                              >
                                <span className="flex items-center gap-2 min-w-0">
                                  <ModuleIcon
                                    iconName={entry.iconName}
                                    size={14}
                                    className={
                                      isActive
                                        ? 'text-[#050C08] shrink-0'
                                        : 'text-[#8CA195] shrink-0'
                                    }
                                  />
                                  <span className="truncate">{entry.name}</span>
                                </span>
                                {entry.status === 'upcoming' && !isActive && (
                                  <span className="text-[10px] text-[#7A8D81] shrink-0">
                                    Upcoming
                                  </span>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Capsule (AI Assistant, Settings, Return to Landing Page) */}
      <div
        className={`flex flex-col items-center gap-1.5 p-1.5 rounded-full border ${capsuleBg} shadow-[0_14px_34px_rgba(0,0,0,0.48)]`}
      >
        {bottomEntries.map((entry) => {
          const isActive = activeEntryId === entry.id;
          return (
            <RailIconButton
              key={entry.id}
              label={entry.name}
              sublabel={entry.status === 'upcoming' ? 'Upcoming' : undefined}
              isActive={isActive}
              onClick={() => handleEntrySelect(entry.id)}
            >
              <ModuleIcon iconName={entry.iconName} size={18} />
            </RailIconButton>
          );
        })}

        <RailIconButton
          label="Back to Landing Page"
          onClick={() => {
            onCloseMobile();
            onExitToLanding();
          }}
        >
          <ExternalLink size={17} />
        </RailIconButton>
      </div>
    </div>
  );

  const renderExpandedRail = () => (
    <div
      className={`flex flex-col h-full border-r ${surfaceBg} transition-colors duration-200`}
    >
      {/* Top Brand Header */}
      <div className="h-[68px] flex items-center justify-between px-5 border-b border-white/[0.06] shrink-0">
        <button
          type="button"
          onClick={() => handleEntrySelect('home')}
          aria-label="TRCK MAIN Home"
          className="inline-flex items-center rounded-lg py-1 cursor-pointer"
        >
          <BrandMark showWordmark />
        </button>

        {mobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0E1E16] border border-[#224432] text-[#F5F7F2] hover:border-[#C5FF62]/55 cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Scrollable Navigation Groups (24 Entries: Home + 23 Original Modules) */}
      <nav
        aria-label="TRCK MAIN Workspace Navigation"
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-trck py-4 px-2.5 space-y-4"
      >
        {APP_NAV_CATEGORIES.map((category) => {
          const entries = APP_SIDEBAR_ENTRIES.filter(
            (e) => e.categoryId === category.id
          );
          const isOpen = openCategories[category.id];

          return (
            <div key={category.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.09em] uppercase text-[#8CA195] hover:text-[#F5F7F2] transition-colors cursor-pointer rounded-lg"
              >
                <span className="truncate">{category.label}</span>
                {isOpen ? (
                  <ChevronDown size={13} aria-hidden="true" />
                ) : (
                  <ChevronRight size={13} aria-hidden="true" />
                )}
              </button>

              {isOpen && (
                <ul className="space-y-1">
                  {entries.map((entry) => {
                    const isActive = activeEntryId === entry.id;
                    const isUpcoming = entry.status === 'upcoming';

                    return (
                      <li key={entry.id}>
                        <button
                          type="button"
                          onClick={() => handleEntrySelect(entry.id)}
                          aria-current={isActive ? 'page' : undefined}
                          title={entry.name}
                          className={`w-full flex items-center justify-between gap-2 min-h-[42px] rounded-2xl px-3 py-2 text-left transition-all duration-150 cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-[#8EFFB8] to-[#3DF58B] text-[#050C08] font-semibold shadow-[0_8px_24px_rgba(107,255,156,0.22)]'
                              : 'text-[#A1B0A6] hover:text-[#F5F7F2] hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <ModuleIcon
                              iconName={entry.iconName}
                              size={17}
                              className={
                                isActive
                                  ? 'text-[#050C08] shrink-0'
                                  : 'text-[#8CA195] shrink-0'
                              }
                            />
                            <span className="text-[13px] leading-tight truncate">
                              {entry.name}
                            </span>
                          </span>

                          {isUpcoming && !isActive && (
                            <span className="text-[10px] font-medium text-[#7A8D81] shrink-0">
                              Upcoming
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Landing Exit & Architecture Note */}
      <div className="p-3 border-t border-white/[0.06] shrink-0 space-y-1">
        <p className="px-2.5 py-1 text-[11px] text-[#7A8D81]">
          Home active · 23 modules mapped
        </p>
        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            onExitToLanding();
          }}
          className="w-full flex items-center gap-2.5 px-3 rounded-xl min-h-[40px] text-xs font-medium text-[#A1B0A6] hover:text-[#C5FF62] hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
          <ExternalLink size={15} aria-hidden="true" className="shrink-0" />
          <span className="truncate">Back to Landing Page</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Rail (Defaults to compact floating capsule icon rail matching Image 2) */}
      <aside
        aria-label="Main workspace sidebar"
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-[width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 ${
          collapsed ? 'w-[84px]' : 'w-[272px]'
        }`}
      >
        {collapsed ? renderCollapsedRail() : renderExpandedRail()}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
        >
          <div
            className="fixed inset-0 bg-[#040906]/80"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[290px] max-w-[85vw] h-full shadow-2xl">
            {renderExpandedRail()}
          </aside>
        </div>
      )}
    </>
  );
};
