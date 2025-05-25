import {
  DIFFICULTY_BG_COLORS,
  DIFFICULTY_BORDER_COLORS,
  DIFFICULTY_COLORS,
  FILE_TYPE_ICONS,
  GAME_TYPES,
} from "./constants";

export const getDifficultyColor = (difficulty: string) => {
  return (
    DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] ||
    "text-gray-400"
  );
};

export const getDifficultyBgColor = (difficulty: string) => {
  return (
    DIFFICULTY_BG_COLORS[difficulty as keyof typeof DIFFICULTY_BG_COLORS] ||
    "bg-gray-400/10"
  );
};

export const getDifficultyBorderColor = (difficulty: string) => {
  return (
    DIFFICULTY_BORDER_COLORS[
      difficulty as keyof typeof DIFFICULTY_BORDER_COLORS
    ] || "border-gray-400/30"
  );
};

export const getFileTypeIcon = (type: string) => {
  return FILE_TYPE_ICONS[type as keyof typeof FILE_TYPE_ICONS] || "📄";
};

export const getGameTypeColor = (type: string) => {
  return GAME_TYPES[type as keyof typeof GAME_TYPES] || "text-gray-400";
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const calculateProgress = (completed: number, total: number) => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
