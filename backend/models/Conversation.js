import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageText: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
    isArchived: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
