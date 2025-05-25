export const DIFFICULTY_COLORS = {
  Beginner: "text-green-400",
  Intermediate: "text-yellow-400",
  Advanced: "text-red-400",
  Expert: "text-purple-400",
} as const;

export const DIFFICULTY_BG_COLORS = {
  Beginner: "bg-green-400/10",
  Intermediate: "bg-yellow-400/10",
  Advanced: "bg-red-400/10",
  Expert: "bg-purple-400/10",
} as const;

export const DIFFICULTY_BORDER_COLORS = {
  Beginner: "border-green-400/30",
  Intermediate: "border-yellow-400/30",
  Advanced: "border-red-400/30",
  Expert: "border-purple-400/30",
} as const;

export const FILE_TYPE_ICONS = {
  pdf: "📄",
  video: "🎥",
  lab: "🧪",
  quiz: "❓",
  code: "💻",
  doc: "📝",
} as const;

export const GAME_TYPES = {
  "Cipher Challenge": "text-blue-400",
  "Hash Cracking": "text-red-400",
  "Port Scanning": "text-yellow-400",
  "Social Engineering": "text-purple-400",
  "Web Exploitation": "text-green-400",
} as const;

export const NAVIGATION_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PRICING: "/pricing",
  DASHBOARD: "/dashboard",
  OVERVIEW: "/overview",
  DEMO: "/demo",
} as const;

// Sample completed modules for demo purposes
export const COMPLETED_MODULES = [
  "foundations",
  "linux-basics",
  "networking-basics",
] as const;
