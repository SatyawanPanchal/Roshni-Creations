import express from "express";

import {
  addCollection,
  deleteCollection,
  getActiveCollections,
  getAllCollections,
  getSingleCollection,
  updateCollection,
} from "../controllers/collectionController.js";

import upload from "../middleware/upload.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const collectionRoutes = express.Router();

// ============================================================
// PUBLIC ROUTES
// ============================================================

collectionRoutes.get(
  "/getCollections",
  getAllCollections
);

collectionRoutes.get(
  "/getActiveCollections",
  getActiveCollections
);

collectionRoutes.get(
  "/getCollection/:id",
  getSingleCollection
);

// ============================================================
// ADMIN ROUTES
// ============================================================

collectionRoutes.post(
  "/addCollection",
  authMiddleware,
  adminMiddleware,
  upload("collections").single("image"),
  addCollection
);

collectionRoutes.put(
  "/updateCollection/:id",
  authMiddleware,
  adminMiddleware,
  upload("collections").single("image"),
  updateCollection
);

collectionRoutes.delete(
  "/deleteCollection/:id",
  authMiddleware,
  adminMiddleware,
  deleteCollection
);

export default collectionRoutes;