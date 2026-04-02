import Stripe from "stripe";
import Payment from "../models/Payment.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PLATFORM_FEE_PERCENT = 8; // 8% flat fee (vs Upwork's 5-20%)

// ─── @POST /api/payments/create-intent ──────────────────────────────────────
// Create Stripe Payment Intent (client pays into escrow)
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { projectId, milestoneId, amount } = req.body;

    const project = await Project.findById(projectId).populate("assignedFreelancer");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the client can make payments for this project.",
      });
    }

    const amountInCents = Math.round(amount * 100);
    const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENT / 100));
    const freelancerAmount = amount - platformFee;

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        projectId: projectId.toString(),
        milestoneId: milestoneId?.toString() || "",
        clientId: req.user._id.toString(),
        freelancerId: project.assignedFreelancer._id.toString(),
      },
      description: `FreelanceHub Escrow - ${project.title}`,
    });

    // Create payment record
    const payment = await Payment.create({
      project: projectId,
      milestone: milestoneId || null,
      payer: req.user._id,
      payee: project.assignedFreelancer._id,
      amount,
      platformFee,
      freelancerAmount,
      stripePaymentIntentId: paymentIntent.id,
      status: "pending",
      autoReleaseAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days auto-release
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      breakdown: {
        total: amount,
        platformFee: `${PLATFORM_FEE_PERCENT}% = $${platformFee.toFixed(2)}`,
        freelancerReceives: `$${freelancerAmount.toFixed(2)}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @POST /api/payments/webhook ─────────────────────────────────────────────
// Stripe webhook - confirms payment success
export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (payment) {
      payment.status = "in-escrow";
      payment.escrowHeldAt = new Date();
      await payment.save();

      // Update project escrow amount
      await Project.findByIdAndUpdate(payment.project, {
        $inc: { escrowAmount: payment.amount },
        paymentStatus: "in-escrow",
      });

      // Notify freelancer
      await Notification.create({
        recipient: payment.payee,
        type: "payment_received",
        title: "💰 Payment Held in Escrow",
        message: `$${payment.freelancerAmount} has been secured in escrow for your work.`,
        relatedPayment: payment._id,
        icon: "dollar",
        color: "green",
      });
    }
  }

  res.json({ received: true });
};

// ─── @POST /api/payments/:paymentId/release ──────────────────────────────────
// Client releases escrow to freelancer
export const releasePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }

    if (payment.payer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the client can release payment.",
      });
    }

    if (payment.status !== "in-escrow") {
      return res.status(400).json({
        success: false,
        message: `Payment cannot be released. Current status: ${payment.status}`,
      });
    }

    // Transfer to freelancer via Stripe (requires connected account in production)
    // For demo, we'll simulate the transfer
    const freelancer = await User.findById(payment.payee);

    // Update payment
    payment.status = "released";
    payment.escrowReleasedAt = new Date();
    await payment.save();

    // Update freelancer wallet
    await User.findByIdAndUpdate(payment.payee, {
      $inc: {
        "wallet.balance": payment.freelancerAmount,
        totalEarned: payment.freelancerAmount,
        completedJobs: 1,
      },
    });

    // Update project
    await Project.findByIdAndUpdate(payment.project, {
      $inc: {
        totalPaid: payment.amount,
        escrowAmount: -payment.amount,
      },
      paymentStatus: "fully-paid",
    });

    // Notify freelancer
    await Notification.create({
      recipient: payment.payee,
      type: "payment_released",
      title: "🎉 Payment Released!",
      message: `$${payment.freelancerAmount} has been added to your wallet!`,
      relatedPayment: payment._id,
      icon: "wallet",
      color: "green",
    });

    res.status(200).json({
      success: true,
      message: `Payment of $${payment.freelancerAmount} released to ${freelancer.name}!`,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/payments/history ──────────────────────────────────────────────
export const getPaymentHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query =
      req.user.role === "client"
        ? { payer: req.user._id }
        : { payee: req.user._id };

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate("project", "title status")
        .populate("payer", "name avatar")
        .populate("payee", "name avatar")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      Payment.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @POST /api/payments/:paymentId/dispute ──────────────────────────────────
export const openDispute = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }

    const isInvolved =
      payment.payer.toString() === req.user._id.toString() ||
      payment.payee.toString() === req.user._id.toString();

    if (!isInvolved) {
      return res.status(403).json({
        success: false,
        message: "You are not involved in this payment.",
      });
    }

    payment.dispute = {
      isDisputed: true,
      reason: req.body.reason,
    };
    payment.status = "disputed";
    await payment.save();

    // Notify admin and other party
    const otherParty =
      payment.payer.toString() === req.user._id.toString()
        ? payment.payee
        : payment.payer;

    await Notification.create({
      recipient: otherParty,
      sender: req.user._id,
      type: "dispute_opened",
      title: "⚠️ Payment Dispute Opened",
      message: `A dispute has been opened on payment #${payment._id}. Reason: ${req.body.reason}`,
      relatedPayment: payment._id,
      icon: "alert",
      color: "red",
    });

    res.status(200).json({
      success: true,
      message: "Dispute opened. Our team will review within 24-48 hours.",
      payment,
    });
  } catch (error) {
    next(error);
  }
};
