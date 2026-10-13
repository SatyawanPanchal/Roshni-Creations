import express from "express";

import {
  createOrder,
  createOrderAtRzp,
  getMyOrders,
  getAllOrders,
  getOrderById,
  verifyOrderAtRzp,
  cancelOrder,
  updateOrderPaymentStatus,
  updateOrderStatus,
  getOrderByIdAdmin,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* =====================================================
   CUSTOMER ROUTES
   ===================================================== */

// rzp order creation route
router.post("/create-order", authMiddleware, createOrderAtRzp);

// rzp payment verification
router.post("/verify-payment", authMiddleware, verifyOrderAtRzp);

// Create order
router.post("/create", authMiddleware, createOrder);

// Get logged-in customer's orders
router.get("/my-orders", authMiddleware, getMyOrders);

/* =====================================================
   ADMIN ROUTES
   ===================================================== */

// Get all orders
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);

/* =====================================================
   SINGLE ORDER
   ===================================================== */

// Get single order
router.get("/:id", authMiddleware, getOrderById);

router.get("/admin/:id", authMiddleware, adminMiddleware, getOrderByIdAdmin);
router.patch(
  "/updateStatus/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus,
);
router.patch(
  "/updatePaymentStatus/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderPaymentStatus,
);
router.patch("/cancel/:id", authMiddleware, adminMiddleware, cancelOrder);

export default router;
