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
const { CONTENT_DATA } = require("../data/contentData");

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
    description: "Basic web application security concepts and common vulnerabilities",
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
      console.log(`⚠️  Found ${existingCount} existing phases. Use reseed to overwrite.`);
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
      console.log(`⚠️  Found ${existingCount} existing modules. Use reseed to overwrite.`);
      return await Module.find({}).sort({ order: 1 });
    }

    // Create phase mapping for ObjectId resolution
    const phaseMap = {};
    phases.forEach((phase) => {
      if (phase.title.toLowerCase().includes("beginner")) phaseMap["beginner"] = phase._id;
      if (phase.title.toLowerCase().includes("intermediate")) phaseMap["intermediate"] = phase._id;
      if (phase.title.toLowerCase().includes("advanced")) phaseMap["advanced"] = phase._id;
    });

    console.log("📋 Phase mapping created:", {
      beginner: phaseMap["beginner"] ? "✅" : "❌",
      intermediate: phaseMap["intermediate"] ? "✅" : "❌", 
      advanced: phaseMap["advanced"] ? "✅" : "❌"
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
      console.log(`⚠️  Found ${existingCount} existing content items. Use reseed to overwrite.`);
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

    console.log("📋 Module mapping created:", Object.keys(moduleMap).map(key => ({
      [key]: moduleMap[key] ? "✅" : "❌"
    })));

    // Process content data with proper ObjectId references and order fields
    const processedContent = [];
    const skippedContent = [];
    const sectionOrderMap = {}; // Track order per module-section

    for (const contentData of CONTENT_DATA) {
      const moduleObjectId = moduleMap[contentData.moduleId];

      if (!moduleObjectId) {
        console.warn(`⚠️  Module '${contentData.moduleId}' not found for content '${contentData.title}'`);
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
      const content = await resetCollection(Content, processedContent, "content items");
      console.log(`✅ Created ${content.length} content items`);
      
      if (skippedContent.length > 0) {
        console.warn(`⚠️  Skipped ${skippedContent.length} content items due to missing modules:`);
        skippedContent.forEach(item => console.warn(`   - ${item.title} (module: ${item.moduleId})`));
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
          console.error("❌ No phases found. Please seed phases first: pnpm seed phases");
          process.exit(1);
        }
        await seedModules(phasesForModules);
        break;

      case "content":
        const modulesForContent = await Module.find({}).sort({ order: 1 });
        if (modulesForContent.length === 0) {
          console.error("❌ No modules found. Please seed modules first: pnpm seed modules");
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