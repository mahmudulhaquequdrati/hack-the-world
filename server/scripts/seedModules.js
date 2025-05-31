#!/usr/bin/env node

// Load environment variables
require("dotenv").config();

const mongoose = require("mongoose");
const {
  seedModules,
  clearModules,
  reseedModules,
  getModuleStatus,
} = require("../src/utils/seedModules");

// Import database connection (Database class instance)
const database = require("../src/config/database");

/**
 * 🛡️ Hack The World - Module Seeding CLI
 *
 * Usage:
 *   node scripts/seedModules.js seed     - Seed modules
 *   node scripts/seedModules.js clear    - Clear all modules
 *   node scripts/seedModules.js reseed   - Clear and reseed modules
 *   node scripts/seedModules.js status   - Show module status
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
        console.log("\n🌱 SEEDING MODULES");
        console.log("==================");
        await seedModules();
        break;

      case "clear":
        console.log("\n🗑️  CLEARING MODULES");
        console.log("===================");
        await clearModules();
        break;

      case "reseed":
        console.log("\n🔄 RESEEDING MODULES");
        console.log("===================");
        await reseedModules();
        break;

      case "status":
        console.log("\n📊 MODULE STATUS");
        console.log("================");
        await getModuleStatus();
        break;

      default:
        console.log("\n🛡️  Hack The World - Module Seeding CLI");
        console.log("========================================");
        console.log("\nUsage:");
        console.log("  pnpm run seed:modules [command]");
        console.log("\nCommands:");
        console.log("  seed     - Seed cybersecurity modules");
        console.log("  clear    - Clear all modules from database");
        console.log("  reseed   - Clear and reseed modules");
        console.log("  status   - Show current module status");
        console.log("\nExamples:");
        console.log("  pnpm run seed:modules seed");
        console.log("  pnpm run seed:modules status");
        console.log("  pnpm run seed:modules reseed");
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
