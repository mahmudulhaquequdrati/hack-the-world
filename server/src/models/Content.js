const mongoose = require("mongoose");

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

    // Content status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
ContentSchema.index({ moduleId: 1, section: 1 });
ContentSchema.index({ type: 1 });
ContentSchema.index({ moduleId: 1, isActive: 1 });

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
    .sort({ section: 1, createdAt: 1 });
};

// Static method to get content by module and type
ContentSchema.statics.getByModuleForOverview = async function (moduleId) {
  // Get content for each section
  const content = await this.find({ moduleId, isActive: true })
    .select("title description type section")
    .sort({ section: 1, createdAt: 1 })
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
      contentByType[pluralType].push(content.id.toString());
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

// Post-save middleware to update module statistics
ContentSchema.post("save", async function (doc) {
  if (doc.moduleId) {
    await this.updateModuleStats(doc.moduleId);
  }
});

// Post-insertMany middleware to update module statistics
ContentSchema.post("insertMany", async function (docs) {
  if (docs && docs.length > 0) {
    // Get unique module IDs from inserted documents
    const moduleIds = [...new Set(docs.map((doc) => doc.moduleId))];

    // Update each affected module
    for (const moduleId of moduleIds) {
      if (moduleId) {
        await this.updateModuleStats(moduleId);
      }
    }
  }
});

// Post-remove middleware to update module statistics
ContentSchema.post("remove", async function (doc) {
  if (doc.moduleId) {
    await this.updateModuleStats(doc.moduleId);
  }
});

// Post-findOneAndDelete middleware to update module statistics
ContentSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.moduleId) {
    await this.updateModuleStats(doc.moduleId);
  }
});

// Post-deleteMany middleware to update module statistics for multiple deletions
ContentSchema.post("deleteMany", async function (result) {
  // For bulk operations, we need to update all affected modules
  // This is less efficient but ensures consistency
  const Module = mongoose.model("Module");
  const modules = await Module.find({});

  for (const module of modules) {
    await this.updateModuleStats(module.id);
  }
});

module.exports = mongoose.model("Content", ContentSchema);
