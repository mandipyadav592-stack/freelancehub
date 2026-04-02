// ─── Global Error Handler Middleware ───────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err.stack);
  }

  // ─── Mongoose Bad ObjectId ─────────────────────────────────────────────
  if (err.name === "CastError") {
    error = {
      statusCode: 404,
      message: `Resource not found with id: ${err.value}`,
    };
  }

  // ─── Mongoose Duplicate Key ────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      statusCode: 400,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
    };
  }

  // ─── Mongoose Validation Error ─────────────────────────────────────────
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = {
      statusCode: 400,
      message: messages.join(". "),
    };
  }

  // ─── JWT Errors ────────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    error = { statusCode: 401, message: "Invalid token." };
  }
  if (err.name === "TokenExpiredError") {
    error = { statusCode: 401, message: "Token expired." };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
