// User role color classes for dynamic styling
export const userRoleColorClasses = {
  admin: {
    border: "border-red-400/30",
    hoverBorder: "hover:border-red-400/50",
    bg: "bg-gradient-to-br from-red-900/60 to-black/80",
    hoverShadow: "hover:shadow-red-400/30",
    text: "text-red-400",
    hoverText: "group-hover:text-red-300",
    badge: "bg-red-400/20 border-red-400 text-red-400 shadow-red-400/30",
    button:
      "bg-red-400/10 border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 text-red-400",
    glow: "bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0",
    icon: "w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-red-400/30 shadow-lg shadow-red-400/30",
    iconText: "text-red-400",
  },
  student: {
    border: "border-blue-400/30",
    hoverBorder: "hover:border-blue-400/50",
    bg: "bg-gradient-to-br from-blue-900/60 to-black/80",
    hoverShadow: "hover:shadow-blue-400/30",
    text: "text-blue-400",
    hoverText: "group-hover:text-blue-300",
    badge: "bg-blue-400/20 border-blue-400 text-blue-400 shadow-blue-400/30",
    button:
      "bg-blue-400/10 border-blue-400/30 hover:bg-blue-400/20 hover:border-blue-400/50 text-blue-400",
    glow: "bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0",
    icon: "w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-blue-400/30 shadow-lg shadow-blue-400/30",
    iconText: "text-blue-400",
  },
  default: {
    border: "border-green-400/30",
    hoverBorder: "hover:border-green-400/50",
    bg: "bg-gradient-to-br from-green-900/60 to-black/80",
    hoverShadow: "hover:shadow-green-400/30",
    text: "text-green-400",
    hoverText: "group-hover:text-green-300",
    badge:
      "bg-green-400/20 border-green-400 text-green-400 shadow-green-400/30",
    button:
      "bg-green-400/10 border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 text-green-400",
    glow: "bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0",
    icon: "w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-green-400/30 shadow-lg shadow-green-400/30",
    iconText: "text-green-400",
  },
};

// Experience level color classes
export const experienceLevelColorClasses = {
  beginner: {
    badge: "bg-green-400/20 border-green-400 text-green-400",
    text: "text-green-400",
  },
  intermediate: {
    badge: "bg-yellow-400/20 border-yellow-400 text-yellow-400",
    text: "text-yellow-400",
  },
  advanced: {
    badge: "bg-orange-400/20 border-orange-400 text-orange-400",
    text: "text-orange-400",
  },
  expert: {
    badge: "bg-purple-400/20 border-purple-400 text-purple-400",
    text: "text-purple-400",
  },
};

/**
 * Get user role color classes
 * @param {string} role - User role (admin, student)
 * @returns {Object} Color classes for the role
 */
export const getUserRoleColorClasses = (role) => {
  return userRoleColorClasses[role] || userRoleColorClasses.default;
};

/**
 * Get experience level color classes
 * @param {string} level - Experience level
 * @returns {Object} Color classes for the experience level
 */
export const getExperienceLevelColorClasses = (level) => {
  return (
    experienceLevelColorClasses[level] || experienceLevelColorClasses.beginner
  );
};
