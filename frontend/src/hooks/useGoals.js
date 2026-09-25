import { useCallback, useMemo } from "react";
import { useApp } from "../context/AppContext";

function useGoals() {
  const { goals, loading, setLoading, addGoal, updateGoal, deleteGoal } =
    useApp();

  const createGoal = useCallback(
    async (goalData) => {
      setLoading(true);

      try {
        const goal = addGoal(goalData);
        return goal;
      } finally {
        setLoading(false);
      }
    },
    [addGoal, setLoading],
  );

  const editGoal = useCallback(
    async (goalId, goalData) => {
      setLoading(true);

      try {
        updateGoal(goalId, goalData);
      } finally {
        setLoading(false);
      }
    },
    [updateGoal, setLoading],
  );

  const removeGoal = useCallback(
    async (goalId) => {
      setLoading(true);

      try {
        deleteGoal(goalId);
      } finally {
        setLoading(false);
      }
    },
    [deleteGoal, setLoading],
  );

  const activeGoals = useMemo(
    () => goals.filter((goal) => goal.status === "ACTIVE"),
    [goals],
  );

  const completedGoals = useMemo(
    () => goals.filter((goal) => goal.status === "COMPLETED"),
    [goals],
  );

  const pausedGoals = useMemo(
    () => goals.filter((goal) => goal.status === "PAUSED"),
    [goals],
  );

  const calculateProgress = useCallback((goal) => {
    if (!goal || !goal.target) return 0;

    return Math.min(
      100,
      Math.round(((Number(goal.current) || 0) / Number(goal.target)) * 100),
    );
  }, []);

  return {
    goals,
    activeGoals,
    completedGoals,
    pausedGoals,
    loading,
    createGoal,
    editGoal,
    removeGoal,
    calculateProgress,
  };
}

export default useGoals;
