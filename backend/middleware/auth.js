import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── Protect Route: Verify JWT ─────────────────────────────────────────────
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is valid but user no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: `Your account has been banned. Reason: ${user.banReason}`,
      });
    }

    // Update last seen
    user.lastSeen = new Date();
    user.isOnline = true;
    await user.save({ validateBeforeSave: false });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired." });
    }
    res.status(500).json({ success: false, message: "Server error during authentication." });
  }
};

// ─── Role Authorization ─────────────────────────────────────────────────────
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

// ─── Optional Auth (doesn't fail if no token) ──────────────────────────────
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
    next();
  } catch {
    next(); // Continue without user
  }
};
