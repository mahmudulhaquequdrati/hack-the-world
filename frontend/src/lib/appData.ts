import {
  Activity,
  Brain,
  Clock,
  Cloud,
  Code,
  Eye,
  Lightbulb,
  LucideIcon,
  Network,
  Shield,
  Smartphone,
  Target,
  Terminal,
  Trophy,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { Course, GameData, LabData, Module, Phase } from "./types";

// =============================================================================
// NORMALIZED DATABASE-READY DATA STRUCTURE
// =============================================================================

// Core Entities - Separate arrays for database preparation
export const PHASES: Array<{
  id: string;
  title: string;
  description: string;
  icon: string; // Will store icon name for database
  color: string;
  order: number;
}> = [
  {
    id: "beginner",
    title: "Beginner Phase",
    description: "Foundation courses for cybersecurity beginners",
    icon: "Lightbulb",
    color: "text-green-400",
    order: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Phase",
    description: "Advanced security concepts and practical skills",
    icon: "Target",
    color: "text-yellow-400",
    order: 2,
  },
  {
    id: "advanced",
    title: "Advanced Phase",
    description: "Expert-level security specializations",
    icon: "Brain",
    color: "text-red-400",
    order: 3,
  },
];

export const MODULES: Array<{
  id: string;
  phaseId: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  difficulty: string;
  color: string;
  bgColor: string;
  borderColor: string;
  path: string;
  enrollPath: string;
  order: number;
}> = [
  // Beginner Phase Modules
  {
    id: "foundations",
    phaseId: "beginner",
    title: "Cybersecurity Fundamentals",
    description: "Essential concepts, terminology, and security principles",
    icon: "Shield",
    duration: "2-3 weeks",
    difficulty: "Beginner",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    path: "/course/foundations",
    enrollPath: "/learn/foundations",
    order: 1,
  },
  {
    id: "linux-basics",
    phaseId: "beginner",
    title: "Linux Command Line Basics",
    description: "Master the terminal and basic command-line operations",
    icon: "Terminal",
    duration: "2-3 weeks",
    difficulty: "Beginner",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
    path: "/course/linux-basics",
    enrollPath: "/learn/linux-basics",
    order: 2,
  },
  {
    id: "networking-basics",
    phaseId: "beginner",
    title: "Networking Fundamentals",
    description: "Understanding network protocols and basic concepts",
    icon: "Network",
    duration: "3-4 weeks",
    difficulty: "Beginner",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    path: "/course/networking-basics",
    enrollPath: "/learn/networking-basics",
    order: 3,
  },
  {
    id: "web-security-intro",
    phaseId: "beginner",
    title: "Introduction to Web Security",
    description:
      "Basic web application security concepts and common vulnerabilities",
    icon: "Shield",
    duration: "2-3 weeks",
    difficulty: "Beginner",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
    path: "/course/web-security-intro",
    enrollPath: "/learn/web-security-intro",
    order: 4,
  },
  {
    id: "digital-forensics-basics",
    phaseId: "beginner",
    title: "Digital Forensics Basics",
    description:
      "Introduction to digital evidence and investigation techniques",
    icon: "Eye",
    duration: "2-3 weeks",
    difficulty: "Beginner",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    path: "/course/digital-forensics-basics",
    enrollPath: "/learn/digital-forensics-basics",
    order: 5,
  },
  {
    id: "security-awareness",
    phaseId: "beginner",
    title: "Security Awareness & Policies",
    description:
      "Understanding security policies, compliance, and human factors",
    icon: "Users",
    duration: "1-2 weeks",
    difficulty: "Beginner",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30",
    path: "/course/security-awareness",
    enrollPath: "/learn/security-awareness",
    order: 6,
  },
  // Intermediate Phase Modules
  {
    id: "penetration-testing",
    phaseId: "intermediate",
    title: "Penetration Testing Fundamentals",
    description: "Learn ethical hacking and penetration testing basics",
    icon: "Target",
    duration: "4-5 weeks",
    difficulty: "Intermediate",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
    path: "/course/penetration-testing",
    enrollPath: "/learn/penetration-testing",
    order: 1,
  },
  {
    id: "advanced-networking",
    phaseId: "intermediate",
    title: "Advanced Network Security",
    description:
      "Network monitoring, intrusion detection, and security protocols",
    icon: "Wifi",
    duration: "4-5 weeks",
    difficulty: "Intermediate",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    path: "/course/advanced-networking",
    enrollPath: "/learn/advanced-networking",
    order: 2,
  },
  {
    id: "web-application-security",
    phaseId: "intermediate",
    title: "Web Application Security",
    description: "Advanced web vulnerabilities and exploitation techniques",
    icon: "Code",
    duration: "5-6 weeks",
    difficulty: "Intermediate",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
    path: "/course/web-application-security",
    enrollPath: "/learn/web-application-security",
    order: 3,
  },
  {
    id: "social-engineering-osint",
    phaseId: "intermediate",
    title: "Social Engineering & OSINT",
    description: "Human psychology, information gathering, and awareness",
    icon: "Users",
    duration: "3-4 weeks",
    difficulty: "Intermediate",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    path: "/course/social-engineering-osint",
    enrollPath: "/learn/social-engineering-osint",
    order: 4,
  },
  // Advanced Phase Modules
  {
    id: "malware-analysis",
    phaseId: "advanced",
    title: "Malware Analysis & Reverse Engineering",
    description: "Advanced malware analysis and reverse engineering",
    icon: "Brain",
    duration: "6-8 weeks",
    difficulty: "Advanced",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
    path: "/course/malware-analysis",
    enrollPath: "/learn/malware-analysis",
    order: 1,
  },
  {
    id: "cloud-security",
    phaseId: "advanced",
    title: "Cloud Security Architecture",
    description: "Securing cloud environments and services",
    icon: "Cloud",
    duration: "5-6 weeks",
    difficulty: "Advanced",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    path: "/course/cloud-security",
    enrollPath: "/learn/cloud-security",
    order: 2,
  },
  {
    id: "mobile-security",
    phaseId: "advanced",
    title: "Mobile Application Security",
    description: "iOS and Android security testing",
    icon: "Smartphone",
    duration: "4-5 weeks",
    difficulty: "Advanced",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
    path: "/course/mobile-security",
    enrollPath: "/learn/mobile-security",
    order: 3,
  },
];

export const ACHIEVEMENTS: Array<{
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  requirements: string[];
  points: number;
}> = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first module",
    icon: "Lightbulb",
    category: "milestone",
    requirements: ["complete_first_module"],
    points: 50,
  },
  {
    id: "terminal-master",
    title: "Terminal Master",
    description: "Complete all Linux fundamental modules",
    icon: "Terminal",
    category: "skill",
    requirements: ["complete_linux_basics"],
    points: 100,
  },
  {
    id: "web-warrior",
    title: "Web Warrior",
    description: "Find 10 web vulnerabilities",
    icon: "Shield",
    category: "challenge",
    requirements: ["find_10_vulnerabilities"],
    points: 200,
  },
  {
    id: "network-ninja",
    title: "Network Ninja",
    description: "Complete advanced network modules",
    icon: "Network",
    category: "skill",
    requirements: ["complete_advanced_networking"],
    points: 150,
  },
  {
    id: "penetration-pro",
    title: "Penetration Pro",
    description: "Complete advanced penetration testing",
    icon: "Activity",
    category: "skill",
    requirements: ["complete_penetration_testing"],
    points: 300,
  },
  {
    id: "forensics-expert",
    title: "Forensics Expert",
    description: "Master digital forensics techniques",
    icon: "Eye",
    category: "skill",
    requirements: ["complete_forensics_modules"],
    points: 250,
  },
  {
    id: "cloud-guardian",
    title: "Cloud Guardian",
    description: "Complete cloud security specialization",
    icon: "Cloud",
    category: "specialization",
    requirements: ["complete_cloud_security"],
    points: 400,
  },
  {
    id: "mobile-defender",
    title: "Mobile Defender",
    description: "Master mobile application security",
    icon: "Smartphone",
    category: "specialization",
    requirements: ["complete_mobile_security"],
    points: 350,
  },
];

// Topics - separate entity
export const TOPICS: Array<{
  id: string;
  name: string;
  category: string;
  description?: string;
}> = [
  // General Security Topics
  { id: "cia-triad", name: "CIA Triad", category: "fundamentals" },
  { id: "risk-assessment", name: "Risk Assessment", category: "fundamentals" },
  { id: "compliance", name: "Compliance", category: "fundamentals" },
  {
    id: "security-frameworks",
    name: "Security Frameworks",
    category: "fundamentals",
  },

  // Linux Topics
  { id: "basic-commands", name: "Basic Commands", category: "linux" },
  { id: "file-navigation", name: "File Navigation", category: "linux" },
  { id: "text-processing", name: "Text Processing", category: "linux" },
  { id: "permissions", name: "Permissions", category: "linux" },

  // Networking Topics
  { id: "tcp-ip", name: "TCP/IP", category: "networking" },
  { id: "osi-model", name: "OSI Model", category: "networking" },
  { id: "dns", name: "DNS", category: "networking" },
  { id: "basic-protocols", name: "Basic Protocols", category: "networking" },
  { id: "ids-ips", name: "IDS/IPS", category: "networking" },
  { id: "vpns", name: "VPNs", category: "networking" },
  { id: "firewalls", name: "Firewalls", category: "networking" },
  {
    id: "network-monitoring",
    name: "Network Monitoring",
    category: "networking",
  },

  // Web Security Topics
  { id: "http-https", name: "HTTP/HTTPS", category: "web-security" },
  { id: "authentication", name: "Authentication", category: "web-security" },
  { id: "basic-xss", name: "Basic XSS", category: "web-security" },
  { id: "csrf-basics", name: "CSRF Basics", category: "web-security" },
  { id: "owasp-top-10", name: "OWASP Top 10", category: "web-security" },
  { id: "sql-injection", name: "SQL Injection", category: "web-security" },
  { id: "xss", name: "XSS", category: "web-security" },
  {
    id: "authentication-bypass",
    name: "Authentication Bypass",
    category: "web-security",
  },

  // Forensics Topics
  { id: "evidence-handling", name: "Evidence Handling", category: "forensics" },
  { id: "file-systems", name: "File Systems", category: "forensics" },
  { id: "basic-analysis", name: "Basic Analysis", category: "forensics" },
  { id: "chain-of-custody", name: "Chain of Custody", category: "forensics" },

  // Security Awareness Topics
  {
    id: "security-policies",
    name: "Security Policies",
    category: "governance",
  },
  { id: "gdpr", name: "GDPR", category: "governance" },
  {
    id: "phishing-awareness",
    name: "Phishing Awareness",
    category: "governance",
  },
  {
    id: "password-security",
    name: "Password Security",
    category: "governance",
  },

  // Penetration Testing Topics
  { id: "reconnaissance", name: "Reconnaissance", category: "pen-testing" },
  {
    id: "vulnerability-assessment",
    name: "Vulnerability Assessment",
    category: "pen-testing",
  },
  { id: "exploitation", name: "Exploitation", category: "pen-testing" },
  {
    id: "post-exploitation",
    name: "Post-Exploitation",
    category: "pen-testing",
  },

  // OSINT Topics
  { id: "osint-techniques", name: "OSINT Techniques", category: "osint" },
  { id: "phishing", name: "Phishing", category: "osint" },
  { id: "social-psychology", name: "Social Psychology", category: "osint" },
  { id: "defense-strategies", name: "Defense Strategies", category: "osint" },

  // Malware Topics
  { id: "static-analysis", name: "Static Analysis", category: "malware" },
  { id: "dynamic-analysis", name: "Dynamic Analysis", category: "malware" },
  {
    id: "reverse-engineering",
    name: "Reverse Engineering",
    category: "malware",
  },
  { id: "sandbox-evasion", name: "Sandbox Evasion", category: "malware" },

  // Cloud Security Topics
  { id: "aws-security", name: "AWS Security", category: "cloud" },
  { id: "azure-security", name: "Azure Security", category: "cloud" },
  { id: "container-security", name: "Container Security", category: "cloud" },
  { id: "devsecops", name: "DevSecOps", category: "cloud" },

  // Mobile Security Topics
  { id: "ios-security", name: "iOS Security", category: "mobile" },
  { id: "android-security", name: "Android Security", category: "mobile" },
  { id: "mobile-owasp", name: "Mobile OWASP", category: "mobile" },
  { id: "app-store-security", name: "App Store Security", category: "mobile" },
];

// Module-Topics relationship (many-to-many)
export const MODULE_TOPICS: Array<{
  moduleId: string;
  topicId: string;
}> = [
  // Foundations module topics
  { moduleId: "foundations", topicId: "cia-triad" },
  { moduleId: "foundations", topicId: "risk-assessment" },
  { moduleId: "foundations", topicId: "compliance" },
  { moduleId: "foundations", topicId: "security-frameworks" },

  // Linux basics module topics
  { moduleId: "linux-basics", topicId: "basic-commands" },
  { moduleId: "linux-basics", topicId: "file-navigation" },
  { moduleId: "linux-basics", topicId: "text-processing" },
  { moduleId: "linux-basics", topicId: "permissions" },

  // Networking basics module topics
  { moduleId: "networking-basics", topicId: "tcp-ip" },
  { moduleId: "networking-basics", topicId: "osi-model" },
  { moduleId: "networking-basics", topicId: "dns" },
  { moduleId: "networking-basics", topicId: "basic-protocols" },

  // Web security intro module topics
  { moduleId: "web-security-intro", topicId: "http-https" },
  { moduleId: "web-security-intro", topicId: "authentication" },
  { moduleId: "web-security-intro", topicId: "basic-xss" },
  { moduleId: "web-security-intro", topicId: "csrf-basics" },

  // Digital forensics basics module topics
  { moduleId: "digital-forensics-basics", topicId: "evidence-handling" },
  { moduleId: "digital-forensics-basics", topicId: "file-systems" },
  { moduleId: "digital-forensics-basics", topicId: "basic-analysis" },
  { moduleId: "digital-forensics-basics", topicId: "chain-of-custody" },

  // Security awareness module topics
  { moduleId: "security-awareness", topicId: "security-policies" },
  { moduleId: "security-awareness", topicId: "gdpr" },
  { moduleId: "security-awareness", topicId: "phishing-awareness" },
  { moduleId: "security-awareness", topicId: "password-security" },

  // Penetration testing module topics
  { moduleId: "penetration-testing", topicId: "reconnaissance" },
  { moduleId: "penetration-testing", topicId: "vulnerability-assessment" },
  { moduleId: "penetration-testing", topicId: "exploitation" },
  { moduleId: "penetration-testing", topicId: "post-exploitation" },

  // Advanced networking module topics
  { moduleId: "advanced-networking", topicId: "ids-ips" },
  { moduleId: "advanced-networking", topicId: "vpns" },
  { moduleId: "advanced-networking", topicId: "firewalls" },
  { moduleId: "advanced-networking", topicId: "network-monitoring" },

  // Web application security module topics
  { moduleId: "web-application-security", topicId: "owasp-top-10" },
  { moduleId: "web-application-security", topicId: "sql-injection" },
  { moduleId: "web-application-security", topicId: "xss" },
  { moduleId: "web-application-security", topicId: "authentication-bypass" },

  // Social engineering and OSINT module topics
  { moduleId: "social-engineering-osint", topicId: "osint-techniques" },
  { moduleId: "social-engineering-osint", topicId: "phishing" },
  { moduleId: "social-engineering-osint", topicId: "social-psychology" },
  { moduleId: "social-engineering-osint", topicId: "defense-strategies" },

  // Malware analysis module topics
  { moduleId: "malware-analysis", topicId: "static-analysis" },
  { moduleId: "malware-analysis", topicId: "dynamic-analysis" },
  { moduleId: "malware-analysis", topicId: "reverse-engineering" },
  { moduleId: "malware-analysis", topicId: "sandbox-evasion" },

  // Cloud security module topics
  { moduleId: "cloud-security", topicId: "aws-security" },
  { moduleId: "cloud-security", topicId: "azure-security" },
  { moduleId: "cloud-security", topicId: "container-security" },
  { moduleId: "cloud-security", topicId: "devsecops" },

  // Mobile security module topics
  { moduleId: "mobile-security", topicId: "ios-security" },
  { moduleId: "mobile-security", topicId: "android-security" },
  { moduleId: "mobile-security", topicId: "mobile-owasp" },
  { moduleId: "mobile-security", topicId: "app-store-security" },
];

// Games - normalized structure
export const GAMES: Array<{
  id: string;
  moduleId: string;
  name: string;
  description: string;
  type: string;
  maxPoints: number;
  timeLimit?: string;
  difficulty: string;
  category: string;
  order: number;
}> = [
  // Foundations module games
  {
    id: "security-policy-builder",
    moduleId: "foundations",
    name: "Security Policy Builder",
    description: "Interactive game to build security policies",
    type: "Strategy",
    maxPoints: 100,
    timeLimit: "15 minutes",
    difficulty: "Beginner",
    category: "policy",
    order: 1,
  },
  {
    id: "risk-matrix-challenge",
    moduleId: "foundations",
    name: "Risk Matrix Challenge",
    description: "Calculate and prioritize security risks",
    type: "Puzzle",
    maxPoints: 150,
    timeLimit: "12 minutes",
    difficulty: "Beginner",
    category: "risk-management",
    order: 2,
  },
  {
    id: "cia-triad-simulator",
    moduleId: "foundations",
    name: "CIA Triad Simulator",
    description:
      "Practice implementing confidentiality, integrity, and availability",
    type: "Simulation",
    maxPoints: 130,
    timeLimit: "10 minutes",
    difficulty: "Beginner",
    category: "fundamentals",
    order: 3,
  },

  // Linux basics module games
  {
    id: "command-master",
    moduleId: "linux-basics",
    name: "Command Line Master",
    description: "Speed challenge for Linux command mastery",
    type: "Speed Challenge",
    maxPoints: 500,
    timeLimit: "5 minutes",
    difficulty: "Beginner",
    category: "command-line",
    order: 1,
  },
  {
    id: "file-system-navigator",
    moduleId: "linux-basics",
    name: "File System Navigator",
    description: "Navigate through complex directory structures",
    type: "Adventure",
    maxPoints: 200,
    timeLimit: "8 minutes",
    difficulty: "Beginner",
    category: "file-system",
    order: 2,
  },

  // Networking basics module games
  {
    id: "packet-sniffer",
    moduleId: "networking-basics",
    name: "Packet Sniffer Challenge",
    description: "Analyze network traffic to find threats",
    type: "Analysis Game",
    maxPoints: 400,
    timeLimit: "8 minutes",
    difficulty: "Intermediate",
    category: "traffic-analysis",
    order: 1,
  },
  {
    id: "protocol-detective",
    moduleId: "networking-basics",
    name: "Protocol Detective",
    description: "Identify and analyze network protocols",
    type: "Investigation",
    maxPoints: 300,
    timeLimit: "10 minutes",
    difficulty: "Intermediate",
    category: "protocol-analysis",
    order: 2,
  },

  // Web security intro module games
  {
    id: "xss-hunter",
    moduleId: "web-security-intro",
    name: "XSS Hunter Challenge",
    description: "Find and exploit Cross-Site Scripting vulnerabilities",
    type: "Security Challenge",
    maxPoints: 300,
    timeLimit: "10 minutes",
    difficulty: "Intermediate",
    category: "web-vulnerabilities",
    order: 1,
  },
  {
    id: "csrf-defender",
    moduleId: "web-security-intro",
    name: "CSRF Defender",
    description: "Protect applications from Cross-Site Request Forgery",
    type: "Defense",
    maxPoints: 250,
    timeLimit: "12 minutes",
    difficulty: "Intermediate",
    category: "web-defense",
    order: 2,
  },

  // Penetration testing module games
  {
    id: "recon-master",
    moduleId: "penetration-testing",
    name: "Reconnaissance Master",
    description: "Master information gathering techniques",
    type: "Investigation",
    maxPoints: 400,
    timeLimit: "15 minutes",
    difficulty: "Advanced",
    category: "reconnaissance",
    order: 1,
  },
  {
    id: "exploit-chain-builder",
    moduleId: "penetration-testing",
    name: "Exploit Chain Builder",
    description: "Chain multiple exploits together for maximum impact",
    type: "Strategy",
    maxPoints: 500,
    timeLimit: "20 minutes",
    difficulty: "Advanced",
    category: "exploitation",
    order: 2,
  },

  // Web application security module games
  {
    id: "sql-injection-master",
    moduleId: "web-application-security",
    name: "SQL Injection Master",
    description: "Master SQL injection techniques",
    type: "Technical",
    maxPoints: 450,
    timeLimit: "18 minutes",
    difficulty: "Advanced",
    category: "sql-injection",
    order: 1,
  },
  {
    id: "owasp-champion",
    moduleId: "web-application-security",
    name: "OWASP Top 10 Champion",
    description: "Master all OWASP Top 10 vulnerabilities",
    type: "Comprehensive",
    maxPoints: 600,
    timeLimit: "25 minutes",
    difficulty: "Expert",
    category: "comprehensive",
    order: 2,
  },
];

// Game Objectives - separate table
export const GAME_OBJECTIVES: Array<{
  id: string;
  gameId: string;
  objective: string;
  points: number;
  order: number;
}> = [
  // Security Policy Builder objectives
  {
    id: "spb-1",
    gameId: "security-policy-builder",
    objective: "Create comprehensive security policies",
    points: 25,
    order: 1,
  },
  {
    id: "spb-2",
    gameId: "security-policy-builder",
    objective: "Address compliance requirements",
    points: 20,
    order: 2,
  },
  {
    id: "spb-3",
    gameId: "security-policy-builder",
    objective: "Implement risk-based controls",
    points: 30,
    order: 3,
  },
  {
    id: "spb-4",
    gameId: "security-policy-builder",
    objective: "Complete policy review process",
    points: 25,
    order: 4,
  },

  // Risk Matrix Challenge objectives
  {
    id: "rmc-1",
    gameId: "risk-matrix-challenge",
    objective: "Identify risk factors",
    points: 30,
    order: 1,
  },
  {
    id: "rmc-2",
    gameId: "risk-matrix-challenge",
    objective: "Calculate risk scores",
    points: 40,
    order: 2,
  },
  {
    id: "rmc-3",
    gameId: "risk-matrix-challenge",
    objective: "Prioritize risks correctly",
    points: 50,
    order: 3,
  },
  {
    id: "rmc-4",
    gameId: "risk-matrix-challenge",
    objective: "Speed bonus for quick completion",
    points: 30,
    order: 4,
  },

  // CIA Triad Simulator objectives
  {
    id: "cts-1",
    gameId: "cia-triad-simulator",
    objective: "Implement confidentiality controls",
    points: 40,
    order: 1,
  },
  {
    id: "cts-2",
    gameId: "cia-triad-simulator",
    objective: "Ensure data integrity measures",
    points: 40,
    order: 2,
  },
  {
    id: "cts-3",
    gameId: "cia-triad-simulator",
    objective: "Maintain system availability",
    points: 40,
    order: 3,
  },
  {
    id: "cts-4",
    gameId: "cia-triad-simulator",
    objective: "Balance all three principles",
    points: 10,
    order: 4,
  },

  // Command Master objectives
  {
    id: "cm-1",
    gameId: "command-master",
    objective: "Complete 10 basic commands (10 pts each)",
    points: 100,
    order: 1,
  },
  {
    id: "cm-2",
    gameId: "command-master",
    objective: "Speed bonus for fast completion (5 pts each)",
    points: 50,
    order: 2,
  },
  {
    id: "cm-3",
    gameId: "command-master",
    objective: "Perfect syntax bonus (3 pts each)",
    points: 30,
    order: 3,
  },
  {
    id: "cm-4",
    gameId: "command-master",
    objective: "Combo multiplier after 5 correct (x2)",
    points: 320,
    order: 4,
  },

  // File System Navigator objectives
  {
    id: "fsn-1",
    gameId: "file-system-navigator",
    objective: "Find hidden files (25 pts each)",
    points: 75,
    order: 1,
  },
  {
    id: "fsn-2",
    gameId: "file-system-navigator",
    objective: "Navigate to target directories (15 pts each)",
    points: 45,
    order: 2,
  },
  {
    id: "fsn-3",
    gameId: "file-system-navigator",
    objective: "Complete navigation challenges",
    points: 50,
    order: 3,
  },
  {
    id: "fsn-4",
    gameId: "file-system-navigator",
    objective: "Discover secret paths",
    points: 30,
    order: 4,
  },

  // Packet Sniffer objectives
  {
    id: "ps-1",
    gameId: "packet-sniffer",
    objective: "Identify suspicious packets (25 pts each)",
    points: 100,
    order: 1,
  },
  {
    id: "ps-2",
    gameId: "packet-sniffer",
    objective: "Classify threat types (30 pts each)",
    points: 90,
    order: 2,
  },
  {
    id: "ps-3",
    gameId: "packet-sniffer",
    objective: "Find hidden payloads (50 pts each)",
    points: 100,
    order: 3,
  },
  {
    id: "ps-4",
    gameId: "packet-sniffer",
    objective: "Complete threat analysis",
    points: 110,
    order: 4,
  },

  // Protocol Detective objectives
  {
    id: "pd-1",
    gameId: "protocol-detective",
    objective: "Identify protocol types (20 pts each)",
    points: 80,
    order: 1,
  },
  {
    id: "pd-2",
    gameId: "protocol-detective",
    objective: "Analyze protocol behavior (30 pts each)",
    points: 90,
    order: 2,
  },
  {
    id: "pd-3",
    gameId: "protocol-detective",
    objective: "Detect protocol anomalies (40 pts each)",
    points: 80,
    order: 3,
  },
  {
    id: "pd-4",
    gameId: "protocol-detective",
    objective: "Complete protocol analysis",
    points: 50,
    order: 4,
  },

  // XSS Hunter objectives
  {
    id: "xh-1",
    gameId: "xss-hunter",
    objective: "Find 5 XSS vulnerabilities (20 pts each)",
    points: 100,
    order: 1,
  },
  {
    id: "xh-2",
    gameId: "xss-hunter",
    objective: "Bypass 3 input filters (30 pts each)",
    points: 90,
    order: 2,
  },
  {
    id: "xh-3",
    gameId: "xss-hunter",
    objective: "Execute DOM-based XSS",
    points: 50,
    order: 3,
  },
  {
    id: "xh-4",
    gameId: "xss-hunter",
    objective: "Steal session cookies",
    points: 60,
    order: 4,
  },

  // CSRF Defender objectives
  {
    id: "cd-1",
    gameId: "csrf-defender",
    objective: "Identify CSRF vulnerabilities (40 pts each)",
    points: 80,
    order: 1,
  },
  {
    id: "cd-2",
    gameId: "csrf-defender",
    objective: "Implement protection mechanisms (60 pts each)",
    points: 120,
    order: 2,
  },
  {
    id: "cd-3",
    gameId: "csrf-defender",
    objective: "Test defense effectiveness",
    points: 50,
    order: 3,
  },

  // Recon Master objectives
  {
    id: "rm-1",
    gameId: "recon-master",
    objective: "Perform OSINT gathering",
    points: 50,
    order: 1,
  },
  {
    id: "rm-2",
    gameId: "recon-master",
    objective: "Identify target services",
    points: 60,
    order: 2,
  },
  {
    id: "rm-3",
    gameId: "recon-master",
    objective: "Map network topology",
    points: 80,
    order: 3,
  },
  {
    id: "rm-4",
    gameId: "recon-master",
    objective: "Document findings",
    points: 60,
    order: 4,
  },
  {
    id: "rm-5",
    gameId: "recon-master",
    objective: "Create attack plan",
    points: 50,
    order: 5,
  },

  // Exploit Chain Builder objectives
  {
    id: "ecb-1",
    gameId: "exploit-chain-builder",
    objective: "Identify vulnerability chain",
    points: 80,
    order: 1,
  },
  {
    id: "ecb-2",
    gameId: "exploit-chain-builder",
    objective: "Execute initial compromise",
    points: 100,
    order: 2,
  },
  {
    id: "ecb-3",
    gameId: "exploit-chain-builder",
    objective: "Escalate privileges",
    points: 120,
    order: 3,
  },
  {
    id: "ecb-4",
    gameId: "exploit-chain-builder",
    objective: "Maintain persistence",
    points: 100,
    order: 4,
  },
  {
    id: "ecb-5",
    gameId: "exploit-chain-builder",
    objective: "Complete objective",
    points: 100,
    order: 5,
  },

  // SQL Injection Master objectives
  {
    id: "sim-1",
    gameId: "sql-injection-master",
    objective: "Identify injection points",
    points: 60,
    order: 1,
  },
  {
    id: "sim-2",
    gameId: "sql-injection-master",
    objective: "Bypass authentication",
    points: 80,
    order: 2,
  },
  {
    id: "sim-3",
    gameId: "sql-injection-master",
    objective: "Extract database schema",
    points: 100,
    order: 3,
  },
  {
    id: "sim-4",
    gameId: "sql-injection-master",
    objective: "Retrieve sensitive data",
    points: 120,
    order: 4,
  },
  {
    id: "sim-5",
    gameId: "sql-injection-master",
    objective: "Document exploitation",
    points: 90,
    order: 5,
  },

  // OWASP Champion objectives
  {
    id: "oc-1",
    gameId: "owasp-champion",
    objective: "Identify all 10 vulnerability types (20 pts each)",
    points: 200,
    order: 1,
  },
  {
    id: "oc-2",
    gameId: "owasp-champion",
    objective: "Exploit 5 different vulnerabilities (40 pts each)",
    points: 200,
    order: 2,
  },
  {
    id: "oc-3",
    gameId: "owasp-champion",
    objective: "Complete advanced challenge",
    points: 200,
    order: 3,
  },
];

// Labs - normalized structure
export const LABS: Array<{
  id: string;
  moduleId: string;
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  category: string;
  order: number;
}> = [
  // Foundations module labs
  {
    id: "risk-assessment-simulation",
    moduleId: "foundations",
    name: "Risk Assessment Simulation",
    description: "Hands-on risk assessment of a fictional company",
    difficulty: "Beginner",
    duration: "45 min",
    category: "risk-management",
    order: 1,
  },
  {
    id: "cia-triad-implementation",
    moduleId: "foundations",
    name: "CIA Triad Implementation",
    description:
      "Practical implementation of confidentiality, integrity, and availability",
    difficulty: "Beginner",
    duration: "30 min",
    category: "fundamentals",
    order: 2,
  },

  // Linux basics module labs
  {
    id: "file-system-mastery",
    moduleId: "linux-basics",
    name: "Linux File System Mastery",
    description: "Master Linux file system navigation and operations",
    difficulty: "Beginner",
    duration: "40 min",
    category: "file-system",
    order: 1,
  },
  {
    id: "command-line-fundamentals",
    moduleId: "linux-basics",
    name: "Command Line Fundamentals",
    description: "Essential command line skills for cybersecurity",
    difficulty: "Beginner",
    duration: "50 min",
    category: "command-line",
    order: 2,
  },

  // Networking basics module labs
  {
    id: "network-analysis-fundamentals",
    moduleId: "networking-basics",
    name: "Network Analysis Fundamentals",
    description: "Learn to analyze network traffic and protocols",
    difficulty: "Intermediate",
    duration: "60 min",
    category: "traffic-analysis",
    order: 1,
  },
];

// Lab Objectives - separate table
export const LAB_OBJECTIVES: Array<{
  id: string;
  labId: string;
  objective: string;
  order: number;
}> = [
  // Risk Assessment Simulation objectives
  {
    id: "ras-obj-1",
    labId: "risk-assessment-simulation",
    objective: "Analyze company infrastructure for risks",
    order: 1,
  },
  {
    id: "ras-obj-2",
    labId: "risk-assessment-simulation",
    objective: "Calculate risk scores using standard matrices",
    order: 2,
  },
  {
    id: "ras-obj-3",
    labId: "risk-assessment-simulation",
    objective: "Prioritize risks based on business impact",
    order: 3,
  },
  {
    id: "ras-obj-4",
    labId: "risk-assessment-simulation",
    objective: "Create comprehensive risk report",
    order: 4,
  },

  // CIA Triad Implementation objectives
  {
    id: "cti-obj-1",
    labId: "cia-triad-implementation",
    objective: "Implement confidentiality controls",
    order: 1,
  },
  {
    id: "cti-obj-2",
    labId: "cia-triad-implementation",
    objective: "Ensure data integrity mechanisms",
    order: 2,
  },
  {
    id: "cti-obj-3",
    labId: "cia-triad-implementation",
    objective: "Design availability safeguards",
    order: 3,
  },
  {
    id: "cti-obj-4",
    labId: "cia-triad-implementation",
    objective: "Test all three principles together",
    order: 4,
  },

  // File System Mastery objectives
  {
    id: "fsm-obj-1",
    labId: "file-system-mastery",
    objective: "Navigate complex directory structures",
    order: 1,
  },
  {
    id: "fsm-obj-2",
    labId: "file-system-mastery",
    objective: "Master file and directory operations",
    order: 2,
  },
  {
    id: "fsm-obj-3",
    labId: "file-system-mastery",
    objective: "Understand and modify permissions",
    order: 3,
  },
  {
    id: "fsm-obj-4",
    labId: "file-system-mastery",
    objective: "Find and manipulate hidden files",
    order: 4,
  },

  // Command Line Fundamentals objectives
  {
    id: "clf-obj-1",
    labId: "command-line-fundamentals",
    objective: "Master essential Linux commands",
    order: 1,
  },
  {
    id: "clf-obj-2",
    labId: "command-line-fundamentals",
    objective: "Understand command piping and redirection",
    order: 2,
  },
  {
    id: "clf-obj-3",
    labId: "command-line-fundamentals",
    objective: "Use text processing tools effectively",
    order: 3,
  },
  {
    id: "clf-obj-4",
    labId: "command-line-fundamentals",
    objective: "Create simple shell scripts",
    order: 4,
  },

  // Network Analysis Fundamentals objectives
  {
    id: "naf-obj-1",
    labId: "network-analysis-fundamentals",
    objective: "Capture and analyze network packets",
    order: 1,
  },
  {
    id: "naf-obj-2",
    labId: "network-analysis-fundamentals",
    objective: "Identify different network protocols",
    order: 2,
  },
  {
    id: "naf-obj-3",
    labId: "network-analysis-fundamentals",
    objective: "Detect suspicious network activity",
    order: 3,
  },
  {
    id: "naf-obj-4",
    labId: "network-analysis-fundamentals",
    objective: "Generate network analysis reports",
    order: 4,
  },
];

// Lab Steps - separate table
export const LAB_STEPS: Array<{
  id: string;
  labId: string;
  title: string;
  description: string;
  order: number;
}> = [
  // Risk Assessment Simulation steps
  {
    id: "ras-step-1",
    labId: "risk-assessment-simulation",
    title: "Asset Identification",
    description: "Identify and catalog all company assets",
    order: 1,
  },
  {
    id: "ras-step-2",
    labId: "risk-assessment-simulation",
    title: "Threat Analysis",
    description: "Analyze potential threats to each asset",
    order: 2,
  },
  {
    id: "ras-step-3",
    labId: "risk-assessment-simulation",
    title: "Vulnerability Assessment",
    description: "Identify vulnerabilities in systems and processes",
    order: 3,
  },
  {
    id: "ras-step-4",
    labId: "risk-assessment-simulation",
    title: "Risk Calculation",
    description: "Calculate risk scores using impact and likelihood",
    order: 4,
  },
  {
    id: "ras-step-5",
    labId: "risk-assessment-simulation",
    title: "Mitigation Planning",
    description: "Develop risk mitigation strategies",
    order: 5,
  },

  // CIA Triad Implementation steps
  {
    id: "cti-step-1",
    labId: "cia-triad-implementation",
    title: "Confidentiality Setup",
    description: "Configure encryption and access controls",
    order: 1,
  },
  {
    id: "cti-step-2",
    labId: "cia-triad-implementation",
    title: "Integrity Verification",
    description: "Implement checksums and digital signatures",
    order: 2,
  },
  {
    id: "cti-step-3",
    labId: "cia-triad-implementation",
    title: "Availability Design",
    description: "Set up redundancy and backup systems",
    order: 3,
  },
  {
    id: "cti-step-4",
    labId: "cia-triad-implementation",
    title: "Integration Testing",
    description: "Test all CIA components working together",
    order: 4,
  },

  // File System Mastery steps
  {
    id: "fsm-step-1",
    labId: "file-system-mastery",
    title: "Basic Navigation",
    description: "Use cd, ls, pwd to navigate the file system",
    order: 1,
  },
  {
    id: "fsm-step-2",
    labId: "file-system-mastery",
    title: "File Operations",
    description: "Create, copy, move, and delete files and directories",
    order: 2,
  },
  {
    id: "fsm-step-3",
    labId: "file-system-mastery",
    title: "Permission Management",
    description: "Understand and modify file permissions using chmod",
    order: 3,
  },
  {
    id: "fsm-step-4",
    labId: "file-system-mastery",
    title: "Advanced Features",
    description: "Work with hidden files, links, and special directories",
    order: 4,
  },

  // Command Line Fundamentals steps
  {
    id: "clf-step-1",
    labId: "command-line-fundamentals",
    title: "Core Commands",
    description: "Learn essential commands like grep, find, and ps",
    order: 1,
  },
  {
    id: "clf-step-2",
    labId: "command-line-fundamentals",
    title: "Pipes and Redirection",
    description: "Master command chaining and output redirection",
    order: 2,
  },
  {
    id: "clf-step-3",
    labId: "command-line-fundamentals",
    title: "Text Processing",
    description: "Use sed, awk, and other text processing tools",
    order: 3,
  },
  {
    id: "clf-step-4",
    labId: "command-line-fundamentals",
    title: "Basic Scripting",
    description: "Create simple shell scripts for automation",
    order: 4,
  },

  // Network Analysis Fundamentals steps
  {
    id: "naf-step-1",
    labId: "network-analysis-fundamentals",
    title: "Packet Capture Setup",
    description: "Configure packet capture tools and interfaces",
    order: 1,
  },
  {
    id: "naf-step-2",
    labId: "network-analysis-fundamentals",
    title: "Protocol Identification",
    description: "Identify and categorize different network protocols",
    order: 2,
  },
  {
    id: "naf-step-3",
    labId: "network-analysis-fundamentals",
    title: "Traffic Analysis",
    description: "Analyze traffic patterns and detect anomalies",
    order: 3,
  },
  {
    id: "naf-step-4",
    labId: "network-analysis-fundamentals",
    title: "Report Generation",
    description: "Create comprehensive analysis reports",
    order: 4,
  },
];

// =============================================================================
// ORIGINAL DATA STRUCTURE (Legacy - to be gradually replaced)
// =============================================================================

// Centralized Phases and Modules Data
// LEGACY: PHASES_DATA has been removed - Use getNormalizedPhases() instead
// All components now access phases data through the normalized array system
// This removal saves ~350 lines and improves bundle size

// Centralized Achievements Data
export const ACHIEVEMENTS_DATA = [
  {
    title: "First Steps",
    description: "Complete your first module",
    earned: true,
    icon: Lightbulb,
  },
  {
    title: "Terminal Master",
    description: "Complete all Linux fundamental modules",
    earned: true,
    icon: Terminal,
  },
  {
    title: "Web Warrior",
    description: "Find 10 web vulnerabilities",
    earned: false,
    icon: Shield,
  },
  {
    title: "Network Ninja",
    description: "Complete advanced network modules",
    earned: false,
    icon: Network,
  },
  {
    title: "Penetration Pro",
    description: "Complete advanced penetration testing",
    earned: false,
    icon: Activity,
  },
  {
    title: "Forensics Expert",
    description: "Master digital forensics techniques",
    earned: false,
    icon: Eye,
  },
  {
    title: "Cloud Guardian",
    description: "Complete cloud security specialization",
    earned: false,
    icon: Cloud,
  },
  {
    title: "Mobile Defender",
    description: "Master mobile application security",
    earned: false,
    icon: Smartphone,
  },
];

// Centralized Games Data connected to courses
// LEGACY: GAMES_DATA has been removed - Use getNormalizedGamesByModule() instead
// All game components now access games data through the normalized GAMES array
// This removal saves ~190 lines and improves bundle size

// Centralized Labs Data connected to courses
// LEGACY: LABS_DATA has been removed - Use getNormalizedLabsByModule() instead
// All lab components now access labs data through the normalized LABS array
// This removal saves ~330 lines and improves bundle size

// =============================================================================
// NEW NORMALIZED DATA HELPER FUNCTIONS
// =============================================================================

// Icon mapping for database to React icon conversion
const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  Target,
  Brain,
  Shield,
  Terminal,
  Network,
  Eye,
  Users,
  Wifi,
  Code,
  Cloud,
  Smartphone,
  Activity,
  Clock,
  Trophy,
  Zap,
};

// Helper functions for normalized data
export const getNormalizedPhases = (): Array<Phase> => {
  return PHASES.map((phase) => ({
    ...phase,
    icon: ICON_MAP[phase.icon] || Shield,
    modules: MODULES.filter((module) => module.phaseId === phase.id)
      .sort((a, b) => a.order - b.order)
      .map((module) => ({
        ...module,
        icon: ICON_MAP[module.icon] || Shield,
        topics: MODULE_TOPICS.filter((mt) => mt.moduleId === module.id)
          .map((mt) => TOPICS.find((t) => t.id === mt.topicId)?.name || "")
          .filter(Boolean),
        // Get progress and enrollment from normalized data
        progress:
          USER_PROGRESS.find((up) => up.moduleId === module.id)?.progress || 0,
        enrolled: USER_ENROLLMENTS.some(
          (ue) => ue.moduleId === module.id && ue.status !== "dropped"
        ),
        completed:
          USER_PROGRESS.find((up) => up.moduleId === module.id)?.completed ||
          false,
        // Get stats from normalized data
        labs:
          MODULE_STATS.find((ms) => ms.moduleId === module.id)?.labsCount || 0,
        games:
          MODULE_STATS.find((ms) => ms.moduleId === module.id)?.gamesCount || 0,
        assets:
          MODULE_STATS.find((ms) => ms.moduleId === module.id)?.assetsCount ||
          0,
      })),
  }));
};

export const getNormalizedModuleById = (
  moduleId: string
): Module | undefined => {
  const module = MODULES.find((m) => m.id === moduleId);
  if (!module) return undefined;

  const progress = USER_PROGRESS.find((up) => up.moduleId === moduleId);
  const enrollment = USER_ENROLLMENTS.find((ue) => ue.moduleId === moduleId);
  const stats = MODULE_STATS.find((ms) => ms.moduleId === moduleId);
  const topics = MODULE_TOPICS.filter((mt) => mt.moduleId === moduleId)
    .map((mt) => TOPICS.find((t) => t.id === mt.topicId)?.name || "")
    .filter(Boolean);

  return {
    ...module,
    icon: ICON_MAP[module.icon] || Shield,
    topics,
    progress: progress?.progress || 0,
    enrolled: Boolean(enrollment && enrollment.status !== "dropped"),
    completed: progress?.completed || false,
    labs: stats?.labsCount || 0,
    games: stats?.gamesCount || 0,
    assets: stats?.assetsCount || 0,
  };
};

export const getNormalizedGamesByModule = (
  moduleId: string
): { [gameId: string]: GameData } => {
  const moduleGames = GAMES.filter((game) => game.moduleId === moduleId);
  const result: { [gameId: string]: GameData } = {};

  moduleGames.forEach((game) => {
    const objectives = GAME_OBJECTIVES.filter((obj) => obj.gameId === game.id)
      .sort((a, b) => a.order - b.order)
      .map((obj) => `${obj.objective} (${obj.points} pts)`);

    result[game.id] = {
      name: game.name,
      description: game.description,
      type: game.type,
      maxPoints: game.maxPoints,
      timeLimit: game.timeLimit,
      objectives,
    };
  });

  return result;
};

export const getNormalizedLabsByModule = (
  moduleId: string
): { [labId: string]: LabData } => {
  const moduleLabs = LABS.filter((lab) => lab.moduleId === moduleId);
  const result: { [labId: string]: LabData } = {};

  moduleLabs.forEach((lab) => {
    const objectives = LAB_OBJECTIVES.filter((obj) => obj.labId === lab.id)
      .sort((a, b) => a.order - b.order)
      .map((obj) => obj.objective);

    const steps = LAB_STEPS.filter((step) => step.labId === lab.id)
      .sort((a, b) => a.order - b.order)
      .map((step) => ({
        id: step.id,
        title: step.title,
        description: step.description,
        completed: false, // Will be updated from USER_LAB_PROGRESS
      }));

    // Update step completion from user progress
    const userProgress = USER_LAB_PROGRESS.find((ulp) => ulp.labId === lab.id);
    if (userProgress) {
      steps.forEach((step) => {
        step.completed = userProgress.completedSteps.includes(step.id);
      });
    }

    result[lab.id] = {
      name: lab.name,
      description: lab.description,
      difficulty: lab.difficulty,
      duration: lab.duration,
      objectives,
      steps,
    };
  });

  return result;
};

export const getNormalizedUserStats = () => {
  const enrolledModules = USER_ENROLLMENTS.filter(
    (ue) => ue.status === "active" || ue.status === "completed"
  ).length;
  const completedModules = USER_PROGRESS.filter((up) => up.completed).length;
  const totalGamesCompleted = USER_GAME_PROGRESS.filter(
    (ugp) => ugp.completed
  ).length;
  const totalLabsCompleted = USER_LAB_PROGRESS.filter(
    (ulp) => ulp.completed
  ).length;
  const totalAchievements = USER_ACHIEVEMENTS.filter((ua) => ua.earned).length;

  const totalPoints = USER_GAME_PROGRESS.reduce(
    (sum, ugp) => sum + ugp.score,
    0
  );

  return {
    enrolledCourses: enrolledModules,
    completedCourses: completedModules,
    totalGames: totalGamesCompleted,
    totalLabs: totalLabsCompleted,
    totalAchievements,
    totalPoints,
    currentStreak: 7, // Calculate based on daily activity
    weeklyGoal: 12,
    weeklyProgress: 8,
  };
};

export const getNormalizedOverallProgress = (): number => {
  const allProgress = USER_PROGRESS.map((up) => up.progress);
  if (allProgress.length === 0) return 0;
  return Math.round(
    allProgress.reduce((sum, progress) => sum + progress, 0) /
      allProgress.length
  );
};

export const getNormalizedPhaseProgress = (phaseId: string): number => {
  const phaseModules = MODULES.filter((m) => m.phaseId === phaseId);
  const phaseProgress = phaseModules.map((module) => {
    const progress = USER_PROGRESS.find((up) => up.moduleId === module.id);
    return progress?.progress || 0;
  });

  if (phaseProgress.length === 0) return 0;
  return Math.round(
    phaseProgress.reduce((sum, progress) => sum + progress, 0) /
      phaseProgress.length
  );
};

// Update progress using normalized data
export const updateNormalizedModuleProgress = (
  moduleId: string,
  progress: number
): void => {
  const existingProgress = USER_PROGRESS.find((up) => up.moduleId === moduleId);

  if (existingProgress) {
    existingProgress.progress = progress;
    existingProgress.completed = progress >= 100;
    existingProgress.lastAccessedAt = new Date().toISOString();
    if (progress >= 100 && !existingProgress.completedAt) {
      existingProgress.completedAt = new Date().toISOString();
    }
  } else {
    USER_PROGRESS.push({
      id: `up-${Date.now()}`,
      userId: "user-1", // Default user for now
      moduleId,
      progress,
      completed: progress >= 100,
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      completedAt: progress >= 100 ? new Date().toISOString() : undefined,
    });
  }
};

// Enroll in module using normalized data
export const enrollInNormalizedModule = (moduleId: string): void => {
  const existingEnrollment = USER_ENROLLMENTS.find(
    (ue) => ue.moduleId === moduleId
  );

  if (!existingEnrollment) {
    USER_ENROLLMENTS.push({
      id: `ue-${Date.now()}`,
      userId: "user-1", // Default user for now
      moduleId,
      enrolledAt: new Date().toISOString(),
      status: "active",
    });
  } else if (existingEnrollment.status === "dropped") {
    existingEnrollment.status = "active";
    existingEnrollment.enrolledAt = new Date().toISOString();
  }
};

// Unenroll from module using normalized data
export const unenrollFromNormalizedModule = (moduleId: string): void => {
  const enrollment = USER_ENROLLMENTS.find((ue) => ue.moduleId === moduleId);
  if (enrollment) {
    enrollment.status = "dropped";
  }
};

// =============================================================================
// COURSE CONVERSION FROM NORMALIZED DATA
// =============================================================================

export const getNormalizedCourseById = (courseId: string): Course | null => {
  // Get raw module data from MODULES array
  const rawModule = MODULES.find((m) => m.id === courseId);
  if (!rawModule) return null;

  // Get normalized module for additional data like progress and enrollment
  const normalizedModule = getNormalizedModuleById(courseId);
  if (!normalizedModule) return null;

  const phase = PHASES.find((p) => p.id === rawModule.phaseId);
  const gamesData = getNormalizedGamesByModule(courseId);
  const labsData = getNormalizedLabsByModule(courseId);

  // Calculate actual counts from the data
  const actualLabsCount = Object.keys(labsData).length;
  const actualGamesCount = Object.keys(gamesData).length;

  // Calculate video lessons dynamically based on topics and estimated hours
  const moduleStats = MODULE_STATS.find((ms) => ms.moduleId === courseId);
  const estimatedHours = moduleStats?.estimatedHours || 40;
  const topicsCount = normalizedModule.topics.length;

  // Calculate lessons: use a more conservative approach
  // Priority: topics-based calculation for realistic lesson counts
  const topicsBasedLessons = Math.max(
    topicsCount,
    Math.ceil(topicsCount * 1.2)
  ); // 1-1.2 lessons per topic
  const activitiesBasedLessons = actualLabsCount + actualGamesCount + 2; // Activities + intro/conclusion
  const hoursBasedLessons = Math.floor(estimatedHours / 8); // More conservative: ~8 hours per lesson

  // For beginner modules with few topics, use even more conservative calculation
  const isBeginnerModule = rawModule.phaseId === "beginner" && topicsCount <= 4;
  const conservativeLessons = isBeginnerModule
    ? topicsCount
    : topicsBasedLessons;

  const calculatedLessons = isBeginnerModule
    ? topicsCount // For beginners: exactly 1 lesson per topic
    : Math.max(
        conservativeLessons,
        Math.min(activitiesBasedLessons, topicsCount + 2),
        Math.min(hoursBasedLessons, conservativeLessons * 1.5)
      );

  // Calculate assets dynamically - include guides, references, and exercise files
  const baseAssets = 3; // Guide, References, Practice Exercises
  const topicAssets = Math.floor(topicsCount / 2); // Additional assets per topic group
  const activityAssets = actualLabsCount + actualGamesCount; // Assets for each lab/game
  const calculatedAssets = baseAssets + topicAssets + activityAssets;

  // Convert games data to expected format
  const gamesArray = Object.entries(gamesData).map(([, game]) => ({
    name: game.name,
    description: game.description,
    points: game.maxPoints,
    type: game.type,
  }));

  // Convert labs data to expected format
  const labsArray = Object.entries(labsData).map(([, lab]) => ({
    name: lab.name,
    description: lab.description,
    difficulty: lab.difficulty,
    duration: lab.duration,
    skills: lab.objectives, // Using objectives as skills for compatibility
  }));

  // Generate curriculum structure with dynamic lesson counts
  const lessonsPerSection = Math.max(1, Math.floor(calculatedLessons / 3));
  const curriculum = [
    {
      title: "Foundation Concepts",
      lessons: lessonsPerSection,
      duration: `${Math.floor(lessonsPerSection * 0.4)}h ${Math.floor(
        ((lessonsPerSection * 0.4) % 1) * 60
      )}min`,
      topics: normalizedModule.topics.slice(0, Math.ceil(topicsCount / 3)) || [
        "Introduction",
        "Basic Concepts",
        "Practical Applications",
        "Best Practices",
      ],
      completed: normalizedModule.progress > 30,
    },
    {
      title: "Practical Applications",
      lessons: lessonsPerSection,
      duration: `${Math.floor(lessonsPerSection * 0.5)}h ${Math.floor(
        ((lessonsPerSection * 0.5) % 1) * 60
      )}min`,
      topics: normalizedModule.topics.slice(
        Math.ceil(topicsCount / 3),
        Math.ceil((topicsCount * 2) / 3)
      ) || [
        "Hands-on Practice",
        "Real-world Scenarios",
        "Tools and Techniques",
        "Case Studies",
      ],
      completed: normalizedModule.progress > 60,
    },
    {
      title: "Advanced Topics",
      lessons: calculatedLessons - lessonsPerSection * 2, // Remaining lessons
      duration: `${Math.floor(
        (calculatedLessons - lessonsPerSection * 2) * 0.45
      )}h ${Math.floor(
        (((calculatedLessons - lessonsPerSection * 2) * 0.45) % 1) * 60
      )}min`,
      topics: normalizedModule.topics.slice(
        Math.ceil((topicsCount * 2) / 3)
      ) || [
        "Advanced Techniques",
        "Best Practices",
        "Future Trends",
        "Final Assessment",
      ],
      completed: normalizedModule.progress >= 100,
    },
  ];

  // Generate learning outcomes
  const learningOutcomes = [
    {
      title: `Master ${rawModule.title} fundamentals`,
      description: `Understand the core concepts and principles of ${rawModule.title.toLowerCase()}.`,
      skills: normalizedModule.topics.slice(0, 3) || [
        "Foundation",
        "Concepts",
        "Principles",
      ],
    },
    {
      title: "Apply practical skills",
      description: `Learn to apply ${rawModule.title.toLowerCase()} techniques in real-world scenarios.`,
      skills: normalizedModule.topics.slice(3, 6) || [
        "Application",
        "Practice",
        "Implementation",
      ],
    },
    {
      title: "Achieve proficiency",
      description: `Develop advanced skills and best practices in ${rawModule.title.toLowerCase()}.`,
      skills: normalizedModule.topics.slice(6) || [
        "Advanced",
        "Best Practices",
        "Mastery",
      ],
    },
  ];

  // Generate dynamic assets based on content
  const assetsData = [
    { name: `${rawModule.title} Guide`, type: "PDF", size: "2.1 MB" },
    { name: "Reference Materials", type: "PDF", size: "1.5 MB" },
    { name: "Practice Exercises", type: "ZIP", size: "850 KB" },
    // Add topic-specific assets
    ...normalizedModule.topics
      .slice(0, Math.floor(topicsCount / 2))
      .map((topic) => ({
        name: `${topic} Cheat Sheet`,
        type: "PDF",
        size: `${Math.floor(Math.random() * 500 + 200)} KB`,
      })),
    // Add lab-specific assets
    ...labsArray.map((lab) => ({
      name: `${lab.name} Resources`,
      type: "ZIP",
      size: `${Math.floor(Math.random() * 2000 + 500)} KB`,
    })),
    // Add game-specific assets
    ...gamesArray.map((game) => ({
      name: `${game.name} Guide`,
      type: "PDF",
      size: `${Math.floor(Math.random() * 800 + 300)} KB`,
    })),
  ].slice(0, calculatedAssets); // Limit to calculated number of assets

  return {
    id: rawModule.id,
    title: rawModule.title,
    description: rawModule.description,
    category: phase?.title || "Cybersecurity",
    difficulty: rawModule.difficulty,
    duration: rawModule.duration,
    icon: normalizedModule.icon,
    color: rawModule.color,
    bgColor: rawModule.bgColor,
    borderColor: rawModule.borderColor,
    enrolled: normalizedModule.enrolled,
    progress: normalizedModule.progress,
    lessons: calculatedLessons, // Dynamic lesson count
    labs: actualLabsCount, // Actual labs count from data
    games: actualGamesCount, // Actual games count from data
    assets: calculatedAssets, // Dynamic assets count
    rating: 4.8,
    students: Math.floor(Math.random() * 5000) + 1000, // Random but consistent
    price:
      rawModule.phaseId === "beginner"
        ? "Free"
        : rawModule.phaseId === "intermediate"
        ? "$99"
        : "$149",
    skills: normalizedModule.topics,
    prerequisites:
      rawModule.phaseId === "beginner"
        ? "None - Perfect for beginners"
        : rawModule.phaseId === "intermediate"
        ? "Basic cybersecurity knowledge"
        : "Intermediate cybersecurity experience",
    certification: true,
    instructor: {
      name: "Terminal Hacks Expert",
      title: "Senior Security Specialist",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "10+ years in cybersecurity",
    },
    curriculum,
    learningOutcomes,
    labsData: labsArray,
    gamesData: gamesArray,
    assetsData,
    enrollPath: rawModule.enrollPath,
  };
};

// =============================================================================
// LEGACY FUNCTIONS - Will be gradually deprecated
// =============================================================================

// =============================================================================
// DETAILED PROGRESS CALCULATION FOR COURSE DETAILS
// =============================================================================

export const getDetailedCourseProgress = (courseId: string) => {
  // Get course data
  const course = getNormalizedCourseById(courseId);
  if (!course) return null;

  // Calculate totals from actual course content instead of raw data arrays
  // 1. Total lessons from curriculum sections
  const totalLessons = course.curriculum.reduce(
    (total, section) => total + section.lessons,
    0
  );

  // 2. Total labs from course labsData (what user actually sees)
  const totalLabs = course.labsData.length;

  // 3. Total games from course gamesData (what user actually sees)
  const totalGames = course.gamesData.length;

  // For completed counts, we need to map the course content back to actual IDs
  // Get the raw data to find IDs for games and labs in this module
  const moduleGames = GAMES.filter((game) => game.moduleId === courseId);
  const moduleLabs = LABS.filter((lab) => lab.moduleId === courseId);

  // Calculate completed counts using the actual IDs
  const completedGames = moduleGames.filter((game) =>
    USER_GAME_PROGRESS.some(
      (ugp) =>
        ugp.gameId === game.id && ugp.completed && ugp.userId === "user-1"
    )
  ).length;

  const completedLabs = moduleLabs.filter((lab) =>
    USER_LAB_PROGRESS.some(
      (ulp) => ulp.labId === lab.id && ulp.completed && ulp.userId === "user-1"
    )
  ).length;

  // For lessons: use USER_LESSON_PROGRESS (this stays the same)
  const moduleLessons = USER_LESSON_PROGRESS.filter(
    (lessonProgress) =>
      lessonProgress.moduleId === courseId && lessonProgress.userId === "user-1"
  );
  const completedLessons = moduleLessons.filter(
    (lesson) => lesson.completed
  ).length;

  // Get overall progress from USER_PROGRESS
  const userProgress = USER_PROGRESS.find(
    (up) => up.moduleId === courseId && up.userId === "user-1"
  );
  const overallProgress = userProgress?.progress || 0;

  // Calculate more granular progress breakdown
  const totalActivities = totalLessons + totalLabs + totalGames;
  const completedActivities = completedLessons + completedLabs + completedGames;

  // Calculate weighted progress (lessons are worth more)
  const lessonWeight = 0.6; // 60% of progress
  const labWeight = 0.25; // 25% of progress
  const gameWeight = 0.15; // 15% of progress

  const lessonProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const labProgress = totalLabs > 0 ? (completedLabs / totalLabs) * 100 : 0;
  const gameProgress = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;

  const weightedProgress = Math.round(
    lessonProgress * lessonWeight +
      labProgress * labWeight +
      gameProgress * gameWeight
  );

  return {
    overallProgress: Math.max(overallProgress, weightedProgress), // Use the higher of the two
    completedLessons,
    totalLessons, // Now calculated from course.curriculum
    completedLabs,
    totalLabs, // Now calculated from course.labsData
    completedGames,
    totalGames, // Now calculated from course.gamesData
    completedActivities,
    totalActivities,
    lessonProgress: Math.round(lessonProgress),
    labProgress: Math.round(labProgress),
    gameProgress: Math.round(gameProgress),
    isEnrolled: course.enrolled,
    lastAccessed: userProgress?.lastAccessedAt,
    startedAt: userProgress?.startedAt,
    completedAt: userProgress?.completedAt,
    isCompleted: userProgress?.completed || false,
  };
};

// =============================================================================

// =============================================================================
// NORMALIZED DATA ARRAYS - Core Data Structure
// =============================================================================

// Utility functions for data access
export const getAllModules = (): Module[] => {
  return getNormalizedPhases().flatMap((phase) => phase.modules);
};

export const getEnrolledModules = (): Module[] => {
  return getAllModules().filter((module) => module.enrolled);
};

export const getCompletedModules = (): Module[] => {
  return getAllModules().filter((module) => module.completed);
};

export const getModulesByPhase = (
  phaseId: string,
  enrolledOnly: boolean = false
): Module[] => {
  const normalizedPhases = getNormalizedPhases();
  const phase = normalizedPhases.find((p) => p.id === phaseId);
  if (!phase) return [];

  return enrolledOnly
    ? phase.modules.filter((module) => module.enrolled)
    : phase.modules;
};

export const getEnrolledPhases = (): Phase[] => {
  return getNormalizedPhases().filter((phase) =>
    phase.modules.some((module) => module.enrolled)
  );
};

export const getPhaseById = (phaseId: string): Phase | undefined => {
  return getNormalizedPhases().find((phase) => phase.id === phaseId);
};

export const getModuleById = (moduleId: string): Module | undefined => {
  return getNormalizedModuleById(moduleId);
};

// Dynamic stats calculation
export const getDashboardStats = () => {
  const userStats = getNormalizedUserStats();
  const completedModules = getCompletedModules();

  return [
    {
      label: "Modules Completed",
      value: completedModules.length.toString(),
      icon: Target,
      color: "text-green-400",
    },
    {
      label: "Hours Practiced",
      value: "89", // This could be calculated based on module progress
      icon: Clock,
      color: "text-blue-400",
    },
    {
      label: "Rank",
      value: "#342", // This would come from user data
      icon: Trophy,
      color: "text-yellow-400",
    },
    {
      label: "Current Streak",
      value: `${userStats.currentStreak} days`,
      icon: Zap,
      color: "text-purple-400",
    },
  ];
};

// Calculate overall progress
export const getOverallProgress = (): number => {
  return getNormalizedOverallProgress();
};

// Calculate phase progress
export const getPhaseProgress = (phaseId: string): number => {
  return getNormalizedPhaseProgress(phaseId);
};

// Update module progress (for future state management)
export const updateModuleProgress = (
  moduleId: string,
  progress: number
): void => {
  updateNormalizedModuleProgress(moduleId, progress);
};

// Enroll in module
export const enrollInModule = (moduleId: string): void => {
  enrollInNormalizedModule(moduleId);
};

// Unenroll from module
export const unenrollFromModule = (moduleId: string): void => {
  unenrollFromNormalizedModule(moduleId);
};

// Helper functions to get data by course and module
export const getGamesByModule = (
  moduleId: string
): { [gameId: string]: GameData } => {
  return getNormalizedGamesByModule(moduleId);
};

export const getLabsByModule = (
  moduleId: string
): { [labId: string]: LabData } => {
  return getNormalizedLabsByModule(moduleId);
};

export const getGameData = (
  moduleId: string,
  gameId: string
): GameData | null => {
  const moduleGames = getNormalizedGamesByModule(moduleId);
  return moduleGames?.[gameId] || null;
};

export const getLabData = (moduleId: string, labId: string): LabData | null => {
  const moduleLabs = getNormalizedLabsByModule(moduleId);
  return moduleLabs?.[labId] || null;
};

export const getAllGamesForPhase = (
  phaseId: string
): { [gameId: string]: GameData } => {
  const normalizedPhases = getNormalizedPhases();
  const phase = normalizedPhases.find((p) => p.id === phaseId);
  if (!phase) return {};

  const allGames: { [gameId: string]: GameData } = {};
  phase.modules.forEach((module) => {
    const moduleGames = getNormalizedGamesByModule(module.id);
    Object.assign(allGames, moduleGames);
  });

  return allGames;
};

export const getAllLabsForPhase = (
  phaseId: string
): { [labId: string]: LabData } => {
  const normalizedPhases = getNormalizedPhases();
  const phase = normalizedPhases.find((p) => p.id === phaseId);
  if (!phase) return {};

  const allLabs: { [labId: string]: LabData } = {};
  phase.modules.forEach((module) => {
    const moduleLabs = getNormalizedLabsByModule(module.id);
    Object.assign(allLabs, moduleLabs);
  });

  return allLabs;
};

// User Progress - separate tracking
export const USER_PROGRESS: Array<{
  id: string;
  userId: string; // Will be used when user system is implemented
  moduleId: string;
  progress: number; // 0-100
  completed: boolean;
  completedAt?: string; // ISO date string
  startedAt?: string; // ISO date string
  lastAccessedAt?: string; // ISO date string
}> = [
  // Sample user progress (assuming user ID "user-1" for now)
  {
    id: "up-1",
    userId: "user-1",
    moduleId: "foundations",
    progress: 85,
    completed: true,
    completedAt: "2024-01-15T10:00:00Z",
    startedAt: "2024-01-01T09:00:00Z",
    lastAccessedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "up-2",
    userId: "user-1",
    moduleId: "linux-basics",
    progress: 70,
    completed: true,
    completedAt: "2024-01-20T14:30:00Z",
    startedAt: "2024-01-05T11:00:00Z",
    lastAccessedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "up-3",
    userId: "user-1",
    moduleId: "networking-basics",
    progress: 60,
    completed: true,
    completedAt: "2024-01-25T16:45:00Z",
    startedAt: "2024-01-10T13:00:00Z",
    lastAccessedAt: "2024-01-25T16:45:00Z",
  },
  {
    id: "up-4",
    userId: "user-1",
    moduleId: "web-security-intro",
    progress: 40,
    completed: false,
    startedAt: "2024-01-15T15:00:00Z",
    lastAccessedAt: "2024-01-28T09:30:00Z",
  },
  {
    id: "up-5",
    userId: "user-1",
    moduleId: "digital-forensics-basics",
    progress: 20,
    completed: false,
    startedAt: "2024-01-20T10:00:00Z",
    lastAccessedAt: "2024-01-27T14:15:00Z",
  },
  {
    id: "up-6",
    userId: "user-1",
    moduleId: "advanced-networking",
    progress: 30,
    completed: false,
    startedAt: "2024-01-25T12:00:00Z",
    lastAccessedAt: "2024-01-29T11:20:00Z",
  },
  {
    id: "up-7",
    userId: "user-1",
    moduleId: "web-application-security",
    progress: 45,
    completed: false,
    startedAt: "2024-01-22T14:00:00Z",
    lastAccessedAt: "2024-01-30T16:40:00Z",
  },
  {
    id: "up-8",
    userId: "user-1",
    moduleId: "social-engineering-osint",
    progress: 15,
    completed: false,
    startedAt: "2024-01-28T09:00:00Z",
    lastAccessedAt: "2024-01-30T13:25:00Z",
  },
];

// User Enrollments - separate tracking
export const USER_ENROLLMENTS: Array<{
  id: string;
  userId: string;
  moduleId: string;
  enrolledAt: string; // ISO date string
  status: "active" | "completed" | "paused" | "dropped";
}> = [
  // Sample user enrollments (assuming user ID "user-1" for now)
  {
    id: "ue-1",
    userId: "user-1",
    moduleId: "foundations",
    enrolledAt: "2024-01-01T09:00:00Z",
    status: "completed",
  },
  {
    id: "ue-2",
    userId: "user-1",
    moduleId: "linux-basics",
    enrolledAt: "2024-01-05T11:00:00Z",
    status: "completed",
  },
  {
    id: "ue-3",
    userId: "user-1",
    moduleId: "networking-basics",
    enrolledAt: "2024-01-10T13:00:00Z",
    status: "completed",
  },
  {
    id: "ue-4",
    userId: "user-1",
    moduleId: "web-security-intro",
    enrolledAt: "2024-01-15T15:00:00Z",
    status: "active",
  },
  {
    id: "ue-5",
    userId: "user-1",
    moduleId: "digital-forensics-basics",
    enrolledAt: "2024-01-20T10:00:00Z",
    status: "active",
  },
  {
    id: "ue-6",
    userId: "user-1",
    moduleId: "advanced-networking",
    enrolledAt: "2024-01-25T12:00:00Z",
    status: "active",
  },
  {
    id: "ue-7",
    userId: "user-1",
    moduleId: "web-application-security",
    enrolledAt: "2024-01-22T14:00:00Z",
    status: "active",
  },
  {
    id: "ue-8",
    userId: "user-1",
    moduleId: "social-engineering-osint",
    enrolledAt: "2024-01-28T09:00:00Z",
    status: "active",
  },
];

// User Game Progress - track game completion and scores
export const USER_GAME_PROGRESS: Array<{
  id: string;
  userId: string;
  gameId: string;
  completed: boolean;
  score: number;
  maxScore: number;
  completedAt?: string; // ISO date string
  attempts: number;
}> = [
  // Sample game progress
  {
    id: "ugp-1",
    userId: "user-1",
    gameId: "security-policy-builder",
    completed: true,
    score: 95,
    maxScore: 100,
    completedAt: "2024-01-10T14:30:00Z",
    attempts: 2,
  },
  {
    id: "ugp-2",
    userId: "user-1",
    gameId: "risk-matrix-challenge",
    completed: true,
    score: 140,
    maxScore: 150,
    completedAt: "2024-01-12T16:15:00Z",
    attempts: 1,
  },
  {
    id: "ugp-3",
    userId: "user-1",
    gameId: "command-master",
    completed: false,
    score: 280,
    maxScore: 500,
    attempts: 2,
  },
  {
    id: "ugp-4",
    userId: "user-1",
    gameId: "packet-sniffer",
    completed: false,
    score: 120,
    maxScore: 400,
    attempts: 1,
  },
  {
    id: "ugp-5",
    userId: "user-1",
    gameId: "file-system-navigator",
    completed: false,
    score: 80,
    maxScore: 200,
    attempts: 1,
  },
];

// User Lab Progress - track lab completion and step progress
export const USER_LAB_PROGRESS: Array<{
  id: string;
  userId: string;
  labId: string;
  completed: boolean;
  completedSteps: string[]; // Array of step IDs
  completedAt?: string; // ISO date string
  startedAt?: string; // ISO date string
}> = [
  // Sample lab progress
  {
    id: "ulp-1",
    userId: "user-1",
    labId: "risk-assessment-simulation",
    completed: true,
    completedSteps: [
      "ras-step-1",
      "ras-step-2",
      "ras-step-3",
      "ras-step-4",
      "ras-step-5",
    ],
    completedAt: "2024-01-08T17:20:00Z",
    startedAt: "2024-01-08T16:35:00Z",
  },
  {
    id: "ulp-2",
    userId: "user-1",
    labId: "cia-triad-implementation",
    completed: true,
    completedSteps: ["cti-step-1", "cti-step-2", "cti-step-3", "cti-step-4"],
    completedAt: "2024-01-14T15:10:00Z",
    startedAt: "2024-01-14T14:40:00Z",
  },

  // Linux-basics lab progress (1/2 labs completed)
  {
    id: "ulp-6",
    userId: "user-1",
    labId: "file-system-mastery",
    completed: true,
    completedSteps: ["fsm-step-1", "fsm-step-2", "fsm-step-3", "fsm-step-4"],
    completedAt: "2024-01-15T18:30:00Z",
    startedAt: "2024-01-15T17:45:00Z",
  },
  {
    id: "ulp-7",
    userId: "user-1",
    labId: "command-line-fundamentals",
    completed: false,
    completedSteps: ["clf-step-1", "clf-step-2"],
    startedAt: "2024-01-21T15:20:00Z",
  },

  {
    id: "ulp-4",
    userId: "user-1",
    labId: "network-analysis-fundamentals",
    completed: false,
    completedSteps: ["naf-step-1", "naf-step-2"],
    startedAt: "2024-01-26T10:15:00Z",
  },
  {
    id: "ulp-5",
    userId: "user-1",
    labId: "command-line-fundamentals",
    completed: false,
    completedSteps: ["clf-step-1"],
    startedAt: "2024-01-21T15:20:00Z",
  },
];

// User Lesson Progress - track lesson completion
export const USER_LESSON_PROGRESS: Array<{
  id: string;
  userId: string;
  moduleId: string;
  lessonIndex: number; // 0-based index of lesson in course
  completed: boolean;
  completedAt?: string; // ISO date string
  startedAt?: string; // ISO date string
  watchTime?: number; // in seconds
}> = [
  // Sample lesson progress for foundations module
  {
    id: "lp-1",
    userId: "user-1",
    moduleId: "foundations",
    lessonIndex: 0,
    completed: true,
    completedAt: "2024-01-05T14:30:00Z",
    startedAt: "2024-01-05T14:00:00Z",
    watchTime: 1800, // 30 minutes
  },
  {
    id: "lp-2",
    userId: "user-1",
    moduleId: "foundations",
    lessonIndex: 1,
    completed: true,
    completedAt: "2024-01-06T15:45:00Z",
    startedAt: "2024-01-06T15:00:00Z",
    watchTime: 2700, // 45 minutes
  },
  {
    id: "lp-3",
    userId: "user-1",
    moduleId: "foundations",
    lessonIndex: 2,
    completed: true,
    completedAt: "2024-01-07T16:20:00Z",
    startedAt: "2024-01-07T15:30:00Z",
    watchTime: 3000, // 50 minutes
  },

  // Sample lesson progress for linux-basics module (70% progress = 3/4 lessons)
  {
    id: "lp-4",
    userId: "user-1",
    moduleId: "linux-basics",
    lessonIndex: 0,
    completed: true,
    completedAt: "2024-01-10T11:30:00Z",
    startedAt: "2024-01-10T10:45:00Z",
    watchTime: 2400, // 40 minutes
  },
  {
    id: "lp-5",
    userId: "user-1",
    moduleId: "linux-basics",
    lessonIndex: 1,
    completed: true,
    completedAt: "2024-01-12T14:15:00Z",
    startedAt: "2024-01-12T13:30:00Z",
    watchTime: 2700, // 45 minutes
  },
  {
    id: "lp-6",
    userId: "user-1",
    moduleId: "linux-basics",
    lessonIndex: 2,
    completed: true,
    completedAt: "2024-01-14T16:45:00Z",
    startedAt: "2024-01-14T16:00:00Z",
    watchTime: 2700, // 45 minutes
  },
  // Note: lesson 3 (index 3) is not completed, so 3/4 = 75% which aligns with 70% overall progress

  // Sample lesson progress for networking-basics module (60% progress = 2/4 lessons)
  {
    id: "lp-7",
    userId: "user-1",
    moduleId: "networking-basics",
    lessonIndex: 0,
    completed: true,
    completedAt: "2024-01-16T10:30:00Z",
    startedAt: "2024-01-16T09:45:00Z",
    watchTime: 2700, // 45 minutes
  },
  {
    id: "lp-8",
    userId: "user-1",
    moduleId: "networking-basics",
    lessonIndex: 1,
    completed: true,
    completedAt: "2024-01-18T13:20:00Z",
    startedAt: "2024-01-18T12:30:00Z",
    watchTime: 3000, // 50 minutes
  },
  // Note: lessons 2 and 3 are not completed, so 2/4 = 50% which is close to 60% overall progress

  // Sample lesson progress for web-security-intro module (40% progress = 1/3 lessons)
  {
    id: "lp-9",
    userId: "user-1",
    moduleId: "web-security-intro",
    lessonIndex: 0,
    completed: true,
    completedAt: "2024-01-20T15:45:00Z",
    startedAt: "2024-01-20T15:00:00Z",
    watchTime: 2700, // 45 minutes
  },
  // Note: lessons 1 and 2 are not completed, so 1/3 = 33% which is close to 40% overall progress
];

// User Achievement Progress - track earned achievements
export const USER_ACHIEVEMENTS: Array<{
  id: string;
  userId: string;
  achievementId: string;
  earned: boolean;
  earnedAt?: string; // ISO date string
  progress?: number; // 0-100 for progressive achievements
}> = [
  // Sample achievement progress
  {
    id: "ua-1",
    userId: "user-1",
    achievementId: "first-steps",
    earned: true,
    earnedAt: "2024-01-15T10:00:00Z",
    progress: 100,
  },
  {
    id: "ua-2",
    userId: "user-1",
    achievementId: "terminal-master",
    earned: true,
    earnedAt: "2024-01-20T14:30:00Z",
    progress: 100,
  },
  {
    id: "ua-3",
    userId: "user-1",
    achievementId: "web-warrior",
    earned: false,
    progress: 30,
  }, // 3 out of 10 vulnerabilities found
  {
    id: "ua-4",
    userId: "user-1",
    achievementId: "network-ninja",
    earned: false,
    progress: 60,
  }, // Partial completion
  {
    id: "ua-5",
    userId: "user-1",
    achievementId: "penetration-pro",
    earned: false,
    progress: 0,
  },
  {
    id: "ua-6",
    userId: "user-1",
    achievementId: "forensics-expert",
    earned: false,
    progress: 20,
  },
  {
    id: "ua-7",
    userId: "user-1",
    achievementId: "cloud-guardian",
    earned: false,
    progress: 0,
  },
  {
    id: "ua-8",
    userId: "user-1",
    achievementId: "mobile-defender",
    earned: false,
    progress: 0,
  },
];

// Module Statistics - separate tracking for labs, games, assets count
export const MODULE_STATS: Array<{
  moduleId: string;
  labsCount: number;
  gamesCount: number;
  assetsCount: number;
  averageDuration: string;
  estimatedHours: number;
}> = [
  {
    moduleId: "foundations",
    labsCount: 5,
    gamesCount: 3,
    assetsCount: 12,
    averageDuration: "2-3 weeks",
    estimatedHours: 40,
  },
  {
    moduleId: "linux-basics",
    labsCount: 8,
    gamesCount: 4,
    assetsCount: 18,
    averageDuration: "2-3 weeks",
    estimatedHours: 45,
  },
  {
    moduleId: "networking-basics",
    labsCount: 10,
    gamesCount: 5,
    assetsCount: 20,
    averageDuration: "3-4 weeks",
    estimatedHours: 55,
  },
  {
    moduleId: "web-security-intro",
    labsCount: 6,
    gamesCount: 3,
    assetsCount: 15,
    averageDuration: "2-3 weeks",
    estimatedHours: 35,
  },
  {
    moduleId: "digital-forensics-basics",
    labsCount: 7,
    gamesCount: 4,
    assetsCount: 16,
    averageDuration: "2-3 weeks",
    estimatedHours: 42,
  },
  {
    moduleId: "security-awareness",
    labsCount: 4,
    gamesCount: 6,
    assetsCount: 10,
    averageDuration: "1-2 weeks",
    estimatedHours: 25,
  },
  {
    moduleId: "penetration-testing",
    labsCount: 15,
    gamesCount: 8,
    assetsCount: 25,
    averageDuration: "4-5 weeks",
    estimatedHours: 75,
  },
  {
    moduleId: "advanced-networking",
    labsCount: 12,
    gamesCount: 6,
    assetsCount: 25,
    averageDuration: "4-5 weeks",
    estimatedHours: 70,
  },
  {
    moduleId: "web-application-security",
    labsCount: 18,
    gamesCount: 10,
    assetsCount: 30,
    averageDuration: "5-6 weeks",
    estimatedHours: 85,
  },
  {
    moduleId: "social-engineering-osint",
    labsCount: 10,
    gamesCount: 5,
    assetsCount: 20,
    averageDuration: "3-4 weeks",
    estimatedHours: 50,
  },
  {
    moduleId: "malware-analysis",
    labsCount: 20,
    gamesCount: 12,
    assetsCount: 35,
    averageDuration: "6-8 weeks",
    estimatedHours: 100,
  },
  {
    moduleId: "cloud-security",
    labsCount: 16,
    gamesCount: 8,
    assetsCount: 28,
    averageDuration: "5-6 weeks",
    estimatedHours: 80,
  },
  {
    moduleId: "mobile-security",
    labsCount: 14,
    gamesCount: 7,
    assetsCount: 24,
    averageDuration: "4-5 weeks",
    estimatedHours: 65,
  },
];

// =============================================================================
// VIDEO COUNTING UTILITIES
// =============================================================================

/**
 * Count videos for a specific module based on curriculum topics
 * Videos are topics that are NOT labs or games (don't contain "Lab" or "Game")
 */
export const getVideosCountForModule = (moduleId: string): number => {
  const course = getNormalizedCourseById(moduleId);
  if (!course || !course.curriculum) return 0;

  let videoCount = 0;
  course.curriculum.forEach((section) => {
    if (section.topics) {
      // Count topics that are videos (not labs or games)
      const videosInSection = section.topics.filter((topic) => {
        const topicLower = topic.toLowerCase();
        return !topicLower.includes("lab") && !topicLower.includes("game");
      }).length;
      videoCount += videosInSection;
    }
  });

  return videoCount;
};

/**
 * Get total videos count for a phase
 */
export const getVideosCountForPhase = (phaseId: string): number => {
  const normalizedPhases = getNormalizedPhases();
  const phase = normalizedPhases.find((p) => p.id === phaseId);
  if (!phase) return 0;

  return phase.modules.reduce((total, module) => {
    return total + getVideosCountForModule(module.id);
  }, 0);
};

/**
 * Get total labs count for a phase using real data
 */
export const getLabsCountForPhase = (phaseId: string): number => {
  const normalizedPhases = getNormalizedPhases();
  const phase = normalizedPhases.find((p) => p.id === phaseId);
  if (!phase) return 0;

  return phase.modules.reduce((total, module) => {
    const labsData = getNormalizedLabsByModule(module.id);
    return total + Object.keys(labsData).length;
  }, 0);
};

/**
 * Get total games count for a phase using real data
 */
export const getGamesCountForPhase = (phaseId: string): number => {
  const normalizedPhases = getNormalizedPhases();
  const phase = normalizedPhases.find((p) => p.id === phaseId);
  if (!phase) return 0;

  return phase.modules.reduce((total, module) => {
    const gamesData = getNormalizedGamesByModule(module.id);
    return total + Object.keys(gamesData).length;
  }, 0);
};

/**
 * Get comprehensive phase stats including videos - FULLY DYNAMIC
 */
export const getPhaseStats = (phaseId: string) => {
  const normalizedPhases = getNormalizedPhases();
  const phase = normalizedPhases.find((p) => p.id === phaseId);
  if (!phase) return null;

  const coursesCount = phase.modules.length;
  const videosCount = getVideosCountForPhase(phaseId);
  const labsCount = getLabsCountForPhase(phaseId);
  const gamesCount = getGamesCountForPhase(phaseId);

  return {
    courses: coursesCount,
    videos: videosCount,
    labs: labsCount,
    games: gamesCount,
  };
};
