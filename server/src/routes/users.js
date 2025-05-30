const express = require("express");
const { body } = require("express-validator");
const usersController = require("../controllers/usersController");

const router = express.Router();

// ========================================
// STATIC ROUTES FIRST (these must come before /:id)
// ========================================

/**
 * @route   GET /api/users/leaderboard
 * @desc    Get user leaderboard
 * @access  Public
 */
router.get("/leaderboard", usersController.getLeaderboard);

// ========================================
// GENERAL ROUTES
// ========================================

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
router.get("/", usersController.getAllUsers);

// ========================================
// PARAMETERIZED ROUTES LAST
// ========================================

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get("/:id", usersController.getUserById);

/**
 * @route   PUT /api/users/:id/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  "/:id/profile",
  [
    body("firstName")
      .optional()
      .isLength({ max: 50 })
      .withMessage("First name cannot exceed 50 characters"),
    body("lastName")
      .optional()
      .isLength({ max: 50 })
      .withMessage("Last name cannot exceed 50 characters"),
    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),
    body("location")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Location cannot exceed 100 characters"),
    body("website")
      .optional()
      .isURL()
      .withMessage("Website must be a valid URL"),
  ],
  usersController.updateProfile
);

/**
 * @route   PUT /api/users/:id/preferences
 * @desc    Update user learning preferences
 * @access  Private
 */
router.put(
  "/:id/preferences",
  [
    body("preferredDifficulty")
      .optional()
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Invalid difficulty level"),
    body("theme")
      .optional()
      .isIn(["light", "dark", "auto"])
      .withMessage("Invalid theme"),
    body("language")
      .optional()
      .isLength({ min: 2, max: 5 })
      .withMessage("Invalid language code"),
  ],
  usersController.updatePreferences
);

/**
 * @route   GET /api/users/:id/progress
 * @desc    Get user progress summary
 * @access  Private
 */
router.get("/:id/progress", usersController.getUserProgress);

/**
 * @route   GET /api/users/:id/achievements
 * @desc    Get user achievements
 * @access  Private
 */
router.get("/:id/achievements", usersController.getUserAchievements);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user account
 * @access  Private (Admin or Self)
 */
router.delete("/:id", usersController.deleteUser);

/**
 * @route   PUT /api/users/:id/role
 * @desc    Update user role (admin only)
 * @access  Private (Admin)
 */
router.put("/:id/role", usersController.updateUserRole);

/**
 * @route   GET /api/users/:id/activity
 * @desc    Get user activity history
 * @access  Private
 */
router.get("/:id/activity", usersController.getUserActivity);

module.exports = router;
