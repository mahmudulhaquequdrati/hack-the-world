#!/usr/bin/env node

// Load environment variables
require("dotenv").config();

const mongoose = require("mongoose");
const {
  seedPhases,
  reseedPhases,
  getPhasesSummary,
} = require("../src/utils/seedPhases");

// Import database connection (Database class instance)
const database = require("../src/config/database");

/**
 * 🛡️ Hack The World - Phase Seeding CLI
 *
 * Usage:
 *   node scripts/seedPhases.js seed     - Seed phases
 *   node scripts/seedPhases.js clear    - Clear all phases
 *   node scripts/seedPhases.js reseed   - Clear and reseed phases
 *   node scripts/seedPhases.js status   - Show phase status
 */

async function main() {
  try {
    // Connect to database
    console.log("🔌 Connecting to database...");
    await database.connect();
    console.log("✅ Database connected");

    // Get command from arguments
    const command = process.argv[2];

    switch (command) {
      case "seed":
        console.log("\n🌱 SEEDING PHASES");
        console.log("=================");
        await seedPhases();
        break;

      case "clear":
        console.log("\n🗑️  CLEARING PHASES");
        console.log("==================");
        const Phase = require("../src/models/Phase");
        const deleteResult = await Phase.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing phases`);
        break;

      case "reseed":
        console.log("\n🔄 RESEEDING PHASES");
        console.log("==================");
        await reseedPhases();
        break;

      case "status":
        console.log("\n📊 PHASE STATUS");
        console.log("===============");
        await getPhasesSummary();
        break;

      default:
        console.log("\n🛡️  Hack The World - Phase Seeding CLI");
        console.log("======================================");
        console.log("\nUsage:");
        console.log("  pnpm run seed:phases [command]");
        console.log("\nCommands:");
        console.log("  seed     - Seed cybersecurity phases");
        console.log("  clear    - Clear all phases from database");
        console.log("  reseed   - Clear and reseed phases");
        console.log("  status   - Show current phase status");
        console.log("\nExamples:");
        console.log("  pnpm run seed:phases seed");
        console.log("  pnpm run seed:phases status");
        console.log("  pnpm run seed:phases reseed");
        break;
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
