/**
 * User utility functions for admin panel
 */

/**
 * Get role badge styling
 * @param {string} role - User role (admin, student)
 * @returns {string} CSS classes for role badge
 */
export const getUserRoleBadge = (role) => {
  const styles = {
    admin: "bg-red-900/20 text-red-400 border-red-500",
    student: "bg-blue-900/20 text-blue-400 border-blue-500"
  };
  return styles[role] || styles.student;
};

/**
 * Get experience level badge styling
 * @param {string} level - Experience level (beginner, intermediate, advanced, expert)
 * @returns {string} CSS classes for experience badge
 */
export const getExperienceBadge = (level) => {
  const styles = {
    beginner: "bg-green-900/20 text-green-400 border-green-500",
    intermediate: "bg-yellow-900/20 text-yellow-400 border-yellow-500",
    advanced: "bg-orange-900/20 text-orange-400 border-orange-500",
    expert: "bg-purple-900/20 text-purple-400 border-purple-500"
  };
  return styles[level] || styles.beginner;
};

/**
 * Get admin status badge styling
 * @param {string} status - Admin status (pending, active, suspended)
 * @returns {string} CSS classes for admin status badge
 */
export const getAdminStatusBadge = (status) => {
  const styles = {
    active: "bg-green-900/20 text-green-400 border-green-500",
    pending: "bg-yellow-900/20 text-yellow-400 border-yellow-500",
    suspended: "bg-red-900/20 text-red-400 border-red-500"
  };
  return styles[status] || styles.pending;
};

/**
 * Get streak status color
 * @param {string} status - Streak status (start, active, at_risk, broken)
 * @returns {string} CSS color class
 */
export const getStreakStatusColor = (status) => {
  const colors = {
    start: "text-gray-400",
    active: "text-green-400",
    at_risk: "text-yellow-400",
    broken: "text-red-400"
  };
  return colors[status] || colors.start;
};

/**
 * Get content type icon component
 * @param {string} type - Content type (video, lab, game, document)
 * @returns {Function} Icon component
 */
export const getContentTypeIcon = (type) => {
  // These would need to be imported from heroicons
  const iconMap = {
    video: 'BookOpenIcon',
    lab: 'BeakerIcon', 
    game: 'PuzzlePieceIcon',
    document: 'DocumentTextIcon'
  };
  return iconMap[type] || iconMap.document;
};

/**
 * Format user display name
 * @param {Object} user - User object
 * @returns {string} Formatted display name
 */
export const formatUserDisplayName = (user) => {
  if (user.profile?.displayName) {
    return user.profile.displayName;
  }
  if (user.profile?.firstName && user.profile?.lastName) {
    return `${user.profile.firstName} ${user.profile.lastName}`;
  }
  return user.username || user.email;
};

/**
 * Calculate user completion percentage
 * @param {Object} stats - User statistics
 * @returns {number} Completion percentage
 */
export const calculateCompletionPercentage = (stats) => {
  if (!stats) return 0;
  
  const total = (stats.coursesCompleted || 0) + 
                (stats.labsCompleted || 0) + 
                (stats.gamesCompleted || 0);
  
  // This is a rough calculation - you might want to adjust based on your requirements
  return Math.min(100, total * 5); // Assuming 20 completions = 100%
};

/**
 * Handle API errors with user-friendly messages
 * @param {Error} error - API error
 * @param {string} defaultMessage - Default error message
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return defaultMessage;
};