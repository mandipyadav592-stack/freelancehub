import express from "express";
import { body } from "express-validator";
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// All message routes require authentication
router.use(protect);

// @GET /api/messages/conversations
router.get("/conversations", getConversations);

// @GET /api/messages/conversations/:userId (get or create)
router.get("/conversations/:userId", getOrCreateConversation);

// @GET /api/messages/:conversationId
router.get("/:conversationId", getMessages);

// @POST /api/messages/:conversationId
router.post(
  "/:conversationId",
  [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Message content is required")
      .isLength({ max: 5000 })
      .withMessage("Message cannot exceed 5000 characters"),
  ],
  validate,
  sendMessage
);

// @DELETE /api/messages/:messageId
router.delete("/:messageId", deleteMessage);

export default router;
