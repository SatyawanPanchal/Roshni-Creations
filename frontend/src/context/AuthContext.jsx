/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import api, {
  setAccessToken,
  clearAccessToken,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // GET LOGGED-IN USER
  // ============================================================

  const getProfile = useCallback(async () => {
    try {
      const response = await api.get("/auth/profile");

      const currentUser = response.data?.user;

      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }

      return currentUser || null;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  // ============================================================
  // CHECK AUTHENTICATION ON APP START
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const checkAuthentication = async () => {
      try {
        /*
         * Access token is stored in memory.
         *
         * After page refresh, get a new access token
         * using the refresh-token cookie.
         */

        const response = await api.post(
          "/auth/refresh-token"
        );

        if (!mounted) return;

        const newAccessToken =
          response.data?.accessToken;

        if (!newAccessToken) {
          clearAccessToken();
          setUser(null);
          return;
        }

        setAccessToken(newAccessToken);

        await getProfile();
      } catch (error) {
        /*
         * 401 simply means there is no valid session.
         */

        if (error.response?.status !== 401) {
          console.error(
            "Authentication check failed:",
            error
          );
        }

        clearAccessToken();
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      mounted = false;
    };
  }, [getProfile]);

  // ============================================================
  // LOGIN
  // ============================================================

  const login = useCallback(
    async (email, password) => {
      /*
       * Supports:
       *
       * login(email, password)
       *
       * and also:
       *
       * login({ email, password })
       */

      const credentials =
        typeof email === "object"
          ? email
          : {
              email,
              password,
            };

      const response = await api.post(
        "/auth/login",
        credentials
      );

      const accessToken =
        response.data?.accessToken;

      const loggedInUser =
        response.data?.user;

      if (accessToken) {
        setAccessToken(accessToken);
      }

      if (loggedInUser) {
        setUser(loggedInUser);
      }

      return response.data;
    },
    []
  );

  // ============================================================
  // REGISTER
  // ============================================================

  const register = useCallback(async (userData) => {
    const response = await api.post(
      "/auth/register",
      userData
    );

    return response.data;
  }, []);

  // ============================================================
  // VERIFY EMAIL
  // ============================================================

  const verifyEmail = useCallback(async (data) => {
    const response = await api.post(
      "/auth/verify-email",
      data
    );

    const accessToken =
      response.data?.accessToken;

    const verifiedUser =
      response.data?.user;

    if (accessToken) {
      setAccessToken(accessToken);
    }

    if (verifiedUser) {
      setUser(verifiedUser);
    }

    return response.data;
  }, []);

  // ============================================================
  // RESEND OTP
  // ============================================================

  const resendOTP = useCallback(async (data) => {
    const response = await api.post(
      "/auth/resend-otp",
      data
    );

    return response.data;
  }, []);

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  const forgotPassword = useCallback(async (data) => {
    const response = await api.post(
      "/auth/forgot-password",
      data
    );

    return response.data;
  }, []);

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const resetPassword = useCallback(async (data) => {
    const response = await api.post(
      "/auth/reset-password",
      data
    );

    return response.data;
  }, []);

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      /*
       * Even if server logout fails,
       * clear local authentication state.
       */

      if (error.response?.status !== 401) {
        console.error("Logout error:", error);
      }
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value = {
    // User
    user,

    // Authentication state
    loading,
    isAuthenticated: !!user,

    // Role helpers
    isAdmin: user?.role === "admin",

    // Authentication
    login,
    logout,

    // Profile
    getProfile,

    // Registration / verification
    register,
    verifyEmail,
    resendOTP,

    // Password
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// USE AUTH
// ============================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};