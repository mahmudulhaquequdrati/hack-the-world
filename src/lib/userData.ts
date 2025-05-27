// User-related static data
export const DEFAULT_USER = {
  name: "Agent Smith",
  email: "agent@cybersec.academy",
  avatar:
    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
  level: "Elite Hacker",
  points: 2847,
} as const;

// User utility functions
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
