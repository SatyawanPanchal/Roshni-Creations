import express from "express";

import {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const addressRouter = express.Router();

// All address routes require authentication
addressRouter.use(authMiddleware);

// Get all addresses
addressRouter.get("/", getAddresses);

// Get single address
addressRouter.get("/:addressId", getAddress);

// Add new address
addressRouter.post("/", addAddress);

// Update address
addressRouter.put("/:addressId", updateAddress);

// Delete address
addressRouter.delete("/:addressId", deleteAddress);

// Set default address
addressRouter.patch("/:addressId/default", setDefaultAddress);

export default addressRouter;