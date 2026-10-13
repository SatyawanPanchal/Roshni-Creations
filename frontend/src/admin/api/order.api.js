import api, { NotImplementedError } from "./axiosClient.js";

// GET /order/all (admin only) -> fully populated orders list
export async function getAllOrders() {
  const { data } = await api.get("/order/all");
  return data.orders;
}

// NOTE ON getOrderById:
// The backend's GET /order/:id is scoped to `userId: req.user._id`
// (see orderController.getOrderById), so it only returns an order that
// belongs to the logged-in admin account itself — it will 404 for a
// customer's order. Until an unscoped admin endpoint exists, the Order
// Detail page instead re-fetches the full admin order list and finds
// the order by id client-side (see getOrderFromAllOrders below).
export async function getOrderFromAllOrders(id) {
  const orders = await getAllOrders();
  return orders.find((o) => o._id === id) || null;
}

// ---------------------------------------------------------------------
// STUBS — recommended backend endpoints, not implemented yet.
// See README.md for exact contracts.
// ---------------------------------------------------------------------

// GET /order/admin/:id  (unscoped admin fetch — recommended replacement
// for the workaround above, once available)
export async function getOrderByIdAdmin(id) {
  try {
    const { data } = await api.get(`/order/admin/${id}`);
    return data.order;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new NotImplementedError(
        "GET",
        "/order/admin/:id",
        "Unscoped admin fetch of any order by id (not limited to req.user._id). Should return { success, order } with the same population as getAllOrders."
      );
    }
    throw err;
  }
}

// PATCH /order/updateStatus/:id  body: { orderStatus, courier?, trackingNumber? }
export async function updateOrderStatus(id, { orderStatus, courier, trackingNumber }) {
  try {
    const { data } = await api.patch(`/order/updateStatus/${id}`, {
      orderStatus,
      courier,
      trackingNumber,
    });
    return data.order;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new NotImplementedError(
        "PATCH",
        "/order/updateStatus/:id",
        'body: { orderStatus: string, courier?: string, trackingNumber?: string }. Requires adding "Packed" and "Out for Delivery" to the orderStatus enum, plus `courier`/`trackingNumber` string fields on the Order schema. Should return { success, message, order }.'
      );
    }
    throw err;
  }
}

// PATCH /order/updatePaymentStatus/:id  body: { paymentStatus, transactionId? }
export async function updateOrderPaymentStatus(id, { paymentStatus, transactionId }) {
  try {
    const { data } = await api.patch(`/order/updatePaymentStatus/${id}`, {
      paymentStatus,
      transactionId,
    });
    return data.order;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new NotImplementedError(
        "PATCH",
        "/order/updatePaymentStatus/:id",
        'body: { paymentStatus: "Pending"|"Paid"|"Failed", transactionId?: string }.'
      );
    }
    throw err;
  }
}

// PATCH /order/cancel/:id
export async function cancelOrder(id) {
  try {
    const { data } = await api.patch(`/order/cancel/${id}`);
    return data.order;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new NotImplementedError(
        "PATCH",
        "/order/cancel/:id",
        "Should set orderStatus to Cancelled (and ideally trigger a refund flow if already paid). Returns { success, message, order }."
      );
    }
    throw err;
  }
}
