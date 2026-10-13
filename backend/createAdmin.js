import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.DB_URI);

  const hashedPassword = await bcrypt.hash("roshnicreations2604", 10);

  const admin = new userModel({
    name: "Admin",
    email: "roshnicreations2026@gmail.com",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
  });

  await admin.save();

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();
