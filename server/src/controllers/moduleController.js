const Module = require("../models/Module");
const Phase = require("../models/Phase");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

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
    modules: groupedModules[phase.phaseId]?.modules || [],
  }));

  res.status(200).json({
    success: true,
    message: "Phases with modules retrieved successfully",
    data: result,
  });
});

/**
 * @desc    Get single module by moduleId
 * @route   GET /api/modules/:moduleId
 * @access  Public
 */
const getModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  const module = await Module.findOne({ moduleId }).populate("phase");

  if (!module) {
    return next(
      new ErrorResponse(`Module with ID '${moduleId}' not found`, 404)
    );
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
    moduleId,
    phaseId,
    title,
    description,
    icon,
    duration,
    difficulty,
    color,
    path,
    enrollPath,
    order,
    topics,
    prerequisites,
    learningOutcomes,
    content,
  } = req.body;

  // Check if phase exists
  const phase = await Phase.findOne({ phaseId });
  if (!phase) {
    return next(new ErrorResponse(`Phase with ID '${phaseId}' not found`, 404));
  }

  // Check if module with same moduleId already exists
  const existingModule = await Module.findOne({ moduleId });
  if (existingModule) {
    return next(
      new ErrorResponse(`Module with ID '${moduleId}' already exists`, 400)
    );
  }

  // Check if order is already taken in this phase
  const orderExists = await Module.findOne({ phaseId, order });
  if (orderExists) {
    return next(
      new ErrorResponse(
        `Order ${order} is already taken in phase '${phaseId}'`,
        400
      )
    );
  }

  const module = await Module.create({
    moduleId,
    phaseId,
    title,
    description,
    icon,
    duration,
    difficulty,
    color,
    path,
    enrollPath,
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
 * @route   PUT /api/modules/:moduleId
 * @access  Private (Admin only)
 */
const updateModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;
  const updates = req.body;

  let module = await Module.findOne({ moduleId });

  if (!module) {
    return next(
      new ErrorResponse(`Module with ID '${moduleId}' not found`, 404)
    );
  }

  // If updating phaseId, check if phase exists
  if (updates.phaseId && updates.phaseId !== module.phaseId) {
    const phase = await Phase.findOne({ phaseId: updates.phaseId });
    if (!phase) {
      return next(
        new ErrorResponse(`Phase with ID '${updates.phaseId}' not found`, 404)
      );
    }
  }

  // If updating order, check if new order is available in the phase
  if (updates.order && updates.order !== module.order) {
    const phaseId = updates.phaseId || module.phaseId;
    const orderExists = await Module.findOne({
      phaseId,
      order: updates.order,
      moduleId: { $ne: moduleId }, // Exclude current module
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
    module[key] = updates[key];
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
 * @route   DELETE /api/modules/:moduleId
 * @access  Private (Admin only)
 */
const deleteModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  const module = await Module.findOne({ moduleId });

  if (!module) {
    return next(
      new ErrorResponse(`Module with ID '${moduleId}' not found`, 404)
    );
  }

  // Soft delete - set isActive to false
  module.isActive = false;
  await module.save();

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

  // Check if phase exists
  const phase = await Phase.findOne({ phaseId });
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

  // Check if phase exists
  const phase = await Phase.findOne({ phaseId });
  if (!phase) {
    return next(new ErrorResponse(`Phase with ID '${phaseId}' not found`, 404));
  }

  // Validate that all modules exist and belong to this phase
  const moduleIds = moduleOrders.map((item) => item.moduleId);
  const modules = await Module.find({
    moduleId: { $in: moduleIds },
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
    Module.findOneAndUpdate({ moduleId, phaseId }, { order }, { new: true })
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
