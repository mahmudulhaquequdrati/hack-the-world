import { Network, Shield, Target, Terminal } from "lucide-react";
import { Course } from "./types";

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
    lessons: 15,
    labs: 5,
    games: 3,
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
        lessons: 4,
        duration: "1h 30min",
        topics: [
          "What is Cybersecurity",
          "Threat Landscape",
          "Security Principles",
          "CIA Triad",
        ],
        completed: true,
      },
      {
        title: "Risk Management",
        lessons: 3,
        duration: "1h 15min",
        topics: ["Risk Assessment", "Risk Analysis", "Risk Mitigation"],
        completed: true,
      },
      {
        title: "Security Frameworks",
        lessons: 4,
        duration: "2h",
        topics: ["NIST Framework", "ISO 27001", "COBIT", "SOX Compliance"],
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
    labsData: [
      {
        name: "Risk Assessment Simulation",
        description: "Hands-on risk assessment of a fictional company",
        difficulty: "Beginner",
        duration: "45 min",
        skills: ["Risk Analysis", "Documentation"],
      },
      {
        name: "Policy Development Workshop",
        description: "Create security policies for different scenarios",
        difficulty: "Beginner",
        duration: "60 min",
        skills: ["Policy Writing", "Compliance"],
      },
      {
        name: "CIA Triad Implementation",
        description:
          "Practical implementation of confidentiality, integrity, and availability",
        difficulty: "Beginner",
        duration: "30 min",
        skills: ["CIA Triad", "Security Controls"],
      },
    ],
    gamesData: [
      {
        name: "Security Policy Builder",
        description: "Interactive game to build security policies",
        points: 100,
        type: "Strategy",
      },
      {
        name: "Risk Matrix Challenge",
        description: "Calculate and prioritize security risks",
        points: 150,
        type: "Puzzle",
      },
      {
        name: "Framework Matcher",
        description: "Match security controls to appropriate frameworks",
        points: 120,
        type: "Educational",
      },
    ],
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
    lessons: 18,
    labs: 8,
    games: 4,
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
        lessons: 5,
        duration: "2h",
        topics: [
          "Linux History",
          "Distributions",
          "Terminal Basics",
          "Command Structure",
        ],
        completed: true,
      },
      {
        title: "File System Navigation",
        lessons: 6,
        duration: "2h 30min",
        topics: [
          "Directory Structure",
          "Navigation Commands",
          "File Operations",
          "Wildcards",
        ],
        completed: true,
      },
      {
        title: "Text Processing & Permissions",
        lessons: 7,
        duration: "3h",
        topics: [
          "Text Editors",
          "File Permissions",
          "User Management",
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
    labsData: [
      {
        name: "Command Line Navigation Challenge",
        description:
          "Navigate through complex directory structures using only terminal commands",
        difficulty: "Beginner",
        duration: "30 min",
        skills: ["Navigation", "File Operations"],
      },
      {
        name: "File Permissions Workshop",
        description:
          "Practice setting and modifying file permissions for security",
        difficulty: "Beginner",
        duration: "45 min",
        skills: ["Permissions", "Security"],
      },
      {
        name: "Log Analysis with Command Line",
        description:
          "Analyze system logs using grep, awk, and other text processing tools",
        difficulty: "Intermediate",
        duration: "60 min",
        skills: ["Text Processing", "Log Analysis"],
      },
    ],
    gamesData: [
      {
        name: "Terminal Speed Challenge",
        description: "Complete tasks as quickly as possible using command line",
        points: 80,
        type: "Speed",
      },
      {
        name: "Permission Puzzle",
        description: "Solve file permission challenges step by step",
        points: 120,
        type: "Puzzle",
      },
    ],
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
    lessons: 20,
    labs: 10,
    games: 5,
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
        lessons: 6,
        duration: "3h",
        topics: [
          "OSI Model",
          "TCP/IP Stack",
          "Network Topologies",
          "Basic Protocols",
        ],
        completed: true,
      },
      {
        title: "Network Protocols",
        lessons: 8,
        duration: "4h",
        topics: ["HTTP/HTTPS", "DNS", "DHCP", "ARP"],
        completed: true,
      },
      {
        title: "Network Security Basics",
        lessons: 6,
        duration: "3h",
        topics: ["Firewalls", "VPNs", "Network Monitoring", "Common Attacks"],
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
    labsData: [
      {
        name: "Network Packet Analysis",
        description:
          "Analyze network traffic using Wireshark to understand protocols",
        difficulty: "Beginner",
        duration: "60 min",
        skills: ["Packet Analysis", "Wireshark"],
      },
      {
        name: "DNS Configuration Lab",
        description:
          "Configure and troubleshoot DNS settings in a lab environment",
        difficulty: "Beginner",
        duration: "45 min",
        skills: ["DNS", "Network Configuration"],
      },
      {
        name: "Network Scanning Exercise",
        description:
          "Use network scanning tools to discover devices and services",
        difficulty: "Intermediate",
        duration: "75 min",
        skills: ["Network Scanning", "Reconnaissance"],
      },
    ],
    gamesData: [
      {
        name: "Protocol Stack Builder",
        description:
          "Build network protocol stacks by matching layers correctly",
        points: 100,
        type: "Educational",
      },
      {
        name: "Network Troubleshooter",
        description: "Diagnose and fix network connectivity issues",
        points: 150,
        type: "Simulation",
      },
    ],
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
    lessons: 16,
    labs: 6,
    games: 3,
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
        lessons: 5,
        duration: "2h 30min",
        topics: [
          "HTTP/HTTPS",
          "Web Architecture",
          "Security Headers",
          "Cookies",
        ],
        completed: true,
      },
      {
        title: "Common Web Vulnerabilities",
        lessons: 6,
        duration: "3h",
        topics: ["XSS", "CSRF", "SQL Injection", "Authentication Flaws"],
        completed: false,
      },
      {
        title: "Web Security Testing",
        lessons: 5,
        duration: "2h 30min",
        topics: [
          "Manual Testing",
          "Automated Tools",
          "Security Scanners",
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
    labsData: [
      {
        name: "XSS Vulnerability Lab",
        description:
          "Identify and exploit cross-site scripting vulnerabilities",
        difficulty: "Beginner",
        duration: "45 min",
        skills: ["XSS", "Web Exploitation"],
      },
      {
        name: "CSRF Attack Simulation",
        description:
          "Understand and demonstrate cross-site request forgery attacks",
        difficulty: "Beginner",
        duration: "40 min",
        skills: ["CSRF", "Web Security"],
      },
      {
        name: "Authentication Bypass Challenge",
        description: "Find and exploit authentication vulnerabilities",
        difficulty: "Intermediate",
        duration: "60 min",
        skills: ["Authentication", "Web Exploitation"],
      },
    ],
    gamesData: [
      {
        name: "Web Vulnerability Hunter",
        description: "Find hidden vulnerabilities in web applications",
        points: 120,
        type: "Hunt",
      },
      {
        name: "Security Header Configurator",
        description: "Configure security headers to protect web applications",
        points: 100,
        type: "Configuration",
      },
    ],
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
    lessons: 25,
    labs: 15,
    games: 8,
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
        lessons: 8,
        duration: "4h",
        topics: [
          "PTES Framework",
          "Scoping",
          "Rules of Engagement",
          "Legal Considerations",
        ],
        completed: false,
      },
      {
        title: "Reconnaissance & Enumeration",
        lessons: 9,
        duration: "5h",
        topics: [
          "OSINT",
          "Network Scanning",
          "Service Enumeration",
          "Vulnerability Scanning",
        ],
        completed: false,
      },
      {
        title: "Exploitation & Post-Exploitation",
        lessons: 8,
        duration: "6h",
        topics: [
          "Exploit Development",
          "Metasploit",
          "Privilege Escalation",
          "Persistence",
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
    labsData: [
      {
        name: "Network Reconnaissance Lab",
        description: "Perform comprehensive reconnaissance on a target network",
        difficulty: "Intermediate",
        duration: "90 min",
        skills: ["Reconnaissance", "Network Scanning"],
      },
      {
        name: "Web Application Penetration Test",
        description:
          "Complete penetration test of a vulnerable web application",
        difficulty: "Intermediate",
        duration: "120 min",
        skills: ["Web Testing", "Exploitation"],
      },
      {
        name: "Privilege Escalation Challenge",
        description: "Escalate privileges on compromised systems",
        difficulty: "Advanced",
        duration: "75 min",
        skills: ["Privilege Escalation", "Post-Exploitation"],
      },
    ],
    gamesData: [
      {
        name: "Capture the Flag",
        description: "Complete penetration testing challenges to capture flags",
        points: 200,
        type: "CTF",
      },
      {
        name: "Exploit Chain Builder",
        description: "Chain multiple exploits together for maximum impact",
        points: 250,
        type: "Strategy",
      },
    ],
    assetsData: [
      { name: "Penetration Testing Methodology", type: "PDF", size: "3.2 MB" },
      { name: "Metasploit Quick Reference", type: "PDF", size: "1.8 MB" },
    ],
    enrollPath: "/learn/penetration-testing",
  },
};

export const getCourseById = (courseId: string): Course | null => {
  return coursesData[courseId] || null;
};

export const getAllCourses = (): Course[] => {
  return Object.values(coursesData);
};
