// Enrollment Status Options
export const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "paused", label: "Paused" },
  { value: "dropped", label: "Dropped" },
];

// Status Colors for Badges
export const statusColors = {
  active: "bg-green-500 text-white",
  completed: "bg-blue-500 text-white",
  paused: "bg-yellow-500 text-black",
  dropped: "bg-red-500 text-white",
};

// View Modes
export const viewModes = [
  { value: "users", label: "Users", icon: "👥" },
  { value: "list", label: "List", icon: "📋" },
  { value: "grid", label: "Grid", icon: "⬜" },
  { value: "modules", label: "Modules", icon: "📚" },
  { value: "analytics", label: "Analytics", icon: "📊" },
];

// Module Filter Options
export const moduleFilterOptions = {
  sortBy: [
    { value: "title", label: "Title" },
    { value: "enrollments", label: "Enrollments" },
    { value: "completion", label: "Completion Rate" },
    { value: "difficulty", label: "Difficulty" },
  ],
  sortOrder: [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ],
};

// Status Configuration
export const statusConfigs = {
  active: { color: "bg-green-500", label: "Active", icon: "▶️" },
  completed: { color: "bg-blue-500", label: "Completed", icon: "✅" },
  paused: { color: "bg-yellow-500", label: "Paused", icon: "⏸️" },
  dropped: { color: "bg-red-500", label: "Dropped", icon: "❌" },
  default: { color: "bg-gray-500", label: "Unknown", icon: "❓" },
};

// Progress Color Mapping
export const progressColors = {
  excellent: "#10b981", // >= 80%
  good: "#3b82f6",      // >= 60%
  average: "#f59e0b",   // >= 40%
  poor: "#f97316",      // >= 20%
  critical: "#ef4444",  // < 20%
};

// Card Color Classes (following phases/modules pattern)
export const cardColorClasses = {
  cyan: "border-cyan-500/50 hover:border-cyan-400",
  green: "border-green-500/50 hover:border-green-400",
  blue: "border-blue-500/50 hover:border-blue-400",
  yellow: "border-yellow-500/50 hover:border-yellow-400",
  red: "border-red-500/50 hover:border-red-400",
  purple: "border-purple-500/50 hover:border-purple-400",
  pink: "border-pink-500/50 hover:border-pink-400",
  indigo: "border-indigo-500/50 hover:border-indigo-400",
  orange: "border-orange-500/50 hover:border-orange-400",
  gray: "border-gray-500/50 hover:border-gray-400",
};

// Size Classes for Components
export const sizeClasses = {
  xs: "w-2 h-2",
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  xl: "w-6 h-6",
};

// Animation Classes
export const animationClasses = {
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
  fadeIn: "transition-all duration-300 ease-in-out",
  scaleHover: "transform hover:scale-105 transition-transform duration-200",
};

// Progress Thresholds
export const progressThresholds = {
  excellent: 80,
  good: 60,
  average: 40,
  poor: 20,
};