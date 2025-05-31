// User-related static data
export const DEFAULT_USER = {
  id: "default-user",
  username: "agentsmith",
  email: "agent@terminal-hacks.academy",
  profile: {
    displayName: "Agent Smith",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  experienceLevel: "advanced" as const,
  stats: {
    totalPoints: 2847,
    level: 12,
    coursesCompleted: 8,
    labsCompleted: 24,
    gamesCompleted: 15,
    achievementsEarned: 12,
  },
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
} as const;

// User utility functions
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
