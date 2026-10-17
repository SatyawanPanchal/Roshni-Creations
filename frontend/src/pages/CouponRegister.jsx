import { useState } from "react";
import { jsPDF } from "jspdf";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Gift, User, Phone, MapPin, Download, Copy, Check, Sparkles } from "lucide-react";
import api from "../services/api.js";

const GREEN = "#0C3F37";

const INPUT_CLASS =
  "tw:w-full tw:!py-3.5 tw:!pl-11 tw:!text-base tw:!rounded-xl tw:!border-gray-200 tw:!bg-gray-50";
const BUTTON_CLASS =
  "tw:w-full tw:!justify-center tw:!gap-2 tw:!py-3.5 tw:!rounded-xl tw:!border-[#0C3F37] tw:!bg-[#0C3F37] tw:!text-base tw:!font-semibold tw:!text-white tw:shadow-lg";

// input with an icon on the left
const Field = ({ icon: Icon, ...props }) => (
  <span className="tw:relative tw:block">
    <Icon
      size={18}
      className="tw:absolute tw:left-4 tw:top-1/2 tw:z-10 tw:-translate-y-1/2 tw:text-[#0C3F37]"
    />
    <InputText {...props} className={INPUT_CLASS} />
  </span>
);

const CouponRegister = () => {
  const [form, setForm] = useState({ name: "", mobile: "", location: "" });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "mobile" ? value.replace(/\D/g, "") : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/coupon/register", form);
      setCode(res.data.code);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const downloadPdf = () => {
    const doc = new jsPDF();

    // green header
    doc.setFillColor(12, 63, 55);
    doc.rect(0, 0, 210, 70, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Roshni Creations", 105, 35, { align: "center" });
    doc.setFontSize(13);
    doc.text("Exhibition Special Coupon", 105, 50, { align: "center" });

    // code box
    doc.setTextColor(12, 63, 55);
    doc.setFontSize(14);
    doc.text("YOUR COUPON CODE", 105, 105, { align: "center" });

    doc.setFillColor(239, 244, 243);
    doc.setDrawColor(12, 63, 55);
    doc.setLineWidth(0.8);
    doc.setLineDashPattern([3, 3], 0);
    doc.roundedRect(30, 115, 150, 45, 4, 4, "FD");
    doc.setLineDashPattern([], 0);

    doc.setFontSize(40);
    doc.text(code, 105, 145, { align: "center" });

    // offer line
    doc.setFontSize(18);
    doc.text("Get 10% OFF on your order", 105, 185, { align: "center" });

    doc.setTextColor(120, 120, 120);
    doc.setFontSize(11);
    doc.text("Valid for one use only. Enter this code at checkout.", 105, 200, {
      align: "center",
    });

    doc.save(`${code}.pdf`);
  };

  return (
    <div className="tw:min-h-screen tw:bg-[#faf7f1]">
      {/* ---------- BRAND HEADER ---------- */}
      <div
        className="tw:relative tw:overflow-hidden tw:px-5 tw:pb-24 tw:pt-10 tw:text-center tw:text-white"
        style={{ background: `linear-gradient(135deg, ${GREEN}, #17695c)` }}
      >
        {/* soft decorative circles */}
        <div className="tw:absolute tw:-left-10 tw:-top-10 tw:h-40 tw:w-40 tw:rounded-full tw:bg-white/10" />
        <div className="tw:absolute tw:-bottom-12 tw:-right-8 tw:h-44 tw:w-44 tw:rounded-full tw:bg-white/10" />

        <div className="tw:relative">
          <div className="tw:mx-auto tw:mb-3 tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/20">
            <Gift size={28} />
          </div>
          <h1 className="tw:text-2xl tw:font-bold tw:sm:text-3xl">
            Roshni Creations
          </h1>
          <p className="tw:mt-1 tw:text-sm tw:text-white/80">
            {code ? "Here is your special gift" : "Register & get 10% off"}
          </p>
        </div>
      </div>

      {/* ---------- CARD (overlaps header) ---------- */}
      <div className="tw:mx-auto tw:-mt-16 tw:w-full tw:max-w-md tw:px-4 tw:pb-10">
        {code ? (
          /* SCREEN 2: ticket style coupon */
          <div className="tw:relative tw:rounded-2xl tw:bg-white tw:p-6 tw:text-center tw:shadow-xl">
            <div className="tw:mx-auto tw:mb-2 tw:flex tw:items-center tw:justify-center tw:gap-1 tw:text-sm tw:font-medium tw:text-[#0C3F37]">
              <Sparkles size={16} /> Congratulations!
            </div>
            <p className="tw:text-sm tw:text-gray-500">Your coupon code</p>

            <div className="tw:my-4 tw:break-all tw:rounded-xl tw:border-2 tw:border-dashed tw:border-[#0C3F37] tw:bg-[#EFF4F3] tw:px-3 tw:py-5 tw:text-3xl tw:font-extrabold tw:tracking-widest tw:text-[#0C3F37] tw:sm:text-4xl">
              {code}
            </div>

            <button
              type="button"
              onClick={copyCode}
              className="tw:mx-auto tw:mb-4 tw:flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-medium tw:text-[#0C3F37]"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Tap to copy"}
            </button>

            {/* ticket notches + divider */}
            <div className="tw:relative tw:my-5">
              <div className="tw:absolute tw:-left-9 tw:top-1/2 tw:h-6 tw:w-6 tw:-translate-y-1/2 tw:rounded-full tw:bg-[#faf7f1]" />
              <div className="tw:absolute tw:-right-9 tw:top-1/2 tw:h-6 tw:w-6 tw:-translate-y-1/2 tw:rounded-full tw:bg-[#faf7f1]" />
              <div className="tw:border-t-2 tw:border-dashed tw:border-gray-200" />
            </div>

            <p className="tw:mb-1 tw:text-lg tw:font-semibold tw:text-[#37252C]">
              With this code you will get 10% off
            </p>
            <p className="tw:mb-6 tw:text-xs tw:text-gray-500">
              One time use only. Apply it at checkout.
            </p>

            <Button
              label="Download Coupon"
              icon={<Download size={18} />}
              onClick={downloadPdf}
              className={BUTTON_CLASS}
            />
          </div>
        ) : (
          /* SCREEN 1: form */
          <form
            onSubmit={handleSubmit}
            className="tw:flex tw:flex-col tw:gap-4 tw:rounded-2xl tw:bg-white tw:p-6 tw:shadow-xl"
          >
            {/* <div>
              <h2 className="tw:text-xl tw:font-bold tw:text-[#37252C]">
                Get your coupon
              </h2>
              <p className="tw:mt-1 tw:text-sm tw:text-gray-500">
                Fill in your details to unlock 10% off.
              </p>
            </div> */}

            <Field
              icon={User}
              name="name"
              placeholder="Your name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
            />

            <Field
              icon={Phone}
              name="mobile"
              placeholder="Mobile number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={form.mobile}
              onChange={handleChange}
            />

            <Field
              icon={MapPin}
              name="location"
              placeholder="Location (optional)"
              autoComplete="address-level2"
              value={form.location}
              onChange={handleChange}
            />

            {error && (
              <div className="tw:rounded-lg tw:border tw:border-red-200 tw:bg-red-50 tw:px-3 tw:py-2 tw:text-sm tw:text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              label="Get my coupon"
              icon={<Gift size={18} />}
              loading={loading}
              disabled={loading}
              className={BUTTON_CLASS}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default CouponRegister;
