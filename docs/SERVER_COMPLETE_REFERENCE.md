# Hack The World - Complete Server Reference Guide

## 🎯 Quick Development Reference

**This guide is designed for LLMs and developers to quickly understand and extend the Hack The World backend system.**

---

## 📁 Server Architecture Overview

### File Structure & Purpose
```
server/
├── index.js                    # Main server entry point - Express setup, middleware, routes
├── package.json                # Dependencies: express, mongoose, bcryptjs, jsonwebtoken, etc.
├── env.example                 # Environment variables template
├── src/
│   ├── config/
│   │   ├── database.js         # MongoDB connection with error handling
│   │   └── swagger.js          # API documentation setup
│   ├── controllers/            # Business logic handlers
│   │   ├── authController.js   # Authentication: register, login, password reset
│   │   ├── profileController.js # User profile management
│   │   ├── phaseController.js  # Learning phases CRUD
│   │   ├── moduleController.js # Course modules with complex logic
│   │   ├── contentController.js # Content management with navigation
│   │   ├── enrollmentController.js # Module enrollment system
│   │   └── progressController.js # Progress tracking engine
│   ├── models/                 # MongoDB schemas with Mongoose
│   │   ├── User.js            # User accounts, profiles, security
│   │   ├── Phase.js           # Learning phases
│   │   ├── Module.js          # Course modules with content arrays
│   │   ├── Content.js         # Learning materials (videos, labs, games)
│   │   ├── UserEnrollment.js  # Module enrollment tracking
│   │   └── UserProgress.js    # Individual content progress
│   ├── routes/                # Express routes - map endpoints to controllers
│   │   ├── auth.js           # /api/auth/* routes
│   │   ├── profile.js        # /api/profile/* routes  
│   │   ├── phase.js          # /api/phases/* routes
│   │   ├── modules.js        # /api/modules/* routes
│   │   ├── content.js        # /api/content/* routes
│   │   ├── enrollment.js     # /api/enrollments/* routes
│   │   └── progress.js       # /api/progress/* routes
│   ├── middleware/            # Request processing middleware
│   │   ├── auth.js           # JWT authentication & authorization
│   │   ├── errorHandler.js   # Global error handling
│   │   ├── asyncHandler.js   # Async error wrapper
│   │   └── validation/       # Input validation schemas
│   └── utils/                 # Helper functions
│       ├── emailService.js   # Email sending (welcome, reset)
│       ├── seedData.js       # Database seeding utilities
│       └── moduleHelpers.js  # Module-related calculations
└── scripts/                   # Database seeding scripts
    ├── seedAll.js            # Complete database setup
    ├── seedPhases.js         # Learning phases data
    └── seedModules.js        # Course modules data
```

---

## 🗄️ Database Models Deep Dive

### User Model (`/src/models/User.js`)
**Purpose**: Central user management with authentication, profiles, and security

```javascript
// Schema Structure
{
  // Authentication
  username: String (unique, 3-30 chars, lowercase, alphanumeric + _ -)
  email: String (unique, validated email, lowercase)
  password: String (bcrypt hashed, min 8 chars, complexity required, select: false)
  
  // Profile Information  
  profile: {
    firstName: String (max 50 chars)
    lastName: String (max 50 chars)
    displayName: String (max 100 chars, auto-generated if empty)
    avatar: String (URL validation)
    bio: String (max 500 chars)
    location: String (max 100 chars)
    website: String (URL validation)
  }
  
  // System Data
  experienceLevel: String (beginner|intermediate|advanced|expert, default: beginner)
  role: String (student|admin, default: student)
  adminStatus: String (pending|active|suspended, for admin approval system)
  
  // Gamification Stats
  stats: {
    totalPoints: Number (default: 0)
    level: Number (1-100, default: 1)
    coursesCompleted: Number (default: 0)
    labsCompleted: Number (default: 0)
    gamesCompleted: Number (default: 0)
    achievementsEarned: Number (default: 0)
  }
  
  // Security Features
  security: {
    passwordChangedAt: Date
    passwordResetToken: String (SHA-256 hashed)
    passwordResetExpires: Date (10 minutes from creation)
    lastLogin: Date (updated on successful login)
    loginAttempts: Number (max 10 before lockout)
    lockUntil: Date (1 hour lockout duration)
  }
}

// Key Methods & Middleware
userSchema.pre('save', async function() {
  // Auto-hash password if modified
  // Auto-generate displayName if empty
  // Set passwordChangedAt timestamp
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword)
userSchema.methods.changedPasswordAfter = function(JWTTimestamp)
userSchema.methods.createPasswordResetToken = function()
userSchema.methods.isLocked = function()
userSchema.methods.incLoginAttempts = function()
```

**Usage Patterns**:
- **Registration**: Create user, hash password, send welcome email
- **Login**: Validate password, handle lockout, update lastLogin
- **Profile Updates**: Update profile fields, regenerate JWT if password changed
- **Password Reset**: Generate token, send email, validate and reset

### Phase Model (`/src/models/Phase.js`)
**Purpose**: High-level learning categories (e.g., Fundamentals, Advanced Techniques)

```javascript
{
  title: String (required, max 100 chars, unique)
  description: String (required, max 500 chars)  
  icon: String (required, max 50 chars) // Font Awesome icon names
  color: String (required, hex color validation)
  order: Number (required, unique, min 1) // Display order
}

// Automatic Features
- Pre-save validation ensures order uniqueness
- Auto-sorting by order field in queries
- Soft delete protection (prevents deletion if modules exist)
```

**Usage Patterns**:
- **Display Order**: Always sort by `order` field
- **Module Relationship**: Each module belongs to one phase
- **Admin Management**: Full CRUD with order conflict resolution

### Module Model (`/src/models/Module.js`)
**Purpose**: Individual courses within phases with complex content management

```javascript
{
  phaseId: ObjectId (ref: Phase, required)
  title: String (required, max 100 chars)
  description: String (required, max 500 chars)
  icon: String (required, max 50 chars)
  difficulty: String (Beginner|Intermediate|Advanced|Expert, required)
  color: String (required, max 50 chars)
  order: Number (required, min 1, unique per phase)
  topics: [String] (max 20 topics, max 100 chars each)
  isActive: Boolean (default: true, soft delete)
  prerequisites: [ObjectId] (ref: Module, for learning paths)
  learningOutcomes: [String] (max 10 outcomes)
  
  // Content Organization (auto-calculated)
  content: {
    videos: [String] (content IDs)
    labs: [String] (content IDs)  
    games: [String] (content IDs)
    documents: [String] (content IDs)
    estimatedHours: Number (auto-calculated from content durations)
  }
}

// Static Methods (Complex Business Logic)
Module.getGroupedByPhase() // Returns phases with their modules
Module.getByPhase(phaseId) // Get modules for specific phase
Module.calculateDuration(moduleId) // Recalculate total duration
Module.updateContentArrays(moduleId) // Sync content arrays with actual content
```

**Usage Patterns**:
- **Content Sync**: Content changes automatically update module content arrays
- **Duration Calculation**: Auto-calculated from all content items
- **Order Management**: Complex reordering within phases
- **Prerequisites**: Learning path enforcement

### Content Model (`/src/models/Content.js`)
**Purpose**: Individual learning materials with rich metadata

```javascript
{
  moduleId: ObjectId (ref: Module, required)
  type: String (video|lab|game|document, required)
  title: String (required, max 100 chars)
  description: String (required, max 10000 chars, rich text support)
  
  // Type-specific fields
  url: String (required for videos, YouTube/Vimeo URLs)
  instructions: String (required for labs/games, max 10000 chars)
  
  // Organization
  section: String (required, max 100 chars) // Groups content within modules
  duration: Number (1-300 minutes, required for videos)
  
  // Metadata & Resources
  metadata: Schema.Types.Mixed (flexible storage for type-specific data)
  resources: [String] (related links, downloads, references)
  
  // System
  isActive: Boolean (default: true, soft delete)
  createdAt: Date
  updatedAt: Date
}

// Post-save Middleware (Critical for Data Sync)
contentSchema.post('save', async function(doc) {
  await this.constructor.updateModuleStats(doc.moduleId)
  // This automatically:
  // 1. Updates Module.content arrays (videos, labs, games, documents)
  // 2. Recalculates Module.content.estimatedHours
  // 3. Maintains data consistency across models
})

// Static Methods
Content.getByModule(moduleId) // Get all content for module
Content.getByModuleGrouped(moduleId) // Group by type
Content.getByType(type, moduleId) // Filter by content type
Content.getFirstByModule(moduleId) // Get first content item
Content.updateModuleStats(moduleId) // Sync module content arrays
```

**Usage Patterns**:
- **Automatic Sync**: Content changes trigger module updates
- **Rich Navigation**: Previous/next content with context
- **Type-specific Handling**: Different logic for videos vs labs vs games
- **Section Grouping**: Content organized by sections within modules

### UserEnrollment Model (`/src/models/UserEnrollment.js`)
**Purpose**: Track user enrollment in modules with progress

```javascript
{
  userId: ObjectId (ref: User, required)
  moduleId: ObjectId (ref: Module, required)
  enrolledAt: Date (default: now)
  status: String (active|completed|paused|dropped, default: active)
  
  // Progress Tracking
  completedSections: Number (default: 0)
  totalSections: Number (auto-calculated from module content)
  progressPercentage: Number (0-100, auto-calculated)
  
  // Timestamps
  lastAccessedAt: Date (updated on content access)
  estimatedCompletionDate: Date (calculated based on progress rate)
}

// Compound Index: userId + moduleId (unique constraint)
// User can only enroll once per module

// Static Methods
UserEnrollment.getUserEnrollments(userId) // Get user's enrollments with module data
UserEnrollment.updateProgress(enrollmentId, completedSections) // Update progress
UserEnrollment.getByModule(moduleId, userId) // Check specific enrollment
```

**Usage Patterns**:
- **Enrollment Validation**: Prevent duplicate enrollments
- **Progress Calculation**: Auto-update percentages
- **Status Management**: Active → Paused → Completed workflows
- **Analytics**: Track completion rates and engagement

### UserProgress Model (`/src/models/UserProgress.js`)
**Purpose**: Granular progress tracking for individual content items

```javascript
{
  userId: ObjectId (ref: User, required)
  contentId: ObjectId (ref: Content, required)
  contentType: String (video|lab|game|document, required)
  status: String (not-started|in-progress|completed, default: not-started)
  progressPercentage: Number (0-100, default: 0)
  
  // Timestamps
  startedAt: Date (set when first accessed)
  completedAt: Date (set when marked complete)
  
  // Scoring (for games/assessments)
  score: Number (optional, for scored content)
  maxScore: Number (optional, maximum possible score)
}

// Compound Index: userId + contentId (unique constraint)
// Static Methods
UserProgress.getByUser(userId) // All user progress
UserProgress.getByContent(contentId) // Progress for specific content
UserProgress.getByModuleAndUser(moduleId, userId) // Module-specific progress
UserProgress.updateProgress(userId, contentId, progressData) // Update progress
```

**Usage Patterns**:
- **Automatic Creation**: Created on first content access
- **Completion Logic**: Different rules for different content types
- **Score Tracking**: Support for assessment scores
- **Progress Sync**: Updates trigger enrollment progress recalculation

---

## 🔄 API Endpoints Reference

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
**Purpose**: Create new user account with validation and welcome email
**Controller**: `authController.register`
**Validation**: `registerValidation` middleware
**Flow**:
1. Validate input (username, email, password complexity)
2. Check for existing user (email or username)
3. Create User document (triggers password hashing)
4. Generate JWT token
5. Send welcome email via EmailService
6. Return user data + token

```javascript
// Expected Request Body
{
  username: "string (3-30 chars, alphanumeric + _ -)",
  email: "valid email address", 
  password: "string (8+ chars, complexity required)",
  firstName: "string (optional, max 50 chars)",
  lastName: "string (optional, max 50 chars)",
  experienceLevel: "beginner|intermediate|advanced|expert (optional)"
}

// Response
{
  success: true,
  data: {
    user: { id, username, email, profile, experienceLevel, role, stats },
    token: "JWT_TOKEN"
  }
}
```

#### POST `/api/auth/login`
**Purpose**: Authenticate user with lockout protection
**Controller**: `authController.login`
**Flow**:
1. Find user by email/username
2. Check if account is locked
3. Validate password
4. Handle failed attempts (increment counter, set lockout)
5. Update lastLogin timestamp
6. Generate JWT token
7. Return user data + token

#### GET `/api/auth/me`
**Purpose**: Get current authenticated user profile
**Controller**: `authController.getCurrentUser`
**Middleware**: `protect` (JWT validation)
**Flow**:
1. Extract user from JWT (set by protect middleware)
2. Return user profile with populated stats

#### POST `/api/auth/forgot-password`
**Purpose**: Initiate password reset process
**Controller**: `authController.forgotPassword`
**Flow**:
1. Find user by email
2. Generate reset token (crypto.randomBytes, hashed)
3. Set token expiry (10 minutes)
4. Send reset email with token link
5. Return success message

#### POST `/api/auth/reset-password`
**Purpose**: Reset password using token
**Controller**: `authController.resetPassword`
**Flow**:
1. Hash provided token
2. Find user with matching token and valid expiry
3. Update password (triggers hashing middleware)
4. Clear reset token fields
5. Generate new JWT
6. Return user data + token

### Profile Routes (`/api/profile`)

#### PUT `/api/profile/basic`
**Purpose**: Update user profile information
**Controller**: `profileController.updateBasicProfile`
**Middleware**: `protect`
**Flow**:
1. Extract profile updates from request body
2. Update User.profile fields
3. Auto-regenerate displayName if firstName/lastName changed
4. Return updated user profile

#### PUT `/api/profile/change-password`
**Purpose**: Change user password with current password validation
**Controller**: `profileController.changePassword`
**Middleware**: `protect`
**Flow**:
1. Validate current password
2. Check new password complexity
3. Update password (triggers hashing)
4. Set passwordChangedAt timestamp
5. Generate new JWT (invalidates old tokens)
6. Return new token

#### PUT `/api/profile/avatar`
**Purpose**: Update user avatar URL
**Controller**: `profileController.updateAvatar`
**Middleware**: `protect`
**Flow**:
1. Validate avatar URL format
2. Update User.profile.avatar
3. Return updated profile

### Phase Routes (`/api/phases`)

#### GET `/api/phases`
**Purpose**: Get all learning phases sorted by order
**Controller**: `phaseController.getPhases`
**Flow**: `Phase.find({}).sort({ order: 1 })`

#### GET `/api/phases/:id`
**Purpose**: Get specific phase by ID
**Controller**: `phaseController.getPhase`
**Flow**: `Phase.findById(id)` with ObjectId validation

#### POST `/api/phases` (Admin Only)
**Purpose**: Create new learning phase
**Controller**: `phaseController.createPhase`
**Middleware**: `protect`, `requireAdmin`
**Flow**:
1. Validate phase data
2. Check order uniqueness
3. Create Phase document
4. Return created phase

#### PUT `/api/phases/:id` (Admin Only)
**Purpose**: Update existing phase
**Controller**: `phaseController.updatePhase`
**Flow**:
1. Check for order conflicts
2. Update phase with new data
3. Handle order resequencing if needed
4. Return updated phase

#### DELETE `/api/phases/:id` (Admin Only)
**Purpose**: Delete phase (with cascade protection)
**Controller**: `phaseController.deletePhase`
**Flow**:
1. Check if phase has associated modules
2. Prevent deletion if modules exist
3. Delete phase if safe
4. Return success confirmation

### Module Routes (`/api/modules`)

#### GET `/api/modules`
**Purpose**: Get all modules with optional filtering
**Controller**: `moduleController.getModules`
**Query Params**: `phaseId`, `difficulty`, `isActive`
**Flow**: Uses `Module.find()` with dynamic filters

#### GET `/api/modules/with-phases`
**Purpose**: Get modules grouped by phases (for course overview)
**Controller**: `moduleController.getModulesWithPhases`
**Flow**:
1. Get all phases sorted by order
2. Get modules grouped by phase using `Module.getGroupedByPhase()`
3. Combine and return structured data

#### GET `/api/modules/phase/:phaseId`
**Purpose**: Get all modules for specific phase
**Controller**: `moduleController.getModulesByPhase`
**Flow**: Uses `Module.getByPhase(phaseId)` static method

#### GET `/api/modules/:id`
**Purpose**: Get specific module with full details
**Controller**: `moduleController.getModule`
**Flow**: `Module.findById(id).populate('phaseId')`

#### POST `/api/modules` (Admin Only)
**Purpose**: Create new module with content initialization
**Controller**: `moduleController.createModule`
**Flow**:
1. Validate module data and phase existence
2. Determine order (auto-increment within phase)
3. Create Module document
4. Initialize empty content arrays
5. Return created module

#### PUT `/api/modules/:id` (Admin Only)
**Purpose**: Update module with complex order/phase logic
**Controller**: `moduleController.updateModule`
**Flow**:
1. Handle phase changes (update orders in both phases)
2. Handle order changes within same phase
3. Update module data
4. Recalculate content statistics
5. Return updated module

#### DELETE `/api/modules/:id` (Admin Only)
**Purpose**: Delete module and associated content
**Controller**: `moduleController.deleteModule`
**Flow**:
1. Delete all associated content
2. Delete all user enrollments
3. Delete all user progress records
4. Delete module document
5. Reorder remaining modules in phase

#### PUT `/api/modules/phase/:phaseId/reorder` (Admin Only)
**Purpose**: Reorder multiple modules within a phase
**Controller**: `moduleController.reorderModules`
**Flow**:
1. Validate new order array
2. Update order field for each module
3. Return success confirmation

### Content Routes (`/api/content`)

#### GET `/api/content`
**Purpose**: Get paginated content list with filtering (Admin)
**Controller**: `contentController.getAllContent`
**Query Params**: `page`, `limit`, `type`, `moduleId`, `section`
**Flow**:
1. Build filter object from query params
2. Execute paginated query
3. Return content list with pagination metadata

#### POST `/api/content` (Admin Only)
**Purpose**: Create new content item
**Controller**: `contentController.createContent`
**Flow**:
1. Validate content data and module existence
2. Create Content document
3. Post-save middleware updates module content arrays
4. Return created content

#### GET `/api/content/module/:moduleId`
**Purpose**: Get all content for specific module
**Controller**: `contentController.getContentByModule`
**Flow**: Uses `Content.getByModule(moduleId)` static method

#### GET `/api/content/module-overview/:moduleId`
**Purpose**: Get module overview content (first items of each type)
**Controller**: `contentController.getModuleOverview`
**Flow**:
1. Get module details
2. Get first video, lab, game, document
3. Return structured overview

#### GET `/api/content/module/:moduleId/grouped`
**Purpose**: Get content grouped by type for module
**Controller**: `contentController.getContentByModuleGrouped`
**Flow**: Uses `Content.getByModuleGrouped(moduleId)` static method

#### GET `/api/content/module/:moduleId/first`
**Purpose**: Get first content item for module (entry point)
**Controller**: `contentController.getFirstContentByModule`
**Flow**: Uses `Content.getFirstByModule(moduleId)` static method

#### GET `/api/content/module/:moduleId/grouped-optimized`
**Purpose**: Get optimized grouped content (minimal data for lists)
**Controller**: `contentController.getContentByModuleGroupedOptimized`
**Flow**:
1. Get content grouped by type
2. Return only essential fields (id, title, type, section)
3. Optimized for frontend list rendering

#### GET `/api/content/type/:type`
**Purpose**: Get content filtered by type
**Controller**: `contentController.getContentByType`
**Query Params**: `moduleId` (optional filter)
**Flow**: Uses `Content.getByType(type, moduleId)` static method

#### GET `/api/content/sections/by-module/:moduleId`
**Purpose**: Get distinct sections for module (for UI organization)
**Controller**: `contentController.getSectionsByModule`
**Flow**: `Content.distinct('section', { moduleId })`

#### GET `/api/content/:id`
**Purpose**: Get specific content item
**Controller**: `contentController.getContentById`
**Flow**: `Content.findById(id).populate('moduleId')`

#### GET `/api/content/:id/with-navigation`
**Purpose**: Get content with previous/next navigation context
**Controller**: `contentController.getContentWithNavigation`
**Flow**:
1. Get current content
2. Find previous content (same module, lower order)
3. Find next content (same module, higher order)
4. Return content with navigation links

#### GET `/api/content/:id/with-module-and-progress`
**Purpose**: Get content with module info and user progress
**Controller**: `contentController.getContentWithModuleAndProgress`
**Middleware**: `protect`
**Flow**:
1. Get content with populated module
2. Get user's progress for this content
3. Get user's enrollment in the module
4. Return combined data for content player

#### PUT `/api/content/:id` (Admin Only)
**Purpose**: Update content item
**Controller**: `contentController.updateContent`
**Flow**:
1. Update content data
2. Post-save middleware updates module statistics
3. Return updated content

#### DELETE `/api/content/:id` (Admin Only)
**Purpose**: Soft delete content (set isActive: false)
**Controller**: `contentController.deleteContent`
**Flow**:
1. Set isActive: false
2. Update module content arrays (removes from lists)
3. Preserve user progress data
4. Return success confirmation

#### DELETE `/api/content/:id/permanent` (Admin Only)
**Purpose**: Permanently delete content and all related data
**Controller**: `contentController.permanentDeleteContent`
**Flow**:
1. Delete all user progress records
2. Delete content document
3. Update module content arrays
4. Return success confirmation

### Enrollment Routes (`/api/enrollments`)

#### POST `/api/enrollments`
**Purpose**: Enroll user in module
**Controller**: `enrollmentController.enrollUser`
**Middleware**: `protect`
**Flow**:
1. Check if user already enrolled
2. Validate module exists and is active
3. Check prerequisites if any
4. Create UserEnrollment document
5. Calculate initial totalSections from module content
6. Return enrollment data

#### GET `/api/enrollments`
**Purpose**: Get user's enrollments with module details
**Controller**: `enrollmentController.getUserEnrollments`
**Middleware**: `protect`
**Flow**: Uses `UserEnrollment.getUserEnrollments(userId)` static method

#### GET `/api/enrollments/module/:moduleId`
**Purpose**: Check user's enrollment status for specific module
**Controller**: `enrollmentController.getEnrollmentByModule`
**Middleware**: `protect`
**Flow**: `UserEnrollment.getByModule(moduleId, userId)`

#### PUT `/api/enrollments/:enrollmentId/progress`
**Purpose**: Update enrollment progress (sections completed)
**Controller**: `enrollmentController.updateEnrollmentProgress`
**Middleware**: `protect`
**Flow**:
1. Validate enrollment belongs to user
2. Update completedSections
3. Auto-calculate progressPercentage
4. Update lastAccessedAt
5. Return updated enrollment

#### PUT `/api/enrollments/:enrollmentId/pause`
**Purpose**: Pause active enrollment
**Controller**: `enrollmentController.pauseEnrollment`
**Flow**: Update status to 'paused'

#### PUT `/api/enrollments/:enrollmentId/resume`
**Purpose**: Resume paused enrollment
**Controller**: `enrollmentController.resumeEnrollment`
**Flow**: Update status to 'active'

#### PUT `/api/enrollments/:enrollmentId/complete`
**Purpose**: Mark enrollment as completed
**Controller**: `enrollmentController.completeEnrollment`
**Flow**:
1. Update status to 'completed'
2. Set progressPercentage to 100
3. Update user stats (coursesCompleted++)
4. Return updated enrollment

#### DELETE `/api/enrollments/:enrollmentId`
**Purpose**: Unenroll user from module
**Controller**: `enrollmentController.unenrollUser`
**Flow**:
1. Validate enrollment belongs to user
2. Delete enrollment document
3. Optionally preserve progress data
4. Return success confirmation

#### GET `/api/enrollments/user/me`
**Purpose**: Get current user's enrollments (alias for GET /enrollments)
**Controller**: `enrollmentController.getCurrentUserEnrollments`
**Middleware**: `protect`

#### GET `/api/enrollments/user/:userId` (Admin Only)
**Purpose**: Get specific user's enrollments (admin view)
**Controller**: `enrollmentController.getUserEnrollmentsByUserId`
**Middleware**: `protect`, `requireAdmin`

#### GET `/api/enrollments/admin/all` (Admin Only)
**Purpose**: Get all enrollments with pagination and filtering
**Controller**: `enrollmentController.getAllEnrollments`
**Query Params**: `page`, `limit`, `status`, `moduleId`
**Middleware**: `protect`, `requireAdmin`

#### GET `/api/enrollments/admin/stats/:moduleId` (Admin Only)
**Purpose**: Get enrollment statistics for specific module
**Controller**: `enrollmentController.getModuleEnrollmentStats`
**Flow**:
1. Count total enrollments
2. Group by status (active, completed, paused, dropped)
3. Calculate completion rates
4. Return statistical summary

### Progress Routes (`/api/progress`)

#### POST `/api/progress/content/start`
**Purpose**: Mark content as started (create initial progress record)
**Controller**: `progressController.markContentStarted`
**Middleware**: `protect`
**Flow**:
1. Validate user is enrolled in content's module
2. Create or find UserProgress record
3. Set status to 'in-progress' if not already completed
4. Set startedAt timestamp
5. Return progress data

#### POST `/api/progress/content/complete`
**Purpose**: Mark content as completed with optional scoring
**Controller**: `progressController.markContentComplete`
**Middleware**: `protect`
**Flow**:
1. Find or create UserProgress record
2. Set status to 'completed'
3. Set progressPercentage to 100
4. Set completedAt timestamp
5. Save score data if provided
6. Update enrollment progress (recalculate sections)
7. Update user stats based on content type
8. Return updated progress

#### POST `/api/progress/content/update`
**Purpose**: Update content progress percentage
**Controller**: `progressController.updateContentProgress`
**Middleware**: `protect`
**Flow**:
1. Find or create UserProgress record
2. Update progressPercentage
3. Auto-complete if >= 90% for videos
4. Update enrollment progress if content completed
5. Return updated progress

#### GET `/api/progress/content/:contentId`
**Purpose**: Get user's progress for specific content
**Controller**: `progressController.getContentProgress`
**Middleware**: `protect`
**Flow**: `UserProgress.findOne({ userId, contentId })`

#### GET `/api/progress/overview/:userId`
**Purpose**: Get comprehensive progress overview for user
**Controller**: `progressController.getUserOverallProgress`
**Middleware**: `protect`
**Flow**:
1. Get all user enrollments with module details
2. Get progress counts by content type
3. Calculate overall completion percentages
4. Get recent activity
5. Return comprehensive progress summary

#### GET `/api/progress/module/:userId/:moduleId`
**Purpose**: Get detailed progress for user in specific module
**Controller**: `progressController.getUserModuleProgress`
**Middleware**: `protect`
**Flow**:
1. Get module enrollment data
2. Get all content progress for module
3. Group progress by content type and section
4. Calculate section completion percentages
5. Return detailed module progress

#### GET `/api/progress/content/:userId/:contentType`
**Purpose**: Get user's progress filtered by content type
**Controller**: `progressController.getUserContentTypeProgress`
**Query Params**: `moduleId`, `status`
**Middleware**: `protect`
**Flow**:
1. Build filter object (userId, contentType, optional moduleId/status)
2. Get progress records with populated content details
3. Return filtered progress list

---

## 🔐 Authentication & Security System

### JWT Token Management
**File**: `/src/middleware/auth.js`

#### `protect` Middleware
**Purpose**: Validate JWT and attach authenticated user to request
**Flow**:
1. Extract Bearer token from Authorization header
2. Verify JWT with `process.env.JWT_SECRET`
3. Decode userId from token payload
4. Find user by ID (exclude password field)
5. Check if password changed after token issue (`changedPasswordAfter`)
6. Attach user to `req.user` for subsequent middleware

```javascript
// Token Structure
{
  userId: "ObjectId",
  iat: "issued at timestamp",
  exp: "expiry timestamp (7 days default)"
}

// Environment Variables Required
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

#### `authorize` Middleware
**Purpose**: Role-based access control
**Usage**: `authorize('admin')` or `authorize('admin', 'teacher')`
**Flow**: Check if `req.user.role` matches allowed roles

#### `requireAdmin` Middleware
**Purpose**: Admin-specific validation with status check
**Flow**: Check `role === 'admin'` AND `adminStatus === 'active'`

### Password Security
**Implementation**: bcrypt with salt rounds (12)
**Requirements**: 8+ chars, uppercase, lowercase, number, special character
**Validation**: express-validator with custom regex patterns

### Account Lockout System
**Trigger**: 10 failed login attempts
**Duration**: 1 hour lockout
**Implementation**: `loginAttempts` counter, `lockUntil` timestamp

### Password Reset System
**Token Generation**: `crypto.randomBytes(32)` → SHA-256 hash
**Expiry**: 10 minutes
**Email**: NodeMailer with template system

---

## 🔄 Data Flow & Synchronization

### Content → Module Sync
**Trigger**: Content creation, update, or deletion
**Mechanism**: Mongoose post-save middleware

```javascript
// Automatic Synchronization Flow
contentSchema.post('save', async function(doc) {
  await this.constructor.updateModuleStats(doc.moduleId);
});

// What Gets Updated:
Module.content.videos = [contentIds] // All video content IDs
Module.content.labs = [contentIds]   // All lab content IDs  
Module.content.games = [contentIds]  // All game content IDs
Module.content.documents = [contentIds] // All document content IDs
Module.content.estimatedHours = calculatedTotal // Sum of all content durations
```

### Progress → Enrollment Sync
**Trigger**: Content completion
**Flow**:
1. User completes content → UserProgress updated
2. Check if all section content completed → Update UserEnrollment.completedSections
3. Recalculate UserEnrollment.progressPercentage
4. Update UserEnrollment.lastAccessedAt

### User Stats Sync
**Trigger**: Content/module completion
**Updates**:
- `stats.coursesCompleted` (module completion)
- `stats.labsCompleted` (lab completion)  
- `stats.gamesCompleted` (game completion)
- `stats.totalPoints` (score accumulation)

---

## 🛠️ Development Utilities

### Database Seeding
**Location**: `/scripts/`
**Purpose**: Initialize database with sample data

```bash
# Seed everything
npm run seed:all

# Seed specific data
npm run seed:phases
npm run seed:modules  
npm run seed:admin
```

### Email Service
**File**: `/src/utils/emailService.js`
**Features**:
- Welcome emails on registration
- Password reset emails with tokens
- Template-based HTML emails
- Environment-based configuration (dev/prod)

### Error Handling
**Global Handler**: `/src/middleware/errorHandler.js`
**Features**:
- Environment-specific error responses
- MongoDB error normalization (CastError, ValidationError)
- JWT error handling
- Custom APIError class for structured responses

### API Documentation
**Framework**: Swagger/OpenAPI
**Endpoint**: `/api/docs`
**Auto-generated**: From JSDoc comments in route files

---

## 🚀 Quick Development Patterns

### Adding New Endpoint
1. **Define Route** in appropriate `/routes/` file
2. **Add Validation** in `/middleware/validation/`
3. **Create Controller** function in `/controllers/`
4. **Test** with Postman/Thunder Client
5. **Document** with JSDoc comments

### Model Relationships
```javascript
// Reference Pattern
const schema = new Schema({
  referenceId: { type: Schema.Types.ObjectId, ref: 'ModelName', required: true }
});

// Populate Pattern
Model.findById(id).populate('referenceId')
Model.find().populate('referenceId', 'field1 field2') // Select specific fields
```

### Error Handling Pattern
```javascript
const asyncHandler = require('../middleware/asyncHandler');

const controllerFunction = asyncHandler(async (req, res, next) => {
  // Business logic here
  // Errors automatically caught and passed to error handler
  
  res.status(200).json({
    success: true,
    data: result
  });
});
```

### Validation Pattern
```javascript
const { body, param, validationResult } = require('express-validator');

const validation = [
  body('field').isLength({ min: 1 }).withMessage('Field is required'),
  param('id').isMongoId().withMessage('Invalid ID format')
];

const controller = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  // Continue with business logic
};
```

This documentation provides complete context for rapid development and maintenance of the Hack The World backend system.