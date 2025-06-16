import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// TypeScript interfaces
export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
  };
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  role: 'student' | 'admin';
  adminStatus: 'pending' | 'active' | 'suspended';
  stats: {
    totalPoints: number;
    level: number;
    coursesCompleted: number;
    labsCompleted: number;
    gamesCompleted: number;
    achievementsEarned: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate?: Date;
  };
  security: {
    passwordChangedAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    lastLogin?: Date;
    loginAttempts: number;
    lockUntil?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateLastActive(): Promise<IUser>;
  toPublicJSON(): Record<string, unknown>;
  createPasswordResetToken(): string;
  incrementLoginAttempts(): Promise<IUser>;
  resetLoginAttempts(): Promise<IUser>;
  updateStreak(): Promise<IUser>;
  getStreakStatus(): { status: string; isAtRisk: boolean; daysUntilRisk: number };
}

/**
 * User Schema - Migrated from Express.js backend
 * Contains all fields used in the cybersecurity learning platform
 */
const userSchema = new mongoose.Schema(
  {
    // Core authentication fields
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-z0-9_-]+$/,
        "Username can only contain lowercase letters, numbers, underscores, and hyphens",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't include password in queries by default
    },

    // Profile information
    profile: {
      firstName: {
        type: String,
        trim: true,
        maxlength: [50, "First name cannot exceed 50 characters"],
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: [50, "Last name cannot exceed 50 characters"],
      },
      displayName: {
        type: String,
        trim: true,
        maxlength: [100, "Display name cannot exceed 100 characters"],
      },
      avatar: {
        type: String,
        default: "",
      },
      bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"],
      },
      location: {
        type: String,
        trim: true,
        maxlength: [100, "Location cannot exceed 100 characters"],
      },
      website: {
        type: String,
        trim: true,
        validate: {
          validator: function (v: string) {
            return !v || /^https?:\/\/.+/.test(v);
          },
          message: "Website must be a valid URL starting with http:// or https://",
        },
      },
    },

    // Experience level
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },

    // User role
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // Admin status
    adminStatus: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: function (this: IUser) {
        return this.role === "admin" ? "pending" : "active";
      },
    },

    // Learning statistics
    stats: {
      totalPoints: {
        type: Number,
        default: 0,
      },
      level: {
        type: Number,
        default: 1,
        min: 1,
        max: 100,
      },
      coursesCompleted: {
        type: Number,
        default: 0,
      },
      labsCompleted: {
        type: Number,
        default: 0,
      },
      gamesCompleted: {
        type: Number,
        default: 0,
      },
      achievementsEarned: {
        type: Number,
        default: 0,
      },
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastActivityDate: {
        type: Date,
      },
    },

    // Security fields
    security: {
      passwordChangedAt: {
        type: Date,
        default: Date.now,
      },
      passwordResetToken: {
        type: String,
        select: false,
      },
      passwordResetExpires: {
        type: Date,
        select: false,
      },
      lastLogin: {
        type: Date,
      },
      loginAttempts: {
        type: Number,
        default: 0,
      },
      lockUntil: {
        type: Date,
        select: false,
      },
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
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Indexes for performance
userSchema.index({ experienceLevel: 1 });
userSchema.index({ role: 1 });
userSchema.index({ adminStatus: 1 });
userSchema.index({ role: 1, adminStatus: 1 });
userSchema.index({ "stats.totalPoints": -1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual("fullName").get(function (this: IUser) {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.profile.displayName || this.username;
});

// Pre-save middleware for password hashing
userSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    if (!this.isModified("security.passwordChangedAt")) {
      this.security.passwordChangedAt = new Date();
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware for display name
userSchema.pre("save", function (this: IUser, next) {
  if (!this.profile.displayName) {
    if (this.profile.firstName && this.profile.lastName) {
      this.profile.displayName = `${this.profile.firstName} ${this.profile.lastName}`;
    } else {
      this.profile.displayName = this.username;
    }
  }
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateLastActive = function () {
  this.security.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    profile: this.profile,
    experienceLevel: this.experienceLevel,
    role: this.role,
    adminStatus: this.adminStatus,
    stats: this.stats,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.security.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.security.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return resetToken;
};

userSchema.methods.incrementLoginAttempts = async function () {
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { "security.lockUntil": 1 },
      $set: { "security.loginAttempts": 1 },
    });
  }

  const updates: Record<string, unknown> = { $inc: { "security.loginAttempts": 1 } };

  if (this.security.loginAttempts + 1 >= 11 && !this.security.lockUntil) {
    updates.$set = { "security.lockUntil": Date.now() + 1 * 60 * 60 * 1000 }; // 1 hour
  }

  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne({
    $unset: {
      "security.loginAttempts": 1,
      "security.lockUntil": 1,
    },
  });
};

userSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = this.stats.lastActivityDate;
  
  if (!lastActivity) {
    this.stats.currentStreak = 1;
    this.stats.longestStreak = Math.max(this.stats.longestStreak, 1);
    this.stats.lastActivityDate = today;
  } else {
    const lastActivityDate = new Date(lastActivity);
    lastActivityDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      return;
    } else if (daysDiff === 1) {
      this.stats.currentStreak += 1;
      this.stats.longestStreak = Math.max(this.stats.longestStreak, this.stats.currentStreak);
      this.stats.lastActivityDate = today;
    } else {
      this.stats.currentStreak = 1;
      this.stats.lastActivityDate = today;
    }
  }
  
  return this.save({ validateBeforeSave: false });
};

userSchema.methods.getStreakStatus = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = this.stats.lastActivityDate;
  
  if (!lastActivity) {
    return {
      currentStreak: 0,
      longestStreak: this.stats.longestStreak,
      streakStatus: 'start',
      daysSinceLastActivity: null
    };
  }
  
  const lastActivityDate = new Date(lastActivity);
  lastActivityDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let streakStatus;
  if (daysDiff === 0) {
    streakStatus = 'active';
  } else if (daysDiff === 1) {
    streakStatus = 'at_risk';
  } else {
    streakStatus = 'broken';
  }
  
  return {
    currentStreak: this.stats.currentStreak,
    longestStreak: this.stats.longestStreak,
    streakStatus,
    daysSinceLastActivity: daysDiff,
    lastActivityDate: lastActivity
  };
};

// Static methods
userSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username: username.toLowerCase() });
};

userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;