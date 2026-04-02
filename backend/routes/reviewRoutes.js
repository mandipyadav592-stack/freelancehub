import express from "express";
import { body } from "express-validator";
import {
  createReview,
  getUserReviews,
  respondToReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// @GET /api/reviews/:userId (public)
router.get("/:userId", getUserReviews);

// @POST /api/reviews (protected)
router.post(
  "/",
  protect,
  [
    body("projectId").notEmpty().withMessage("Project ID is required"),
    body("revieweeId").notEmpty().withMessage("Reviewee ID is required"),
    body("overallRating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .trim()
      .isLength({ min: 20, max: 1000 })
      .withMessage("Review must be 20-1000 characters"),
  ],
  validate,
  createReview
);

// @PUT /api/reviews/:id/response (protected)
router.put(
  "/:id/response",
  protect,
  [
    body("response")
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage("Response must be 10-500 characters"),
  ],
  validate,
  respondToReview
);

export default router;
