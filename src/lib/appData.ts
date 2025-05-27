import {
  Activity,
  Brain,
  Clock,
  Cloud,
  Code,
  Eye,
  Lightbulb,
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
import { Module, Phase } from "./types";

// Centralized Phases and Modules Data
export const PHASES_DATA: Phase[] = [
  {
    id: "beginner",
    title: "Beginner Phase",
    description: "Foundation courses for cybersecurity beginners",
    icon: Lightbulb,
    color: "text-green-400",
    modules: [
      {
        id: "foundations",
        title: "Cybersecurity Fundamentals",
        description: "Essential concepts, terminology, and security principles",
        icon: Shield,
        duration: "2-3 weeks",
        difficulty: "Beginner",
        progress: 85,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/30",
        topics: [
          "CIA Triad",
          "Risk Assessment",
          "Compliance",
          "Security Frameworks",
        ],
        path: "/course/foundations",
        enrollPath: "/learn/foundations",
        labs: 5,
        games: 3,
        assets: 12,
        enrolled: true,
        completed: true,
      },
      {
        id: "linux-basics",
        title: "Linux Command Line Basics",
        description: "Master the terminal and basic command-line operations",
        icon: Terminal,
        duration: "2-3 weeks",
        difficulty: "Beginner",
        progress: 70,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
        borderColor: "border-green-400/30",
        topics: [
          "Basic Commands",
          "File Navigation",
          "Text Processing",
          "Permissions",
        ],
        path: "/course/linux-basics",
        enrollPath: "/learn/linux-basics",
        labs: 8,
        games: 4,
        assets: 18,
        enrolled: true,
        completed: true,
      },
      {
        id: "networking-basics",
        title: "Networking Fundamentals",
        description: "Understanding network protocols and basic concepts",
        icon: Network,
        duration: "3-4 weeks",
        difficulty: "Beginner",
        progress: 60,
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        borderColor: "border-purple-400/30",
        topics: ["TCP/IP", "OSI Model", "DNS", "Basic Protocols"],
        path: "/course/networking-basics",
        enrollPath: "/learn/networking-basics",
        labs: 10,
        games: 5,
        assets: 20,
        enrolled: true,
        completed: true,
      },
      {
        id: "web-security-intro",
        title: "Introduction to Web Security",
        description:
          "Basic web application security concepts and common vulnerabilities",
        icon: Shield,
        duration: "2-3 weeks",
        difficulty: "Beginner",
        progress: 40,
        color: "text-cyan-400",
        bgColor: "bg-cyan-400/10",
        borderColor: "border-cyan-400/30",
        topics: ["HTTP/HTTPS", "Authentication", "Basic XSS", "CSRF Basics"],
        path: "/course/web-security-intro",
        enrollPath: "/learn/web-security-intro",
        labs: 6,
        games: 3,
        assets: 15,
        enrolled: true,
        completed: false,
      },
      {
        id: "digital-forensics-basics",
        title: "Digital Forensics Basics",
        description:
          "Introduction to digital evidence and investigation techniques",
        icon: Eye,
        duration: "2-3 weeks",
        difficulty: "Beginner",
        progress: 20,
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
        borderColor: "border-yellow-400/30",
        topics: [
          "Evidence Handling",
          "File Systems",
          "Basic Analysis",
          "Chain of Custody",
        ],
        path: "/course/digital-forensics-basics",
        enrollPath: "/learn/digital-forensics-basics",
        labs: 7,
        games: 4,
        assets: 16,
        enrolled: true,
        completed: false,
      },
      {
        id: "security-awareness",
        title: "Security Awareness & Policies",
        description:
          "Understanding security policies, compliance, and human factors",
        icon: Users,
        duration: "1-2 weeks",
        difficulty: "Beginner",
        progress: 0,
        color: "text-orange-400",
        bgColor: "bg-orange-400/10",
        borderColor: "border-orange-400/30",
        topics: [
          "Security Policies",
          "GDPR",
          "Phishing Awareness",
          "Password Security",
        ],
        path: "/course/security-awareness",
        enrollPath: "/learn/security-awareness",
        labs: 4,
        games: 6,
        assets: 10,
        enrolled: false,
        completed: false,
      },
    ],
  },
  {
    id: "intermediate",
    title: "Intermediate Phase",
    description: "Advanced security concepts and practical skills",
    icon: Target,
    color: "text-yellow-400",
    modules: [
      {
        id: "penetration-testing",
        title: "Penetration Testing Fundamentals",
        description: "Learn ethical hacking and penetration testing basics",
        icon: Target,
        duration: "4-5 weeks",
        difficulty: "Intermediate",
        progress: 0,
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        borderColor: "border-red-400/30",
        topics: [
          "Reconnaissance",
          "Vulnerability Assessment",
          "Exploitation",
          "Post-Exploitation",
        ],
        path: "/course/penetration-testing",
        enrollPath: "/learn/penetration-testing",
        labs: 15,
        games: 8,
        assets: 25,
        enrolled: false,
        completed: false,
      },
      {
        id: "advanced-networking",
        title: "Advanced Network Security",
        description:
          "Network monitoring, intrusion detection, and security protocols",
        icon: Wifi,
        duration: "4-5 weeks",
        difficulty: "Intermediate",
        progress: 30,
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        borderColor: "border-purple-400/30",
        topics: ["IDS/IPS", "VPNs", "Firewalls", "Network Monitoring"],
        path: "/course/advanced-networking",
        enrollPath: "/learn/advanced-networking",
        labs: 12,
        games: 6,
        assets: 25,
        enrolled: true,
        completed: false,
      },
      {
        id: "web-application-security",
        title: "Web Application Security",
        description: "Advanced web vulnerabilities and exploitation techniques",
        icon: Code,
        duration: "5-6 weeks",
        difficulty: "Intermediate",
        progress: 45,
        color: "text-cyan-400",
        bgColor: "bg-cyan-400/10",
        borderColor: "border-cyan-400/30",
        topics: [
          "OWASP Top 10",
          "SQL Injection",
          "XSS",
          "Authentication Bypass",
        ],
        path: "/course/web-application-security",
        enrollPath: "/learn/web-application-security",
        labs: 18,
        games: 10,
        assets: 30,
        enrolled: true,
        completed: false,
      },
      {
        id: "social-engineering-osint",
        title: "Social Engineering & OSINT",
        description: "Human psychology, information gathering, and awareness",
        icon: Users,
        duration: "3-4 weeks",
        difficulty: "Intermediate",
        progress: 15,
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
        borderColor: "border-yellow-400/30",
        topics: [
          "OSINT Techniques",
          "Phishing",
          "Social Psychology",
          "Defense Strategies",
        ],
        path: "/course/social-engineering-osint",
        enrollPath: "/learn/social-engineering-osint",
        labs: 10,
        games: 5,
        assets: 20,
        enrolled: true,
        completed: false,
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Phase",
    description: "Expert-level security specializations",
    icon: Brain,
    color: "text-red-400",
    modules: [
      {
        id: "malware-analysis",
        title: "Malware Analysis & Reverse Engineering",
        description: "Advanced malware analysis and reverse engineering",
        icon: Brain,
        duration: "6-8 weeks",
        difficulty: "Advanced",
        progress: 0,
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        borderColor: "border-red-400/30",
        topics: [
          "Static Analysis",
          "Dynamic Analysis",
          "Reverse Engineering",
          "Sandbox Evasion",
        ],
        path: "/course/malware-analysis",
        enrollPath: "/learn/malware-analysis",
        labs: 20,
        games: 12,
        assets: 35,
        enrolled: false,
        completed: false,
      },
      {
        id: "cloud-security",
        title: "Cloud Security Architecture",
        description: "Securing cloud environments and services",
        icon: Cloud,
        duration: "5-6 weeks",
        difficulty: "Advanced",
        progress: 0,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/30",
        topics: [
          "AWS Security",
          "Azure Security",
          "Container Security",
          "DevSecOps",
        ],
        path: "/course/cloud-security",
        enrollPath: "/learn/cloud-security",
        labs: 16,
        games: 8,
        assets: 28,
        enrolled: false,
        completed: false,
      },
      {
        id: "mobile-security",
        title: "Mobile Application Security",
        description: "iOS and Android security testing",
        icon: Smartphone,
        duration: "4-5 weeks",
        difficulty: "Advanced",
        progress: 0,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
        borderColor: "border-green-400/30",
        topics: [
          "iOS Security",
          "Android Security",
          "Mobile OWASP",
          "App Store Security",
        ],
        path: "/course/mobile-security",
        enrollPath: "/learn/mobile-security",
        labs: 14,
        games: 7,
        assets: 24,
        enrolled: false,
        completed: false,
      },
    ],
  },
];

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

// Utility functions for data access
export const getAllModules = (): Module[] => {
  return PHASES_DATA.flatMap((phase) => phase.modules);
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
  const phase = PHASES_DATA.find((p) => p.id === phaseId);
  if (!phase) return [];

  return enrolledOnly
    ? phase.modules.filter((module) => module.enrolled)
    : phase.modules;
};

export const getEnrolledPhases = (): Phase[] => {
  return PHASES_DATA.filter((phase) =>
    phase.modules.some((module) => module.enrolled)
  );
};

export const getPhaseById = (phaseId: string): Phase | undefined => {
  return PHASES_DATA.find((phase) => phase.id === phaseId);
};

export const getModuleById = (moduleId: string): Module | undefined => {
  return getAllModules().find((module) => module.id === moduleId);
};

// Dynamic stats calculation
export const getDashboardStats = () => {
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
      value: "12 days", // This would come from user activity data
      icon: Zap,
      color: "text-purple-400",
    },
  ];
};

// Calculate overall progress
export const getOverallProgress = (): number => {
  const allModules = getAllModules();
  if (allModules.length === 0) return 0;

  return Math.round(
    allModules.reduce((sum, module) => sum + module.progress, 0) /
      allModules.length
  );
};

// Calculate phase progress
export const getPhaseProgress = (phaseId: string): number => {
  const phaseModules = getModulesByPhase(phaseId, true);
  if (phaseModules.length === 0) return 0;

  return Math.round(
    phaseModules.reduce((sum, module) => sum + module.progress, 0) /
      phaseModules.length
  );
};

// Update module progress (for future state management)
export const updateModuleProgress = (
  moduleId: string,
  progress: number
): void => {
  const module = getModuleById(moduleId);
  if (module) {
    module.progress = progress;
    if (progress >= 100) {
      module.completed = true;
    }
  }
};

// Enroll in module
export const enrollInModule = (moduleId: string): void => {
  const module = getModuleById(moduleId);
  if (module) {
    module.enrolled = true;
  }
};

// Unenroll from module
export const unenrollFromModule = (moduleId: string): void => {
  const module = getModuleById(moduleId);
  if (module) {
    module.enrolled = false;
    module.progress = 0;
    module.completed = false;
  }
};
