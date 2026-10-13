import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import loginImage from "../../images/login-jewellery.png";

const LoginSignupOverlay = ({ visible, onHide }) => {
  const { login, register, verifyEmail, resendOTP } = useAuth();

  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("form");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Login response:", response);

      setSuccess(response.message || "Login successful.");

      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (error) {
      console.error("Login error:", error);

      setError(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }

    if (!lastName.trim()) {
      setError("Please enter your last name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        password,
      });

      console.log("Register response:", response);

      setSuccess(
        response.message || "OTP has been sent to your email address.",
      );

      setStep("otp");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Verify Email
  |--------------------------------------------------------------------------
  */

  const handleVerifyOTP = async () => {
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyEmail({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      console.log("Verification response:", response);

      setSuccess(response.message || "Email verified successfully.");

      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (error) {
      console.error("OTP verification error:", error);

      setError(error.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Resend OTP
  |--------------------------------------------------------------------------
  */

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await resendOTP({
        email: email.trim().toLowerCase(),
      });

      setSuccess(response.message || "A new OTP has been sent to your email.");
    } catch (error) {
      console.error("Resend OTP error:", error);

      setError(error.response?.data?.message || "Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Change Login / Register Mode
  |--------------------------------------------------------------------------
  */

  const changeMode = (newMode) => {
    setMode(newMode);
    setStep("form");

    setError("");
    setSuccess("");
    setOtp("");
  };

  /*
  |--------------------------------------------------------------------------
  | Close
  |--------------------------------------------------------------------------
  */

  const handleClose = () => {
    setMode("login");
    setStep("form");

    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setOtp("");

    setError("");
    setSuccess("");

    onHide();
  };

  if (!visible) return null;

  return (
    <div className="tw:fixed tw:inset-0 tw:z-[9999] tw:flex tw:items-center tw:justify-center tw:!bg-black/50 tw:p-0 tw:sm:p-4">
      <div
        className="
          tw:!relative
          tw:!w-full
          tw:!h-full
          tw:sm:h-auto
          tw:sm:max-w-350.5
          tw:overflow-hidden
          tw:bg-white
          tw:sm:rounded-[28px]
          tw:flex
          tw:flex-row
        "
      >
        {/* CLOSE */}

        <button
          type="button"
          onClick={handleClose}
          className="
            tw:absolute
            tw:right-5
            tw:top-5
            tw:z-20
            tw:w-9
            tw:h-9
            tw:flex
            tw:items-center
            tw:justify-center
            tw:bg-transparent
            tw:border-0
            tw:text-black
            tw:text-3xl
            tw:font-light
            tw:cursor-pointer
          "
        >
          ×
        </button>

        {/* IMAGE */}

        <div
          className="
            tw:hidden
            tw:md:block
            tw:w-1/2
            tw:min-h-[650px]
            tw:bg-black
          "
        >
          <img
            src={loginImage}
            alt="Roshni Creations Jewellery"
            className="tw:w-full tw:h-full tw:object-cover"
          />
        </div>

        {/* CONTENT */}

        <div
          className="
            tw:w-full
            tw:md:w-1/2
            tw:min-h-full
            tw:md:min-h-[650px]
            tw:flex
            tw:items-center
            tw:justify-center
            tw:px-6
            tw:sm:px-10
            tw:md:px-12
            tw:lg:px-20
            tw:py-12
          "
        >
          <div className="tw:w-full tw:max-w-[520px] tw:text-center">
            {/* OTP */}

            {step === "otp" ? (
              <>
                <h2 className="tw:m-0 tw:text-[30px] tw:font-normal tw:text-[#111111]">
                  VERIFY EMAIL
                </h2>

                <p className="tw:mt-7 tw:mb-2 tw:text-[18px] tw:text-[#666666]">
                  We've sent a 6-digit OTP to
                </p>

                <p className="tw:mb-8 tw:text-[18px] tw:font-medium tw:text-[#111111] tw:break-all">
                  {email}
                </p>

                <InputText
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter OTP"
                  className="
                    tw:w-full
                    tw:!h-[74px]
                    tw:!text-center
                    tw:!text-[24px]
                    tw:!tracking-[10px]
                    tw:!border
                    tw:!border-[#B9B9B9]
                    tw:!rounded-[12px]
                  "
                />

                {error && (
                  <p className="tw:mt-4 tw:text-sm tw:text-red-600">{error}</p>
                )}

                {success && (
                  <p className="tw:mt-4 tw:text-sm tw:text-green-600">
                    {success}
                  </p>
                )}

                <Button
                  label={loading ? "VERIFYING..." : "VERIFY EMAIL"}
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="
                    tw:!w-full
                    tw:!h-[82px]
                    tw:!mt-6
                    tw:!bg-black
                    tw:!border-black
                    tw:!rounded-[10px]
                    tw:!text-white
                    tw:!text-[20px]
                  "
                />

                <Button
                  label="RESEND OTP"
                  onClick={handleResendOTP}
                  disabled={loading}
                  text
                  className="tw:!mt-4 tw:!text-black"
                />

                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                  className="
                    tw:block
                    tw:mx-auto
                    tw:mt-2
                    tw:border-0
                    tw:bg-transparent
                    tw:text-[#666666]
                    tw:text-sm
                    tw:underline
                    tw:cursor-pointer
                  "
                >
                  Change details
                </button>
              </>
            ) : (
              <>
                {/* TITLE */}

                <h2 className="tw:m-0 tw:text-[30px] tw:font-normal tw:text-[#111111]">
                  {mode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}
                </h2>

                <p className="tw:mt-7 tw:mb-8 tw:text-[18px] tw:text-[#666666]">
                  {mode === "login"
                    ? "Login to continue your Roshni Creations journey."
                    : "Your front row seat to all things!"}
                </p>

                {/* REGISTER FIELDS */}

                {mode === "register" && (
                  <>
                    <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:mb-4">
                      <InputText
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="
                          tw:w-full
                          tw:!h-[74px]
                          tw:!px-6
                          tw:!text-[20px]
                          tw:!border
                          tw:!border-[#B9B9B9]
                          tw:!rounded-[12px]
                        "
                      />

                      <InputText
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="
                          tw:w-full
                          tw:!h-[74px]
                          tw:!px-6
                          tw:!text-[20px]
                          tw:!border
                          tw:!border-[#B9B9B9]
                          tw:!rounded-[12px]
                        "
                      />
                    </div>
                  </>
                )}

                {/* EMAIL */}

                <InputText
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email Address"
                  className="
                    tw:w-full
                    tw:!h-[74px]
                    tw:!px-6
                    tw:!mb-4
                    tw:!text-[20px]
                    tw:!border
                    tw:!border-[#B9B9B9]
                    tw:!rounded-[12px]
                  "
                />

                {/* PHONE */}

                {mode === "register" && (
                  <div
                    className="
                      tw:w-full
                      tw:h-[74px]
                      tw:flex
                      tw:items-center
                      tw:border
                      tw:border-[#B9B9B9]
                      tw:rounded-[12px]
                      tw:overflow-hidden
                      tw:mb-4
                    "
                  >
                    <div className="tw:px-5 tw:text-[20px] tw:shrink-0">🇮🇳</div>

                    <InputText
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      placeholder="Phone Number"
                      className="
                        tw:w-full
                        tw:!h-full
                        tw:!border-0
                        tw:!shadow-none
                        tw:!text-[20px]
                      "
                    />
                  </div>
                )}

                {/* PASSWORD */}

                <Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  feedback={mode === "register"}
                  toggleMask
                  className="tw:w-full tw:!mb-8"
                  inputClassName="
                    tw:!w-full
                    tw:!h-[74px]
                    tw:!px-6
                    tw:!text-[20px]
                    tw:!border
                    tw:!border-[#B9B9B9]
                    tw:!rounded-[12px]
                  "
                />

                {/* ERROR */}

                {error && (
                  <p className="tw:mb-4 tw:text-sm tw:text-red-600">{error}</p>
                )}

                {/* SUCCESS */}

                {success && (
                  <p className="tw:mb-4 tw:text-sm tw:text-green-600">
                    {success}
                  </p>
                )}

                {/* ACTION */}

                <Button
                  label={
                    loading
                      ? "PLEASE WAIT..."
                      : mode === "login"
                        ? "LOGIN"
                        : "CONTINUE"
                  }
                  onClick={mode === "login" ? handleLogin : handleRegister}
                  disabled={loading}
                  className="
                    tw:!w-full
                    tw:!h-[82px]
                    tw:!bg-black
                    tw:!border-black
                    tw:!rounded-[10px]
                    tw:!text-white
                    tw:!text-[20px]
                    tw:!font-semibold
                    tw:!tracking-wide
                  "
                />

                {/* SWITCH MODE */}

                <p className="tw:mt-7 tw:text-[16px] tw:text-[#666666]">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}

                  <button
                    type="button"
                    onClick={() =>
                      changeMode(mode === "login" ? "register" : "login")
                    }
                    className="
                      tw:ml-2
                      tw:border-0
                      tw:bg-transparent
                      tw:text-black
                      tw:font-semibold
                      tw:underline
                      tw:cursor-pointer
                    "
                  >
                    {mode === "login" ? "Sign Up" : "Login"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupOverlay;
