/**
 * Utility functions for PhaseDetailView component
 */

/**
 * Format phase data for display with calculated properties
 * @param {Object} phase - Raw phase data from API
 * @param {Array} modules - Modules array for this phase
 * @returns {Object} Formatted phase data
 */
export const formatPhaseData = (phase, modules = []) => {
  if (!phase) return null;

  return {
    ...phase,
    moduleCount: modules.length,
    createdAtFormatted: phase.createdAt 
      ? new Date(phase.createdAt).toLocaleDateString()
      : "N/A",
    updatedAtFormatted: phase.updatedAt
      ? new Date(phase.updatedAt).toLocaleDateString()
      : "N/A",
  };
};

/**
 * Calculate comprehensive statistics for a phase
 * @param {Array} modules - Array of modules in the phase
 * @returns {Object} Statistics object
 */
export const calculateStatistics = (modules = []) => {
  return {
    totalModules: modules.length,
    beginnerModules: modules.filter(m => m.difficulty === 'beginner').length,
    intermediateModules: modules.filter(m => m.difficulty === 'intermediate').length,
    advancedModules: modules.filter(m => m.difficulty === 'advanced').length,
    expertModules: modules.filter(m => m.difficulty === 'expert').length,
    totalEstimatedHours: modules.reduce((sum, m) => sum + (m.estimatedHours || 0), 0),
    averageEstimatedHours: modules.length > 0 
      ? Math.round((modules.reduce((sum, m) => sum + (m.estimatedHours || 0), 0) / modules.length) * 10) / 10
      : 0,
  };
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
 * Format module data with computed properties
 * @param {Object} module - Raw module data
 * @returns {Object} Formatted module data
 */
export const formatModuleData = (module) => {
  return {
    ...module,
    difficultyStyle: getDifficultyBadgeStyle(module.difficulty),
    estimatedHoursDisplay: module.estimatedHours 
      ? `${module.estimatedHours}h estimated`
      : null,
  };
};

/**
 * Create breadcrumb navigation data
 * @param {Object} phase - Phase data
 * @returns {Array} Breadcrumb items
 */
export const createBreadcrumbs = (phase) => {
  return [
    { label: "Phases", path: "/phases", active: false },
    { label: phase?.title || "Phase Details", path: null, active: true }
  ];
};

/**
 * Check if phase data is complete and valid
 * @param {Object} phase - Phase data to validate
 * @returns {boolean} True if phase data is valid
 */
export const isPhaseDataValid = (phase) => {
  return phase && phase.id && phase.title;
};

/**
 * Get quick action configurations
 * @param {string} phaseId - Current phase ID
 * @returns {Array} Quick action configurations
 */
export const getQuickActions = (phaseId) => {
  return [
    {
      id: 'view-modules',
      label: 'View All Modules',
      path: `/modules?phaseId=${phaseId}`,
      icon: 'CubeIcon',
      color: 'green'
    },
    {
      id: 'view-content',
      label: 'View Phase Content', 
      path: `/content?phaseId=${phaseId}`,
      icon: 'DocumentIcon',
      color: 'green'
    },
    {
      id: 'back-to-phases',
      label: 'Back to Phases',
      path: '/phases',
      icon: 'ArrowLeftIcon',
      color: 'gray',
      isAction: true
    }
  ];
};