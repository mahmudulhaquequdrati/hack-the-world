/**
 * Content validation utilities
 */

/**
 * Validates a content data object for required fields
 * @param {Object} contentData - The content data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateContentData = (contentData) => {
  const errors = [];

  // Basic required fields
  if (!contentData.title?.trim()) {
    errors.push("Title is required");
  }

  if (!contentData.description?.trim()) {
    errors.push("Description is required");
  }

  if (!contentData.moduleId) {
    errors.push("Module selection is required");
  }

  if (!contentData.type) {
    errors.push("Content type is required");
  }

  // Type-specific validation
  if (contentData.type === "video" && !contentData.url?.trim()) {
    errors.push("URL is required for video content");
  }

  if (
    (contentData.type === "lab" || contentData.type === "game") &&
    !contentData.instructions?.trim()
  ) {
    errors.push("Instructions are required for lab and game content");
  }

  // Duration validation
  if (
    contentData.duration &&
    (isNaN(contentData.duration) || contentData.duration < 1)
  ) {
    errors.push("Duration must be a positive number");
  }

  // Estimated time validation
  if (
    contentData.estimatedTime &&
    (isNaN(contentData.estimatedTime) || contentData.estimatedTime < 1)
  ) {
    errors.push("Estimated time must be a positive number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates required fields for content creation/update
 * @param {Object} formData - The form data to validate
 * @returns {boolean} - True if required fields are valid
 */
export const validateRequiredFields = (formData) => {
  const requiredFields = ["title", "description", "moduleId", "type"];

  return requiredFields.every((field) => {
    if (field === "moduleId" || field === "type") {
      return formData[field] && formData[field].trim();
    }
    return formData[field]?.trim();
  });
};

/**
 * Validates content type specific requirements
 * @param {Object} contentData - The content data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateContentType = (contentData) => {
  const errors = [];

  switch (contentData.type) {
    case "video":
      if (!contentData.url?.trim()) {
        errors.push("Video URL is required for video content");
      } else if (!isValidURL(contentData.url)) {
        errors.push("Please enter a valid URL for video content");
      }
      break;

    case "lab":
      if (!contentData.instructions?.trim()) {
        errors.push("Instructions are required for lab content");
      }
      break;

    case "game":
      if (!contentData.instructions?.trim()) {
        errors.push("Instructions are required for game content");
      }
      break;

    case "document":
      if (!contentData.url?.trim()) {
        errors.push("Document URL is required for document content");
      }
      break;

    default:
      errors.push("Invalid content type");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates multiple upload items
 * @param {Array} uploadItems - Array of upload items to validate
 * @returns {Object} - { isValid: boolean, errors: string[], itemErrors: Object }
 */
export const validateMultipleUploads = (uploadItems) => {
  const errors = [];
  const itemErrors = {};

  console.log(uploadItems, "uploadItems");

  if (!uploadItems || uploadItems.length === 0) {
    errors.push("At least one upload item is required");
    return { isValid: false, errors, itemErrors };
  }

  uploadItems.forEach((item, index) => {
    const itemValidation = validateContentData(item);
    if (!itemValidation.isValid) {
      itemErrors[index] = itemValidation.errors;
      errors.push(`Item ${index + 1}: ${itemValidation.errors.join(", ")}`);
    }
  });

  console.log(errors, "errors");

  return {
    isValid: errors.length === 0,
    errors,
    itemErrors,
  };
};

/**
 * Validates an array field
 * @param {Array} arrayField - The array field to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateArrayField = (arrayField, fieldName) => {
  const errors = [];

  if (!Array.isArray(arrayField)) {
    errors.push(`${fieldName} must be an array`);
    return { isValid: false, errors };
  }

  // Check for empty strings in array
  const hasEmptyStrings = arrayField.some(
    (item) => typeof item === "string" && !item.trim()
  );

  if (hasEmptyStrings) {
    errors.push(`${fieldName} cannot contain empty values`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates accessibility settings
 * @param {Object} accessibility - The accessibility object to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateAccessibility = (accessibility) => {
  const errors = [];

  if (!accessibility || typeof accessibility !== "object") {
    errors.push("Accessibility settings must be an object");
    return { isValid: false, errors };
  }

  const requiredFields = [
    "hasSubtitles",
    "hasTranscript",
    "hasAudioDescription",
  ];

  requiredFields.forEach((field) => {
    if (typeof accessibility[field] !== "boolean") {
      errors.push(`Accessibility ${field} must be a boolean value`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates section input
 * @param {string} section - The section value to validate
 * @param {Array} availableSections - Available sections for validation
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateSection = (section, availableSections = []) => {
  const errors = [];

  if (section && section.trim() && availableSections.length > 0) {
    const sectionExists = availableSections.includes(section.trim());
    if (!sectionExists) {
      // Allow new sections, just warn
      console.warn(
        `Section "${section}" is not in the available sections list`
      );
    }
  }

  return {
    isValid: true, // Allow new sections
    errors,
  };
};

/**
 * Helper function to validate URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid URL
 */
const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates difficulty level
 * @param {string} difficulty - The difficulty level to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateDifficulty = (difficulty) => {
  const validDifficulties = ["beginner", "intermediate", "advanced", "expert"];
  const errors = [];

  if (!validDifficulties.includes(difficulty)) {
    errors.push(`Difficulty must be one of: ${validDifficulties.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates language code
 * @param {string} language - The language code to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateLanguage = (language) => {
  const validLanguages = ["en", "es", "fr", "de", "it", "pt", "zh", "ja", "ko"];
  const errors = [];

  if (!validLanguages.includes(language)) {
    errors.push(`Language must be one of: ${validLanguages.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Comprehensive validation for content data
 * @param {Object} contentData - The content data to validate
 * @param {Array} availableSections - Available sections for validation
 * @returns {Object} - { isValid: boolean, errors: string[], warnings: string[] }
 */
export const validateComprehensive = (contentData, availableSections = []) => {
  const errors = [];
  const warnings = [];

  // Basic validation
  const basicValidation = validateContentData(contentData);
  errors.push(...basicValidation.errors);

  // Type-specific validation
  const typeValidation = validateContentType(contentData);
  errors.push(...typeValidation.errors);

  // Array fields validation
  if (contentData.resources) {
    const resourcesValidation = validateArrayField(
      contentData.resources,
      "Resources"
    );
    errors.push(...resourcesValidation.errors);
  }

  if (contentData.tags) {
    const tagsValidation = validateArrayField(contentData.tags, "Tags");
    errors.push(...tagsValidation.errors);
  }

  if (contentData.prerequisites) {
    const prerequisitesValidation = validateArrayField(
      contentData.prerequisites,
      "Prerequisites"
    );
    errors.push(...prerequisitesValidation.errors);
  }

  if (contentData.learningObjectives) {
    const objectivesValidation = validateArrayField(
      contentData.learningObjectives,
      "Learning Objectives"
    );
    errors.push(...objectivesValidation.errors);
  }

  if (contentData.technicalRequirements) {
    const techValidation = validateArrayField(
      contentData.technicalRequirements,
      "Technical Requirements"
    );
    errors.push(...techValidation.errors);
  }

  // Accessibility validation
  if (contentData.accessibility) {
    const accessibilityValidation = validateAccessibility(
      contentData.accessibility
    );
    errors.push(...accessibilityValidation.errors);
  }

  // Difficulty validation
  if (contentData.difficulty) {
    const difficultyValidation = validateDifficulty(contentData.difficulty);
    errors.push(...difficultyValidation.errors);
  }

  // Language validation
  if (contentData.language) {
    const languageValidation = validateLanguage(contentData.language);
    errors.push(...languageValidation.errors);
  }

  // Section validation (warnings only)
  if (contentData.section) {
    const sectionValidation = validateSection(
      contentData.section,
      availableSections
    );
    if (!availableSections.includes(contentData.section)) {
      warnings.push(
        `Section "${contentData.section}" is not in the available sections list`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
