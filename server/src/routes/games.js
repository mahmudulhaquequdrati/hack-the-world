/**
 * @swagger
 * tags:
 *   name: 🎮 Security Games
 *   description: Interactive cybersecurity games and challenges for skill building
 */

const express = require("express");
const { body } = require("express-validator");
const gamesController = require("../controllers/gamesController");

const router = express.Router();

// ========================================
// STATIC ROUTES FIRST (these must come before /:id)
// ========================================

/**
 * @swagger
 * /games/categories:
 *   get:
 *     summary: 🏷️ Get game categories
 *     description: Retrieve all available game categories (cryptography, network security, etc.)
 *     tags: [🎮 Security Games]
 * @route   GET /api/games/categories
 * @desc    Get all available game categories
 * @access  Public
 */
router.get("/categories", gamesController.getGameCategories);

/**
 * @swagger
 * /games/types:
 *   get:
 *     summary: 🎯 Get game types
 *     description: Retrieve all available game types (puzzle, simulation, challenge)
 *     tags: [🎮 Security Games]
 * @route   GET /api/games/types
 * @desc    Get all available game types
 * @access  Public
 */
router.get("/types", gamesController.getGameTypes);

// ========================================
// NESTED ROUTES (with parameters)
// ========================================

/**
 * @swagger
 * /games/module/{moduleId}:
 *   get:
 *     summary: 📚 Get games by module
 *     description: Retrieve all games for a specific cybersecurity module
 *     tags: [🎮 Security Games]
 * @route   GET /api/games/module/:moduleId
 * @desc    Get all games for a specific module
 * @access  Public
 */
router.get("/module/:moduleId", gamesController.getGamesByModule);

// ========================================
// GENERAL ROUTES
// ========================================

/**
 * @swagger
 * /games:
 *   get:
 *     summary: 🎮 Get all security games
 *     description: |
 *       Retrieve cybersecurity games with optional filtering. Games include puzzles, simulations, and challenges designed to build practical security skills.
 *
 *       **🎯 Game Types:**
 *       - **Puzzle**: Logic-based security challenges
 *       - **Simulation**: Real-world security scenario simulations
 *       - **Challenge**: Competitive security tasks with scoring
 *     tags: [🎮 Security Games]
 * @route   GET /api/games
 * @desc    Get all security games
 * @access  Public
 */
router.get("/", gamesController.getAllGames);

/**
 * @route   POST /api/games
 * @desc    Create a new game (admin only)
 * @access  Private (Admin)
 */
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Game name is required"),
    body("description").notEmpty().withMessage("Game description is required"),
    body("category").notEmpty().withMessage("Game category is required"),
    body("difficulty")
      .isIn(["beginner", "intermediate", "advanced", "expert"])
      .withMessage("Invalid difficulty level"),
    body("type")
      .isIn(["puzzle", "simulation", "challenge"])
      .withMessage("Invalid game type"),
    body("points")
      .isInt({ min: 1 })
      .withMessage("Points must be a positive integer"),
  ],
  gamesController.createGame
);

// ========================================
// PARAMETERIZED ROUTES LAST
// ========================================

/**
 * @route   GET /api/games/:id
 * @desc    Get game by ID
 * @access  Public
 */
router.get("/:id", gamesController.getGameById);

/**
 * @route   PUT /api/games/:id
 * @desc    Update game (admin only)
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Game name cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Game description cannot be empty"),
    body("difficulty")
      .optional()
      .isIn(["beginner", "intermediate", "advanced", "expert"])
      .withMessage("Invalid difficulty level"),
    body("type")
      .optional()
      .isIn(["puzzle", "simulation", "challenge"])
      .withMessage("Invalid game type"),
    body("points")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Points must be a positive integer"),
  ],
  gamesController.updateGame
);

/**
 * @route   DELETE /api/games/:id
 * @desc    Delete game (admin only)
 * @access  Private (Admin)
 */
router.delete("/:id", gamesController.deleteGame);

/**
 * @route   POST /api/games/:id/start
 * @desc    Start a game session
 * @access  Private
 */
router.post(
  "/:id/start",
  [body("userId").notEmpty().withMessage("User ID is required")],
  gamesController.startGameSession
);

/**
 * @route   POST /api/games/:id/submit
 * @desc    Submit game answer/solution
 * @access  Private
 */
router.post(
  "/:id/submit",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("sessionId").notEmpty().withMessage("Session ID is required"),
    body("challengeId").notEmpty().withMessage("Challenge ID is required"),
    body("answer").notEmpty().withMessage("Answer is required"),
  ],
  gamesController.submitGameAnswer
);

/**
 * @route   POST /api/games/:id/hint
 * @desc    Get game hint
 * @access  Private
 */
router.post(
  "/:id/hint",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("sessionId").notEmpty().withMessage("Session ID is required"),
    body("challengeId").notEmpty().withMessage("Challenge ID is required"),
  ],
  gamesController.getGameHint
);

/**
 * @route   GET /api/games/:id/leaderboard
 * @desc    Get game leaderboard
 * @access  Public
 */
router.get("/:id/leaderboard", gamesController.getGameLeaderboard);

module.exports = router;
