import express from "express";

import {
  addCategory,
  getAllCategories,
  getAllCategoriesAdmin,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import upload from "../middleware/upload.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==================================================
// GET ALL ACTIVE CATEGORIES
// ==================================================

router.get("/getCategories", getAllCategories);

// ==================================================
// GET ALL CATEGORIES - ADMIN
// ==================================================

router.get("/admin", authMiddleware, adminMiddleware, getAllCategoriesAdmin);

// ==================================================
// ADD CATEGORY
// ==================================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload("category").single("heroImg"),
  addCategory,
);

// ==================================================
// GET CATEGORY BY ID
// IMPORTANT: KEEP THIS AFTER STATIC ROUTES
// ==================================================

router.get("/:id", getCategoryById);

// ==================================================
// UPDATE CATEGORY
// ==================================================

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload("category").single("heroImg"),
  updateCategory,
);

// ==================================================
// DELETE CATEGORY
// ==================================================

router.delete("/:id", deleteCategory);

export default router;
