import api from "./api";

/*
 * Analytics Services
 *
 * Handles analytics, trends, category breakdowns,
 * goal analytics, and streak information.
 */

const analyticsService = {
  // =========================
  // Overview
  // =========================

  getOverview: async (params = {}) => {
    const response = await api.get("/analytics/overview", {
      params,
    });

    return response.data;
  },

  // =========================
  // Activity analytics
  // =========================

  getActivityTrend: async (params = {}) => {
    const response = await api.get("/analytics/activity-trend", {
      params,
    });

    return response.data;
  },

  getActivitySummary: async (startDate, endDate) => {
    const response = await api.get("/analytics/activity-summary", {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  },

  getCategoryBreakdown: async (params = {}) => {
    const response = await api.get("/analytics/category-breakdown", {
      params,
    });

    return response.data;
  },

  // =========================
  // Goal analytics
  // =========================

  getGoalAnalytics: async (startDate, endDate) => {
    const response = await api.get("/analytics/goals", {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  },

  getGoalCompletion: async (startDate, endDate) => {
    const response = await api.get("/analytics/goal-completion", {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  },

  // =========================
  // Time analytics
  // =========================

  getTimeAnalytics: async (startDate, endDate) => {
    const response = await api.get("/analytics/time", {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  },

  // =========================
  // Streak analytics
  // =========================

  getStreak: async () => {
    const response = await api.get("/analytics/streak");

    return response.data;
  },

  getStreakHistory: async (startDate, endDate) => {
    const response = await api.get("/analytics/streak-history", {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  },

  // =========================
  // Date-range analytics
  // =========================

  getByRange: async (range = "7d") => {
    const response = await api.get("/analytics", {
      params: {
        range,
      },
    });

    return response.data;
  },

  // =========================
  // Custom analytics
  // =========================

  getCustomRange: async (startDate, endDate) => {
    const response = await api.get("/analytics", {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  },
};

export default analyticsService;
