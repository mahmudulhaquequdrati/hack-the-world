import { colorOptions } from "../constants/phaseConstants";

/**
 * Validates phase data before submission
 * @param {Object} phaseData - The phase data to validate
 * @param {Array} phases - All existing phases for order calculation
 * @param {Object} editingPhase - Phase being edited (null for new phases)
 * @returns {Object} { isValid, errors, validatedData }
 */
export const validatePhaseData = (phaseData, phases = [], editingPhase = null) => {
  const errors = [];
  const validatedData = { ...phaseData };

  // Validate required fields
  const requiredFieldErrors = validateRequiredFields(phaseData);
  errors.push(...requiredFieldErrors);

  // Validate color format
  const colorError = validateColorFormat(phaseData.color);
  if (colorError) errors.push(colorError);

  // Calculate and validate order
  const calculatedOrder = calculateOrder(phases, editingPhase, phaseData.order);
  validatedData.order = calculatedOrder;

  return {
    isValid: errors.length === 0,
    errors,
    validatedData
  };
};

/**
 * Validates required fields
 * @param {Object} phaseData - The phase data to validate
 * @returns {Array} Array of error messages
 */
export const validateRequiredFields = (phaseData) => {
  const errors = [];

  if (!phaseData.title?.trim()) {
    errors.push("Title is required");
  }

  if (!phaseData.description?.trim()) {
    errors.push("Description is required");
  }

  if (!phaseData.icon?.trim()) {
    errors.push("Icon is required");
  }

  return errors;
};

/**
 * Validates color format against available options
 * @param {string} color - The color to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateColorFormat = (color) => {
  if (!colorOptions.includes(color)) {
    return "Please enter a valid Tailwind color name";
  }
  return null;
};

/**
 * Calculates the appropriate order for a phase
 * @param {Array} phases - All existing phases
 * @param {Object} editingPhase - Phase being edited (null for new phases)
 * @param {string|number} formOrder - Order from form input
 * @returns {number} Calculated order value
 */
export const calculateOrder = (phases, editingPhase, formOrder) => {
  if (editingPhase) {
    // For editing, use form data if provided, otherwise keep existing order
    return formOrder && formOrder.toString().trim()
      ? parseInt(formOrder)
      : editingPhase.order;
  } else {
    // For new phases, set order to be the next available number
    const maxOrder = phases.length > 0 
      ? Math.max(...phases.map((p) => p.order || 0)) 
      : 0;
    return maxOrder + 1;
  }
};

/**
 * Validates order uniqueness and range
 * @param {number} order - The order to validate
 * @param {Array} phases - All existing phases
 * @param {Object} editingPhase - Phase being edited (null for new phases)
 * @returns {string|null} Error message or null if valid
 */
export const validateOrder = (order, phases, editingPhase) => {
  if (order < 1) {
    return "Order must be at least 1";
  }

  // Check for duplicate orders (excluding current phase if editing)
  const duplicatePhase = phases.find(phase => 
    phase.order === order && 
    (!editingPhase || phase._id !== editingPhase._id)
  );

  if (duplicatePhase) {
    return `Order ${order} is already used by "${duplicatePhase.title}"`;
  }

  return null;
};