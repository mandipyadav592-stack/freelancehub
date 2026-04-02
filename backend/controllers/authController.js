import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// ─── Helper: Generate JWT ───────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ─── Helper: Send Token Response ───────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  const token = generateToken(user._id);

  // Remove sensitive fields
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      isEmailVerified: user.isEmailVerified,
      wallet: user.wallet,
    },
  });
};

// ─── @POST /api/auth/register ───────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "client",
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to FreelanceHub! Verify Your Email",
        html: `
          <h2>Welcome to FreelanceHub, ${user.name}! 🎉</h2>
          <p>Click the link below to verify your email address:</p>
          <a href="${verifyUrl}" style="background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">
            Verify Email
          </a>
          <p>This link expires in 24 hours.</p>
          <p>If you didn't create this account, ignore this email.</p>
        `,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
      // Don't fail registration if email fails
    }

    sendTokenResponse(user, 201, res, "Account created successfully! Please verify your email.");
  } catch (error) {
    next(error);
  }
};

// ─── @POST /api/auth/login ──────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Contact support.",
      });
    }

    sendTokenResponse(user, 200, res, "Login successful!");
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/auth/me ──────────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("savedFreelancers", "name title avatar rating hourlyRate")
      .populate("savedProjects", "title status budget");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @POST /api/auth/forgot-password ───────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email address.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "FreelanceHub - Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below:</p>
        <a href="${resetUrl}" style="background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Password reset email sent! Check your inbox.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── @PUT /api/auth/reset-password/:token ──────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired.",
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, "Password reset successful!");
  } catch (error) {
    next(error);
  }
};

// ─── @GET /api/auth/verify-email/:token ────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification link is invalid or has expired.",
      });
    }

    user.isEmailVerified = true;
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Email verified successfully! Your account is now active.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── @PUT /api/auth/update-password ────────────────────────────────────────
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password updated successfully!");
  } catch (error) {
    next(error);
  }
};

// ─── @POST /api/auth/logout ─────────────────────────────────────────────────
export const logout = async (req, res, next) => {
  try {
    // Mark user offline
    await User.findByIdAndUpdate(req.user._id, { isOnline: false });

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};
