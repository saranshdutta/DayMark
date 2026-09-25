import { useCallback, useMemo } from "react";
import { useApp } from "../context/AppContext";

function useActivities() {
  const {
    activities,
    loading,
    setLoading,
    addActivity,
    updateActivity,
    deleteActivity,
  } = useApp();

  const createActivity = useCallback(
    async (activityData) => {
      setLoading(true);

      try {
        const activity = addActivity(activityData);
        return activity;
      } finally {
        setLoading(false);
      }
    },
    [addActivity, setLoading],
  );

  const editActivity = useCallback(
    async (activityId, activityData) => {
      setLoading(true);

      try {
        updateActivity(activityId, activityData);
      } finally {
        setLoading(false);
      }
    },
    [updateActivity, setLoading],
  );

  const removeActivity = useCallback(
    async (activityId) => {
      setLoading(true);

      try {
        deleteActivity(activityId);
      } finally {
        setLoading(false);
      }
    },
    [deleteActivity, setLoading],
  );

  const getActivitiesByDate = useCallback(
    (date) => {
      if (!date) return [];

      return activities.filter((activity) => {
        if (!activity.loggedAt) return false;

        return activity.loggedAt.startsWith(date);
      });
    },
    [activities],
  );

  const totalActivities = activities.length;

  const recentActivities = useMemo(() => activities.slice(0, 5), [activities]);

  return {
    activities,
    loading,
    totalActivities,
    recentActivities,
    createActivity,
    editActivity,
    removeActivity,
    getActivitiesByDate,
  };
}

export default useActivities;
