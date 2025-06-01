const Phase = require("../models/Phase");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

// @desc    Get all phases
// @route   GET /api/phases
// @access  Public
const getPhases = asyncHandler(async (req, res, next) => {
  const phases = await Phase.find({}).sort({ order: 1 });

  res.status(200).json({
    success: true,
    message: "Phases retrieved successfully",
    count: phases.length,
    data: phases,
  });
});

// @desc    Get single phase
// @route   GET /api/phases/:id
// @access  Public
const getPhase = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse(`Invalid phase ID format`, 400));
  }

  const phase = await Phase.findById(id);

  if (!phase) {
    return next(new ErrorResponse(`Phase with ID ${id} not found`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Phase retrieved successfully",
    data: phase,
  });
});

// @desc    Create phase
// @route   POST /api/phases
// @access  Private/Admin
const createPhase = asyncHandler(async (req, res, next) => {
  const { title, description, icon, color, order } = req.body;

  // Check if phase with same order already exists
  const existingOrder = await Phase.findOne({ order });
  if (existingOrder) {
    return next(
      new ErrorResponse(`Phase with order ${order} already exists`, 400)
    );
  }

  const phase = await Phase.create({
    title,
    description,
    icon,
    color,
    order,
  });

  res.status(201).json({
    success: true,
    message: "Phase created successfully",
    data: phase,
  });
});

// @desc    Update phase
// @route   PUT /api/phases/:id
// @access  Private/Admin
const updatePhase = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, icon, color, order } = req.body;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse(`Invalid phase ID format`, 400));
  }

  let phase = await Phase.findById(id);

  if (!phase) {
    return next(new ErrorResponse(`Phase with ID ${id} not found`, 404));
  }

  // If updating order, check if new order already exists (and it's not the current phase)
  if (order && order !== phase.order) {
    const existingOrder = await Phase.findOne({
      order,
      _id: { $ne: id },
    });
    if (existingOrder) {
      return next(
        new ErrorResponse(`Phase with order ${order} already exists`, 400)
      );
    }
  }

  phase = await Phase.findByIdAndUpdate(
    id,
    { title, description, icon, color, order },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Phase updated successfully",
    data: phase,
  });
});

// @desc    Delete phase
// @route   DELETE /api/phases/:id
// @access  Private/Admin
const deletePhase = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse(`Invalid phase ID format`, 400));
  }

  const phase = await Phase.findById(id);

  if (!phase) {
    return next(new ErrorResponse(`Phase with ID ${id} not found`, 404));
  }

  await Phase.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Phase deleted successfully",
    data: {},
  });
});

module.exports = {
  getPhases,
  getPhase,
  createPhase,
  updatePhase,
  deletePhase,
};
