import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true },
    location: { type: String, trim: true, default: "" },
    code: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Coupon", couponSchema);
