import api, { tokenStore } from "./axiosClient.js";

// POST /auth/login  { email, password } -> { success, accessToken, user }
export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  tokenStore.set(data.accessToken);
  tokenStore.setUser(data.user);
  return data.user;
}

// GET /auth/profile (Bearer token) -> { success, user }
export async function fetchProfile() {
  const { data } = await api.get("/auth/profile");
  tokenStore.setUser(data.user);
  return data.user;
}

// POST /auth/logout (Bearer token)
export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    tokenStore.clear();
    tokenStore.clearUser();
  }
}
