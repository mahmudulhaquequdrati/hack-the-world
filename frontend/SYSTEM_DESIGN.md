# 🛡️ Hack The World - Complete System Design

## 📋 Table of Contents

- [🏗️ High-Level Architecture](#high-level-architecture)
- [🗄️ Database Design](#database-design)
- [🔌 API Architecture](#api-architecture)
- [🎨 Frontend Architecture](#frontend-architecture)
- [🔄 Data Flow Patterns](#data-flow-patterns)
- [🔐 Authentication & Security](#authentication--security)
- [📊 System Interactions](#system-interactions)
- [🚀 Extending the System](#extending-the-system)
- [📈 Monitoring & Performance](#monitoring--performance)

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    HACK THE WORLD PLATFORM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   FRONTEND      │    │   BACKEND API   │    │  DATABASE   │  │
│  │   (React SPA)   │◄──►│  (Express.js)   │◄──►│ (MongoDB)   │  │
│  │                 │    │                 │    │             │  │
│  │ • Landing Page  │    │ • REST API      │    │ • Users     │  │
│  │ • Dashboard     │    │ • JWT Auth      │    │ • Phases    │  │
│  │ • Course View   │    │ • Controllers   │    │ • Modules   │  │
│  │ • Lab Interface │    │ • Validation    │    │ • Games     │  │
│  │ • Game Engine   │    │ • Error Handle  │    │ • Labs      │  │
│  │ • Terminal UI   │    │ • Rate Limiting │    │ • Progress  │  │
│  └─────────────────┘    └─────────────────┘    └─────────────┘  │
│           │                       │                       │     │
│           └───────────────────────┼───────────────────────┘     │
│                                   │                             │
│  ┌─────────────────────────────────┼─────────────────────────┐   │
│  │              EXTERNAL SERVICES & TOOLS                   │   │
│  │                                 │                         │   │
│  │ • Email Service (SendGrid)      │ • File Storage (AWS S3) │   │
│  │ • Analytics (Google Analytics)  │ • CDN (CloudFlare)     │   │
│  │ • Monitoring (Sentry)          │ • Docker Containers    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Layers

1. **Presentation Layer** (React Frontend)

   - Component-based UI with cybersecurity theming
   - State management with React Context
   - Real-time updates and progress tracking

2. **API Layer** (Express.js Backend)

   - RESTful API endpoints
   - JWT-based authentication
   - Request validation and sanitization
   - Error handling and logging

3. **Business Logic Layer** (Controllers & Models)

   - User management and progress tracking
   - Course enrollment and completion logic
   - Achievement and gamification systems
   - Assessment and grading algorithms

4. **Data Layer** (MongoDB)
   - Document-based storage
   - Flexible schema for learning content
   - User progress and analytics data
   - File storage for lab resources

---

## 🗄️ Database Design

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      USERS      │     │     PHASES      │     │    MODULES      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ _id (ObjectId)  │     │ _id (ObjectId)  │     │ _id (ObjectId)  │
│ username        │     │ id (String)     │     │ id (String)     │
│ email           │     │ title           │     │ phaseId         │
│ password        │     │ description     │     │ title           │
│ profile {}      │     │ icon            │     │ description     │
│ role            │     │ color           │     │ difficulty      │
│ stats {}        │     │ order           │     │ content {}      │
│ progress {}     │     │ isActive        │     │ courseDetails   │
│ enrollments []  │     └─────────────────┘     │ order           │
│ achievements [] │             │               │ isActive        │
│ preferences {}  │             │               └─────────────────┘
│ security {}     │             │                       │
│ activity {}     │             │                       │
└─────────────────┘             │                       │
         │                      │                       │
         │                      └───────┬───────────────┘
         │                              │
         └──────────────┬─────────────────────────────────────┐
                        │                                     │
         ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
         │     GAMES       │     │      LABS       │     │  ACHIEVEMENTS   │
         ├─────────────────┤     ├─────────────────┤     ├─────────────────┤
         │ _id (ObjectId)  │     │ _id (ObjectId)  │     │ _id (ObjectId)  │
         │ id (String)     │     │ id (String)     │     │ id (String)     │
         │ moduleId        │     │ moduleId        │     │ title           │
         │ name            │     │ name            │     │ description     │
         │ description     │     │ description     │     │ category        │
         │ type            │     │ difficulty      │     │ requirements [] │
         │ difficulty      │     │ duration        │     │ points          │
         │ category        │     │ category        │     │ rarity          │
         │ maxPoints       │     │ objectives []   │     │ icon            │
         │ objectives []   │     │ steps []        │     └─────────────────┘
         │ config {}       │     │ config {}       │
         │ stats {}        │     │ resources {}    │
         └─────────────────┘     │ assessment {}   │
                                │ stats {}        │
                                └─────────────────┘
```

### Data Relationships

```
PHASES (1) ───┬───► MODULES (Many)
              │
              └───► Each Phase contains 5 modules
                   │
MODULES (1) ──┬────► GAMES (Many)
              │
              └────► LABS (Many)
                   │
USERS (1) ────┬────► ENROLLMENTS (Many)
              │
              ├────► PROGRESS (Many)
              │
              ├────► GAME_HISTORY (Many)
              │
              ├────► LAB_HISTORY (Many)
              │
              └────► ACHIEVEMENTS (Many)
```

### Core Schema Patterns

```javascript
// Phase Schema Pattern
{
  id: "beginner|intermediate|advanced",
  title: "Phase Name",
  description: "Phase description",
  icon: "React Icon Name",
  color: "Tailwind Color Class",
  order: Number,
  modules: [ModuleId]  // Virtual population
}

// Module Schema Pattern
{
  id: "unique-module-id",
  phaseId: "beginner|intermediate|advanced",
  title: "Module Title",
  description: "Module description",
  difficulty: "Beginner|Intermediate|Advanced|Expert",
  content: {
    estimatedHours: Number,
    lessonsCount: Number,
    labsCount: Number,
    gamesCount: Number
  },
  courseDetails: {
    price: "Free",
    certification: Boolean,
    rating: Number,
    studentsEnrolled: Number
  }
}

// User Progress Pattern
{
  userId: ObjectId,
  enrollments: [{
    moduleId: String,
    enrolledAt: Date,
    status: "active|completed|paused",
    progress: {
      lessonsCompleted: Number,
      labsCompleted: Number,
      gamesCompleted: Number,
      overallProgress: Number // percentage
    }
  }],
  achievements: [{
    achievementId: String,
    earnedAt: Date,
    progress: Number
  }]
}
```

---

## 🔌 API Architecture

### RESTful Endpoint Structure

```
BASE_URL: http://localhost:5001/api

┌─────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  /auth                                                      │
│  ├── POST   /register      # User registration              │
│  ├── POST   /login         # User authentication           │
│  ├── POST   /refresh       # Token refresh                 │
│  ├── GET    /me            # Current user profile          │
│  ├── POST   /logout        # User logout                   │
│  └── GET    /validate      # Token validation              │
│                                                             │
│  /phases                                                    │
│  ├── GET    /              # Get all phases                │
│  ├── GET    /:id           # Get phase by ID               │
│  ├── GET    /:id/stats     # Phase statistics              │
│  ├── POST   /              # Create phase (admin)          │
│  ├── PUT    /:id           # Update phase (admin)          │
│  └── DELETE /:id           # Delete phase (admin)          │
│                                                             │
│  /modules                                                   │
│  ├── GET    /              # Get all modules               │
│  ├── GET    /:id           # Get module by ID              │
│  ├── GET    /phase/:id     # Get modules by phase          │
│  ├── GET    /categories    # Get module categories         │
│  ├── GET    /:id/stats     # Module statistics             │
│  ├── POST   /:id/enroll    # Enroll in module              │
│  ├── GET    /:id/progress/:userId # Get user progress      │
│  ├── PUT    /:id/progress/:userId # Update progress        │
│  ├── POST   /:id/rate      # Rate module                   │
│  ├── POST   /              # Create module (admin)         │
│  ├── PUT    /:id           # Update module (admin)         │
│  └── DELETE /:id           # Delete module (admin)         │
│                                                             │
│  /games                                                     │
│  ├── GET    /              # Get all games                 │
│  ├── GET    /:id           # Get game by ID                │
│  ├── GET    /module/:id    # Get games by module           │
│  ├── GET    /categories    # Get game categories           │
│  ├── POST   /:id/start     # Start game session           │
│  ├── POST   /:id/submit    # Submit game answer            │
│  ├── POST   /:id/hint      # Get game hint                 │
│  ├── GET    /:id/leaderboard # Game leaderboard            │
│  ├── POST   /              # Create game (admin)           │
│  ├── PUT    /:id           # Update game (admin)           │
│  └── DELETE /:id           # Delete game (admin)           │
│                                                             │
│  /labs                                                      │
│  ├── GET    /              # Get all labs                  │
│  ├── GET    /:id           # Get lab by ID                 │
│  ├── GET    /module/:id    # Get labs by module            │
│  ├── GET    /categories    # Get lab categories            │
│  ├── POST   /:id/start     # Start lab session            │
│  ├── POST   /:id/submit-step # Submit lab step             │
│  ├── POST   /:id/hint      # Get lab hint                  │
│  ├── POST   /:id/reset     # Reset lab environment        │
│  ├── GET    /:id/progress/:userId # Get lab progress       │
│  ├── POST   /              # Create lab (admin)            │
│  ├── PUT    /:id           # Update lab (admin)            │
│  └── DELETE /:id           # Delete lab (admin)            │
│                                                             │
│  /users                                                     │
│  ├── GET    /              # Get all users (admin)         │
│  ├── GET    /:id           # Get user by ID                │
│  ├── GET    /leaderboard   # User leaderboard              │
│  ├── PUT    /:id/profile   # Update user profile           │
│  ├── PUT    /:id/preferences # Update preferences          │
│  ├── GET    /:id/progress  # Get user progress             │
│  ├── GET    /:id/achievements # Get user achievements      │
│  ├── GET    /:id/activity  # Get user activity             │
│  ├── PUT    /:id/role      # Update user role (admin)      │
│  └── DELETE /:id           # Delete user (admin)           │
│                                                             │
│  /achievements                                              │
│  ├── GET    /              # Get all achievements          │
│  ├── GET    /:id           # Get achievement by ID         │
│  ├── GET    /categories    # Achievement categories        │
│  ├── GET    /leaderboard   # Achievement leaderboard       │
│  ├── GET    /user/:userId  # User achievements             │
│  ├── POST   /:id/award     # Award achievement (admin)     │
│  ├── POST   /check/:userId # Check user achievements       │
│  └── GET    /progress/:userId # Achievement progress       │
└─────────────────────────────────────────────────────────────┘
```

### Request/Response Patterns

```javascript
// Standard API Response Format
{
  success: Boolean,
  message: String,
  data: Object,
  errors?: Array,
  pagination?: {
    page: Number,
    limit: Number,
    total: Number,
    pages: Number
  }
}

// Authentication Headers
Headers: {
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}

// Error Response Format
{
  success: false,
  message: "Error description",
  errors: [
    {
      field: "fieldName",
      message: "Field-specific error"
    }
  ]
}
```

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
src/
├── components/
│   ├── common/                 # Shared components
│   │   ├── DifficultyBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StatCard.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   ├── course/                 # Course-related components
│   │   ├── CourseCard.tsx
│   │   ├── CourseDetail.tsx
│   │   ├── EnrollmentButton.tsx
│   │   └── tabs/
│   │       ├── OverviewTab.tsx
│   │       ├── ContentTab.tsx
│   │       └── ReviewsTab.tsx
│   │
│   ├── dashboard/              # Dashboard components
│   │   ├── DashboardStats.tsx
│   │   ├── ProgressOverview.tsx
│   │   ├── RecentActivity.tsx
│   │   └── AchievementsGrid.tsx
│   │
│   ├── enrolled/               # Learning interface
│   │   ├── LearningDashboard.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── AIPlayground.tsx
│   │   └── ProgressTracker.tsx
│   │
│   ├── games/                  # Game components
│   │   ├── GameCard.tsx
│   │   ├── GameEngine.tsx
│   │   ├── ScoreBoard.tsx
│   │   └── GameTimer.tsx
│   │
│   ├── terminal/               # Terminal emulation
│   │   ├── TerminalWindow.tsx
│   │   ├── CommandProcessor.tsx
│   │   └── FileSystem.tsx
│   │
│   ├── effects/                # Visual effects
│   │   ├── MatrixRain.tsx
│   │   ├── TypewriterText.tsx
│   │   └── GlowEffect.tsx
│   │
│   └── ui/                     # Base UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── input.tsx
│
├── pages/                      # Page-level components
│   ├── LandingPage.tsx
│   ├── Dashboard.tsx
│   ├── CourseDetailPage.tsx
│   ├── EnrolledCoursePage.tsx
│   ├── GamePage.tsx
│   └── LabPage.tsx
│
├── lib/                        # Core utilities
│   ├── appData.ts             # SINGLE SOURCE OF TRUTH
│   ├── types.ts               # TypeScript interfaces
│   ├── constants.ts           # App constants
│   ├── api.ts                 # API client
│   └── utils.ts               # Helper functions
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts
│   ├── useProgress.ts
│   ├── useGames.ts
│   └── useTerminal.ts
│
└── context/                    # React Context providers
    ├── AuthContext.tsx
    ├── ThemeContext.tsx
    └── ProgressContext.tsx
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND DATA FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  appData.ts (Single Source of Truth)                       │
│  ├── PHASES: Phase[]                                        │
│  ├── MODULES: Module[]                                      │
│  ├── GAMES: Game[]                                          │
│  ├── LABS: Lab[]                                            │
│  └── ACHIEVEMENTS: Achievement[]                            │
│           │                                                 │
│           ▼                                                 │
│  React Context Providers                                    │
│  ├── AuthContext (user state, login/logout)                │
│  ├── ProgressContext (user progress, enrollments)          │
│  └── ThemeContext (UI theme, preferences)                  │
│           │                                                 │
│           ▼                                                 │
│  Page Components                                            │
│  ├── LandingPage (displays phases/modules)                 │
│  ├── Dashboard (user progress, achievements)               │
│  ├── CourseDetailPage (module details, enrollment)         │
│  ├── EnrolledCoursePage (learning interface)               │
│  ├── GamePage (game engine, scoring)                       │
│  └── LabPage (lab interface, step tracking)                │
│           │                                                 │
│           ▼                                                 │
│  Feature Components                                         │
│  ├── CourseCard (module display)                           │
│  ├── GameEngine (game logic)                               │
│  ├── TerminalWindow (lab interface)                        │
│  ├── ProgressBar (progress tracking)                       │
│  └── AchievementBadge (achievement display)                │
│           │                                                 │
│           ▼                                                 │
│  API Integration (lib/api.ts)                              │
│  ├── GET /api/phases                                        │
│  ├── GET /api/modules                                       │
│  ├── POST /api/auth/login                                   │
│  ├── POST /api/modules/:id/enroll                          │
│  ├── POST /api/games/:id/start                             │
│  └── PUT /api/modules/:id/progress/:userId                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Patterns

### User Authentication Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │   Frontend  │    │   Backend   │    │  Database   │
│             │    │             │    │             │    │             │
├─────────────┤    ├─────────────┤    ├─────────────┤    ├─────────────┤
│             │    │             │    │             │    │             │
│ 1. Login    │───►│ 2. Validate │───►│ 3. Verify   │───►│ 4. Check    │
│ Credentials │    │ Form Data   │    │ Password    │    │ User Exists │
│             │    │             │    │             │    │             │
│ 8. Store    │◄───│ 7. Return   │◄───│ 6. Generate │◄───│ 5. Return   │
│ JWT Token   │    │ JWT Token   │    │ JWT Token   │    │ User Data   │
│             │    │             │    │             │    │             │
│ 9. Include  │───►│ 10. Add to  │───►│ 11. Verify  │───►│ 12. Execute │
│ in Requests │    │ Auth Header │    │ JWT Token   │    │ Protected   │
│             │    │             │    │             │    │ Operation   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Course Enrollment Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Course    │    │   Progress  │    │   User      │
│   Module    │    │   Tracking  │    │   Profile   │
├─────────────┤    ├─────────────┤    ├─────────────┤
│             │    │             │    │             │
│ 1. User     │───►│ 2. Check    │───►│ 3. Verify   │
│ Clicks      │    │ Prerequisites│    │ Completion  │
│ Enroll      │    │             │    │ Status      │
│             │    │             │    │             │
│ 7. Update   │◄───│ 6. Create   │◄───│ 5. Allow    │
│ UI State    │    │ Enrollment  │    │ Enrollment  │
│             │    │ Record      │    │             │
│             │    │             │    │             │
│ 8. Navigate │───►│ 9. Track    │───►│ 10. Update  │
│ to Course   │    │ Progress    │    │ Statistics  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Game Session Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Game     │    │   Session   │    │   Scoring   │    │Achievement  │
│   Engine    │    │   Manager   │    │   System    │    │   System    │
├─────────────┤    ├─────────────┤    ├─────────────┤    ├─────────────┤
│             │    │             │    │             │    │             │
│ 1. Start    │───►│ 2. Create   │───►│ 3. Init     │───►│ 4. Check    │
│ Game        │    │ Session     │    │ Score       │    │ Triggers    │
│             │    │             │    │             │    │             │
│ 5. Process  │───►│ 6. Update   │───►│ 7. Calculate│───►│ 8. Award    │
│ User Input  │    │ Progress    │    │ Points      │    │ Achievements│
│             │    │             │    │             │    │             │
│ 9. End      │───►│ 10. Save    │───►│ 11. Final   │───►│ 12. Update  │
│ Game        │    │ Results     │    │ Score       │    │ User Stats  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 🔐 Authentication & Security

### JWT Authentication Implementation

```javascript
// Backend JWT Generation
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Frontend Token Storage
const authContext = {
  token: localStorage.getItem("jwt_token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const { user, token } = response.data.data;

    localStorage.setItem("jwt_token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setAuthState({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    setAuthState({ user: null, token: null, isAuthenticated: false });
  },
};

// API Request Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend Security                                          │
│  ├── Input Validation (React Hook Form + Zod)              │
│  ├── XSS Protection (DOMPurify)                            │
│  ├── CSRF Protection (SameSite cookies)                    │
│  └── Secure Token Storage (httpOnly cookies option)        │
│                                                             │
│  API Security                                               │
│  ├── Rate Limiting (100 requests/15min per IP)             │
│  ├── Request Validation (express-validator)                │
│  ├── CORS Configuration (specific origins)                 │
│  ├── Security Headers (Helmet.js)                          │
│  └── JWT Token Verification (middleware)                   │
│                                                             │
│  Database Security                                          │
│  ├── Input Sanitization (Mongoose)                         │
│  ├── Password Hashing (bcrypt, 12 rounds)                  │
│  ├── Account Locking (failed login attempts)               │
│  ├── Data Encryption (at rest)                             │
│  └── Connection Security (MongoDB auth)                    │
│                                                             │
│  Infrastructure Security                                    │
│  ├── HTTPS Enforcement (SSL/TLS)                           │
│  ├── Environment Variables (sensitive data)                │
│  ├── Docker Container Security                             │
│  ├── Network Firewall Rules                                │
│  └── Regular Security Audits                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 System Interactions

### Component Communication Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                 COMPONENT COMMUNICATION                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Props Down / Events Up Pattern                             │
│  ┌─────────────────┐                                        │
│  │   Page Level    │ ──props──► ┌─────────────────┐          │
│  │   Component     │            │   Feature       │          │
│  │                 │ ◄─events─  │   Component     │          │
│  └─────────────────┘            └─────────────────┘          │
│                                          │                  │
│                                          ▼                  │
│                                 ┌─────────────────┐          │
│                                 │   Child         │          │
│                                 │   Component     │          │
│                                 └─────────────────┘          │
│                                                             │
│  Context API for Global State                              │
│  ┌─────────────────┐                                        │
│  │  AuthContext    │ ──provides──► ┌─────────────────┐       │
│  │  (User State)   │               │   Any Child     │       │
│  └─────────────────┘               │   Component     │       │
│                                    └─────────────────┘       │
│  ┌─────────────────┐                                        │
│  │ ProgressContext │ ──provides──► ┌─────────────────┐       │
│  │ (Progress Data) │               │   Dashboard     │       │
│  └─────────────────┘               │   Components    │       │
│                                    └─────────────────┘       │
│                                                             │
│  Custom Hooks for Logic                                     │
│  ┌─────────────────┐                                        │
│  │   useAuth()     │ ──returns──► ┌─────────────────┐        │
│  │   useProgress() │              │   Hook State    │        │
│  │   useGames()    │              │   & Functions   │        │
│  └─────────────────┘              └─────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Real-time Updates Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   REAL-TIME UPDATES                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Progress Tracking Flow                                     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   Game      │    │   Progress  │    │   Dashboard │      │
│  │ Component   │    │   Update    │    │   Update    │      │
│  ├─────────────┤    ├─────────────┤    ├─────────────┤      │
│  │             │    │             │    │             │      │
│  │ 1. User     │───►│ 2. API Call │───►│ 3. Context  │      │
│  │ Completes   │    │ PUT /api/   │    │ State       │      │
│  │ Objective   │    │ progress    │    │ Update      │      │
│  │             │    │             │    │             │      │
│  │ 4. Update   │◄───│ 5. Response │◄───│ 6. Notify   │      │
│  │ Local UI    │    │ Success     │    │ Subscribers │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                             │
│  Achievement Notification Flow                              │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ Achievement │    │   Toast     │    │   Badge     │      │
│  │   System    │    │ Notification│    │   Update    │      │
│  ├─────────────┤    ├─────────────┤    ├─────────────┤      │
│  │             │    │             │    │             │      │
│  │ 1. Check    │───►│ 2. Show     │───►│ 3. Update   │      │
│  │ Criteria    │    │ Success     │    │ User        │      │
│  │ Met         │    │ Message     │    │ Profile     │      │
│  │             │    │             │    │             │      │
│  │ 4. Award    │───►│ 5. Animate  │───►│ 6. Persist  │      │
│  │ Points      │    │ Badge       │    │ to DB       │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Extending the System

### Adding New Features

#### 1. Adding a New Model (e.g., Certificate)

```javascript
// server/src/models/Certificate.js
const certificateSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moduleId: {
      type: String,
      required: true,
    },
    certificateType: {
      type: String,
      enum: ["completion", "mastery", "excellence"],
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    verificationCode: {
      type: String,
      unique: true,
      required: true,
    },
    skills: [
      {
        skill: String,
        level: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add to API routes
// server/src/routes/certificates.js
// server/src/controllers/certificatesController.js
```

#### 2. Adding New API Endpoints

```javascript
// server/src/routes/certificates.js
const express = require("express");
const router = express.Router();
const {
  getAllCertificates,
  getCertificateById,
  generateCertificate,
  verifyCertificate,
} = require("../controllers/certificatesController");
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(getAllCertificates).post(protect, generateCertificate);

router.route("/:id").get(getCertificateById);

router.route("/verify/:code").get(verifyCertificate);

module.exports = router;

// Add to main server file
app.use("/api/certificates", certificateRoutes);
```

#### 3. Adding Frontend Components

```typescript
// src/components/certificates/CertificateCard.tsx
interface CertificateProps {
  certificate: Certificate;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
}

const CertificateCard: React.FC<CertificateProps> = ({
  certificate,
  onDownload,
  onShare,
}) => {
  return (
    <div className="bg-white border border-green-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-green-400">
            {certificate.title}
          </h3>
          <p className="text-gray-400">
            Issued on {new Date(certificate.issuedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onDownload(certificate.id)}
            className="px-4 py-2 bg-green-500 text-black rounded"
          >
            Download
          </button>
          <button
            onClick={() => onShare(certificate.id)}
            className="px-4 py-2 border border-green-500 text-green-400 rounded"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
```

#### 4. Updating Data Types

```typescript
// src/lib/types.ts
export interface Certificate {
  id: string;
  userId: string;
  moduleId: string;
  title: string;
  certificateType: "completion" | "mastery" | "excellence";
  issuedAt: string;
  verificationCode: string;
  skills: Array<{
    skill: string;
    level: number;
  }>;
}

// Update User interface
export interface User {
  // ... existing properties
  certificates: Certificate[];
}
```

### Feature Development Workflow

```
1. Design Phase
   ├── Define requirements
   ├── Create database schema
   ├── Plan API endpoints
   └── Design UI components

2. Backend Development
   ├── Create Mongoose model
   ├── Write controller functions
   ├── Create API routes
   ├── Add validation middleware
   └── Write unit tests

3. Frontend Development
   ├── Create TypeScript interfaces
   ├── Build React components
   ├── Add API integration
   ├── Update routing
   └── Style with Tailwind CSS

4. Integration & Testing
   ├── End-to-end testing
   ├── Performance testing
   ├── Security testing
   └── User acceptance testing

5. Deployment
   ├── Update documentation
   ├── Database migrations
   ├── Deploy to staging
   ├── Deploy to production
   └── Monitor performance
```

### Database Migration Strategy

```javascript
// server/src/utils/migrations/addCertificates.js
const migration = {
  version: "1.1.0",
  description: "Add certificates collection and user certificate references",

  async up() {
    // Create certificates collection
    await db.createCollection("certificates");

    // Add certificates array to users
    await db.users.updateMany({}, { $set: { certificates: [] } });

    console.log("Certificates migration completed");
  },

  async down() {
    // Rollback changes
    await db.certificates.drop();
    await db.users.updateMany({}, { $unset: { certificates: 1 } });

    console.log("Certificates migration rolled back");
  },
};

module.exports = migration;
```

---

## 📈 Monitoring & Performance

### Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                 PERFORMANCE OPTIMIZATION                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend Optimization                                      │
│  ├── Code Splitting (React.lazy + Suspense)                │
│  ├── Component Memoization (React.memo, useMemo)           │
│  ├── Virtual Scrolling (large lists)                       │
│  ├── Image Optimization (lazy loading)                     │
│  └── Bundle Size Optimization (tree shaking)               │
│                                                             │
│  Backend Optimization                                       │
│  ├── Database Indexing (compound indexes)                  │
│  ├── Query Optimization (aggregation pipelines)           │
│  ├── Caching Strategy (Redis for sessions)                 │
│  ├── Response Compression (gzip)                           │
│  └── Connection Pooling (MongoDB)                          │
│                                                             │
│  Infrastructure Optimization                               │
│  ├── CDN for Static Assets (CloudFlare)                    │
│  ├── Load Balancing (multiple server instances)           │
│  ├── Database Sharding (user-based)                        │
│  ├── Container Optimization (Docker)                       │
│  └── Monitoring & Alerting (Sentry, DataDog)              │
└─────────────────────────────────────────────────────────────┘
```

### Monitoring Dashboard

```javascript
// Monitoring endpoints
app.get("/metrics", (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    database: {
      connections: mongoose.connection.readyState,
      collections: Object.keys(mongoose.connection.collections),
    },
    api: {
      totalRequests: requestCounter,
      averageResponseTime: averageResponseTime,
      errorRate: errorRate,
    },
  });
});

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }

    // Update metrics
    updateApiMetrics(req.path, duration, res.statusCode);
  });

  next();
};
```

---

## 🔧 Development Environment Setup

### Quick Start Guide

```bash
# 1. Clone repository
git clone <repository-url>
cd hack-the-world

# 2. Backend setup
cd server
cp env.example .env
# Edit .env with your configuration
pnpm install
pnpm dev

# 3. Frontend setup (new terminal)
cd ../src
pnpm install
pnpm dev

# 4. Database setup
# Start MongoDB
# Run seed script
cd server
pnpm run seed
```

### Environment Configuration

```env
# server/.env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/hack-the-world
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Project Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"cd server && pnpm dev\" \"cd src && pnpm dev\"",
    "build": "cd src && pnpm build",
    "test": "cd server && pnpm test && cd ../src && pnpm test",
    "seed": "cd server && pnpm run seed",
    "deploy": "cd src && pnpm build && cd ../server && pnpm start"
  }
}
```

---

## 📚 API Documentation

### Swagger/OpenAPI Integration

The API includes comprehensive Swagger documentation available at:

- Development: `http://localhost:5001/api/docs`
- Interactive testing with "Try it out" functionality
- Complete schema definitions and examples
- Authentication testing capabilities

### Key Integration Points

1. **Authentication**: All protected endpoints require JWT token
2. **Pagination**: List endpoints support page/limit parameters
3. **Filtering**: Search and filter capabilities across all entities
4. **Validation**: Comprehensive input validation with error responses
5. **Error Handling**: Consistent error response format across all endpoints

---

This system design provides a complete blueprint for developing and extending the Hack The World cybersecurity learning platform. Each component is designed to be modular, scalable, and maintainable, following modern best practices for full-stack development.
