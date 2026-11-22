import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GROWTH_LIFE_AREAS,
  INITIAL_RECENT_ACTIVITY,
  SAMPLE_COPILOT_ROWS,
  SAMPLE_DOCUMENTS,
  SAMPLE_LIFE_RINGS,
  SAMPLE_SCHEDULE_SLOTS,
} from '../data/appHomeData';
import {
  DEMO_COMMITMENTS,
  DEMO_GOALS,
  DEMO_NOTIFICATIONS,
  DEMO_PROJECTS,
  DEMO_TASKS,
  INITIAL_DEMO_INTENTION,
} from '../data/workspaceDemoData';
import {
  ActivityTimelineEvent,
  AppAtmosphereTheme,
  AppSidebarEntryId,
  QuickCapturedRecord,
  QuickRecordType,
  ScheduleSlotItem,
  ScoreWeightConfig,
} from '../types/appHome';
import { WorkspaceNotification, WorkspaceTask } from '../types/workspace';

const FOCUS_DURATION_SECONDS = 45 * 60;

export function useAppHomeState() {
  const [activeEntryId, setActiveEntryId] = useState<AppSidebarEntryId>('home');
  const [atmosphere, setAtmosphere] =
    useState<AppAtmosphereTheme>('forest-glass');

  const [dailyIntention, setDailyIntention] = useState<string>(
    INITIAL_DEMO_INTENTION
  );
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);

  const [tasks, setTasks] = useState<WorkspaceTask[]>(DEMO_TASKS);
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlotItem[]>(
    SAMPLE_SCHEDULE_SLOTS
  );
  const [recentActivity, setRecentActivity] = useState<ActivityTimelineEvent[]>(
    INITIAL_RECENT_ACTIVITY
  );
  const [capturedRecords, setCapturedRecords] = useState<QuickCapturedRecord[]>(
    []
  );
  const [notifications, setNotifications] =
    useState<WorkspaceNotification[]>(DEMO_NOTIFICATIONS);

  const [selectedGrowthAreaId, setSelectedGrowthAreaId] = useState<string>(
    GROWTH_LIFE_AREAS[0].id
  );

  // Configurable transparent score weights (sum normalized dynamically)
  const [scoreWeights, setScoreWeights] = useState<ScoreWeightConfig>({
    priorities: 40,
    goals: 35,
    habits: 25,
  });

  // Main task focus timer (session prototype)
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusSecondsLeft, setFocusSecondsLeft] = useState(
    FOCUS_DURATION_SECONDS
  );

  // AI Co-pilot suggested change confirmation state
  const [copilotAdjustmentApplied, setCopilotAdjustmentApplied] =
    useState(false);
  const [copilotAdjustmentDismissed, setCopilotAdjustmentDismissed] =
    useState(false);

  useEffect(() => {
    if (!focusRunning) return;
    const id = window.setInterval(() => {
      setFocusSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [focusRunning]);

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      const nextCompleted = target ? !target.completed : false;
      if (target) {
        setRecentActivity((actPrev) => [
          {
            id: `act-task-${Date.now()}`,
            title: `${nextCompleted ? 'Completed' : 'Reopened'} "${target.title}"`,
            category: 'task',
            timeLabel: 'Just now · Session',
            source: 'session',
          },
          ...actPrev,
        ]);
      }
      return prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
    });
  }, []);

  const submitQuickCapture = useCallback(
    (payload: { type: QuickRecordType; content: string }) => {
      const trimmed = payload.content.trim();
      if (!trimmed) return;

      const nowLabel = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const destMap: Record<QuickRecordType, string> = {
        thought: 'Universal Capture Inbox (Session)',
        task: 'Added to Today’s Priorities (Session)',
        idea: 'Ideas & Business Planner (Session)',
        goal: 'Goal Planner Queue (Session)',
        note: 'Personal Knowledge Brain (Session)',
        reminder: 'Upcoming Reminders (Session)',
        opportunity: 'Programs & Opportunities (Session)',
      };

      const entry: QuickCapturedRecord = {
        id: `qcap-${Date.now()}`,
        type: payload.type,
        content: trimmed,
        createdAtLabel: nowLabel,
        destinationHint: destMap[payload.type],
      };

      setCapturedRecords((prev) => [entry, ...prev]);

      if (payload.type === 'task') {
        setTasks((prev) => [
          {
            id: `cap-task-${Date.now()}`,
            title: trimmed,
            priority: 'medium',
            completed: false,
            associatedContext: 'Quick Capture',
            source: 'local',
          },
          ...prev,
        ]);
      }

      setRecentActivity((prev) => [
        {
          id: `act-cap-${Date.now()}`,
          title: `Captured ${payload.type}: "${trimmed}"`,
          category: 'capture',
          timeLabel: `${nowLabel} · Session`,
          source: 'session',
        },
        ...prev,
      ]);
    },
    []
  );

  const applyCopilotScheduleFix = useCallback(() => {
    setScheduleSlots((prev) =>
      prev.map((slot) =>
        slot.id === 'slot-today-4'
          ? {
              ...slot,
              startHour: 17.25,
              timeRangeLabel: '17:15 – 18:00',
              status: 'upcoming',
              source: 'session',
            }
          : slot
      )
    );
    setCopilotAdjustmentApplied(true);
    setRecentActivity((prev) => [
      {
        id: `act-copilot-${Date.now()}`,
        title: 'Approved AI Co-pilot schedule shift for Mentor Outreach (17:15)',
        category: 'project',
        timeLabel: 'Just now · Session',
        source: 'session',
      },
      ...prev,
    ]);
  }, []);

  const dismissCopilotScheduleFix = useCallback(() => {
    setCopilotAdjustmentDismissed(true);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Main priority task (first incomplete high-priority task, or first task)
  const mainTask = useMemo(() => {
    return (
      tasks.find((t) => !t.completed && t.priority === 'high') ||
      tasks.find((t) => !t.completed) ||
      tasks[0]
    );
  }, [tasks]);

  // Transparent weighted progress calculation from visible sample/session state
  const computedScore = useMemo(() => {
    const taskCompletionRatio =
      tasks.length > 0
        ? tasks.filter((t) => t.completed).length / tasks.length
        : 0;
    const avgGoalRatio =
      DEMO_GOALS.reduce((sum, g) => sum + g.progress, 0) /
      (DEMO_GOALS.length * 100);
    const habitRatio = 0.78; // Sample 11/14 check-ins

    const totalWeight =
      scoreWeights.priorities + scoreWeights.goals + scoreWeights.habits || 1;

    const weighted =
      ((taskCompletionRatio * scoreWeights.priorities +
        avgGoalRatio * scoreWeights.goals +
        habitRatio * scoreWeights.habits) /
        totalWeight) *
      100;

    return Math.round(weighted);
  }, [tasks, scoreWeights]);

  const activeGoalsPercent = useMemo(() => {
    return Math.round(
      DEMO_GOALS.reduce((sum, g) => sum + g.progress, 0) / DEMO_GOALS.length
    );
  }, []);

  return {
    activeEntryId,
    setActiveEntryId,
    atmosphere,
    setAtmosphere,
    dailyIntention,
    setDailyIntention,
    selectedDayOffset,
    setSelectedDayOffset,
    tasks,
    toggleTask,
    mainTask,
    focusRunning,
    setFocusRunning,
    focusSecondsLeft,
    resetFocusTimer: () => {
      setFocusRunning(false);
      setFocusSecondsLeft(FOCUS_DURATION_SECONDS);
    },
    scheduleSlots,
    growthAreas: GROWTH_LIFE_AREAS,
    selectedGrowthAreaId,
    setSelectedGrowthAreaId,
    documents: SAMPLE_DOCUMENTS,
    goals: DEMO_GOALS,
    projects: DEMO_PROJECTS,
    commitments: DEMO_COMMITMENTS,
    lifeRings: SAMPLE_LIFE_RINGS,
    copilotRows: SAMPLE_COPILOT_ROWS,
    copilotAdjustmentApplied,
    copilotAdjustmentDismissed,
    applyCopilotScheduleFix,
    dismissCopilotScheduleFix,
    scoreWeights,
    setScoreWeights,
    computedScore,
    activeGoalsPercent,
    capturedRecords,
    submitQuickCapture,
    recentActivity,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  };
}
