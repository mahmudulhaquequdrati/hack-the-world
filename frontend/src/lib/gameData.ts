// Game-related static data
export const GAME_TYPES = [
  "Strategy",
  "Puzzle",
  "Simulation",
  "Educational",
  "Speed",
  "CTF",
  "Hunt",
  "Configuration",
  "Analysis",
  "Investigation",
  "Security",
  "Defense",
  "Forensics",
  "Exploitation",
  "Stealth",
  "Advanced",
  "Documentation",
  "Technical",
  "Evasion",
] as const;

export const GAME_TYPE_COLORS = {
  strategy: "text-purple-400 bg-purple-400/20 border-purple-400/30",
  puzzle: "text-blue-400 bg-blue-400/20 border-blue-400/30",
  simulation: "text-cyan-400 bg-cyan-400/20 border-cyan-400/30",
  educational: "text-green-400 bg-green-400/20 border-green-400/30",
  speed: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
  ctf: "text-red-400 bg-red-400/20 border-red-400/30",
  hunt: "text-orange-400 bg-orange-400/20 border-orange-400/30",
  configuration: "text-indigo-400 bg-indigo-400/20 border-indigo-400/30",
  analysis: "text-blue-400 bg-blue-400/20 border-blue-400/30",
  investigation: "text-cyan-400 bg-cyan-400/20 border-cyan-400/30",
  security: "text-green-400 bg-green-400/20 border-green-400/30",
  defense: "text-red-400 bg-red-400/20 border-red-400/30",
  forensics: "text-purple-400 bg-purple-400/20 border-purple-400/30",
  exploitation: "text-red-400 bg-red-400/20 border-red-400/30",
  stealth: "text-gray-400 bg-gray-400/20 border-gray-400/30",
  advanced: "text-red-400 bg-red-400/20 border-red-400/30",
  documentation: "text-blue-400 bg-blue-400/20 border-blue-400/30",
  technical: "text-green-400 bg-green-400/20 border-green-400/30",
  evasion: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
} as const;

export const POINTS_COLORS = {
  high: "text-red-400 bg-red-400/20 border-red-400/30", // 300+
  medium: "text-orange-400 bg-orange-400/20 border-orange-400/30", // 200-299
  low: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30", // 150-199
  basic: "text-green-400 bg-green-400/20 border-green-400/30", // <150
} as const;

export const PHASE_COLORS = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
} as const;

export const PHASE_ICONS = {
  beginner: "🌱",
  intermediate: "🎯",
  advanced: "🧠",
} as const;

// Common port constants for port scanning games
export const PORT_SCAN_PORTS = [22, 80, 443, 3389, 21] as const;

// Utility functions for games
export const getGameTypeColor = (type: string): string => {
  const normalizedType = type.toLowerCase() as keyof typeof GAME_TYPE_COLORS;
  return (
    GAME_TYPE_COLORS[normalizedType] ||
    "text-gray-400 bg-gray-400/20 border-gray-400/30"
  );
};

export const getPointsColor = (points: number): string => {
  if (points >= 300) return POINTS_COLORS.high;
  if (points >= 200) return POINTS_COLORS.medium;
  if (points >= 150) return POINTS_COLORS.low;
  return POINTS_COLORS.basic;
};

export const getPhaseColor = (phaseId: string): string => {
  return PHASE_COLORS[phaseId as keyof typeof PHASE_COLORS] || "text-blue-400";
};

export const getPhaseIcon = (phaseId: string): string => {
  return PHASE_ICONS[phaseId as keyof typeof PHASE_ICONS] || "🎮";
};
