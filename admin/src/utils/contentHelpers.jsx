import {
  BeakerIcon,
  BookOpenIcon,
  DocumentIcon,
  PuzzlePieceIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

/**
 * Format duration in minutes to human-readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 60) {
    return `${minutes || 0} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

/**
 * Get icon component for content type
 * @param {string} type - Content type (video, lab, game, document)
 * @param {string} size - Icon size classes (default: "w-6 h-6")
 * @returns {JSX.Element} Icon component
 */
export const getContentTypeIcon = (type, size = "w-6 h-6") => {
  switch (type) {
    case "video":
      return <VideoCameraIcon className={size} />;
    case "lab":
      return <BeakerIcon className={size} />;
    case "game":
      return <PuzzlePieceIcon className={size} />;
    case "document":
      return <DocumentIcon className={size} />;
    default:
      return <BookOpenIcon className={size} />;
  }
};

/**
 * Get color classes for content type
 * @param {string} type - Content type (video, lab, game, document)
 * @returns {string} Tailwind CSS classes for colors
 */
export const getContentTypeColor = (type) => {
  const colors = {
    video: "bg-green-900/30 text-green-400 border-green-500/30",
    lab: "bg-blue-900/30 text-blue-400 border-blue-500/30",
    game: "bg-purple-900/30 text-purple-400 border-purple-500/30",
    document: "bg-green-900/30 text-green-400 border-green-500/30",
  };
  return colors[type] || "bg-gray-900/30 text-gray-400 border-gray-500/30";
};

/**
 * Get color classes for difficulty level
 * @param {string} difficulty - Difficulty level (beginner, intermediate, advanced, expert)
 * @returns {string} Tailwind CSS classes for colors
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: "bg-green-900/30 text-green-400 border-green-500/30",
    intermediate: "bg-yellow-900/30 text-yellow-400 border-yellow-500/30",
    advanced: "bg-red-900/30 text-red-400 border-red-500/30",
    expert: "bg-purple-900/30 text-purple-400 border-purple-500/30",
  };
  return (
    colors[difficulty] || "bg-gray-900/30 text-gray-400 border-gray-500/30"
  );
};

/**
 * Calculate statistics for a list of content items
 * @param {Array} contentList - Array of content items
 * @returns {Object} Statistics object with totalContent and totalDuration
 */
export const calculateContentStatistics = (contentList = []) => {
  return {
    totalContent: contentList.length,
    totalDuration: contentList.reduce(
      (sum, item) => sum + (item.duration || 0),
      0
    ),
  };
};
