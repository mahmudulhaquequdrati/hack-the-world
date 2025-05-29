import { Network, Shield, Target, Terminal } from "lucide-react";
import { getGamesByModule, getLabsByModule } from "./appData";
import { Course, GameItem, LabItem } from "./types";

// Helper function to convert centralized game data to CourseGame format
const convertGameData = (moduleId: string): GameItem[] => {
  const gamesData = getGamesByModule(moduleId);
  return Object.entries(gamesData).map(([, game]) => ({
    name: game.name,
    description: game.description,
    points: game.maxPoints,
    type: game.type,
  }));
};

// Helper function to convert centralized lab data to CourseLab format
const convertLabData = (moduleId: string): LabItem[] => {
  const labsData = getLabsByModule(moduleId);
  return Object.entries(labsData).map(([, lab]) => ({
    name: lab.name,
    description: lab.description,
    difficulty: lab.difficulty,
    duration: lab.duration,
    skills: lab.objectives, // Using objectives as skills for compatibility
  }));
};

export const coursesData: { [key: string]: Course } = {
  foundations: {
    id: "foundations",
    title: "Cybersecurity Fundamentals",
    description:
      "Essential concepts, terminology, and security principles that form the backbone of cybersecurity knowledge.",
    category: "Fundamentals",
    difficulty: "Beginner",
    duration: "2-3 weeks",
    icon: Shield,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    enrolled: true,
    progress: 85,
    lessons: 17,
    labs: 8,
    games: 6,
    assets: 12,
    rating: 4.9,
    students: 8420,
    price: "Free",
    skills: [
      "CIA Triad",
      "Risk Assessment",
      "Compliance",
      "Security Frameworks",
    ],
    prerequisites: "None - Perfect for beginners",
    certification: true,
    instructor: {
      name: "Dr. Sarah Chen",
      title: "Chief Security Officer",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "15+ years in cybersecurity",
    },
    curriculum: [
      {
        title: "Introduction to Cybersecurity",
        lessons: 6,
        duration: "2h 15min",
        topics: [
          "What is Cybersecurity",
          "Threat Landscape",
          "Security Policy Builder Game",
          "Security Principles",
          "CIA Triad",
          "CIA Triad Implementation Lab",
        ],
        completed: true,
      },
      {
        title: "Risk Management",
        lessons: 5,
        duration: "2h",
        topics: [
          "Risk Assessment",
          "Risk Assessment Simulation Lab",
          "Risk Analysis",
          "Risk Matrix Challenge Game",
          "Risk Mitigation",
        ],
        completed: true,
      },
      {
        title: "Security Frameworks",
        lessons: 6,
        duration: "3h",
        topics: [
          "NIST Framework",
          "Framework Matcher Game",
          "ISO 27001",
          "Policy Development Workshop Lab",
          "COBIT",
          "SOX Compliance",
        ],
        completed: false,
      },
    ],
    learningOutcomes: [
      {
        title: "Understand core cybersecurity principles",
        description:
          "Master the fundamental concepts of information security including the CIA triad, defense in depth strategies, and basic security principles.",
        skills: ["CIA Triad", "Security Principles", "Defense in Depth"],
      },
      {
        title: "Implement risk assessment methodologies",
        description:
          "Learn to identify, analyze, and evaluate security risks using industry-standard frameworks and methodologies.",
        skills: ["Risk Assessment", "Risk Analysis", "Risk Mitigation"],
      },
      {
        title: "Apply security frameworks effectively",
        description:
          "Gain practical experience with major security frameworks including NIST, ISO 27001, and COBIT.",
        skills: ["NIST Framework", "ISO 27001", "COBIT"],
      },
    ],
    labsData: convertLabData("foundations"),
    gamesData: convertGameData("foundations"),
    assetsData: [
      { name: "CIA Triad Reference Guide", type: "PDF", size: "2.1 MB" },
      { name: "Risk Assessment Template", type: "Excel", size: "1.5 MB" },
      { name: "NIST Framework Checklist", type: "PDF", size: "850 KB" },
    ],
    enrollPath: "/learn/foundations",
  },
  "linux-basics": {
    id: "linux-basics",
    title: "Linux Command Line Basics",
    description:
      "Master the terminal and basic command-line operations essential for cybersecurity professionals.",
    category: "Fundamentals",
    difficulty: "Beginner",
    duration: "2-3 weeks",
    icon: Terminal,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
    enrolled: true,
    progress: 70,
    lessons: 24,
    labs: 12,
    games: 8,
    assets: 18,
    rating: 4.8,
    students: 7250,
    price: "Free",
    skills: [
      "Basic Commands",
      "File Navigation",
      "Text Processing",
      "Permissions",
    ],
    prerequisites: "None - Perfect for beginners",
    certification: true,
    instructor: {
      name: "Alex Rodriguez",
      title: "Senior Systems Administrator",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "12+ years in Linux administration",
    },
    curriculum: [
      {
        title: "Getting Started with Linux",
        lessons: 7,
        duration: "2h 45min",
        topics: [
          "Linux History",
          "Distributions",
          "Terminal Basics",
          "Terminal Speed Challenge Game",
          "Command Structure",
          "Command Line Navigation Challenge Lab",
        ],
        completed: true,
      },
      {
        title: "File System Navigation",
        lessons: 8,
        duration: "3h 15min",
        topics: [
          "Directory Structure",
          "Navigation Commands",
          "File Operations",
          "File System Explorer Game",
          "Wildcards",
          "Advanced Navigation Lab",
        ],
        completed: true,
      },
      {
        title: "Text Processing & Permissions",
        lessons: 9,
        duration: "4h",
        topics: [
          "Text Editors",
          "File Permissions",
          "File Permissions Workshop Lab",
          "Permission Puzzle Game",
          "User Management",
          "Log Analysis with Command Line Lab",
          "Process Control",
        ],
        completed: false,
      },
    ],
    learningOutcomes: [
      {
        title: "Master essential Linux commands",
        description:
          "Learn fundamental commands for file manipulation, navigation, and system administration.",
        skills: ["Command Line", "File Operations", "System Navigation"],
      },
      {
        title: "Understand Linux file system",
        description:
          "Navigate the Linux directory structure and understand file permissions and ownership.",
        skills: ["File System", "Permissions", "Directory Structure"],
      },
      {
        title: "Perform basic system administration",
        description:
          "Manage users, processes, and system resources using command-line tools.",
        skills: ["User Management", "Process Control", "System Administration"],
      },
    ],
    labsData: convertLabData("linux-basics"),
    gamesData: convertGameData("linux-basics"),
    assetsData: [
      { name: "Linux Command Cheat Sheet", type: "PDF", size: "1.2 MB" },
      { name: "File Permission Calculator", type: "Tool", size: "500 KB" },
    ],
    enrollPath: "/learn/linux-basics",
  },
  "networking-basics": {
    id: "networking-basics",
    title: "Networking Fundamentals",
    description:
      "Understanding network protocols and basic concepts essential for cybersecurity.",
    category: "Fundamentals",
    difficulty: "Beginner",
    duration: "3-4 weeks",
    icon: Network,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    enrolled: true,
    progress: 60,
    lessons: 26,
    labs: 15,
    games: 10,
    assets: 20,
    rating: 4.7,
    students: 6890,
    price: "Free",
    skills: ["TCP/IP", "OSI Model", "DNS", "Basic Protocols"],
    prerequisites: "Basic computer knowledge",
    certification: true,
    instructor: {
      name: "Maria Santos",
      title: "Network Security Engineer",
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "10+ years in network security",
    },
    curriculum: [
      {
        title: "Network Fundamentals",
        lessons: 8,
        duration: "4h",
        topics: [
          "OSI Model",
          "Protocol Stack Builder Game",
          "TCP/IP Stack",
          "Network Topologies",
          "Basic Protocols",
          "Network Packet Analysis Lab",
        ],
        completed: true,
      },
      {
        title: "Network Protocols",
        lessons: 10,
        duration: "5h",
        topics: [
          "HTTP/HTTPS",
          "DNS",
          "DNS Configuration Lab",
          "DHCP",
          "ARP",
          "Protocol Analysis Game",
        ],
        completed: true,
      },
      {
        title: "Network Security Basics",
        lessons: 8,
        duration: "4h",
        topics: [
          "Firewalls",
          "VPNs",
          "Network Monitoring",
          "Network Scanning Exercise Lab",
          "Network Troubleshooter Game",
          "Common Attacks",
        ],
        completed: false,
      },
    ],
    learningOutcomes: [
      {
        title: "Understand network architecture",
        description:
          "Learn how networks are structured and how data flows through different layers.",
        skills: ["OSI Model", "Network Architecture", "Protocol Stack"],
      },
      {
        title: "Master essential protocols",
        description:
          "Understand key networking protocols and their security implications.",
        skills: ["TCP/IP", "DNS", "HTTP/HTTPS", "Network Protocols"],
      },
      {
        title: "Identify network vulnerabilities",
        description:
          "Recognize common network security issues and attack vectors.",
        skills: [
          "Network Security",
          "Vulnerability Assessment",
          "Attack Vectors",
        ],
      },
    ],
    labsData: convertLabData("networking-basics"),
    gamesData: convertGameData("networking-basics"),
    assetsData: [
      { name: "OSI Model Reference", type: "PDF", size: "1.8 MB" },
      { name: "Protocol Comparison Chart", type: "PDF", size: "900 KB" },
    ],
    enrollPath: "/learn/networking-basics",
  },
  "web-security-intro": {
    id: "web-security-intro",
    title: "Introduction to Web Security",
    description:
      "Basic web application security concepts and common vulnerabilities.",
    category: "Web Security",
    difficulty: "Beginner",
    duration: "2-3 weeks",
    icon: Shield,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
    enrolled: true,
    progress: 40,
    lessons: 23,
    labs: 10,
    games: 7,
    assets: 15,
    rating: 4.6,
    students: 5420,
    price: "Free",
    skills: ["HTTP/HTTPS", "Authentication", "Basic XSS", "CSRF Basics"],
    prerequisites: "Basic web knowledge",
    certification: true,
    instructor: {
      name: "David Kim",
      title: "Web Security Specialist",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "8+ years in web application security",
    },
    curriculum: [
      {
        title: "Web Security Fundamentals",
        lessons: 7,
        duration: "3h 15min",
        topics: [
          "HTTP/HTTPS",
          "Web Architecture",
          "Security Headers",
          "Security Header Configurator Game",
          "Cookies",
          "Web Security Basics Lab",
        ],
        completed: true,
      },
      {
        title: "Common Web Vulnerabilities",
        lessons: 9,
        duration: "4h 30min",
        topics: [
          "XSS",
          "XSS Vulnerability Lab",
          "CSRF",
          "CSRF Attack Simulation Lab",
          "SQL Injection",
          "Web Vulnerability Hunter Game",
          "Authentication Flaws",
          "Authentication Bypass Challenge Lab",
        ],
        completed: false,
      },
      {
        title: "Web Security Testing",
        lessons: 7,
        duration: "3h 30min",
        topics: [
          "Manual Testing",
          "Automated Tools",
          "Security Scanners",
          "Web Application Testing Lab",
          "Vulnerability Scanner Game",
          "Reporting",
        ],
        completed: false,
      },
    ],
    learningOutcomes: [
      {
        title: "Understand web security fundamentals",
        description:
          "Learn the basics of how web applications work and common security mechanisms.",
        skills: ["Web Architecture", "HTTP/HTTPS", "Security Headers"],
      },
      {
        title: "Identify common vulnerabilities",
        description:
          "Recognize and understand the most common web application security flaws.",
        skills: ["XSS", "CSRF", "SQL Injection", "Authentication"],
      },
      {
        title: "Perform basic security testing",
        description:
          "Learn to test web applications for security vulnerabilities using manual and automated techniques.",
        skills: [
          "Security Testing",
          "Vulnerability Assessment",
          "Web Scanners",
        ],
      },
    ],
    labsData: convertLabData("web-security-intro"),
    gamesData: convertGameData("web-security-intro"),
    assetsData: [
      { name: "OWASP Top 10 Guide", type: "PDF", size: "2.5 MB" },
      { name: "Web Security Checklist", type: "PDF", size: "1.1 MB" },
    ],
    enrollPath: "/learn/web-security-intro",
  },
  "penetration-testing": {
    id: "penetration-testing",
    title: "Penetration Testing Fundamentals",
    description:
      "Learn ethical hacking and penetration testing basics with hands-on practice.",
    category: "Offensive Security",
    difficulty: "Intermediate",
    duration: "4-5 weeks",
    icon: Target,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
    enrolled: false,
    progress: 0,
    lessons: 33,
    labs: 20,
    games: 12,
    assets: 25,
    rating: 4.9,
    students: 3240,
    price: "$49",
    skills: [
      "Reconnaissance",
      "Vulnerability Assessment",
      "Exploitation",
      "Post-Exploitation",
    ],
    prerequisites: "Networking basics, Linux command line",
    certification: true,
    instructor: {
      name: "Jake Thompson",
      title: "Senior Penetration Tester",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "12+ years in penetration testing",
    },
    curriculum: [
      {
        title: "Penetration Testing Methodology",
        lessons: 10,
        duration: "5h",
        topics: [
          "PTES Framework",
          "Scoping",
          "Rules of Engagement",
          "Legal Considerations",
          "Methodology Simulation Game",
          "Penetration Testing Planning Lab",
        ],
        completed: false,
      },
      {
        title: "Reconnaissance & Enumeration",
        lessons: 12,
        duration: "6h",
        topics: [
          "OSINT",
          "OSINT Collection Game",
          "Network Scanning",
          "Network Reconnaissance Lab",
          "Service Enumeration",
          "Enumeration Challenge Lab",
          "Vulnerability Scanning",
          "Vulnerability Assessment Game",
        ],
        completed: false,
      },
      {
        title: "Exploitation & Post-Exploitation",
        lessons: 11,
        duration: "7h",
        topics: [
          "Exploit Development",
          "Metasploit",
          "Web Application Penetration Test Lab",
          "Privilege Escalation",
          "Privilege Escalation Challenge Lab",
          "Persistence",
          "Capture the Flag Game",
          "Exploit Chain Builder Game",
        ],
        completed: false,
      },
    ],
    learningOutcomes: [
      {
        title: "Master penetration testing methodology",
        description:
          "Learn systematic approaches to penetration testing following industry standards.",
        skills: ["PTES", "Methodology", "Planning", "Scoping"],
      },
      {
        title: "Perform comprehensive reconnaissance",
        description:
          "Gather intelligence and enumerate targets using various tools and techniques.",
        skills: [
          "OSINT",
          "Reconnaissance",
          "Enumeration",
          "Intelligence Gathering",
        ],
      },
      {
        title: "Execute exploitation techniques",
        description:
          "Learn to identify, exploit, and leverage vulnerabilities in target systems.",
        skills: [
          "Exploitation",
          "Metasploit",
          "Privilege Escalation",
          "Post-Exploitation",
        ],
      },
    ],
    labsData: convertLabData("penetration-testing"),
    gamesData: convertGameData("penetration-testing"),
    assetsData: [
      { name: "Penetration Testing Methodology", type: "PDF", size: "3.2 MB" },
      { name: "Metasploit Quick Reference", type: "PDF", size: "1.8 MB" },
    ],
    enrollPath: "/learn/penetration-testing",
  },
  "web-application-security": {
    id: "web-application-security",
    title: "Web Application Security",
    description:
      "Advanced web vulnerabilities and exploitation techniques for comprehensive application security testing.",
    category: "Web Security",
    difficulty: "Intermediate",
    duration: "5-6 weeks",
    icon: Shield,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
    enrolled: true,
    progress: 45,
    lessons: 28,
    labs: 18,
    games: 10,
    assets: 30,
    rating: 4.8,
    students: 2800,
    price: "$149",
    skills: ["OWASP Top 10", "SQL Injection", "XSS", "Authentication Bypass"],
    prerequisites: "Web Security Introduction",
    certification: true,
    instructor: {
      name: "Sarah Martinez",
      title: "Application Security Lead",
      avatar:
        "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "14+ years in application security",
    },
    curriculum: [
      {
        title: "Advanced Web Vulnerabilities",
        lessons: 10,
        duration: "5h",
        topics: [
          "OWASP Top 10",
          "SQL Injection",
          "XSS",
          "Authentication Bypass",
        ],
        completed: false,
      },
      {
        title: "Exploitation Techniques",
        lessons: 10,
        duration: "5h",
        topics: [
          "SQL Injection",
          "XSS",
          "Authentication Bypass",
          "Web Application Exploitation",
        ],
        completed: false,
      },
      {
        title: "Security Testing",
        lessons: 8,
        duration: "4h",
        topics: [
          "Manual Testing",
          "Automated Tools",
          "Security Scanners",
          "Web Application Testing Lab",
          "Vulnerability Scanner Game",
          "Reporting",
        ],
        completed: false,
      },
    ],
    learningOutcomes: [
      {
        title: "Understand advanced web vulnerabilities",
        description:
          "Recognize and understand the most common web application security flaws.",
        skills: [
          "OWASP Top 10",
          "SQL Injection",
          "XSS",
          "Authentication Bypass",
        ],
      },
      {
        title: "Perform advanced security testing",
        description:
          "Learn to test web applications for security vulnerabilities using manual and automated techniques.",
        skills: [
          "Security Testing",
          "Vulnerability Assessment",
          "Web Scanners",
        ],
      },
      {
        title: "Execute web application exploitation",
        description:
          "Learn to identify, exploit, and leverage vulnerabilities in target web applications.",
        skills: [
          "Exploitation",
          "SQL Injection",
          "XSS",
          "Authentication Bypass",
        ],
      },
    ],
    labsData: convertLabData("web-application-security"),
    gamesData: convertGameData("web-application-security"),
    assetsData: [
      { name: "Advanced OWASP Guide", type: "PDF", size: "5.1 MB" },
      { name: "Exploitation Techniques Manual", type: "PDF", size: "3.2 MB" },
      { name: "Security Testing Tools", type: "ZIP", size: "2.1 MB" },
    ],
    enrollPath: "/learn/web-application-security",
  },
};

export const getCourseById = (courseId: string): Course | null => {
  return coursesData[courseId] || null;
};

export const getAllCourses = (): Course[] => {
  return Object.values(coursesData);
};
