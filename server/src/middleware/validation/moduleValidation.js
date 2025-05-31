const { body, param, validationResult } = require("express-validator");

/**
 * Validation rules for creating a new module
 */
const createModuleValidation = [
  body("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Module ID must be between 2 and 50 characters")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Module ID can only contain lowercase letters, numbers, and hyphens"
    )
    .custom((value) => {
      // Remove consecutive hyphens and leading/trailing hyphens
      const cleaned = value.replace(/-+/g, "-").replace(/^-|-$/g, "");
      if (cleaned !== value) {
        throw new Error(
          "Module ID cannot have consecutive, leading, or trailing hyphens"
        );
      }
      return true;
    }),

  body("phaseId")
    .notEmpty()
    .withMessage("Phase ID is required")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Phase ID must be one of: beginner, intermediate, advanced"),

  body("title")
    .notEmpty()
    .withMessage("Module title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Module title must be between 3 and 100 characters")
    .trim(),

  body("description")
    .notEmpty()
    .withMessage("Module description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Module description must be between 10 and 500 characters")
    .trim(),

  body("icon")
    .notEmpty()
    .withMessage("Module icon is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Icon name must be between 2 and 50 characters")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Icon name can only contain letters and numbers"),

  body("duration")
    .notEmpty()
    .withMessage("Module duration is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Duration must be between 2 and 50 characters")
    .trim(),

  body("difficulty")
    .notEmpty()
    .withMessage("Module difficulty is required")
    .isIn(["Beginner", "Intermediate", "Advanced", "Expert"])
    .withMessage(
      "Difficulty must be one of: Beginner, Intermediate, Advanced, Expert"
    ),

  body("color")
    .notEmpty()
    .withMessage("Module color is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Color must be between 3 and 50 characters")
    .trim(),

  body("order")
    .notEmpty()
    .withMessage("Module order is required")
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),

  body("path")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Path cannot exceed 100 characters")
    .trim(),

  body("enrollPath")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Enroll path cannot exceed 100 characters")
    .trim(),

  body("topics")
    .optional()
    .isArray()
    .withMessage("Topics must be an array")
    .custom((topics) => {
      if (topics && topics.length > 0) {
        for (const topic of topics) {
          if (typeof topic !== "string" || topic.trim().length === 0) {
            throw new Error("Each topic must be a non-empty string");
          }
          if (topic.length > 100) {
            throw new Error("Each topic cannot exceed 100 characters");
          }
        }
      }
      return true;
    }),

  body("prerequisites")
    .optional()
    .isArray()
    .withMessage("Prerequisites must be an array"),

  body("learningOutcomes")
    .optional()
    .isArray()
    .withMessage("Learning outcomes must be an array"),
];

/**
 * Validation rules for updating a module
 */
const updateModuleValidation = [
  param("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Module ID can only contain lowercase letters, numbers, and hyphens"
    ),

  body("moduleId")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Module ID must be between 2 and 50 characters")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Module ID can only contain lowercase letters, numbers, and hyphens"
    ),

  body("phaseId")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Phase ID must be one of: beginner, intermediate, advanced"),

  body("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Module title must be between 3 and 100 characters")
    .trim(),

  body("description")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Module description must be between 10 and 500 characters")
    .trim(),

  body("icon")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Icon name must be between 2 and 50 characters")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Icon name can only contain letters and numbers"),

  body("duration")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Duration must be between 2 and 50 characters")
    .trim(),

  body("difficulty")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced", "Expert"])
    .withMessage(
      "Difficulty must be one of: Beginner, Intermediate, Advanced, Expert"
    ),

  body("color")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Color must be between 3 and 50 characters")
    .trim(),

  body("order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),

  body("path")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Path cannot exceed 100 characters")
    .trim(),

  body("enrollPath")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Enroll path cannot exceed 100 characters")
    .trim(),

  body("topics")
    .optional()
    .isArray()
    .withMessage("Topics must be an array")
    .custom((topics) => {
      if (topics && topics.length > 0) {
        for (const topic of topics) {
          if (typeof topic !== "string" || topic.trim().length === 0) {
            throw new Error("Each topic must be a non-empty string");
          }
          if (topic.length > 100) {
            throw new Error("Each topic cannot exceed 100 characters");
          }
        }
      }
      return true;
    }),

  body("prerequisites")
    .optional()
    .isArray()
    .withMessage("Prerequisites must be an array"),

  body("learningOutcomes")
    .optional()
    .isArray()
    .withMessage("Learning outcomes must be an array"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

/**
 * Validation rules for module reordering
 */
const reorderModulesValidation = [
  param("phaseId")
    .notEmpty()
    .withMessage("Phase ID is required")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Phase ID must be one of: beginner, intermediate, advanced"),

  body("moduleOrders")
    .notEmpty()
    .withMessage("Module orders array is required")
    .isArray({ min: 1 })
    .withMessage("Module orders must be a non-empty array"),

  body("moduleOrders.*.moduleId")
    .notEmpty()
    .withMessage("Module ID is required for each item")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Module ID can only contain lowercase letters, numbers, and hyphens"
    ),

  body("moduleOrders.*.order")
    .notEmpty()
    .withMessage("Order is required for each item")
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),
];

/**
 * Parameter validation for getting single module
 */
const getModuleValidation = [
  param("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Module ID can only contain lowercase letters, numbers, and hyphens"
    ),
];

/**
 * Parameter validation for getting modules by phase
 */
const getModulesByPhaseValidation = [
  param("phaseId")
    .notEmpty()
    .withMessage("Phase ID is required")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Phase ID must be one of: beginner, intermediate, advanced"),
];

/**
 * Generic validation error handler
 */
const handleValidationErrors = (req, res, next) => {
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

module.exports = {
  createModuleValidation: [...createModuleValidation, handleValidationErrors],
  updateModuleValidation: [...updateModuleValidation, handleValidationErrors],
  reorderModulesValidation: [
    ...reorderModulesValidation,
    handleValidationErrors,
  ],
  getModuleValidation: [...getModuleValidation, handleValidationErrors],
  getModulesByPhaseValidation: [
    ...getModulesByPhaseValidation,
    handleValidationErrors,
  ],
};
