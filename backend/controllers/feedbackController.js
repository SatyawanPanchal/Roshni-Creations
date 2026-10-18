import Feedback from "../models/feedbackModel.js";

// PUBLIC: customer submits feedback
export const submitFeedback = async (req, res) => {
  try {
    const {
      event,
      rating,
      liked,
      purchased,
      reasons,
      suggestion,
      name,
      contact,
      optIn,
    } = req.body;

    const ratingNum = Number(rating);
    if (
      !ratingNum ||
      ratingNum < 1 ||
      ratingNum > 5 ||
      !["yes", "no", "thinking"].includes(purchased)
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating and purchase answer are required.",
      });
    }

    await Feedback.create({
      event: event || "general",
      rating: ratingNum,
      liked: Array.isArray(liked) ? liked.slice(0, 2) : [],
      purchased,
      reasons:
        purchased === "yes" || !Array.isArray(reasons)
          ? []
          : reasons.slice(0, 5),
      suggestion,
      name,
      contact,
      optIn: !!optIn,
    });

    res
      .status(201)
      .json({ success: true, message: "Thank you for your feedback!" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Could not save feedback." });
  }
};
