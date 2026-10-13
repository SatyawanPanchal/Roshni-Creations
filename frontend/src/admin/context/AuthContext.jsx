/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { tokenStore } from "../api/axiosClient.js";
import { login as loginApi, logout as logoutApi } from "../api/auth.api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/profile")
      .then(({ data }) => {
        setUser(data.user);
        tokenStore.setUser(data.user);
      })
      .catch(() => {
        tokenStore.clear();
        tokenStore.clearUser();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const loggedInUser = await loginApi(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
