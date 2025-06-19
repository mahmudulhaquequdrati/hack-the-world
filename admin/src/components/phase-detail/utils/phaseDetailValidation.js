/**
 * Validation utilities for PhaseDetailView component
 */

/**
 * Validate phase ID parameter
 * @param {string} phaseId - Phase ID to validate
 * @returns {Object} Validation result
 */
export const validatePhaseId = (phaseId) => {
  const result = {
    isValid: false,
    error: null,
    sanitized: null,
  };

  if (!phaseId) {
    result.error = "Phase ID is required";
    return result;
  }

  if (typeof phaseId !== "string") {
    result.error = "Phase ID must be a string";
    return result;
  }

  // Basic MongoDB ObjectId validation (24 hex characters)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(phaseId)) {
    result.error = "Invalid phase ID format";
    return result;
  }

  result.isValid = true;
  result.sanitized = phaseId.toLowerCase();
  return result;
};

/**
 * Validate module data structure
 * @param {Object} module - Module data to validate
 * @returns {Object} Validation result
 */
export const validateModuleData = (module) => {
  const result = {
    isValid: false,
    errors: [],
    sanitized: null,
  };

  if (!module || typeof module !== "object") {
    result.errors.push("Module must be an object");
    return result;
  }

  const errors = [];

  // Required fields
  if (!module.id) errors.push("Module ID is required");
  if (!module.title) errors.push("Module title is required");
  if (!module.phaseId) errors.push("Module phase ID is required");

  // Optional field validation
  if (
    module.order !== undefined &&
    (typeof module.order !== "number" || module.order < 0)
  ) {
    errors.push("Module order must be a non-negative number");
  }

  if (
    module.difficulty &&
    !["beginner", "intermediate", "advanced", "expert"].includes(
      module.difficulty
    )
  ) {
    errors.push(
      "Module difficulty must be one of: beginner, intermediate, advanced, expert"
    );
  }

  if (
    module.estimatedHours !== undefined &&
    (typeof module.estimatedHours !== "number" || module.estimatedHours < 0)
  ) {
    errors.push("Estimated hours must be a non-negative number");
  }

  // Color can be hex, CSS color name, or any valid CSS color value
  if (module.color && typeof module.color !== "string") {
    errors.push("Module color must be a string");
  }

  if (errors.length > 0) {
    result.errors = errors;
    return result;
  }

  result.isValid = true;
  result.sanitized = {
    id: module.id,
    title: module.title.trim(),
    description: module.description?.trim() || "",
    phaseId: module.phaseId,
    order: module.order || 0,
    difficulty: module.difficulty || "beginner",
    estimatedHours: module.estimatedHours || 0,
    color: module.color || "green",
    icon: module.icon || "CubeIcon",
    createdAt: module.createdAt,
    updatedAt: module.updatedAt,
  };

  return result;
};

/**
 * Validate phase data structure
 * @param {Object} phase - Phase data to validate
 * @returns {Object} Validation result
 */
export const validatePhaseData = (phase) => {
  const result = {
    isValid: false,
    errors: [],
    sanitized: null,
  };

  if (!phase || typeof phase !== "object") {
    result.errors.push("Phase must be an object");
    return result;
  }

  const errors = [];

  // Required fields
  if (!phase.id) errors.push("Phase ID is required");
  if (!phase.title) errors.push("Phase title is required");

  // Optional field validation
  if (
    phase.order !== undefined &&
    (typeof phase.order !== "number" || phase.order < 0)
  ) {
    errors.push("Phase order must be a non-negative number");
  }

  // Color can be hex, CSS color name, or any valid CSS color value
  if (phase.color && typeof phase.color !== "string") {
    errors.push("Phase color must be a string");
  }

  if (errors.length > 0) {
    result.errors = errors;
    return result;
  }

  result.isValid = true;
  result.sanitized = {
    id: phase.id,
    title: phase.title.trim(),
    description: phase.description?.trim() || "",
    order: phase.order || 0,
    color: phase.color || "green",
    icon: phase.icon || "CubeIcon",
    createdAt: phase.createdAt,
    updatedAt: phase.updatedAt,
  };

  return result;
};

/**
 * Sanitize phase data for safe use
 * @param {Object} phase - Raw phase data
 * @returns {Object} Sanitized phase data
 */
export const sanitizePhaseData = (phase) => {
  if (!phase) return null;

  return {
    id: phase.id,
    title: phase.title?.trim() || "",
    description: phase.description?.trim() || "",
    order: Math.max(0, parseInt(phase.order) || 0),
    color: phase.color || "green",
    icon: phase.icon || "CubeIcon",
    createdAt: phase.createdAt,
    updatedAt: phase.updatedAt,
  };
};

/**
 * Sanitize modules array for safe use
 * @param {Array} modules - Raw modules array
 * @returns {Array} Sanitized modules array
 */
export const sanitizeModulesData = (modules) => {
  if (!Array.isArray(modules)) return [];

  return modules.map((module) => ({
    id: module.id,
    title: module.title?.trim() || "",
    description: module.description?.trim() || "",
    phaseId: module.phaseId,
    order: Math.max(0, parseInt(module.order) || 0),
    difficulty: ["beginner", "intermediate", "advanced", "expert"].includes(
      module.difficulty.toLowerCase()
    )
      ? module.difficulty.toLowerCase()
      : "beginner",
    estimatedHours: Math.max(0, parseFloat(module.estimatedHours) || 0),
    color: module.color || "green",
    icon: module.icon || "CubeIcon",
    createdAt: module.createdAt,
    updatedAt: module.updatedAt,
  }));
};

/**
 * Validate API response structure
 * @param {Object} response - API response to validate
 * @param {string} type - Expected response type ('phase' or 'modules')
 * @returns {Object} Validation result
 */
export const validateApiResponse = (response, type) => {
  const result = {
    isValid: false,
    error: null,
    data: null,
  };

  if (!response) {
    result.error = "Response is required";
    return result;
  }

  if (!response.data) {
    result.error = "Response data is required";
    return result;
  }

  switch (type) {
    case "phase":
      const phaseValidation = validatePhaseData(response.data);
      if (!phaseValidation.isValid) {
        result.error = `Invalid phase data: ${phaseValidation.errors.join(
          ", "
        )}`;
        return result;
      }
      result.data = phaseValidation.sanitized;
      break;

    case "modules":
      if (!Array.isArray(response.data)) {
        result.error = "Modules response must be an array";
        return result;
      }
      result.data = sanitizeModulesData(response.data);
      break;

    default:
      result.error = `Unknown response type: ${type}`;
      return result;
  }

  result.isValid = true;
  return result;
};
