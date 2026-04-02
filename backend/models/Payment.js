import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    milestone: { type: mongoose.Schema.Types.ObjectId, default: null },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ─── Amounts ────────────────────────────────────────────────────────────
    amount: { type: Number, required: true, min: 1 },
    platformFee: { type: Number, required: true }, // 8% flat
    freelancerAmount: { type: Number, required: true }, // amount - platformFee
    currency: { type: String, default: "USD" },

    // ─── Stripe Details ─────────────────────────────────────────────────────
    stripePaymentIntentId: { type: String, unique: true, sparse: true },
    stripeTransferId: { type: String, default: "" },
    stripeChargeId: { type: String, default: "" },

    // ─── Status ─────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "in-escrow", "released", "refunded", "failed", "disputed"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["milestone", "full", "refund", "bonus"],
      default: "milestone",
    },

    // ─── Escrow ─────────────────────────────────────────────────────────────
    escrowHeldAt: { type: Date },
    escrowReleasedAt: { type: Date },
    autoReleaseAt: { type: Date }, // Auto release after 14 days

    // ─── Dispute ────────────────────────────────────────────────────────────
    dispute: {
      isDisputed: { type: Boolean, default: false },
      reason: { type: String, default: "" },
      resolution: { type: String, default: "" },
      resolvedAt: { type: Date },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    // ─── Receipt ────────────────────────────────────────────────────────────
    receiptUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

paymentSchema.index({ project: 1 });
paymentSchema.index({ payer: 1 });
paymentSchema.index({ payee: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
