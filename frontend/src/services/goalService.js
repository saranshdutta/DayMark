import api from "./api";

/*
 * Goal Services
 *
 * Handles all goal-related API requests.
 *
 * Endpoints:
 * GET    /goals
 * GET    /goals/:id
 * POST   /goals
 * PUT    /goals/:id
 * DELETE /goals/:id
 */

const goalService = {
  // =========================
  // Goals
  // =========================

  getGoals: async (params = {}) => {
    const response = await api.get("/goals", {
      params,
    });

    return response.data;
  },

  getGoalById: async (id) => {
    const response = await api.get(`/goals/${id}`);

    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post("/goals", goalData);

    return response.data;
  },

  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);

    return response.data;
  },

  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);

    return response.data;
  },

  // =========================
  // Goal status
  // =========================

  pauseGoal: async (id) => {
    const response = await api.patch(`/goals/${id}/pause`);

    return response.data;
  },

  resumeGoal: async (id) => {
    const response = await api.patch(`/goals/${id}/resume`);

    return response.data;
  },

  completeGoal: async (id) => {
    const response = await api.patch(`/goals/${id}/complete`);

    return response.data;
  },

  archiveGoal: async (id) => {
    const response = await api.patch(`/goals/${id}/archive`);

    return response.data;
  },

  // =========================
  // Goal progress
  // =========================

  getGoalProgress: async (id) => {
    const response = await api.get(`/goals/${id}/progress`);

    return response.data;
  },

  getAllGoalProgress: async () => {
    const response = await api.get("/goals/progress");

    return response.data;
  },

  // =========================
  // Goal filtering
  // =========================

  getActiveGoals: async () => {
    const response = await api.get("/goals", {
      params: {
        status: "ACTIVE",
      },
    });

    return response.data;
  },

  getCompletedGoals: async () => {
    const response = await api.get("/goals", {
      params: {
        status: "COMPLETED",
      },
    });

    return response.data;
  },

  getPausedGoals: async () => {
    const response = await api.get("/goals", {
      params: {
        status: "PAUSED",
      },
    });

    return response.data;
  },

  getArchivedGoals: async () => {
    const response = await api.get("/goals", {
      params: {
        status: "ARCHIVED",
      },
    });

    return response.data;
  },

  // =========================
  // Goal frequency
  // =========================

  getDailyGoals: async () => {
    const response = await api.get("/goals", {
      params: {
        frequency: "DAILY",
      },
    });

    return response.data;
  },

  getWeeklyGoals: async () => {
    const response = await api.get("/goals", {
      params: {
        frequency: "WEEKLY",
      },
    });

    return response.data;
  },

  getMonthlyGoals: async () => {
    const response = await api.get("/goals", {
      params: {
        frequency: "MONTHLY",
      },
    });

    return response.data;
  },
};

export default goalService;
