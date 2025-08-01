const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const User = require("../models/User");
const { APIError } = require("../middleware/errorHandler");
const EmailService = require("../utils/emailService");

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

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      experienceLevel,
      role,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      throw new APIError(`User with this ${field} already exists`, 400);
    }

    // Determine user role and status
    const userRole = role === "admin" ? "admin" : "student";

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
      role: userRole,
      // adminStatus will be set automatically by the schema default function
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login
    user.security.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Send welcome email (don't let email failure affect registration)
    try {
      await EmailService.sendWelcomeEmail(user.email, user.username);
      console.log(`Welcome email sent to ${user.email}`);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Continue with registration even if email fails
    }

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
    if (user.security.lockUntil && user.security.lockUntil > Date.now()) {
      throw new APIError(
        "Account temporarily locked due to too many failed login attempts",
        423
      );
    }

    // Check admin status for admin users
    if (user.role === "admin" && user.adminStatus !== "active") {
      let message = "Admin account not activated";
      if (user.adminStatus === "pending") {
        message =
          "Admin account is pending approval. Please contact an administrator.";
      } else if (user.adminStatus === "suspended") {
        message =
          "Admin account has been suspended. Please contact an administrator.";
      }
      throw new APIError(message, 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incrementLoginAttempts();

      // Check if account should be locked after this failed attempt
      const updatedUser = await User.findById(user._id).select(
        "+security.lockUntil"
      );
      if (
        updatedUser.security.lockUntil &&
        updatedUser.security.lockUntil > Date.now()
      ) {
        throw new APIError(
          "Account temporarily locked due to too many failed login attempts. Please try again in 1 hour.",
          423
        );
      }

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
    await user.save({ validateBeforeSave: false });

    res.json(createUserResponse(user, token));
  } catch (error) {
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

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new APIError("User not found", 404);
    }

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

    // Send email if user exists
    if (user) {
      try {
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // Send password reset email using EmailService
        await EmailService.sendPasswordResetEmail(
          user.email,
          resetToken,
          user.username
        );

        console.log(`Password reset email sent to ${user.email}`);
      } catch (emailError) {
        // Only clear the password reset fields if email fails in production
        // In test environment, keep the token for testing purposes
        if (process.env.NODE_ENV !== "test") {
          user.security.passwordResetToken = undefined;
          user.security.passwordResetExpires = undefined;
          await user.save({ validateBeforeSave: false });
        }

        console.error("Error sending password reset email:", emailError);
        // Don't throw error to avoid revealing that user exists
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { token, password } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      "security.passwordResetToken": hashedToken,
      "security.passwordResetExpires": { $gt: Date.now() },
    }).select("+security.passwordResetToken +security.passwordResetExpires");

    if (!user) {
      throw new APIError("Invalid or expired password reset token", 400);
    }

    // Set new password
    user.password = password;
    user.security.passwordResetToken = undefined;
    user.security.passwordResetExpires = undefined;
    user.security.passwordChangedAt = new Date();

    await user.save();

    // Generate JWT token for immediate login
    const jwtToken = generateToken(user._id);

    // Update last login
    user.security.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Send password reset confirmation email
    try {
      await EmailService.sendPasswordResetConfirmationEmail(
        user.email,
        user.username
      );
      console.log(`Password reset confirmation email sent to ${user.email}`);
    } catch (emailError) {
      console.error(
        "Error sending password reset confirmation email:",
        emailError
      );
      // Don't throw error to avoid blocking the password reset success
      // User's password was already successfully reset
    }

    res.json({
      success: true,
      message: "Password reset successfully",
      data: {
        user: user.toPublicJSON(),
        token: jwtToken,
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  forgotPassword,
  resetPassword,
};
