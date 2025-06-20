const mongoose = require("mongoose");
const UserProgress = require("./UserProgress");

/**
 * Unified Content Model
 * Handles all types of content (videos, labs, games, documents) within modules
 * Uses MongoDB ObjectIds for module references
 * Automatically syncs with Module model to update duration and content counts
 */
const ContentSchema = new mongoose.Schema(
  {
    // Reference to parent module using ObjectId
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Module ID is required"],
      ref: "Module",
    },

    // Content type
    type: {
      type: String,
      required: [true, "Content type is required"],
      enum: ["video", "lab", "game", "document"],
      lowercase: true,
    },

    // Content title
    title: {
      type: String,
      required: [true, "Content title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    // Content description
    description: {
      type: String,
      required: [true, "Content description is required"],
      trim: true,
      maxlength: [10000, "Description cannot exceed 10000 characters"],
    },

    // For videos - required for video type
    url: {
      type: String,
      required: function () {
        return this.type === "video";
      },
      validate: {
        validator: function (v) {
          if (this.type === "video") {
            return /^https?:\/\/.+/.test(v);
          }
          return true;
        },
        message: "URL must be a valid HTTP/HTTPS URL for videos",
      },
    },

    // For labs and games - required for lab/game types
    instructions: {
      type: String,
      required: function () {
        return this.type === "lab" || this.type === "game";
      },
      maxlength: [10000, "Instructions cannot exceed 10000 characters"],
    },

    // Section grouping for content organization
    section: {
      type: String,
      required: [true, "Content section is required"],
      trim: true,
      maxlength: [100, "Section cannot exceed 100 characters"],
    },

    // Content duration in minutes
    duration: {
      type: Number,
      min: [1, "Duration must be at least 1 minute"],
      max: [300, "Duration cannot exceed 300 minutes"],
    },

    // Flexible metadata for future extensions
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Resources array for additional learning materials
    resources: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          // Each resource must be a valid URL or file path
          return arr.every(
            (resource) => typeof resource === "string" && resource.length > 0
          );
        },
        message: "Each resource must be a non-empty string",
      },
    },

    // Order within section for drag-and-drop functionality
    order: {
      type: Number,
      min: [1, "Order must be at least 1"],
      validate: {
        validator: function (v) {
          // Order can be null/undefined for existing content, but if provided must be positive
          return v == null || (Number.isInteger(v) && v > 0);
        },
        message: "Order must be a positive integer",
      },
    },

    // Content status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    id: false, // Disable virtual id field
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
ContentSchema.index({ moduleId: 1, section: 1, order: 1 });
ContentSchema.index({ type: 1 });
ContentSchema.index({ moduleId: 1, isActive: 1 });
ContentSchema.index({ moduleId: 1, section: 1, isActive: 1, order: 1 });

// Virtual to populate module information
ContentSchema.virtual("module", {
  ref: "Module",
  localField: "moduleId",
  foreignField: "_id",
  justOne: true,
});

// Static method to get content by module
ContentSchema.statics.getByModule = function (moduleId) {
  return this.find({ moduleId, isActive: true })
    .populate("module", "title")
    .sort({ section: 1, order: 1, createdAt: 1 });
};

// Static method to get content by module and type
ContentSchema.statics.getByModuleForOverview = async function (moduleId) {
  // Get content for each section
  const content = await this.find({ moduleId, isActive: true })
    .select("title description type section")
    .sort({ section: 1, order: 1, createdAt: 1 })
    .lean();

  // Group content by section
  const groupedContent = {};
  content.forEach((item) => {
    if (!groupedContent[item.section]) {
      groupedContent[item.section] = [];
    }
    groupedContent[item.section].push(item);
  });

  return groupedContent;
};

// Static method to get content by type
ContentSchema.statics.getByType = function (type, moduleId = null) {
  const query = { type, isActive: true };
  if (moduleId) query.moduleId = moduleId;
  return this.find(query)
    .populate("module", "title")
    .sort({ section: 1, createdAt: 1 });
};

// Static method to get content grouped by sections
ContentSchema.statics.getByModuleGrouped = async function (moduleId) {
  const content = await this.find({ moduleId, isActive: true })
    .populate("module", "title")
    .sort({
      section: 1,
      order: 1,
      createdAt: 1,
    });

  // Group content by sections
  const sections = {};
  content.forEach((item) => {
    if (!sections[item.section]) {
      sections[item.section] = [];
    }
    sections[item.section].push(item);
  });

  return sections;
};

// Static method to get first content by module (T004)
ContentSchema.statics.getFirstContentByModule = async function (moduleId) {
  const firstContent = await this.findOne({ moduleId, isActive: true })
    .populate("module", "title")
    .sort({ section: 1, order: 1, createdAt: 1 });

  return firstContent;
};

// Static method to get content by module grouped by sections with optimized fields (T005)
ContentSchema.statics.getByModuleGroupedOptimized = async function (
  moduleId,
  userId
) {
  const content = await this.find({ moduleId, isActive: true })
    .select("_id title type section duration")
    .sort({
      section: 1,
      order: 1,
      createdAt: 1,
    })
    .lean()
    .then((content) => {
      return content.map((item) => {
        return {
          _id: item._id.toString(),
          title: item.title,
          type: item.type,
          section: item.section,
          duration: item.duration,
        };
      });
    });

  const completedLessons = await UserProgress.find({
    userId: userId,
    contentId: { $in: content.map((item) => item._id) },
    status: "completed",
  }).then((lessons) => {
    return lessons.map((lesson) => {
      return {
        contentId: lesson.contentId.toString(),
        status: lesson.status,
      };
    });
  });

  // Group content by sections with optimized structure
  const sections = {};
  content.forEach((item) => {
    if (!sections[item.section]) {
      sections[item.section] = [];
    }
    sections[item.section].push({
      contentId: item._id, // Keep as contentId for API response consistency
      contentTitle: item.title,
      contentType: item.type,
      sectionTitle: item.section,
      duration: item.duration || 15, // Default 15 minutes if not specified
      isCompleted: completedLessons.some(
        (lesson) => lesson.contentId === item._id
      ),
    });
  });

  return sections;
};

// Static method to get content with navigation context (T006)
ContentSchema.statics.getContentWithNavigation = async function (contentId) {
  // First get the current content
  const currentContent = await this.findById(contentId)
    .where({ isActive: true })
    .populate("module", "title")
    .lean();

  if (!currentContent) {
    return null;
  }

  // Get all content for the same module, sorted by navigation order (section, order, createdAt)
  const allModuleContent = await this.find({
    moduleId: currentContent.moduleId,
    isActive: true,
  })
    .select("_id title section createdAt")
    .sort({ section: 1, order: 1, createdAt: 1 })
    .lean();

  // Find current content's position in the ordered list
  const currentIndex = allModuleContent.findIndex(
    (item) => item._id.toString() === contentId.toString()
  );

  if (currentIndex === -1) {
    return null;
  }

  // Get previous and next content IDs
  const previousContent =
    currentIndex > 0 ? allModuleContent[currentIndex - 1] : null;
  const nextContent =
    currentIndex < allModuleContent.length - 1
      ? allModuleContent[currentIndex + 1]
      : null;

  // Return content with navigation context
  // Note: When using .lean(), _id is not transformed to id, so we need to handle it manually
  const transformedContent = {
    ...currentContent,
    _id: currentContent._id.toString(),
  };

  return {
    ...transformedContent,
    navigation: {
      previousContentId: previousContent
        ? previousContent._id.toString()
        : null,
      nextContentId: nextContent ? nextContent._id.toString() : null,
      currentPosition: currentIndex + 1,
      totalCount: allModuleContent.length,
      previousTitle: previousContent ? previousContent.title : null,
      nextTitle: nextContent ? nextContent.title : null,
    },
  };
};

// Static method to get distinct sections by module
ContentSchema.statics.getSectionsByModule = async function (moduleId) {
  const sections = await this.distinct("section", {
    moduleId,
    isActive: true,
  });

  // Return sorted array of unique section titles
  return sections.sort();
};

// Helper function to update module content statistics
ContentSchema.statics.updateModuleStats = async function (moduleId) {
  const Module = mongoose.model("Module");

  // Get all content for this module
  const allContent = await mongoose.model("Content").find({
    moduleId: new mongoose.Types.ObjectId(moduleId),
    isActive: true,
  });

  // Organize content by type
  const contentByType = {
    videos: [],
    labs: [],
    games: [],
    documents: [],
  };

  let totalDuration = 0;

  allContent.forEach((content) => {
    const pluralType = content.type + "s";
    if (contentByType.hasOwnProperty(pluralType)) {
      contentByType[pluralType].push(content._id.toString());
    }
    totalDuration += content.duration || 0;
  });

  // Update module with new content arrays and duration
  await Module.findByIdAndUpdate(moduleId, {
    $set: {
      "content.videos": contentByType.videos,
      "content.labs": contentByType.labs,
      "content.games": contentByType.games,
      "content.documents": contentByType.documents,
      "content.estimatedHours": (totalDuration / 60).toFixed(2), // Convert minutes to hours
    },
  });
};

// Post-save middleware to update module statistics and sync enrollment progress
// Pre-save middleware to track isActive changes
ContentSchema.pre("save", function (next) {
  // Track if isActive status changed
  if (this.isModified('isActive')) {
    this._isActiveChanged = true;
    this._previousIsActive = this._original?.isActive || false;
  }
  next();
});

ContentSchema.post("save", async function (doc) {
  if (doc.moduleId) {
    await this.constructor.updateModuleStats(doc.moduleId);
    
    // Trigger enrollment section count update for new/updated content
    // Especially important when isActive status changes
    if (doc.isNew || doc._isActiveChanged) {
      try {
        const UserEnrollment = require("./UserEnrollment");
        await UserEnrollment.updateModuleSectionCounts(doc.moduleId);
        
        // If isActive changed, also trigger progress recalculation for all enrollments
        if (doc._isActiveChanged) {
          const ProgressSyncService = require("../utils/progressSyncService");
          ProgressSyncService.syncModuleEnrollments(doc.moduleId)
            .catch(error => {
              console.error(`Failed to sync enrollments after isActive change for module ${doc.moduleId}:`, error);
            });
        }
      } catch (error) {
        console.error('Error updating enrollment section counts:', error);
      }
    }
  }
});

// Post-insertMany middleware to update module statistics
ContentSchema.post("insertMany", async function (docs) {
  if (docs && docs.length > 0) {
    // Get unique module IDs from inserted documents
    const moduleIds = [...new Set(docs.map((doc) => doc.moduleId))];
    const Content = mongoose.model("Content");

    // Update each affected module with proper error handling
    for (const moduleId of moduleIds) {
      if (moduleId) {
        try {
          await Content.updateModuleStats(moduleId);
          
          // Update enrollment section counts for bulk inserts
          const UserEnrollment = require("./UserEnrollment");
          await UserEnrollment.updateModuleSectionCounts(moduleId);
          
          // Trigger progress recalculation for affected enrollments
          const ProgressSyncService = require("../utils/progressSyncService");
          ProgressSyncService.syncModuleEnrollments(moduleId)
            .catch(error => {
              console.error(`Failed to sync enrollments for bulk insert in module ${moduleId}:`, error);
            });
        } catch (error) {
          console.error(`Error updating module ${moduleId} after bulk insert:`, error);
        }
      }
    }
  }
});

// Post-remove middleware to update module statistics and sync enrollment progress
ContentSchema.post("remove", async function (doc) {
  if (doc.moduleId) {
    try {
      await this.constructor.updateModuleStats(doc.moduleId);
      
      // Update enrollment section counts for removed content
      const UserEnrollment = require("./UserEnrollment");
      await UserEnrollment.updateModuleSectionCounts(doc.moduleId);
      
      // Trigger progress recalculation for all enrollments since content was removed
      const ProgressSyncService = require("../utils/progressSyncService");
      ProgressSyncService.syncModuleEnrollments(doc.moduleId)
        .catch(error => {
          console.error(`Failed to sync enrollments after content removal for module ${doc.moduleId}:`, error);
        });
    } catch (error) {
      console.error(`Error updating module ${doc.moduleId} after content removal:`, error);
    }
  }
});

// Post-findOneAndDelete middleware to update module statistics and sync enrollment progress
ContentSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.moduleId) {
    try {
      const Content = mongoose.model("Content");
      await Content.updateModuleStats(doc.moduleId);
      
      // Update enrollment section counts for deleted content
      const UserEnrollment = require("./UserEnrollment");
      await UserEnrollment.updateModuleSectionCounts(doc.moduleId);
      
      // Trigger progress recalculation for all enrollments since content was deleted
      const ProgressSyncService = require("../utils/progressSyncService");
      ProgressSyncService.syncModuleEnrollments(doc.moduleId)
        .catch(error => {
          console.error(`Failed to sync enrollments after content deletion for module ${doc.moduleId}:`, error);
        });
    } catch (error) {
      console.error(`Error updating module ${doc.moduleId} after content deletion:`, error);
    }
  }
});

// Post-deleteMany middleware to update module statistics for multiple deletions
ContentSchema.post("deleteMany", async function (result) {
  try {
    // For bulk operations, we need to update all affected modules
    // Since we can't track specific deleted documents, update all modules
    const Module = mongoose.model("Module");
    const Content = mongoose.model("Content");
    const UserEnrollment = require("./UserEnrollment");
    const ProgressSyncService = require("../utils/progressSyncService");
    
    const modules = await Module.find({}).select('_id');

    console.log(`Updating ${modules.length} modules after bulk content deletion`);
    
    for (const module of modules) {
      try {
        await Content.updateModuleStats(module._id);
        await UserEnrollment.updateModuleSectionCounts(module._id);
        
        // Trigger progress recalculation for all enrollments
        ProgressSyncService.syncModuleEnrollments(module._id)
          .catch(error => {
            console.error(`Failed to sync enrollments after bulk deletion for module ${module._id}:`, error);
          });
      } catch (error) {
        console.error(`Error updating module ${module._id} after bulk deletion:`, error);
      }
    }
  } catch (error) {
    console.error('Error in deleteMany middleware:', error);
  }
});

module.exports = mongoose.model("Content", ContentSchema);
