import express from "express";
import { body } from "express-validator";
import {
  getFreelancers,
  getFreelancerById,
  updateProfile,
  getDashboardStats,
  saveFreelancer,
  searchFreelancers,
  deleteAccount,
} from "../controllers/userController.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// ─── Public Routes ──────────────────────────────────────────────────────────

// @GET /api/users/freelancers?page=1&limit=12&category=&skills=&sort=-rating
router.get("/freelancers", optionalAuth, getFreelancers);

// @GET /api/users/freelancers/:id
router.get("/freelancers/:id", optionalAuth, getFreelancerById);

// @GET /api/users/search?q=react+developer&category=&budget=
router.get("/search", searchFreelancers);

// ─── Protected Routes ───────────────────────────────────────────────────────

// @GET /api/users/dashboard
router.get("/dashboard", protect, getDashboardStats);

// @PUT /api/users/profile
router.put(
  "/profile",
  protect,
  [
    body("name").optional().isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 chars"),
    body("hourlyRate").optional().isNumeric().withMessage("Hourly rate must be a number"),
    body("bio").optional().isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),
  ],
  validate,
  updateProfile
);

// @POST /api/users/save-freelancer/:id
router.post("/save-freelancer/:id", protect, saveFreelancer);

// @DELETE /api/users/profile
router.delete("/profile", protect, deleteAccount);

export default router;
