import mongoose from "mongoose";

export interface IModule extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  phaseId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  icon: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  color: string;
  order: number;
  topics: string[];
  isActive: boolean;
  prerequisites: mongoose.Types.ObjectId[];
  learningOutcomes: string[];
  content: {
    videos: string[];
    labs: string[];
    games: string[];
    documents: string[];
    estimatedHours: number;
  };
  createdAt: Date;
  updatedAt: Date;
  toPublicJSON(): Record<string, unknown>;
  toJSON(): Record<string, unknown>;
  toObject(): Record<string, unknown>;
}

export interface IModuleModel extends mongoose.Model<IModule> {
  getByPhase(phaseId: string): Promise<IModule[]>;
  getAllWithPhases(): Promise<IModule[]>;
}

const moduleSchema = new mongoose.Schema(
  {
    phaseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Phase ID is required"],
      ref: "Phase",
    },
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
      maxlength: [100, "Module title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Module description is required"],
      trim: true,
      maxlength: [500, "Module description cannot exceed 500 characters"],
    },
    icon: {
      type: String,
      required: [true, "Module icon is required"],
      trim: true,
      maxlength: [50, "Icon name cannot exceed 50 characters"],
    },
    duration: {
      type: String,
      required: false,
      trim: true,
      default: "0 hours",
    },
    difficulty: {
      type: String,
      required: [true, "Module difficulty is required"],
      enum: {
        values: ["Beginner", "Intermediate", "Advanced", "Expert"],
        message:
          "Difficulty must be one of: Beginner, Intermediate, Advanced, Expert",
      },
    },
    color: {
      type: String,
      required: [true, "Module color is required"],
      trim: true,
      maxlength: [50, "Color class cannot exceed 50 characters"],
    },
    order: {
      type: Number,
      required: [true, "Module order is required"],
      min: [1, "Order must be at least 1"],
    },
    topics: {
      type: [String],
      default: [],
      validate: {
        validator: function (topics: string[]) {
          return topics.every(
            (topic) =>
              typeof topic === "string" &&
              topic.trim().length > 0 &&
              topic.length <= 100
          );
        },
        message:
          "Each topic must be a non-empty string with max 100 characters",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    prerequisites: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Module",
    },
    learningOutcomes: {
      type: [String],
      default: [],
    },
    content: {
      videos: {
        type: [String],
        default: [],
      },
      labs: {
        type: [String],
        default: [],
      },
      games: {
        type: [String],
        default: [],
      },
      documents: {
        type: [String],
        default: [],
      },
      estimatedHours: {
        type: Number,
        default: 0,
        min: [0, "Estimated hours cannot be negative"],
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
moduleSchema.index({ phaseId: 1, order: 1 }, { unique: true });

// Virtual to populate phase information
moduleSchema.virtual("phase", {
  ref: "Phase",
  localField: "phaseId",
  foreignField: "_id",
  justOne: true,
});

// Static methods
moduleSchema.statics.getByPhase = function (phaseId: string) {
  return this.find({ phaseId, isActive: true }).sort({ order: 1 });
};

moduleSchema.statics.getAllWithPhases = function () {
  return this.find({ isActive: true })
    .populate("phase")
    .sort({ "phase.order": 1, order: 1 });
};

const Module =
  (mongoose.models.Module as IModuleModel) ||
  mongoose.model<IModule, IModuleModel>("Module", moduleSchema);

export default Module;
