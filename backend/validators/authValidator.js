import validator from "validator";

export const validateRegister = (req, res, next) => {
  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !firstName.trim()) {
    return res.status(400).json({
      success: false,
      message: "First name is required",
    });
  }

  if (!lastName || !lastName.trim()) {
    return res.status(400).json({
      success: false,
      message: "Last name is required",
    });
  }

  if (!email || !validator.isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  if (!phone || !phone.trim()) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  next();
};

export const validateVerifyEmail = (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !validator.isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: "OTP must be a 6-digit number",
    });
  }

  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  next();
};

export const validateResetPassword = (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !validator.isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: "OTP must be a 6-digit number",
    });
  }

  if (!newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password is required",
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters",
    });
  }

  next();
};

export const validateResendOTP = (req, res, next) => {
  const { email, purpose } = req.body;

  if (!email || !validator.isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  const allowedPurposes = [
    "emailVerification",
    "forgotPassword",
  ];

  if (!purpose || !allowedPurposes.includes(purpose)) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP purpose",
    });
  }

  next();
};