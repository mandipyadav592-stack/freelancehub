import express from "express";
import { body } from "express-validator";
import {
  getProjects,
  createProject,
  getProjectById,
  submitProposal,
  acceptProposal,
  updateProject,
  deleteProject,
  getMyProjects,
} from "../controllers/projectController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// ─── Validation Rules ───────────────────────────────────────────────────────

const createProjectValidation = [
  body("title")
    .trim()
    .isLength({ min: 10, max: 120 })
    .withMessage("Title must be 10-120 characters"),
  body("description")
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage("Description must be 50-5000 characters"),
  body("category").notEmpty().withMessage("Category is required"),
  body("budget.min")
    .isNumeric()
    .withMessage("Minimum budget must be a number")
    .custom((val, { req }) => {
      if (Number(val) > Number(req.body.budget?.max)) {
        throw new Error("Minimum budget cannot exceed maximum budget");
      }
      return true;
    }),
  body("budget.max").isNumeric().withMessage("Maximum budget must be a number"),
  body("duration").notEmpty().withMessage("Duration is required"),
];

const proposalValidation = [
  body("coverLetter")
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage("Cover letter must be 50-2000 characters"),
  body("bidAmount").isNumeric().withMessage("Bid amount must be a number"),
  body("deliveryTime").notEmpty().withMessage("Delivery time is required"),
];

// ─── Public Routes ──────────────────────────────────────────────────────────

// @GET /api/projects
router.get("/", optionalAuth, getProjects);

// @GET /api/projects/:id
router.get("/:id", optionalAuth, getProjectById);

// ─── Protected Routes ───────────────────────────────────────────────────────

// @GET /api/projects/my-projects
router.get("/user/my-projects", protect, getMyProjects);

// @POST /api/projects (clients only)
router.post(
  "/",
  protect,
  authorize("client", "admin"),
  createProjectValidation,
  validate,
  createProject
);

// @PUT /api/projects/:id
router.put("/:id", protect, updateProject);

// @DELETE /api/projects/:id
router.delete("/:id", protect, deleteProject);

// @POST /api/projects/:id/proposals (freelancers only)
router.post(
  "/:id/proposals",
  protect,
  authorize("freelancer"),
  proposalValidation,
  validate,
  submitProposal
);

// @PUT /api/projects/:id/proposals/:proposalId/accept (clients only)
router.put(
  "/:id/proposals/:proposalId/accept",
  protect,
  authorize("client"),
  acceptProposal
);

export default router;
