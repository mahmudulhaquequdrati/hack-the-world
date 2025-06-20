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
  const user = await User.findById(req.user._id).select("-password");

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

  // Get user with password field
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Check current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordCorrect) {
    return next(new ErrorResponse("Current password is incorrect", 400));
  }

  // Check if new password is different from current
  const isSamePassword = await user.comparePassword(newPassword);

  if (isSamePassword) {
    return next(
      new ErrorResponse(
        "New password must be different from current password",
        400
      )
    );
  }

  // Set new password (pre-save middleware will handle hashing)
  user.password = newPassword;

  // Manually set passwordChangedAt to ensure it's before token generation
  // Add a small buffer to avoid timing issues
  const passwordChangeTime = new Date(Date.now() - 1000); // 1 second before now
  user.security.passwordChangedAt = passwordChangeTime;

  // Save user
  await user.save();

  // Generate new JWT token (invalidates old token)
  // Token will have iat > passwordChangedAt, so it will be valid
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
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Update profile fields
  if (firstName !== undefined) user.profile.firstName = firstName;
  if (lastName !== undefined) user.profile.lastName = lastName;
  if (displayName !== undefined) user.profile.displayName = displayName;
  if (bio !== undefined) user.profile.bio = bio;
  if (location !== undefined) user.profile.location = location;
  if (website !== undefined) user.profile.website = website;

  // Save user
  await user.save();

  // Return updated user without password
  const updatedUser = await User.findById(user._id).select("-password");

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

  // Get current user
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Update avatar
  user.profile.avatar = avatar;
  await user.save();

  // Return updated user without password
  const updatedUser = await User.findById(user._id).select("-password");

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
