const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const { APIError } = require("../middleware/errorHandler");

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Helper function to create user response
const createUserResponse = (user, token) => {
  return {
    success: true,
    message: "Authentication successful",
    data: {
      user: user.toPublicJSON(),
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  };
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { username, email, password, firstName, lastName, experienceLevel } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      throw new APIError(`User with this ${field} already exists`, 400);
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      profile: {
        firstName,
        lastName,
      },
      experienceLevel: experienceLevel || "beginner",
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login
    user.security.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(201).json(createUserResponse(user, token));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { login, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }],
    }).select("+password +security.loginAttempts +security.lockUntil");

    if (!user) {
      throw new APIError("Invalid credentials", 401);
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new APIError(
        "Account locked due to too many failed login attempts",
        423
      );
    }

    // Check if account is active
    if (user.status !== "active") {
      throw new APIError("Account is not active", 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      throw new APIError("Invalid credentials", 401);
    }

    // Reset login attempts on successful login
    if (user.security.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login and activity
    user.security.lastLogin = new Date();
    user.activity.lastActiveAt = new Date();
    await user.save({ validateBeforeSave: false });

    res.json(createUserResponse(user, token));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh JWT token
 * @route   POST /api/auth/refresh
 * @access  Private
 */
const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new APIError("Token is required", 400);
    }

    // Verify the existing token (even if expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.status !== "active") {
      throw new APIError("User not found or inactive", 404);
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: newToken,
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new APIError("Invalid token", 401));
    }
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new APIError("Access token is required", 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId)
      .populate("overallProgress")
      .populate("enrollments")
      .populate("achievements");

    if (!user || user.status !== "active") {
      throw new APIError("User not found or inactive", 404);
    }

    // Update last active timestamp
    await user.updateLastActive();

    res.json({
      success: true,
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new APIError("Invalid or expired token", 401));
    }
    next(error);
  }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

/**
 * @desc    Send password reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success for security (don't reveal if email exists)
    res.json({
      success: true,
      message:
        "If an account with that email exists, we have sent password reset instructions",
    });

    // TODO: Implement email sending logic here
    if (user) {
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      // Log the reset token for development (remove in production)
      if (process.env.NODE_ENV === "development") {
        console.log(`Password reset token for ${email}: ${resetToken}`);
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Validate JWT token
 * @route   GET /api/auth/validate-token
 * @access  Public
 */
const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        success: false,
        valid: false,
        message: "No token provided",
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user || user.status !== "active") {
      return res.json({
        success: false,
        valid: false,
        message: "User not found or inactive",
      });
    }

    res.json({
      success: true,
      valid: true,
      data: {
        userId: user._id,
        username: user.username,
        role: user.role,
        expiresAt: new Date(decoded.exp * 1000),
      },
    });
  } catch (error) {
    res.json({
      success: false,
      valid: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  getCurrentUser,
  logout,
  forgotPassword,
  validateToken,
};
