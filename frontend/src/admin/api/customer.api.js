import api from "./axiosClient.js";

// ============================================================
// GET ALL CUSTOMERS
// GET /auth/admin/all
// ============================================================

export async function getAllCustomers() {
  const { data } = await api.get("/auth/admin/all");

  return data.data;
}


// ============================================================
// GET CUSTOMER BY ID
// GET /auth/admin/:id
// ============================================================

export async function getCustomerById(id) {
  const { data } = await api.get(`/auth/admin/${id}`);

  return data.data;
}


// ============================================================
// ACTIVATE / DEACTIVATE CUSTOMER
// PATCH /auth/admin/:id/status
// ============================================================

export async function toggleCustomerStatus(id, isActive) {
  const { data } = await api.patch(
    `/auth/admin/${id}/status`,
    {
      isActive,
    }
  );

  return data.data;
}