const Module = require("../models/Module");
const Phase = require("../models/Phase");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

/**
 * @desc    Get all modules
 * @route   GET /api/modules
 * @access  Public
 */
const getModules = asyncHandler(async (req, res, next) => {
  const { phase, grouped } = req.query;

  let modules;

  if (grouped === "true") {
    // Return modules grouped by phase
    modules = await Module.getGroupedByPhase();
  } else if (phase) {
    // Validate phase ObjectId format
    if (!mongoose.Types.ObjectId.isValid(phase)) {
      return next(new ErrorResponse(`Invalid phase ID format`, 400));
    }
    // Return modules for specific phase
    modules = await Module.getByPhase(phase);
  } else {
    // Return all modules with phase information
    modules = await Module.getAllWithPhases();
  }

  res.status(200).json({
    success: true,
    message: "Modules retrieved successfully",
    data: modules,
    count: Array.isArray(modules)
      ? modules.length
      : Object.keys(modules).length,
  });
});

/**
 * @desc    Get modules with phases for course page
 * @route   GET /api/modules/with-phases
 * @access  Public
 */
const getModulesWithPhases = asyncHandler(async (req, res, next) => {
  // Get all phases
  const phases = await Phase.find({}).sort({ order: 1 });

  // Get modules grouped by phase
  const groupedModules = await Module.getGroupedByPhase();

  // Combine phases with their modules
  const result = phases.map((phase) => ({
    ...phase.toJSON(),
    modules: groupedModules[phase.id]?.modules || [],
  }));

  res.status(200).json({
    success: true,
    message: "Phases with modules retrieved successfully",
    data: result,
  });
});

/**
 * @desc    Get single module by id
 * @route   GET /api/modules/:id
 * @access  Public
 */
const getModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse(`Invalid module ID format`, 400));
  }

  const module = await Module.findById(id).populate("phase");

  if (!module) {
    return next(new ErrorResponse(`Module with ID '${id}' not found`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Module retrieved successfully",
    data: module,
  });
});

/**
 * @desc    Create new module
 * @route   POST /api/modules
 * @access  Private (Admin only)
 */
const createModule = asyncHandler(async (req, res, next) => {
  const {
    phaseId,
    title,
    description,
    icon,
    duration,
    difficulty,
    color,
    order,
    topics,
    prerequisites,
    learningOutcomes,
    content,
  } = req.body;

  // Validate phaseId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(phaseId)) {
    return next(new ErrorResponse(`Invalid phase ID format`, 400));
  }

  // Check if phase exists
  const phase = await Phase.findById(phaseId);
  if (!phase) {
    return next(
      new ErrorResponse(`Phase with ID '${phaseId}' does not exist`, 400)
    );
  }

  // Check if order is already taken in this phase
  const orderExists = await Module.findOne({ phaseId, order });
  if (orderExists) {
    return next(
      new ErrorResponse(
        `Module creation failed: duplicate key error - Order ${order} is already taken in phase '${phaseId}'`,
        400
      )
    );
  }

  const module = await Module.create({
    phaseId,
    title,
    description,
    icon,
    duration,
    difficulty,
    color,
    order,
    topics,
    prerequisites,
    learningOutcomes,
    content,
  });

  // Populate phase information
  await module.populate("phase");

  res.status(201).json({
    success: true,
    message: "Module created successfully",
    data: module,
  });
});

/**
 * @desc    Update module
 * @route   PUT /api/modules/:id
 * @access  Private (Admin only)
 */
const updateModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  // Validate module ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse(`Invalid module ID format`, 400));
  }

  let module = await Module.findById(id);

  if (!module) {
    return next(new ErrorResponse(`Module with ID '${id}' not found`, 404));
  }

  // If updating phaseId, check if phase exists
  if (updates.phaseId && updates.phaseId !== module.phaseId.toString()) {
    // Validate phaseId ObjectId format
    if (!mongoose.Types.ObjectId.isValid(updates.phaseId)) {
      return next(new ErrorResponse(`Invalid phase ID format`, 400));
    }

    const phase = await Phase.findById(updates.phaseId);
    if (!phase) {
      return next(
        new ErrorResponse(
          `Phase with ID '${updates.phaseId}' does not exist`,
          400
        )
      );
    }

    // If only changing phaseId (not order), auto-assign next available order in target phase
    if (!updates.order || updates.order === module.order) {
      const maxOrderInTargetPhase = await Module.findOne({
        phaseId: updates.phaseId,
      }).sort({ order: -1 });

      const nextOrder = maxOrderInTargetPhase
        ? maxOrderInTargetPhase.order + 1
        : 1;
      updates.order = nextOrder;

      console.log(
        `Auto-assigning order ${nextOrder} for module moving to phase ${updates.phaseId}`
      );
    }
  }

  // If updating order, check if new order is available in the phase
  if (updates.order && updates.order !== module.order) {
    const phaseId = updates.phaseId || module.phaseId;
    const orderExists = await Module.findOne({
      phaseId,
      order: updates.order,
      _id: { $ne: id }, // Exclude current module
    });
    if (orderExists) {
      return next(
        new ErrorResponse(
          `Order ${updates.order} is already taken in phase '${phaseId}'`,
          400
        )
      );
    }
  }

  // Apply updates to the module object
  Object.keys(updates).forEach((key) => {
    if (key !== "_id" && key !== "id") {
      // Prevent ID modification
      module[key] = updates[key];
    }
  });

  // Save the module (this triggers the middleware)
  await module.save();

  // Populate phase information
  await module.populate("phase");

  res.status(200).json({
    success: true,
    message: "Module updated successfully",
    data: module,
  });
});

/**
 * @desc    Delete module
 * @route   DELETE /api/modules/:id
 * @access  Private (Admin only)
 */
const deleteModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse(`Invalid module ID format`, 400));
  }

  const module = await Module.findById(id);

  if (!module) {
    return next(new ErrorResponse(`Module with ID '${id}' not found`, 404));
  }

  // Hard delete - remove from database
  await Module.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Module deleted successfully",
    data: {},
  });
});

/**
 * @desc    Get modules by phase
 * @route   GET /api/modules/phase/:phaseId
 * @access  Public
 */
const getModulesByPhase = asyncHandler(async (req, res, next) => {
  const { phaseId } = req.params;

  // Validate phaseId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(phaseId)) {
    return next(new ErrorResponse(`Invalid phase ID format`, 400));
  }

  // Check if phase exists
  const phase = await Phase.findById(phaseId);
  if (!phase) {
    return next(new ErrorResponse(`Phase with ID '${phaseId}' not found`, 404));
  }

  const modules = await Module.getByPhase(phaseId);

  res.status(200).json({
    success: true,
    message: `Modules for phase '${phaseId}' retrieved successfully`,
    data: modules,
    count: modules.length,
  });
});

/**
 * @desc    Reorder modules within a phase
 * @route   PUT /api/modules/phase/:phaseId/reorder
 * @access  Private (Admin only)
 */
const reorderModules = asyncHandler(async (req, res, next) => {
  const { phaseId } = req.params;
  const { moduleOrders } = req.body; // Array of { moduleId, order }

  // Validate phaseId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(phaseId)) {
    return next(new ErrorResponse(`Invalid phase ID format`, 400));
  }

  // Check if phase exists
  const phase = await Phase.findById(phaseId);
  if (!phase) {
    return next(new ErrorResponse(`Phase with ID '${phaseId}' not found`, 404));
  }

  // Validate that all module IDs are valid ObjectIds
  const moduleIds = moduleOrders.map((item) => item.moduleId);
  for (const moduleId of moduleIds) {
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return next(
        new ErrorResponse(`Invalid module ID format: ${moduleId}`, 400)
      );
    }
  }

  // Validate that all modules exist and belong to this phase
  const modules = await Module.find({
    _id: { $in: moduleIds },
    phaseId,
    isActive: true,
  });

  if (modules.length !== moduleIds.length) {
    return next(
      new ErrorResponse(
        "Some modules not found or don't belong to this phase",
        400
      )
    );
  }

  // Update module orders
  const updatePromises = moduleOrders.map(({ moduleId, order }) =>
    Module.findOneAndUpdate(
      { _id: moduleId, phaseId },
      { order },
      { new: true }
    )
  );

  const updatedModules = await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: "Module order updated successfully",
    data: updatedModules,
  });
});

module.exports = {
  getModules,
  getModulesWithPhases,
  getModule,
  createModule,
  updateModule,
  deleteModule,
  getModulesByPhase,
  reorderModules,
};
