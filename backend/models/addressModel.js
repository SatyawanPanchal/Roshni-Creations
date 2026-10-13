import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    // --------------------------------------------------
    // User who owns this address
    // --------------------------------------------------
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    // --------------------------------------------------
    // Recipient Information
    // --------------------------------------------------
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^[6-9]\d{9}$/,
    },

    // --------------------------------------------------
    // Address Information
    // --------------------------------------------------
    country: {
      type: String,
      required: true,
      trim: true,
      default: "India",
    },

    flat: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    street: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
      match: /^[1-9][0-9]{5}$/,
    },

    landmark: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    // --------------------------------------------------
    // Address Type
    // --------------------------------------------------
    addressType: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },

    // --------------------------------------------------
    // Default Address
    // --------------------------------------------------
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// --------------------------------------------------
// Indexes
// --------------------------------------------------

addressSchema.index({
  userId: 1,
  isDefault: -1,
});

const addressModel =
  mongoose.models.address ||
  mongoose.model("address", addressSchema);

export default addressModel;