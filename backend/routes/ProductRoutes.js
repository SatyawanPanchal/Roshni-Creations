import express from "express";

import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsByCollection,
  getSingleProduct,
  searchProduct,
  toggleProductStatus,
  updateProduct,
  updateStock,
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";
import verifyToken from "../middleware/verifyToken.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const productRoutes = express.Router();

// ============================================================
// PUBLIC ROUTES
// ============================================================

// Get all products
productRoutes.get("/getProducts", getAllProducts);

// Get single product
productRoutes.get("/getProduct/:id", getSingleProduct);

// Get products by category
productRoutes.get("/getProductByCategory/:category", getProductsByCategory);

// Get products by collection
productRoutes.get(
  "/getProductByCollection/:collection",
  getProductsByCollection,
);

// Search products
productRoutes.get("/search", searchProduct);

// ============================================================
// ADMIN ROUTES
// ============================================================

// Add product
productRoutes.post(
  "/addProduct",
  authMiddleware,
  adminMiddleware,
  upload("products").fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  addProduct,
);

// Update product
productRoutes.put(
  "/updateProduct/:id",
  authMiddleware,
  adminMiddleware,
  upload("products").fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProduct,
);

// Update stock
productRoutes.patch(
  "/updateStock/:id",
  authMiddleware,
  adminMiddleware,
  updateStock,
);

// Toggle status
productRoutes.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  toggleProductStatus,
);

// Delete product
productRoutes.delete(
  "/deleteProduct/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct,
);

export default productRoutes;
