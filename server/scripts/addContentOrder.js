#!/usr/bin/env node

/**
 * Migration script to add order field to existing content
 * This script assigns sequential order numbers to content within each module and section
 * based on their creation date (createdAt field)
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the Content model
const Content = require('../src/models/Content');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hack-the-world';

async function addOrderToContent() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all content without order field or with null order
    const contentWithoutOrder = await Content.find({
      $or: [
        { order: { $exists: false } },
        { order: null },
        { order: { $eq: null } }
      ],
      isActive: true
    }).sort({ moduleId: 1, section: 1, createdAt: 1 });

    console.log(`📊 Found ${contentWithoutOrder.length} content items without order`);

    if (contentWithoutOrder.length === 0) {
      console.log('✅ No content items need order assignment');
      return;
    }

    // Group content by module and section
    const contentByModuleSection = {};
    contentWithoutOrder.forEach(content => {
      const key = `${content.moduleId}-${content.section}`;
      if (!contentByModuleSection[key]) {
        contentByModuleSection[key] = [];
      }
      contentByModuleSection[key].push(content);
    });

    console.log(`📁 Processing ${Object.keys(contentByModuleSection).length} module-section combinations`);

    let totalUpdated = 0;

    // Process each module-section group
    for (const [key, contentItems] of Object.entries(contentByModuleSection)) {
      const [moduleId, section] = key.split('-');
      
      console.log(`\n📂 Processing module ${moduleId}, section "${section}" (${contentItems.length} items)`);

      // Check if there's already content with order in this section
      const existingOrderedContent = await Content.find({
        moduleId,
        section,
        order: { $exists: true, $ne: null },
        isActive: true
      }).sort({ order: 1 });

      // Start from the next available order number
      let nextOrder = existingOrderedContent.length > 0 
        ? Math.max(...existingOrderedContent.map(c => c.order)) + 1 
        : 1;

      console.log(`   Starting order assignment from #${nextOrder}`);

      // Update each content item with sequential order
      for (const content of contentItems) {
        await Content.findByIdAndUpdate(content._id, { order: nextOrder });
        console.log(`   ✅ Updated "${content.title}" → order #${nextOrder}`);
        nextOrder++;
        totalUpdated++;
      }
    }

    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`📊 Total content items updated: ${totalUpdated}`);

    // Verify the migration
    const remainingWithoutOrder = await Content.countDocuments({
      $or: [
        { order: { $exists: false } },
        { order: null }
      ],
      isActive: true
    });

    console.log(`📊 Remaining content without order: ${remainingWithoutOrder}`);

    if (remainingWithoutOrder === 0) {
      console.log('✅ All active content now has order field assigned!');
    } else {
      console.log('⚠️  Some content still missing order field');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addOrderToContent()
    .then(() => {
      console.log('🏁 Migration script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = addOrderToContent;