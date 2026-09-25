import api from "./api";

/*
 * Activity Services
 *
 * Handles all activity-related API requests.
 *
 * API base:
 * http://localhost:5000/api
 *
 * Endpoints:
 * GET    /activities
 * GET    /activities/:id
 * POST   /activities
 * PUT    /activities/:id
 * DELETE /activities/:id
 *
 * Activity logs:
 * GET    /activity-logs
 * GET    /activity-logs/:id
 * POST   /activity-logs
 * PUT    /activity-logs/:id
 * DELETE /activity-logs/:id
 */

const activityService = {
  // =========================
  // Activity definitions
  // =========================

  getActivities: async (params = {}) => {
    const response = await api.get("/activities", {
      params,
    });

    return response.data;
  },

  getActivityById: async (id) => {
    const response = await api.get(`/activities/${id}`);

    return response.data;
  },

  createActivity: async (activityData) => {
    const response = await api.post("/activities", activityData);

    return response.data;
  },

  updateActivity: async (id, activityData) => {
    const response = await api.put(`/activities/${id}`, activityData);

    return response.data;
  },

  deleteActivity: async (id) => {
    const response = await api.delete(`/activities/${id}`);

    return response.data;
  },

  // =========================
  // Activity logs
  // =========================

  getActivityLogs: async (params = {}) => {
    const response = await api.get("/activity-logs", {
      params,
    });

    return response.data;
  },

  getActivityLogById: async (id) => {
    const response = await api.get(`/activity-logs/${id}`);

    return response.data;
  },

  createActivityLog: async (logData) => {
    const response = await api.post("/activity-logs", logData);

    return response.data;
  },

  updateActivityLog: async (id, logData) => {
    const response = await api.put(`/activity-logs/${id}`, logData);

    return response.data;
  },

  deleteActivityLog: async (id) => {
    const response = await api.delete(`/activity-logs/${id}`);

    return response.data;
  },

  // =========================
  // Convenience methods
  // =========================

  getTodayLogs: async () => {
    const response = await api.get("/activity-logs/today");

    return response.data;
  },

  getLogsByDate: async (date) => {
    const response = await api.get("/activity-logs", {
      params: {
        date,
      },
    });

    return response.data;
  },

  getLogsByDateRange: async (startDate, endDate) => {
    const response = await api.get("/activity-logs", {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  },
};

export default activityService;
