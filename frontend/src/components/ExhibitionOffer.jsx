import { useState } from "react";
import { useLocation } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import api from "../services/api.js";

const ExhibitionOffer = () => {
  const { pathname } = useLocation();

  const [applied, setApplied] = useState(
    () => localStorage.getItem("exhibition_coupon") || "",
  );

  // open automatically on first visit of the session (unless already applied)
  const [open, setOpen] = useState(
    () =>
      !sessionStorage.getItem("exhibition_seen") &&
      !localStorage.getItem("exhibition_coupon"),
  );

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const closePopup = () => {
    sessionStorage.setItem("exhibition_seen", "1");
    setOpen(false);
  };

  const handleApply = async () => {
    try {
      const res = await api.post("/order/apply-coupon", { couponCode: code });
      if (res.data.success) {
        const clean = code.trim().toUpperCase();
        localStorage.setItem("exhibition_coupon", clean);
        setApplied(clean);
        setMessage("");
      } else {
        setMessage("Invalid code");
      }
    } catch {
      setMessage("Could not apply code");
    }
  };

  // hide on checkout (it already has a coupon box)
  if (pathname === "/checkout") return null;

  return (
    <>
      {/* ================= POPUP ================= */}
      {open && (
        <div
          onClick={closePopup}
          className="tw:fixed tw:inset-0 tw:z-[60] tw:flex tw:items-center tw:justify-center tw:bg-black/60 tw:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="tw:relative tw:w-full tw:max-w-sm tw:border-2 tw:border-[#E8C98A] tw:bg-[#0C3F37] tw:p-6 tw:text-center tw:text-white tw:shadow-2xl"
          >
            <button
              onClick={closePopup}
              className="tw:absolute tw:right-3 tw:top-2 tw:text-xl tw:text-[#E8C98A] cursor-pointer"
            >
              ✕
            </button>

            <p className="tw:text-sm tw:tracking-widest tw:text-[#E8C98A]">
              🎁 EXHIBITION OFFER
            </p>

            <p className="tw:mt-2 tw:text-5xl tw:font-bold tw:text-[#E8C98A]">
              10% OFF
            </p>

            <p className="tw:mt-2 tw:text-sm">
              Visited our exhibition? Enter the code shown at our stall.
            </p>

            {applied ? (
              <p className="tw:mt-5 tw:font-semibold tw:text-[#E8C98A]">
                ✓ Code applied! 10% off will be added at checkout.
              </p>
            ) : (
              <>
                <InputText
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your code"
                  className="tw:mt-5 tw:w-full tw:text-center"
                />
                <Button
                  label="APPLY CODE"
                  onClick={handleApply}
                  className="tw:mt-3 tw:w-full tw:!border-none tw:!bg-[#E8C98A] tw:!font-semibold tw:!text-[#0C3F37]"
                />
                {message && (
                  <p className="tw:mt-2 tw:text-sm tw:text-red-300">
                    {message}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= FLOATING BADGE ================= */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="tw:fixed tw:bottom-5 tw:left-4 tw:z-50 tw:cursor-pointer"
        >
          {/* pulsing ring */}
          <span className="tw:absolute tw:inset-0 tw:animate-ping tw:rounded-full tw:bg-[#E8C98A] tw:opacity-70" />

          {/* badge */}
          <span className="tw:relative tw:flex tw:items-center tw:gap-2 tw:rounded-full tw:border-2 tw:border-white tw:bg-gradient-to-r tw:from-[#E8C98A] tw:to-[#A67C3D] tw:px-5 tw:py-3 tw:text-sm tw:font-bold tw:text-[#0C3F37] tw:shadow-xl">
            {applied ? "✓ Offer Applied" : "🎁 10% OFF · Exhibition Offer"}
          </span>
        </button>
      )}
    </>
  );
};

export default ExhibitionOffer;