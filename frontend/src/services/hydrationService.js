import api from "./api";

const hydrationService = {
  getHydrationLogs: (params = {}) => api.get("/hydration", { params }).then((r) => r.data),
  getTodayHydration: () => api.get("/hydration/today").then((r) => r.data),
  getWeeklyHydration: (params = {}) => api.get("/hydration/weekly", { params }).then((r) => r.data),
  logHydration: (data) => api.post("/hydration", data).then((r) => r.data),
  deleteHydrationLog: (id) => api.delete(`/hydration/${id}`).then((r) => r.data),
};

export default hydrationService;
