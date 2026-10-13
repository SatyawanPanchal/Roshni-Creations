import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // ============================================================
    // BASIC PRODUCT INFORMATION
    // ============================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    productCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // ============================================================
    // PRICE
    // ============================================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      min: 0,
    },

    // ============================================================
    // CATEGORY
    // Existing category document
    // ============================================================

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // ============================================================
    // SUBCATEGORY
    // ============================================================

    subcategory: {
      type: String,
      trim: true,
    },

    // ============================================================
    // COLLECTIONS
    // Existing collection documents
    // Multiple collections allowed
    // ============================================================

    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "collection",
        required: true,
      },
    ],

    // ============================================================
    // PRODUCT DETAILS
    // ============================================================

    material: {
      type: String,
      trim: true,
    },

    availability: {
      type: String,
      enum: ["in-stock", "made-to-order", "out-of-stock"],
      default: "in-stock",
    },

    badge: {
      type: String,
      enum: ["NEW", "TRENDING", "BESTSELLER", "HERITAGE", "SALE", "NONE", null],
      default: null,
    },

    stockLeft: {
      type: Number,
      default: 0,
      min: 0,
    },

    craftLabel: {
      type: String,
      trim: true,
    },

    details: {
      type: String,
      trim: true,
    },

    care: {
      type: String,
      trim: true,
    },

    shipping: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ============================================================
    // PRODUCT IMAGES
    // ============================================================

    image: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
