import api from "./api";

const wellnessService = {
  getCheckIns: (params = {}) => api.get("/wellness", { params }).then((r) => r.data),
  getTodayCheckIn: () => api.get("/wellness/today").then((r) => r.data),
  getTrends: (params = {}) => api.get("/wellness/trends", { params }).then((r) => r.data),
  getCheckInById: (id) => api.get(`/wellness/${id}`).then((r) => r.data),
  createCheckIn: (data) => api.post("/wellness", data).then((r) => r.data),
  updateCheckIn: (id, data) => api.put(`/wellness/${id}`, data).then((r) => r.data),
  deleteCheckIn: (id) => api.delete(`/wellness/${id}`).then((r) => r.data),
};

export default wellnessService;
