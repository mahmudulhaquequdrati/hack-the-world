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
  resetCollection,
};
