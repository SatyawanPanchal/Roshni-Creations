import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const SERIF = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const SANS = "'Montserrat', system-ui, sans-serif";

const inputClass = `
  tw:w-full
  tw:!h-[56px]
  tw:!px-5
  tw:!text-[16px]
  tw:!text-[#1F1F1F]
  tw:!bg-[#FAF7F0]
  tw:!border
  tw:!border-[#DDD6C6]
  tw:!rounded-[10px]
  tw:!shadow-none
  tw:placeholder:!text-[#B9B2A2]
  tw:focus:!border-[#B08D2E]
`;

const labelClass =
  "tw:block tw:text-[13px] tw:font-medium tw:uppercase tw:tracking-[0.06em] tw:text-[#1F1F1F]";

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
    <div className="tw:fixed tw:inset-0 tw:z-[9999] tw:flex tw:items-center tw:justify-center tw:!bg-black/70 tw:p-4 tw:overflow-y-auto">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Montserrat:wght@400;500;600&display=swap');`}</style>

      <div
        style={{ fontFamily: SANS }}
        className="
          tw:!relative
          tw:w-full
          tw:max-w-[525px]
          tw:my-auto
          tw:bg-[#FAF7F0]
          tw:rounded-[20px]
          tw:px-10
          tw:pt-10
          tw:pb-8
          tw:text-left
        "
      >
        {/* CLOSE */}

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="
            tw:absolute
            tw:right-5
            tw:top-5
            tw:z-20
            tw:w-8
            tw:h-8
            tw:flex
            tw:items-center
            tw:justify-center
            tw:bg-transparent
            tw:border-0
            tw:text-[#555555]
            tw:text-2xl
            tw:font-light
            tw:leading-none
            tw:cursor-pointer
          "
        >
          ×
        </button>

        {/* BRAND */}

        {/* <div className="tw:text-center">
          <h1
            style={{ fontFamily: SERIF }}
            className="tw:m-0 tw:text-[28px] tw:font-normal tw:uppercase tw:tracking-[0.25em] tw:text-[#1F1F1F]"
          >
            Roshni Creations
          </h1>

          <div className="tw:mx-auto tw:my-4 tw:h-px tw:w-[60px] tw:bg-[#D8D1C0]" />

          <p className="tw:m-0 tw:text-[12px] tw:uppercase tw:tracking-[0.2em] tw:text-[#6B665B]">
            Member Access
          </p>
        </div> */}

        {/* OTP */}

        {step === "otp" ? (
          <div className="tw:mt-8 tw:text-center">
            <h2
              style={{ fontFamily: SERIF }}
              className="tw:m-0 tw:text-[32px] tw:font-normal tw:text-[#1F1F1F]"
            >
              Verify Email
            </h2>

            <p className="tw:mt-2 tw:mb-1 tw:text-[14px] tw:text-[#6B665B]">
              We've sent a 6-digit OTP to
            </p>

            <p className="tw:mt-0 tw:mb-6 tw:text-[15px] tw:font-medium tw:text-[#1F1F1F] tw:break-all">
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
              className={`${inputClass} tw:!text-center tw:!text-[22px] tw:!tracking-[10px]`}
            />

            {error && (
              <p className="tw:mt-4 tw:mb-0 tw:text-sm tw:text-red-600">
                {error}
              </p>
            )}

            {success && (
              <p className="tw:mt-4 tw:mb-0 tw:text-sm tw:text-green-700">
                {success}
              </p>
            )}

            <Button
              label={loading ? "VERIFYING..." : "VERIFY EMAIL"}
              onClick={handleVerifyOTP}
              disabled={loading}
              className="
                tw:!w-full
                tw:!h-[60px]
                tw:!mt-6
                tw:!bg-[#263A2E]
                tw:!border-[#263A2E]
                tw:!rounded-[8px]
                tw:!text-white
                tw:!text-[14px]
                tw:!font-semibold
                tw:!tracking-[0.15em]
                tw:justify-center
              "
            />

            <Button
              label="RESEND OTP"
              onClick={handleResendOTP}
              disabled={loading}
              text
              className="tw:!mt-3 tw:!text-[#B08D2E] tw:!text-[13px] tw:!tracking-[0.1em]"
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
                tw:mt-1
                tw:border-0
                tw:bg-transparent
                tw:text-[#6B665B]
                tw:text-sm
                tw:underline
                tw:cursor-pointer
              "
            >
              Change details
            </button>
          </div>
        ) : (
          <>
            {/* TITLE */}

            <div className="tw:mt-6 tw:mb-7 tw:text-center">
              <h2
                style={{ fontFamily: SERIF }}
                className="tw:m-0 tw:text-[32px] tw:font-normal tw:text-[#1F1F1F]"
              >
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>

              <p className="tw:mt-1 tw:mb-0 tw:text-[15px] tw:text-[#6B665B]">
                {mode === "login"
                  ? "Your jewellery journey continues here."
                  : "Your front row seat to all things!"}
              </p>
            </div>

            {/* REGISTER NAME FIELDS */}

            {mode === "register" && (
              <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:mb-5">
                <div>
                  <label className={`${labelClass} tw:mb-2`}>First Name</label>
                  <InputText
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={`${labelClass} tw:mb-2`}>Last Name</label>
                  <InputText
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}

            <div className="tw:mb-5">
              <label className={`${labelClass} tw:mb-2`}>Email Address</label>
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@example.com"
                className={inputClass}
              />
            </div>

            {/* PHONE */}

            {mode === "register" && (
              <div className="tw:mb-5">
                <label className={`${labelClass} tw:mb-2`}>Phone Number</label>
                <div
                  className="
                    tw:w-full
                    tw:h-[56px]
                    tw:flex
                    tw:items-center
                    tw:bg-[#FAF7F0]
                    tw:border
                    tw:border-[#DDD6C6]
                    tw:rounded-[10px]
                    tw:overflow-hidden
                  "
                >
                  <div className="tw:pl-5 tw:pr-3 tw:text-[18px] tw:shrink-0">
                    🇮🇳
                  </div>

                  <InputText
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="10-digit mobile number"
                    className="
                      tw:w-full
                      tw:!h-full
                      tw:!bg-transparent
                      tw:!border-0
                      tw:!shadow-none
                      tw:!text-[16px]
                      tw:!px-2
                      tw:placeholder:!text-[#B9B2A2]
                    "
                  />
                </div>
              </div>
            )}

            {/* PASSWORD */}

            <div className="tw:mb-7">
              <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
                <label className={labelClass}>Password</label>

                {mode === "login" && (
                  <button
                    type="button"
                    className="tw:border-0 tw:bg-transparent tw:p-0 tw:text-[13px] tw:text-[#6B665B] tw:cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                feedback={mode === "register"}
                toggleMask
                className="tw:!flex tw:w-full"
                inputClassName={inputClass}
              />
            </div>

            {/* ERROR */}

            {error && (
              <p className="tw:mt-0 tw:mb-4 tw:text-sm tw:text-red-600">
                {error}
              </p>
            )}

            {/* SUCCESS */}

            {success && (
              <p className="tw:mt-0 tw:mb-4 tw:text-sm tw:text-green-700">
                {success}
              </p>
            )}

            {/* ACTION */}

            <Button
              label={
                loading
                  ? "PLEASE WAIT..."
                  : mode === "login"
                    ? "SIGN IN"
                    : "CONTINUE"
              }
              onClick={mode === "login" ? handleLogin : handleRegister}
              disabled={loading}
              className="
                tw:!w-full
                tw:!h-[60px]
                tw:!bg-[#263A2E]
                tw:!border-[#263A2E]
                tw:!rounded-[8px]
                tw:!text-white
                tw:!text-[14px]
                tw:!font-semibold
                tw:!tracking-[0.15em]
                tw:justify-center
              "
            />

            {/* SWITCH MODE */}

            <div className="tw:mt-7 tw:pt-5 tw:border-t tw:border-[#E4DECF] tw:text-center tw:text-[14px] tw:text-[#6B665B]">
              {mode === "login" ? "New to Roshni Creations?" : "Already a member?"}

              <button
                type="button"
                onClick={() =>
                  changeMode(mode === "login" ? "register" : "login")
                }
                className="
                  tw:ml-2
                  tw:border-0
                  tw:bg-transparent
                  tw:p-0
                  tw:text-[#B08D2E]
                  tw:font-medium
                  tw:cursor-pointer
                "
              >
                {mode === "login" ? "Create Account" : "Sign In"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginSignupOverlay;
