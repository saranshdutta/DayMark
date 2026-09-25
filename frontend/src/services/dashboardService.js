import api from "./api";

/*
 * Dashboard Services
 *
 * Handles all data required by the DayMark
 * dashboard.
 */

const dashboardService = {
  // =========================
  // Complete dashboard
  // =========================

  getDashboard: async () => {
    const response = await api.get("/dashboard");

    return response.data;
  },

  // =========================
  // Dashboard statistics
  // =========================

  getStats: async () => {
    const response = await api.get("/dashboard/stats");

    return response.data;
  },

  // =========================
  // Today's overview
  // =========================

  getToday: async () => {
    const response = await api.get("/dashboard/today");

    return response.data;
  },

  // =========================
  // Recent activities
  // =========================

  getRecentActivities: async (limit = 5) => {
    const response = await api.get("/dashboard/recent-activities", {
      params: {
        limit,
      },
    });

    return response.data;
  },

  // =========================
  // Active goals
  // =========================

  getActiveGoals: async () => {
    const response = await api.get("/dashboard/active-goals");

    return response.data;
  },

  // =========================
  // Goal progress
  // =========================

  getGoalProgress: async () => {
    const response = await api.get("/dashboard/goal-progress");

    return response.data;
  },

  // =========================
  // Weekly progress
  // =========================

  getWeeklyProgress: async () => {
    const response = await api.get("/dashboard/weekly-progress");

    return response.data;
  },

  // =========================
  // Activity chart
  // =========================

  getActivityChart: async (range = "7d") => {
    const response = await api.get("/dashboard/activity-chart", {
      params: {
        range,
      },
    });

    return response.data;
  },

  // =========================
  // Streak
  // =========================

  getStreak: async () => {
    const response = await api.get("/dashboard/streak");

    return response.data;
  },

  // =========================
  // Notifications
  // =========================

  getNotifications: async (limit = 5) => {
    const response = await api.get("/dashboard/notifications", {
      params: {
        limit,
      },
    });

    return response.data;
  },
};

export default dashboardService;
