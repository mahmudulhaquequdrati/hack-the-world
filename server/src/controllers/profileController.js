const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// Helper function to generate JWT token (same as in authController)
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * @desc    Get current user profile
 * @route   GET /profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res, next) => {
  // User is already attached to req from the protect middleware
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: {
      user,
    },
  });
});

/**
 * @desc    Update user password
 * @route   PUT /profile/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword) {
    return next(
      new ErrorResponse("Current password and new password are required", 400)
    );
  }

  if (newPassword.length < 8) {
    return next(
      new ErrorResponse("New password must be at least 8 characters long", 400)
    );
  }

  // Get user with password field
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Check current password
  const isCurrentPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordCorrect) {
    return next(new ErrorResponse("Current password is incorrect", 400));
  }

  // Check if new password is different from current
  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    return next(
      new ErrorResponse(
        "New password must be different from current password",
        400
      )
    );
  }

  // Validate new password strength
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;
  if (!passwordRegex.test(newPassword)) {
    return next(
      new ErrorResponse(
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        400
      )
    );
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);

  // Save user
  await user.save();

  // Generate new JWT token (invalidates old token)
  const newToken = generateToken(user._id);

  // Log password change activity
  console.log(
    `Password changed for user: ${user.username} (${user.email}) at ${new Date()}`
  );

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
    data: {
      token: newToken,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  });
});

/**
 * @desc    Update basic profile information
 * @route   PUT /profile/basic
 * @access  Private
 */
const updateBasicProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, displayName, bio, location, website } = req.body;

  // Get current user
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Update profile fields
  if (firstName !== undefined) user.profile.firstName = firstName;
  if (lastName !== undefined) user.profile.lastName = lastName;
  if (displayName !== undefined) user.profile.displayName = displayName;
  if (bio !== undefined) user.profile.bio = bio;
  if (location !== undefined) user.profile.location = location;
  if (website !== undefined) {
    // Validate website URL if provided
    if (website && !/^https?:\/\/.+/.test(website)) {
      return next(
        new ErrorResponse(
          "Website must be a valid URL starting with http:// or https://",
          400
        )
      );
    }
    user.profile.website = website;
  }

  // Save user
  await user.save();

  // Return updated user without password
  const updatedUser = await User.findById(user.id).select("-password");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

/**
 * @desc    Update user avatar
 * @route   PUT /profile/avatar
 * @access  Private
 */
const updateAvatar = asyncHandler(async (req, res, next) => {
  const { avatar } = req.body;

  if (!avatar) {
    return next(new ErrorResponse("Avatar URL is required", 400));
  }

  // Basic URL validation
  try {
    new URL(avatar);
  } catch (error) {
    return next(new ErrorResponse("Invalid avatar URL", 400));
  }

  // Get current user
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Update avatar
  user.profile.avatar = avatar;
  await user.save();

  // Return updated user without password
  const updatedUser = await User.findById(user.id).select("-password");

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

module.exports = {
  getProfile,
  changePassword,
  updateBasicProfile,
  updateAvatar,
};
