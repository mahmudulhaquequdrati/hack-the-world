require("dotenv").config();
const mongoose = require("mongoose");
const database = require("../config/database");

// Import existing models only
const Phase = require("../models/Phase");
const Module = require("../models/Module");
const User = require("../models/User");

// Import utilities
const { getDatabaseStatus, resetCollection } = require("./dbUtils");

/**
 * Seed Data Utility
 * Populates the database with initial data
 */

// Phase data (from appData.ts PHASES array)
const PHASES_DATA = [
  {
    phaseId: "beginner",
    title: "Beginner Phase",
    description: "Foundation courses for cybersecurity beginners",
    icon: "Lightbulb",
    color: "#10B981",
    order: 1,
    estimatedDuration: "4-6 weeks",
    difficultyLevel: 1,
  },
  {
    phaseId: "intermediate",
    title: "Intermediate Phase",
    description: "Advanced security concepts and practical skills",
    icon: "Target",
    color: "#F59E0B",
    order: 2,
    estimatedDuration: "6-8 weeks",
    difficultyLevel: 3,
  },
  {
    phaseId: "advanced",
    title: "Advanced Phase",
    description: "Expert-level security specializations",
    icon: "Brain",
    color: "#EF4444",
    order: 3,
    estimatedDuration: "8-12 weeks",
    difficultyLevel: 5,
  },
];

// Module data (from appData.ts MODULES array) - First 6 modules only for now
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
      videos: [
        "intro-to-cybersecurity",
        "security-frameworks",
        "risk-management",
      ],
      labs: ["basic-security-assessment", "password-policy-lab"],
      games: [
        "security-policy-builder",
        "threat-identification",
        "risk-calculator",
      ],
      documents: ["cybersecurity-glossary", "security-standards-overview"],
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
      videos: [
        "linux-introduction",
        "file-system-navigation",
        "text-manipulation",
      ],
      labs: ["command-line-basics", "file-permissions-lab"],
      games: ["command-memory", "file-explorer"],
      documents: ["linux-command-reference", "bash-scripting-basics"],
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
      videos: ["network-protocols", "tcp-ip-model", "routing-switching"],
      labs: ["network-scanning-lab"],
      games: ["protocol-stack", "network-topology"],
      documents: ["networking-glossary", "port-reference"],
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
      videos: ["web-fundamentals", "owasp-top-10", "secure-coding"],
      labs: [],
      games: ["vulnerability-hunter", "secure-code-review"],
      documents: ["owasp-guide", "web-security-checklist"],
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
      videos: [
        "pentest-methodology",
        "reconnaissance",
        "vulnerability-assessment",
      ],
      labs: [],
      games: ["reconnaissance-game", "exploit-challenge"],
      documents: ["pentest-methodology", "tools-reference"],
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
      videos: ["advanced-web-attacks", "sql-injection", "xss-prevention"],
      labs: [],
      games: ["web-exploit-challenge", "secure-coding-game"],
      documents: ["web-security-advanced", "exploit-techniques"],
    },
    tags: ["web-security", "exploitation", "sql-injection"],
  },
];

/**
 * Clear all database collections
 */
async function clearDatabase() {
  try {
    console.log("🗑️  Clearing all database collections...");

    const moduleResult = await Module.deleteMany({});
    console.log(`   Cleared ${moduleResult.deletedCount} modules`);

    const phaseResult = await Phase.deleteMany({});
    console.log(`   Cleared ${phaseResult.deletedCount} phases`);

    console.log("✅ Database cleared successfully");
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

    await resetCollection(Phase, "phases");

    const phases = await Phase.insertMany(PHASES_DATA);
    console.log(`✅ Created ${phases.length} phases`);

    return phases;
  } catch (error) {
    console.error("❌ Error seeding phases:", error.message);
    throw error;
  }
}

/**
 * Seed modules into database
 */
async function seedModules() {
  try {
    console.log("🌱 Seeding modules...");

    await resetCollection(Module, "modules");

    // Remove path and enrollPath from seed data since they're no longer in schema
    const cleanModuleData = MODULES_DATA.map((module) => {
      const { path, enrollPath, ...cleanModule } = module;
      return cleanModule;
    });

    const modules = await Module.insertMany(cleanModuleData);
    console.log(`✅ Created ${modules.length} modules`);

    return modules;
  } catch (error) {
    console.error("❌ Error seeding modules:", error.message);
    throw error;
  }
}

/**
 * Create admin user for testing
 */
async function createAdminUser() {
  try {
    console.log("👤 Creating admin user...");

    const adminUser = {
      username: "admin",
      email: "admin@hacktheworld.dev",
      password: "SecurePass123!",
      role: "admin",
      profile: {
        firstName: "Admin",
        lastName: "User",
        bio: "System administrator for Hack The World platform",
        location: "Global",
        website: "https://hacktheworld.dev",
        socialLinks: {
          linkedin: "https://linkedin.com/company/hacktheworld",
          github: "https://github.com/hacktheworld",
        },
      },
      preferences: {
        emailNotifications: true,
        theme: "dark",
        language: "en",
      },
    };

    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists. Skipping.");
      return existingAdmin;
    }

    const admin = await User.create(adminUser);
    console.log(`✅ Created admin user: ${admin.email}`);

    return admin;
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    throw error;
  }
}

/**
 * Seed all database collections
 */
async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");
    console.log("================================");

    // Step 1: Seed phases first (modules depend on phases)
    await seedPhases();

    // Step 2: Seed modules
    await seedModules();

    // Step 3: Create admin user
    await createAdminUser();

    console.log("\n🎉 Database seeding completed successfully!");

    // Show final status
    await getDatabaseStatus();
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error.message);
    throw error;
  }
}

/**
 * Main function to run seeding
 */
async function main() {
  try {
    console.log("🔌 Connecting to database...");
    await database.connect();
    console.log("✅ Database connected");

    // Get command line argument
    const command = process.argv[2] || "seed";

    switch (command) {
      case "seed":
        await seedDatabase();
        break;

      case "clear":
        await clearDatabase();
        break;

      case "reseed":
        console.log("🔄 Reseeding database...");
        await clearDatabase();
        await seedDatabase();
        break;

      case "status":
        await getDatabaseStatus();
        break;

      default:
        console.log("Usage: node seedData.js [seed|clear|reseed|status]");
        break;
    }
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  } finally {
    await database.disconnect();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
}

// Export functions for use in other scripts
module.exports = {
  seedDatabase,
  clearDatabase,
  seedPhases,
  seedModules,
  createAdminUser,
  PHASES_DATA,
  MODULES_DATA,
};

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
