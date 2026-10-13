import express from "express";

import {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  getProfile,
  forgotPassword,
  resetPassword,
  resendOTP,
  logoutUser,
  getCustomerByIdAdmin,
  toggleCustomerStatus,
  getAllCustomersAdmin,
} from "../controllers/authController.js";

import {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  validateForgotPassword,
  validateResetPassword,
  validateResendOTP,
} from "../validators/authValidator.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Customer Authentication
|--------------------------------------------------------------------------
*/

// Register
router.post("/register", validateRegister, registerUser);

// Verify email OTP
router.post("/verify-email", validateVerifyEmail, verifyEmail);

// Login
router.post("/login", validateLogin, loginUser);

// Refresh access token
router.post("/refresh-token", refreshAccessToken);

// Get logged-in user profile
router.get("/profile", authMiddleware, getProfile);

// Forgot password
router.post("/forgot-password", validateForgotPassword, forgotPassword);

// Reset password
router.post("/reset-password", validateResetPassword, resetPassword);

// Resend OTP
router.post("/resend-otp", validateResendOTP, resendOTP);

// Logout
router.post("/logout", authMiddleware, logoutUser);

// ============================================================
// ADMIN CUSTOMER MANAGEMENT
// ============================================================

// Get all customers
router.get("/admin/all", authMiddleware, adminMiddleware, getAllCustomersAdmin);

// Get single customer
router.get("/admin/:id",  authMiddleware,adminMiddleware, getCustomerByIdAdmin);

// Activate / deactivate customer
router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  toggleCustomerStatus,
);
  
export default router;
