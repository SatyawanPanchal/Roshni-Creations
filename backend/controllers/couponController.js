import crypto from "crypto";
import Coupon from "../models/couponModel.js";

// no 0, O, 1, I so staff don't confuse them
const CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const generateCode = async () => {
  let code;
  do {
    let random = "";
    for (let i = 0; i < 4; i++) random += CHARS[crypto.randomInt(CHARS.length)];
    code = `KREX${random}`;
  } while (await Coupon.exists({ code }));
  return code;
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