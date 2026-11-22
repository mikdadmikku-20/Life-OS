import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Bot,
  Check,
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Sparkles,
  User,
} from 'lucide-react';
import { APP_SIDEBAR_ENTRIES } from '../../data/appHomeData';
import {
  ActivityTimelineEvent,
  AppAtmosphereTheme,
  AppSidebarEntryId,
  PreviewDocumentItem,
  ScheduleSlotItem,
} from '../../types/appHome';
import {
  WorkspaceGoal,
  WorkspaceNotification,
  WorkspaceProject,
  WorkspaceTask,
} from '../../types/workspace';
import { ModuleIcon } from '../admin/ModuleIcon';

interface AppTopBarProps {
  sidebarCollapsed: boolean;
  onToggleDesktopSidebar: () => void;
  onOpenMobileDrawer: () => void;
  atmosphere: AppAtmosphereTheme;
  onChangeAtmosphere: (mode: AppAtmosphereTheme) => void;
  onSelectEntry: (id: AppSidebarEntryId) => void;
  onFocusQuickCapture: () => void;
  onFocusCopilot: () => void;
  onExitToLanding: () => void;
  notifications: WorkspaceNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  tasks: WorkspaceTask[];
  goals: WorkspaceGoal[];
  projects: WorkspaceProject[];
  scheduleSlots: ScheduleSlotItem[];
  documents: PreviewDocumentItem[];
  recentActivity: ActivityTimelineEvent[];
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  sidebarCollapsed,
  onToggleDesktopSidebar,
  onOpenMobileDrawer,
  atmosphere,
  onChangeAtmosphere,
  onSelectEntry,
  onFocusQuickCapture,
  onFocusCopilot,
  onExitToLanding,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  tasks,
  goals,
  projects,
  scheduleSlots,
  documents,
  recentActivity,
}) => {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
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

    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const entries = APP_SIDEBAR_ENTRIES.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedTasks = tasks
      .filter((t) => t.title.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedSchedule = scheduleSlots
      .filter((s) => s.title.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedDocs = documents
      .filter((d) => d.title.toLowerCase().includes(q))
      .slice(0, 2);

    const matchedGoalsProjects = [
      ...goals
        .filter((g) => g.title.toLowerCase().includes(q))
        .map((g) => ({ id: g.id, label: g.title, kind: 'Goal' as const })),
      ...projects
        .filter((p) => p.name.toLowerCase().includes(q))
        .map((p) => ({ id: p.id, label: p.name, kind: 'Project' as const })),
      ...recentActivity
        .filter((a) => a.title.toLowerCase().includes(q))
        .map((a) => ({ id: a.id, label: a.title, kind: 'Activity' as const })),
    ].slice(0, 3);

    return {
      entries,
      matchedTasks,
      matchedSchedule,
      matchedDocs,
      matchedGoalsProjects,
      total:
        entries.length +
        matchedTasks.length +
        matchedSchedule.length +
        matchedDocs.length +
        matchedGoalsProjects.length,
    };
  }, [query, tasks, scheduleSlots, documents, goals, projects, recentActivity]);

  const barBg =
    atmosphere === 'forest-glass'
      ? 'bg-[#07120C]/95 border-[#1A3526]'
      : 'bg-[#090A09]/95 border-[#242824]';

  return (
    <header
      className={`sticky top-0 z-20 h-[68px] border-b ${barBg} px-4 sm:px-6 flex items-center justify-between gap-3 transition-colors duration-200`}
    >
      {/* Left: Sidebar toggle + Atmosphere switch */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0E1E16] border border-[#214231] text-[#F5F7F2] hover:border-[#C5FF62]/50 cursor-pointer"
        >
          <Menu size={17} />
        </button>

        <button
          type="button"
          onClick={onToggleDesktopSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0E1E16] border border-[#214231] text-[#A1B0A6] hover:text-[#F5F7F2] hover:border-[#C5FF62]/50 transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen size={17} />
          ) : (
            <PanelLeftClose size={17} />
          )}
        </button>

        {sidebarCollapsed && (
          <span className="hidden xl:inline text-sm font-semibold tracking-[-0.015em] text-[#F5F7F2] pr-1">
            TRCK MAIN
          </span>
        )}

        {/* Optional Atmosphere Switch (inspired by Image 1's top-left dual toggle) */}
        <div
          role="group"
          aria-label="Workspace surface atmosphere"
          className="hidden sm:inline-flex items-center gap-1 p-1 rounded-full bg-[#0C1912] border border-[#1E3B2B]"
        >
          <button
            type="button"
            onClick={() => onChangeAtmosphere('forest-glass')}
            aria-pressed={atmosphere === 'forest-glass'}
            title="Forest Glass theme"
            aria-label="Forest Glass surface"
            className={`w-7 h-7 rounded-full inline-flex items-center justify-center transition-colors cursor-pointer ${
              atmosphere === 'forest-glass'
                ? 'bg-[#6BFF9C] text-[#050C08]'
                : 'text-[#8CA195] hover:text-[#F5F7F2]'
            }`}
          >
            <Sparkles size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onChangeAtmosphere('deep-obsidian')}
            aria-pressed={atmosphere === 'deep-obsidian'}
            title="Deep Obsidian contrast"
            aria-label="Deep Obsidian surface"
            className={`w-7 h-7 rounded-full inline-flex items-center justify-center transition-colors cursor-pointer ${
              atmosphere === 'deep-obsidian'
                ? 'bg-[#C5FF62] text-[#050A07]'
                : 'text-[#8CA195] hover:text-[#F5F7F2]'
            }`}
          >
            <Moon size={13} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Center: Global Search Input with Keyboard Shortcut Hint */}
      <div ref={searchRef} className="relative flex-1 max-w-md min-w-0">
        <Search
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8CA195]"
        />
        <input
          ref={searchInputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Enter your search request..."
          aria-label="Global workspace search"
          className="w-full h-10 pl-9 pr-11 rounded-full bg-[#0C1912] border border-[#1E3B2B] focus:border-[#6BFF9C] focus:outline-none text-sm text-[#F5F7F2] placeholder:text-[#8CA195] transition-colors"
        />
        <kbd
          aria-hidden="true"
          className="hidden md:inline-flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#12261C] border border-[#214231] font-mono text-[10px] text-[#8CA195]"
        >
          /
        </kbd>

        {searchOpen && results && (
          <div
            role="region"
            aria-label="Search results"
            className="absolute left-0 right-0 top-[46px] rounded-2xl bg-[#0D1C14] border border-[#234734] shadow-[0_24px_64px_rgba(0,0,0,0.85)] p-3 max-h-[70vh] overflow-y-auto z-40"
          >
            <div className="px-2 pb-2 mb-2 border-b border-[#1E3B2B] flex items-center justify-between text-[11px] text-[#8CA195]">
              <span>Workspace preview search</span>
              <span className="font-mono tabular-nums">{results.total} found</span>
            </div>

            {results.total === 0 ? (
              <p className="py-4 px-2 text-xs text-center text-[#8CA195]">
                No matches for &ldquo;{query}&rdquo;.
              </p>
            ) : (
              <div className="space-y-3">
                {results.entries.length > 0 && (
                  <div>
                    <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8CA195] mb-1">
                      Navigation &amp; Modules
                    </p>
                    {results.entries.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => {
                          onSelectEntry(entry.id);
                          setSearchOpen(false);
                          setQuery('');
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs text-[#F5F7F2] hover:bg-white/[0.05] cursor-pointer"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <ModuleIcon
                            iconName={entry.iconName}
                            size={14}
                            className="text-[#C5FF62] shrink-0"
                          />
                          <span className="truncate">{entry.name}</span>
                        </span>
                        <span className="text-[10px] text-[#8CA195] shrink-0">
                          {entry.status === 'active' ? 'Active' : 'Upcoming'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {(results.matchedTasks.length > 0 ||
                  results.matchedSchedule.length > 0 ||
                  results.matchedDocs.length > 0 ||
                  results.matchedGoalsProjects.length > 0) && (
                  <div>
                    <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8CA195] mb-1">
                      Home Workspace Items
                    </p>
                    {results.matchedTasks.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          onSelectEntry('home');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs text-[#F5F7F2] hover:bg-white/[0.05] cursor-pointer"
                      >
                        <span className="truncate">{t.title}</span>
                        <span className="text-[10px] text-[#8CA195]">Task</span>
                      </button>
                    ))}
                    {results.matchedSchedule.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          onSelectEntry('home');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs text-[#F5F7F2] hover:bg-white/[0.05] cursor-pointer"
                      >
                        <span className="truncate">{s.title}</span>
                        <span className="text-[10px] text-[#8CA195]">Schedule</span>
                      </button>
                    ))}
                    {results.matchedDocs.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          onSelectEntry('home');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs text-[#F5F7F2] hover:bg-white/[0.05] cursor-pointer"
                      >
                        <span className="truncate">{d.title}</span>
                        <span className="text-[10px] text-[#8CA195]">{d.fileType}</span>
                      </button>
                    ))}
                    {results.matchedGoalsProjects.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          onSelectEntry('home');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs text-[#F5F7F2] hover:bg-white/[0.05] cursor-pointer"
                      >
                        <span className="truncate">{g.label}</span>
                        <span className="text-[10px] text-[#8CA195]">{g.kind}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Quick Capture, Notifications, AI Shortcut, Avatar Menu */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onFocusQuickCapture}
          aria-label="Quick Capture"
          className="inline-flex items-center justify-center gap-1.5 h-10 px-3 sm:px-4 rounded-full bg-[#6BFF9C] text-[#050C08] text-xs font-semibold hover:bg-[#8CFFB4] active:scale-[0.985] transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus size={15} aria-hidden="true" />
          <span className="hidden sm:inline">Quick Capture</span>
        </button>

        <button
          type="button"
          onClick={onFocusCopilot}
          aria-label="Jump to AI Co-pilot"
          title="AI Co-pilot shortcut"
          className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-full bg-[#0E1E16] border border-[#214231] text-[#F5F7F2] hover:border-[#6BFF9C]/55 hover:text-[#6BFF9C] transition-colors cursor-pointer"
        >
          <Bot size={16} aria-hidden="true" />
          <span className="hidden xl:inline text-xs font-medium">AI Co-pilot</span>
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
            aria-expanded={notifOpen}
            aria-label={`Notifications (${unreadCount} unread)`}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0E1E16] border border-[#214231] text-[#F5F7F2] hover:border-[#6BFF9C]/55 transition-colors cursor-pointer"
          >
            <Bell size={16} aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C5FF62] text-[#050A07] font-mono text-[10px] font-bold tabular-nums flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              role="region"
              aria-label="Workspace notifications"
              className="absolute right-0 top-[46px] w-[300px] sm:w-[330px] rounded-2xl bg-[#0D1C14] border border-[#234734] shadow-[0_24px_64px_rgba(0,0,0,0.85)] p-3.5 z-40"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-[#1E3B2B]">
                <div>
                  <h3 className="text-xs font-semibold text-[#F5F7F2]">
                    Notifications
                  </h3>
                  <p className="text-[11px] text-[#8CA195]">
                    Sample preview alerts
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllNotificationsRead}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6BFF9C] hover:underline cursor-pointer"
                  >
                    <Check size={12} aria-hidden="true" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <ul className="mt-2 divide-y divide-[#1E3B2B] max-h-[260px] overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id} className="py-2">
                    <button
                      type="button"
                      onClick={() => onMarkNotificationRead(n.id)}
                      className="w-full text-left rounded-lg p-1.5 hover:bg-white/[0.04] cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-xs font-medium ${
                            n.read ? 'text-[#8CA195]' : 'text-[#F5F7F2]'
                          }`}
                        >
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[#8CA195] shrink-0">
                          {n.read ? 'Read' : 'Unread'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#8CA195] leading-snug">
                        {n.detail}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Avatar & Profile Menu */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
            aria-expanded={profileOpen}
            aria-label="User profile menu"
            className="inline-flex items-center gap-2 h-10 pl-1.5 pr-2.5 rounded-full bg-[#0E1E16] border border-[#214231] hover:border-[#6BFF9C]/50 transition-colors cursor-pointer"
          >
            <span className="w-7 h-7 rounded-full bg-[#153022] border border-[#29593F] flex items-center justify-center text-[#6BFF9C]">
              <User size={14} aria-hidden="true" />
            </span>
            <span className="hidden md:inline text-xs font-medium text-[#F5F7F2] whitespace-nowrap">
              Dev Preview
            </span>
            <ChevronDown size={13} className="text-[#8CA195]" aria-hidden="true" />
          </button>

          {profileOpen && (
            <div
              role="menu"
              aria-label="Profile options"
              className="absolute right-0 top-[46px] w-[240px] rounded-2xl bg-[#0D1C14] border border-[#234734] shadow-[0_24px_64px_rgba(0,0,0,0.85)] p-2 z-40"
            >
              <div className="px-3 py-2 border-b border-[#1E3B2B] mb-1.5">
                <p className="text-xs font-semibold text-[#F5F7F2]">
                  Workspace Member
                </p>
                <p className="text-[11px] text-[#8CA195]">
                  Isolated dev entry · Auth not wired
                </p>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  onSelectEntry('settings-personalization');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#F5F7F2] hover:bg-white/[0.05] cursor-pointer text-left"
              >
                <User size={14} className="text-[#8CA195]" aria-hidden="true" />
                <span>Settings &amp; Personalization</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  onExitToLanding();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#F5F7F2] hover:bg-white/[0.05] cursor-pointer text-left"
              >
                <ExternalLink size={14} className="text-[#8CA195]" aria-hidden="true" />
                <span>Return to Landing Page</span>
              </button>

              <div className="my-1 border-t border-[#1E3B2B]" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  onExitToLanding();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#8CA195] hover:text-[#F5F7F2] hover:bg-white/[0.05] cursor-pointer text-left"
              >
                <LogOut size={14} aria-hidden="true" />
                <span>Exit Preview Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
