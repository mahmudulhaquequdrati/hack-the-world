import { colorOptions, difficultyLevels } from "../constants/moduleConstants";

/**
 * Validates module data before submission
 * @param {Object} moduleData - The module data to validate
 * @param {Array} modules - All existing modules for order calculation
 * @param {Object} editingModule - Module being edited (null for new modules)
 * @returns {Object} { isValid, errors, validatedData }
 */
export const validateModuleData = (moduleData, modules = [], editingModule = null) => {
  const errors = [];
  const validatedData = { ...moduleData };

  // Validate required fields
  const requiredFieldErrors = validateRequiredFields(moduleData);
  errors.push(...requiredFieldErrors);

  // Validate color format
  const colorError = validateColorFormat(moduleData.color);
  if (colorError) errors.push(colorError);

  // Validate difficulty level
  const difficultyError = validateDifficultyLevel(moduleData.difficulty);
  if (difficultyError) errors.push(difficultyError);

  // Validate phase selection
  const phaseError = validatePhaseId(moduleData.phaseId);
  if (phaseError) errors.push(phaseError);

  // Calculate and validate order
  const calculatedOrder = calculateModuleOrder(modules, editingModule, moduleData);
  validatedData.order = calculatedOrder;

  // Validate arrays (topics, prerequisites, learningOutcomes)
  const arrayErrors = validateArrayFields(moduleData);
  errors.push(...arrayErrors);

  return {
    isValid: errors.length === 0,
    errors,
    validatedData
  };
};

/**
 * Validates required fields for modules
 * @param {Object} moduleData - The module data to validate
 * @returns {Array} Array of error messages
 */
export const validateRequiredFields = (moduleData) => {
  const errors = [];

  if (!moduleData.phaseId?.trim()) {
    errors.push("Phase selection is required");
  }

  if (!moduleData.title?.trim()) {
    errors.push("Title is required");
  }

  if (!moduleData.description?.trim()) {
    errors.push("Description is required");
  }

  if (!moduleData.difficulty?.trim()) {
    errors.push("Difficulty level is required");
  }

  return errors;
};

/**
 * Validates color format against available options
 * @param {string} color - The color to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateColorFormat = (color) => {
  if (!color || !colorOptions.includes(color)) {
    return "Please select a valid color option";
  }
  return null;
};

/**
 * Validates difficulty level against available options
 * @param {string} difficulty - The difficulty to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateDifficultyLevel = (difficulty) => {
  if (!difficulty || !difficultyLevels.includes(difficulty)) {
    return "Please select a valid difficulty level";
  }
  return null;
};

/**
 * Validates phase ID is provided
 * @param {string} phaseId - The phase ID to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePhaseId = (phaseId) => {
  if (!phaseId?.trim()) {
    return "Phase selection is required";
  }
  return null;
};

/**
 * Calculates the appropriate order for a module within its phase
 * @param {Array} modules - All existing modules
 * @param {Object} editingModule - Module being edited (null for new modules)
 * @param {Object} moduleData - Module data with phaseId
 * @returns {number} Calculated order value
 */
export const calculateModuleOrder = (modules, editingModule, moduleData) => {
  if (editingModule) {
    // For editing, keep existing order
    return editingModule.order;
  } else {
    // For new modules, find max order in the selected phase and add 1
    const phaseModules = modules.filter(m => m.phaseId === moduleData.phaseId);
    const maxOrder = phaseModules.length > 0
      ? Math.max(...phaseModules.map(m => m.order || 0))
      : 0;
    return maxOrder + 1;
  }
};

/**
 * Validates array fields (topics, prerequisites, learningOutcomes)
 * @param {Object} moduleData - The module data to validate
 * @returns {Array} Array of error messages
 */
export const validateArrayFields = (moduleData) => {
  const errors = [];

  // Validate topics array
  if (moduleData.topics && !Array.isArray(moduleData.topics)) {
    errors.push("Topics must be an array");
  }

  // Validate prerequisites array
  if (moduleData.prerequisites && !Array.isArray(moduleData.prerequisites)) {
    errors.push("Prerequisites must be an array");
  }

  // Validate learning outcomes array
  if (moduleData.learningOutcomes && !Array.isArray(moduleData.learningOutcomes)) {
    errors.push("Learning outcomes must be an array");
  }

  return errors;
};

/**
 * Validates bulk operation data
 * @param {string} operation - The bulk operation type
 * @param {Object} bulkData - The bulk operation data
 * @param {Array} selectedModules - Selected module IDs
 * @returns {Object} { isValid, errors }
 */
export const validateBulkOperation = (operation, bulkData, selectedModules) => {
  const errors = [];

  if (!selectedModules || selectedModules.length === 0) {
    errors.push("Please select modules to update");
  }

  switch (operation) {
    case "updatePhase":
      if (!bulkData.phaseId?.trim()) {
        errors.push("Please select a phase for bulk update");
      }
      break;

    case "updateDifficulty":
      if (!bulkData.difficulty?.trim()) {
        errors.push("Please select a difficulty level for bulk update");
      }
      break;

    case "updateColor":
      if (!bulkData.color?.trim()) {
        errors.push("Please select a color for bulk update");
      }
      break;

    case "updateStatus":
      if (typeof bulkData.isActive !== "boolean") {
        errors.push("Please select a status for bulk update");
      }
      break;

    default:
      errors.push("Invalid bulk operation type");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates icon name
 * @param {string} icon - The icon name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateIcon = (icon) => {
  if (!icon?.trim()) {
    return null; // Icon is optional, will default to "Shield"
  }
  
  // Basic validation - just ensure it's a string
  if (typeof icon !== "string") {
    return "Icon must be a valid string";
  }

  return null;
};

/**
 * Normalizes and validates color value
 * @param {string} color - The color value to normalize
 * @returns {string} Normalized color value
 */
export const normalizeColor = (color) => {
  const colorValue = color?.trim() || "green";
  
  // Validate color is a valid option
  if (!colorOptions.includes(colorValue)) {
    console.warn("Invalid color name detected, using default:", colorValue);
    return "green";
  }
  
  return colorValue;
};

/**
 * Validates form data completeness for submission
 * @param {Object} formData - Form data to validate
 * @returns {Object} { isValid, errors, missingFields }
 */
export const validateFormCompleteness = (formData) => {
  const errors = [];
  const missingFields = [];

  const requiredFields = [
    { key: 'phaseId', name: 'Phase' },
    { key: 'title', name: 'Title' },
    { key: 'description', name: 'Description' },
    { key: 'difficulty', name: 'Difficulty' }
  ];

  requiredFields.forEach(field => {
    if (!formData[field.key]?.trim()) {
      missingFields.push(field.name);
      errors.push(`${field.name} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    missingFields
  };
};