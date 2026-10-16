/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { useAuth } from "../../../context/AuthContext.jsx";
import { showSuccess } from "../../utils/toast.js";
import logo from "../../../assets/logo.webp"

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      console.log("user==", user.user.role);
      if (user.user.role !== "admin") {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }
      showSuccess("Signed in successfully");
      navigate( "/admin/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-[#FAF7F1] tw:p-5">
      <div className="rc-card tw:w-full tw:max-w-sm tw:p-9">
        <div className="tw:w-14 tw:h-14 tw:rounded-full tw:border tw:border-[#AD8A3F] tw:text-[#AD8A3F] tw:flex tw:items-center tw:justify-center font-display tw:text-2xl tw:mx-auto tw:mb-4">
          <img src={logo} alt="" />
        </div>
        <h1 className="font-display tw:text-xl tw:text-center tw:mb-1">
          Welcome back
        </h1>
        <div className="tw:text-center tw:text-[12.5px] tw:text-[#9AA39B] tw:mb-6">
          Sign in to manage Roshni Creations
        </div>

        {error && (
          <div className="tw:flex tw:items-center tw:gap-2 tw:bg-[#F3E7E1] tw:text-[#9C4E3A] tw:text-[12px] tw:px-3 tw:py-2.5 tw:rounded-lg tw:mb-4">
            <i className="pi pi-exclamation-triangle tw:text-xs" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="tw:mb-4">
            <label className="tw:block tw:text-[12px] tw:text-[#5E6D67] tw:mb-1.5">
              Email address <span className="tw:text-[#9C4E3A]">*</span>
            </label>
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@roshnicreations.in"
              className="tw:w-full"
            />
          </div>

          <div className="tw:mb-4">
            <label className="tw:block tw:text-[12px] tw:text-[#5E6D67] tw:mb-1.5">
              Password <span className="tw:text-[#9C4E3A]">*</span>
            </label>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              toggleMask
              feedback={false}
              className="tw:w-full"
              inputClassName="tw:w-full"
            />
          </div>

          <div className="tw:flex tw:items-center tw:justify-between tw:mb-5">
            {/* <label className="tw:flex tw:items-center tw:gap-2 tw:text-[12.5px] tw:text-[#5E6D67] tw:cursor-pointer"> */}
              {/* <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.checked)}
              />
              Remember me
            </label> */}
            {/* <span className="tw:text-[12px] tw:text-[#1F4E47] tw:cursor-pointer">
              Forgot password?
            </span> */}
          </div>

          <Button
            type="submit"
            label={loading ? "Signing in…" : "Sign in"}
            icon={loading ? "pi pi-spin pi-spinner" : undefined}
            loading={loading}
            className="tw:w-full tw:justify-center"
            style={{
              background: "#1F4E47",
              borderColor: "#1F4E47",
            }}
          />
        </form>

        <div className="tw:text-center tw:text-[11px] tw:text-[#9AA39B] tw:mt-6">
          Roshni Creations · Internal use only
        </div>
      </div>
    </div>
  );
}
