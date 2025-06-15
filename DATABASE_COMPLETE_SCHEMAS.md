# Database Complete Schemas - MongoDB Models

## 📊 Database Architecture Overview

**Database**: MongoDB with Mongoose ODM  
**Total Models**: 8 core models with complex relationships  
**Connection**: MongoDB Atlas with connection pooling  
**Validation**: Mongoose schema validation + express-validator  

## 🗃️ Complete Model Schemas

### 1. User Model (`/server/src/models/User.js`)

**Purpose**: Central user management for students and admins  
**Collection**: `users`  
**Indexes**: username (unique), email (unique)

```javascript
const userSchema = new mongoose.Schema({
  // === AUTHENTICATION FIELDS ===
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Never include in queries by default
  },
  
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },

  // === PROFILE INFORMATION ===
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [100, 'Display name cannot exceed 100 characters']
    },
    avatar: {
      type: String, // URL to avatar image
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Website must be a valid URL']
    }
  },

  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },

  // === GAMIFICATION & STATISTICS ===
  stats: {
    totalPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    level: {
      type: Number,
      default: 1,
      min: 1
    },
    coursesCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    labsCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    gamesCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    totalStudyTime: {
      type: Number, // in minutes
      default: 0,
      min: 0
    }
  },

  // === LEARNING STREAKS ===
  currentStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  
  longestStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  
  lastActivityDate: {
    type: Date,
    default: null
  },

  // === ADMIN-SPECIFIC FIELDS ===
  adminStatus: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: function() {
      return this.role === 'admin' ? 'pending' : undefined;
    }
  },

  // === SECURITY FIELDS ===
  security: {
    passwordChangedAt: {
      type: Date,
      default: Date.now
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,
    twoFactorEnabled: {
      type: Boolean,
      default: false
    }
  },

  // === PREFERENCES ===
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    progressNotifications: {
      type: Boolean,
      default: true
    },
    achievementNotifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'auto'],
      default: 'dark'
    },
    language: {
      type: String,
      default: 'en'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === VIRTUAL FIELDS ===
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`.trim();
});

userSchema.virtual('isAccountLocked').get(function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// === INDEXES ===
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ 'stats.totalPoints': -1 });
userSchema.index({ currentStreak: -1 });
```

### 2. Phase Model (`/server/src/models/Phase.js`)

**Purpose**: High-level learning phases (e.g., "Fundamentals", "Advanced")  
**Collection**: `phases`  
**Relationships**: One-to-Many with Modules

```javascript
const phaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Phase title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Phase description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  
  order: {
    type: Number,
    required: true,
    min: 1
  },
  
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  
  estimatedDuration: {
    type: Number, // in hours
    min: 1
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  objectives: [{
    type: String,
    maxlength: [200, 'Objective cannot exceed 200 characters']
  }],
  
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phase'
  }],
  
  image: {
    type: String, // URL to phase image
    default: null
  },
  
  icon: {
    type: String, // Icon identifier or URL
    default: null
  },
  
  color: {
    type: String, // Hex color for UI theming
    default: '#00ff41'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  metadata: {
    totalModules: {
      type: Number,
      default: 0
    },
    totalContent: {
      type: Number,
      default: 0
    },
    totalDuration: {
      type: Number, // in minutes
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === VIRTUAL FIELDS ===
phaseSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'phase'
});

// === INDEXES ===
phaseSchema.index({ order: 1 });
phaseSchema.index({ difficulty: 1 });
phaseSchema.index({ isActive: 1 });
```

### 3. Module Model (`/server/src/models/Module.js`)

**Purpose**: Individual courses within phases  
**Collection**: `modules`  
**Relationships**: Many-to-One with Phase, One-to-Many with Content

```javascript
const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Module description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phase',
    required: [true, 'Phase is required']
  },
  
  order: {
    type: Number,
    required: true,
    min: 1
  },
  
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  
  estimatedDuration: {
    type: Number, // in minutes
    min: 1
  },
  
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  
  learningObjectives: [{
    type: String,
    maxlength: [200, 'Learning objective cannot exceed 200 characters']
  }],
  
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill cannot exceed 50 characters']
  }],
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  image: {
    type: String, // URL to module image
    default: null
  },
  
  icon: {
    type: String, // Icon identifier
    default: null
  },
  
  instructor: {
    name: String,
    bio: String,
    avatar: String
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  metadata: {
    totalContent: {
      type: Number,
      default: 0
    },
    totalDuration: {
      type: Number, // in minutes
      default: 0
    },
    videoCount: {
      type: Number,
      default: 0
    },
    labCount: {
      type: Number,
      default: 0
    },
    gameCount: {
      type: Number,
      default: 0
    },
    documentCount: {
      type: Number,
      default: 0
    }
  },
  
  settings: {
    allowDownload: {
      type: Boolean,
      default: false
    },
    requireSequentialCompletion: {
      type: Boolean,
      default: true
    },
    certificateEligible: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === VIRTUAL FIELDS ===
moduleSchema.virtual('content', {
  ref: 'Content',
  localField: '_id',
  foreignField: 'module'
});

moduleSchema.virtual('enrollmentCount', {
  ref: 'UserEnrollment',
  localField: '_id',
  foreignField: 'module',
  count: true
});

// === INDEXES ===
moduleSchema.index({ phase: 1, order: 1 });
moduleSchema.index({ difficulty: 1 });
moduleSchema.index({ isActive: 1 });
moduleSchema.index({ isFeatured: 1 });
moduleSchema.index({ tags: 1 });
```

### 4. Content Model (`/server/src/models/Content.js`)

**Purpose**: Individual learning materials (videos, labs, games, documents)  
**Collection**: `contents`  
**Relationships**: Many-to-One with Module

```javascript
const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Content title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: [true, 'Module is required']
  },
  
  type: {
    type: String,
    enum: ['video', 'lab', 'game', 'document'],
    required: [true, 'Content type is required']
  },
  
  order: {
    type: Number,
    required: true,
    min: 1
  },
  
  duration: {
    type: Number, // in minutes
    min: 1
  },
  
  // === CONTENT-SPECIFIC DATA ===
  content: {
    // For videos
    videoUrl: String,
    videoId: String,
    thumbnailUrl: String,
    captions: String,
    
    // For labs
    labInstructions: String,
    labEnvironment: String,
    labSolution: String,
    labHints: [String],
    
    // For games
    gameType: {
      type: String,
      enum: ['quiz', 'simulation', 'puzzle', 'scenario']
    },
    gameData: mongoose.Schema.Types.Mixed,
    gameInstructions: String,
    gameObjectives: [String],
    
    // For documents
    documentUrl: String,
    documentContent: String,
    documentFormat: {
      type: String,
      enum: ['pdf', 'html', 'markdown', 'text']
    }
  },
  
  // === ORGANIZATION ===
  section: {
    type: String,
    trim: true,
    maxlength: [100, 'Section cannot exceed 100 characters']
  },
  
  subsection: {
    type: String,
    trim: true,
    maxlength: [100, 'Subsection cannot exceed 100 characters']
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  
  // === COMPLETION CRITERIA ===
  completionCriteria: {
    type: {
      type: String,
      enum: ['time_based', 'interaction_based', 'manual'],
      default: 'time_based'
    },
    requiredPercentage: {
      type: Number,
      default: 90,
      min: 0,
      max: 100
    },
    requiredInteractions: Number
  },
  
  // === METADATA ===
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFree: {
    type: Boolean,
    default: true
  },
  
  metadata: {
    fileSize: Number, // in bytes
    resolution: String, // for videos
    language: {
      type: String,
      default: 'en'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  settings: {
    allowSkip: {
      type: Boolean,
      default: false
    },
    allowDownload: {
      type: Boolean,
      default: false
    },
    allowSpeedControl: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === VIRTUAL FIELDS ===
contentSchema.virtual('progressCount', {
  ref: 'UserProgress',
  localField: '_id',
  foreignField: 'content',
  count: true
});

// === INDEXES ===
contentSchema.index({ module: 1, order: 1 });
contentSchema.index({ type: 1 });
contentSchema.index({ isActive: 1 });
contentSchema.index({ section: 1 });
contentSchema.index({ tags: 1 });
```

### 5. UserEnrollment Model (`/server/src/models/UserEnrollment.js`)

**Purpose**: Track user enrollments in modules with progress  
**Collection**: `userenrollments`  
**Relationships**: Many-to-One with User and Module

```javascript
const userEnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: [true, 'Module is required']
  },
  
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'dropped'],
    default: 'active'
  },
  
  progress: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedContent: {
      type: Number,
      default: 0,
      min: 0
    },
    totalContent: {
      type: Number,
      default: 0,
      min: 0
    },
    lastContentCompleted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content'
    }
  },
  
  timeSpent: {
    total: {
      type: Number, // in minutes
      default: 0
    },
    sessions: [{
      startTime: Date,
      endTime: Date,
      duration: Number // in minutes
    }]
  },
  
  completedAt: {
    type: Date,
    default: null
  },
  
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  
  // === PERFORMANCE TRACKING ===
  performance: {
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    totalAttempts: {
      type: Number,
      default: 0
    },
    bestScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  
  // === ENGAGEMENT METRICS ===
  engagement: {
    totalLogins: {
      type: Number,
      default: 1
    },
    consecutiveDays: {
      type: Number,
      default: 1
    },
    notesCount: {
      type: Number,
      default: 0
    },
    bookmarksCount: {
      type: Number,
      default: 0
    }
  },
  
  // === CERTIFICATES & ACHIEVEMENTS ===
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    certificateId: String,
    downloadUrl: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === COMPOUND INDEXES ===
userEnrollmentSchema.index({ user: 1, module: 1 }, { unique: true });
userEnrollmentSchema.index({ user: 1, status: 1 });
userEnrollmentSchema.index({ module: 1, status: 1 });
userEnrollmentSchema.index({ enrolledAt: -1 });
userEnrollmentSchema.index({ lastAccessedAt: -1 });
```

### 6. UserProgress Model (`/server/src/models/UserProgress.js`)

**Purpose**: Track individual content completion progress  
**Collection**: `userprogresses`  
**Relationships**: Many-to-One with User and Content

```javascript
const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: [true, 'Content is required']
  },
  
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: [true, 'Module is required']
  },
  
  // === PROGRESS TRACKING ===
  progress: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    currentPosition: {
      type: Number, // for videos: seconds, for documents: page/section
      default: 0
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  
  // === TIME TRACKING ===
  timeSpent: {
    total: {
      type: Number, // in seconds
      default: 0
    },
    sessions: [{
      startTime: Date,
      endTime: Date,
      duration: Number, // in seconds
      progressGained: Number // percentage points gained
    }]
  },
  
  // === INTERACTION DATA ===
  interactions: {
    views: {
      type: Number,
      default: 1
    },
    pauses: {
      type: Number,
      default: 0
    },
    seeks: {
      type: Number,
      default: 0
    },
    replays: {
      type: Number,
      default: 0
    }
  },
  
  // === CONTENT-SPECIFIC PROGRESS ===
  contentSpecific: {
    // For videos
    watchedSegments: [{
      start: Number, // in seconds
      end: Number // in seconds
    }],
    playbackSpeed: {
      type: Number,
      default: 1.0
    },
    quality: String,
    
    // For labs
    labAttempts: {
      type: Number,
      default: 0
    },
    labCompleted: {
      type: Boolean,
      default: false
    },
    labScore: {
      type: Number,
      min: 0,
      max: 100
    },
    hintsUsed: {
      type: Number,
      default: 0
    },
    
    // For games
    gameScore: {
      type: Number,
      default: 0
    },
    gameAttempts: {
      type: Number,
      default: 0
    },
    gameLevel: {
      type: Number,
      default: 1
    },
    gameBestScore: {
      type: Number,
      default: 0
    },
    
    // For documents
    pagesRead: [{
      page: Number,
      readAt: Date,
      timeSpent: Number // in seconds
    }],
    bookmarks: [{
      page: Number,
      note: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // === LEARNING ANALYTICS ===
  analytics: {
    engagementScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    difficultyRating: {
      type: Number,
      min: 1,
      max: 5
    },
    userRating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String
  },
  
  // === METADATA ===
  startedAt: {
    type: Date,
    default: Date.now
  },
  
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  
  device: {
    type: String,
    enum: ['desktop', 'tablet', 'mobile'],
    default: 'desktop'
  },
  
  browser: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === COMPOUND INDEXES ===
userProgressSchema.index({ user: 1, content: 1 }, { unique: true });
userProgressSchema.index({ user: 1, module: 1 });
userProgressSchema.index({ user: 1, 'progress.isCompleted': 1 });
userProgressSchema.index({ content: 1, 'progress.isCompleted': 1 });
userProgressSchema.index({ lastAccessedAt: -1 });
```

### 7. Achievement Model (`/server/src/models/Achievement.js`)

**Purpose**: Define available achievements in the system  
**Collection**: `achievements`  
**Relationships**: Referenced by UserAchievement

```javascript
const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  category: {
    type: String,
    enum: ['progress', 'engagement', 'performance', 'social', 'special'],
    required: [true, 'Category is required']
  },
  
  type: {
    type: String,
    enum: ['milestone', 'streak', 'completion', 'mastery', 'time_based'],
    required: [true, 'Type is required']
  },
  
  // === CRITERIA ===
  criteria: {
    // For milestone achievements
    targetValue: Number,
    targetType: {
      type: String,
      enum: ['modules_completed', 'content_completed', 'points_earned', 'time_spent', 'streak_days']
    },
    
    // For completion achievements
    requiredModules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    }],
    requiredPhases: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Phase'
    }],
    
    // For performance achievements
    minimumScore: {
      type: Number,
      min: 0,
      max: 100
    },
    
    // For time-based achievements
    timeframe: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'all_time']
    },
    
    // For streak achievements
    consecutiveDays: Number,
    
    // Advanced criteria
    conditions: [{
      field: String,
      operator: {
        type: String,
        enum: ['equals', 'greater_than', 'less_than', 'contains']
      },
      value: mongoose.Schema.Types.Mixed
    }]
  },
  
  // === REWARDS ===
  rewards: {
    points: {
      type: Number,
      default: 0,
      min: 0
    },
    badge: {
      type: String, // Badge icon/image identifier
      required: true
    },
    title: String, // Special title unlocked
    certificate: {
      type: Boolean,
      default: false
    }
  },
  
  // === DISPLAY PROPERTIES ===
  icon: {
    type: String,
    required: [true, 'Icon is required']
  },
  
  color: {
    type: String,
    default: '#00ff41'
  },
  
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  
  isHidden: {
    type: Boolean,
    default: false // Hidden achievements for surprises
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  order: {
    type: Number,
    default: 0
  },
  
  // === METADATA ===
  metadata: {
    earnedCount: {
      type: Number,
      default: 0
    },
    totalEligible: {
      type: Number,
      default: 0
    },
    averageEarnTime: Number, // days to earn
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'extreme'],
      default: 'medium'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === VIRTUAL FIELDS ===
achievementSchema.virtual('earnRate').get(function() {
  if (this.metadata.totalEligible === 0) return 0;
  return (this.metadata.earnedCount / this.metadata.totalEligible) * 100;
});

// === INDEXES ===
achievementSchema.index({ category: 1 });
achievementSchema.index({ type: 1 });
achievementSchema.index({ isActive: 1 });
achievementSchema.index({ rarity: 1 });
achievementSchema.index({ order: 1 });
```

### 8. UserAchievement Model (`/server/src/models/UserAchievement.js`)

**Purpose**: Track user's earned achievements  
**Collection**: `userachievements`  
**Relationships**: Many-to-One with User and Achievement

```javascript
const userAchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: [true, 'Achievement is required']
  },
  
  earnedAt: {
    type: Date,
    default: Date.now
  },
  
  // === ACHIEVEMENT CONTEXT ===
  earnedContext: {
    triggerType: {
      type: String,
      enum: ['content_completion', 'module_completion', 'streak_milestone', 'score_achievement', 'time_milestone'],
      required: true
    },
    triggerValue: mongoose.Schema.Types.Mixed,
    relatedContent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content'
    },
    relatedModule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    },
    snapshot: {
      userLevel: Number,
      userPoints: Number,
      userStreak: Number,
      modulesCompleted: Number,
      contentCompleted: Number
    }
  },
  
  // === PROGRESS TOWARDS ACHIEVEMENT ===
  progress: {
    currentValue: {
      type: Number,
      default: 0
    },
    targetValue: Number,
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  
  // === DISPLAY STATUS ===
  isViewed: {
    type: Boolean,
    default: false
  },
  
  viewedAt: {
    type: Date,
    default: null
  },
  
  isNotified: {
    type: Boolean,
    default: false
  },
  
  notifiedAt: {
    type: Date,
    default: null
  },
  
  // === SHARING ===
  isShared: {
    type: Boolean,
    default: false
  },
  
  sharedAt: {
    type: Date,
    default: null
  },
  
  // === METADATA ===
  metadata: {
    timeToEarn: Number, // days from registration to earning
    difficulty: String,
    celebrationShown: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === COMPOUND INDEXES ===
userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });
userAchievementSchema.index({ user: 1, earnedAt: -1 });
userAchievementSchema.index({ achievement: 1, earnedAt: -1 });
userAchievementSchema.index({ user: 1, isViewed: 1 });
```

## 🔗 Relationships Summary

### Primary Relationships
1. **Phase → Module** (1:M): `module.phase` references `phase._id`
2. **Module → Content** (1:M): `content.module` references `module._id`
3. **User → UserEnrollment** (1:M): `enrollment.user` references `user._id`
4. **Module → UserEnrollment** (1:M): `enrollment.module` references `module._id`
5. **User → UserProgress** (1:M): `progress.user` references `user._id`
6. **Content → UserProgress** (1:M): `progress.content` references `content._id`
7. **User → UserAchievement** (1:M): `userAchievement.user` references `user._id`
8. **Achievement → UserAchievement** (1:M): `userAchievement.achievement` references `achievement._id`

### Secondary Relationships
- **Module Prerequisites**: `module.prerequisites` references other `module._id`
- **Phase Prerequisites**: `phase.prerequisites` references other `phase._id`
- **Achievement Criteria**: Can reference specific modules/phases for completion requirements

## 📈 Database Optimization Strategies

### Indexing Strategy
- **Compound Indexes**: For frequently queried combinations (user + module, user + content)
- **Single Field Indexes**: For common filter fields (status, isActive, type)
- **Unique Indexes**: For data integrity (username, email, user+module combinations)
- **Sparse Indexes**: For optional fields that are frequently queried

### Query Optimization
- **Populate Strategies**: Selective population to minimize data transfer
- **Aggregation Pipelines**: For complex analytics and reporting
- **Lean Queries**: Using `.lean()` for read-only operations
- **Field Selection**: Using `.select()` to limit returned fields

### Data Consistency
- **Mongoose Middleware**: Pre/post hooks for maintaining calculated fields
- **Atomic Operations**: Using `$inc`, `$set`, `$push` for thread-safe updates
- **Transactions**: For multi-document operations requiring consistency
- **Validation**: Schema-level and application-level validation

This comprehensive database schema documentation provides the complete foundation for recreating the MongoDB data layer in the Next.js version of the platform.