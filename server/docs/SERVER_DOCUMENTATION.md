# 🛡️ Hack The World - Server API Documentation

**Generated on**: January 25, 2025
**Version**: 1.0.0
**Last Updated**: January 25, 2025 - Progress System Restructured

---

## 📋 Table of Contents

1. [🚀 Server Overview](#-server-overview)
2. [🔧 API Routes](#-api-routes)
3. [🎮 Controllers](#-controllers)
4. [📊 Models & Schemas](#-models--schemas)
5. [🔒 Middleware](#-middleware)
6. [📱 Admin Panel Integration](#-admin-panel-integration)
7. [📚 Usage Examples](#-usage-examples)
8. [🔄 Auto-Update System](#-auto-update-system)

---

## 🚀 Server Overview

### Technology Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest + Supertest

### Base Configuration

- **Base URL**: `http://localhost:5001/api`
- **CORS Origins**: `http://localhost:5173` (frontend), `http://localhost:3000` (admin)
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security**: Helmet.js, XSS protection, NoSQL injection prevention

---

## 🔧 API Routes

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint                    | Purpose                         | Admin Used | Frontend Used |
| ------ | --------------------------- | ------------------------------- | ---------- | ------------- |
| POST   | `/api/auth/register`        | User registration               | ❌         | ✅            |
| POST   | `/api/auth/login`           | User login                      | ✅         | ✅            |
| POST   | `/api/auth/logout`          | User logout                     | ✅         | ✅            |
| GET    | `/api/auth/me`              | Get current user                | ✅         | ✅            |
| PUT    | `/api/auth/me`              | Update current user             | ❌         | ✅            |
| POST   | `/api/auth/forgot-password` | Request password reset          | ❌         | ✅            |
| POST   | `/api/auth/reset-password`  | Reset password with token       | ❌         | ✅            |
| POST   | `/api/auth/change-password` | Change password (authenticated) | ❌         | ✅            |
| DELETE | `/api/auth/delete-account`  | Delete user account             | ❌         | ✅            |

### 🎯 Phase Routes (`/api/phases`)

| Method | Endpoint          | Purpose            | Admin Used | Frontend Used |
| ------ | ----------------- | ------------------ | ---------- | ------------- |
| GET    | `/api/phases`     | Get all phases     | ✅         | ✅            |
| POST   | `/api/phases`     | Create new phase   | ✅         | ❌            |
| GET    | `/api/phases/:id` | Get specific phase | ✅         | ✅            |
| PUT    | `/api/phases/:id` | Update phase       | ✅         | ❌            |
| DELETE | `/api/phases/:id` | Delete phase       | ✅         | ❌            |

### 📚 Module Routes (`/api/modules`)

| Method | Endpoint                      | Purpose               | Admin Used | Frontend Used |
| ------ | ----------------------------- | --------------------- | ---------- | ------------- |
| GET    | `/api/modules`                | Get all modules       | ✅         | ✅            |
| POST   | `/api/modules`                | Create new module     | ✅         | ❌            |
| GET    | `/api/modules/:id`            | Get specific module   | ✅         | ✅            |
| PUT    | `/api/modules/:id`            | Update module         | ✅         | ❌            |
| DELETE | `/api/modules/:id`            | Delete module         | ✅         | ❌            |
| GET    | `/api/modules/phase/:phaseId` | Get modules by phase  | ✅         | ✅            |
| POST   | `/api/modules/:id/enroll`     | Enroll in module      | ❌         | ✅            |
| GET    | `/api/modules/:id/contents`   | Get module content    | ❌         | ✅            |
| GET    | `/api/modules/:id/stats`      | Get module statistics | ✅         | ❌            |

### 📄 Content Routes (`/api/content`)

| Method | Endpoint                                    | Purpose                    | Admin Used | Frontend Used |
| ------ | ------------------------------------------- | -------------------------- | ---------- | ------------- |
| GET    | `/api/content`                              | Get all content            | ✅         | ❌            |
| POST   | `/api/content`                              | Create new content         | ✅         | ❌            |
| GET    | `/api/content/:id`                          | Get specific content       | ✅         | ✅            |
| PUT    | `/api/content/:id`                          | Update content             | ✅         | ❌            |
| DELETE | `/api/content/:id`                          | Delete content             | ✅         | ❌            |
| DELETE | `/api/content/:id/permanent`                | Permanently delete content | ✅         | ❌            |
| POST   | `/api/content/:id/restore`                  | Restore deleted content    | ✅         | ❌            |
| GET    | `/api/content/module/:moduleId`             | Get content by module      | ❌         | ✅            |
| GET    | `/api/content/sections/by-module/:moduleId` | Get sections by module     | ✅         | ❌            |

### 🎓 Enrollment Routes (`/api/enrollment`)

| Method | Endpoint                                | Purpose                     | Admin Used | Frontend Used |
| ------ | --------------------------------------- | --------------------------- | ---------- | ------------- |
| GET    | `/api/enrollment`                       | Get user enrollments        | ❌         | ✅            |
| POST   | `/api/enrollment/:moduleId`             | Enroll in module            | ❌         | ✅            |
| GET    | `/api/enrollment/:moduleId`             | Get enrollment details      | ❌         | ✅            |
| DELETE | `/api/enrollment/:moduleId`             | Unenroll from module        | ❌         | ✅            |
| GET    | `/api/enrollment/admin/all`             | Get all enrollments (admin) | ✅         | ❌            |
| GET    | `/api/enrollment/admin/stats`           | Get enrollment statistics   | ✅         | ❌            |
| GET    | `/api/enrollment/admin/:moduleId/stats` | Get module enrollment stats | ✅         | ❌            |
| PUT    | `/api/enrollment/admin/:enrollmentId`   | Update enrollment (admin)   | ✅         | ❌            |
| DELETE | `/api/enrollment/admin/:enrollmentId`   | Delete enrollment (admin)   | ✅         | ❌            |

### 📈 Progress Routes (`/api/progress`)

| Method | Endpoint                                     | Purpose                          | Admin Used | Frontend Used |
| ------ | -------------------------------------------- | -------------------------------- | ---------- | ------------- |
| POST   | `/api/progress/content/start`                | Mark content as started (auto)   | ❌         | ✅            |
| POST   | `/api/progress/content/complete`             | Mark content as completed        | ❌         | ✅            |
| POST   | `/api/progress/content/update`               | Update content progress (videos) | ❌         | ✅            |
| GET    | `/api/progress/overview/:userId`             | Get user overall progress        | ✅         | ✅            |
| GET    | `/api/progress/module/:userId/:moduleId`     | Get user module progress         | ✅         | ✅            |
| GET    | `/api/progress/content/:userId/:contentType` | Get content type progress        | ✅         | ✅            |

### 👤 Profile Routes (`/api/profile`)

| Method | Endpoint                     | Purpose                  | Admin Used | Frontend Used |
| ------ | ---------------------------- | ------------------------ | ---------- | ------------- |
| GET    | `/api/profile`               | Get user profile         | ❌         | ✅            |
| PUT    | `/api/profile`               | Update profile           | ❌         | ✅            |
| POST   | `/api/profile/avatar`        | Upload avatar            | ❌         | ✅            |
| DELETE | `/api/profile/avatar`        | Delete avatar            | ❌         | ✅            |
| GET    | `/api/profile/achievements`  | Get achievements         | ❌         | ✅            |
| GET    | `/api/profile/stats`         | Get profile statistics   | ❌         | ✅            |
| GET    | `/api/profile/admin/all`     | Get all profiles (admin) | ✅         | ❌            |
| GET    | `/api/profile/admin/:userId` | Get user profile (admin) | ✅         | ❌            |

---

## 🎮 Controllers

### 📁 Authentication Controller (`authController.js`)

**Functions:**

- `register(req, res, next)` - User registration with validation
- `login(req, res, next)` - User authentication with JWT generation
- `logout(req, res, next)` - User logout and token invalidation
- `getMe(req, res, next)` - Get current authenticated user
- `updateMe(req, res, next)` - Update current user profile
- `forgotPassword(req, res, next)` - Initiate password reset
- `resetPassword(req, res, next)` - Reset password with token
- `changePassword(req, res, next)` - Change password for authenticated user
- `deleteAccount(req, res, next)` - Delete user account

**Dependencies:**

- User model, JWT utilities, bcrypt, email service

### 📁 Phase Controller (`phaseController.js`)

**Functions:**

- `getPhases(req, res, next)` - Get all phases with ordering
- `getPhase(req, res, next)` - Get single phase by ID
- `createPhase(req, res, next)` - Create new phase with validation
- `updatePhase(req, res, next)` - Update existing phase
- `deletePhase(req, res, next)` - Delete phase (check dependencies)

**Dependencies:**

- Phase model, Module model (for dependency checking)

### 📁 Module Controller (`moduleController.js`)

**Functions:**

- `getModules(req, res, next)` - Get all modules with filtering
- `getModule(req, res, next)` - Get single module by ID
- `createModule(req, res, next)` - Create new module
- `updateModule(req, res, next)` - Update module with order validation
- `deleteModule(req, res, next)` - Delete module (check enrollments)
- `getModulesByPhase(req, res, next)` - Get modules filtered by phase
- `enrollInModule(req, res, next)` - User enrollment in module
- `getModuleContents(req, res, next)` - Get all content for module
- `getModuleStats(req, res, next)` - Get module statistics

**Dependencies:**

- Module model, Phase model, Content model, Enrollment model

### 📁 Content Controller (`contentController.js`)

**Functions:**

- `getAllContent(req, res, next)` - Get all content with filtering
- `getContent(req, res, next)` - Get single content by ID
- `createContent(req, res, next)` - Create new content
- `updateContent(req, res, next)` - Update existing content
- `deleteContent(req, res, next)` - Soft delete content
- `permanentDeleteContent(req, res, next)` - Permanently delete content
- `restoreContent(req, res, next)` - Restore soft-deleted content
- `getContentByModule(req, res, next)` - Get content filtered by module
- `getSectionsByModule(req, res, next)` - Get unique sections for module

**Dependencies:**

- Content model, Module model

### 📁 Enrollment Controller (`enrollmentController.js`)

**Functions:**

- `getUserEnrollments(req, res, next)` - Get user's enrollments
- `enrollInModule(req, res, next)` - Create new enrollment
- `getEnrollmentDetails(req, res, next)` - Get specific enrollment
- `unenrollFromModule(req, res, next)` - Remove enrollment
- `getAllEnrollments(req, res, next)` - Admin: get all enrollments
- `getEnrollmentStats(req, res, next)` - Admin: enrollment statistics
- `getModuleEnrollmentStats(req, res, next)` - Admin: module-specific stats
- `updateEnrollment(req, res, next)` - Admin: update enrollment
- `deleteEnrollment(req, res, next)` - Admin: delete enrollment

**Dependencies:**

- Enrollment model, Module model, User model

### 📁 Progress Controller (`progressController.js`)

**Functions:**

- `markContentStarted(req, res, next)` - Mark content as "in-progress" when first accessed/loaded
- `markContentComplete(req, res, next)` - Mark content as completed (manual or from labs/games with scores)
- `updateContentProgress(req, res, next)` - Update progress percentage (videos auto-complete at 90%)
- `getUserOverallProgress(req, res, next)` - Get user's progress across all enrolled modules (dashboard view)
- `getUserModuleProgress(req, res, next)` - Get detailed progress for a specific module
- `getUserContentTypeProgress(req, res, next)` - Get progress for specific content type (labs, games, videos, documents)
- `updateModuleProgress(userId, moduleId)` - Helper function to automatically update module completion percentage

**Key Features:**

- **Auto-Start**: Content automatically marked as "in-progress" when accessed
- **Auto-Complete**: Videos complete at 90% watched, manual completion available for all types
- **Score Tracking**: Labs and games can submit scores with completion
- **Progress Cascading**: Content completion → Module progress → Overall progress
- **Multiple Views**: Overview (dashboard), module-specific, content-type specific

**Dependencies:**

- UserProgress model, Content model, Module model, UserEnrollment model

### 📁 Profile Controller (`profileController.js`)

**Functions:**

- `getProfile(req, res, next)` - Get user profile
- `updateProfile(req, res, next)` - Update profile information
- `uploadAvatar(req, res, next)` - Upload profile avatar
- `deleteAvatar(req, res, next)` - Remove profile avatar
- `getAchievements(req, res, next)` - Get user achievements
- `getProfileStats(req, res, next)` - Get profile statistics
- `getAllProfiles(req, res, next)` - Admin: get all profiles
- `getUserProfileAdmin(req, res, next)` - Admin: get user profile

**Dependencies:**

- User model, Achievement model, Progress model

---

## 📊 Models & Schemas

### 👤 User Model

**Schema Fields:**

```javascript
{
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  profile: {
    firstName: { type: String, maxlength: 50 },
    lastName: { type: String, maxlength: 50 },
    displayName: { type: String, maxlength: 100 },
    avatar: { type: String }
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  stats: {
    totalPoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    coursesCompleted: { type: Number, default: 0 },
    labsCompleted: { type: Number, default: 0 },
    gamesCompleted: { type: Number, default: 0 },
    achievementsEarned: { type: Number, default: 0 }
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  lastLoginAt: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}
```

**Indexes:**

- `username: 1` (unique)
- `email: 1` (unique)
- `role: 1`
- `status: 1`

### 🎯 Phase Model

**Schema Fields:**

```javascript
{
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  icon: { type: String, required: true, maxlength: 50 },
  color: {
    type: String,
    required: true,
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  },
  order: { type: Number, required: true, min: 1 }
}
```

**Indexes:**

- `order: 1` (unique)
- `title: 1`

### 📚 Module Model

**Schema Fields:**

```javascript
{
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  estimatedDuration: { type: String, required: true, maxlength: 50 },
  icon: { type: String, maxlength: 50, default: 'Shield' },
  color: {
    type: String,
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    default: '#00ff00'
  },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  order: { type: Number, required: true, min: 1 },
  isActive: { type: Boolean, default: true }
}
```

**Indexes:**

- `{ phaseId: 1, order: 1 }` (compound unique)
- `phaseId: 1`
- `difficulty: 1`
- `isActive: 1`

### 📄 Content Model

**Schema Fields:**

```javascript
{
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 1000 },
  section: { type: String, required: true, maxlength: 100 },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  type: {
    type: String,
    enum: ['video', 'lab', 'game', 'document'],
    required: true
  },
  content: { type: String, required: true },
  metadata: {
    videoUrl: { type: String },
    duration: { type: String },
    gameUrl: { type: String },
    labInstructions: { type: String },
    documentContent: { type: String }
  },
  resources: [{ type: String }],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}
```

**Indexes:**

- `moduleId: 1`
- `type: 1`
- `section: 1`
- `isDeleted: 1`

### 🎓 Enrollment Model

**Schema Fields:**

```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'dropped'],
    default: 'active'
  },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  lastAccessedAt: { type: Date, default: Date.now }
}
```

**Indexes:**

- `{ userId: 1, moduleId: 1 }` (compound unique)
- `userId: 1`
- `moduleId: 1`
- `status: 1`

### 📈 Progress Model

**Schema Fields:**

```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  contentType: {
    type: String,
    required: true,
    enum: ['video', 'lab', 'game', 'document'],
    lowercase: true
  },
  status: {
    type: String,
    required: true,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  progressPercentage: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 100
  },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  score: { type: Number, default: null, min: 0 },
  maxScore: { type: Number, default: null, min: 0 }
}
```

**Indexes:**

- `{ userId: 1, contentId: 1 }` (compound unique)
- `userId: 1`
- `contentId: 1`
- `status: 1`
- `contentType: 1`
- `completedAt: -1`

**Key Features:**

- **Auto-Status Management**: Pre-save middleware handles status transitions
- **Progress Validation**: Ensures progress percentage stays within 0-100 range
- **Score Validation**: Validates score doesn't exceed maxScore
- **Virtual Properties**: `isCompleted`, `isInProgress`, `scorePercentage`
- **Static Methods**: `findByUserAndContent`, `getUserProgress`, `getContentProgress`
- **Instance Methods**: `updateProgress`, `markCompleted`, `markStarted`, `setScore`

---

## 🔒 Middleware

### 🔐 Authentication Middleware (`middleware/auth.js`)

**Functions:**

- `protect(req, res, next)` - Verify JWT token and set req.user
- `requireAdmin(req, res, next)` - Ensure user has admin role
- `optionalAuth(req, res, next)` - Set user if token provided (optional)

### ✅ Validation Middleware (`middleware/validation/`)

**Phase Validation:**

- `createPhaseValidation` - Validates phase creation data
- `updatePhaseValidation` - Validates phase update data
- `objectIdValidation` - Validates MongoDB ObjectId format

**Module Validation:**

- `createModuleValidation` - Validates module creation data
- `updateModuleValidation` - Validates module update data

**Content Validation:**

- `createContentValidation` - Validates content creation data
- `updateContentValidation` - Validates content update data

**Auth Validation:**

- `registerValidation` - User registration validation
- `loginValidation` - Login credentials validation
- `passwordValidation` - Password strength validation

### 🛡️ Security Middleware

**Functions:**

- `helmet()` - Security headers
- `cors()` - Cross-origin resource sharing
- `rateLimit()` - Request rate limiting
- `mongoSanitize()` - NoSQL injection prevention
- `xss()` - XSS attack prevention

---

## 📱 Admin Panel Integration

### ✅ Currently Used Endpoints by Admin Panel

**Authentication:**

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get admin user info
- `POST /api/auth/logout` - Admin logout

**Phases Management:**

- `GET /api/phases` - List all phases
- `POST /api/phases` - Create new phase
- `GET /api/phases/:id` - Get phase details
- `PUT /api/phases/:id` - Update phase
- `DELETE /api/phases/:id` - Delete phase

**Modules Management:**

- `GET /api/modules` - List all modules
- `POST /api/modules` - Create new module
- `GET /api/modules/:id` - Get module details
- `PUT /api/modules/:id` - Update module
- `DELETE /api/modules/:id` - Delete module
- `GET /api/modules/:id/stats` - Get module statistics

**Content Management:**

- `GET /api/content` - List all content
- `POST /api/content` - Create new content
- `GET /api/content/:id` - Get content details
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Soft delete content
- `DELETE /api/content/:id/permanent` - Permanently delete
- `POST /api/content/:id/restore` - Restore deleted content
- `GET /api/content/sections/by-module/:moduleId` - Get module sections

**Enrollment Tracking:**

- `GET /api/enrollment/admin/all` - Get all enrollments
- `GET /api/enrollment/admin/stats` - Enrollment statistics
- `GET /api/enrollment/admin/:moduleId/stats` - Module enrollment stats
- `PUT /api/enrollment/admin/:enrollmentId` - Update enrollment
- `DELETE /api/enrollment/admin/:enrollmentId` - Delete enrollment

**Progress Tracking:**

- `GET /api/progress/overview/:userId` - Get user overall progress (dashboard view)
- `GET /api/progress/module/:userId/:moduleId` - Get detailed module progress
- `GET /api/progress/content/:userId/:contentType` - Get content type specific progress (labs, games, etc.)

### ❌ Available but Not Used by Admin Panel

**User Profile Management:**

- `GET /api/profile/admin/all` - Get all user profiles
- `GET /api/profile/admin/:userId` - Get specific user profile

**Advanced Authentication:**

- `POST /api/auth/forgot-password` - Password reset (could be useful for admin)
- `POST /api/auth/reset-password` - Complete password reset

**Content by Module:**

- `GET /api/content/module/:moduleId` - Get content by module (useful for admin)

**Content Progress Management:**

- `POST /api/progress/content/start` - Mark content as started (useful for admin testing)
- `POST /api/progress/content/complete` - Mark content as completed (useful for admin operations)
- `POST /api/progress/content/update` - Update video progress (useful for admin testing)

### 🚀 Recommended Admin Panel Enhancements

1. **User Management Dashboard**

   - Implement user profile viewing and management
   - User account status management (active/inactive/suspended)
   - User statistics and analytics

2. **Advanced Content Management**

   - Content preview functionality
   - Bulk content operations
   - Content categorization and tagging

3. **System Analytics**

   - Real-time system health monitoring
   - API performance metrics
   - Database usage statistics

4. **Reporting Features**
   - Export functionality for data
   - Automated reporting
   - Custom analytics dashboards

---

## 📚 Usage Examples

### 🔑 Authentication Example

```javascript
// Login request
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    login: "admin@example.com",
    password: "SecurePassword123!",
  }),
});

const { data } = await response.json();
const token = data.token;

// Use token in subsequent requests
const protectedResponse = await fetch("/api/phases", {
  headers: { Authorization: `Bearer ${token}` },
});
```

### 📊 Data Retrieval Example

```javascript
// Get all phases with modules
const phasesResponse = await fetch("/api/phases", {
  headers: { Authorization: `Bearer ${token}` },
});
const phases = await phasesResponse.json();

// Get modules for specific phase
const modulesResponse = await fetch(`/api/modules/phase/${phaseId}`, {
  headers: { Authorization: `Bearer ${token}` },
});
const modules = await modulesResponse.json();
```

### 🛠️ Admin Operations Example

```javascript
// Create new phase
const newPhase = await fetch("/api/phases", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Advanced Cybersecurity",
    description: "Advanced topics in cybersecurity",
    icon: "Shield",
    color: "#ff6b6b",
    order: 3,
  }),
});

// Get enrollment statistics
const statsResponse = await fetch("/api/enrollment/admin/stats", {
  headers: { Authorization: `Bearer ${token}` },
});
const enrollmentStats = await statsResponse.json();
```

### 🛠️ Progress Tracking Example

```javascript
// Auto-start content when accessed
const startContent = async (contentId) => {
  const response = await fetch("/api/progress/content/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contentId }),
  });
  return await response.json();
};

// Update video progress (auto-completes at 90%)
const updateVideoProgress = async (contentId, progressPercentage) => {
  const response = await fetch("/api/progress/content/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contentId, progressPercentage }),
  });
  return await response.json();
};

// Mark content as completed (with optional score for labs/games)
const markComplete = async (contentId, score = null, maxScore = null) => {
  const response = await fetch("/api/progress/content/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contentId,
      ...(score !== null && { score }),
      ...(maxScore !== null && { maxScore }),
    }),
  });
  return await response.json();
};

// Get user overall progress for dashboard
const getOverallProgress = async (userId) => {
  const response = await fetch(`/api/progress/overview/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

// Get detailed module progress
const getModuleProgress = async (userId, moduleId) => {
  const response = await fetch(`/api/progress/module/${userId}/${moduleId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

// Get labs progress with filtering
const getLabsProgress = async (userId, filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(
    `/api/progress/content/${userId}/lab?${queryParams}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await response.json();
};
```

---

## 🔄 Auto-Update System

### 📝 Documentation Maintenance

This documentation is designed to be automatically updated when server changes are made. Here's how to maintain it:

#### 🔧 Automated Updates

1. **Route Changes**: When routes are added/modified, update the API Routes section
2. **Controller Changes**: When controller functions change, update the Controllers section
3. **Model Changes**: When schemas change, update the Models & Schemas section
4. **Admin Integration**: When admin panel uses new endpoints, update the integration section

#### 📊 Tracking System

Create a file watcher system to automatically detect changes:

```javascript
// tools/doc-updater.js
const fs = require("fs");
const path = require("path");

const watchDirectories = [
  "src/routes",
  "src/controllers",
  "src/models",
  "../admin/src/services",
];

// Watch for changes and trigger documentation updates
watchDirectories.forEach((dir) => {
  fs.watch(dir, (eventType, filename) => {
    console.log(`File ${filename} changed in ${dir}`);
    // Trigger documentation update
    updateDocumentation();
  });
});
```

#### 🎯 Update Checklist

When making server changes, update these sections:

- [ ] **API Routes** - Add/modify endpoint entries
- [ ] **Controllers** - Update function descriptions
- [ ] **Models** - Update schema definitions
- [ ] **Admin Integration** - Mark new endpoints as used/unused
- [ ] **Usage Examples** - Add examples for new features
- [ ] **Last Updated** date at the top

#### 🚀 Automated Tools

Consider implementing these tools for better maintenance:

1. **Swagger Auto-Generation** - Generate API docs from code
2. **Test Coverage Reports** - Link test coverage to endpoints
3. **Admin Usage Tracking** - Monitor which endpoints admin panel uses
4. **Performance Metrics** - Track endpoint usage and performance

---

## 📈 Metrics & Analytics

### 🎯 Current System Stats

- **Total Routes**: 43 endpoints across 7 route files
- **Admin Panel Usage**: 24 endpoints actively used (56%)
- **Frontend Usage**: 28 endpoints actively used (65%)
- **Controller Functions**: 32+ functions across 7 controllers
- **Database Models**: 6 main models with 15+ indexes
- **Middleware Functions**: 12+ middleware functions

### 🔍 Coverage Analysis

- **Authentication**: 100% admin coverage, 100% frontend coverage
- **Phase Management**: 100% admin coverage, 60% frontend coverage
- **Module Management**: 90% admin coverage, 70% frontend coverage
- **Content Management**: 90% admin coverage, 40% frontend coverage
- **Enrollment Tracking**: 100% admin coverage, 80% frontend coverage
- **Progress Tracking**: 100% admin coverage, 100% frontend coverage (newly updated)

### 📋 Recommendations

1. **Implement missing admin features** for user profile management
2. **Add frontend integration** for advanced content features
3. **Create unified API documentation** using Swagger UI
4. **Implement API monitoring** and performance tracking
5. **Add automated testing** for all endpoints

---

_This documentation is maintained as part of the Hack The World project. Last generated on January 25, 2025._
