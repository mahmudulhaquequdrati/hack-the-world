import mongoose from 'mongoose';

export interface IPhase extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  prerequisites: mongoose.Types.ObjectId[];
  estimatedDuration: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const phaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Phase title is required"],
      trim: true,
      maxlength: [100, "Phase title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Phase description is required"],
      trim: true,
      maxlength: [500, "Phase description cannot exceed 500 characters"],
    },
    icon: {
      type: String,
      required: [true, "Phase icon is required"],
      trim: true,
      maxlength: [50, "Icon name cannot exceed 50 characters"],
    },
    color: {
      type: String,
      required: [true, "Phase color is required"],
      trim: true,
      maxlength: [50, "Color class cannot exceed 50 characters"],
    },
    order: {
      type: Number,
      required: [true, "Phase order is required"],
      min: [1, "Order must be at least 1"],
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    prerequisites: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Phase",
    },
    estimatedDuration: {
      type: String,
      required: false,
      trim: true,
      default: "4-6 weeks",
    },
    difficultyLevel: {
      type: String,
      required: [true, "Phase difficulty level is required"],
      enum: {
        values: ["Beginner", "Intermediate", "Advanced", "Expert"],
        message: "Difficulty level must be one of: Beginner, Intermediate, Advanced, Expert",
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
phaseSchema.index({ order: 1 }, { unique: true });
phaseSchema.index({ isActive: 1 });

// Virtual to get modules for this phase
phaseSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'phaseId',
});

// Static methods
phaseSchema.statics.getActive = function () {
  return this.find({ isActive: true }).sort({ order: 1 });
};

phaseSchema.statics.getWithModules = function () {
  return this.find({ isActive: true })
    .populate({
      path: 'modules',
      match: { isActive: true },
      options: { sort: { order: 1 } }
    })
    .sort({ order: 1 });
};

const Phase = mongoose.models.Phase || mongoose.model<IPhase>("Phase", phaseSchema);

export default Phase;