const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const APIError = require("../middleware/errorHandler");

/**
 * Protect middleware - verifies JWT token and attaches user to request
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract token from Bearer token
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new ErrorResponse("No user found with this token", 404));
    }

    // Check if password was changed after token was issued
    if (user.security.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        user.security.passwordChangedAt.getTime() / 1000
      );
      if (decoded.iat < changedTimestamp) {
        return next(
          new ErrorResponse("Password was changed. Please log in again", 401)
        );
      }
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

/**
 * Authorize middleware - checks user roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};

/**
 * Optional auth middleware - attaches user if token is valid but doesn't require auth
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (user && user.status === "active") {
        req.user = user;
      }
    } catch (error) {
      // Continue without user if token is invalid
      console.log("Optional auth failed:", error.message);
    }
  }

  next();
});

/**
 * Check if user has admin role and active status
 */
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      throw new APIError("Authentication required", 401);
    }

    if (req.user.role !== "admin") {
      throw new APIError("Admin access required", 403);
    }

    if (req.user.adminStatus !== "active") {
      throw new APIError("Admin account not activated", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user has specific role
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new APIError("Authentication required", 401);
      }

      const userRoles = Array.isArray(roles) ? roles : [roles];

      if (!userRoles.includes(req.user.role)) {
        throw new APIError(
          `Access denied. Required role(s): ${userRoles.join(", ")}`,
          403
        );
      }

      // Additional check for admin status if user is admin
      if (req.user.role === "admin" && req.user.adminStatus !== "active") {
        throw new APIError("Admin account not activated", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  requireAdmin,
  requireRole,
};
