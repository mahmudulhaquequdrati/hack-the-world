const mongoose = require("mongoose");

/**
 * Database Utility Functions
 * Common database operations for seeding and maintenance
 */

/**
 * Clear all data from a specific collection
 * @param {mongoose.Model} Model - Mongoose model to clear
 * @param {string} collectionName - Name for logging
 * @returns {Promise<number>} Number of deleted documents
 */
async function clearCollection(Model, collectionName = "documents") {
  try {
    const result = await Model.deleteMany({});
    console.log(`🗑️  Cleared ${result.deletedCount} ${collectionName}`);
    return result.deletedCount;
  } catch (error) {
    console.error(`❌ Error clearing ${collectionName}:`, error.message);
    throw error;
  }
}

/**
 * Get count of documents in a collection
 * @param {mongoose.Model} Model - Mongoose model to count
 * @param {string} collectionName - Name for logging
 * @returns {Promise<number>} Number of documents
 */
async function getCollectionCount(Model, collectionName = "documents") {
  try {
    const count = await Model.countDocuments();
    console.log(`📊 ${collectionName}: ${count} documents`);
    return count;
  } catch (error) {
    console.error(`❌ Error counting ${collectionName}:`, error.message);
    throw error;
  }
}

/**
 * Check if collection exists and has data
 * @param {mongoose.Model} Model - Mongoose model to check
 * @param {string} collectionName - Name for logging
 * @returns {Promise<boolean>} True if collection has data
 */
async function hasData(Model, collectionName = "collection") {
  try {
    const count = await Model.countDocuments();
    const hasDocuments = count > 0;

    if (hasDocuments) {
      console.log(`✅ ${collectionName} has ${count} documents`);
    } else {
      console.log(`📭 ${collectionName} is empty`);
    }

    return hasDocuments;
  } catch (error) {
    console.error(`❌ Error checking ${collectionName}:`, error.message);
    return false;
  }
}

/**
 * Validate database connection
 * @returns {Promise<boolean>} True if connected
 */
async function validateConnection() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Database connection is active");
      return true;
    } else {
      console.log("❌ Database connection is not active");
      return false;
    }
  } catch (error) {
    console.error("❌ Error validating connection:", error.message);
    return false;
  }
}

/**
 * Get database status summary
 * @returns {Promise<Object>} Database status information
 */
async function getDatabaseStatus() {
  try {
    // Import models dynamically to avoid circular dependencies
    const Phase = require("../models/Phase");
    const Module = require("../models/Module");

    const status = {
      connected: mongoose.connection.readyState === 1,
      database: mongoose.connection.name,
      collections: {
        phases: await Phase.countDocuments(),
        modules: await Module.countDocuments(),
      },
      timestamp: new Date().toISOString(),
    };

    console.log("📊 DATABASE STATUS:");
    console.log(`   Connected: ${status.connected ? "✅" : "❌"}`);
    console.log(`   Database: ${status.database}`);
    console.log(`   Phases: ${status.collections.phases}`);
    console.log(`   Modules: ${status.collections.modules}`);
    console.log(`   Last checked: ${status.timestamp}`);

    return status;
  } catch (error) {
    console.error("❌ Error getting database status:", error.message);
    throw error;
  }
}

/**
 * Backup collection to JSON (for development)
 * @param {mongoose.Model} Model - Mongoose model to backup
 * @param {string} filename - Output filename (without extension)
 * @returns {Promise<string>} Path to backup file
 */
async function backupCollection(Model, filename) {
  try {
    const fs = require("fs").promises;
    const path = require("path");

    const documents = await Model.find({}).lean();
    const backupPath = path.join(__dirname, "../../../backups");

    // Create backups directory if it doesn't exist
    try {
      await fs.mkdir(backupPath, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    const filePath = path.join(backupPath, `${filename}-${Date.now()}.json`);
    await fs.writeFile(filePath, JSON.stringify(documents, null, 2));

    console.log(`💾 Backed up ${documents.length} documents to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error(`❌ Error backing up collection:`, error.message);
    throw error;
  }
}

/**
 * Safe insert with duplicate checking
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Array} documents - Documents to insert
 * @param {string} uniqueField - Field to check for duplicates (default: '_id')
 * @returns {Promise<Array>} Inserted documents
 */
async function safeInsert(Model, documents, uniqueField = "_id") {
  try {
    const results = [];

    for (const doc of documents) {
      // Check if document already exists
      const existing = await Model.findOne({ [uniqueField]: doc[uniqueField] });

      if (existing) {
        console.log(
          `⚠️  Skipping duplicate ${uniqueField}: ${doc[uniqueField]}`
        );
        results.push(existing);
      } else {
        const newDoc = await Model.create(doc);
        console.log(`✅ Created ${uniqueField}: ${doc[uniqueField]}`);
        results.push(newDoc);
      }
    }

    return results;
  } catch (error) {
    console.error("❌ Error during safe insert:", error.message);
    throw error;
  }
}

/**
 * Reset collection with fresh data
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Array} documents - New documents to insert
 * @param {string} collectionName - Name for logging
 * @returns {Promise<Array>} Inserted documents
 */
async function resetCollection(
  Model,
  documents,
  collectionName = "collection"
) {
  try {
    console.log(`🔄 Resetting ${collectionName}...`);

    // Clear existing data
    await clearCollection(Model, collectionName);

    // Insert new data
    const result = await Model.insertMany(documents);
    console.log(`✅ Inserted ${result.length} new ${collectionName}`);

    return result;
  } catch (error) {
    console.error(`❌ Error resetting ${collectionName}:`, error.message);
    throw error;
  }
}

module.exports = {
  clearCollection,
  getCollectionCount,
  hasData,
  validateConnection,
  getDatabaseStatus,
  backupCollection,
  safeInsert,
  resetCollection,
};
