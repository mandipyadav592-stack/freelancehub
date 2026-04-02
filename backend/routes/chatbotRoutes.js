import express from "express";
import { body } from "express-validator";
import { chatbotMessage, getChatbotSuggestions } from "../controllers/chatbotController.js";
import { optionalAuth } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// @GET /api/chatbot/suggestions
router.get("/suggestions", optionalAuth, getChatbotSuggestions);

// @POST /api/chatbot/message
router.post(
  "/message",
  optionalAuth,
  [
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ max: 500 })
      .withMessage("Message cannot exceed 500 characters"),
  ],
  validate,
  chatbotMessage
);

export default router;
