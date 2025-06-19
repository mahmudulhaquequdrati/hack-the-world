/**
 * Validation utilities for ModuleDetailView component
 */

/**
 * Validate module ID format and existence
 * @param {string} moduleId - Module ID to validate
 * @returns {Object} Validation result
 */
export const validateModuleId = (moduleId) => {
  if (!moduleId) {
    return {
      isValid: false,
      error: "Module ID is required"
    };
  }

  if (typeof moduleId !== 'string') {
    return {
      isValid: false,
      error: "Module ID must be a string"
    };
  }

  if (moduleId.trim().length === 0) {
    return {
      isValid: false,
      error: "Module ID cannot be empty"
    };
  }

  // Basic MongoDB ObjectId validation (24 hex characters)
  if (!/^[0-9a-fA-F]{24}$/.test(moduleId)) {
    return {
      isValid: false,
      error: "Invalid Module ID format"
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validate module data structure and required fields
 * @param {Object} module - Module data to validate
 * @returns {Object} Validation result
 */
export const validateModuleData = (module) => {
  if (!module) {
    return {
      isValid: false,
      error: "Module data is required",
      details: []
    };
  }

  const errors = [];

  // Required fields validation
  if (!module.id && !module._id) {
    errors.push("Module ID is required");
  }

  if (!module.title || typeof module.title !== 'string' || module.title.trim().length === 0) {
    errors.push("Module title is required and must be a valid string");
  }

  if (!module.description || typeof module.description !== 'string') {
    errors.push("Module description is required and must be a valid string");
  }

  // Optional field validation
  if (module.difficulty && !['beginner', 'intermediate', 'advanced', 'expert'].includes(module.difficulty)) {
    errors.push("Module difficulty must be one of: beginner, intermediate, advanced, expert");
  }

  if (module.estimatedHours && (typeof module.estimatedHours !== 'number' || module.estimatedHours < 0)) {
    errors.push("Estimated hours must be a positive number");
  }

  if (module.order && (typeof module.order !== 'number' || module.order < 0)) {
    errors.push("Module order must be a positive number");
  }

  if (module.color && typeof module.color !== 'string') {
    errors.push("Module color must be a string");
  }

  if (module.icon && typeof module.icon !== 'string') {
    errors.push("Module icon must be a string");
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? `Module validation failed: ${errors[0]}` : null,
    details: errors
  };
};

/**
 * Validate content data structure
 * @param {Array} content - Content array to validate
 * @returns {Object} Validation result
 */
export const validateContentData = (content) => {
  if (!Array.isArray(content)) {
    return {
      isValid: false,
      error: "Content must be an array",
      details: []
    };
  }

  const errors = [];

  content.forEach((item, index) => {
    if (!item) {
      errors.push(`Content item at index ${index} is null or undefined`);
      return;
    }

    if (!item.id && !item._id) {
      errors.push(`Content item at index ${index} is missing ID`);
    }

    if (!item.title || typeof item.title !== 'string') {
      errors.push(`Content item at index ${index} is missing or has invalid title`);
    }

    if (!item.type || typeof item.type !== 'string') {
      errors.push(`Content item at index ${index} is missing or has invalid type`);
    }

    if (item.duration && (typeof item.duration !== 'number' || item.duration < 0)) {
      errors.push(`Content item at index ${index} has invalid duration`);
    }

    if (item.order && (typeof item.order !== 'number' || item.order < 0)) {
      errors.push(`Content item at index ${index} has invalid order`);
    }
  });

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? `Content validation failed: ${errors[0]}` : null,
    details: errors
  };
};

/**
 * Validate content sections structure
 * @param {Object} contentBySections - Content sections to validate
 * @returns {Object} Validation result
 */
export const validateContentSections = (contentBySections) => {
  if (!contentBySections || typeof contentBySections !== 'object') {
    return {
      isValid: false,
      error: "Content sections must be an object",
      details: []
    };
  }

  const errors = [];

  Object.entries(contentBySections).forEach(([sectionName, sectionContent]) => {
    if (typeof sectionName !== 'string' || sectionName.trim().length === 0) {
      errors.push(`Section name "${sectionName}" is invalid`);
      return;
    }

    if (!Array.isArray(sectionContent)) {
      errors.push(`Section "${sectionName}" content must be an array`);
      return;
    }

    const sectionValidation = validateContentData(sectionContent);
    if (!sectionValidation.isValid) {
      errors.push(`Section "${sectionName}": ${sectionValidation.error}`);
    }
  });

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? `Content sections validation failed: ${errors[0]}` : null,
    details: errors
  };
};

/**
 * Validate phase data when available
 * @param {Object} phase - Phase data to validate
 * @returns {Object} Validation result
 */
export const validatePhaseData = (phase) => {
  if (!phase) {
    // Phase is optional, so null/undefined is valid
    return {
      isValid: true,
      error: null,
      details: []
    };
  }

  const errors = [];

  if (!phase.id && !phase._id) {
    errors.push("Phase ID is required when phase data is provided");
  }

  if (!phase.title || typeof phase.title !== 'string' || phase.title.trim().length === 0) {
    errors.push("Phase title is required and must be a valid string");
  }

  if (phase.description && typeof phase.description !== 'string') {
    errors.push("Phase description must be a string when provided");
  }

  if (phase.color && typeof phase.color !== 'string') {
    errors.push("Phase color must be a string when provided");
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? `Phase validation failed: ${errors[0]}` : null,
    details: errors
  };
};

/**
 * Sanitize module data by removing potentially harmful content
 * @param {Object} module - Module data to sanitize
 * @returns {Object} Sanitized module data
 */
export const sanitizeModuleData = (module) => {
  if (!module) return null;

  return {
    id: module.id || module._id,
    title: typeof module.title === 'string' ? module.title.trim() : '',
    description: typeof module.description === 'string' ? module.description.trim() : '',
    difficulty: module.difficulty && ['beginner', 'intermediate', 'advanced', 'expert'].includes(module.difficulty) 
      ? module.difficulty 
      : null,
    estimatedHours: typeof module.estimatedHours === 'number' && module.estimatedHours >= 0 
      ? module.estimatedHours 
      : null,
    order: typeof module.order === 'number' && module.order >= 0 
      ? module.order 
      : null,
    color: typeof module.color === 'string' ? module.color.trim() : null,
    icon: typeof module.icon === 'string' ? module.icon.trim() : null,
    phaseId: module.phaseId,
    isActive: typeof module.isActive === 'boolean' ? module.isActive : true,
    createdAt: module.createdAt,
    updatedAt: module.updatedAt,
    // Include phase data if available
    phase: module.phase ? sanitizePhaseData(module.phase) : null,
  };
};

/**
 * Sanitize phase data
 * @param {Object} phase - Phase data to sanitize
 * @returns {Object} Sanitized phase data
 */
export const sanitizePhaseData = (phase) => {
  if (!phase) return null;

  return {
    id: phase.id || phase._id,
    title: typeof phase.title === 'string' ? phase.title.trim() : '',
    description: typeof phase.description === 'string' ? phase.description.trim() : '',
    color: typeof phase.color === 'string' ? phase.color.trim() : null,
    icon: typeof phase.icon === 'string' ? phase.icon.trim() : null,
    order: typeof phase.order === 'number' && phase.order >= 0 ? phase.order : null,
    isActive: typeof phase.isActive === 'boolean' ? phase.isActive : true,
  };
};

/**
 * Sanitize content data array
 * @param {Array} content - Content array to sanitize
 * @returns {Array} Sanitized content array
 */
export const sanitizeContentData = (content) => {
  if (!Array.isArray(content)) return [];

  return content
    .filter(item => item && (item.id || item._id) && item.title)
    .map(item => ({
      id: item.id || item._id,
      title: typeof item.title === 'string' ? item.title.trim() : '',
      description: typeof item.description === 'string' ? item.description.trim() : '',
      type: typeof item.type === 'string' ? item.type.toLowerCase().trim() : 'document',
      duration: typeof item.duration === 'number' && item.duration >= 0 ? item.duration : 0,
      order: typeof item.order === 'number' && item.order >= 0 ? item.order : null,
      section: typeof item.section === 'string' ? item.section.trim() : 'General',
      isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
      moduleId: item.moduleId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
};

/**
 * Comprehensive validation for all module detail data
 * @param {Object} data - Complete module detail data
 * @returns {Object} Comprehensive validation result
 */
export const validateAllModuleDetailData = (data) => {
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Validate module data
  if (data.module) {
    const moduleValidation = validateModuleData(data.module);
    if (!moduleValidation.isValid) {
      results.isValid = false;
      results.errors.push(`Module: ${moduleValidation.error}`);
    }
  } else {
    results.isValid = false;
    results.errors.push("Module data is missing");
  }

  // Validate phase data (optional)
  if (data.phase) {
    const phaseValidation = validatePhaseData(data.phase);
    if (!phaseValidation.isValid) {
      results.warnings.push(`Phase: ${phaseValidation.error}`);
    }
  }

  // Validate content data
  if (data.content) {
    const contentValidation = validateContentData(data.content);
    if (!contentValidation.isValid) {
      results.warnings.push(`Content: ${contentValidation.error}`);
    }
  }

  // Validate content sections
  if (data.contentBySections) {
    const sectionsValidation = validateContentSections(data.contentBySections);
    if (!sectionsValidation.isValid) {
      results.warnings.push(`Content Sections: ${sectionsValidation.error}`);
    }
  }

  return results;
};