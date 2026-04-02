import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: [
        "new_proposal",
        "proposal_accepted",
        "proposal_rejected",
        "new_message",
        "milestone_submitted",
        "milestone_approved",
        "payment_received",
        "payment_released",
        "review_received",
        "project_completed",
        "project_cancelled",
        "dispute_opened",
        "dispute_resolved",
        "account_verified",
        "badge_earned",
        "system",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },

    // ─── Related Documents ──────────────────────────────────────────────────
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
    relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    relatedPayment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: null },

    // ─── Meta ───────────────────────────────────────────────────────────────
    icon: { type: String, default: "bell" },
    color: { type: String, default: "blue" },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
