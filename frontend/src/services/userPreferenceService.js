import api from "./api";

const userPreferenceService = {
  getPreferences: () => api.get("/users/preferences").then((r) => r.data),
  updatePreferences: (data) => api.put("/users/preferences", data).then((r) => r.data),
};

export default userPreferenceService;
