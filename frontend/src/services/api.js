import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Attach JWT token to every authenticated request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("daymark_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/*
 * Handle authentication failures globally.
 * Only redirect to login if the 401 is NOT from an auth endpoint
 * (login/register themselves can return 401 for bad credentials).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Only clear + redirect if we are genuinely unauthenticated
      const token = localStorage.getItem("daymark_token");
      if (token) {
        // Token was present but server rejected it (expired/invalid)
        localStorage.removeItem("daymark_token");
        localStorage.removeItem("daymark_user");

        const authPaths = ["/login", "/register", "/forgot-password", "/"];
        const isOnAuthPage = authPaths.some((p) => window.location.pathname === p);
        if (!isOnAuthPage) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
