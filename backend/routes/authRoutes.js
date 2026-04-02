import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updatePassword,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// ─── Validation Rules ───────────────────────────────────────────────────────

const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  body("role")
    .optional()
    .isIn(["client", "freelancer"])
    .withMessage("Role must be either 'client' or 'freelancer'"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const passwordValidation = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and number"),
];

// ─── Routes ─────────────────────────────────────────────────────────────────

// @POST /api/auth/register
router.post("/register", registerValidation, validate, register);

// @POST /api/auth/login
router.post("/login", loginValidation, validate, login);

// @GET /api/auth/me
router.get("/me", protect, getMe);

// @POST /api/auth/logout
router.post("/logout", protect, logout);

// @POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email required")],
  validate,
  forgotPassword
);

// @PUT /api/auth/reset-password/:token
router.put("/reset-password/:token", passwordValidation, validate, resetPassword);

// @GET /api/auth/verify-email/:token
router.get("/verify-email/:token", verifyEmail);

// @PUT /api/auth/update-password
router.put(
  "/update-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    ...passwordValidation.map((v) =>
      v.path === "password"
        ? body("newPassword")
            .isLength({ min: 8 })
            .withMessage("New password must be at least 8 characters")
        : v
    ),
  ],
  validate,
  updatePassword
);

export default router;
