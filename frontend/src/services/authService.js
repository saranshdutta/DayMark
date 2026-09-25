import api from "./api";

/*
 * Authentication Services
 *
 * Handles:
 * - Register
 * - Login
 * - Current user
 * - Profile update
 * - Password change
 * - Forgot password
 * - Reset password
 * - Logout
 */

const authService = {
  // =========================
  // Authentication
  // =========================

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);

    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");

    return response.data;
  },

  // =========================
  // Current user
  // =========================

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");

    return response.data;
  },

  // =========================
  // Profile
  // =========================

  getProfile: async () => {
    const response = await api.get("/users/profile");

    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);

    return response.data;
  },

  // =========================
  // Password
  // =========================

  changePassword: async (passwordData) => {
    const response = await api.put("/auth/change-password", passwordData);

    return response.data;
  },

  // =========================
  // Forgot password
  // =========================

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
    });

    return response.data;
  },
};

export default authService;
