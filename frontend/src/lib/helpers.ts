import {
  DIFFICULTY_BG_COLORS,
  DIFFICULTY_BORDER_COLORS,
  DIFFICULTY_COLORS,
  FILE_TYPE_ICONS,
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

/**
 * Check if user is currently logged in based on current path
 * In a real app, this would check auth tokens or context
 */
export const isUserLoggedIn = (): boolean => {
  const currentPath = window.location.pathname;
  return (
    currentPath.includes("/dashboard") ||
    currentPath.includes("/course/") ||
    currentPath.includes("/learn/") ||
    currentPath.includes("/overview")
  );
};

/**
 * Generate initials from a name string
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Terminal-related constants and utilities
export const DEFAULT_TERMINAL_COMMANDS = [
  "$ nmap -sS 192.168.1.0/24",
  "Scanning 256 hosts...",
  "Host 192.168.1.1 is up (0.001s latency)",
  "Host 192.168.1.15 is up (0.002s latency)",
  "22/tcp open ssh",
  "80/tcp open http",
  "443/tcp open https",
  "$ sqlmap -u 'http://target.com/login'",
  "Testing parameter 'username'...",
  "[CRITICAL] SQL injection vulnerability found!",
  "$ hydra -l admin -P passwords.txt ssh://target",
  "Attempting password brute force...",
  "[SUCCESS] Password found: admin123",
  "$ msfconsole",
  "Starting Metasploit Framework...",
  "msf6 > use exploit/multi/handler",
  "msf6 exploit(multi/handler) > set payload windows/meterpreter/reverse_tcp",
  "msf6 exploit(multi/handler) > exploit",
  "[*] Meterpreter session 1 opened",
  "$ clear",
] as const;

export const getTerminalLineColor = (line: string): string => {
  if (line.startsWith("$")) return "text-green-400";
  if (line.includes("CRITICAL") || line.includes("SUCCESS"))
    return "text-red-400";
  if (line.includes("open") || line.includes("up")) return "text-green-300";
  if (line.includes("msf6")) return "text-purple-400";
  return "text-green-300/80";
};

// Matrix rain characters for visual effects
export const MATRIX_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
