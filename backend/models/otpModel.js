import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: [true, "OTP hash is required"],
    },

    purpose: {
      type: String,
      enum: ["emailVerification", "forgotPassword"],
      required: [true, "OTP purpose is required"],
    },

    attempts: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: [true, "OTP expiry is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete expired OTP documents
otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;