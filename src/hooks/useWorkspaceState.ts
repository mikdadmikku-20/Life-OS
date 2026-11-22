import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildDemoBriefing,
  DEFAULT_LAYOUT_PREFERENCES,
  DEFAULT_WIDGET_ORDER,
  DEMO_COMMITMENTS,
  DEMO_GOALS,
  DEMO_LIFE_PROGRESS,
  DEMO_NOTIFICATIONS,
  DEMO_PROJECTS,
  DEMO_SCHEDULE,
  DEMO_TASKS,
  INITIAL_DEMO_INTENTION,
} from '../data/workspaceDemoData';
import { ADMIN_MODULES } from '../data/adminModules';
import {
  AdminModuleId,
  CapturedEntry,
  CaptureItemType,
  DashboardLayoutPreferences,
  DashboardWidgetId,
  ScheduleEvent,
  TaskPriority,
  WorkspaceNotification,
  WorkspaceTask,
} from '../types/workspace';

const LAYOUT_STORAGE_KEY = 'trck_main_dashboard_layout_v1';

function loadSavedLayout(): DashboardLayoutPreferences {
  try {
    const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!raw) return DEFAULT_LAYOUT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<DashboardLayoutPreferences>;
    const validOrder = Array.isArray(parsed.widgetOrder)
      ? parsed.widgetOrder.filter((id): id is DashboardWidgetId =>
          DEFAULT_WIDGET_ORDER.includes(id as DashboardWidgetId)
        )
      : [];
    const missingFromOrder = DEFAULT_WIDGET_ORDER.filter(
      (id) => !validOrder.includes(id)
    );
    const hiddenWidgets = Array.isArray(parsed.hiddenWidgets)
      ? parsed.hiddenWidgets.filter((id): id is DashboardWidgetId =>
          DEFAULT_WIDGET_ORDER.includes(id as DashboardWidgetId)
        )
      : [];
    return {
      widgetOrder: [...validOrder, ...missingFromOrder],
      hiddenWidgets,
    };
  } catch {
    return DEFAULT_LAYOUT_PREFERENCES;
  }
}

export interface AssistantExchange {
  id: string;
  prompt: string;
  responseTitle: string;
  responseBody: string[];
  basis: string;
  timestamp: string;
}

export function useWorkspaceState() {
  const [activeModuleId, setActiveModuleId] = useState<AdminModuleId>(
    'dashboard-daily-reflection'
  );
  const [dailyIntention, setDailyIntention] = useState<string>(
    INITIAL_DEMO_INTENTION
  );
  const [tasks, setTasks] = useState<WorkspaceTask[]>(DEMO_TASKS);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(DEMO_SCHEDULE);
  const [capturedItems, setCapturedItems] = useState<CapturedEntry[]>([]);
  const [notifications, setNotifications] =
    useState<WorkspaceNotification[]>(DEMO_NOTIFICATIONS);

  const [adjustmentApplied, setAdjustmentApplied] = useState(false);
  const [adjustmentDismissed, setAdjustmentDismissed] = useState(false);
  const [briefingRefreshTick, setBriefingRefreshTick] = useState(0);

  const [layoutPreferences, setLayoutPreferences] =
    useState<DashboardLayoutPreferences>(() => loadSavedLayout());

  const [assistantHistory, setAssistantHistory] = useState<AssistantExchange[]>(
    []
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        LAYOUT_STORAGE_KEY,
        JSON.stringify(layoutPreferences)
      );
    } catch {
      // Ignore storage quota / private mode failures cleanly
    }
  }, [layoutPreferences]);

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const addTask = useCallback(
    (payload: {
      title: string;
      priority: TaskPriority;
      dueTime?: string;
      associatedContext?: string;
    }) => {
      const trimmed = payload.title.trim();
      if (!trimmed) return;
      const newTask: WorkspaceTask = {
        id: `local-task-${Date.now()}`,
        title: trimmed,
        priority: payload.priority,
        dueTime: payload.dueTime?.trim() || undefined,
        completed: false,
        associatedContext: payload.associatedContext?.trim() || 'Local addition',
        source: 'local',
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    []
  );

  const captureItem = useCallback(
    (payload: {
      text: string;
      type: CaptureItemType;
      destinationModuleId: AdminModuleId | 'universal-capture-inbox';
    }) => {
      const trimmed = payload.text.trim();
      if (!trimmed) return;

      const targetModule = ADMIN_MODULES.find(
        (m) => m.id === payload.destinationModuleId
      );
      const destinationLabel =
        payload.destinationModuleId === 'universal-capture-inbox'
          ? 'Universal Capture Inbox'
          : targetModule?.name ?? 'Dashboard & Daily Reflection';

      const nowLabel = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const promoted =
        payload.type === 'task' &&
        payload.destinationModuleId === 'dashboard-daily-reflection';

      if (promoted) {
        setTasks((prev) => [
          {
            id: `captured-task-${Date.now()}`,
            title: trimmed,
            priority: 'medium',
            completed: false,
            associatedContext: 'Captured via Quick Capture',
            source: 'local',
          },
          ...prev,
        ]);
      }

      const entry: CapturedEntry = {
        id: `cap-${Date.now()}`,
        text: trimmed,
        type: payload.type,
        destinationLabel,
        destinationModuleId: payload.destinationModuleId,
        createdAtLabel: nowLabel,
        promotedToTasks: promoted,
      };

      setCapturedItems((prev) => [entry, ...prev]);
    },
    []
  );

  const briefing = useMemo(() => {
    void briefingRefreshTick;
    return buildDemoBriefing(
      tasks,
      schedule,
      adjustmentApplied,
      adjustmentDismissed
    );
  }, [tasks, schedule, adjustmentApplied, adjustmentDismissed, briefingRefreshTick]);

  const refreshBriefing = useCallback(() => {
    setBriefingRefreshTick((c) => c + 1);
  }, []);

  const approveSuggestedAdjustment = useCallback(() => {
    setSchedule((prev) =>
      prev.map((evt) =>
        evt.id === 'evt-5'
          ? {
              ...evt,
              startTime: '17:20',
              endTime: '17:55',
              durationLabel: '35m',
              startMinutes: 17 * 60 + 20,
              endMinutes: 17 * 60 + 55,
              status: 'upcoming',
              source: 'local',
            }
          : evt
      )
    );
    setAdjustmentApplied(true);
  }, []);

  const dismissSuggestedAdjustment = useCallback(() => {
    setAdjustmentDismissed(true);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const toggleWidgetVisibility = useCallback((widgetId: DashboardWidgetId) => {
    setLayoutPreferences((prev) => {
      const exists = prev.hiddenWidgets.includes(widgetId);
      return {
        ...prev,
        hiddenWidgets: exists
          ? prev.hiddenWidgets.filter((id) => id !== widgetId)
          : [...prev.hiddenWidgets, widgetId],
      };
    });
  }, []);

  const moveWidgetOrder = useCallback(
    (widgetId: DashboardWidgetId, direction: 'up' | 'down') => {
      setLayoutPreferences((prev) => {
        const order = [...prev.widgetOrder];
        const idx = order.indexOf(widgetId);
        if (idx === -1) return prev;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= order.length) return prev;
        const temp = order[idx];
        order[idx] = order[swapIdx];
        order[swapIdx] = temp;
        return { ...prev, widgetOrder: order };
      });
    },
    []
  );

  const restoreDefaultLayout = useCallback(() => {
    setLayoutPreferences(DEFAULT_LAYOUT_PREFERENCES);
  }, []);

  const runContextualAssistantPrompt = useCallback(
    (promptText: string) => {
      const cleaned = promptText.trim();
      if (!cleaned) return;
      const lower = cleaned.toLowerCase();
      const pendingTasks = tasks.filter((t) => !t.completed);
      const highPriority = pendingTasks.filter((t) => t.priority === 'high');
      const hasConflict = schedule.some((s) => s.status === 'conflict');

      let responseTitle = 'Workspace Preview Response';
      let responseBody: string[] = [];
      let basis =
        'Demonstration response generated from local sample state (live AI service is not connected).';

      if (lower.includes('plan today') || lower.includes('plan my day')) {
        responseTitle = 'Suggested Day Sequencing (Demo)';
        responseBody = [
          `1. Clear your ${highPriority.length || pendingTasks.length} priority item(s) first: "${(highPriority[0] || pendingTasks[0])?.title ?? 'No pending tasks'}".`,
          hasConflict
            ? '2. Resolve the 17:00–17:15 overlap in Today’s Schedule via the AI Daily Briefing approval card.'
            : '2. Keep your remaining afternoon blocks spaced with a short transition buffer.',
          '3. End with the 19:00 Health & Fitness recovery block before capturing tomorrow’s intention.',
        ];
        basis = `Built from ${pendingTasks.length} open task(s) and ${schedule.length} timeline events.`;
      } else if (lower.includes('next priority')) {
        const nextTask = highPriority[0] || pendingTasks[0];
        responseTitle = 'Recommended Next Priority (Demo)';
        responseBody = nextTask
          ? [
              `Focus on: "${nextTask.title}" (${nextTask.priority} priority${nextTask.dueTime ? `, due ${nextTask.dueTime}` : ''}).`,
              `Context: ${nextTask.associatedContext ?? 'Daily Priorities'}.`,
            ]
          : [
              'All sample tasks in Today’s Priorities are complete.',
              'Consider picking up an upcoming commitment or capturing a new focus item.',
            ];
      } else if (lower.includes('goal')) {
        responseTitle = 'Active Goals Summary (Demo)';
        responseBody = DEMO_GOALS.map(
          (g) => `${g.title} — ${g.progress}% (${g.currentMilestone})`
        );
        basis = 'Reads directly from the 3 sample goals in Goals at a Glance.';
      } else if (lower.includes('idea') || lower.includes('organize')) {
        responseTitle = 'Organizing an Idea (Demo Guide)';
        responseBody = [
          capturedItems.length > 0
            ? `You have ${capturedItems.length} session capture(s) queued locally. Route product concepts to Ideas & Business Planner or convert actionable steps into Today’s Priorities.`
            : 'Use Quick Capture with Type set to "Idea" and Destination set to "Ideas & Business Planner" to stage new concepts locally.',
          'Once Ideas & Business Planner is implemented, the Knowledge-to-Action Bridge will convert validated ideas directly into project milestones.',
        ];
      } else if (lower.includes('conflict') || lower.includes('schedule')) {
        responseTitle = 'Schedule Conflict Check (Demo)';
        responseBody = hasConflict
          ? [
              'Detected 1 overlap: "Fellowship Application Draft" (15:30–17:15) overlaps "Mentor Outreach" (17:00–17:45).',
              'Use "Review Suggested Changes" inside AI Daily Briefing to approve shifting Mentor Outreach to 17:20.',
            ]
          : [
              'No overlapping blocks remain in Today’s Schedule.',
              'All current blocks have clear start and end boundaries.',
            ];
      } else {
        responseTitle = 'Contextual Workspace Guidance (Demo)';
        responseBody = [
          `Prompt received: "${cleaned}".`,
          `Current state shows ${pendingTasks.length} open priority task(s), ${DEMO_GOALS.length} sample goals, and ${DEMO_COMMITMENTS.length} upcoming commitments.`,
          'When connected to a live AI service, this panel will synthesize across all 23 modules via the Specialized AI Team capability.',
        ];
      }

      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      setAssistantHistory((prev) => [
        {
          id: `ai-ex-${Date.now()}`,
          prompt: cleaned,
          responseTitle,
          responseBody,
          basis,
          timestamp,
        },
        ...prev,
      ]);
    },
    [tasks, schedule, capturedItems.length]
  );

  return {
    activeModuleId,
    setActiveModuleId,
    dailyIntention,
    setDailyIntention,
    tasks,
    toggleTask,
    addTask,
    schedule,
    goals: DEMO_GOALS,
    projects: DEMO_PROJECTS,
    lifeProgress: DEMO_LIFE_PROGRESS,
    commitments: DEMO_COMMITMENTS,
    capturedItems,
    captureItem,
    briefing,
    refreshBriefing,
    approveSuggestedAdjustment,
    dismissSuggestedAdjustment,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    layoutPreferences,
    toggleWidgetVisibility,
    moveWidgetOrder,
    restoreDefaultLayout,
    assistantHistory,
    runContextualAssistantPrompt,
  };
}
