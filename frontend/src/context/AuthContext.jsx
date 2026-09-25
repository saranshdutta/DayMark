import { createContext, useContext, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("daymark_token");
        if (savedToken) {
          setToken(savedToken);
          // Set token in api interceptor (already handled in api.js by reading localStorage)
          
          // Verify token and get user
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to restore authentication:", error);
        localStorage.removeItem("daymark_token");
        localStorage.removeItem("daymark_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    if (authToken) {
      localStorage.setItem("daymark_token", authToken);
    }
    if (userData) {
      localStorage.setItem("daymark_user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("daymark_token");
    localStorage.removeItem("daymark_user");
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = await authService.updateProfile(updatedData);
      setUser(updatedUser);
      localStorage.setItem("daymark_user", JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  };

  const isAuthenticated = Boolean(token);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      logout,
      updateUser,
    }),
    [user, token, loading, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export default AuthProvider;
