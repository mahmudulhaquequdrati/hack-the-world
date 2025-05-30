/**
 * @swagger
 * tags:
 *   name: 🏆 Achievements
 *   description: Achievement system for tracking user progress and milestones
 */

const express = require("express");
const { body } = require("express-validator");
const achievementsController = require("../controllers/achievementsController");

const router = express.Router();

// ========================================
// STATIC ROUTES FIRST (these must come before /:id)
// ========================================

/**
 * @route   GET /api/achievements/categories
 * @desc    Get all achievement categories
 * @access  Public
 */
router.get("/categories", achievementsController.getAchievementCategories);

/**
 * @route   GET /api/achievements/leaderboard
 * @desc    Get achievements leaderboard
 * @access  Public
 */
router.get("/leaderboard", achievementsController.getAchievementsLeaderboard);

// ========================================
// NESTED ROUTES (with parameters)
// ========================================

/**
 * @route   GET /api/achievements/user/:userId
 * @desc    Get user's earned achievements
 * @access  Private
 */
router.get("/user/:userId", achievementsController.getUserAchievements);

/**
 * @route   GET /api/achievements/progress/:userId/:achievementId
 * @desc    Get user's progress on specific achievement
 * @access  Private
 */
router.get(
  "/progress/:userId/:achievementId",
  achievementsController.getAchievementProgress
);

/**
 * @route   POST /api/achievements/check/:userId
 * @desc    Check if user has earned new achievements
 * @access  Private
 */
router.post(
  "/check/:userId",
  [
    body("action").notEmpty().withMessage("Action is required"),
    body("data").optional().isObject().withMessage("Data must be an object"),
  ],
  achievementsController.checkUserAchievements
);

/**
 * @route   POST /api/achievements/award/:userId/:achievementId
 * @desc    Award achievement to user (admin only)
 * @access  Private (Admin)
 */
router.post(
  "/award/:userId/:achievementId",
  achievementsController.awardAchievement
);

// ========================================
// GENERAL ROUTES
// ========================================

/**
 * @route   GET /api/achievements
 * @desc    Get all achievements
 * @access  Public
 */
router.get("/", achievementsController.getAllAchievements);

// ========================================
// PARAMETERIZED ROUTES LAST
// ========================================

/**
 * @route   GET /api/achievements/:id
 * @desc    Get single achievement by ID
 * @access  Public
 */
router.get("/:id", achievementsController.getAchievementById);

module.exports = router;
