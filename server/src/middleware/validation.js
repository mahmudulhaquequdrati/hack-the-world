const { validationResult } = require("express-validator");

// Import validation rules
const {
  createModuleValidation,
  updateModuleValidation,
  reorderModulesValidation,
  getModuleValidation,
  getModulesByPhaseValidation,
} = require("./validation/moduleValidation");

const {
  createContentValidation: _createContentValidation,
  updateContentValidation: _updateContentValidation,
  getContentValidation: _getContentValidation,
  getContentByModuleValidation: _getContentByModuleValidation,
  getContentByTypeValidation: _getContentByTypeValidation,
  getAllContentValidation: _getAllContentValidation,
  deleteContentValidation: _deleteContentValidation,
} = require("./validation/contentValidation");

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

// Add handleValidationErrors to content validation arrays
const createContentValidation = [
  ..._createContentValidation,
  handleValidationErrors,
];
const updateContentValidation = [
  ..._updateContentValidation,
  handleValidationErrors,
];
const getContentValidation = [..._getContentValidation, handleValidationErrors];
const getContentByModuleValidation = [
  ..._getContentByModuleValidation,
  handleValidationErrors,
];
const getContentByTypeValidation = [
  ..._getContentByTypeValidation,
  handleValidationErrors,
];
const getAllContentValidation = [
  ..._getAllContentValidation,
  handleValidationErrors,
];
const deleteContentValidation = [
  ..._deleteContentValidation,
  handleValidationErrors,
];

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

    // Content validations
    createContent: createContentValidation,
    updateContent: updateContentValidation,
    getContent: getContentValidation,
    getContentByModule: getContentByModuleValidation,
    getContentByType: getContentByTypeValidation,
    getAllContent: getAllContentValidation,
    deleteContent: deleteContentValidation,

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
