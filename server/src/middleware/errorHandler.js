const mongoose = require("mongoose");

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB cast errors (invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new APIError(message, 400);
};

/**
 * Handle MongoDB duplicate field errors
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists. Please use another value.`;
  return new APIError(message, 400);
};

/**
 * Handle MongoDB validation errors
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new APIError(message, 400);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () =>
  new APIError("Invalid token. Please log in again.", 401);

/**
 * Handle JWT expired errors
 */
const handleJWTExpiredError = () =>
  new APIError("Your token has expired. Please log in again.", 401);

/**
 * Send error response for development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
    ...(err.errors && { errors: err.errors }),
  });
};

/**
 * Send error response for production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥:", err);

    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Preserve statusCode from custom ErrorResponse objects
  if (err.statusCode) {
    error.statusCode = err.statusCode;
  }

  // Log error for debugging
  console.error("🚨 Error:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Handle custom ErrorResponse objects (our module controller errors)
  if (err.name === "ErrorResponse") {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") error = handleCastErrorDB(error);

  // Mongoose duplicate key
  if (err.code === 11000) error = handleDuplicateFieldsDB(error);

  // Mongoose validation error
  if (err.name === "ValidationError") error = handleValidationErrorDB(error);

  // JWT errors
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  // Express validator errors
  if (err.errors && Array.isArray(err.errors)) {
    error = new APIError("Validation failed", 400);
    error.errors = err.errors;
  }

  // Send appropriate error response
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
module.exports.APIError = APIError;
