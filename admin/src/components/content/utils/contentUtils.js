/**
 * Content management utility functions
 */

/**
 * Creates a clean content data object for API submission
 * @param {Object} formData - The form data to process
 * @param {string} sectionInputValue - The section input value
 * @returns {Object} - Clean content data object
 */
export const createContentData = (formData, sectionInputValue) => {
  return {
    ...formData,
    section: sectionInputValue || formData.section,
    // Ensure arrays are properly formatted
    resources: ensureValidArray(formData.resources),
    tags: ensureValidArray(formData.tags),
    prerequisites: ensureValidArray(formData.prerequisites),
    learningObjectives: ensureValidArray(formData.learningObjectives),
    technicalRequirements: ensureValidArray(formData.technicalRequirements),
    // Ensure accessibility object is properly formatted
    accessibility: formData.accessibility || {
      hasSubtitles: false,
      hasTranscript: false,
      hasAudioDescription: false,
    },
    // Ensure numbers are properly typed
    duration: Number(formData.duration) || 1,
    estimatedTime: Number(formData.estimatedTime) || 1,
    // Set proper defaults
    version: formData.version || '1.0',
    language: formData.language || 'en',
    difficulty: formData.difficulty || 'beginner',
    isActive: Boolean(formData.isActive),
  };
};

/**
 * Ensures a value is a valid array
 * @param {any} value - The value to check
 * @returns {Array} - Valid array or empty array
 */
export const ensureValidArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.filter(item => item && typeof item === 'string' && item.trim());
};

/**
 * Handles API errors and returns user-friendly error messages
 * @param {Error} error - The error object
 * @param {string} operation - The operation that failed (e.g., 'create', 'update', 'delete')
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error, operation = 'save') => {
  console.error(`❌ Error during ${operation}:`, error);
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;
    
    switch (status) {
      case 400:
        return message || `Invalid data provided for ${operation}`;
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return `You don't have permission to ${operation} content`;
      case 404:
        return `Content not found. It may have been deleted.`;
      case 409:
        return `Conflict: ${message || 'Content already exists'}`;
      case 422:
        return `Validation error: ${message || 'Please check your input'}`;
      case 500:
        return 'Server error. Please try again later.';
      default:
        return message || `Failed to ${operation} content`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection and try again.';
  } else {
    // Other error
    return error.message || `Failed to ${operation} content`;
  }
};

/**
 * Performs optimistic update on content array
 * @param {Array} contentArray - Current content array
 * @param {Object} updatedContent - Updated content object
 * @returns {Array} - Updated content array
 */
export const optimisticUpdate = (contentArray, updatedContent) => {
  return contentArray.map(item =>
    item.id === updatedContent.id ? { ...item, ...updatedContent } : item
  );
};

/**
 * Performs optimistic addition to content array
 * @param {Array} contentArray - Current content array
 * @param {Object} newContent - New content object
 * @returns {Array} - Updated content array
 */
export const optimisticAdd = (contentArray, newContent) => {
  return [...contentArray, newContent];
};

/**
 * Performs optimistic removal from content array
 * @param {Array} contentArray - Current content array
 * @param {string} contentId - ID of content to remove
 * @returns {Array} - Updated content array
 */
export const optimisticRemove = (contentArray, contentId) => {
  return contentArray.filter(item => item.id !== contentId);
};

/**
 * Generates a success message based on operation and count
 * @param {string} operation - The operation performed ('create', 'update', 'delete')
 * @param {number} count - Number of items affected
 * @returns {string} - Success message
 */
export const generateSuccessMessage = (operation, count = 1) => {
  const operationMap = {
    create: count > 1 ? `Successfully created ${count} content items` : 'Content created successfully!',
    update: 'Content updated successfully!',
    delete: 'Content deleted successfully!',
  };
  
  return operationMap[operation] || 'Operation completed successfully!';
};

/**
 * Creates default form data for new content
 * @returns {Object} - Default form data object
 */
export const createDefaultFormData = () => ({
  moduleId: "",
  type: "video",
  title: "",
  description: "",
  section: "",
  url: "",
  instructions: "",
  duration: 1,
  resources: [],
  tags: [],
  difficulty: "beginner",
  prerequisites: [],
  learningObjectives: [],
  estimatedTime: 1,
  contentFormat: "",
  language: "en",
  accessibility: {
    hasSubtitles: false,
    hasTranscript: false,
    hasAudioDescription: false,
  },
  technicalRequirements: [],
  author: "",
  version: "1.0",
  lastUpdated: "",
  isActive: false,
  thumbnailUrl: "",
});

/**
 * Populates form data from existing content for editing
 * @param {Object} contentItem - The content item to edit
 * @returns {Object} - Populated form data
 */
export const populateFormFromContent = (contentItem) => ({
  ...contentItem,
  resources: contentItem.resources || [],
  tags: contentItem.tags || [],
  prerequisites: contentItem.prerequisites || [],
  learningObjectives: contentItem.learningObjectives || [],
  technicalRequirements: contentItem.technicalRequirements || [],
  accessibility: contentItem.accessibility || {
    hasSubtitles: false,
    hasTranscript: false,
    hasAudioDescription: false,
  },
});

/**
 * Updates hierarchical data with new/updated content
 * @param {Array} hierarchicalData - Current hierarchical data
 * @param {Object} contentData - Content data to update
 * @param {string} operation - Operation type ('add', 'update', 'remove')
 * @returns {Array} - Updated hierarchical data
 */
export const updateHierarchicalData = (hierarchicalData, contentData, operation) => {
  return hierarchicalData.map(phase => ({
    ...phase,
    modules: phase.modules.map(module => {
      if (module.id === contentData.moduleId) {
        switch (operation) {
          case 'add':
            return {
              ...module,
              content: [...module.content, contentData],
              contentCount: module.content.length + 1
            };
          case 'update':
            return {
              ...module,
              content: module.content.map(item =>
                item.id === contentData.id ? { ...item, ...contentData } : item
              )
            };
          case 'remove':
            return {
              ...module,
              content: module.content.filter(item => item.id !== contentData.id),
              contentCount: Math.max(0, module.contentCount - 1)
            };
          default:
            return module;
        }
      }
      return module;
    })
  }));
};

/**
 * Updates grouped data with new/updated content
 * @param {Object} groupedData - Current grouped data
 * @param {Object} contentData - Content data to update  
 * @param {string} operation - Operation type ('add', 'update', 'remove')
 * @param {string} groupBy - Group by type ('module' or 'type')
 * @param {Array} modules - Modules array for grouping
 * @param {Array} contentTypes - Content types array for grouping
 * @returns {Object} - Updated grouped data
 */
export const updateGroupedData = (groupedData, contentData, operation, groupBy, modules = [], contentTypes = []) => {
  const newGroupedData = { ...groupedData };
  
  if (groupBy === 'module') {
    const module = modules.find(m => m.id === contentData.moduleId);
    const groupKey = module?.title || 'Unknown Module';
    
    switch (operation) {
      case 'add':
        if (!newGroupedData[groupKey]) {
          newGroupedData[groupKey] = [];
        }
        newGroupedData[groupKey] = [...newGroupedData[groupKey], contentData];
        break;
      case 'update':
        Object.keys(newGroupedData).forEach(key => {
          newGroupedData[key] = newGroupedData[key].map(item =>
            item.id === contentData.id ? { ...item, ...contentData } : item
          );
        });
        break;
      case 'remove':
        Object.keys(newGroupedData).forEach(key => {
          newGroupedData[key] = newGroupedData[key].filter(item => item.id !== contentData.id);
          if (newGroupedData[key].length === 0) {
            delete newGroupedData[key];
          }
        });
        break;
    }
  } else if (groupBy === 'type') {
    const contentType = contentTypes.find(ct => ct.value === contentData.type);
    const groupKey = contentType?.label || 'Unknown Type';
    
    switch (operation) {
      case 'add':
        if (!newGroupedData[groupKey]) {
          newGroupedData[groupKey] = [];
        }
        newGroupedData[groupKey] = [...newGroupedData[groupKey], contentData];
        break;
      case 'update':
        Object.keys(newGroupedData).forEach(key => {
          newGroupedData[key] = newGroupedData[key].map(item =>
            item.id === contentData.id ? { ...item, ...contentData } : item
          );
        });
        break;
      case 'remove':
        Object.keys(newGroupedData).forEach(key => {
          newGroupedData[key] = newGroupedData[key].filter(item => item.id !== contentData.id);
          if (newGroupedData[key].length === 0) {
            delete newGroupedData[key];
          }
        });
        break;
    }
  }
  
  return newGroupedData;
};

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Filters sections based on input value
 * @param {Array} sections - Available sections
 * @param {string} inputValue - Input value to filter by
 * @returns {Array} - Filtered sections
 */
export const filterSections = (sections, inputValue) => {
  if (!inputValue) return sections;
  return sections.filter(section =>
    section.toLowerCase().includes(inputValue.toLowerCase())
  );
};

/**
 * Gets content type configuration
 * @param {string} type - Content type
 * @param {Array} contentTypes - Available content types
 * @returns {Object} - Content type configuration
 */
export const getContentTypeConfig = (type, contentTypes) => {
  return contentTypes.find(ct => ct.value === type) || {
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
    icon: "📄",
    color: "bg-gray-500"
  };
};

/**
 * Formats duration for display
 * @param {number} duration - Duration in minutes
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (duration) => {
  if (!duration || duration < 1) return '1 min';
  
  if (duration < 60) {
    return `${duration} min`;
  }
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}m`;
};

/**
 * Calculates content statistics
 * @param {Array} content - Content array
 * @param {Array} contentTypes - Content types configuration
 * @returns {Object} - Statistics object
 */
export const calculateContentStats = (content, contentTypes) => {
  const stats = {
    total: content.length,
    byType: {},
    totalDuration: 0,
    published: 0,
    unpublished: 0
  };
  
  contentTypes.forEach(type => {
    stats.byType[type.value] = 0;
  });
  
  content.forEach(item => {
    if (stats.byType.hasOwnProperty(item.type)) {
      stats.byType[item.type]++;
    }
    
    stats.totalDuration += item.duration || 0;
    
    if (item.isActive) {
      stats.published++;
    } else {
      stats.unpublished++;
    }
  });
  
  return stats;
};

/**
 * Sorts array of objects by specified field
 * @param {Array} array - Array to sort
 * @param {string} field - Field to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} - Sorted array
 */
export const sortBy = (array, field, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Creates a multiple upload item template
 * @returns {Object} - Upload item template
 */
export const createUploadItemTemplate = () => ({
  id: Date.now() + Math.random(),
  type: "video",
  title: "",
  description: "",
  section: "",
  url: "",
  instructions: "",
  duration: 1,
  resources: [],
});

/**
 * Validates and sanitizes form input
 * @param {string} value - Input value
 * @param {string} type - Input type
 * @returns {any} - Sanitized value
 */
export const sanitizeInput = (value, type) => {
  switch (type) {
    case 'string':
      return typeof value === 'string' ? value.trim() : '';
    case 'number':
      const num = Number(value);
      return isNaN(num) ? 0 : Math.max(0, num);
    case 'boolean':
      return Boolean(value);
    case 'array':
      return Array.isArray(value) ? value : [];
    default:
      return value;
  }
};