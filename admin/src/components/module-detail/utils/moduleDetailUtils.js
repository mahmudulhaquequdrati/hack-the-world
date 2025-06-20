/**
 * Utility functions for ModuleDetailView component
 */

/**
 * Format module data for display with calculated properties
 * @param {Object} module - Raw module data from API
 * @param {Object} phase - Phase data for this module
 * @returns {Object} Formatted module data
 */
export const formatModuleData = (module, phase = null) => {
  if (!module) return null;

  return {
    ...module,
    phaseContext: phase,
    createdAtFormatted: module.createdAt 
      ? new Date(module.createdAt).toLocaleDateString()
      : "N/A",
    updatedAtFormatted: module.updatedAt
      ? new Date(module.updatedAt).toLocaleDateString()
      : "N/A",
    estimatedHoursDisplay: module.content?.estimatedHours 
      ? `${module.content.estimatedHours}h estimated`
      : null,
  };
};

/**
 * Calculate comprehensive statistics for module content
 * @param {Array} content - Array of content items in the module
 * @returns {Object} Statistics object
 */
export const calculateContentStatistics = (content = []) => {
  const videoCount = content.filter(c => c.type === 'video').length;
  const labCount = content.filter(c => c.type === 'lab').length;
  const gameCount = content.filter(c => c.type === 'game').length;
  const documentCount = content.filter(c => c.type === 'document').length;
  
  const totalDuration = content.reduce((sum, c) => sum + (c.duration || 0), 0);
  const averageDuration = content.length > 0 
    ? Math.round((totalDuration / content.length) * 10) / 10
    : 0;

  return {
    totalContent: content.length,
    totalDuration,
    averageDuration,
    videoCount,
    labCount,
    gameCount,
    documentCount,
    contentByType: {
      video: videoCount,
      lab: labCount,
      game: gameCount,
      document: documentCount,
    }
  };
};

/**
 * Format content by sections from API response
 * @param {Object} contentBySections - Raw content sections data
 * @returns {Object} Formatted content sections
 */
export const formatContentBySection = (contentBySections = {}) => {
  const formatted = {};
  
  Object.entries(contentBySections).forEach(([sectionName, sectionContent]) => {
    if (Array.isArray(sectionContent) && sectionContent.length > 0) {
      formatted[sectionName] = sectionContent.map(item => ({
        ...item,
_id: item._id, // Normalize _id field
        section: sectionName,
      }));
    }
  });

  return formatted;
};

/**
 * Get difficulty badge styling based on difficulty level
 * @param {string} difficulty - Module difficulty level
 * @returns {Object} Style configuration for difficulty badge
 */
export const getDifficultyBadgeStyle = (difficulty) => {
  const styles = {
    beginner: {
      className: "bg-green-900/30 text-green-400 border-green-500/30",
      label: "Beginner"
    },
    intermediate: {
      className: "bg-yellow-900/30 text-yellow-400 border-yellow-500/30", 
      label: "Intermediate"
    },
    advanced: {
      className: "bg-red-900/30 text-red-400 border-red-500/30",
      label: "Advanced"
    },
    expert: {
      className: "bg-purple-900/30 text-purple-400 border-purple-500/30",
      label: "Expert"
    }
  };

  return styles[difficulty] || {
    className: "bg-gray-900/30 text-gray-400 border-gray-500/30",
    label: difficulty || "Unknown"
  };
};

/**
 * Get content type information for display
 * @param {string} type - Content type
 * @returns {Object} Content type display information
 */
export const getContentTypeInfo = (type) => {
  const typeInfo = {
    video: {
      label: "Video",
      color: "text-blue-400 bg-blue-900/30 border-blue-500/30",
      icon: "PlayIcon"
    },
    lab: {
      label: "Lab",
      color: "text-green-400 bg-green-900/30 border-green-500/30",
      icon: "BeakerIcon"
    },
    game: {
      label: "Game",
      color: "text-purple-400 bg-purple-900/30 border-purple-500/30",
      icon: "PuzzlePieceIcon"
    },
    document: {
      label: "Document",
      color: "text-yellow-400 bg-yellow-900/30 border-yellow-500/30",
      icon: "DocumentTextIcon"
    }
  };

  return typeInfo[type] || {
    label: type || "Unknown",
    color: "text-gray-400 bg-gray-900/30 border-gray-500/30",
    icon: "DocumentIcon"
  };
};

/**
 * Create breadcrumb navigation data for module
 * @param {Object} module - Module data
 * @param {Object} phase - Phase data (optional)
 * @returns {Array} Breadcrumb items
 */
export const createModuleBreadcrumbs = (module, phase = null) => {
  const breadcrumbs = [
    { label: "Modules", path: "/modules", active: false }
  ];

  if (phase) {
    breadcrumbs.push({ 
      label: phase.title, 
      path: `/phases/${phase._id}`, 
      active: false 
    });
  }

  breadcrumbs.push({ 
    label: module?.title || "Module Details", 
    path: null, 
    active: true 
  });

  return breadcrumbs;
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
 * Check if module data is complete and valid
 * @param {Object} module - Module data to validate
 * @returns {boolean} True if module data is valid
 */
export const isModuleDataValid = (module) => {
  return module && module._id && module.title;
};

/**
 * Get quick action configurations for module
 * @param {string} moduleId - Current module ID
 * @param {string} phaseId - Parent phase ID (optional)
 * @returns {Array} Quick action configurations
 */
export const getModuleQuickActions = (moduleId, phaseId = null) => {
  const actions = [
    {
      id: 'view-content',
      label: 'View Module Content',
      path: `/content?moduleId=${moduleId}`,
      icon: 'DocumentIcon',
      color: 'green'
    },
    {
      id: 'edit-module',
      label: 'Edit Module',
      path: `/modules/${moduleId}/edit`,
      icon: 'PencilIcon',
      color: 'blue'
    }
  ];

  if (phaseId) {
    actions.push({
      id: 'back-to-phase',
      label: 'Back to Phase',
      path: `/phases/${phaseId}`,
      icon: 'ArrowLeftIcon',
      color: 'gray',
      isAction: true
    });
  }

  actions.push({
    id: 'back-to-modules',
    label: 'Back to Modules',
    path: '/modules',
    icon: 'ArrowLeftIcon',
    color: 'gray',
    isAction: true
  });

  return actions;
};

/**
 * Process content sections for optimal display
 * @param {Object} contentBySections - Raw content sections
 * @param {Array} contentList - Flat content list
 * @returns {Object} Processed sections with metadata
 */
export const processContentSections = (contentBySections, contentList = []) => {
  const processed = {};
  
  // If we have section data, use it
  if (Object.keys(contentBySections).length > 0) {
    Object.entries(contentBySections).forEach(([sectionName, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        processed[sectionName] = {
          items: items.map(item => ({
            ...item,
            _id: item._id,
          })),
          count: items.length,
          totalDuration: items.reduce((sum, item) => sum + (item.duration || 0), 0),
        };
      }
    });
  } else if (contentList.length > 0) {
    // Fallback: group content by section field
    const grouped = contentList.reduce((acc, item) => {
      const section = item.section || "General";
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([sectionName, items]) => {
      processed[sectionName] = {
        items,
        count: items.length,
        totalDuration: items.reduce((sum, item) => sum + (item.duration || 0), 0),
      };
    });
  }

  return processed;
};

/**
 * Get color value with support for both hex colors and color names
 * @param {string} color - Color value (hex or name)
 * @returns {string} Processed color value
 */
export const getColorValue = (color) => {
  if (!color) return "#00ff00"; // Default green

  // If it's already a hex color, return as is
  if (color.startsWith('#')) {
    return color;
  }

  // Support common color names (matching PhaseDetailView pattern)
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