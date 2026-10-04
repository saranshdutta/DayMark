import api from "./api";

const focusService = {
  getFocusSessions: (params = {}) => api.get("/focus", { params }).then((r) => r.data),
  getFocusStats: (params = {}) => api.get("/focus/stats", { params }).then((r) => r.data),
  createFocusSession: (data) => api.post("/focus", data).then((r) => r.data),
  updateFocusSession: (id, data) => api.put(`/focus/${id}`, data).then((r) => r.data),
  deleteFocusSession: (id) => api.delete(`/focus/${id}`).then((r) => r.data),
};

export default focusService;
