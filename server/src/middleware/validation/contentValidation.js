const { body, param, query } = require("express-validator");

/**
 * Validation rules for creating content
 */
const createContentValidation = [
  // Module ID validation
  body("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .isMongoId()
    .withMessage("Module ID must be a valid MongoDB ObjectId"),

  // Content type validation
  body("type")
    .isIn(["video", "lab", "game", "document"])
    .withMessage("Content type must be video, lab, game, or document"),

  // Title validation
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  // Description validation
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 10000 })
    .withMessage("Description cannot exceed 10000 characters"),

  // Section validation
  body("section")
    .trim()
    .notEmpty()
    .withMessage("Section is required")
    .isLength({ max: 100 })
    .withMessage("Section cannot exceed 100 characters"),

  // URL validation (required for videos)
  body("url")
    .if(body("type").equals("video"))
    .notEmpty()
    .withMessage("URL is required for video content")
    .isURL()
    .withMessage("URL must be a valid URL"),

  // Instructions validation (required for labs and games)
  body("instructions")
    .if(body("type").isIn(["lab", "game"]))
    .notEmpty()
    .withMessage("Instructions are required for lab and game content")
    .isLength({ max: 10000 })
    .withMessage("Instructions cannot exceed 10000 characters"),

  // Duration validation (optional)
  body("duration")
    .optional()
    .isInt({ min: 1, max: 300 })
    .withMessage("Duration must be between 1 and 300 minutes"),

  // Metadata validation (optional)
  body("metadata")
    .optional()
    .isObject()
    .withMessage("Metadata must be an object"),

  // Active status validation (optional)
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

/**
 * Validation rules for updating content
 */
const updateContentValidation = [
  // Content ID validation
  param("id")
    .isMongoId()
    .withMessage("Content ID must be a valid MongoDB ObjectId"),

  // Module ID validation (optional for updates)
  body("moduleId")
    .optional()
    .isMongoId()
    .withMessage("Module ID must be a valid MongoDB ObjectId"),

  // Content type validation (optional for updates)
  body("type")
    .optional()
    .isIn(["video", "lab", "game", "document"])
    .withMessage("Content type must be video, lab, game, or document"),

  // Title validation (optional for updates)
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  // Description validation (optional for updates)
  body("description")
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage("Description cannot exceed 10000 characters"),

  // Section validation (optional for updates)
  body("section")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Section cannot exceed 100 characters"),

  // URL validation (conditional on type)
  body("url").optional().isURL().withMessage("URL must be a valid URL"),

  // Instructions validation (conditional on type)
  body("instructions")
    .optional()
    .isLength({ max: 10000 })
    .withMessage("Instructions cannot exceed 10000 characters"),

  // Duration validation (optional)
  body("duration")
    .optional()
    .isInt({ min: 1, max: 300 })
    .withMessage("Duration must be between 1 and 300 minutes"),

  // Metadata validation (optional)
  body("metadata")
    .optional()
    .isObject()
    .withMessage("Metadata must be an object"),

  // Active status validation (optional)
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

/**
 * Validation rules for getting content by ID
 */
const getContentValidation = [
  param("id")
    .isMongoId()
    .withMessage("Content ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation rules for getting content by module
 */
const getContentByModuleValidation = [
  param("moduleId")
    .isMongoId()
    .withMessage("Module ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation rules for getting content by type
 */
const getContentByTypeValidation = [
  param("type")
    .isIn(["video", "lab", "game", "document"])
    .withMessage("Content type must be video, lab, game, or document"),

  query("moduleId")
    .optional()
    .isMongoId()
    .withMessage("Module ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation rules for getting all content with filters
 */
const getAllContentValidation = [
  query("type")
    .optional()
    .isIn(["video", "lab", "game", "document"])
    .withMessage("Content type must be video, lab, game, or document"),

  query("moduleId")
    .optional()
    .isMongoId()
    .withMessage("Module ID must be a valid MongoDB ObjectId"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

/**
 * Validation rules for deleting content
 */
const deleteContentValidation = [
  param("id")
    .isMongoId()
    .withMessage("Content ID must be a valid MongoDB ObjectId"),

  query("permanent")
    .optional()
    .isBoolean()
    .withMessage("Permanent flag must be a boolean"),
];

module.exports = {
  createContentValidation,
  updateContentValidation,
  getContentValidation,
  getContentByModuleValidation,
  getContentByTypeValidation,
  getAllContentValidation,
  deleteContentValidation,
};
