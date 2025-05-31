const { validationResult } = require("express-validator");

// Import validation rules
const {
  createModuleValidation,
  updateModuleValidation,
  reorderModulesValidation,
  getModuleValidation,
  getModulesByPhaseValidation,
} = require("./validation/moduleValidation");

/**
 * Validation middleware to handle express-validator errors
 * Should be used after validation chain
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      msg: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: formattedErrors,
    });
  }

  next();
};

/**
 * Get validation rules based on validation type
 * @param {string} validationType - Type of validation to apply
 * @returns {Array} Array of validation middleware
 */
const validateRequest = (validationType) => {
  const validations = {
    // Module validations
    createModule: createModuleValidation,
    updateModule: updateModuleValidation,
    reorderModules: reorderModulesValidation,
    getModule: getModuleValidation,
    getModulesByPhase: getModulesByPhaseValidation,

    // Add more validation types here as needed
    // Example: createUser: createUserValidation,
  };

  const validation = validations[validationType];

  if (!validation) {
    throw new Error(`Validation type '${validationType}' not found`);
  }

  return validation;
};

module.exports = {
  validateRequest,
  handleValidationErrors,
};
