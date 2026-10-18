import { Router } from "express";
import { getAllFeedback,deleteFeedback } from "../controllers/adminFeedbackController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const adminFeedbackRoutes = Router();

adminFeedbackRoutes.use(authMiddleware, adminMiddleware);

adminFeedbackRoutes.get("/", getAllFeedback);
adminFeedbackRoutes.delete("/:id", deleteFeedback);

export default adminFeedbackRoutes;