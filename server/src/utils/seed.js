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

// ===================================================================
// SEEDING FUNCTIONS
// ===================================================================

/**
 * Clear core database collections (phases, modules, content)
 */
async function clearDatabase() {
  try {
    console.log("🗑️  CLEARING CORE DATABASE COLLECTIONS");
    console.log("=======================================");

    // Clear in reverse dependency order to avoid foreign key issues
    await clearCollection(Content, "content items");
    await clearCollection(Module, "modules");
    await clearCollection(Phase, "phases");

    console.log("✅ Core collections cleared successfully");
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
 * Seed modules into database with proper phase references
 */
async function seedModules(phases = null) {
  try {
    console.log("🌱 Seeding modules...");

    // Get phases if not provided
    if (!phases) {
      phases = await Phase.find({}).sort({ order: 1 });
      if (phases.length === 0) {
        throw new Error("No phases found. Please seed phases first.");
      }
    }

    // Check if modules already exist
    const existingCount = await Module.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  Found ${existingCount} existing modules. Use reseed to overwrite.`
      );
      return await Module.find({}).sort({ order: 1 });
    }

    // Create phase mapping for ObjectId resolution
    const phaseMap = {};
    phases.forEach((phase) => {
      if (phase.title.toLowerCase().includes("beginner"))
        phaseMap["beginner"] = phase._id;
      if (phase.title.toLowerCase().includes("intermediate"))
        phaseMap["intermediate"] = phase._id;
      if (phase.title.toLowerCase().includes("advanced"))
        phaseMap["advanced"] = phase._id;
    });

    console.log("📋 Phase mapping created:", {
      beginner: phaseMap["beginner"] ? "✅" : "❌",
      intermediate: phaseMap["intermediate"] ? "✅" : "❌",
      advanced: phaseMap["advanced"] ? "✅" : "❌",
    });

    // Process module data with proper ObjectId references
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
    console.log(`✅ Created ${modules.length} modules`);
    return modules;
  } catch (error) {
    console.error("❌ Error seeding modules:", error.message);
    throw error;
  }
}

/**
 * Seed content into database with proper module references and order fields
 */
async function seedContent(modules = null) {
  try {
    console.log("🌱 Seeding content...");

    // Get modules if not provided
    if (!modules) {
      modules = await Module.find({}).sort({ order: 1 });
      if (modules.length === 0) {
        throw new Error("No modules found. Please seed modules first.");
      }
    }

    // Check if content already exists
    const existingCount = await Content.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  Found ${existingCount} existing content items. Use reseed to overwrite.`
      );
      return await Content.find({}).sort({ moduleId: 1, section: 1, order: 1 });
    }

    // Create module mapping for ObjectId resolution
    const moduleMap = {};
    modules.forEach((module) => {
      // Map common variations based on title matching (case insensitive)
      const title = module.title.toLowerCase();
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

    console.log(
      "📋 Module mapping created:",
      Object.keys(moduleMap).map((key) => ({
        [key]: moduleMap[key] ? "✅" : "❌",
      }))
    );

    // Process content data with proper ObjectId references and order fields
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
      console.log(`✅ Created ${content.length} content items`);

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
 * Seed core collections in proper dependency order (phases, modules, content)
 */
async function seedDatabase() {
  try {
    console.log("🌱 STARTING CORE DATABASE SEEDING");
    console.log("==================================");

    // Step 1: Seed phases (no dependencies)
    const phases = await seedPhases();

    // Step 2: Seed modules (depends on phases)
    const modules = await seedModules(phases);

    // Step 3: Seed content (depends on modules)
    const content = await seedContent(modules);

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

      case "phases":
        await seedPhases();
        break;

      case "modules":
        const phasesForModules = await Phase.find({}).sort({ order: 1 });
        if (phasesForModules.length === 0) {
          console.error(
            "❌ No phases found. Please seed phases first: pnpm seed phases"
          );
          process.exit(1);
        }
        await seedModules(phasesForModules);
        break;

      case "content":
        const modulesForContent = await Module.find({}).sort({ order: 1 });
        if (modulesForContent.length === 0) {
          console.error(
            "❌ No modules found. Please seed modules first: pnpm seed modules"
          );
          process.exit(1);
        }
        await seedContent(modulesForContent);
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

      case "help":
      default:
        console.log("\n🛡️  Hack The World - Core Seeding System");
        console.log("=========================================");
        console.log("\nUsage:");
        console.log("  node src/utils/seed.js [command]");
        console.log("  pnpm seed [command]");
        console.log("\nCommands:");
        console.log("  seed     - Seed core data (phases, modules, content)");
        console.log("  phases   - Seed phases only");
        console.log("  modules  - Seed modules only (requires phases)");
        console.log("  content  - Seed content only (requires modules)");
        console.log("  clear    - Clear core data from database");
        console.log("  reseed   - Clear and reseed core data");
        console.log("  help     - Show this help message");
        console.log("\nExamples:");
        console.log("  pnpm seed");
        console.log("  pnpm seed phases");
        console.log("  pnpm seed clear");
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
  clearDatabase,
  seedPhases,
  seedModules,
  seedContent,
};

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
