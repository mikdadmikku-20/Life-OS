import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Info, LayoutDashboard, Menu, Plus, X } from 'lucide-react';
import { APP_SIDEBAR_ENTRIES } from '../../data/appHomeData';
import { useAppHomeState } from '../../hooks/useAppHomeState';
import { AppSidebarEntryId } from '../../types/appHome';
import { AppSidebar } from './AppSidebar';
import { AppTopBar } from './AppTopBar';
import { AppHomeView } from './AppHomeView';
import { UpcomingModuleView } from './UpcomingModuleView';

interface AppShellProps {
  onExitToLanding: () => void;
}

function resolveInitialModuleFromUrl(): AppSidebarEntryId {
  if (typeof window === 'undefined') return 'home';
  const params = new URLSearchParams(window.location.search);
  const mod = params.get('module');
  if (mod && APP_SIDEBAR_ENTRIES.some((e) => e.id === mod)) {
    return mod as AppSidebarEntryId;
  }
  return 'home';
}

export const AppShell: React.FC<AppShellProps> = ({ onExitToLanding }) => {
  const state = useAppHomeState();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [entryNoticeVisible, setEntryNoticeVisible] = useState(true);

  const quickCaptureInputRef = useRef<HTMLInputElement | null>(null);
  const copilotSectionRef = useRef<HTMLElement | null>(null);

  // Sync URL query module param on initial mount & browser back/forward navigation
  useEffect(() => {
    const initial = resolveInitialModuleFromUrl();
    if (initial !== 'home') {
      state.setActiveEntryId(initial);
    }

    const onPop = () => {
      const next = resolveInitialModuleFromUrl();
      state.setActiveEntryId(next);
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectEntry = useCallback(
    (entryId: AppSidebarEntryId) => {
      state.setActiveEntryId(entryId);
      try {
        const nextUrl =
          entryId === 'home'
            ? '/app'
            : `/app?module=${encodeURIComponent(entryId)}`;
        if (window.location.pathname + window.location.search !== nextUrl) {
          window.history.pushState({}, '', nextUrl);
        }
      } catch {
        // Fallback when running under constrained history environments
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [state]
  );

  const handleFocusQuickCapture = useCallback(() => {
    if (state.activeEntryId !== 'home') {
      handleSelectEntry('home');
      window.setTimeout(() => {
        quickCaptureInputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        quickCaptureInputRef.current?.focus();
      }, 140);
      return;
    }
    quickCaptureInputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    quickCaptureInputRef.current?.focus();
  }, [state.activeEntryId, handleSelectEntry]);

  const handleFocusCopilot = useCallback(() => {
    if (state.activeEntryId !== 'home') {
      handleSelectEntry('home');
      window.setTimeout(() => {
        copilotSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        copilotSectionRef.current?.focus();
      }, 140);
      return;
    }
    copilotSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    copilotSectionRef.current?.focus();
  }, [state.activeEntryId, handleSelectEntry]);

  const shellBackground =
    state.atmosphere === 'forest-glass'
      ? 'bg-[radial-gradient(ellipse_at_top_right,_rgba(30,130,76,0.16),_#060D09_48%,_#040806_100%)]'
      : 'bg-[#060706]';

  const cardSurfaceClass =
    state.atmosphere === 'forest-glass'
      ? 'bg-[#0B1711]/92 border-[#1B3A29] shadow-[0_24px_64px_rgba(0,0,0,0.45)]'
      : 'bg-[#0F1110] border-[#252A26] shadow-[0_24px_64px_rgba(0,0,0,0.55)]';

  return (
    <div
      className={`min-h-screen ${shellBackground} text-[#F5F7F2] flex transition-colors duration-200`}
    >
      {/* Left Navigation Rail (24 Entries: Home + 23 Original Modules) */}
      <AppSidebar
        activeEntryId={state.activeEntryId}
        onSelectEntry={handleSelectEntry}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onExitToLanding={onExitToLanding}
        atmosphere={state.atmosphere}
      />

      {/* Right Workspace Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <AppTopBar
          sidebarCollapsed={sidebarCollapsed}
          onToggleDesktopSidebar={() => setSidebarCollapsed((c) => !c)}
          onOpenMobileDrawer={() => setMobileMenuOpen(true)}
          atmosphere={state.atmosphere}
          onChangeAtmosphere={state.setAtmosphere}
          onSelectEntry={handleSelectEntry}
          onFocusQuickCapture={handleFocusQuickCapture}
          onFocusCopilot={handleFocusCopilot}
          onExitToLanding={onExitToLanding}
          notifications={state.notifications}
          onMarkNotificationRead={state.markNotificationRead}
          onMarkAllNotificationsRead={state.markAllNotificationsRead}
          tasks={state.tasks}
          goals={state.goals}
          projects={state.projects}
          scheduleSlots={state.scheduleSlots}
          documents={state.documents}
          recentActivity={state.recentActivity}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 lg:pb-10 max-w-[1460px] w-full mx-auto">
          {/* Isolated Development Entry Disclosure */}
          {entryNoticeVisible && (
            <div
              role="note"
              className="mb-5 rounded-2xl bg-[#0A1811] border border-[#224632] px-4 py-3 flex items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start sm:items-center gap-2.5 text-[#A1B0A6]">
                <Info
                  size={15}
                  className="text-[#6BFF9C] shrink-0 mt-0.5 sm:mt-0"
                  aria-hidden="true"
                />
                <p>
                  <span className="font-semibold text-[#F5F7F2]">
                    TRCK MAIN App Entry (Development Flow):
                  </span>{' '}
                  Entered via Get Started without account creation yet. Cards
                  blend baseline sample records with live session state while
                  modules 2–24 remain cleanly staged as Upcoming.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEntryNoticeVisible(false)}
                aria-label="Dismiss entry notice"
                className="text-[#8CA195] hover:text-[#F5F7F2] p-1 cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {state.activeEntryId === 'home' ? (
            <AppHomeView
              cardSurfaceClass={cardSurfaceClass}
              dailyIntention={state.dailyIntention}
              onUpdateIntention={state.setDailyIntention}
              selectedDayOffset={state.selectedDayOffset}
              onChangeDayOffset={state.setSelectedDayOffset}
              scheduleSlots={state.scheduleSlots}
              growthAreas={state.growthAreas}
              selectedGrowthAreaId={state.selectedGrowthAreaId}
              onSelectGrowthArea={state.setSelectedGrowthAreaId}
              documents={state.documents}
              computedScore={state.computedScore}
              scoreWeights={state.scoreWeights}
              onChangeScoreWeights={state.setScoreWeights}
              mainTask={state.mainTask}
              tasks={state.tasks}
              onToggleTask={state.toggleTask}
              focusRunning={state.focusRunning}
              onToggleFocus={() => state.setFocusRunning((r) => !r)}
              focusSecondsLeft={state.focusSecondsLeft}
              onResetFocus={state.resetFocusTimer}
              activeGoalsPercent={state.activeGoalsPercent}
              copilotRows={state.copilotRows}
              copilotAdjustmentApplied={state.copilotAdjustmentApplied}
              copilotAdjustmentDismissed={state.copilotAdjustmentDismissed}
              onApplyCopilotFix={state.applyCopilotScheduleFix}
              onDismissCopilotFix={state.dismissCopilotScheduleFix}
              goals={state.goals}
              projects={state.projects}
              commitments={state.commitments}
              lifeRings={state.lifeRings}
              capturedRecords={state.capturedRecords}
              onSubmitCapture={state.submitQuickCapture}
              recentActivity={state.recentActivity}
              onNavigateEntry={handleSelectEntry}
              quickCaptureInputRef={quickCaptureInputRef}
              copilotSectionRef={copilotSectionRef}
            />
          ) : (
            <UpcomingModuleView
              entryId={state.activeEntryId}
              onReturnHome={() => handleSelectEntry('home')}
              cardSurfaceClass={cardSurfaceClass}
            />
          )}
        </main>
      </div>

      {/* Compact Mobile Bottom Quick Bar (<= 56px height) */}
      <nav
        aria-label="Mobile quick actions"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-[#07120C]/95 border-t border-[#1D3B2A] px-3 flex items-center justify-around"
      >
        <button
          type="button"
          onClick={() => handleSelectEntry('home')}
          className={`inline-flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[11px] font-medium cursor-pointer ${
            state.activeEntryId === 'home' ? 'text-[#6BFF9C]' : 'text-[#8CA195]'
          }`}
        >
          <LayoutDashboard size={16} aria-hidden="true" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={handleFocusQuickCapture}
          className="inline-flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[11px] font-medium text-[#C5FF62] cursor-pointer"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Capture</span>
        </button>

        <button
          type="button"
          onClick={handleFocusCopilot}
          className="inline-flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[11px] font-medium text-[#8CA195] hover:text-[#F5F7F2] cursor-pointer"
        >
          <Bot size={16} aria-hidden="true" />
          <span>Co-pilot</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="inline-flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[11px] font-medium text-[#8CA195] hover:text-[#F5F7F2] cursor-pointer"
        >
          <Menu size={16} aria-hidden="true" />
          <span>Modules</span>
        </button>
      </nav>
    </div>
  );
};
