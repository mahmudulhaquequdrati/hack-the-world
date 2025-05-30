require("dotenv").config();
const mongoose = require("mongoose");
const database = require("../config/database");

// Import models
const Phase = require("../models/Phase");
const Module = require("../models/Module");
const Game = require("../models/Game");
const Lab = require("../models/Lab");
const User = require("../models/User");

/**
 * Seed Data Utility
 * Populates the database with initial data from frontend appData.ts
 */

// Phase data (from appData.ts PHASES array)
const PHASES_DATA = [
  {
    id: "beginner",
    title: "Beginner Phase",
    description: "Foundation courses for cybersecurity beginners",
    icon: "Lightbulb",
    color: "text-green-400",
    order: 1,
    estimatedDuration: "4-6 weeks",
    difficultyLevel: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Phase",
    description: "Advanced security concepts and practical skills",
    icon: "Target",
    color: "text-yellow-400",
    order: 2,
    estimatedDuration: "6-8 weeks",
    difficultyLevel: 3,
  },
  {
    id: "advanced",
    title: "Advanced Phase",
    description: "Expert-level security specializations",
    icon: "Brain",
    color: "text-red-400",
    order: 3,
    estimatedDuration: "8-12 weeks",
    difficultyLevel: 5,
  },
];

// Module data (from appData.ts MODULES array)
const MODULES_DATA = [
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
    content: {
      estimatedHours: 40,
      lessonsCount: 12,
      labsCount: 2,
      gamesCount: 3,
      assetsCount: 15,
    },
    tags: ["fundamentals", "security", "basics"],
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
    content: {
      estimatedHours: 35,
      lessonsCount: 10,
      labsCount: 2,
      gamesCount: 2,
      assetsCount: 12,
    },
    tags: ["linux", "command-line", "terminal"],
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
    content: {
      estimatedHours: 45,
      lessonsCount: 15,
      labsCount: 1,
      gamesCount: 2,
      assetsCount: 18,
    },
    tags: ["networking", "protocols", "tcp-ip"],
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
    content: {
      estimatedHours: 38,
      lessonsCount: 11,
      labsCount: 0,
      gamesCount: 2,
      assetsCount: 14,
    },
    tags: ["web-security", "vulnerabilities", "owasp"],
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
    content: {
      estimatedHours: 60,
      lessonsCount: 18,
      labsCount: 0,
      gamesCount: 2,
      assetsCount: 25,
    },
    tags: ["penetration-testing", "ethical-hacking", "reconnaissance"],
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
    content: {
      estimatedHours: 70,
      lessonsCount: 20,
      labsCount: 0,
      gamesCount: 2,
      assetsCount: 30,
    },
    tags: ["web-security", "exploitation", "sql-injection"],
  },
];

// Game data (from appData.ts GAMES array)
const GAMES_DATA = [
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
    objectives: [
      {
        id: "spb-1",
        objective: "Create comprehensive security policies",
        points: 25,
        order: 1,
      },
      {
        id: "spb-2",
        objective: "Identify policy gaps and weaknesses",
        points: 25,
        order: 2,
      },
      {
        id: "spb-3",
        objective: "Implement security controls",
        points: 25,
        order: 3,
      },
      {
        id: "spb-4",
        objective: "Test policy effectiveness",
        points: 25,
        order: 4,
      },
    ],
    config: {
      allowMultipleAttempts: true,
      maxAttempts: 3,
      passingScore: 70,
      showHints: true,
      showSolutions: false,
    },
    tags: ["policy", "governance", "strategy"],
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
    objectives: [
      {
        id: "rmc-1",
        objective: "Analyze security risks",
        points: 40,
        order: 1,
      },
      {
        id: "rmc-2",
        objective: "Calculate risk scores",
        points: 40,
        order: 2,
      },
      {
        id: "rmc-3",
        objective: "Prioritize risks by impact",
        points: 35,
        order: 3,
      },
      {
        id: "rmc-4",
        objective: "Create mitigation strategies",
        points: 35,
        order: 4,
      },
    ],
    config: {
      allowMultipleAttempts: true,
      maxAttempts: 3,
      passingScore: 75,
      showHints: true,
      showSolutions: false,
    },
    tags: ["risk-management", "analysis", "prioritization"],
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
    objectives: [
      {
        id: "clm-1",
        objective: "Execute basic file operations",
        points: 100,
        order: 1,
      },
      {
        id: "clm-2",
        objective: "Navigate directory structures",
        points: 100,
        order: 2,
      },
      {
        id: "clm-3",
        objective: "Use text processing commands",
        points: 150,
        order: 3,
      },
      {
        id: "clm-4",
        objective: "Manage file permissions",
        points: 150,
        order: 4,
      },
    ],
    config: {
      allowMultipleAttempts: true,
      maxAttempts: 5,
      passingScore: 60,
      showHints: true,
      showSolutions: false,
    },
    tags: ["linux", "command-line", "speed"],
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
    objectives: [
      {
        id: "psc-1",
        objective: "Capture network packets",
        points: 100,
        order: 1,
      },
      {
        id: "psc-2",
        objective: "Identify suspicious traffic",
        points: 100,
        order: 2,
      },
      {
        id: "psc-3",
        objective: "Analyze protocol headers",
        points: 100,
        order: 3,
      },
      {
        id: "psc-4",
        objective: "Generate security report",
        points: 100,
        order: 4,
      },
    ],
    config: {
      allowMultipleAttempts: true,
      maxAttempts: 3,
      passingScore: 70,
      showHints: true,
      showSolutions: false,
    },
    tags: ["networking", "analysis", "wireshark"],
  },
];

// Lab data (from appData.ts LABS array)
const LABS_DATA = [
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
    objectives: [
      {
        id: "ras-obj-1",
        objective: "Analyze company infrastructure for risks",
        order: 1,
      },
      {
        id: "ras-obj-2",
        objective: "Calculate risk scores using standard matrices",
        order: 2,
      },
      {
        id: "ras-obj-3",
        objective: "Prioritize risks based on business impact",
        order: 3,
      },
      {
        id: "ras-obj-4",
        objective: "Create comprehensive risk report",
        order: 4,
      },
    ],
    steps: [
      {
        id: "ras-step-1",
        title: "Environment Setup",
        description:
          "Set up the simulation environment and access company data",
        order: 1,
        instructions:
          "Access the virtual company network and familiarize yourself with the infrastructure",
        expectedOutput: "Successfully connected to simulation environment",
        hints: [
          {
            text: "Check network documentation first",
            showAfter: 60,
          },
        ],
        validation: {
          type: "manual",
          criteria: "Environment setup completed",
          autoCheck: false,
        },
      },
      {
        id: "ras-step-2",
        title: "Asset Discovery",
        description: "Identify and catalog all company assets",
        order: 2,
        instructions:
          "Use provided tools to discover and document all digital assets",
        expectedOutput: "Complete asset inventory list",
        hints: [
          {
            text: "Don't forget cloud resources",
            showAfter: 120,
          },
        ],
        validation: {
          type: "manual",
          criteria: "Asset inventory completed",
          autoCheck: false,
        },
      },
    ],
    config: {
      environment: "virtual",
      prerequisites: ["basic-security-knowledge"],
      tools: [
        {
          name: "Risk Assessment Tool",
          version: "1.0",
          required: true,
          downloadUrl: "/tools/risk-assessment-tool",
        },
      ],
      estimatedTime: 45,
      difficulty: 1,
    },
    resources: {
      instructions: "Complete risk assessment following industry standards",
      downloadableFiles: [
        {
          name: "Company Profile",
          description: "Fictional company data for assessment",
          url: "/downloads/company-profile.pdf",
          size: "2.5 MB",
          type: "documentation",
        },
      ],
      references: [
        {
          title: "NIST Risk Management Framework",
          url: "https://csrc.nist.gov/projects/risk-management",
          type: "documentation",
        },
      ],
    },
    assessment: {
      type: "manual",
      passingCriteria: "Complete all objectives with accuracy",
      rubric: [
        {
          criteria: "Risk identification",
          maxPoints: 25,
          description: "Accurately identify security risks",
        },
        {
          criteria: "Risk calculation",
          maxPoints: 25,
          description: "Correctly calculate risk scores",
        },
      ],
      submissionFormat: "report",
    },
    tags: ["risk-assessment", "simulation", "beginner"],
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
    objectives: [
      {
        id: "fsm-obj-1",
        objective: "Navigate complex directory structures",
        order: 1,
      },
      {
        id: "fsm-obj-2",
        objective: "Master file and directory operations",
        order: 2,
      },
      {
        id: "fsm-obj-3",
        objective: "Understand and modify permissions",
        order: 3,
      },
      {
        id: "fsm-obj-4",
        objective: "Find and manipulate hidden files",
        order: 4,
      },
    ],
    steps: [
      {
        id: "fsm-step-1",
        title: "Basic Navigation",
        description: "Learn to navigate the Linux file system",
        order: 1,
        instructions:
          "Use cd, ls, pwd commands to explore the directory structure",
        expectedOutput: "Ability to navigate to any directory",
        hints: [
          {
            text: "Use tab completion for faster navigation",
            showAfter: 30,
          },
        ],
        validation: {
          type: "command",
          criteria: "pwd returns /home/user/target",
          autoCheck: true,
        },
      },
    ],
    config: {
      environment: "virtual",
      prerequisites: ["basic-linux-knowledge"],
      tools: [
        {
          name: "Linux Terminal",
          version: "Ubuntu 22.04",
          required: true,
        },
      ],
      estimatedTime: 40,
      difficulty: 1,
    },
    resources: {
      instructions: "Complete all file system exercises",
      setupGuide: "Linux virtual machine will be provided",
    },
    assessment: {
      type: "automated",
      passingCriteria: "Complete all commands successfully",
      submissionFormat: "screenshots",
    },
    tags: ["linux", "file-system", "hands-on"],
  },
];

/**
 * Clear all existing data
 */
async function clearDatabase() {
  console.log("🗑️  Clearing existing data...");

  await Phase.deleteMany({});
  await Module.deleteMany({});
  await Game.deleteMany({});
  await Lab.deleteMany({});

  console.log("✅ Database cleared");
}

/**
 * Seed phases
 */
async function seedPhases() {
  console.log("🌱 Seeding phases...");

  for (const phaseData of PHASES_DATA) {
    const phase = new Phase(phaseData);
    await phase.save();
    console.log(`   ✓ Created phase: ${phase.title}`);
  }

  console.log(`✅ Seeded ${PHASES_DATA.length} phases`);
}

/**
 * Seed modules
 */
async function seedModules() {
  console.log("🌱 Seeding modules...");

  for (const moduleData of MODULES_DATA) {
    const module = new Module(moduleData);
    await module.save();
    console.log(`   ✓ Created module: ${module.title}`);
  }

  console.log(`✅ Seeded ${MODULES_DATA.length} modules`);
}

/**
 * Seed games
 */
async function seedGames() {
  console.log("🌱 Seeding games...");

  for (const gameData of GAMES_DATA) {
    const game = new Game(gameData);
    await game.save();
    console.log(`   ✓ Created game: ${game.name}`);
  }

  console.log(`✅ Seeded ${GAMES_DATA.length} games`);
}

/**
 * Seed labs
 */
async function seedLabs() {
  console.log("🌱 Seeding labs...");

  for (const labData of LABS_DATA) {
    const lab = new Lab(labData);
    await lab.save();
    console.log(`   ✓ Created lab: ${lab.name}`);
  }

  console.log(`✅ Seeded ${LABS_DATA.length} labs`);
}

/**
 * Create admin user
 */
async function createAdminUser() {
  console.log("👤 Creating admin user...");

  const adminUser = new User({
    username: "admin",
    email: "admin@hacktheworld.com",
    password: "HackTheWorld2024!",
    role: "admin",
    profile: {
      firstName: "System",
      lastName: "Administrator",
      displayName: "Admin User",
    },
    experienceLevel: "expert",
    status: "active",
    security: {
      emailVerified: true,
    },
  });

  await adminUser.save();
  console.log("   ✓ Created admin user: admin@hacktheworld.com");
  console.log("   ✓ Password: HackTheWorld2024!");
}

/**
 * Main seed function
 */
async function seedDatabase() {
  try {
    console.log("🚀 Starting database seeding...");
    console.log("=====================================");

    // Connect to database
    await database.connect();

    // Clear existing data
    await clearDatabase();

    // Seed data in correct order (respecting foreign key relationships)
    await seedPhases();
    await seedModules();
    await seedGames();
    await seedLabs();
    await createAdminUser();

    console.log("=====================================");
    console.log("🎉 Database seeding completed successfully!");
    console.log("");
    console.log("📊 Summary:");
    console.log(`   • ${PHASES_DATA.length} phases created`);
    console.log(`   • ${MODULES_DATA.length} modules created`);
    console.log(`   • ${GAMES_DATA.length} games created`);
    console.log(`   • ${LABS_DATA.length} labs created`);
    console.log("   • 1 admin user created");
    console.log("");
    console.log("🔐 Admin Credentials:");
    console.log("   Email: admin@hacktheworld.com");
    console.log("   Password: HackTheWorld2024!");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await database.disconnect();
    process.exit(0);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  clearDatabase,
  PHASES_DATA,
  MODULES_DATA,
  GAMES_DATA,
  LABS_DATA,
};
