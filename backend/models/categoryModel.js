import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    heroImg: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    menuGroup: {
      type: Number,
      default: 1,
    },

    menuOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);

export default Category;