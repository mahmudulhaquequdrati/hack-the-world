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
  const { title, description, icon, color } = req.body;

  // Auto-calculate order for new phase
  const existingPhases = await Phase.find({}).sort({ order: -1 }).limit(1);
  const maxOrder = existingPhases.length > 0 ? existingPhases[0].order : 0;
  const newOrder = maxOrder + 1;

  const phase = await Phase.create({
    title,
    description,
    icon,
    color,
    order: newOrder,
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
  const { title, description, icon, color } = req.body;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse(`Invalid phase ID format`, 400));
  }

  let phase = await Phase.findById(id);

  if (!phase) {
    return next(new ErrorResponse(`Phase with ID ${id} not found`, 404));
  }

  // Update phase, preserving existing order
  phase = await Phase.findByIdAndUpdate(
    id,
    { title, description, icon, color },
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

// @desc    Batch update phase orders
// @route   PUT /api/phases/batch-order
// @access  Private/Admin
const batchUpdatePhaseOrder = asyncHandler(async (req, res, next) => {
  const { phaseOrders } = req.body; // Array of { _id, order }

  if (!Array.isArray(phaseOrders) || phaseOrders.length === 0) {
    return next(new ErrorResponse("Phase orders array is required", 400));
  }

  // Validate all phase IDs and orders
  for (const { _id, order } of phaseOrders) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return next(new ErrorResponse(`Invalid phase ID format: ${_id}`, 400));
    }
    if (typeof order !== "number" || order < 1) {
      return next(new ErrorResponse(`Invalid order value: ${order}`, 400));
    }
  }

  // Get all phase IDs and verify they exist
  const phaseIds = phaseOrders.map(item => item._id);
  const existingPhases = await Phase.find({ _id: { $in: phaseIds } });
  
  if (existingPhases.length !== phaseIds.length) {
    return next(new ErrorResponse("Some phases not found", 404));
  }

  // Use transaction to ensure atomicity and handle unique constraint conflicts
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // First, set all phases to temporary negative orders to avoid conflicts
      const tempUpdatePromises = phaseOrders.map(({ _id }, index) =>
        Phase.findByIdAndUpdate(
          _id,
          { order: -(index + 1) }, // Use negative numbers temporarily
          { session }
        )
      );
      await Promise.all(tempUpdatePromises);

      // Then update with the actual orders
      const finalUpdatePromises = phaseOrders.map(({ _id, order }) =>
        Phase.findByIdAndUpdate(
          _id,
          { order },
          { new: true, runValidators: true, session }
        )
      );
      await Promise.all(finalUpdatePromises);
    });

    await session.endSession();

    // Fetch updated phases
    const updatedPhases = await Phase.find({}).sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: "Phase orders updated successfully",
      data: updatedPhases,
    });
  } catch (error) {
    await session.endSession();
    console.error("Phase batch update error:", error);
    return next(new ErrorResponse(`Failed to update phase orders: ${error.message}`, 500));
  }
});

module.exports = {
  getPhases,
  getPhase,
  createPhase,
  updatePhase,
  deletePhase,
  batchUpdatePhaseOrder,
};
