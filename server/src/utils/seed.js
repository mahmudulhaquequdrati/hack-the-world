#!/usr/bin/env node

/**
 * Unified Seed System for Hack The World Platform
 *
 * This is the single source of truth for all database seeding operations.
 * It handles all models in the correct dependency order with proper error handling.
 * Supports both individual and bulk seeding operations.
 */

require("dotenv").config();
const database = require("../config/database");
const { resetCollection, clearCollection } = require("./dbUtils");

// Import required models
const Phase = require("../models/Phase");
const Module = require("../models/Module");
const Content = require("../models/Content");
const User = require("../models/User");
const Achievement = require("../models/Achievement");
const UserAchievement = require("../models/UserAchievement");
const UserEnrollment = require("../models/UserEnrollment");
const UserProgress = require("../models/UserProgress");

// Import existing content data

// ===================================================================
// SEED DATA DEFINITIONS
// ===================================================================

/**
 * Phase Data - Learning phases in the cybersecurity curriculum
 */
const PHASES_DATA = [
  {
    title: "Beginner Phase",
    description: "Foundation courses for cybersecurity beginners",
    icon: "Lightbulb",
    color: "green",
    order: 1,
  },
  {
    title: "Intermediate Phase",
    description: "Advanced security concepts and practical skills",
    icon: "Target",
    color: "orange",
    order: 2,
  },
  {
    title: "Advanced Phase",
    description: "Expert-level security specializations",
    icon: "Brain",
    color: "red",
    order: 3,
  },
];

/**
 * Module Data - Courses within each phase
 */
const MODULES_DATA = [
  // Beginner Phase Modules
  {
    phaseId: "beginner",
    title: "Cybersecurity Fundamentals",
    description: "Essential concepts, terminology, and security principles",
    icon: "Shield",
    duration: "2-3 weeks",
    difficulty: "Beginner",
    color: "blue",
    order: 1,
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
      estimatedHours: 0,
    },
    topics: ["fundamentals", "security", "basics"],
  },
  {
    phaseId: "beginner",
    title: "Linux Command Line Basics",
    description: "Master the terminal and basic command-line operations",
    icon: "Terminal",
    duration: "2-3 weeks",
    difficulty: "Beginner",
    color: "green",
    order: 2,
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
      estimatedHours: 0,
    },
    topics: ["linux", "command-line", "terminal"],
  },
  {
    phaseId: "beginner",
    title: "Networking Fundamentals",
    description: "Understanding network protocols and basic concepts",
    icon: "Network",
    duration: "3-4 weeks",
    difficulty: "Beginner",
    color: "purple",
    order: 3,
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
      estimatedHours: 0,
    },
    topics: ["networking", "protocols", "tcp-ip"],
  },
  {
    phaseId: "beginner",
    title: "Introduction to Web Security",
    description:
      "Basic web application security concepts and common vulnerabilities",
    icon: "Shield",
    duration: "2-3 weeks",
    difficulty: "Beginner",
    color: "blue",
    order: 4,
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
      estimatedHours: 0,
    },
    topics: ["web-security", "vulnerabilities", "owasp"],
  },
  // Intermediate Phase Modules
  {
    phaseId: "intermediate",
    title: "Penetration Testing Fundamentals",
    description: "Learn ethical hacking and penetration testing basics",
    icon: "Target",
    duration: "4-5 weeks",
    difficulty: "Intermediate",
    color: "red",
    order: 1,
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
      estimatedHours: 0,
    },
    topics: ["penetration-testing", "ethical-hacking", "reconnaissance"],
  },
  {
    phaseId: "intermediate",
    title: "Advanced Network Security",
    description: "Deep dive into network security monitoring and defense",
    icon: "Network",
    duration: "4-5 weeks",
    difficulty: "Intermediate",
    color: "purple",
    order: 2,
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
      estimatedHours: 0,
    },
    topics: ["network-security", "monitoring", "ids-ips"],
  },
  // Advanced Phase Modules
  {
    phaseId: "advanced",
    title: "Advanced Penetration Testing",
    description: "Master advanced exploitation techniques and methodologies",
    icon: "Target",
    duration: "6-8 weeks",
    difficulty: "Advanced",
    color: "red",
    order: 1,
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
      estimatedHours: 0,
    },
    topics: ["advanced-pentest", "exploitation", "metasploit"],
  },
  {
    phaseId: "advanced",
    title: "Incident Response and Forensics",
    description: "Learn to respond to and investigate security incidents",
    icon: "Shield",
    duration: "6-8 weeks",
    difficulty: "Advanced",
    color: "orange",
    order: 2,
    content: {
      videos: [],
      labs: [],
      games: [],
      documents: [],
      estimatedHours: 0,
    },
    topics: ["incident-response", "forensics", "investigation"],
  },
];

const CONTENT_DATA = [
  // ===================================================================
  // BEGINNER PHASE CONTENT
  // ===================================================================

  // Cybersecurity Fundamentals (foundations)
  {
    moduleId: "foundations", // Will be converted to ObjectId during seeding
    type: "video",
    title: "Introduction to Cybersecurity",
    description:
      "Learn the fundamentals of cybersecurity and why it matters in today's digital world",
    url: "https://example.com/videos/cybersec-intro",
    section: "Introduction",
    duration: 15,
    metadata: {
      difficulty: "beginner",
      tags: ["introduction", "fundamentals", "overview"],
      thumbnail: "/images/cybersec-intro.jpg",
    },
  },
  {
    moduleId: "foundations",
    type: "video",
    title: "CIA Triad Explained",
    description:
      "Understanding Confidentiality, Integrity, and Availability principles",
    url: "https://example.com/videos/cia-triad",
    section: "Core Concepts",
    duration: 12,
    metadata: {
      difficulty: "beginner",
      tags: ["cia-triad", "principles", "security"],
    },
  },
  {
    moduleId: "foundations",
    type: "lab",
    title: "Password Security Lab",
    description:
      "Hands-on practice with password security techniques and tools",
    instructions:
      "In this lab, you'll learn to:\n1. Create strong passwords using best practices\n2. Test password strength using security tools\n3. Implement multi-factor authentication\n4. Use password managers effectively\n\nComplete each section and record your findings.",
    section: "Password Security",
    duration: 30,
    metadata: {
      difficulty: "beginner",
      tools: ["password-checker", "hash-generator", "mfa-simulator"],
      objectives: ["password-creation", "strength-testing", "mfa-setup"],
    },
  },
  {
    moduleId: "foundations",
    type: "game",
    title: "Phishing Detection Challenge",
    description: "Interactive game to identify and analyze phishing attempts",
    instructions:
      "Test your skills in identifying phishing emails and websites:\n1. Analyze suspicious emails for red flags\n2. Check website URLs for legitimacy\n3. Identify social engineering tactics\n4. Score points for correct identifications\n\nGoal: Achieve 80% accuracy to unlock the next level!",
    section: "Threat Recognition",
    duration: 20,
    metadata: {
      difficulty: "beginner",
      scoring: { correct: 10, incorrect: -5, bonus: 15 },
      levels: 5,
      gameType: "identification",
    },
  },

  // Linux Command Line Basics (linux-basics)
  {
    moduleId: "linux-basics",
    type: "video",
    title: "Linux Command Line Introduction",
    description: "Getting started with the Linux terminal and basic navigation",
    url: "https://example.com/videos/linux-intro",
    section: "Getting Started",
    duration: 18,
    metadata: {
      difficulty: "beginner",
      tags: ["linux", "terminal", "navigation"],
    },
  },
  {
    moduleId: "linux-basics",
    type: "lab",
    title: "File Operations Lab",
    description: "Practice essential file and directory operations in Linux",
    instructions:
      "Complete the following file operations:\n1. Navigate the filesystem using cd, ls, pwd\n2. Create, copy, move, and delete files\n3. Set file permissions using chmod\n4. Search for files using find and grep\n\nDocument each command and its output.",
    section: "File Management",
    duration: 45,
    metadata: {
      difficulty: "beginner",
      tools: ["terminal", "file-system"],
      commands: ["cd", "ls", "cp", "mv", "rm", "chmod", "find", "grep"],
    },
  },
  {
    moduleId: "linux-basics",
    type: "game",
    title: "Linux Command Challenge",
    description:
      "Test your Linux command knowledge in this interactive challenge",
    instructions:
      "Complete Linux tasks using the correct commands:\n1. Navigate to specific directories\n2. Find hidden files and directories\n3. Execute commands with proper syntax\n4. Chain commands using pipes and redirects\n\nComplete all challenges within the time limit!",
    section: "Command Mastery",
    duration: 25,
    metadata: {
      difficulty: "beginner",
      scoring: { taskComplete: 20, timeBonus: 10, perfectRun: 50 },
      challenges: 10,
      gameType: "command-execution",
    },
  },

  // Networking Fundamentals (networking-basics)
  {
    moduleId: "networking-basics",
    type: "video",
    title: "Network Protocols Overview",
    description:
      "Understanding TCP/IP, HTTP, DNS, and other essential protocols",
    url: "https://example.com/videos/network-protocols",
    section: "Protocol Fundamentals",
    duration: 22,
    metadata: {
      difficulty: "beginner",
      tags: ["protocols", "tcp-ip", "http", "dns"],
    },
  },
  {
    moduleId: "networking-basics",
    type: "lab",
    title: "Network Traffic Analysis with Wireshark",
    description: "Analyze network traffic and understand packet structures",
    instructions:
      "Use Wireshark to analyze network traffic:\n1. Capture live network traffic\n2. Filter packets by protocol (HTTP, HTTPS, DNS)\n3. Analyze packet headers and payload\n4. Identify suspicious network activity\n\nCreate a report of your findings.",
    section: "Traffic Analysis",
    duration: 50,
    metadata: {
      difficulty: "beginner",
      tools: ["wireshark", "network-capture"],
      protocols: ["http", "https", "dns", "tcp", "udp"],
    },
  },

  // ===================================================================
  // INTERMEDIATE PHASE CONTENT
  // ===================================================================

  // Penetration Testing Fundamentals (penetration-testing)
  {
    moduleId: "penetration-testing",
    type: "video",
    title: "Penetration Testing Methodology",
    description:
      "Learn the systematic approach to ethical hacking and penetration testing",
    url: "https://example.com/videos/pentest-methodology",
    section: "Methodology",
    duration: 25,
    metadata: {
      difficulty: "intermediate",
      tags: ["methodology", "ethical-hacking", "pentest"],
    },
  },
  {
    moduleId: "penetration-testing",
    type: "lab",
    title: "Network Scanning with Nmap",
    description: "Master network reconnaissance using Nmap scanning techniques",
    instructions:
      "Perform comprehensive network reconnaissance:\n1. Discover live hosts on the network\n2. Identify open ports and services\n3. Perform OS detection and version scanning\n4. Use stealth scanning techniques\n5. Generate detailed scan reports\n\nEthical note: Only scan networks you own or have permission to test.",
    section: "Reconnaissance",
    duration: 60,
    metadata: {
      difficulty: "intermediate",
      tools: ["nmap", "network-scanner"],
      techniques: [
        "host-discovery",
        "port-scanning",
        "os-detection",
        "stealth-scan",
      ],
    },
  },
  {
    moduleId: "penetration-testing",
    type: "game",
    title: "Vulnerability Assessment Challenge",
    description:
      "Identify and prioritize security vulnerabilities in simulated environments",
    instructions:
      "Conduct vulnerability assessments on virtual targets:\n1. Scan for common vulnerabilities (OWASP Top 10)\n2. Analyze vulnerability severity and impact\n3. Prioritize findings based on risk assessment\n4. Develop remediation recommendations\n\nScore points for accurate vulnerability identification and risk assessment.",
    section: "Vulnerability Assessment",
    duration: 40,
    metadata: {
      difficulty: "intermediate",
      scoring: { vulnFound: 25, riskAssessment: 15, remediation: 10 },
      vulnerabilities: ["sql-injection", "xss", "csrf", "insecure-auth"],
      gameType: "assessment-simulation",
    },
  },

  // Advanced Network Security (advanced-networking)
  {
    moduleId: "advanced-networking",
    type: "video",
    title: "Network Monitoring and IDS/IPS",
    description:
      "Understanding network monitoring, intrusion detection, and prevention systems",
    url: "https://example.com/videos/network-monitoring",
    section: "Monitoring & Detection",
    duration: 30,
    metadata: {
      difficulty: "intermediate",
      tags: ["monitoring", "ids", "ips", "detection"],
    },
  },
  {
    moduleId: "advanced-networking",
    type: "lab",
    title: "Intrusion Detection with Snort",
    description: "Configure and manage Snort IDS for network threat detection",
    instructions:
      "Set up and configure Snort IDS:\n1. Install and configure Snort rules\n2. Monitor network traffic for intrusions\n3. Analyze Snort alerts and logs\n4. Create custom detection rules\n5. Tune rules to reduce false positives\n\nDocument your configuration and findings.",
    section: "Intrusion Detection",
    duration: 75,
    metadata: {
      difficulty: "intermediate",
      tools: ["snort", "ids", "rule-engine"],
      concepts: ["signature-detection", "anomaly-detection", "alert-analysis"],
    },
  },

  // ===================================================================
  // ADVANCED PHASE CONTENT
  // ===================================================================

  // Advanced Penetration Testing (advanced-pentest)
  {
    moduleId: "advanced-pentest",
    type: "video",
    title: "Advanced Exploitation Techniques",
    description:
      "Master advanced exploitation methods and post-exploitation techniques",
    url: "https://example.com/videos/advanced-exploitation",
    section: "Advanced Exploitation",
    duration: 35,
    metadata: {
      difficulty: "advanced",
      tags: ["exploitation", "post-exploitation", "advanced"],
    },
  },
  {
    moduleId: "advanced-pentest",
    type: "lab",
    title: "Advanced Exploitation with Metasploit",
    description:
      "Use Metasploit framework for advanced penetration testing scenarios",
    instructions:
      "Master the Metasploit framework:\n1. Set up the Metasploit database\n2. Perform advanced vulnerability scanning\n3. Execute exploits against vulnerable targets\n4. Conduct post-exploitation activities\n5. Generate comprehensive penetration test reports\n\nComplete all exploitation scenarios ethically and document your methodology.",
    section: "Exploitation Framework",
    duration: 90,
    metadata: {
      difficulty: "advanced",
      tools: ["metasploit", "msfconsole", "meterpreter"],
      techniques: [
        "exploitation",
        "post-exploitation",
        "persistence",
        "privilege-escalation",
      ],
    },
  },

  // Incident Response (incident-response)
  {
    moduleId: "incident-response",
    type: "video",
    title: "Incident Response Framework",
    description:
      "Learn systematic approaches to cybersecurity incident response",
    url: "https://example.com/videos/incident-response",
    section: "Response Framework",
    duration: 28,
    metadata: {
      difficulty: "advanced",
      tags: ["incident-response", "framework", "methodology"],
    },
  },
  {
    moduleId: "incident-response",
    type: "lab",
    title: "Digital Forensics Analysis",
    description:
      "Conduct digital forensics investigation on compromised systems",
    instructions:
      "Perform digital forensics analysis:\n1. Create forensic images of compromised systems\n2. Analyze system logs and artifacts\n3. Recover deleted files and evidence\n4. Timeline reconstruction of the incident\n5. Prepare forensics report with findings\n\nMaintain chain of custody throughout the investigation.",
    section: "Forensics Investigation",
    duration: 120,
    metadata: {
      difficulty: "advanced",
      tools: ["autopsy", "volatility", "sleuthkit", "wireshark"],
      techniques: [
        "disk-imaging",
        "memory-analysis",
        "log-analysis",
        "timeline-reconstruction",
      ],
    },
  },
  {
    moduleId: "incident-response",
    type: "game",
    title: "Cyber Incident Response Simulation",
    description:
      "Lead an incident response team through a realistic cyber attack scenario",
    instructions:
      "Manage a cybersecurity incident from detection to resolution:\n1. Detect and classify the security incident\n2. Coordinate response team activities\n3. Contain and eradicate the threat\n4. Recover affected systems and data\n5. Conduct post-incident analysis\n\nMake critical decisions under pressure while minimizing business impact.",
    section: "Incident Simulation",
    duration: 60,
    metadata: {
      difficulty: "advanced",
      scoring: {
        responseTime: 30,
        containment: 25,
        recovery: 20,
        analysis: 15,
      },
      scenarios: ["ransomware", "data-breach", "insider-threat", "apt-attack"],
      gameType: "incident-management",
    },
  },
];

/**
 * Users Data - Admin and sample student accounts
 */
const USERS_DATA = [
  // Admin User
  {
    username: "admin",
    email: "admin@hacktheworld.dev",
    password: "SecureAdmin123!",
    role: "admin",
    adminStatus: "active",
    profile: {
      firstName: "System",
      lastName: "Administrator",
      displayName: "Admin",
      bio: "Platform administrator account",
      location: "Global",
    },
    experienceLevel: "expert",
    stats: {
      totalPoints: 10000,
      level: 50,
      coursesCompleted: 0,
      labsCompleted: 0,
      gamesCompleted: 0,
      achievementsEarned: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
  },
  // Sample Student Users
  {
    username: "alice_cybersec",
    email: "alice@example.com",
    password: "SecurePassword123!",
    role: "student",
    profile: {
      firstName: "Alice",
      lastName: "Johnson",
      displayName: "Alice Johnson",
      bio: "Passionate about cybersecurity and ethical hacking",
      location: "San Francisco, CA",
    },
    experienceLevel: "intermediate",
    stats: {
      totalPoints: 2500,
      level: 12,
      coursesCompleted: 3,
      labsCompleted: 8,
      gamesCompleted: 5,
      achievementsEarned: 7,
      currentStreak: 3,
      longestStreak: 12,
    },
  },
  {
    username: "bob_security",
    email: "bob@example.com",
    password: "SecurePassword123!",
    role: "student",
    profile: {
      firstName: "Bob",
      lastName: "Smith",
      displayName: "Bob Smith",
      bio: "Network security enthusiast learning penetration testing",
      location: "Austin, TX",
    },
    experienceLevel: "beginner",
    stats: {
      totalPoints: 750,
      level: 4,
      coursesCompleted: 1,
      labsCompleted: 2,
      gamesCompleted: 1,
      achievementsEarned: 3,
      currentStreak: 1,
      longestStreak: 5,
    },
  },
  {
    username: "carol_hacker",
    email: "carol@example.com",
    password: "SecurePassword123!",
    role: "student",
    profile: {
      firstName: "Carol",
      lastName: "Davis",
      displayName: "Carol Davis",
      bio: "Former IT professional transitioning to cybersecurity",
      location: "Seattle, WA",
    },
    experienceLevel: "advanced",
    stats: {
      totalPoints: 4200,
      level: 18,
      coursesCompleted: 6,
      labsCompleted: 15,
      gamesCompleted: 12,
      achievementsEarned: 14,
      currentStreak: 7,
      longestStreak: 25,
    },
  },
];

/**
 * Achievements Data - Platform achievements users can earn
 */
const ACHIEVEMENTS_DATA = [
  // Module completion achievements
  {
    slug: "first-module",
    title: "First Steps",
    description: "Complete your first module",
    category: "module",
    requirements: {
      type: "count",
      target: 1,
      resource: "modules_completed",
    },
    rewards: {
      xp: 100,
      badge: "🎯",
      title: "Beginner",
    },
    icon: "Target",
    difficulty: "easy",
    order: 1,
  },
  {
    slug: "module-master",
    title: "Module Master",
    description: "Complete 5 modules",
    category: "module",
    requirements: {
      type: "count",
      target: 5,
      resource: "modules_completed",
    },
    rewards: {
      xp: 500,
      badge: "🏆",
      title: "Module Master",
    },
    icon: "Trophy",
    difficulty: "medium",
    order: 2,
  },
  
  // Lab completion achievements
  {
    slug: "first-lab",
    title: "Hands-On Learner",
    description: "Complete your first lab exercise",
    category: "lab",
    requirements: {
      type: "count",
      target: 1,
      resource: "labs_completed",
    },
    rewards: {
      xp: 150,
      badge: "🔬",
      title: "Lab Rookie",
    },
    icon: "Beaker",
    difficulty: "easy",
    order: 3,
  },
  {
    slug: "lab-expert",
    title: "Lab Expert",
    description: "Complete 10 lab exercises",
    category: "lab",
    requirements: {
      type: "count",
      target: 10,
      resource: "labs_completed",
    },
    rewards: {
      xp: 750,
      badge: "🧪",
      title: "Lab Expert",
    },
    icon: "Flask",
    difficulty: "medium",
    order: 4,
  },

  // Game completion achievements
  {
    slug: "game-player",
    title: "Game Player",
    description: "Complete your first security game",
    category: "game",
    requirements: {
      type: "count",
      target: 1,
      resource: "games_completed",
    },
    rewards: {
      xp: 100,
      badge: "🎮",
      title: "Gamer",
    },
    icon: "Gamepad",
    difficulty: "easy",
    order: 5,
  },
  {
    slug: "game-champion",
    title: "Game Champion",
    description: "Complete 5 security games",
    category: "game",
    requirements: {
      type: "count",
      target: 5,
      resource: "games_completed",
    },
    rewards: {
      xp: 400,
      badge: "🏅",
      title: "Game Champion",
    },
    icon: "Medal",
    difficulty: "medium",
    order: 6,
  },

  // XP-based achievements
  {
    slug: "point-collector",
    title: "Point Collector",
    description: "Earn 1000 experience points",
    category: "xp",
    requirements: {
      type: "count",
      target: 1000,
      resource: "xp_earned",
    },
    rewards: {
      xp: 200,
      badge: "💎",
      title: "Point Collector",
    },
    icon: "Diamond",
    difficulty: "easy",
    order: 7,
  },
  {
    slug: "xp-master",
    title: "XP Master",
    description: "Earn 5000 experience points",
    category: "xp",
    requirements: {
      type: "count",
      target: 5000,
      resource: "xp_earned",
    },
    rewards: {
      xp: 1000,
      badge: "👑",
      title: "XP Master",
    },
    icon: "Crown",
    difficulty: "hard",
    order: 8,
  },

  // General achievements
  {
    slug: "enrollment-enthusiast",
    title: "Enrollment Enthusiast",
    description: "Enroll in 3 modules",
    category: "general",
    requirements: {
      type: "count",
      target: 3,
      resource: "enrollments_created",
    },
    rewards: {
      xp: 250,
      badge: "📚",
      title: "Enthusiast",
    },
    icon: "BookOpen",
    difficulty: "easy",
    order: 9,
  },
  {
    slug: "dedication",
    title: "Dedication",
    description: "Complete your first week of learning",
    category: "general",
    requirements: {
      type: "special",
    },
    rewards: {
      xp: 300,
      badge: "⭐",
      title: "Dedicated",
    },
    icon: "Star",
    difficulty: "medium",
    order: 10,
  },
];

// ===================================================================
// DYNAMIC DEPENDENCY RESOLUTION HELPERS
// ===================================================================

/**
 * Check if specific models have data seeded
 */
async function checkDependencies(requiredModels) {
  const results = {};
  
  for (const modelName of requiredModels) {
    let count = 0;
    
    switch (modelName) {
      case 'Phase':
        count = await Phase.countDocuments();
        break;
      case 'Module':
        count = await Module.countDocuments();
        break;
      case 'Content':
        count = await Content.countDocuments();
        break;
      case 'User':
        count = await User.countDocuments();
        break;
      case 'Achievement':
        count = await Achievement.countDocuments();
        break;
      default:
        throw new Error(`Unknown model for dependency check: ${modelName}`);
    }
    
    results[modelName] = count;
  }
  
  return results;
}

/**
 * Dynamically find phases and create mapping for modules
 */
async function getPhaseMapping() {
  const phases = await Phase.find({}).sort({ order: 1 });
  const phaseMap = {};
  
  phases.forEach((phase) => {
    const title = phase.title.toLowerCase();
    if (title.includes("beginner")) {
      phaseMap["beginner"] = phase._id;
    }
    if (title.includes("intermediate")) {
      phaseMap["intermediate"] = phase._id;
    }
    if (title.includes("advanced")) {
      phaseMap["advanced"] = phase._id;
    }
  });
  
  return { phases, phaseMap };
}

/**
 * Dynamically find modules and create mapping for content
 */
async function getModuleMapping() {
  const modules = await Module.find({}).sort({ order: 1 });
  const moduleMap = {};
  
  modules.forEach((module) => {
    const title = module.title.toLowerCase();
    
    // Create mappings based on title matching
    if (title.includes("cybersecurity fundamentals")) {
      moduleMap["foundations"] = module._id;
    }
    if (title.includes("linux command line")) {
      moduleMap["linux-basics"] = module._id;
    }
    if (title.includes("networking fundamentals")) {
      moduleMap["networking-basics"] = module._id;
    }
    if (title.includes("introduction to web security")) {
      moduleMap["web-security-intro"] = module._id;
    }
    if (title.includes("penetration testing fundamentals")) {
      moduleMap["penetration-testing"] = module._id;
    }
    if (title.includes("advanced network security")) {
      moduleMap["advanced-networking"] = module._id;
    }
    if (title.includes("advanced penetration testing")) {
      moduleMap["advanced-pentest"] = module._id;
    }
    if (title.includes("incident response")) {
      moduleMap["incident-response"] = module._id;
    }
  });
  
  return { modules, moduleMap };
}

/**
 * Dynamically find users and create mapping
 */
async function getUserMapping() {
  const users = await User.find({}).select('_id username role');
  const userMap = {};
  
  users.forEach((user) => {
    userMap[user.username] = user._id;
  });
  
  return { users, userMap };
}

/**
 * Dynamically find content and create mapping for user progress
 */
async function getContentMapping() {
  const content = await Content.find({ isActive: true }).select('_id title moduleId');
  const contentMap = {};
  
  content.forEach((item) => {
    // Create a simplified key based on title
    const key = item.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
    contentMap[key] = item._id;
  });
  
  return { content, contentMap };
}

/**
 * Validate that required dependencies exist before seeding
 */
async function validateDependencies(operation, dependencies) {
  console.log(`🔍 Validating dependencies for ${operation}...`);
  
  const counts = await checkDependencies(dependencies);
  const missing = [];
  
  for (const [model, count] of Object.entries(counts)) {
    if (count === 0) {
      missing.push(model);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing dependencies for ${operation}: ${missing.join(', ')}. ` +
      `Please seed these models first.`
    );
  }
  
  console.log(`✅ All dependencies satisfied for ${operation}:`, 
    Object.entries(counts).map(([model, count]) => `${model}(${count})`).join(', ')
  );
  
  return true;
}

// ===================================================================
// SEEDING FUNCTIONS
// ===================================================================

/**
 * Clear all database collections in proper dependency order
 */
async function clearDatabase() {
  try {
    console.log("🗑️  CLEARING ALL DATABASE COLLECTIONS");
    console.log("=====================================");

    // Clear in reverse dependency order to avoid foreign key issues
    // Tier 3 (depends on everything)
    await clearCollection(UserProgress, "user progress");
    
    // Tier 2 (depends on tier 1)
    await clearCollection(Content, "content items");
    await clearCollection(UserEnrollment, "user enrollments");
    await clearCollection(UserAchievement, "user achievements");
    
    // Tier 1 (depends on tier 0)
    await clearCollection(Module, "modules");
    
    // Tier 0 (no dependencies)
    await clearCollection(Phase, "phases");
    await clearCollection(User, "users");
    await clearCollection(Achievement, "achievements");

    console.log("✅ All collections cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing database:", error.message);
    throw error;
  }
}

/**
 * Seed phases into database
 */
async function seedPhases() {
  try {
    console.log("🌱 Seeding phases...");

    // Check if phases already exist
    const existingCount = await Phase.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  Found ${existingCount} existing phases. Use reseed to overwrite.`
      );
      return await Phase.find({}).sort({ order: 1 });
    }

    const phases = await resetCollection(Phase, PHASES_DATA, "phases");
    console.log(`✅ Created ${phases.length} phases`);
    return phases;
  } catch (error) {
    console.error("❌ Error seeding phases:", error.message);
    throw error;
  }
}

/**
 * Seed modules into database with dynamic phase references
 */
async function seedModules() {
  try {
    console.log("🌱 Seeding modules...");

    // Validate dependencies - we need phases
    await validateDependencies("modules", ["Phase"]);

    // Check if modules already exist
    const existingCount = await Module.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  Found ${existingCount} existing modules. Use reseed to overwrite.`
      );
      return await Module.find({}).sort({ order: 1 });
    }

    // Get dynamic phase mapping
    const { phaseMap } = await getPhaseMapping();

    console.log("📋 Dynamic phase mapping created:", {
      beginner: phaseMap["beginner"] ? "✅" : "❌",
      intermediate: phaseMap["intermediate"] ? "✅" : "❌",
      advanced: phaseMap["advanced"] ? "✅" : "❌",
    });

    // Validate that all required phases exist
    const missingPhases = [];
    const requiredPhases = ["beginner", "intermediate", "advanced"];
    
    for (const phaseKey of requiredPhases) {
      if (!phaseMap[phaseKey]) {
        missingPhases.push(phaseKey);
      }
    }

    if (missingPhases.length > 0) {
      throw new Error(
        `Missing required phases: ${missingPhases.join(', ')}. ` +
        `Please ensure phases with titles containing these keywords exist.`
      );
    }

    // Process module data with dynamic ObjectId references
    const processedModules = MODULES_DATA.map((module) => {
      const phaseObjectId = phaseMap[module.phaseId];
      if (!phaseObjectId) {
        throw new Error(`Phase not found for phaseId: ${module.phaseId}`);
      }

      return {
        ...module,
        phaseId: phaseObjectId,
      };
    });

    const modules = await resetCollection(Module, processedModules, "modules");
    console.log(`✅ Created ${modules.length} modules with dynamic phase references`);
    return modules;
  } catch (error) {
    console.error("❌ Error seeding modules:", error.message);
    throw error;
  }
}

/**
 * Seed content into database with dynamic module references and order fields
 */
async function seedContent(modules = null) {
  try {
    console.log("🌱 Seeding content...");

    // Validate dependencies - we need modules
    await validateDependencies("content", ["Module"]);

    // Check if content already exists
    const existingCount = await Content.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  Found ${existingCount} existing content items. Use reseed to overwrite.`
      );
      return await Content.find({}).sort({ moduleId: 1, section: 1, order: 1 });
    }

    // Get dynamic module mapping
    const { moduleMap } = await getModuleMapping();

    console.log(
      "📋 Dynamic module mapping created:",
      Object.keys(moduleMap).map((key) => ({
        [key]: moduleMap[key] ? "✅" : "❌",
      }))
    );

    // Validate that all required modules exist
    const requiredModules = [
      "foundations", "linux-basics", "networking-basics", "web-security-intro",
      "penetration-testing", "advanced-networking", "advanced-pentest", "incident-response"
    ];
    
    const missingModules = requiredModules.filter(moduleKey => !moduleMap[moduleKey]);
    
    if (missingModules.length > 0) {
      console.warn(
        `⚠️  Some expected modules not found: ${missingModules.join(', ')}. ` +
        `Content for these modules will be skipped.`
      );
    }

    // Process content data with dynamic ObjectId references and order fields
    const processedContent = [];
    const skippedContent = [];
    const sectionOrderMap = {}; // Track order per module-section

    for (const contentData of CONTENT_DATA) {
      const moduleObjectId = moduleMap[contentData.moduleId];

      if (!moduleObjectId) {
        console.warn(
          `⚠️  Module '${contentData.moduleId}' not found for content '${contentData.title}'`
        );
        skippedContent.push(contentData);
        continue;
      }

      // Generate order for this section
      const sectionKey = `${moduleObjectId}-${contentData.section}`;
      if (!sectionOrderMap[sectionKey]) {
        sectionOrderMap[sectionKey] = 1;
      }

      processedContent.push({
        ...contentData,
        moduleId: moduleObjectId,
        order: sectionOrderMap[sectionKey]++, // Assign and increment order
      });
    }

    if (processedContent.length > 0) {
      const content = await resetCollection(
        Content,
        processedContent,
        "content items"
      );
      console.log(`✅ Created ${content.length} content items with dynamic module references`);

      if (skippedContent.length > 0) {
        console.warn(
          `⚠️  Skipped ${skippedContent.length} content items due to missing modules:`
        );
        skippedContent.forEach((item) =>
          console.warn(`   - ${item.title} (module: ${item.moduleId})`)
        );
      }

      return content;
    } else {
      throw new Error("No valid content to seed - all module mappings failed");
    }
  } catch (error) {
    console.error("❌ Error seeding content:", error.message);
    throw error;
  }
}

/**
 * Seed users into database (admin and student accounts)
 * Uses individual save() to ensure password hashing middleware runs
 */
async function seedUsers() {
  try {
    console.log("🌱 Seeding users...");

    // No dependencies needed for users - they can be seeded independently

    // Check if users already exist
    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  Found ${existingCount} existing users. Use reseed to overwrite.`
      );
      return await User.find({}).sort({ createdAt: 1 });
    }

    // Clear existing users first
    await clearCollection(User, "users");

    // Create users one by one to ensure password hashing middleware runs
    const users = [];
    console.log(`🔄 Creating ${USERS_DATA.length} users with password hashing...`);
    
    for (const userData of USERS_DATA) {
      const user = new User(userData);
      const savedUser = await user.save(); // This triggers password hashing middleware
      users.push(savedUser);
      console.log(`✅ Created user: ${userData.username} (${userData.role})`);
    }

    console.log(`✅ Created ${users.length} users (${users.filter(u => u.role === 'admin').length} admin, ${users.filter(u => u.role === 'student').length} students)`);
    return users;
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    throw error;
  }
}

/**
 * Seed achievements into database
 */
async function seedAchievements() {
  try {
    console.log("🌱 Seeding achievements...");

    // No dependencies needed for achievements - they can be seeded independently

    // Check if achievements already exist
    const existingCount = await Achievement.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  Found ${existingCount} existing achievements. Use reseed to overwrite.`
      );
      return await Achievement.find({}).sort({ category: 1, order: 1 });
    }

    const achievements = await resetCollection(Achievement, ACHIEVEMENTS_DATA, "achievements");
    console.log(`✅ Created ${achievements.length} achievements across ${new Set(achievements.map(a => a.category)).size} categories`);
    return achievements;
  } catch (error) {
    console.error("❌ Error seeding achievements:", error.message);
    throw error;
  }
}

/**
 * Seed user-related data (enrollments, progress, achievements)
 * This requires users, modules, content, and achievements to exist
 */
async function seedUserData() {
  try {
    console.log("🌱 Seeding user data (enrollments, progress, achievements)...");

    // Validate dependencies - we need users, modules, content, and achievements
    await validateDependencies("user data", ["User", "Module", "Content", "Achievement"]);

    // Get mappings for creating relationships
    const { users } = await getUserMapping();
    const { modules } = await getModuleMapping();
    const { content } = await getContentMapping();

    console.log(`📋 Found ${users.length} users, ${modules.length} modules, ${content.length} content items`);

    // Create some sample enrollments
    const enrollments = [];
    const studentUsers = users.filter(u => u.role === 'student');

    for (const user of studentUsers) {
      // Each student enrolls in 1-3 random modules
      const enrollmentCount = Math.floor(Math.random() * 3) + 1;
      const selectedModules = modules
        .sort(() => 0.5 - Math.random())
        .slice(0, enrollmentCount);

      for (const module of selectedModules) {
        enrollments.push({
          userId: user._id,
          moduleId: module._id,
          status: Math.random() > 0.3 ? 'active' : 'completed',
          completedSections: Math.floor(Math.random() * 5),
          totalSections: 5,
          progressPercentage: Math.floor(Math.random() * 100),
        });
      }
    }

    // Create enrollments if any don't exist
    const existingEnrollments = await UserEnrollment.countDocuments();
    if (existingEnrollments === 0 && enrollments.length > 0) {
      await resetCollection(UserEnrollment, enrollments, "user enrollments");
      console.log(`✅ Created ${enrollments.length} user enrollments`);
    } else {
      console.log(`⚠️  Found ${existingEnrollments} existing enrollments. Skipping enrollment creation.`);
    }

    // Create some sample progress
    const progressEntries = [];
    for (const user of studentUsers) {
      // Each student has progress on some random content
      const progressCount = Math.floor(Math.random() * 10) + 5;
      const selectedContent = content
        .sort(() => 0.5 - Math.random())
        .slice(0, progressCount);

      for (const contentItem of selectedContent) {
        const progressPercentage = Math.floor(Math.random() * 100);
        const status = progressPercentage === 0 ? 'not-started' : 
                      progressPercentage === 100 ? 'completed' : 'in-progress';

        progressEntries.push({
          userId: user._id,
          contentId: contentItem._id,
          contentType: ['video', 'lab', 'game', 'document'][Math.floor(Math.random() * 4)],
          status,
          progressPercentage,
          startedAt: progressPercentage > 0 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
          completedAt: status === 'completed' ? new Date() : null,
          score: status === 'completed' ? Math.floor(Math.random() * 100) + 50 : null,
          maxScore: status === 'completed' ? 100 : null,
        });
      }
    }

    // Create progress if any don't exist
    const existingProgress = await UserProgress.countDocuments();
    if (existingProgress === 0 && progressEntries.length > 0) {
      await resetCollection(UserProgress, progressEntries, "user progress");
      console.log(`✅ Created ${progressEntries.length} user progress entries`);
    } else {
      console.log(`⚠️  Found ${existingProgress} existing progress entries. Skipping progress creation.`);
    }

    // Create some sample user achievements
    const userAchievements = [];
    const achievements = await Achievement.find({}).sort({ order: 1 });

    for (const user of studentUsers) {
      // Each student has progress on some achievements
      const achievementCount = Math.floor(Math.random() * 5) + 2;
      const selectedAchievements = achievements
        .sort(() => 0.5 - Math.random())
        .slice(0, achievementCount);

      for (const achievement of selectedAchievements) {
        // Skip achievements without targets (like special achievements)
        if (!achievement.requirements.target) {
          console.warn(`⚠️ Skipping achievement '${achievement.title}' - no target specified`);
          continue;
        }

        const currentProgress = Math.floor(Math.random() * achievement.requirements.target);
        const isCompleted = currentProgress >= achievement.requirements.target;

        userAchievements.push({
          userId: user._id,
          achievementId: achievement._id,
          progress: {
            current: currentProgress,
            target: achievement.requirements.target,
          },
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
          earnedRewards: isCompleted ? {
            xp: achievement.rewards.xp,
            badge: achievement.rewards.badge,
            title: achievement.rewards.title,
          } : {},
        });
      }
    }

    // Create user achievements if any don't exist
    const existingUserAchievements = await UserAchievement.countDocuments();
    if (existingUserAchievements === 0 && userAchievements.length > 0) {
      await resetCollection(UserAchievement, userAchievements, "user achievements");
      console.log(`✅ Created ${userAchievements.length} user achievement entries`);
    } else {
      console.log(`⚠️  Found ${existingUserAchievements} existing user achievements. Skipping user achievement creation.`);
    }

    return {
      enrollments: enrollments.length,
      progress: progressEntries.length,
      userAchievements: userAchievements.length,
    };
  } catch (error) {
    console.error("❌ Error seeding user data:", error.message);
    throw error;
  }
}

/**
 * Seed core collections in proper dependency order (phases, modules, content)
 */
async function seedDatabase() {
  try {
    console.log("🌱 STARTING CORE DATABASE SEEDING");
    console.log("==================================");

    // Step 1: Seed phases (no dependencies)
    const phases = await seedPhases();

    // Step 2: Seed modules (depends on phases)
    const modules = await seedModules();

    // Step 3: Seed content (depends on modules)
    const content = await seedContent();

    console.log("\n🎉 CORE DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=================================================");

    // Show summary
    console.log("📊 SEEDING SUMMARY:");
    console.log(`   Phases: ${phases.length}`);
    console.log(`   Modules: ${modules.length}`);
    console.log(`   Content: ${content.length}`);

    return {
      phases: phases.length,
      modules: modules.length,
      content: content.length,
    };
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error.message);
    throw error;
  }
}

/**
 * Seed all collections in proper dependency order (complete seeding)
 */
async function seedAll() {
  try {
    console.log("🌱 STARTING COMPLETE DATABASE SEEDING");
    console.log("======================================");

    // Tier 0: No dependencies
    console.log("\n📊 TIER 0: Independent Models");
    const phases = await seedPhases();
    const users = await seedUsers();
    const achievements = await seedAchievements();

    // Tier 1: Depends on Tier 0
    console.log("\n📊 TIER 1: Phase-dependent Models");
    const modules = await seedModules();

    // Tier 2: Depends on Tier 1
    console.log("\n📊 TIER 2: Module-dependent Models");
    const content = await seedContent();

    // Tier 3: Depends on everything
    console.log("\n📊 TIER 3: User Relationship Models");
    const userData = await seedUserData();

    console.log("\n🎉 COMPLETE DATABASE SEEDING FINISHED!");
    console.log("=======================================");

    // Show comprehensive summary
    console.log("📊 COMPLETE SEEDING SUMMARY:");
    console.log(`   Phases: ${phases.length}`);
    console.log(`   Modules: ${modules.length}`);
    console.log(`   Content: ${content.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Achievements: ${achievements.length}`);
    console.log(`   User Enrollments: ${userData.enrollments}`);
    console.log(`   User Progress: ${userData.progress}`);
    console.log(`   User Achievements: ${userData.userAchievements}`);

    return {
      phases: phases.length,
      modules: modules.length,
      content: content.length,
      users: users.length,
      achievements: achievements.length,
      ...userData,
    };
  } catch (error) {
    console.error("\n❌ Complete database seeding failed:", error.message);
    throw error;
  }
}

/**
 * Main function to handle command line operations
 */
async function main() {
  try {
    console.log("🔌 Connecting to database...");
    await database.connect();
    console.log("✅ Database connected");

    // Get command from arguments
    const command = process.argv[2] || "help";

    switch (command) {
      case "seed":
        await seedDatabase();
        break;

      case "all":
        await seedAll();
        break;

      case "phases":
        await seedPhases();
        break;

      case "modules":
        await seedModules();
        break;

      case "content":
        await seedContent();
        break;

      case "users":
        await seedUsers();
        break;

      case "achievements":
        await seedAchievements();
        break;

      case "user-data":
        await seedUserData();
        break;

      case "clear":
        await clearDatabase();
        break;

      case "reseed":
        console.log("🔄 RESEEDING CORE DATABASE");
        console.log("===========================");
        await clearDatabase();
        await seedDatabase();
        break;

      case "reseed-all":
        console.log("🔄 RESEEDING ALL DATABASE");
        console.log("==========================");
        await clearDatabase();
        await seedAll();
        break;

      case "help":
      default:
        console.log("\n🛡️  Hack The World - Dynamic Seeding System");
        console.log("=============================================");
        console.log("\nUsage:");
        console.log("  node src/utils/seed.js [command]");
        console.log("  pnpm seed [command]");
        console.log("\nCommands:");
        console.log("  seed         - Seed core data (phases, modules, content)");
        console.log("  all          - Seed all data (core + users + achievements + user-data)");
        console.log("  phases       - Seed phases only");
        console.log("  modules      - Seed modules only (requires phases)");
        console.log("  content      - Seed content only (requires modules)");
        console.log("  users        - Seed users only (admin + students)");
        console.log("  achievements - Seed achievements only");
        console.log("  user-data    - Seed user relationships (requires users, modules, content, achievements)");
        console.log("  clear        - Clear all data from database");
        console.log("  reseed       - Clear and reseed core data");
        console.log("  reseed-all   - Clear and reseed all data");
        console.log("  help         - Show this help message");
        console.log("\nDependency Tiers:");
        console.log("  Tier 0: phases, users, achievements (no dependencies)");
        console.log("  Tier 1: modules (requires phases)");
        console.log("  Tier 2: content (requires modules)");
        console.log("  Tier 3: user-data (requires users, modules, content, achievements)");
        console.log("\nExamples:");
        console.log("  pnpm seed           # Seed core data only");
        console.log("  pnpm seed all       # Seed everything");
        console.log("  pnpm seed users     # Seed users only");
        console.log("  pnpm seed clear     # Clear all data");
        return;
    }

    console.log("\n✅ Operation completed successfully!");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await database.disconnect();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
}

// Export functions for use in other scripts
module.exports = {
  seedDatabase,
  seedAll,
  clearDatabase,
  seedPhases,
  seedModules,
  seedContent,
  seedUsers,
  seedAchievements,
  seedUserData,
  validateDependencies,
  getPhaseMapping,
  getModuleMapping,
  getUserMapping,
  getContentMapping,
};

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
