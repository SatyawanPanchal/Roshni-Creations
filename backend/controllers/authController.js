import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import addressModel from "../models/addressModel.js";
import Order from "../models/orderModel.js";

import { createOTP, verifyOTP } from "../services/otpService.js";

import {
  sendVerificationOTP,
  sendPasswordResetOTP,
} from "../services/emailService.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/tokenService.js";

const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

const normalizePhone = (phone) => {
  return phone.trim().replace(/\s+/g, "");
};

const getSafeUser = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/* =========================
   REGISTER USER
========================= */

export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    let user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    // Existing user
    if (user) {
      // Existing but not verified
      if (!user.isEmailVerified) {
        const { otp } = await createOTP(normalizedEmail, "emailVerification");

        await sendVerificationOTP(normalizedEmail, otp);

        return res.status(200).json({
          success: true,
          message:
            "Your account already exists but your email is not verified. A new OTP has been sent.",
          requiresEmailVerification: true,
        });
      }

      return res.status(409).json({
        success: false,
        message: "Unable to create account with these details.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
    });

    const { otp } = await createOTP(normalizedEmail, "emailVerification");

    await sendVerificationOTP(normalizedEmail, otp);

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email.",
      requiresEmailVerification: true,
      email: normalizedEmail,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   VERIFY EMAIL
========================= */

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification request.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    await verifyOTP(normalizedEmail, otp, "emailVerification");

    user.isEmailVerified = true;

    await user.save();

    // Automatically log the user in
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      accessToken,
      user: getSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   LOGIN USER
========================= */

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is currently inactive.",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
        requiresEmailVerification: true,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();

    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken,
      user: getSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   REFRESH ACCESS TOKEN
========================= */

export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found.",
      });
    }

    let decoded;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET PROFILE
========================= */

export const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: getSafeUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   FORGOT PASSWORD
========================= */

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Do not reveal whether email exists
    if (user && user.isActive) {
      const { otp } = await createOTP(normalizedEmail, "forgotPassword");

      await sendPasswordResetOTP(normalizedEmail, otp);
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset OTP has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   RESET PASSWORD
========================= */

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password +refreshToken");

    if (!user || !user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Invalid password reset request.",
      });
    }

    await verifyOTP(normalizedEmail, otp, "forgotPassword");

    user.password = await bcrypt.hash(newPassword, 12);

    // Invalidate existing sessions
    user.refreshToken = null;

    await user.save();

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   RESEND OTP
========================= */

export const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the account exists, a new OTP has been sent.",
      });
    }

    if (purpose === "emailVerification" && user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    const { otp } = await createOTP(normalizedEmail, purpose);

    if (purpose === "emailVerification") {
      await sendVerificationOTP(normalizedEmail, otp);
    }

    if (purpose === "forgotPassword") {
      await sendPasswordResetOTP(normalizedEmail, otp);
    }

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   LOGOUT USER
========================= */

export const logoutUser = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        refreshToken: null,
      });
    }

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET ALL CUSTOMERS — ADMIN
// GET /users/admin/all
// ============================================================

export const getAllCustomersAdmin = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" })
      .select(
        "_id firstName lastName email phone role isEmailVerified isActive lastLoginAt createdAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate order stats per user
    const stats = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["cancelled", "failed"] }, // adjust to your statuses
        },
      },
      {
        $group: {
          _id: "$user", // change to "$customer" if that's your field name
          ordersCount: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" }, // change to your amount field
        },
      },
    ]);

    const statsMap = new Map(stats.map((s) => [String(s._id), s]));

    const data = customers.map((c) => {
      const s = statsMap.get(String(c._id));
      return {
        ...c,
        ordersCount: s?.ordersCount ?? 0,
        totalSpent: s?.totalSpent ?? 0,
      };
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get all customers error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching customers",
    });
  }
};

// ============================================================
// GET SINGLE CUSTOMER — ADMIN
// GET /users/admin/:id
// ============================================================

export const getCustomerByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "user",
    })
      .select(
        "_id firstName lastName email phone role isEmailVerified isActive lastLoginAt createdAt",
      )
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const addresses = await addressModel
      .find({ userId: id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    const orders = await Order.find({ userId: id })
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        ...user,
        addresses,
        orders,
      },
    });
  } catch (error) {
    console.error("Get customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching customer",
    });
  }
};

// ============================================================
// TOGGLE CUSTOMER ACTIVE STATUS — ADMIN
// PATCH /users/admin/:id/status
// ============================================================

export const toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    const user = await User.findOne({
      _id: id,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    user.isActive = isActive;

    await user.save();

    const safeUser = getSafeUser(user);

    return res.status(200).json({
      success: true,
      message: `Customer ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      data: safeUser,
    });
  } catch (error) {
    console.error("Toggle customer status error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating customer status",
    });
  }
};
