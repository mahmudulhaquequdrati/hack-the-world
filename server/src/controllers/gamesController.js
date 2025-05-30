const { validationResult } = require("express-validator");
const Game = require("../models/Game");
const User = require("../models/User");
const { APIError } = require("../middleware/errorHandler");

/**
 * @desc    Get all available game categories
 * @route   GET /api/games/categories
 * @access  Public
 */
const getGameCategories = async (req, res, next) => {
  try {
    const categories = await Game.distinct("category", { isActive: true });

    res.json({
      success: true,
      data: {
        categories: categories.sort(),
        count: categories.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all available game types
 * @route   GET /api/games/types
 * @access  Public
 */
const getGameTypes = async (req, res, next) => {
  try {
    const types = await Game.distinct("type", { isActive: true });

    res.json({
      success: true,
      data: {
        types: types.sort(),
        count: types.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all games for a specific module
 * @route   GET /api/games/module/:moduleId
 * @access  Public
 */
const getGamesByModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const games = await Game.getByModule(moduleId);

    res.json({
      success: true,
      data: {
        games: games.map((game) => game.toClientFormat()),
        count: games.length,
        moduleId,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all security games
 * @route   GET /api/games
 * @access  Public
 */
const getAllGames = async (req, res, next) => {
  try {
    const {
      moduleId,
      category,
      type,
      difficulty,
      minPoints,
      maxPoints,
      page = 1,
      limit = 10,
      sort = "difficulty",
      order = "asc",
    } = req.query;

    // Build query
    const query = { isActive: true };
    if (moduleId) query.moduleId = moduleId;
    if (category) query.category = category;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (minPoints || maxPoints) {
      query.points = {};
      if (minPoints) query.points.$gte = parseInt(minPoints);
      if (maxPoints) query.points.$lte = parseInt(maxPoints);
    }

    // Build sort
    const sortObj = {};
    sortObj[sort] = order === "desc" ? -1 : 1;

    const games = await Game.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Game.countDocuments(query);

    res.json({
      success: true,
      data: {
        games: games.map((game) => game.toClientFormat()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
        filters: {
          moduleId,
          category,
          type,
          difficulty,
          minPoints,
          maxPoints,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get game by ID
 * @route   GET /api/games/:id
 * @access  Public
 */
const getGameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);

    if (!game || !game.isActive) {
      throw new APIError("Game not found", 404);
    }

    res.json({
      success: true,
      data: {
        game: game.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Start a game session
 * @route   POST /api/games/:id/start
 * @access  Private
 */
const startGameSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const game = await Game.findById(id);
    if (!game || !game.isActive) {
      throw new APIError("Game not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Create new game session
    const session = {
      gameId: game._id,
      startedAt: new Date(),
      status: "active",
      score: 0,
      timeSpent: 0,
      hints: [],
      progress: {
        currentLevel: 1,
        completedChallenges: [],
        totalChallenges: game.challenges.length,
      },
    };

    // Add session to user's game history
    user.gameHistory.push(session);
    await user.save();

    res.json({
      success: true,
      message: "Game session started successfully",
      data: {
        sessionId:
          session._id || user.gameHistory[user.gameHistory.length - 1]._id,
        game: game.toClientFormat(),
        session: {
          startedAt: session.startedAt,
          status: session.status,
          progress: session.progress,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit game answer/solution
 * @route   POST /api/games/:id/submit
 * @access  Private
 */
const submitGameAnswer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { userId, sessionId, answer, challengeId, timeSpent } = req.body;

    const game = await Game.findById(id);
    if (!game || !game.isActive) {
      throw new APIError("Game not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Find the game session
    const session = user.gameHistory.id(sessionId);
    if (!session || session.status !== "active") {
      throw new APIError("Game session not found or not active", 404);
    }

    // Find the challenge
    const challenge = game.challenges.id(challengeId);
    if (!challenge) {
      throw new APIError("Challenge not found", 404);
    }

    // Check answer
    const isCorrect = await game.checkAnswer(challengeId, answer);
    let points = 0;

    if (isCorrect) {
      points = challenge.points;
      session.score += points;
      session.progress.completedChallenges.push(challengeId);

      // Award points to user
      await user.addExperience(points);
    }

    // Update session
    session.timeSpent += timeSpent || 0;

    // Check if game is completed
    if (
      session.progress.completedChallenges.length === game.challenges.length
    ) {
      session.status = "completed";
      session.completedAt = new Date();

      // Award completion bonus
      const bonus = Math.floor(game.points * 0.1);
      session.score += bonus;
      await user.addExperience(bonus);
    }

    await user.save();

    res.json({
      success: true,
      data: {
        correct: isCorrect,
        points: isCorrect ? points : 0,
        session: {
          score: session.score,
          status: session.status,
          progress: session.progress,
          timeSpent: session.timeSpent,
        },
        userStats: {
          level: user.stats.level,
          experience: user.stats.experience,
          totalPoints: user.stats.totalPoints,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get game hint
 * @route   POST /api/games/:id/hint
 * @access  Private
 */
const getGameHint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, sessionId, challengeId } = req.body;

    const game = await Game.findById(id);
    if (!game || !game.isActive) {
      throw new APIError("Game not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Find the game session
    const session = user.gameHistory.id(sessionId);
    if (!session || session.status !== "active") {
      throw new APIError("Game session not found or not active", 404);
    }

    // Find the challenge
    const challenge = game.challenges.id(challengeId);
    if (!challenge) {
      throw new APIError("Challenge not found", 404);
    }

    // Check if user already used all hints for this challenge
    const usedHints = session.hints.filter(
      (h) => h.challengeId.toString() === challengeId
    );
    if (usedHints.length >= challenge.hints.length) {
      throw new APIError("No more hints available for this challenge", 400);
    }

    // Get next hint
    const hintIndex = usedHints.length;
    const hint = challenge.hints[hintIndex];

    // Add hint to session
    session.hints.push({
      challengeId,
      hintIndex,
      usedAt: new Date(),
    });

    // Deduct points for using hint
    const pointDeduction = Math.floor(challenge.points * 0.1);
    session.score = Math.max(0, session.score - pointDeduction);

    await user.save();

    res.json({
      success: true,
      data: {
        hint: hint.text,
        pointsDeducted: pointDeduction,
        remainingHints: challenge.hints.length - usedHints.length - 1,
        session: {
          score: session.score,
          hints: session.hints,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get game leaderboard
 * @route   GET /api/games/:id/leaderboard
 * @access  Public
 */
const getGameLeaderboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    const game = await Game.findById(id);
    if (!game || !game.isActive) {
      throw new APIError("Game not found", 404);
    }

    const leaderboard = await User.aggregate([
      { $unwind: "$gameHistory" },
      {
        $match: {
          "gameHistory.gameId": game._id,
          "gameHistory.status": "completed",
        },
      },
      {
        $sort: {
          "gameHistory.score": -1,
          "gameHistory.timeSpent": 1,
        },
      },
      { $limit: parseInt(limit) },
      {
        $project: {
          username: 1,
          "profile.displayName": 1,
          "profile.avatar": 1,
          score: "$gameHistory.score",
          timeSpent: "$gameHistory.timeSpent",
          completedAt: "$gameHistory.completedAt",
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        leaderboard,
        gameId: game._id,
        gameName: game.name,
        count: leaderboard.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new game (admin only)
 * @route   POST /api/games
 * @access  Private (Admin)
 */
const createGame = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const gameData = req.body;
    const game = new Game(gameData);
    await game.save();

    res.status(201).json({
      success: true,
      message: "Game created successfully",
      data: {
        game: game.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update game (admin only)
 * @route   PUT /api/games/:id
 * @access  Private (Admin)
 */
const updateGame = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const game = await Game.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!game) {
      throw new APIError("Game not found", 404);
    }

    res.json({
      success: true,
      message: "Game updated successfully",
      data: {
        game: game.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete game (admin only)
 * @route   DELETE /api/games/:id
 * @access  Private (Admin)
 */
const deleteGame = async (req, res, next) => {
  try {
    const { id } = req.params;

    const game = await Game.findById(id);
    if (!game) {
      throw new APIError("Game not found", 404);
    }

    // Soft delete - mark as inactive
    game.isActive = false;
    await game.save();

    res.json({
      success: true,
      message: "Game deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGameCategories,
  getGameTypes,
  getGamesByModule,
  getAllGames,
  getGameById,
  startGameSession,
  submitGameAnswer,
  getGameHint,
  getGameLeaderboard,
  createGame,
  updateGame,
  deleteGame,
};
