import React, { useRef, useState } from 'react';
import { useWorkspaceState } from '../../hooks/useWorkspaceState';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { CustomizeDashboardModal } from './CustomizeDashboardModal';
import { DashboardHomeView } from './DashboardHomeView';
import { ModulePlaceholderView } from './ModulePlaceholderView';

interface AdminShellProps {
  onExitToLanding: () => void;
}

export const AdminShell: React.FC<AdminShellProps> = ({ onExitToLanding }) => {
  const workspace = useWorkspaceState();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const quickCaptureInputRef = useRef<HTMLInputElement | null>(null);
  const contextualAiInputRef = useRef<HTMLInputElement | null>(null);

  const focusElementSafely = (
    targetId: string,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    if (workspace.activeModuleId !== 'dashboard-daily-reflection') {
      workspace.setActiveModuleId('dashboard-daily-reflection');
      window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        inputRef.current?.focus();
      }, 80);
      return;
    }

    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 180);
  };

  return (
    <div className="min-h-screen bg-[#090A09] text-[#F5F6F2] flex">
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-[#C5FF62] focus:text-[#090A09] focus:text-sm focus:font-semibold"
      >
        Skip to workspace content
      </a>

      <AdminSidebar
        activeModuleId={workspace.activeModuleId}
        onSelectModule={workspace.setActiveModuleId}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
        onExitToLanding={onExitToLanding}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopBar
          sidebarCollapsed={sidebarCollapsed}
          onToggleDesktopSidebar={() => setSidebarCollapsed((c) => !c)}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
          onSelectModule={workspace.setActiveModuleId}
          onFocusQuickCapture={() =>
            focusElementSafely('quick-capture-widget', quickCaptureInputRef)
          }
          onFocusContextualAi={() =>
            focusElementSafely('contextual-ai-panel', contextualAiInputRef)
          }
          onExitToLanding={onExitToLanding}
          notifications={workspace.notifications}
          onMarkNotificationRead={workspace.markNotificationRead}
          onMarkAllNotificationsRead={workspace.markAllNotificationsRead}
          tasks={workspace.tasks}
          goals={workspace.goals}
          projects={workspace.projects}
          commitments={workspace.commitments}
        />

        <main
          id="admin-main-content"
          className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] w-full mx-auto"
        >
          {workspace.activeModuleId === 'dashboard-daily-reflection' ? (
            <DashboardHomeView
              dailyIntention={workspace.dailyIntention}
              onUpdateIntention={workspace.setDailyIntention}
              tasks={workspace.tasks}
              onToggleTask={workspace.toggleTask}
              onAddTask={workspace.addTask}
              schedule={workspace.schedule}
              goals={workspace.goals}
              projects={workspace.projects}
              lifeProgress={workspace.lifeProgress}
              commitments={workspace.commitments}
              capturedItems={workspace.capturedItems}
              onCaptureItem={workspace.captureItem}
              briefing={workspace.briefing}
              onRefreshBriefing={workspace.refreshBriefing}
              onApproveAdjustment={workspace.approveSuggestedAdjustment}
              onDismissAdjustment={workspace.dismissSuggestedAdjustment}
              assistantHistory={workspace.assistantHistory}
              onRunAssistantPrompt={workspace.runContextualAssistantPrompt}
              layoutPreferences={workspace.layoutPreferences}
              onOpenCustomize={() => setCustomizeOpen(true)}
              onRestoreDefaults={workspace.restoreDefaultLayout}
              onNavigateModule={workspace.setActiveModuleId}
              quickCaptureInputRef={quickCaptureInputRef}
              contextualAiInputRef={contextualAiInputRef}
            />
          ) : (
            <ModulePlaceholderView
              moduleId={workspace.activeModuleId}
              onBackToDashboard={() =>
                workspace.setActiveModuleId('dashboard-daily-reflection')
              }
              onSelectModule={workspace.setActiveModuleId}
            />
          )}
        </main>
      </div>

      <CustomizeDashboardModal
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        preferences={workspace.layoutPreferences}
        onToggleVisibility={workspace.toggleWidgetVisibility}
        onMoveWidget={workspace.moveWidgetOrder}
        onRestoreDefaults={workspace.restoreDefaultLayout}
      />
    </div>
  );
};
