import { createContext, useContext, useEffect, useMemo, useState } from "react";
import activityService from "../services/activityService";
import goalService from "../services/goalService";
import notificationService from "../services/notificationService";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);

function AppProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dateRange, setDateRange] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("daymark_theme") || "light";
  });

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

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [fetchedActivities, fetchedGoals, fetchedNotifications] = await Promise.all([
            activityService.getActivityLogs(),
            goalService.getAllGoalProgress(),
            notificationService.getNotifications()
          ]);
          setActivities(fetchedActivities);
          setGoals(fetchedGoals);
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error("Failed to fetch app data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setActivities([]);
      setGoals([]);
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const addActivity = async (activity) => {
    try {
      const newLog = await activityService.createActivityLog(activity);
      setActivities((prev) => [newLog, ...prev]);
      return newLog;
    } catch (error) {
      console.error(error);
    }
  };

  const updateActivity = async (activityId, updatedData) => {
    try {
      const updatedLog = await activityService.updateActivityLog(activityId, updatedData);
      setActivities((prev) => prev.map((a) => (a.id === activityId ? updatedLog : a)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteActivity = async (activityId) => {
    try {
      await activityService.deleteActivityLog(activityId);
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
    } catch (error) {
      console.error(error);
    }
  };

  const addGoal = async (goal) => {
    try {
      const newGoal = await goalService.createGoal(goal);
      setGoals((prev) => [newGoal, ...prev]);
      return newGoal;
    } catch (error) {
      console.error(error);
    }
  };

  const updateGoal = async (goalId, updatedData) => {
    try {
      const updatedGoal = await goalService.updateGoal(goalId, updatedData);
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updatedGoal : g)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await goalService.deleteGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (error) {
      console.error(error);
    }
  };

  // Notification API integrations
  const addNotification = (notification) => {
    // Usually added via backend push or poll, but for manual optimistic add:
    setNotifications((prev) => [{ ...notification, id: Date.now() }, ...prev]);
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

      addActivity,
      updateActivity,
      deleteActivity,

      addGoal,
      updateGoal,
      deleteGoal,

      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
    }),
    [
      activities,
      goals,
      notifications,
      selectedDate,
      dateRange,
      loading,
      unreadNotificationCount,
      theme,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}

export default AppProvider;
