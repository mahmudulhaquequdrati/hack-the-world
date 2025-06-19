// Available Tailwind color options for modules
export const colorOptions = [
  "green",
  "blue",
  "red",
  "yellow",
  "purple",
  "pink",
  "indigo",
  "cyan",
  "orange",
  "gray",
  "emerald",
  "lime",
  "teal",
  "sky",
  "violet",
  "fuchsia",
  "rose",
  "slate",
  "zinc",
  "neutral",
  "stone",
  "amber",
];

// Difficulty levels for modules
export const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

// Get difficulty color classes based on difficulty level
export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "beginner":
      return {
        text: "text-green-400",
        border: "border-green-400/50",
        bg: "bg-green-400/10",
      };
    case "intermediate":
      return {
        text: "text-yellow-400",
        border: "border-yellow-400/50",
        bg: "bg-yellow-400/10",
      };
    case "advanced":
      return {
        text: "text-red-400",
        border: "border-red-400/50",
        bg: "bg-red-400/10",
      };
    case "expert":
      return {
        text: "text-purple-400",
        border: "border-purple-400/50",
        bg: "bg-purple-400/10",
      };
    default:
      return {
        text: "text-gray-400",
        border: "border-gray-400/50",
        bg: "bg-gray-400/10",
      };
  }
};

// Phase color theme classes for dynamic styling
export const phaseColorClasses = {
  green: {
    container:
      "bg-gradient-to-br from-green-900/30 to-black/80 border-2 border-green-400/30 shadow-2xl shadow-green-400/10 hover:border-green-400/50",
    glow: "bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0",
    border: "border-green-400/20",
    icon: "bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-400/50 text-green-400",
    title: "text-green-400",
    badge: "bg-green-400/20 border border-green-400/50 text-green-400",
    button:
      "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-400/20",
  },
  blue: {
    container:
      "bg-gradient-to-br from-blue-900/30 to-black/80 border-2 border-blue-400/30 shadow-2xl shadow-blue-400/10 hover:border-blue-400/50",
    glow: "bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0",
    border: "border-blue-400/20",
    icon: "bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-400/50 text-blue-400",
    title: "text-blue-400",
    badge: "bg-blue-400/20 border border-blue-400/50 text-blue-400",
    button:
      "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-400/20",
  },
  red: {
    container:
      "bg-gradient-to-br from-red-900/30 to-black/80 border-2 border-red-400/30 shadow-2xl shadow-red-400/10 hover:border-red-400/50",
    glow: "bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0",
    border: "border-red-400/20",
    icon: "bg-gradient-to-br from-red-400/20 to-red-600/20 border border-red-400/50 text-red-400",
    title: "text-red-400",
    badge: "bg-red-400/20 border border-red-400/50 text-red-400",
    button:
      "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-400/20",
  },
  purple: {
    container:
      "bg-gradient-to-br from-purple-900/30 to-black/80 border-2 border-purple-400/30 shadow-2xl shadow-purple-400/10 hover:border-purple-400/50",
    glow: "bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0",
    border: "border-purple-400/20",
    icon: "bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-400/50 text-purple-400",
    title: "text-purple-400",
    badge:
      "bg-purple-400/20 border border-purple-400/50 text-purple-400",
    button:
      "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-400/20",
  },
  cyan: {
    container:
      "bg-gradient-to-br from-cyan-900/30 to-black/80 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-400/10 hover:border-cyan-400/50",
    glow: "bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0",
    border: "border-cyan-400/20",
    icon: "bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 border border-cyan-400/50 text-cyan-400",
    title: "text-cyan-400",
    badge: "bg-cyan-400/20 border border-cyan-400/50 text-cyan-400",
    button:
      "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-400/20",
  },
};

// Get module color classes for styling
export const getModuleColorClasses = (color) => {
  const colorMap = {
    green: {
      border: "border-green-400/30 bg-gradient-to-br from-green-900/40 to-black/80 hover:border-green-400/50 hover:shadow-green-400/30",
      glow: "bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0",
      status: "bg-green-400 shadow-green-400/50",
      icon: "border-green-400/30 shadow-green-400/30",
      text: "text-green-400 group-hover:text-green-300",
      stats: "hover:border-green-400/50",
      badge: "bg-green-400/20 border-green-400 text-green-400 shadow-green-400/30",
      statText: "text-green-400",
      statSubtext: "text-green-400/60"
    },
    blue: {
      border: "border-blue-400/30 bg-gradient-to-br from-blue-900/40 to-black/80 hover:border-blue-400/50 hover:shadow-blue-400/30",
      glow: "bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0",
      status: "bg-blue-400 shadow-blue-400/50",
      icon: "border-blue-400/30 shadow-blue-400/30",
      text: "text-blue-400 group-hover:text-blue-300",
      stats: "hover:border-blue-400/50",
      badge: "bg-blue-400/20 border-blue-400 text-blue-400 shadow-blue-400/30",
      statText: "text-blue-400",
      statSubtext: "text-blue-400/60"
    },
    red: {
      border: "border-red-400/30 bg-gradient-to-br from-red-900/40 to-black/80 hover:border-red-400/50 hover:shadow-red-400/30",
      glow: "bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0",
      status: "bg-red-400 shadow-red-400/50",
      icon: "border-red-400/30 shadow-red-400/30",
      text: "text-red-400 group-hover:text-red-300",
      stats: "hover:border-red-400/50",
      badge: "bg-red-400/20 border-red-400 text-red-400 shadow-red-400/30",
      statText: "text-red-400",
      statSubtext: "text-red-400/60"
    },
    yellow: {
      border: "border-yellow-400/30 bg-gradient-to-br from-yellow-900/40 to-black/80 hover:border-yellow-400/50 hover:shadow-yellow-400/30",
      glow: "bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0",
      status: "bg-yellow-400 shadow-yellow-400/50",
      icon: "border-yellow-400/30 shadow-yellow-400/30",
      text: "text-yellow-400 group-hover:text-yellow-300",
      stats: "hover:border-yellow-400/50",
      badge: "bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-yellow-400/30",
      statText: "text-yellow-400",
      statSubtext: "text-yellow-400/60"
    },
    purple: {
      border: "border-purple-400/30 bg-gradient-to-br from-purple-900/40 to-black/80 hover:border-purple-400/50 hover:shadow-purple-400/30",
      glow: "bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0",
      status: "bg-purple-400 shadow-purple-400/50",
      icon: "border-purple-400/30 shadow-purple-400/30",
      text: "text-purple-400 group-hover:text-purple-300",
      stats: "hover:border-purple-400/50",
      badge: "bg-purple-400/20 border-purple-400 text-purple-400 shadow-purple-400/30",
      statText: "text-purple-400",
      statSubtext: "text-purple-400/60"
    },
    pink: {
      border: "border-pink-400/30 bg-gradient-to-br from-pink-900/40 to-black/80 hover:border-pink-400/50 hover:shadow-pink-400/30",
      glow: "bg-gradient-to-r from-pink-400/0 via-pink-400/10 to-pink-400/0",
      status: "bg-pink-400 shadow-pink-400/50",
      icon: "border-pink-400/30 shadow-pink-400/30",
      text: "text-pink-400 group-hover:text-pink-300",
      stats: "hover:border-pink-400/50",
      badge: "bg-pink-400/20 border-pink-400 text-pink-400 shadow-pink-400/30",
      statText: "text-pink-400",
      statSubtext: "text-pink-400/60"
    },
    indigo: {
      border: "border-indigo-400/30 bg-gradient-to-br from-indigo-900/40 to-black/80 hover:border-indigo-400/50 hover:shadow-indigo-400/30",
      glow: "bg-gradient-to-r from-indigo-400/0 via-indigo-400/10 to-indigo-400/0",
      status: "bg-indigo-400 shadow-indigo-400/50",
      icon: "border-indigo-400/30 shadow-indigo-400/30",
      text: "text-indigo-400 group-hover:text-indigo-300",
      stats: "hover:border-indigo-400/50",
      badge: "bg-indigo-400/20 border-indigo-400 text-indigo-400 shadow-indigo-400/30",
      statText: "text-indigo-400",
      statSubtext: "text-indigo-400/60"
    },
    cyan: {
      border: "border-cyan-400/30 bg-gradient-to-br from-cyan-900/40 to-black/80 hover:border-cyan-400/50 hover:shadow-cyan-400/30",
      glow: "bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0",
      status: "bg-cyan-400 shadow-cyan-400/50",
      icon: "border-cyan-400/30 shadow-cyan-400/30",
      text: "text-cyan-400 group-hover:text-cyan-300",
      stats: "hover:border-cyan-400/50",
      badge: "bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-cyan-400/30",
      statText: "text-cyan-400",
      statSubtext: "text-cyan-400/60"
    },
    orange: {
      border: "border-orange-400/30 bg-gradient-to-br from-orange-900/40 to-black/80 hover:border-orange-400/50 hover:shadow-orange-400/30",
      glow: "bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0",
      status: "bg-orange-400 shadow-orange-400/50",
      icon: "border-orange-400/30 shadow-orange-400/30",
      text: "text-orange-400 group-hover:text-orange-300",
      stats: "hover:border-orange-400/50",
      badge: "bg-orange-400/20 border-orange-400 text-orange-400 shadow-orange-400/30",
      statText: "text-orange-400",
      statSubtext: "text-orange-400/60"
    },
    gray: {
      border: "border-gray-400/30 bg-gradient-to-br from-gray-900/40 to-black/80 hover:border-gray-400/50 hover:shadow-gray-400/30",
      glow: "bg-gradient-to-r from-gray-400/0 via-gray-400/10 to-gray-400/0",
      status: "bg-gray-400 shadow-gray-400/50",
      icon: "border-gray-400/30 shadow-gray-400/30",
      text: "text-gray-400 group-hover:text-gray-300",
      stats: "hover:border-gray-400/50",
      badge: "bg-gray-400/20 border-gray-400 text-gray-400 shadow-gray-400/30",
      statText: "text-gray-400",
      statSubtext: "text-gray-400/60"
    }
  };
  
  return colorMap[color] || colorMap.green;
};