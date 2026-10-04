import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import activityService from "../services/activityService";
import goalService from "../services/goalService";
import notificationService from "../services/notificationService";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateRange, setDateRange] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("daymark_theme") || "dark";
  });

  const showToast = useCallback(({ title, message, type = "info", duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("daymark_theme", newTheme);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dm-dark");
    } else if (theme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dm-dark");
      } else {
        document.documentElement.classList.remove("dm-dark");
      }
    } else {
      document.documentElement.classList.remove("dm-dark");
    }
  }, [theme]);

  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [fetchedActivities, fetchedGoals, fetchedNotifications] = await Promise.all([
        activityService.getActivityLogs(),
        goalService.getAllGoalProgress(),
        notificationService.getNotifications(),
      ]);
      setActivities(fetchedActivities || []);
      setGoals(fetchedGoals || []);
      setNotifications(fetchedNotifications || []);
    } catch (error) {
      console.error("Failed to fetch app data:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setActivities([]);
      setGoals([]);
      setNotifications([]);
    }
  }, [isAuthenticated, refreshData]);

  const addActivity = async (activity) => {
    try {
      const newLog = await activityService.createActivityLog(activity);
      setActivities((prev) => [newLog, ...prev]);
      showToast({ type: "success", title: "Activity Logged", message: "Your activity has been saved." });
      return newLog;
    } catch (error) {
      showToast({ type: "error", title: "Error", message: error.response?.data?.message || "Failed to save activity." });
      throw error;
    }
  };

  const updateActivity = async (activityId, updatedData) => {
    try {
      const updatedLog = await activityService.updateActivityLog(activityId, updatedData);
      setActivities((prev) => prev.map((a) => (a.id === activityId ? updatedLog : a)));
      showToast({ type: "success", title: "Updated", message: "Activity details updated." });
    } catch (error) {
      showToast({ type: "error", title: "Error", message: "Failed to update activity." });
      throw error;
    }
  };

  const deleteActivity = async (activityId) => {
    try {
      await activityService.deleteActivityLog(activityId);
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
      showToast({ type: "info", title: "Deleted", message: "Activity removed from log." });
    } catch (error) {
      showToast({ type: "error", title: "Error", message: "Failed to delete activity." });
      throw error;
    }
  };

  const addGoal = async (goal) => {
    try {
      const newGoal = await goalService.createGoal(goal);
      setGoals((prev) => [newGoal, ...prev]);
      showToast({ type: "success", title: "Goal Created", message: `New goal "${newGoal.title}" set!` });
      return newGoal;
    } catch (error) {
      showToast({ type: "error", title: "Error", message: "Failed to create goal." });
      throw error;
    }
  };

  const updateGoal = async (goalId, updatedData) => {
    try {
      const updatedGoal = await goalService.updateGoal(goalId, updatedData);
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updatedGoal : g)));
      showToast({ type: "success", title: "Goal Updated", message: "Goal progress saved." });
    } catch (error) {
      showToast({ type: "error", title: "Error", message: "Failed to update goal." });
      throw error;
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await goalService.deleteGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      showToast({ type: "info", title: "Goal Removed", message: "Goal deleted." });
    } catch (error) {
      showToast({ type: "error", title: "Error", message: "Failed to delete goal." });
      throw error;
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await notificationService.markRead(notificationId);
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast({ type: "success", title: "Notifications", message: "All notifications marked as read." });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const value = useMemo(
    () => ({
      activities,
      goals,
      notifications,
      toasts,
      selectedDate,
      dateRange,
      loading,
      unreadNotificationCount,
      theme,

      setActivities,
      setGoals,
      setNotifications,
      setSelectedDate,
      setDateRange,
      setLoading,
      setTheme,

      showToast,
      removeToast,
      refreshData,

      addActivity,
      updateActivity,
      deleteActivity,

      addGoal,
      updateGoal,
      deleteGoal,

      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
    }),
    [
      activities,
      goals,
      notifications,
      toasts,
      selectedDate,
      dateRange,
      loading,
      unreadNotificationCount,
      theme,
      showToast,
      removeToast,
      refreshData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export default AppProvider;
