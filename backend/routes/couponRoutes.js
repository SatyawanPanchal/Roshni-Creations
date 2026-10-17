import express from "express";
import { registerForCoupon } from "../controllers/couponController.js";

const couponRoutes = express.Router();
couponRoutes.post("/register", registerForCoupon);

export default couponRoutes;
