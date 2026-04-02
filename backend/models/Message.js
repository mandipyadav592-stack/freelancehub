import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    messageType: {
      type: String,
      enum: ["text", "file", "image", "milestone", "offer", "system"],
      default: "text",
    },
    attachments: [
      {
        url: String,
        name: String,
        size: Number,
        type: String,
      },
    ],
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // ─── For offer/milestone messages ───────────────────────────────────────
    offerDetails: {
      amount: Number,
      deliveryTime: String,
      description: String,
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ sender: 1, receiver: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
