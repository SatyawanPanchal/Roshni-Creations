import crypto from "crypto";
import Coupon from "../models/couponModel.js";
import Counter from "../models/counterModel.js";

// no 0, O, 1, I so staff don't confuse them
const CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const generateCode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: "coupon" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return `KREX${String(counter.seq).padStart(4, "0")}`;
};

export const registerForCoupon = async (req, res) => {
  try {
    const { name, mobile, location } = req.body;
    const cleanMobile = (mobile || "").replace(/\s+/g, "");

    if (!name?.trim() || !/^\d{10}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid name and 10 digit mobile number",
      });
    }

    // same mobile -> same coupon
    let coupon = await Coupon.findOne({ mobile: cleanMobile });

    if (!coupon) {
      coupon = await Coupon.create({
        name: name.trim(),
        mobile: cleanMobile,
        location: location?.trim() || "",
        code: await generateCode(),
      });
    }

    res.json({ success: true, code: coupon.code, used: coupon.used });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
