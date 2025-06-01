#!/usr/bin/env node

// Load environment variables
require("dotenv").config();

const mongoose = require("mongoose");

// Import database connection
const database = require("../src/config/database");

// Import seeding utilities
// const {
//   seedPhases,
//   reseedPhases,
//   getPhasesSummary,
// } = require("../src/utils/seedPhases");
// const {
//   seedModules,
//   clearModules,
//   reseedModules,
//   getModuleStatus,
// } = require("../src/utils/seedModules");
const { seedPhases, seedModules } = require("../src/utils/seedData");

/**
 * 🛡️ Hack The World - Master Seeding CLI
 *
 * Usage:
 *   node scripts/seedAll.js all         - Seed all data (phases + modules)
 *   node scripts/seedAll.js phases      - Seed phases only
 *   node scripts/seedAll.js modules     - Seed modules only
 *   node scripts/seedAll.js status      - Show status of all collections
 *   node scripts/seedAll.js clear       - Clear all data
 *   node scripts/seedAll.js reseed      - Clear and reseed all data
 */

async function seedAllData() {
  console.log("🌱 SEEDING ALL DATA");
  console.log("==================");

  try {
    // Step 1: Seed phases first (modules depend on phases)
    console.log("\n1️⃣ Seeding phases...");
    await seedPhases();

    // Step 2: Seed modules
    console.log("\n2️⃣ Seeding modules...");
    await seedModules();

    console.log("\n🎉 All data seeded successfully!");
  } catch (error) {
    console.error("❌ Error during full seeding:", error.message);
    throw error;
  }
}

async function clearAllData() {
  console.log("🗑️  CLEARING ALL DATA");
  console.log("====================");

  try {
    const Phase = require("../src/models/Phase");
    const Module = require("../src/models/Module");

    // Clear modules first (they reference phases)
    console.log("\n1️⃣ Clearing modules...");
    const moduleResult = await Module.deleteMany({});
    console.log(`   Deleted ${moduleResult.deletedCount} modules`);

    // Clear phases
    console.log("\n2️⃣ Clearing phases...");
    const phaseResult = await Phase.deleteMany({});
    console.log(`   Deleted ${phaseResult.deletedCount} phases`);

    console.log("\n🧹 All data cleared successfully!");
  } catch (error) {
    console.error("❌ Error during clearing:", error.message);
    throw error;
  }
}

async function showAllStatus() {
  console.log("📊 DATABASE STATUS");
  console.log("=================");

  try {
    console.log("\n🟦 PHASES:");
    console.log("----------");
    await getPhasesSummary();

    console.log("\n🟩 MODULES:");
    console.log("-----------");
    await getModuleStatus();
  } catch (error) {
    console.error("❌ Error getting status:", error.message);
    throw error;
  }
}

async function main() {
  try {
    // Connect to database
    console.log("🔌 Connecting to database...");
    await database.connect();
    console.log("✅ Database connected");

    // Get command from arguments
    const command = process.argv[2] || "help";

    switch (command) {
      case "all":
        await seedAllData();
        break;

      case "phases":
        console.log("\n🌱 SEEDING PHASES ONLY");
        console.log("======================");
        await seedPhases();
        break;

      case "modules":
        console.log("\n🌱 SEEDING MODULES ONLY");
        console.log("=======================");
        await seedModules();
        break;

      case "status":
        await showAllStatus();
        break;

      case "clear":
        await clearAllData();
        break;

      case "help":
      default:
        console.log("\n🛡️  Hack The World - Master Seeding CLI");
        console.log("========================================");
        console.log("\nUsage:");
        console.log("  pnpm run seed:all [command]");
        console.log("\nCommands:");
        console.log("  all       - Seed all data (phases + modules)");
        console.log("  phases    - Seed phases only");
        console.log("  modules   - Seed modules only");
        console.log("  status    - Show status of all collections");
        console.log("  clear     - Clear all data from database");
        console.log("  help      - Show this help message");
        console.log("\nExamples:");
        console.log("  pnpm run seed:all all");
        console.log("  pnpm run seed:all status");
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

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});

// Run the main function
main();
