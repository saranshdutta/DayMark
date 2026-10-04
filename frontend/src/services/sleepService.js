import api from "./api";

const sleepService = {
  getSleepRecords: (params = {}) => api.get("/sleep", { params }).then((r) => r.data),
  getSleepById: (id) => api.get(`/sleep/${id}`).then((r) => r.data),
  getSleepStats: (params = {}) => api.get("/sleep/stats", { params }).then((r) => r.data),
  createSleepRecord: (data) => api.post("/sleep", data).then((r) => r.data),
  updateSleepRecord: (id, data) => api.put(`/sleep/${id}`, data).then((r) => r.data),
  deleteSleepRecord: (id) => api.delete(`/sleep/${id}`).then((r) => r.data),
};

export default sleepService;
