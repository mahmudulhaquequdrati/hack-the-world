const mongoose = require("mongoose");
const Content = require("../models/Content");
const Module = require("../models/Module");
const { CONTENT_DATA } = require("../data/contentData");

/**
 * Seed content data with ObjectId conversion
 * Converts moduleId strings to actual MongoDB ObjectIds
 */
const seedContent = async (resetCollection = false) => {
  try {
    console.log("🌱 Starting content seeding...");

    // Reset collection if requested
    if (resetCollection) {
      console.log("🗑️  Clearing existing content data...");
      await Content.deleteMany({});
      console.log("✅ Content collection cleared");
    }

    // Check if content already exists
    const existingCount = await Content.countDocuments();
    if (existingCount > 0 && !resetCollection) {
      console.log(
        `📋 Content already seeded (${existingCount} items). Use resetCollection=true to re-seed.`
      );
      return;
    }

    // Get all modules to create moduleId mapping
    console.log("📚 Loading module references...");
    const modules = await Module.find({});

    if (modules.length === 0) {
      throw new Error(
        "❌ No modules found. Please seed modules first before seeding content."
      );
    }

    // Create mapping from module title to ObjectId
    const moduleMapping = {};
    modules.forEach((module) => {
      // Create multiple possible keys for mapping
      const titleKey = module.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      moduleMapping[titleKey] = module._id;

      // Also map common variations
      if (module.title.includes("Fundamentals")) {
        const baseKey = module.title
          .replace("Fundamentals", "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");
        if (baseKey === "cybersecurity")
          moduleMapping["foundations"] = module._id;
      }
      if (module.title.includes("Basics")) {
        const baseKey = module.title
          .replace("Basics", "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");
        moduleMapping[baseKey] = module._id;
      }
      if (module.title.includes("Linux")) {
        moduleMapping["linux-basics"] = module._id;
      }
      if (module.title.includes("Network")) {
        if (module.title.includes("Advanced")) {
          moduleMapping["advanced-networking"] = module._id;
        } else {
          moduleMapping["networking-basics"] = module._id;
        }
      }
      if (module.title.includes("Penetration Testing")) {
        if (module.title.includes("Advanced")) {
          moduleMapping["advanced-pentest"] = module._id;
        } else {
          moduleMapping["penetration-testing"] = module._id;
        }
      }
      if (module.title.includes("Incident Response")) {
        moduleMapping["incident-response"] = module._id;
      }
      if (module.title.includes("Web Security")) {
        moduleMapping["web-security-intro"] = module._id;
      }
      if (module.title.includes("Digital Forensics")) {
        moduleMapping["digital-forensics-basics"] = module._id;
      }
      if (module.title.includes("Security Awareness")) {
        moduleMapping["security-awareness"] = module._id;
      }
    });

    console.log(
      `📋 Module mapping created for ${Object.keys(moduleMapping).length} modules`
    );

    // Process content data
    console.log("🔄 Processing content data...");
    const contentToInsert = [];
    const skippedContent = [];

    for (const contentData of CONTENT_DATA) {
      const moduleObjectId = moduleMapping[contentData.moduleId];

      if (!moduleObjectId) {
        console.warn(
          `⚠️  Module '${contentData.moduleId}' not found for content '${contentData.title}'`
        );
        skippedContent.push(contentData);
        continue;
      }

      // Convert moduleId to ObjectId
      const processedContent = {
        ...contentData,
        moduleId: moduleObjectId,
      };

      contentToInsert.push(processedContent);
    }

    // Insert content
    if (contentToInsert.length > 0) {
      console.log(`📥 Inserting ${contentToInsert.length} content items...`);
      await Content.insertMany(contentToInsert);
      console.log(
        `✅ Successfully seeded ${contentToInsert.length} content items`
      );
    }

    // Report skipped content
    if (skippedContent.length > 0) {
      console.warn(
        `⚠️  Skipped ${skippedContent.length} content items due to missing modules:`
      );
      skippedContent.forEach((content) => {
        console.warn(`   - ${content.title} (module: ${content.moduleId})`);
      });
    }

    // Generate statistics
    const stats = await generateContentStats();
    console.log("\n📊 Content Seeding Statistics:");
    console.log(`   Total Content: ${stats.total}`);
    console.log(`   Videos: ${stats.videos}`);
    console.log(`   Labs: ${stats.labs}`);
    console.log(`   Games: ${stats.games}`);
    console.log(`   Documents: ${stats.documents}`);
    console.log(`   Sections: ${stats.sections}`);
  } catch (error) {
    console.error("❌ Content seeding failed:", error.message);
    throw error;
  }
};

/**
 * Generate content statistics
 */
const generateContentStats = async () => {
  try {
    const stats = await Content.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const sections = await Content.distinct("section");

    const result = {
      total: 0,
      videos: 0,
      labs: 0,
      games: 0,
      documents: 0,
      sections: sections.length,
    };

    stats.forEach((stat) => {
      result[stat._id + "s"] = stat.count;
      result.total += stat.count;
    });

    return result;
  } catch (error) {
    console.error("Error generating content stats:", error);
    return {
      total: 0,
      videos: 0,
      labs: 0,
      games: 0,
      documents: 0,
      sections: 0,
    };
  }
};

/**
 * Get content by module for verification
 */
const getContentByModule = async (moduleId) => {
  try {
    const content = await Content.getByModule(moduleId);
    return content;
  } catch (error) {
    console.error("Error fetching content by module:", error);
    return [];
  }
};

/**
 * Get content statistics for a specific module
 */
const getModuleContentStats = async (moduleId) => {
  try {
    const stats = await Content.getModuleStats(moduleId);
    return stats;
  } catch (error) {
    console.error("Error fetching module content stats:", error);
    return null;
  }
};

module.exports = {
  seedContent,
  generateContentStats,
  getContentByModule,
  getModuleContentStats,
};
