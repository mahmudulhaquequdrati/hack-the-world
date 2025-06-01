const { body, param, validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }
  next();
};

const createPhaseValidation = [
  body("phaseId")
    .notEmpty()
    .withMessage("Phase ID is required")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Phase ID must be one of: beginner, intermediate, advanced")
    .trim()
    .escape(),

  body("title")
    .notEmpty()
    .withMessage("Phase title is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Phase title must be between 1 and 100 characters")
    .trim()
    .escape(),

  body("description")
    .notEmpty()
    .withMessage("Phase description is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Phase description must be between 1 and 500 characters")
    .trim()
    .escape(),

  body("icon")
    .notEmpty()
    .withMessage("Phase icon is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Icon name must be between 1 and 50 characters")
    .trim()
    .escape(),

  body("color")
    .notEmpty()
    .withMessage("Phase color is required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage(
      "Please provide a valid hex color code (e.g., #FF0000 or #F00)"
    )
    .trim(),

  body("order")
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer")
    .toInt(),

  validateRequest,
];

const updatePhaseValidation = [
  param("phaseId")
    .notEmpty()
    .withMessage("Phase ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Phase ID must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Phase ID can only contain letters and numbers")
    .trim()
    .escape(),

  body("title")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Phase title must be between 1 and 100 characters")
    .trim()
    .escape(),

  body("description")
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage("Phase description must be between 1 and 500 characters")
    .trim()
    .escape(),

  body("icon")
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage("Icon name must be between 1 and 50 characters")
    .trim()
    .escape(),

  body("color")
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage(
      "Please provide a valid hex color code (e.g., #FF0000 or #F00)"
    )
    .trim(),

  body("order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer")
    .toInt(),

  validateRequest,
];

const phaseIdValidation = [
  param("phaseId")
    .notEmpty()
    .withMessage("Phase ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Phase ID must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Phase ID can only contain letters and numbers")
    .trim()
    .escape(),

  validateRequest,
];

module.exports = {
  createPhaseValidation,
  updatePhaseValidation,
  phaseIdValidation,
};
