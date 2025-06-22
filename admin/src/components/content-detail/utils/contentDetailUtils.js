/**
 * Utility functions for ContentDetailView component
 */

/**
 * Format content data for display with calculated properties
 * @param {Object} content - Raw content data from API
 * @returns {Object} Formatted content data
 */
export const formatContentData = (content) => {
  if (!content) return null;

  return {
    ...content,
    createdAtFormatted: content.createdAt 
      ? new Date(content.createdAt).toLocaleDateString()
      : "N/A",
    updatedAtFormatted: content.updatedAt
      ? new Date(content.updatedAt).toLocaleDateString()
      : "N/A",
    durationDisplay: content.duration 
      ? formatDuration(content.duration)
      : "Not specified",
    typeDisplay: content.type
      ? content.type.charAt(0).toUpperCase() + content.type.slice(1)
      : "Unknown",
    // Capitalize difficulty properly (fixing the issue mentioned by user)
    difficultyDisplay: content.metadata?.difficulty
      ? content.metadata.difficulty.charAt(0).toUpperCase() + content.metadata.difficulty.slice(1)
      : null,
  };
};

/**
 * Format module data for display
 * @param {Object} module - Raw module data from API
 * @returns {Object} Formatted module data
 */
export const formatModuleData = (module) => {
  if (!module) return null;

  return {
    ...module,
    // Capitalize difficulty properly
    difficultyDisplay: module.difficulty
      ? module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)
      : null,
    createdAtFormatted: module.createdAt 
      ? new Date(module.createdAt).toLocaleDateString()
      : "N/A",
    updatedAtFormatted: module.updatedAt
      ? new Date(module.updatedAt).toLocaleDateString()
      : "N/A",
  };
};

/**
 * Format phase data for display
 * @param {Object} phase - Raw phase data from API
 * @returns {Object} Formatted phase data
 */
export const formatPhaseData = (phase) => {
  if (!phase) return null;

  return {
    ...phase,
    createdAtFormatted: phase.createdAt 
      ? new Date(phase.createdAt).toLocaleDateString()
      : "N/A",
    updatedAtFormatted: phase.updatedAt
      ? new Date(phase.updatedAt).toLocaleDateString()
      : "N/A",
  };
};

/**
 * Process content resources and instructions for display
 * @param {Object} content - Formatted content data
 * @returns {Object} Processed resources information
 */
export const processContentResources = (content) => {
  if (!content) return null;

  return {
    hasInstructions: Boolean(content.instructions),
    hasResources: Boolean(content.resources && content.resources.length > 0),
    resourceCount: content.resources ? content.resources.length : 0,
    instructionsLength: content.instructions ? content.instructions.length : 0,
    processedResources: content.resources ? content.resources.map((resource, index) => {
      // Handle both old string format and new object format
      const isObject = typeof resource === 'object' && resource !== null;
      
      if (isObject) {
        return {
          id: index,
          value: resource.name,
          type: resource.type || 'text',
          url: resource.url,
          description: resource.description,
          originalResource: resource,
        };
      } else {
        return {
          id: index,
          value: resource,
          type: detectResourceType(resource),
          originalResource: resource,
        };
      }
    }) : [],
  };
};

/**
 * Detect resource type based on content
 * @param {string|Object} resource - Resource string or object
 * @returns {string} Resource type
 */
export const detectResourceType = (resource) => {
  // Handle object resources
  if (typeof resource === 'object' && resource !== null) {
    return resource.type || 'text';
  }
  
  // Handle string resources
  if (!resource || typeof resource !== 'string') return 'text';
  
  const resourceLower = resource.toLowerCase();
  
  if (resourceLower.startsWith('http://') || resourceLower.startsWith('https://')) {
    return 'url';
  }
  
  if (resourceLower.includes('@') && resourceLower.includes('.')) {
    return 'email';
  }
  
  if (resourceLower.includes('github.com') || resourceLower.includes('gitlab.com')) {
    return 'repository';
  }
  
  return 'text';
};

/**
 * Get content type color and styling
 * @param {string} type - Content type
 * @returns {string} CSS classes for content type styling
 */
export const getContentTypeColor = (type) => {
  const typeStyles = {
    video: "bg-red-600/20 text-red-400 border-red-500/30",
    lab: "bg-green-600/20 text-green-400 border-green-500/30",
    game: "bg-purple-600/20 text-purple-400 border-purple-500/30",
    document: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  };

  return typeStyles[type] || "bg-gray-600/20 text-gray-400 border-gray-500/30";
};

/**
 * Get difficulty badge styling based on difficulty level
 * @param {string} difficulty - Content or module difficulty level
 * @returns {Object} Style configuration for difficulty badge
 */
export const getDifficultyBadgeStyle = (difficulty) => {
  const styles = {
    beginner: {
      className: "bg-green-600/20 text-green-400 border-green-500/30",
      label: "Beginner"
    },
    intermediate: {
      className: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30", 
      label: "Intermediate"
    },
    advanced: {
      className: "bg-orange-600/20 text-orange-400 border-orange-500/30",
      label: "Advanced"
    },
    expert: {
      className: "bg-red-600/20 text-red-400 border-red-500/30",
      label: "Expert"
    }
  };

  const normalizedDifficulty = difficulty ? difficulty.toLowerCase() : '';
  
  return styles[normalizedDifficulty] || {
    className: "bg-gray-600/20 text-gray-400 border-gray-500/30",
    label: difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "Unknown"
  };
};

/**
 * Create breadcrumb navigation data for content
 * @param {Object} content - Content data
 * @param {Object} module - Module data (optional)
 * @param {Object} phase - Phase data (optional)
 * @returns {Array} Breadcrumb items
 */
export const createContentBreadcrumbs = (content, module = null) => {
  const breadcrumbs = [
    { label: "Content", href: "/content" }
  ];

  if (module) {
    breadcrumbs.push({ 
      label: module.title, 
      href: `/modules/${module._id}` 
    });
  }

  if (content) {
    breadcrumbs.push({ 
      label: content.title || "Content Details"
    });
  }

  return breadcrumbs;
};

/**
 * Get quick action configurations for content
 * @param {string} contentId - Current content ID
 * @param {string} moduleId - Parent module ID (optional)
 * @param {string} phaseId - Parent phase ID (optional)
 * @returns {Array} Quick action configurations
 */
export const getContentQuickActions = (contentId, moduleId = null, phaseId = null) => {
  const actions = [];

  if (contentId) {
    actions.push({
      id: 'edit-content',
      label: 'Edit Content',
      path: `/content/${contentId}/edit`,
      icon: 'PencilIcon',
      color: 'blue'
    });
  }

  if (moduleId) {
    actions.push({
      id: 'view-module',
      label: 'View Module',
      path: `/modules/${moduleId}`,
      icon: 'CubeIcon',
      color: 'green'
    });
  }

  if (phaseId) {
    actions.push({
      id: 'view-phase',
      label: 'View Phase',
      path: `/phases/${phaseId}`,
      icon: 'StarIcon',
      color: 'purple'
    });
  }

  actions.push({
    id: 'back-to-content',
    label: 'Back to Content',
    path: '/content',
    icon: 'ArrowLeftIcon',
    color: 'gray',
    isAction: true
  });

  return actions;
};

/**
 * Handle API errors with user-friendly messages
 * @param {Error} error - Error object from API call
 * @param {string} context - Context of where error occurred
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error, context = "operation") => {
  console.error(`Error during ${context}:`, error);
  
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || `Failed to ${context}`;
  } else if (error.request) {
    // Request made but no response received
    return `Network error during ${context}. Please check your connection.`;
  } else {
    // Something else happened
    return error.message || `An unexpected error occurred during ${context}`;
  }
};

/**
 * Check if content data is complete and valid
 * @param {Object} content - Content data to validate
 * @returns {boolean} True if content data is valid
 */
export const isContentDataValid = (content) => {
  return content && content._id && content.title && content.type;
};

/**
 * Format duration from seconds to human readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return "0 min";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${hours}h`;
    }
  } else if (minutes > 0) {
    if (remainingSeconds > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${minutes}m`;
    }
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Get content type icon name for display
 * @param {string} type - Content type
 * @returns {string} Icon component name
 */
export const getContentTypeIcon = (type) => {
  // Return the component itself since we're using it in JSX
  // This is handled in the parent component
  return type;
};

/**
 * Get status color for content state
 * @param {boolean} isActive - Whether content is active
 * @returns {string} Color class for status display
 */
export const getStatusColor = (isActive) => {
  return isActive ? "text-green-400" : "text-red-400";
};

/**
 * Calculate content completion score
 * @param {Object} content - Content data
 * @returns {number} Completion score (0-100)
 */
export const calculateContentCompletionScore = (content) => {
  if (!content) return 0;

  let score = 0;
  
  // Essential fields (60%)
  if (content.title) score += 20;
  if (content.description) score += 20;
  if (content.type) score += 10;
  if (content.url) score += 10;
  
  // Additional fields (40%)
  if (content.instructions) score += 15;
  if (content.resources && content.resources.length > 0) score += 10;
  if (content.metadata) score += 10;
  if (content.duration && content.duration > 0) score += 5;

  return Math.min(score, 100);
};

/**
 * Get module color with fallback
 * @param {string} color - Module color value
 * @returns {string} Processed color value
 */
export const getModuleColor = (color) => {
  if (!color) return "#10b981"; // Default green

  // If it's already a hex color, return as is
  if (color.startsWith('#')) {
    return color;
  }

  // Support common color names
  const colorNames = {
    red: "#ef4444",
    green: "#10b981", 
    blue: "#3b82f6",
    yellow: "#f59e0b",
    purple: "#8b5cf6",
    pink: "#ec4899",
    indigo: "#6366f1",
    cyan: "#06b6d4",
    orange: "#f97316",
    teal: "#14b8a6",
    lime: "#84cc16",
    emerald: "#10b981",
    sky: "#0ea5e9",
    violet: "#8b5cf6",
    fuchsia: "#d946ef",
    rose: "#f43f5e",
  };

  return colorNames[color.toLowerCase()] || color;
};