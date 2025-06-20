/**
 * Validation utilities for ContentDetailView component
 */

/**
 * Validate content ID format and existence
 * @param {string} contentId - Content ID to validate
 * @returns {Object} Validation result
 */
export const validateContentId = (contentId) => {
  if (!contentId) {
    return {
      isValid: false,
      error: "Content ID is required",
    };
  }

  if (typeof contentId !== "string") {
    return {
      isValid: false,
      error: "Content ID must be a string",
    };
  }

  if (contentId.trim().length === 0) {
    return {
      isValid: false,
      error: "Content ID cannot be empty",
    };
  }

  // Basic MongoDB ObjectId validation (24 hex characters)
  if (!/^[0-9a-fA-F]{24}$/.test(contentId)) {
    return {
      isValid: false,
      error: "Invalid Content ID format",
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate content data structure and required fields
 * @param {Object} content - Content data to validate
 * @returns {Object} Validation result
 */
export const validateContentData = (content) => {
  if (!content) {
    return {
      isValid: false,
      error: "Content data is required",
      details: [],
    };
  }

  const errors = [];

  // Required fields validation
  if (!content._id) {
    errors.push("Content ID is required");
  }

  if (
    !content.title ||
    typeof content.title !== "string" ||
    content.title.trim().length === 0
  ) {
    errors.push("Content title is required and must be a valid string");
  }

  if (!content.description || typeof content.description !== "string") {
    errors.push("Content description is required and must be a valid string");
  }

  if (!content.type || typeof content.type !== "string") {
    errors.push("Content type is required and must be a valid string");
  }

  // Type validation
  const validTypes = ["video", "lab", "game", "document"];
  if (content.type && !validTypes.includes(content.type.toLowerCase())) {
    errors.push(`Content type must be one of: ${validTypes.join(", ")}`);
  }

  // Optional field validation
  if (
    content.duration &&
    (typeof content.duration !== "number" || content.duration < 0)
  ) {
    errors.push("Duration must be a positive number");
  }

  if (content.order && (typeof content.order !== "number" || content.order < 0)) {
    errors.push("Content order must be a positive number");
  }

  if (content.section && typeof content.section !== "string") {
    errors.push("Content section must be a string");
  }

  if (content.url && typeof content.url !== "string") {
    errors.push("Content URL must be a string");
  }

  // Validate metadata if present
  if (content.metadata) {
    const metadataErrors = validateContentMetadata(content.metadata);
    errors.push(...metadataErrors);
  }

  // Validate resources if present
  if (content.resources && !Array.isArray(content.resources)) {
    errors.push("Content resources must be an array");
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? `Content validation failed: ${errors[0]}` : null,
    details: errors,
  };
};

/**
 * Validate content metadata structure
 * @param {Object} metadata - Metadata object to validate
 * @returns {Array} Array of validation errors
 */
export const validateContentMetadata = (metadata) => {
  const errors = [];

  if (typeof metadata !== "object" || metadata === null) {
    return ["Metadata must be an object"];
  }

  // Validate difficulty
  if (metadata.difficulty) {
    const validDifficulties = ["beginner", "intermediate", "advanced", "expert"];
    if (!validDifficulties.includes(metadata.difficulty.toLowerCase())) {
      errors.push(
        `Metadata difficulty must be one of: ${validDifficulties.join(", ")}`
      );
    }
  }

  // Validate estimatedTime
  if (metadata.estimatedTime && typeof metadata.estimatedTime !== "string") {
    errors.push("Metadata estimatedTime must be a string");
  }

  // Validate tags
  if (metadata.tags && !Array.isArray(metadata.tags)) {
    errors.push("Metadata tags must be an array");
  } else if (metadata.tags) {
    metadata.tags.forEach((tag, index) => {
      if (typeof tag !== "string") {
        errors.push(`Metadata tag at index ${index} must be a string`);
      }
    });
  }

  // Validate prerequisites
  if (metadata.prerequisites && !Array.isArray(metadata.prerequisites)) {
    errors.push("Metadata prerequisites must be an array");
  } else if (metadata.prerequisites) {
    metadata.prerequisites.forEach((prereq, index) => {
      if (typeof prereq !== "string") {
        errors.push(`Metadata prerequisite at index ${index} must be a string`);
      }
    });
  }

  // Validate tools
  if (metadata.tools && !Array.isArray(metadata.tools)) {
    errors.push("Metadata tools must be an array");
  } else if (metadata.tools) {
    metadata.tools.forEach((tool, index) => {
      if (typeof tool !== "string") {
        errors.push(`Metadata tool at index ${index} must be a string`);
      }
    });
  }

  // Validate objectives
  if (metadata.objectives && !Array.isArray(metadata.objectives)) {
    errors.push("Metadata objectives must be an array");
  } else if (metadata.objectives) {
    metadata.objectives.forEach((objective, index) => {
      if (typeof objective !== "string") {
        errors.push(`Metadata objective at index ${index} must be a string`);
      }
    });
  }

  return errors;
};

/**
 * Validate module data when available for content
 * @param {Object} module - Module data to validate
 * @returns {Object} Validation result
 */
export const validateModuleData = (module) => {
  if (!module) {
    // Module is optional for content, so null/undefined is valid
    return {
      isValid: true,
      error: null,
      details: [],
    };
  }

  const errors = [];

  if (!module._id) {
    errors.push("Module ID is required when module data is provided");
  }

  if (
    !module.title ||
    typeof module.title !== "string" ||
    module.title.trim().length === 0
  ) {
    errors.push("Module title is required and must be a valid string");
  }

  if (module.description && typeof module.description !== "string") {
    errors.push("Module description must be a string when provided");
  }

  if (module.difficulty) {
    const validDifficulties = ["beginner", "intermediate", "advanced", "expert"];
    if (!validDifficulties.includes(module.difficulty.toLowerCase())) {
      errors.push(
        `Module difficulty must be one of: ${validDifficulties.join(", ")}`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? `Module validation failed: ${errors[0]}` : null,
    details: errors,
  };
};

/**
 * Validate phase data when available for content
 * @param {Object} phase - Phase data to validate
 * @returns {Object} Validation result
 */
export const validatePhaseData = (phase) => {
  if (!phase) {
    // Phase is optional for content, so null/undefined is valid
    return {
      isValid: true,
      error: null,
      details: [],
    };
  }

  const errors = [];

  if (!phase._id) {
    errors.push("Phase ID is required when phase data is provided");
  }

  if (
    !phase.title ||
    typeof phase.title !== "string" ||
    phase.title.trim().length === 0
  ) {
    errors.push("Phase title is required and must be a valid string");
  }

  if (phase.description && typeof phase.description !== "string") {
    errors.push("Phase description must be a string when provided");
  }

  if (phase.color && typeof phase.color !== "string") {
    errors.push("Phase color must be a string when provided");
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? `Phase validation failed: ${errors[0]}` : null,
    details: errors,
  };
};

/**
 * Sanitize content data by removing potentially harmful content
 * @param {Object} content - Content data to sanitize
 * @returns {Object} Sanitized content data
 */
export const sanitizeContentData = (content) => {
  if (!content) return null;

  return {
    _id: content._id,
    title: typeof content.title === "string" ? content.title.trim() : "",
    description:
      typeof content.description === "string" ? content.description.trim() : "",
    type:
      typeof content.type === "string"
        ? content.type.toLowerCase().trim()
        : "document",
    duration:
      typeof content.duration === "number" && content.duration >= 0
        ? content.duration
        : 0,
    order:
      typeof content.order === "number" && content.order >= 0
        ? content.order
        : null,
    section:
      typeof content.section === "string" ? content.section.trim() : null,
    url: typeof content.url === "string" ? content.url.trim() : null,
    instructions:
      typeof content.instructions === "string"
        ? content.instructions.trim()
        : null,
    resources: Array.isArray(content.resources) ? content.resources : [],
    metadata: content.metadata && typeof content.metadata === "object" 
      ? sanitizeContentMetadata(content.metadata) 
      : null,
    isActive: typeof content.isActive === "boolean" ? content.isActive : true,
    moduleId: content.moduleId,
    createdAt: content.createdAt,
    updatedAt: content.updatedAt,
    // Include module/phase data if available
    module: content.module ? sanitizeModuleData(content.module) : null,
  };
};

/**
 * Sanitize content metadata
 * @param {Object} metadata - Metadata to sanitize
 * @returns {Object} Sanitized metadata
 */
export const sanitizeContentMetadata = (metadata) => {
  if (!metadata || typeof metadata !== "object") return null;

  return {
    difficulty:
      metadata.difficulty &&
      ["beginner", "intermediate", "advanced", "expert"].includes(
        metadata.difficulty.toLowerCase()
      )
        ? metadata.difficulty.toLowerCase()
        : null,
    estimatedTime:
      typeof metadata.estimatedTime === "string"
        ? metadata.estimatedTime.trim()
        : null,
    tags: Array.isArray(metadata.tags)
      ? metadata.tags
          .filter((tag) => typeof tag === "string")
          .map((tag) => tag.trim())
      : [],
    prerequisites: Array.isArray(metadata.prerequisites)
      ? metadata.prerequisites
          .filter((prereq) => typeof prereq === "string")
          .map((prereq) => prereq.trim())
      : [],
    tools: Array.isArray(metadata.tools)
      ? metadata.tools
          .filter((tool) => typeof tool === "string")
          .map((tool) => tool.trim())
      : [],
    objectives: Array.isArray(metadata.objectives)
      ? metadata.objectives
          .filter((obj) => typeof obj === "string")
          .map((obj) => obj.trim())
      : [],
  };
};

/**
 * Sanitize module data for content detail
 * @param {Object} module - Module data to sanitize
 * @returns {Object} Sanitized module data
 */
export const sanitizeModuleData = (module) => {
  if (!module) return null;

  return {
    _id: module._id,
    title: typeof module.title === "string" ? module.title.trim() : "",
    description:
      typeof module.description === "string" ? module.description.trim() : "",
    difficulty:
      module.difficulty &&
      ["beginner", "intermediate", "advanced", "expert"].includes(
        module.difficulty.toLowerCase()
      )
        ? module.difficulty.toLowerCase()
        : null,
    color: typeof module.color === "string" ? module.color.trim() : null,
    icon: typeof module.icon === "string" ? module.icon.trim() : null,
    phaseId: module.phaseId,
    isActive: typeof module.isActive === "boolean" ? module.isActive : true,
    // Include phase data if available
    phase: module.phase ? sanitizePhaseData(module.phase) : null,
  };
};

/**
 * Sanitize phase data for content detail
 * @param {Object} phase - Phase data to sanitize
 * @returns {Object} Sanitized phase data
 */
export const sanitizePhaseData = (phase) => {
  if (!phase) return null;

  return {
    _id: phase._id,
    title: typeof phase.title === "string" ? phase.title.trim() : "",
    description:
      typeof phase.description === "string" ? phase.description.trim() : "",
    color: typeof phase.color === "string" ? phase.color.trim() : null,
    icon: typeof phase.icon === "string" ? phase.icon.trim() : null,
    isActive: typeof phase.isActive === "boolean" ? phase.isActive : true,
  };
};

/**
 * Comprehensive validation for all content detail data
 * @param {Object} data - Complete content detail data
 * @returns {Object} Comprehensive validation result
 */
export const validateAllContentDetailData = (data) => {
  const results = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // Validate content data (required)
  if (data.content) {
    const contentValidation = validateContentData(data.content);
    if (!contentValidation.isValid) {
      results.isValid = false;
      results.errors.push(`Content: ${contentValidation.error}`);
    }
  } else {
    results.isValid = false;
    results.errors.push("Content data is missing");
  }

  // Validate module data (optional)
  if (data.module) {
    const moduleValidation = validateModuleData(data.module);
    if (!moduleValidation.isValid) {
      results.warnings.push(`Module: ${moduleValidation.error}`);
    }
  }

  // Validate phase data (optional)
  if (data.phase) {
    const phaseValidation = validatePhaseData(data.phase);
    if (!phaseValidation.isValid) {
      results.warnings.push(`Phase: ${phaseValidation.error}`);
    }
  }

  // Validate related content (optional)
  if (data.relatedContent && !Array.isArray(data.relatedContent)) {
    results.warnings.push("Related content must be an array");
  }

  return results;
};

/**
 * Validate content URL format
 * @param {string} url - URL to validate
 * @returns {Object} Validation result
 */
export const validateContentUrl = (url) => {
  if (!url) {
    return {
      isValid: true, // URL is optional
      error: null,
    };
  }

  if (typeof url !== "string") {
    return {
      isValid: false,
      error: "URL must be a string",
    };
  }

  try {
    new URL(url);
    return {
      isValid: true,
      error: null,
    };
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid URL format",
    };
  }
};

/**
 * Validate content resources array
 * @param {Array} resources - Resources array to validate
 * @returns {Object} Validation result
 */
export const validateContentResources = (resources) => {
  if (!resources) {
    return {
      isValid: true, // Resources are optional
      error: null,
      details: [],
    };
  }

  if (!Array.isArray(resources)) {
    return {
      isValid: false,
      error: "Resources must be an array",
      details: [],
    };
  }

  const errors = [];

  resources.forEach((resource, index) => {
    if (typeof resource !== "string") {
      errors.push(`Resource at index ${index} must be a string`);
    } else if (resource.trim().length === 0) {
      errors.push(`Resource at index ${index} cannot be empty`);
    }
  });

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? `Resources validation failed: ${errors[0]}` : null,
    details: errors,
  };
};