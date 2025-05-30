const { validationResult } = require("express-validator");
const Lab = require("../models/Lab");
const User = require("../models/User");
const { APIError } = require("../middleware/errorHandler");

/**
 * @desc    Get all labs for a specific module
 * @route   GET /api/labs/module/:moduleId
 * @access  Public
 */
const getLabsByModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const labs = await Lab.getByModule(moduleId);

    res.json({
      success: true,
      data: {
        labs: labs.map((lab) => lab.toClientFormat()),
        count: labs.length,
        moduleId,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all labs
 * @route   GET /api/labs
 * @access  Public
 */
const getAllLabs = async (req, res, next) => {
  try {
    const {
      moduleId,
      difficulty,
      category,
      type,
      estimatedTimeMin,
      estimatedTimeMax,
      page = 1,
      limit = 10,
      sort = "order",
      order = "asc",
    } = req.query;

    // Build query
    const query = { isActive: true };
    if (moduleId) query.moduleId = moduleId;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (type) query.type = type;
    if (estimatedTimeMin || estimatedTimeMax) {
      query.estimatedTime = {};
      if (estimatedTimeMin)
        query.estimatedTime.$gte = parseInt(estimatedTimeMin);
      if (estimatedTimeMax)
        query.estimatedTime.$lte = parseInt(estimatedTimeMax);
    }

    // Build sort
    const sortObj = {};
    sortObj[sort] = order === "desc" ? -1 : 1;

    const labs = await Lab.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Lab.countDocuments(query);

    res.json({
      success: true,
      data: {
        labs: labs.map((lab) => lab.toClientFormat()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
        filters: {
          moduleId,
          difficulty,
          category,
          type,
          estimatedTimeMin,
          estimatedTimeMax,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get lab by ID
 * @route   GET /api/labs/:id
 * @access  Public
 */
const getLabById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lab = await Lab.findById(id);

    if (!lab || !lab.isActive) {
      throw new APIError("Lab not found", 404);
    }

    res.json({
      success: true,
      data: {
        lab: lab.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Start a lab session
 * @route   POST /api/labs/:id/start
 * @access  Private
 */
const startLabSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const lab = await Lab.findById(id);
    if (!lab || !lab.isActive) {
      throw new APIError("Lab not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Check prerequisites (config.prerequisites is an array of strings)
    if (lab.config.prerequisites && lab.config.prerequisites.length > 0) {
      const completedLabs = user.labHistory
        .filter((session) => session.status === "completed")
        .map((session) => session.labId.toString());

      const missingPrereqs = lab.config.prerequisites.filter(
        (prereq) => !completedLabs.includes(prereq)
      );

      if (missingPrereqs.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Prerequisites not met",
          data: {
            missingPrerequisites: missingPrereqs.map((prereq) => ({
              id: prereq,
              name: prereq,
            })),
          },
        });
      }
    }

    // Create new lab session
    const session = {
      labId: lab._id,
      startedAt: new Date(),
      status: "active",
      progress: {
        currentStep: 0,
        completedSteps: [],
        totalSteps: lab.steps.length,
        timeSpent: 0,
      },
      environment: {
        status: "initializing",
        containerId: null,
        ports: [],
      },
    };

    // Add session to user's lab history
    user.labHistory.push(session);
    await user.save();

    res.json({
      success: true,
      message: "Lab session started successfully",
      data: {
        sessionId:
          session._id || user.labHistory[user.labHistory.length - 1]._id,
        lab: lab.toClientFormat(),
        session: {
          startedAt: session.startedAt,
          status: session.status,
          progress: session.progress,
          environment: session.environment,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit lab step completion
 * @route   POST /api/labs/:id/submit-step
 * @access  Private
 */
const submitLabStep = async (req, res, next) => {
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
    const { userId, sessionId, stepIndex, answer, evidence, timeSpent } =
      req.body;

    const lab = await Lab.findById(id);
    if (!lab || !lab.isActive) {
      throw new APIError("Lab not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Find the lab session
    const session = user.labHistory.id(sessionId);
    if (!session || session.status !== "active") {
      throw new APIError("Lab session not found or not active", 404);
    }

    // Validate step
    if (stepIndex < 0 || stepIndex >= lab.steps.length) {
      throw new APIError("Invalid step index", 400);
    }

    const step = lab.steps[stepIndex];

    // Check if step is already completed
    if (session.progress.completedSteps.includes(stepIndex)) {
      throw new APIError("Step already completed", 400);
    }

    // Validate submission based on step type
    let isValid = false;
    const feedback = {
      correct: false,
      message: "",
      hints: [],
    };

    switch (step.type) {
      case "command":
        // Check if the command output matches expected result
        isValid = await lab.validateCommand(stepIndex, answer);
        break;
      case "file":
        // Check if file content matches expected content
        isValid = await lab.validateFile(stepIndex, evidence);
        break;
      case "question":
        // Check answer against correct answer
        isValid = await lab.validateAnswer(stepIndex, answer);
        break;
      case "verification":
        // Check environment state
        isValid = await lab.verifyEnvironment(stepIndex, evidence);
        break;
      default:
        throw new APIError("Unknown step type", 400);
    }

    if (isValid) {
      // Mark step as completed
      session.progress.completedSteps.push(stepIndex);
      session.progress.currentStep = Math.max(
        session.progress.currentStep,
        stepIndex + 1
      );
      feedback.correct = true;
      feedback.message = step.successMessage || "Step completed successfully!";

      // Award points
      const points = step.points || 10;
      await user.addExperience(points);
    } else {
      feedback.correct = false;
      feedback.message = step.errorMessage || "Step not completed correctly.";
      feedback.hints = step.hints || [];
    }

    // Update time spent
    session.progress.timeSpent += timeSpent || 0;

    // Check if lab is completed
    if (session.progress.completedSteps.length === lab.steps.length) {
      session.status = "completed";
      session.completedAt = new Date();

      // Award completion bonus
      const bonus = lab.points || 50;
      await user.addExperience(bonus);

      feedback.message += " Lab completed successfully!";
    }

    await user.save();

    res.json({
      success: true,
      data: {
        feedback,
        session: {
          status: session.status,
          progress: session.progress,
          completedAt: session.completedAt,
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
 * @desc    Get lab hint for current step
 * @route   POST /api/labs/:id/hint
 * @access  Private
 */
const getLabHint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, sessionId, stepIndex } = req.body;

    const lab = await Lab.findById(id);
    if (!lab || !lab.isActive) {
      throw new APIError("Lab not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Find the lab session
    const session = user.labHistory.id(sessionId);
    if (!session || session.status !== "active") {
      throw new APIError("Lab session not found or not active", 404);
    }

    // Validate step
    if (stepIndex < 0 || stepIndex >= lab.steps.length) {
      throw new APIError("Invalid step index", 400);
    }

    const step = lab.steps[stepIndex];
    if (!step.hints || step.hints.length === 0) {
      throw new APIError("No hints available for this step", 400);
    }

    // Track hint usage
    if (!session.hintsUsed) session.hintsUsed = {};
    if (!session.hintsUsed[stepIndex]) session.hintsUsed[stepIndex] = 0;

    const hintIndex = session.hintsUsed[stepIndex];
    if (hintIndex >= step.hints.length) {
      throw new APIError("No more hints available for this step", 400);
    }

    const hint = step.hints[hintIndex];
    session.hintsUsed[stepIndex]++;

    await user.save();

    res.json({
      success: true,
      data: {
        hint,
        remainingHints: step.hints.length - session.hintsUsed[stepIndex],
        stepIndex,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset lab environment
 * @route   POST /api/labs/:id/reset
 * @access  Private
 */
const resetLabEnvironment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, sessionId } = req.body;

    const lab = await Lab.findById(id);
    if (!lab || !lab.isActive) {
      throw new APIError("Lab not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Find the lab session
    const session = user.labHistory.id(sessionId);
    if (!session || session.status !== "active") {
      throw new APIError("Lab session not found or not active", 404);
    }

    // Reset environment (this would interact with container orchestration)
    session.environment.status = "resetting";
    session.environment.lastReset = new Date();

    await user.save();

    // TODO: Implement actual environment reset logic here
    // This would involve destroying and recreating containers/VMs

    res.json({
      success: true,
      message: "Lab environment reset initiated",
      data: {
        environment: session.environment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get lab progress for user
 * @route   GET /api/labs/:id/progress/:userId
 * @access  Private
 */
const getLabProgress = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    const lab = await Lab.findById(id);
    if (!lab || !lab.isActive) {
      throw new APIError("Lab not found", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError("User not found", 404);
    }

    // Find user's sessions for this lab
    const sessions = user.labHistory.filter(
      (session) => session.labId.toString() === id
    );

    const activeSession = sessions.find(
      (session) => session.status === "active"
    );
    const completedSessions = sessions.filter(
      (session) => session.status === "completed"
    );

    res.json({
      success: true,
      data: {
        labId: id,
        labName: lab.name,
        totalSessions: sessions.length,
        activeSession: activeSession || null,
        completedSessions: completedSessions.length,
        bestTime:
          completedSessions.length > 0
            ? Math.min(...completedSessions.map((s) => s.progress.timeSpent))
            : null,
        lastAttempt:
          sessions.length > 0 ? sessions[sessions.length - 1].startedAt : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new lab (admin only)
 * @route   POST /api/labs
 * @access  Private (Admin)
 */
const createLab = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const labData = req.body;
    const lab = new Lab(labData);
    await lab.save();

    res.status(201).json({
      success: true,
      message: "Lab created successfully",
      data: {
        lab: lab.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update lab (admin only)
 * @route   PUT /api/labs/:id
 * @access  Private (Admin)
 */
const updateLab = async (req, res, next) => {
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

    const lab = await Lab.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!lab) {
      throw new APIError("Lab not found", 404);
    }

    res.json({
      success: true,
      message: "Lab updated successfully",
      data: {
        lab: lab.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete lab (admin only)
 * @route   DELETE /api/labs/:id
 * @access  Private (Admin)
 */
const deleteLab = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lab = await Lab.findById(id);
    if (!lab) {
      throw new APIError("Lab not found", 404);
    }

    // Soft delete - mark as inactive
    lab.isActive = false;
    await lab.save();

    res.json({
      success: true,
      message: "Lab deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all lab categories
 * @route   GET /api/labs/categories
 * @access  Public
 */
const getLabCategories = async (req, res, next) => {
  try {
    const categories = await Lab.distinct("category", { isActive: true });

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
 * @desc    Get lab steps
 * @route   GET /api/labs/:id/steps
 * @access  Public
 */
const getLabSteps = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lab = await Lab.findById(id);

    if (!lab || !lab.isActive) {
      throw new APIError("Lab not found", 404);
    }

    res.json({
      success: true,
      data: {
        steps: lab.steps.map((step) => ({
          id: step.id,
          title: step.title,
          description: step.description,
          order: step.order,
          instructions: step.instructions,
          expectedOutput: step.expectedOutput,
          hints: step.hints,
          validation: step.validation,
        })),
        count: lab.steps.length,
        labId: lab.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLabCategories,
  getLabSteps,
  getLabsByModule,
  getAllLabs,
  getLabById,
  startLabSession,
  submitLabStep,
  getLabHint,
  resetLabEnvironment,
  getLabProgress,
  createLab,
  updateLab,
  deleteLab,
};
