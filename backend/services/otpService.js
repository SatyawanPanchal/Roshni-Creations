import crypto from "crypto";
import OTP from "../models/otpModel.js";

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashOTP = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

export const createOTP = async (email, purpose) => {
  const normalizedEmail = email.trim().toLowerCase();

  const allowedPurposes = [
    "emailVerification",
    "forgotPassword",
  ];

  if (!allowedPurposes.includes(purpose)) {
    throw new Error("Invalid OTP purpose");
  }

  // Check resend cooldown
  const recentOTP = await OTP.findOne({
    email: normalizedEmail,
    purpose,
    createdAt: {
      $gt: new Date(
        Date.now() - RESEND_COOLDOWN_SECONDS * 1000
      ),
    },
  });

  if (recentOTP) {
    const secondsPassed = Math.floor(
      (Date.now() - recentOTP.createdAt.getTime()) / 1000
    );

    const remainingSeconds =
      RESEND_COOLDOWN_SECONDS - secondsPassed;

    const error = new Error(
      `Please wait ${remainingSeconds} seconds before requesting another OTP`
    );

    error.statusCode = 429;

    throw error;
  }

  // Remove previous OTP for the same purpose
  await OTP.deleteMany({
    email: normalizedEmail,
    purpose,
  });

  const otp = generateOTP();
  const otpHash = hashOTP(otp);

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await OTP.create({
    email: normalizedEmail,
    otpHash,
    purpose,
    attempts: 0,
    expiresAt,
  });

  return {
    otp,
    expiresAt,
  };
};

export const verifyOTP = async (email, otp, purpose) => {
  const normalizedEmail = email.trim().toLowerCase();

  const otpRecord = await OTP.findOne({
    email: normalizedEmail,
    purpose,
  });

  if (!otpRecord) {
    const error = new Error("Invalid or expired OTP");
    error.statusCode = 400;
    throw error;
  }

  // Check expiry
  if (otpRecord.expiresAt < new Date()) {
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    const error = new Error("OTP has expired");
    error.statusCode = 400;
    throw error;
  }

  // Check maximum attempts
  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    const error = new Error(
      "Too many incorrect attempts. Please request a new OTP"
    );

    error.statusCode = 429;
    throw error;
  }

  const otpHash = hashOTP(otp);

  // Invalid OTP
  if (otpHash !== otpRecord.otpHash) {
    otpRecord.attempts += 1;
    await otpRecord.save();

    const remainingAttempts =
      MAX_OTP_ATTEMPTS - otpRecord.attempts;

    const error = new Error(
      remainingAttempts > 0
        ? `Invalid OTP. ${remainingAttempts} attempts remaining`
        : "Too many incorrect attempts. Please request a new OTP"
    );

    error.statusCode =
      remainingAttempts > 0 ? 400 : 429;

    throw error;
  }

  // OTP is valid
  await OTP.deleteOne({
    _id: otpRecord._id,
  });

  return true;
};