import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import connectDb from "./config/db.js";
import productRoutes from "./routes/ProductRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import addressRouter from "./routes/addressRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import adminFeedbackRoutes from "./routes/adminFeedbackRoutes.js";
configDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = process.env.FRONTEND_URLS.split(",");
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
connectDb();

app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/product", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/addresses", addressRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin/feedback", adminFeedbackRoutes);

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to Roshni Creations developed by Satyaansh Softech");
});
