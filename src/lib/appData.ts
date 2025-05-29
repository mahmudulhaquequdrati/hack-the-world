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
import { GameData, LabData, Module, Phase } from "./types";

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

// Centralized Games Data connected to courses
export const GAMES_DATA: { [key: string]: { [gameId: string]: GameData } } = {
  foundations: {
    "security-policy-builder": {
      name: "Security Policy Builder",
      description: "Interactive game to build security policies",
      type: "Strategy",
      maxPoints: 100,
      timeLimit: "15 minutes",
      objectives: [
        "Create comprehensive security policies (25 pts)",
        "Address compliance requirements (20 pts)",
        "Implement risk-based controls (30 pts)",
        "Complete policy review process (25 pts)",
      ],
    },
    "risk-matrix-challenge": {
      name: "Risk Matrix Challenge",
      description: "Calculate and prioritize security risks",
      type: "Puzzle",
      maxPoints: 150,
      timeLimit: "12 minutes",
      objectives: [
        "Identify risk factors (30 pts)",
        "Calculate risk scores (40 pts)",
        "Prioritize risks correctly (50 pts)",
        "Speed bonus for quick completion (30 pts)",
      ],
    },
    "cia-triad-simulator": {
      name: "CIA Triad Simulator",
      description:
        "Practice implementing confidentiality, integrity, and availability",
      type: "Simulation",
      maxPoints: 130,
      timeLimit: "10 minutes",
      objectives: [
        "Implement confidentiality controls (40 pts)",
        "Ensure data integrity measures (40 pts)",
        "Maintain system availability (40 pts)",
        "Balance all three principles (10 pts)",
      ],
    },
  },
  "linux-basics": {
    "command-master": {
      name: "Command Line Master",
      description: "Speed challenge for Linux command mastery",
      type: "Speed Challenge",
      maxPoints: 500,
      timeLimit: "5 minutes",
      objectives: [
        "Complete 10 basic commands (10 pts each)",
        "Speed bonus for fast completion (5 pts each)",
        "Perfect syntax bonus (3 pts each)",
        "Combo multiplier after 5 correct (x2)",
      ],
    },
    "file-system-navigator": {
      name: "File System Navigator",
      description: "Navigate through complex directory structures",
      type: "Adventure",
      maxPoints: 200,
      timeLimit: "8 minutes",
      objectives: [
        "Find hidden files (25 pts each)",
        "Navigate to target directories (15 pts each)",
        "Complete navigation challenges (50 pts)",
        "Discover secret paths (30 pts)",
      ],
    },
  },
  "networking-basics": {
    "packet-sniffer": {
      name: "Packet Sniffer Challenge",
      description: "Analyze network traffic to find threats",
      type: "Analysis Game",
      maxPoints: 400,
      timeLimit: "8 minutes",
      objectives: [
        "Identify suspicious packets (25 pts each)",
        "Classify threat types (30 pts each)",
        "Find hidden payloads (50 pts each)",
        "Complete threat analysis (100 pts)",
      ],
    },
    "protocol-detective": {
      name: "Protocol Detective",
      description: "Identify and analyze network protocols",
      type: "Investigation",
      maxPoints: 300,
      timeLimit: "10 minutes",
      objectives: [
        "Identify protocol types (20 pts each)",
        "Analyze protocol behavior (30 pts each)",
        "Detect protocol anomalies (40 pts each)",
        "Complete protocol analysis (50 pts)",
      ],
    },
  },
  "web-security-intro": {
    "xss-hunter": {
      name: "XSS Hunter Challenge",
      description: "Find and exploit Cross-Site Scripting vulnerabilities",
      type: "Security Challenge",
      maxPoints: 300,
      timeLimit: "10 minutes",
      objectives: [
        "Find 5 XSS vulnerabilities (20 pts each)",
        "Bypass 3 input filters (30 pts each)",
        "Execute DOM-based XSS (50 pts)",
        "Steal session cookies (100 pts)",
      ],
    },
    "csrf-defender": {
      name: "CSRF Defender",
      description: "Protect applications from Cross-Site Request Forgery",
      type: "Defense",
      maxPoints: 250,
      timeLimit: "12 minutes",
      objectives: [
        "Identify CSRF vulnerabilities (40 pts each)",
        "Implement protection mechanisms (60 pts each)",
        "Test defense effectiveness (50 pts)",
        "Complete security audit (50 pts)",
      ],
    },
  },
  "penetration-testing": {
    "recon-master": {
      name: "Reconnaissance Master",
      description: "Master information gathering techniques",
      type: "Investigation",
      maxPoints: 400,
      timeLimit: "15 minutes",
      objectives: [
        "Perform OSINT gathering (50 pts)",
        "Identify target services (60 pts)",
        "Map network topology (80 pts)",
        "Document findings (60 pts)",
        "Create attack plan (50 pts)",
      ],
    },
    "exploit-chain-builder": {
      name: "Exploit Chain Builder",
      description: "Chain multiple exploits together for maximum impact",
      type: "Strategy",
      maxPoints: 500,
      timeLimit: "20 minutes",
      objectives: [
        "Identify vulnerability chain (80 pts)",
        "Execute initial compromise (100 pts)",
        "Escalate privileges (120 pts)",
        "Maintain persistence (100 pts)",
        "Complete objective (100 pts)",
      ],
    },
  },
  "web-application-security": {
    "sql-injection-master": {
      name: "SQL Injection Master",
      description: "Master SQL injection techniques",
      type: "Technical",
      maxPoints: 450,
      timeLimit: "18 minutes",
      objectives: [
        "Identify injection points (60 pts)",
        "Bypass authentication (80 pts)",
        "Extract database schema (100 pts)",
        "Retrieve sensitive data (120 pts)",
        "Document exploitation (90 pts)",
      ],
    },
    "owasp-champion": {
      name: "OWASP Top 10 Champion",
      description: "Master all OWASP Top 10 vulnerabilities",
      type: "Comprehensive",
      maxPoints: 600,
      timeLimit: "25 minutes",
      objectives: [
        "Identify all 10 vulnerability types (20 pts each)",
        "Exploit 5 different vulnerabilities (40 pts each)",
        "Complete advanced challenge (200 pts)",
      ],
    },
  },
};

// Centralized Labs Data connected to courses
export const LABS_DATA: { [key: string]: { [labId: string]: LabData } } = {
  foundations: {
    "risk-assessment-simulation": {
      name: "Risk Assessment Simulation",
      description: "Hands-on risk assessment of a fictional company",
      difficulty: "Beginner",
      duration: "45 min",
      objectives: [
        "Analyze company infrastructure for risks",
        "Calculate risk scores using standard matrices",
        "Prioritize risks based on business impact",
        "Create comprehensive risk report",
      ],
      steps: [
        {
          id: "step-1",
          title: "Asset Identification",
          description: "Identify and catalog all company assets",
          completed: false,
        },
        {
          id: "step-2",
          title: "Threat Analysis",
          description: "Analyze potential threats to each asset",
          completed: false,
        },
        {
          id: "step-3",
          title: "Vulnerability Assessment",
          description: "Identify vulnerabilities in systems and processes",
          completed: false,
        },
        {
          id: "step-4",
          title: "Risk Calculation",
          description: "Calculate risk scores using impact and likelihood",
          completed: false,
        },
        {
          id: "step-5",
          title: "Mitigation Planning",
          description: "Develop risk mitigation strategies",
          completed: false,
        },
      ],
    },
    "cia-triad-implementation": {
      name: "CIA Triad Implementation",
      description:
        "Practical implementation of confidentiality, integrity, and availability",
      difficulty: "Beginner",
      duration: "30 min",
      objectives: [
        "Implement confidentiality controls",
        "Ensure data integrity mechanisms",
        "Design availability safeguards",
        "Test all three principles together",
      ],
      steps: [
        {
          id: "step-1",
          title: "Confidentiality Setup",
          description: "Configure encryption and access controls",
          completed: false,
        },
        {
          id: "step-2",
          title: "Integrity Verification",
          description: "Implement checksums and digital signatures",
          completed: false,
        },
        {
          id: "step-3",
          title: "Availability Design",
          description: "Set up redundancy and backup systems",
          completed: false,
        },
        {
          id: "step-4",
          title: "Integration Testing",
          description: "Test all CIA components working together",
          completed: false,
        },
      ],
    },
  },
  "linux-basics": {
    "file-system-mastery": {
      name: "Linux File System Mastery",
      description: "Master Linux file system navigation and operations",
      difficulty: "Beginner",
      duration: "40 min",
      objectives: [
        "Navigate complex directory structures",
        "Master file and directory operations",
        "Understand and modify permissions",
        "Find and manipulate hidden files",
      ],
      steps: [
        {
          id: "step-1",
          title: "Basic Navigation",
          description: "Use cd, ls, pwd to navigate the file system",
          completed: false,
        },
        {
          id: "step-2",
          title: "File Operations",
          description: "Create, copy, move, and delete files and directories",
          completed: false,
        },
        {
          id: "step-3",
          title: "Permission Management",
          description: "Understand and modify file permissions using chmod",
          completed: false,
        },
        {
          id: "step-4",
          title: "Advanced Features",
          description: "Work with hidden files, links, and special directories",
          completed: false,
        },
      ],
    },
    "command-line-fundamentals": {
      name: "Command Line Fundamentals",
      description: "Essential command line skills for cybersecurity",
      difficulty: "Beginner",
      duration: "50 min",
      objectives: [
        "Master essential Linux commands",
        "Understand command piping and redirection",
        "Use text processing tools effectively",
        "Create simple shell scripts",
      ],
      steps: [
        {
          id: "step-1",
          title: "Core Commands",
          description: "Learn essential commands like grep, find, and ps",
          completed: false,
        },
        {
          id: "step-2",
          title: "Pipes and Redirection",
          description: "Master command chaining and output redirection",
          completed: false,
        },
        {
          id: "step-3",
          title: "Text Processing",
          description: "Use sed, awk, and other text processing tools",
          completed: false,
        },
        {
          id: "step-4",
          title: "Basic Scripting",
          description: "Create simple shell scripts for automation",
          completed: false,
        },
      ],
    },
  },
  "networking-basics": {
    "network-analysis-fundamentals": {
      name: "Network Analysis Fundamentals",
      description: "Learn to analyze network traffic and protocols",
      difficulty: "Intermediate",
      duration: "60 min",
      objectives: [
        "Capture and analyze network packets",
        "Identify different network protocols",
        "Detect suspicious network activity",
        "Generate network analysis reports",
      ],
      steps: [
        {
          id: "step-1",
          title: "Packet Capture Setup",
          description: "Configure packet capture tools and interfaces",
          completed: false,
        },
        {
          id: "step-2",
          title: "Protocol Identification",
          description: "Identify and categorize different network protocols",
          completed: false,
        },
        {
          id: "step-3",
          title: "Traffic Analysis",
          description: "Analyze traffic patterns and detect anomalies",
          completed: false,
        },
        {
          id: "step-4",
          title: "Reporting",
          description: "Generate comprehensive network analysis reports",
          completed: false,
        },
      ],
    },
  },
  "web-security-intro": {
    "web-lab-1": {
      name: "SQL Injection Fundamentals",
      description:
        "Learn to identify and exploit SQL injection vulnerabilities",
      difficulty: "Beginner",
      duration: "45 min",
      objectives: [
        "Identify SQL injection entry points",
        "Test basic SQL injection payloads",
        "Extract data from vulnerable database",
        "Document findings and remediation",
      ],
      steps: [
        {
          id: "step-1",
          title: "Reconnaissance",
          description: "Identify the login form and test for SQL injection",
          completed: false,
        },
        {
          id: "step-2",
          title: "Payload Testing",
          description: "Test various SQL injection payloads",
          completed: false,
        },
        {
          id: "step-3",
          title: "Data Extraction",
          description: "Extract user data from the database",
          completed: false,
        },
        {
          id: "step-4",
          title: "Documentation",
          description: "Document your findings and remediation steps",
          completed: false,
        },
      ],
    },
    "xss-exploitation-lab": {
      name: "XSS Exploitation Lab",
      description: "Hands-on Cross-Site Scripting vulnerability exploitation",
      difficulty: "Beginner",
      duration: "50 min",
      objectives: [
        "Identify XSS vulnerabilities in web applications",
        "Create and test XSS payloads",
        "Bypass input filtering mechanisms",
        "Demonstrate impact of XSS attacks",
      ],
      steps: [
        {
          id: "step-1",
          title: "Vulnerability Discovery",
          description: "Find XSS injection points in the web application",
          completed: false,
        },
        {
          id: "step-2",
          title: "Payload Development",
          description: "Create effective XSS payloads for different contexts",
          completed: false,
        },
        {
          id: "step-3",
          title: "Filter Bypass",
          description: "Bypass input validation and filtering mechanisms",
          completed: false,
        },
        {
          id: "step-4",
          title: "Impact Demonstration",
          description: "Show the real-world impact of XSS vulnerabilities",
          completed: false,
        },
      ],
    },
  },
  "penetration-testing": {
    "web-application-pentest": {
      name: "Web Application Penetration Test",
      description: "Complete penetration test of a web application",
      difficulty: "Advanced",
      duration: "120 min",
      objectives: [
        "Perform comprehensive reconnaissance",
        "Identify and exploit multiple vulnerabilities",
        "Achieve privilege escalation",
        "Document complete penetration test report",
      ],
      steps: [
        {
          id: "step-1",
          title: "Reconnaissance",
          description: "Gather information about the target application",
          completed: false,
        },
        {
          id: "step-2",
          title: "Vulnerability Discovery",
          description: "Identify security weaknesses in the application",
          completed: false,
        },
        {
          id: "step-3",
          title: "Exploitation",
          description: "Exploit identified vulnerabilities",
          completed: false,
        },
        {
          id: "step-4",
          title: "Post-Exploitation",
          description: "Escalate privileges and maintain access",
          completed: false,
        },
        {
          id: "step-5",
          title: "Reporting",
          description: "Create detailed penetration test report",
          completed: false,
        },
      ],
    },
  },
};

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

// Helper functions to get data by course and module
export const getGamesByModule = (
  moduleId: string
): { [gameId: string]: GameData } => {
  return GAMES_DATA[moduleId] || {};
};

export const getLabsByModule = (
  moduleId: string
): { [labId: string]: LabData } => {
  return LABS_DATA[moduleId] || {};
};

export const getGameData = (
  moduleId: string,
  gameId: string
): GameData | null => {
  const moduleGames = GAMES_DATA[moduleId];
  return moduleGames?.[gameId] || null;
};

export const getLabData = (moduleId: string, labId: string): LabData | null => {
  const moduleLabs = LABS_DATA[moduleId];
  return moduleLabs?.[labId] || null;
};

export const getAllGamesForPhase = (
  phaseId: string
): { [gameId: string]: GameData } => {
  const phase = PHASES_DATA.find((p) => p.id === phaseId);
  if (!phase) return {};

  const allGames: { [gameId: string]: GameData } = {};
  phase.modules.forEach((module) => {
    const moduleGames = GAMES_DATA[module.id] || {};
    Object.assign(allGames, moduleGames);
  });

  return allGames;
};

export const getAllLabsForPhase = (
  phaseId: string
): { [labId: string]: LabData } => {
  const phase = PHASES_DATA.find((p) => p.id === phaseId);
  if (!phase) return {};

  const allLabs: { [labId: string]: LabData } = {};
  phase.modules.forEach((module) => {
    const moduleLabs = LABS_DATA[module.id] || {};
    Object.assign(allLabs, moduleLabs);
  });

  return allLabs;
};
