import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Bot,
  Check,
  ChevronDown,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  User,
  ExternalLink,
} from 'lucide-react';
import { ADMIN_MODULES } from '../../data/adminModules';
import { SHARED_CAPABILITIES } from '../../data/sharedCapabilities';
import {
  AdminModuleId,
  UpcomingCommitment,
  WorkspaceGoal,
  WorkspaceNotification,
  WorkspaceProject,
  WorkspaceTask,
} from '../../types/workspace';
import { ModuleIcon } from './ModuleIcon';

interface AdminTopBarProps {
  sidebarCollapsed: boolean;
  onToggleDesktopSidebar: () => void;
  onOpenMobileDrawer: () => void;
  onSelectModule: (id: AdminModuleId) => void;
  onFocusQuickCapture: () => void;
  onFocusContextualAi: () => void;
  onExitToLanding: () => void;
  notifications: WorkspaceNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  tasks: WorkspaceTask[];
  goals: WorkspaceGoal[];
  projects: WorkspaceProject[];
  commitments: UpcomingCommitment[];
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  sidebarCollapsed,
  onToggleDesktopSidebar,
  onOpenMobileDrawer,
  onSelectModule,
  onFocusQuickCapture,
  onFocusContextualAi,
  onExitToLanding,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  tasks,
  goals,
  projects,
  commitments,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchFocused(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedModules = ADMIN_MODULES.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.shortDescription.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedTasks = tasks
      .filter((t) => t.title.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedGoals = goals
      .filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.currentMilestone.toLowerCase().includes(q)
      )
      .slice(0, 2);

    const matchedProjects = projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nextMilestone.toLowerCase().includes(q)
      )
      .slice(0, 2);

    const matchedCommitments = commitments
      .filter((c) => c.title.toLowerCase().includes(q))
      .slice(0, 2);

    const matchedCapabilities = SHARED_CAPABILITIES.filter(
      (cap) =>
        cap.name.toLowerCase().includes(q) ||
        cap.groupLabel.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      matchedModules,
      matchedTasks,
      matchedGoals,
      matchedProjects,
      matchedCommitments,
      matchedCapabilities,
      total:
        matchedModules.length +
        matchedTasks.length +
        matchedGoals.length +
        matchedProjects.length +
        matchedCommitments.length +
        matchedCapabilities.length,
    };
  }, [searchQuery, tasks, goals, projects, commitments]);

  return (
    <header className="sticky top-0 z-20 h-[68px] bg-[#090A09]/95 border-b border-[#272A26] px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left: Sidebar Toggle + Global Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#17181D] border border-[#2D312C] text-[#F5F6F2] hover:border-[#C5FF62]/50 transition-colors cursor-pointer shrink-0"
        >
          <Menu size={18} />
        </button>

        <button
          type="button"
          onClick={onToggleDesktopSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#17181D] border border-[#2D312C] text-[#A0A39A] hover:text-[#F5F6F2] hover:border-[#C5FF62]/45 transition-colors cursor-pointer shrink-0"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen size={17} />
          ) : (
            <PanelLeftClose size={17} />
          )}
        </button>

        {/* Global Search Input */}
        <div ref={searchContainerRef} className="relative flex-1 min-w-0">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0A39A]"
          />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchFocused(true);
            }}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search modules, tasks, goals, or capabilities (press /)..."
            aria-label="Global workspace search"
            className="w-full h-10 pl-10 pr-4 rounded-full bg-[#101110] border border-[#2D312C] focus:border-[#C5FF62] focus:outline-none text-sm text-[#F5F6F2] placeholder:text-[#A0A39A]/80 transition-colors"
          />

          {searchFocused && searchResults && (
            <div
              role="region"
              aria-label="Search results"
              className="absolute left-0 right-0 top-[46px] rounded-2xl bg-[#17181D] border border-[#34382F] shadow-[0_24px_64px_rgba(0,0,0,0.75)] p-3 max-h-[70vh] overflow-y-auto z-40"
            >
              <div className="px-2 pb-2 mb-2 border-b border-[#272A26] flex items-center justify-between gap-2 text-[11px] text-[#A0A39A]">
                <span>Local preview search · Global Search &amp; Personal Memory slot</span>
                <span className="font-mono tabular-nums">{searchResults.total} found</span>
              </div>

              {searchResults.total === 0 ? (
                <p className="px-2 py-4 text-sm text-[#A0A39A] text-center">
                  No matching modules or local sample items for &ldquo;{searchQuery}&rdquo;.
                </p>
              ) : (
                <div className="space-y-3">
                  {searchResults.matchedModules.length > 0 && (
                    <div>
                      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A0A39A] mb-1">
                        Modules
                      </p>
                      <div className="space-y-0.5">
                        {searchResults.matchedModules.map((mod) => (
                          <button
                            key={mod.id}
                            type="button"
                            onClick={() => {
                              onSelectModule(mod.id);
                              setSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-sm text-[#F5F6F2] hover:bg-[#222329] transition-colors cursor-pointer"
                          >
                            <ModuleIcon
                              iconName={mod.iconName}
                              size={15}
                              className="text-[#C5FF62] shrink-0"
                            />
                            <span className="truncate">{mod.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(searchResults.matchedTasks.length > 0 ||
                    searchResults.matchedGoals.length > 0 ||
                    searchResults.matchedProjects.length > 0 ||
                    searchResults.matchedCommitments.length > 0) && (
                    <div>
                      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A0A39A] mb-1">
                        Dashboard Items (Sample / Local)
                      </p>
                      <div className="space-y-0.5">
                        {searchResults.matchedTasks.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              onSelectModule('dashboard-daily-reflection');
                              setSearchFocused(false);
                            }}
                            className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-[#F5F6F2] hover:bg-[#222329] cursor-pointer"
                          >
                            <span className="truncate">{t.title}</span>
                            <span className="text-[#A0A39A] shrink-0">Priority task</span>
                          </button>
                        ))}
                        {searchResults.matchedGoals.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              onSelectModule('goal-planner');
                              setSearchFocused(false);
                            }}
                            className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-[#F5F6F2] hover:bg-[#222329] cursor-pointer"
                          >
                            <span className="truncate">{g.title}</span>
                            <span className="text-[#A0A39A] shrink-0">Goal</span>
                          </button>
                        ))}
                        {searchResults.matchedProjects.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              onSelectModule('project-planner');
                              setSearchFocused(false);
                            }}
                            className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-[#F5F6F2] hover:bg-[#222329] cursor-pointer"
                          >
                            <span className="truncate">{p.name}</span>
                            <span className="text-[#A0A39A] shrink-0">Project</span>
                          </button>
                        ))}
                        {searchResults.matchedCommitments.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              onSelectModule(c.moduleId);
                              setSearchFocused(false);
                            }}
                            className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-[#F5F6F2] hover:bg-[#222329] cursor-pointer"
                          >
                            <span className="truncate">{c.title}</span>
                            <span className="text-[#A0A39A] shrink-0">{c.moduleName}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.matchedCapabilities.length > 0 && (
                    <div>
                      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A0A39A] mb-1">
                        Planned Shared Capabilities
                      </p>
                      <div className="space-y-0.5">
                        {searchResults.matchedCapabilities.map((cap) => (
                          <button
                            key={cap.id}
                            type="button"
                            onClick={() => {
                              onSelectModule(cap.connectedModules[0] ?? 'settings-personalization');
                              setSearchFocused(false);
                            }}
                            className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-[#F5F6F2] hover:bg-[#222329] cursor-pointer"
                          >
                            <span className="truncate">{cap.name}</span>
                            <span className="text-[#A0A39A] shrink-0">{cap.groupLabel}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Capture, Notifications, AI Shortcut, Profile Menu */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onFocusQuickCapture}
          className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 sm:px-4 rounded-full bg-[#C5FF62] text-[#090A09] text-xs sm:text-sm font-semibold hover:bg-[#D5FF8D] active:scale-[0.985] transition-all cursor-pointer whitespace-nowrap shrink-0"
          aria-label="Quick Capture"
        >
          <Plus size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Quick Capture</span>
        </button>

        {/* AI Assistant Shortcut */}
        <button
          type="button"
          onClick={onFocusContextualAi}
          aria-label="Open Contextual AI Assistant"
          title="AI Assistant shortcut"
          className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-full bg-[#17181D] border border-[#2D312C] text-[#F5F6F2] hover:border-[#C5FF62]/50 hover:text-[#C5FF62] transition-colors cursor-pointer shrink-0"
        >
          <Bot size={16} aria-hidden="true" />
          <span className="hidden xl:inline text-xs font-medium whitespace-nowrap">
            AI Assistant
          </span>
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((o) => !o);
              setProfileOpen(false);
            }}
            aria-expanded={notificationsOpen}
            aria-label={`Notifications (${unreadCount} unread sample alerts)`}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#17181D] border border-[#2D312C] text-[#F5F6F2] hover:border-[#C5FF62]/50 transition-colors cursor-pointer"
          >
            <Bell size={16} aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C5FF62] text-[#090A09] font-mono text-[10px] font-bold tabular-nums flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              role="region"
              aria-label="Sample workspace notifications"
              className="absolute right-0 top-[46px] w-[310px] sm:w-[340px] rounded-2xl bg-[#17181D] border border-[#34382F] shadow-[0_24px_64px_rgba(0,0,0,0.82)] p-3.5 z-40"
            >
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#272A26]">
                <div>
                  <h3 className="text-xs font-semibold text-[#F5F6F2]">
                    Notifications
                  </h3>
                  <p className="text-[11px] text-[#A0A39A]">
                    Sample preview alerts (local state)
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllNotificationsRead}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C5FF62] hover:underline cursor-pointer"
                  >
                    <Check size={12} aria-hidden="true" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <ul className="mt-2 divide-y divide-[#272A26] max-h-[280px] overflow-y-auto">
                {notifications.map((notif) => (
                  <li key={notif.id} className="py-2.5 first:pt-1 last:pb-1">
                    <button
                      type="button"
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className="w-full text-left rounded-lg p-1.5 hover:bg-[#222329] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-xs font-medium ${
                            notif.read ? 'text-[#A0A39A]' : 'text-[#F5F6F2]'
                          }`}
                        >
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-[#A0A39A] shrink-0">
                          {notif.read ? 'Read' : 'Unread'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-[1.5] text-[#A0A39A]">
                        {notif.detail}
                      </p>
                      <p className="mt-1 text-[10px] text-[#A0A39A]/80">
                        {notif.timeLabel}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotificationsOpen(false);
            }}
            aria-expanded={profileOpen}
            aria-label="Profile and workspace menu"
            className="inline-flex items-center gap-2 h-10 pl-1.5 pr-2.5 rounded-full bg-[#17181D] border border-[#2D312C] hover:border-[#C5FF62]/45 transition-colors cursor-pointer"
          >
            <span className="w-7 h-7 rounded-full bg-[#222329] border border-[#34382F] flex items-center justify-center text-[#C5FF62]">
              <User size={14} aria-hidden="true" />
            </span>
            <span className="hidden md:inline text-xs font-medium text-[#F5F6F2] whitespace-nowrap">
              Preview Profile
            </span>
            <ChevronDown size={13} className="text-[#A0A39A]" aria-hidden="true" />
          </button>

          {profileOpen && (
            <div
              role="menu"
              aria-label="Profile options"
              className="absolute right-0 top-[46px] w-[250px] rounded-2xl bg-[#17181D] border border-[#34382F] shadow-[0_24px_64px_rgba(0,0,0,0.82)] p-2 z-40"
            >
              <div className="px-3 py-2 border-b border-[#272A26] mb-1.5">
                <p className="text-xs font-semibold text-[#F5F6F2]">
                  Workspace Member
                </p>
                <p className="text-[11px] text-[#A0A39A]">
                  Development Preview · Auth not active
                </p>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  onSelectModule('settings-personalization');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#F5F6F2] hover:bg-[#222329] transition-colors cursor-pointer text-left"
              >
                <Settings size={14} className="text-[#A0A39A]" aria-hidden="true" />
                <span>Account &amp; Settings (Placeholder)</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  onExitToLanding();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#F5F6F2] hover:bg-[#222329] transition-colors cursor-pointer text-left"
              >
                <ExternalLink size={14} className="text-[#A0A39A]" aria-hidden="true" />
                <span>Public Landing Page</span>
              </button>

              <div className="my-1 border-t border-[#272A26]" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  onExitToLanding();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#A0A39A] hover:text-[#F5F6F2] hover:bg-[#222329] transition-colors cursor-pointer text-left"
              >
                <LogOut size={14} aria-hidden="true" />
                <span>Sign Out (Placeholder)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
