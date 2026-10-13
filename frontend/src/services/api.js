import axios from "axios";

// api calling for whole website at one place
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://backend.roshnicreations.com/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// --- in-memory access token store (never localStorage) ---
let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;
export const clearAccessToken = () => {
  accessToken = null;
};

// --- attach token to every outgoing request ---
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    if (status !== 401) return Promise.reject(error);
    if (originalRequest._retry) return Promise.reject(error);

    const noRefreshUrls = [
      "/auth/login",
      "/auth/register",
      "/auth/verify-email",
      "/auth/refresh-token",
      "/auth/logout",
    ];
    if (noRefreshUrls.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh-token");
      setAccessToken(data.accessToken); // <-- the missing piece
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
