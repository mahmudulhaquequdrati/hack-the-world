#!/usr/bin/env node

/**
 * Migration Script: Recalculate Enrollment Progress
 * 
 * This script recalculates all UserEnrollment progress data based on
 * actual UserProgress completion status. It fixes any inconsistencies
 * between module-level and content-level progress tracking.
 * 
 * Usage:
 * - Dry run: node scripts/migrateEnrollmentProgress.js --dry-run
 * - Full migration: node scripts/migrateEnrollmentProgress.js
 * - Specific user: node scripts/migrateEnrollmentProgress.js --user-id=USER_ID
 * - Specific module: node scripts/migrateEnrollmentProgress.js --module-id=MODULE_ID
 * - Batch size: node scripts/migrateEnrollmentProgress.js --batch-size=50
 */

const mongoose = require("mongoose");
const ProgressSyncService = require("../src/utils/progressSyncService");

// Load environment variables
require("dotenv").config();

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  batchSize: 100,
  userId: null,
  moduleId: null
};

// Parse additional options
args.forEach(arg => {
  if (arg.startsWith('--batch-size=')) {
    options.batchSize = parseInt(arg.split('=')[1]) || 100;
  }
  if (arg.startsWith('--user-id=')) {
    options.userId = arg.split('=')[1];
  }
  if (arg.startsWith('--module-id=')) {
    options.moduleId = arg.split('=')[1];
  }
});

console.log('🚀 Enrollment Progress Migration Tool');
console.log('=====================================');
console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE MIGRATION'}`);
console.log(`Batch Size: ${options.batchSize}`);
if (options.userId) console.log(`Target User: ${options.userId}`);
if (options.moduleId) console.log(`Target Module: ${options.moduleId}`);
console.log('');

async function connectToDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/hack-the-world";
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error disconnecting from MongoDB:", error);
  }
}

async function validateEnrollmentData() {
  console.log("🔍 Validating enrollment data...");
  
  const UserEnrollment = require("../src/models/UserEnrollment");
  const UserProgress = require("../src/models/UserProgress");
  const Content = require("../src/models/Content");
  
  // Get statistics
  const totalEnrollments = await UserEnrollment.countDocuments();
  const totalProgress = await UserProgress.countDocuments();
  const totalContent = await Content.countDocuments({ isActive: true });
  
  console.log(`📊 Database Statistics:`);
  console.log(`   • Enrollments: ${totalEnrollments}`);
  console.log(`   • Progress Records: ${totalProgress}`);
  console.log(`   • Active Content: ${totalContent}`);
  
  // Check for enrollments with zero total sections
  const invalidSectionCounts = await UserEnrollment.countDocuments({ totalSections: 0 });
  if (invalidSectionCounts > 0) {
    console.log(`⚠️  Found ${invalidSectionCounts} enrollments with zero totalSections`);
  }
  
  // Check for progress vs enrollment mismatches
  const sampleEnrollments = await UserEnrollment.find({}).limit(5).populate('moduleId', 'title');
  console.log(`\n📋 Sample Enrollment Data:`);
  
  for (const enrollment of sampleEnrollments) {
    const progressCount = await UserProgress.countDocuments({
      userId: enrollment.userId,
      contentId: { $in: await Content.find({ moduleId: enrollment.moduleId }).distinct('_id') }
    });
    
    console.log(`   • ${enrollment.moduleId?.title || 'Unknown Module'}`);
    console.log(`     Progress: ${enrollment.progressPercentage}% (${enrollment.completedSections}/${enrollment.totalSections})`);
    console.log(`     UserProgress records: ${progressCount}`);
  }
  
  console.log('');
  return {
    totalEnrollments,
    totalProgress,
    totalContent,
    invalidSectionCounts
  };
}

async function migrateSpecificUser(userId) {
  console.log(`👤 Migrating enrollments for user: ${userId}`);
  
  try {
    const results = await ProgressSyncService.syncUserEnrollments(userId);
    console.log(`✅ Successfully synced ${results.length} enrollments for user ${userId}`);
    return { processed: results.length, updated: results.length, errors: 0 };
  } catch (error) {
    console.error(`❌ Error syncing user ${userId}:`, error);
    return { processed: 0, updated: 0, errors: 1 };
  }
}

async function migrateSpecificModule(moduleId) {
  console.log(`📚 Migrating enrollments for module: ${moduleId}`);
  
  try {
    const results = await ProgressSyncService.syncModuleEnrollments(moduleId);
    console.log(`✅ Successfully synced ${results.length} enrollments for module ${moduleId}`);
    return { processed: results.length, updated: results.length, errors: 0 };
  } catch (error) {
    console.error(`❌ Error syncing module ${moduleId}:`, error);
    return { processed: 0, updated: 0, errors: 1 };
  }
}

async function migrateBulkEnrollments() {
  console.log(`📦 Starting bulk migration with batch size: ${options.batchSize}`);
  
  const results = await ProgressSyncService.bulkRecalculateProgress({
    batchSize: options.batchSize,
    dryRun: options.dryRun
  });
  
  return results;
}

async function updateSectionCounts() {
  console.log("🔧 Updating section counts for all modules...");
  
  const Module = require("../src/models/Module");
  const modules = await Module.find({}).select('_id title');
  
  let updated = 0;
  let errors = 0;
  
  for (const module of modules) {
    try {
      if (!options.dryRun) {
        const enrollmentCount = await ProgressSyncService.updateModuleSectionCounts(module._id);
        console.log(`   ✅ Updated ${enrollmentCount} enrollments for module: ${module.title}`);
        updated += enrollmentCount;
      } else {
        console.log(`   🔍 Would update section counts for module: ${module.title}`);
      }
    } catch (error) {
      console.error(`   ❌ Error updating module ${module.title}:`, error);
      errors++;
    }
  }
  
  return { modules: modules.length, updated, errors };
}

async function generateReport(migrationResults, sectionUpdateResults) {
  console.log('\n📊 Migration Report');
  console.log('==================');
  
  if (migrationResults) {
    console.log(`📈 Progress Migration:`);
    console.log(`   • Total Enrollments: ${migrationResults.totalEnrollments}`);
    console.log(`   • Processed: ${migrationResults.processed}`);
    console.log(`   • Updated: ${migrationResults.updated}`);
    console.log(`   • Errors: ${migrationResults.errors}`);
    
    if (migrationResults.totalEnrollments > 0) {
      const successRate = ((migrationResults.processed / migrationResults.totalEnrollments) * 100).toFixed(1);
      console.log(`   • Success Rate: ${successRate}%`);
    }
  }
  
  if (sectionUpdateResults) {
    console.log(`\n🔧 Section Count Updates:`);
    console.log(`   • Modules Processed: ${sectionUpdateResults.modules}`);
    console.log(`   • Enrollments Updated: ${sectionUpdateResults.updated}`);
    console.log(`   • Errors: ${sectionUpdateResults.errors}`);
  }
  
  if (options.dryRun) {
    console.log(`\n⚠️  This was a DRY RUN - no data was actually modified`);
    console.log(`   Run without --dry-run to apply changes`);
  } else {
    console.log(`\n✅ Migration completed successfully!`);
  }
}

async function main() {
  try {
    await connectToDatabase();
    
    // Validate data first
    const validation = await validateEnrollmentData();
    
    if (!options.dryRun) {
      console.log("⚠️  This will modify enrollment data. Press Ctrl+C to cancel within 5 seconds...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    let migrationResults = null;
    let sectionUpdateResults = null;
    
    // Handle specific migrations
    if (options.userId) {
      migrationResults = await migrateSpecificUser(options.userId);
    } else if (options.moduleId) {
      migrationResults = await migrateSpecificModule(options.moduleId);
    } else {
      // Full bulk migration
      console.log("Starting full migration process...");
      
      // Step 1: Update section counts
      sectionUpdateResults = await updateSectionCounts();
      
      // Step 2: Migrate progress data
      migrationResults = await migrateBulkEnrollments();
    }
    
    // Generate final report
    await generateReport(migrationResults, sectionUpdateResults);
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Migration interrupted by user');
  await disconnectFromDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Migration terminated');
  await disconnectFromDatabase();
  process.exit(0);
});

// Run migration
if (require.main === module) {
  main().catch(error => {
    console.error("❌ Unhandled error:", error);
    process.exit(1);
  });
}

module.exports = {
  migrateSpecificUser,
  migrateSpecificModule,
  migrateBulkEnrollments,
  updateSectionCounts
};