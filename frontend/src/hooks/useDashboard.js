import { useMemo } from "react";
import { useApp } from "../context/AppContext";

function useDashboard() {
  const { activities, goals, notifications, loading } = useApp();

  const recentActivities = useMemo(() => activities.slice(0, 5), [activities]);

  const activeGoals = useMemo(
    () => goals.filter((goal) => goal.status === "ACTIVE"),
    [goals],
  );

  const completedGoals = useMemo(
    () => goals.filter((goal) => goal.status === "COMPLETED"),
    [goals],
  );

  const goalCompletion = useMemo(() => {
    if (!goals.length) return 0;

    const totalProgress = goals.reduce((sum, goal) => {
      if (!goal.target) return sum;

      const progress = Math.min(
        100,
        ((Number(goal.current) || 0) / Number(goal.target)) * 100,
      );

      return sum + progress;
    }, 0);

    return Math.round(totalProgress / goals.length);
  }, [goals]);

  const totalActivityDuration = useMemo(
    () =>
      activities.reduce(
        (sum, activity) => sum + (Number(activity.duration) || 0),
        0,
      ),
    [activities],
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const stats = useMemo(
    () => ({
      totalActivities: activities.length,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      goalCompletion,
      totalActivityDuration,
      unreadNotifications,
    }),
    [
      activities.length,
      activeGoals.length,
      completedGoals.length,
      goalCompletion,
      totalActivityDuration,
      unreadNotifications,
    ],
  );

  return {
    loading,
    stats,
    activities,
    goals,
    activeGoals,
    completedGoals,
    recentActivities,
    notifications,
  };
}

export default useDashboard;
