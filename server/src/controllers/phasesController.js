const Phase = require("../models/Phase");
const { APIError } = require("../middleware/errorHandler");

/**
 * @desc    Get all phases
 * @route   GET /api/phases
 * @access  Public
 */
const getAllPhases = async (req, res, next) => {
  try {
    const phases = await Phase.getActivePhases();

    res.json({
      success: true,
      data: {
        phases: phases.map((phase) => phase.toClientFormat()),
        count: phases.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get phase by ID
 * @route   GET /api/phases/:id
 * @access  Public
 */
const getPhaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const phase = await Phase.findById(id);

    if (!phase || !phase.isActive) {
      throw new APIError("Phase not found", 404);
    }

    res.json({
      success: true,
      data: {
        phase: phase.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get phase statistics
 * @route   GET /api/phases/:id/stats
 * @access  Public
 */
const getPhaseStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const phase = await Phase.findById(id);

    if (!phase || !phase.isActive) {
      throw new APIError("Phase not found", 404);
    }

    // Calculate phase completion statistics
    const stats = await phase.calculateStats();

    res.json({
      success: true,
      data: {
        phaseId: id,
        phaseName: phase.name,
        difficulty: phase.difficulty,
        totalModules: phase.modules.length,
        ...stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new phase (admin only)
 * @route   POST /api/phases
 * @access  Private (Admin)
 */
const createPhase = async (req, res, next) => {
  try {
    const phaseData = req.body;
    const phase = new Phase(phaseData);
    await phase.save();

    res.status(201).json({
      success: true,
      message: "Phase created successfully",
      data: {
        phase: phase.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update phase (admin only)
 * @route   PUT /api/phases/:id
 * @access  Private (Admin)
 */
const updatePhase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const phase = await Phase.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!phase) {
      throw new APIError("Phase not found", 404);
    }

    res.json({
      success: true,
      message: "Phase updated successfully",
      data: {
        phase: phase.toClientFormat(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete phase (admin only)
 * @route   DELETE /api/phases/:id
 * @access  Private (Admin)
 */
const deletePhase = async (req, res, next) => {
  try {
    const { id } = req.params;

    const phase = await Phase.findById(id);
    if (!phase) {
      throw new APIError("Phase not found", 404);
    }

    // Soft delete - mark as inactive
    phase.isActive = false;
    await phase.save();

    res.json({
      success: true,
      message: "Phase deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPhases,
  getPhaseById,
  getPhaseStats,
  createPhase,
  updatePhase,
  deletePhase,
};
