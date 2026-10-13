import express from "express";

import {
  getCart,
  addToCart,
  updateCart,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.get("/", authMiddleware, getCart);

cartRouter.post("/", authMiddleware, addToCart);

cartRouter.put("/", authMiddleware, updateCart);

cartRouter.delete("/", authMiddleware, clearCart);

cartRouter.delete("/:productId", authMiddleware, removeCartItem);

export default cartRouter;