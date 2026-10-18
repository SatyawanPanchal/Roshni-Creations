import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    event: { type: String, default: "general", trim: true, maxlength: 80 }, // from QR link ?event=delhi-oct-2026
    rating: { type: Number, min: 1, max: 5, required: true },
    liked: [{ type: String, maxlength: 40 }], // what they liked most (max 2)
    purchased: { type: String, enum: ["yes", "no", "thinking"], required: true },
    reasons: [{ type: String, maxlength: 40 }], // why they did not buy
    suggestion: { type: String, trim: true, maxlength: 500 },
    name: { type: String, trim: true, maxlength: 80 },
    contact: { type: String, trim: true, maxlength: 80 }, // WhatsApp or Instagram
    optIn: { type: Boolean, default: false }, // ok to send updates
  },
  { timestamps: true },
);

export default mongoose.model("Feedback", feedbackSchema);