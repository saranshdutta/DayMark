import { useAuth as useAuthContext } from "../context/AuthContext";

function useAuth() {
  const { user, token, loading, isAuthenticated, login, logout, updateUser } =
    useAuthContext();

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };
}

export default useAuth;
