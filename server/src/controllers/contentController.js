const Content = require("../models/Content");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

/**
 * @desc    Get all content with optional filtering
 * @route   GET /api/content
 * @access  Private
 * @query   ?type=video&moduleId=basic-cybersec&limit=10&page=1
 */
const getAllContent = asyncHandler(async (req, res, next) => {
  const { type, moduleId, limit = 10, page = 1 } = req.query;

  // Build query object
  let query = { isActive: true };

  if (type) {
    // Validate content type
    if (!["video", "lab", "game", "document"].includes(type)) {
      return next(new ErrorResponse("Invalid content type", 400));
    }
    query.type = type;
  }

  if (moduleId) {
    // Validate moduleId ObjectId format
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }
    query.moduleId = moduleId;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  const content = await Content.find(query)
    .populate("moduleId", "_id title")
    .sort({ moduleId: 1, section: 1, createdAt: 1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Content.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Content retrieved successfully",
    data: content,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get content by ID
 * @route   GET /api/content/:id
 * @access  Private
 */
const getContentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  const content = await Content.findOne({ _id: id, isActive: true }).populate(
    "moduleId",
    "_id title"
  );

  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Content retrieved successfully",
    data: content,
  });
});

/**
 * @desc    Get content by module
 * @route   GET /api/content/module/:moduleId
 * @access  Private
 */
const getContentByModule = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  // Validate moduleId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  const content = await Content.getByModule(moduleId);

  res.status(200).json({
    success: true,
    message: `Content for module retrieved successfully`,
    data: content,
    count: content.length,
  });
});

/**
 * @desc    Get content by module grouped by sections
 * @route   GET /api/content/module/:moduleId/grouped
 * @access  Private
 */
const getContentByModuleGrouped = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;

  // Validate moduleId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  const groupedContent = await Content.getByModuleGrouped(moduleId);

  res.status(200).json({
    success: true,
    message: `Grouped content for module retrieved successfully`,
    data: groupedContent,
  });
});

/**
 * @desc    Get content by type
 * @route   GET /api/content/type/:type
 * @access  Private
 */
const getContentByType = asyncHandler(async (req, res, next) => {
  const { type } = req.params;
  const { moduleId } = req.query;

  // Validate content type
  if (!["video", "lab", "game", "document"].includes(type)) {
    return next(new ErrorResponse("Invalid content type", 400));
  }

  let validatedModuleId = null;
  if (moduleId) {
    // Validate moduleId ObjectId format
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }
    validatedModuleId = moduleId;
  }

  const content = await Content.getByType(type, validatedModuleId);

  res.status(200).json({
    success: true,
    message: `${type} content retrieved successfully`,
    data: content,
    count: content.length,
  });
});

/**
 * @desc    Create new content
 * @route   POST /api/content
 * @access  Private (Admin)
 */
const createContent = asyncHandler(async (req, res, next) => {
  const contentData = req.body;

  // Validate moduleId ObjectId format
  if (!mongoose.Types.ObjectId.isValid(contentData.moduleId)) {
    return next(new ErrorResponse("Invalid module ID format", 400));
  }

  // Check if module exists
  const Module = require("../models/Module");
  const module = await Module.findById(contentData.moduleId);
  if (!module) {
    return next(new ErrorResponse("Module not found", 404));
  }

  const content = await Content.create(contentData);

  // Populate module information
  await content.populate("moduleId", "_id title");

  res.status(201).json({
    success: true,
    message: "Content created successfully",
    data: content,
  });
});

/**
 * @desc    Update content
 * @route   PUT /api/content/:id
 * @access  Private (Admin)
 */
const updateContent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validate content ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  // If updating moduleId, validate it
  if (updateData.moduleId) {
    if (!mongoose.Types.ObjectId.isValid(updateData.moduleId)) {
      return next(new ErrorResponse("Invalid module ID format", 400));
    }

    // Check if module exists
    const Module = require("../models/Module");
    const module = await Module.findById(updateData.moduleId);
    if (!module) {
      return next(new ErrorResponse("Module not found", 404));
    }
  }

  const content = await Content.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("moduleId", "_id title");

  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Content updated successfully",
    data: content,
  });
});

/**
 * @desc    Delete content (soft delete)
 * @route   DELETE /api/content/:id
 * @access  Private (Admin)
 */
const deleteContent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate content ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  const content = await Content.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Content deleted successfully",
  });
});

/**
 * @desc    Permanently delete content
 * @route   DELETE /api/content/:id/permanent
 * @access  Private (Admin)
 */
const permanentDeleteContent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate content ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("Invalid content ID format", 400));
  }

  const content = await Content.findByIdAndDelete(id);

  if (!content) {
    return next(new ErrorResponse("Content not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Content permanently deleted successfully",
  });
});

module.exports = {
  getAllContent,
  getContentById,
  getContentByModule,
  getContentByModuleGrouped,
  getContentByType,
  createContent,
  updateContent,
  deleteContent,
  permanentDeleteContent,
};
