import Feedback from "../models/feedbackModel.js";

// ADMIN: get all feedback, newest first
export const getAllFeedback = async (req, res) => {
  try {
    const list = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load feedback." });
  }
};

// ADMIN: delete one feedback
export const deleteFeedback = async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Feedback not found." });
    }
    res.json({ success: true, message: "Feedback deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete feedback." });
  }
};