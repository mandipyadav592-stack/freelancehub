import express from "express";
import { body } from "express-validator";
import {
  createPaymentIntent,
  stripeWebhook,
  releasePayment,
  getPaymentHistory,
  openDispute,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// @POST /api/payments/webhook (Stripe webhook - raw body)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// All other payment routes require authentication
router.use(protect);

// @POST /api/payments/create-intent
router.post(
  "/create-intent",
  authorize("client"),
  [
    body("projectId").notEmpty().withMessage("Project ID is required"),
    body("amount")
      .isNumeric()
      .withMessage("Amount must be a number")
      .custom((val) => {
        if (Number(val) < 5) throw new Error("Minimum payment amount is $5");
        return true;
      }),
  ],
  validate,
  createPaymentIntent
);

// @GET /api/payments/history
router.get("/history", getPaymentHistory);

// @POST /api/payments/:paymentId/release
router.post("/:paymentId/release", authorize("client"), releasePayment);

// @POST /api/payments/:paymentId/dispute
router.post(
  "/:paymentId/dispute",
  [body("reason").trim().isLength({ min: 10 }).withMessage("Please provide a reason (min 10 chars)")],
  validate,
  openDispute
);

export default router;
