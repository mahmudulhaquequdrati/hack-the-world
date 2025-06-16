import mongoose, { Model } from "mongoose";

export interface IContent extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  type: "video" | "lab" | "game" | "document";
  title: string;
  description: string;
  url?: string;
  instructions?: string;
  section?: string;
  order: number;
  duration: number;
  isActive: boolean;
  metadata?: {
    difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    tags: string[];
    prerequisites: string[];
    estimatedTime?: string;
    tools: string[];
    objectives: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  getNavigation(): Promise<{
    previous: IContent | null;
    next: IContent | null;
  }>;
  toPublicJSON(): Record<string, unknown>;
  toJSON(): Record<string, unknown>;
  toObject(): Record<string, unknown>;
}

export interface IContentModel extends mongoose.Model<IContent> {
  getByModule(moduleId: string): Promise<IContent[]>;
  getByModuleGrouped(
    moduleId: string
  ): Promise<{ _id: string; items: IContent[]; count: number }[]>;
  getByModuleGroupedOptimized(
    moduleId: string
  ): Promise<{ _id: string; content: IContent[] }[]>;
  getByType(type: string): Promise<IContent[]>;
  getFirstByModule(moduleId: string): Promise<IContent | null>;
  getSectionsByModule(moduleId: string): Promise<string[]>;
}

const contentSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Module ID is required"],
      ref: "Module",
    },
    type: {
      type: String,
      required: [true, "Content type is required"],
      enum: {
        values: ["video", "lab", "game", "document"],
        message: "Content type must be one of: video, lab, game, document",
      },
    },
    title: {
      type: String,
      required: [true, "Content title is required"],
      trim: true,
      maxlength: [200, "Content title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Content description is required"],
      trim: true,
      maxlength: [1000, "Content description cannot exceed 1000 characters"],
    },
    url: {
      type: String,
      trim: true,
      validate: {
        validator: function (url: string) {
          if (!url) return true; // Allow empty URLs
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        },
        message: "Invalid URL format",
      },
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [2000, "Instructions cannot exceed 2000 characters"],
    },
    section: {
      type: String,
      trim: true,
      maxlength: [100, "Section name cannot exceed 100 characters"],
    },
    order: {
      type: Number,
      required: [true, "Content order is required"],
      min: [1, "Order must be at least 1"],
    },
    duration: {
      type: Number,
      default: 0,
      min: [0, "Duration cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      difficulty: {
        type: String,
        enum: {
          values: ["Beginner", "Intermediate", "Advanced", "Expert"],
          message:
            "Difficulty must be one of: Beginner, Intermediate, Advanced, Expert",
        },
      },
      tags: {
        type: [String],
        default: [],
        validate: {
          validator: function (tags: string[]) {
            return tags.every(
              (tag) =>
                typeof tag === "string" &&
                tag.trim().length > 0 &&
                tag.length <= 50
            );
          },
          message: "Each tag must be a non-empty string with max 50 characters",
        },
      },
      prerequisites: {
        type: [String],
        default: [],
      },
      estimatedTime: {
        type: String,
        trim: true,
      },
      tools: {
        type: [String],
        default: [],
      },
      objectives: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
contentSchema.index({ moduleId: 1, order: 1 }, { unique: true });
contentSchema.index({ moduleId: 1, type: 1 });
contentSchema.index({ isActive: 1 });
contentSchema.index({ type: 1 });

// Virtual to populate module information
contentSchema.virtual("module", {
  ref: "Module",
  localField: "moduleId",
  foreignField: "_id",
  justOne: true,
});

// Static methods
contentSchema.statics.getByModule = function (moduleId: string) {
  return this.find({ moduleId, isActive: true }).sort({ order: 1 });
};

contentSchema.statics.getByModuleGrouped = function (moduleId: string) {
  return this.aggregate([
    {
      $match: {
        moduleId: new mongoose.Types.ObjectId(moduleId),
        isActive: true,
      },
    },
    { $sort: { order: 1 } },
    {
      $group: {
        _id: "$type",
        items: { $push: "$$ROOT" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

contentSchema.statics.getByModuleGroupedOptimized = function (
  moduleId: string
) {
  return this.aggregate([
    {
      $match: {
        moduleId: new mongoose.Types.ObjectId(moduleId),
        isActive: true,
      },
    },
    { $sort: { order: 1 } },
    {
      $group: {
        _id: "$section",
        content: {
          $push: {
            id: "$_id",
            type: "$type",
            title: "$title",
            description: "$description",
            url: "$url",
            order: "$order",
            duration: "$duration",
            metadata: "$metadata",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

contentSchema.statics.getByType = function (type: string) {
  return this.find({ type, isActive: true }).sort({ createdAt: -1 });
};

contentSchema.statics.getFirstByModule = function (moduleId: string) {
  return this.findOne({ moduleId, isActive: true }).sort({ order: 1 });
};

contentSchema.statics.getSectionsByModule = function (moduleId: string) {
  return this.distinct("section", { moduleId, isActive: true });
};

// Instance methods
contentSchema.methods.getNavigation = async function () {
  const Content = this.constructor as Model<IContent>;

  // Get previous content (same module, lower order)
  const previous = await Content.findOne({
    moduleId: this.moduleId,
    order: { $lt: this.order },
    isActive: true,
  }).sort({ order: -1 });

  // Get next content (same module, higher order)
  const next = await Content.findOne({
    moduleId: this.moduleId,
    order: { $gt: this.order },
    isActive: true,
  }).sort({ order: 1 });

  return { previous, next };
};

const Content =
  (mongoose.models.Content as IContentModel) ||
  mongoose.model<IContent, IContentModel>("Content", contentSchema);

export default Content;
