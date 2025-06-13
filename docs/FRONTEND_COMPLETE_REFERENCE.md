# Hack The World - Complete Frontend Reference Guide

## 🎯 Quick Development Reference

**This guide is designed for LLMs and developers to quickly understand and extend the Hack The World frontend systems.**

---

## 📁 Frontend Architecture Overview

### Main Frontend (Student Portal) - React + TypeScript
```
frontend/
├── src/
│   ├── App.tsx                     # Main app component with routing
│   ├── main.tsx                   # App entry point, Redux store setup
│   ├── index.css                  # Global styles, Tailwind imports
│   ├── vite-env.d.ts             # TypeScript environment definitions
│   │
│   ├── app/
│   │   └── store.ts              # Redux Toolkit store configuration
│   │
│   ├── features/                  # Redux Toolkit Query API slices
│   │   ├── api/
│   │   │   └── apiSlice.ts       # Main RTK Query API setup, all endpoints
│   │   └── auth/
│   │       ├── authApi.ts        # Authentication endpoints & types
│   │       └── authSlice.ts      # Auth state management
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuthRTK.ts         # Authentication hook with RTK Query
│   │   ├── useProgressTracking.ts # Progress tracking utilities  
│   │   └── use-mobile.ts         # Mobile detection hook
│   │
│   ├── lib/                       # Utilities and data
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── utils.ts              # General utility functions
│   │   ├── constants.ts          # App constants and configurations
│   │   ├── courseUtils.ts        # Course-related utility functions
│   │   ├── coursesData.ts        # Static course data
│   │   ├── gameData.ts           # Game configurations and data
│   │   ├── terminalData.ts       # Terminal commands and responses
│   │   ├── userData.ts           # User profile utilities
│   │   ├── progressService.ts    # Progress calculation utilities
│   │   ├── dataTransformers.ts   # Data transformation functions
│   │   ├── pathUtils.ts          # URL and navigation utilities
│   │   ├── security.ts           # Security-related utilities
│   │   ├── helpers.ts            # General helper functions
│   │   └── iconUtils.ts          # Icon mapping and utilities
│   │
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Shadcn/ui components (buttons, dialogs, etc.)
│   │   ├── common/               # Shared components across features
│   │   ├── landing/              # Landing page specific components
│   │   ├── course/               # Course detail page components
│   │   ├── dashboard/            # Learning dashboard components
│   │   ├── enrolled/             # Enrolled course view components
│   │   ├── overview/             # Course overview components
│   │   ├── games/                # Interactive game components
│   │   ├── terminal/             # Terminal interface components
│   │   ├── profile/              # User profile components
│   │   ├── settings/             # Settings page components
│   │   ├── effects/              # Visual effects (Matrix rain, typewriter)
│   │   ├── debug/                # Development/debug components
│   │   └── layout/               # Layout wrapper components
│   │
│   └── pages/                    # Main page components
│       ├── LandingPage.tsx       # Public homepage
│       ├── LoginPage.tsx         # User authentication
│       ├── SignupPage.tsx        # User registration
│       ├── Dashboard.tsx         # Main learning dashboard
│       ├── CourseDetailPage.tsx  # Course information and enrollment
│       ├── EnrolledCoursePage.tsx # Enrolled course content viewer
│       ├── ProfilePage.tsx       # User profile management
│       ├── SettingsPage.tsx      # User settings
│       ├── GamePage.tsx          # Standalone game interface
│       ├── LabPage.tsx           # Lab environment
│       ├── TerminalLab.tsx       # Terminal-based lab
│       ├── WebSecLab.tsx         # Web security lab
│       ├── SocialEngLab.tsx      # Social engineering lab
│       ├── ForgotPasswordPage.tsx # Password reset
│       ├── ResetPasswordPage.tsx # Password reset confirmation
│       ├── AboutPage.tsx         # About page
│       ├── PricingPage.tsx       # Pricing information
│       ├── NotFoundPage.tsx      # 404 error page
│       └── CyberSecOverview.tsx  # Cybersecurity overview
│
├── public/                       # Static assets
├── dist/                        # Built application
├── package.json                 # Dependencies and scripts
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── components.json             # Shadcn/ui configuration
```

### Admin Frontend - React + JavaScript
```
admin/
├── src/
│   ├── App.jsx                   # Main admin app component
│   ├── main.jsx                 # App entry point
│   ├── index.css                # Global admin styles
│   │
│   ├── services/
│   │   └── api.js               # Axios-based API client, all admin endpoints
│   │
│   ├── context/
│   │   └── AuthContext.jsx      # Admin authentication context
│   │
│   └── components/              # Admin-specific components
│       ├── Layout.jsx           # Admin layout wrapper
│       ├── Login.jsx            # Admin login
│       ├── Register.jsx         # Admin registration  
│       ├── Dashboard.jsx        # Admin dashboard
│       ├── PhasesManager.jsx    # Phase management interface
│       ├── ModulesManagerEnhanced.jsx # Module management
│       ├── ContentManager.jsx   # Content management
│       ├── ContentDetailView.jsx # Content editing interface
│       ├── EnrollmentTrackingPage.jsx # Enrollment oversight
│       ├── MyEnrollments.jsx    # Admin enrollment view
│       ├── MyLabs.jsx           # Admin lab management
│       ├── MyGames.jsx          # Admin game management
│       └── *DetailView.jsx     # Various detail view components
│
├── package.json                 # Admin dependencies
├── vite.config.js              # Admin Vite configuration
└── eslint.config.js            # Admin ESLint configuration
```

---

## 🔧 Core Technologies & Architecture

### Main Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Redux Toolkit Query (RTK Query)** for API state management
- **TailwindCSS** for styling with custom design system
- **Shadcn/ui** for consistent UI components
- **React Router** for client-side routing
- **Framer Motion** for animations (planned)

### Admin Frontend Stack  
- **React 18** with JavaScript (simpler admin needs)
- **Vite** for building
- **Axios** for API calls with interceptors
- **Context API** for state management
- **TailwindCSS** for styling

---

## 🗂️ State Management & API Integration

### RTK Query Setup (`/src/features/api/apiSlice.ts`)
**Purpose**: Centralized API management with caching, invalidation, and loading states

```typescript
// Base Configuration
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('hackToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Phase', 'Module', 'Content', 'Enrollment', 'Progress'],
  endpoints: (builder) => ({
    // All API endpoints defined here
  })
});

// Cache Invalidation Strategy
- User actions invalidate ['User'] tags
- Content changes invalidate ['Content', 'Module'] tags  
- Enrollment changes invalidate ['Enrollment', 'Progress'] tags
- Progress updates invalidate ['Progress', 'Enrollment'] tags
```

### Authentication State (`/src/features/auth/authSlice.ts`)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Key Actions
- setCredentials(user, token) // Login success
- clearCredentials() // Logout
- updateUser(userData) // Profile updates
```

### Custom Hooks

#### `useAuthRTK` (`/src/hooks/useAuthRTK.ts`)
**Purpose**: Simplified authentication hook with RTK Query integration

```typescript
export const useAuthRTK = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector(state => state.auth);
  
  return {
    user,
    token, 
    isAuthenticated,
    login: (credentials) => dispatch(authApi.endpoints.login.initiate(credentials)),
    logout: () => dispatch(clearCredentials()),
    updateProfile: (data) => dispatch(authApi.endpoints.updateProfile.initiate(data))
  };
};
```

#### `useProgressTracking` (`/src/hooks/useProgressTracking.ts`)
**Purpose**: Progress tracking utilities and calculations

```typescript
export const useProgressTracking = () => {
  return {
    markContentComplete: (contentId, score?) => // Mark content as done
    updateProgress: (contentId, percentage) => // Update progress percentage
    calculateModuleProgress: (moduleId) => // Calculate overall module progress
    getContentProgress: (contentId) => // Get specific content progress
  };
};
```

---

## 🎨 Component Architecture

### Component Categories

#### 1. **UI Components (`/src/components/ui/`)**
**Purpose**: Reusable, unstyled components from Shadcn/ui
- `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, etc.
- Consistent design system across the app
- Customizable with Tailwind variants

#### 2. **Common Components (`/src/components/common/`)**
**Purpose**: Shared components used across features

```typescript
// AuthLoader.tsx - Loading state for authentication
export const AuthLoader = () => // Shows loading spinner during auth checks

// ProtectedRoute.tsx - Route protection wrapper  
export const ProtectedRoute = ({ children }) => // Redirects to login if not authenticated

// Header.tsx - Main navigation header
export const Header = () => // Logo, navigation, user menu

// ProgressBar.tsx - Reusable progress indicator
export const ProgressBar = ({ value, max }) => // Animated progress display

// ErrorBoundary.tsx - Error handling wrapper
export const ErrorBoundary = ({ children }) => // Catches and displays React errors
```

#### 3. **Landing Components (`/src/components/landing/`)**
**Purpose**: Homepage and marketing components

```typescript
// HeroSection.tsx - Main landing hero
export const HeroSection = () => // Cyberpunk-themed hero with CTA

// FeaturesSection.tsx - Feature showcase
export const FeaturesSection = () => // Interactive learning features

// HackerChallenges.tsx - Challenge previews
export const HackerChallenges = () => // Sample challenges and games

// CTASection.tsx - Call-to-action
export const CTASection = () => // Sign up encouragement

// Footer.tsx - Site footer
export const Footer = () => // Links, contact, social media
```

#### 4. **Course Components (`/src/components/course/`)**
**Purpose**: Course detail and enrollment flow

```typescript
// CourseHero.tsx - Course introduction
export const CourseHero = ({ module }) => // Course title, description, stats

// CourseInfoSidebar.tsx - Course metadata
export const CourseInfoSidebar = ({ module }) => // Duration, difficulty, topics

// EnrollmentButton.tsx - Enrollment action
export const EnrollmentButton = ({ moduleId, isEnrolled }) => // Enroll/unenroll logic

// CourseTabsContainer.tsx - Course content tabs
export const CourseTabsContainer = ({ module }) => // Overview, curriculum, labs, games

// Tabs:
// - OverviewTab.tsx - Course overview and description
// - CurriculumTab.tsx - Learning path and content structure  
// - LabsTab.tsx - Hands-on lab exercises
// - GamesTab.tsx - Interactive challenges
// - AssetsTab.tsx - Downloadable resources
```

#### 5. **Dashboard Components (`/src/components/dashboard/`) - Enhanced Retro Design**
**Purpose**: Main learning dashboard interface with cybersecurity terminal aesthetic

```typescript
// LearningDashboard.tsx - Main dashboard layout with retro styling
export const LearningDashboard = () => {
  // Features: Terminal-style headers, retro progress cards, scanline effects
  // Design: CyberSecOverview-inspired styling with green matrix theme
  // Components: Circular progress, retro stats grid, glitch animations
  // Real API integration for enrollment and progress data
}

// DashboardTabs.tsx - Main navigation tabs with tree structure
export const DashboardTabs = () => {
  // Features: Terminal-style tabs, phase-based filtering
  // Design: Retro tab styling with hover effects and active states
  // Integration: Real phases and enrollment data from API
}

// EnhancedProgressTab.tsx - Advanced progress view with retro design
export const EnhancedProgressTab = () => {
  // Features: Tree-structured module timeline, retro phase cards
  // Design: Terminal header paths (~/dashboard/progress/), scanline effects
  // Components: Interactive phase filters, module progress tree
  // Enhanced course discovery section with cyber-themed cards
}

// DashboardLabsTab.tsx - Hands-on laboratories with tree hierarchy  
export const DashboardLabsTab = () => {
  // Features: Phase → Module → Labs structure, expandable tree
  // Design: Terminal file system aesthetic with tree characters (├──, └──)
  // Real data: Generated from enrolled modules and content
}

// DashboardGamesTab.tsx - Interactive games with retro styling
export const DashboardGamesTab = () => {
  // Features: Gamified interface, points tracking, achievement system
  // Design: Retro game card styling with neon borders and effects
  // Organization: Phase-based hierarchy with expandable modules
}

// Retro Design Elements:
// - Scanline effects: bg-gradient-to-b with animate-pulse
// - Glitch borders: opacity-based hover animations
// - Terminal paths: ~/dashboard/section/ formatting
// - Tree structure: ├── and └── characters for hierarchy
// - Color themes: Green matrix, cyan discovery, phase-specific colors
// - Typography: font-mono, uppercase, tracking-wider
```

#### 6. **Enrolled Course Components (`/src/components/enrolled/`)**
**Purpose**: Content consumption interface for enrolled courses

```typescript
// CourseHeader.tsx - Enrolled course header
export const CourseHeader = ({ module, enrollment }) => // Course info + progress

// CourseTabs.tsx - Content navigation
export const CourseTabs = () => // Videos, Labs, Games, Documents tabs

// ContentSidebar.tsx - Content navigation sidebar
export const ContentSidebar = ({ contents, currentContent }) => // Content list with progress

// ContentContainer.tsx - Main content area
export const ContentContainer = ({ content }) => // Displays current content

// Content Type Components:
// - VideoPlayer.tsx - Video content with progress tracking
// - LabContent.tsx - Lab instructions and interface
// - GameContent.tsx - Interactive game wrapper
// - TextContent.tsx - Document/text content reader

// Enhanced Views:
// - EnhancedLabView.tsx - Advanced lab interface with terminal
// - EnhancedGameView.tsx - Full-screen game experience
// - SplitView.tsx - Side-by-side content layout
// - FullScreenContent.tsx - Immersive content experience

// Utility Components:
// - ProgressTracker.tsx - Content progress indicator
// - NavigationControls.tsx - Previous/next content navigation
// - ContentCompletionStatus.tsx - Completion state display
```

#### 7. **Game Components (`/src/components/games/`)**
**Purpose**: Interactive cybersecurity games and challenges

```typescript
// GameSelector.tsx - Game selection interface
export const GameSelector = () => // Choose from available games

// CipherGame.tsx - Cryptography challenge
export const CipherGame = () => // Encrypt/decrypt challenges with scoring

// HashCrackGame.tsx - Password cracking simulation
export const HashCrackGame = () => // Hash cracking with wordlists

// PortScanGame.tsx - Network reconnaissance game
export const PortScanGame = () => // Port scanning simulation with targets
```

#### 8. **Terminal Components (`/src/components/terminal/`)**
**Purpose**: Interactive terminal interface for labs

```typescript
// TerminalWindow.tsx - Terminal emulator
export const TerminalWindow = ({ commands, responses }) => // Full terminal simulation

// LiveTerminal.tsx - Real-time terminal
export const LiveTerminal = () => // Live command execution interface
```

---

## 📱 Page Components & Routing

### Main Pages (`/src/pages/`)

#### Public Pages
```typescript
// LandingPage.tsx - Homepage for unauthenticated users
export const LandingPage = () => {
  // Features: Hero, features, challenges, CTA, footer
  // Marketing-focused, cyberpunk theme
  // Call-to-action for registration
}

// LoginPage.tsx - User authentication
export const LoginPage = () => {
  // Features: Login form, forgot password link, registration link
  // Form validation, loading states, error handling
  // Redirect to dashboard on success
}

// SignupPage.tsx - User registration  
export const SignupPage = () => {
  // Features: Registration form with validation
  // Experience level selection, terms acceptance
  // Email verification flow
}

// ForgotPasswordPage.tsx - Password reset request
export const ForgotPasswordPage = () => {
  // Features: Email input, reset request
  // Success feedback, instructions
}

// ResetPasswordPage.tsx - Password reset confirmation
export const ResetPasswordPage = () => {
  // Features: New password form, token validation
  // Password strength indicator, confirmation
}
```

#### Protected Pages
```typescript
// Dashboard.tsx - Main learning dashboard with retro design
export const Dashboard = () => {
  // Features: Real-time progress tracking, course discovery, retro styling
  // Design: CyberSecOverview-inspired terminal aesthetic
  // API Integration: Live enrollment and progress data from backend
  // Components: LearningDashboard, ProgressOverview, DashboardTabs
  // Enhanced course discovery with filtering and retro cards
}

// CourseDetailPage.tsx - Course information and enrollment
export const CourseDetailPage = () => {
  // Features: Course overview, curriculum, enrollment
  // Detailed course information, prerequisites
  // Enrollment/unenrollment actions
}

// EnrolledCoursePage.tsx - Course content consumption with enhanced loading
export const EnrolledCoursePage = () => {
  // Features: Content player, progress tracking, navigation
  // Video player, lab interface, game integration
  // Content sidebar, progress indicators
  // Enhanced Loading System:
  // - isContentRendering state for tracking render completion
  // - requestAnimationFrame + setTimeout for accurate timing
  // - Loading overlay persists until content fully rendered
  // - Improved user experience with proper loading states
}

// ProfilePage.tsx - User profile management
export const ProfilePage = () => {
  // Features: Profile editing, avatar upload, stats display
  // Personal information, learning progress
  // Achievement gallery, activity history
}

// SettingsPage.tsx - User preferences and account settings
export const SettingsPage = () => {
  // Features: Password change, notification preferences
  // Privacy settings, account deletion
  // Theme preferences (planned)
}
```

#### Lab Pages
```typescript
// LabPage.tsx - General lab interface
export const LabPage = () => {
  // Features: Lab instructions, interactive elements
  // Progress tracking, completion validation
}

// TerminalLab.tsx - Terminal-based exercises
export const TerminalLab = () => {
  // Features: Full terminal emulation, command execution
  // Pre-configured environments, guided exercises
}

// WebSecLab.tsx - Web security testing lab
export const WebSecLab = () => {
  // Features: Vulnerable web app testing
  // XSS, SQL injection, authentication bypass exercises
}

// SocialEngLab.tsx - Social engineering awareness
export const SocialEngLab = () => {
  // Features: Phishing simulations, social engineering scenarios
  // Awareness training, prevention techniques
}
```

### Routing Configuration (`/src/App.tsx`)
```typescript
const router = createBrowserRouter([
  // Public routes
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },
  
  // Protected routes (wrapped with ProtectedRoute)
  { 
    path: '/dashboard', 
    element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
  },
  { 
    path: '/course/:moduleId', 
    element: <ProtectedRoute><CourseDetailPage /></ProtectedRoute> 
  },
  { 
    path: '/enrolled/:moduleId', 
    element: <ProtectedRoute><EnrolledCoursePage /></ProtectedRoute> 
  },
  { 
    path: '/enrolled/:moduleId/content/:contentId', 
    element: <ProtectedRoute><EnrolledCoursePage /></ProtectedRoute> 
  },
  
  // Lab routes
  { path: '/lab/terminal', element: <ProtectedRoute><TerminalLab /></ProtectedRoute> },
  { path: '/lab/websec', element: <ProtectedRoute><WebSecLab /></ProtectedRoute> },
  { path: '/lab/social-eng', element: <ProtectedRoute><SocialEngLab /></ProtectedRoute> },
  
  // Catch-all
  { path: '*', element: <NotFoundPage /> }
]);
```

---

## 🔄 Data Flow & API Integration

### API Endpoints Usage

#### Authentication Flow
```typescript
// Registration
const [register] = useRegisterMutation();
await register({ username, email, password, firstName, lastName, experienceLevel });

// Login  
const [login] = useLoginMutation();
await login({ login: email, password });

// Profile updates
const [updateProfile] = useUpdateProfileMutation();
await updateProfile({ firstName, lastName, bio, location });

// Password change
const [changePassword] = useChangePasswordMutation();
await changePassword({ currentPassword, newPassword });
```

#### Content & Course Data
```typescript
// Get all phases and modules
const { data: phasesWithModules } = useGetModulesWithPhasesQuery();

// Get specific module
const { data: module } = useGetModuleQuery(moduleId);

// Get module content grouped by type
const { data: groupedContent } = useGetContentByModuleGroupedQuery(moduleId);

// Get content with navigation context
const { data: contentWithNav } = useGetContentWithNavigationQuery(contentId);
```

#### Enrollment & Progress
```typescript
// Enroll in module
const [enrollUser] = useEnrollUserMutation();
await enrollUser({ moduleId });

// Check enrollment status
const { data: enrollment } = useGetEnrollmentByModuleQuery(moduleId);

// Update content progress
const [markContentComplete] = useMarkContentCompleteMutation();
await markContentComplete({ contentId, score });

// Get user's overall progress
const { data: progress } = useGetUserOverallProgressQuery(userId);
```

### Data Transformation & Utilities

#### Course Utils (`/src/lib/courseUtils.ts`)
```typescript
export const calculateModuleProgress = (enrollment: UserEnrollment): number => {
  // Calculate completion percentage based on sections
}

export const getNextContent = (currentContent: Content, moduleContents: Content[]): Content | null => {
  // Find next content in learning sequence
}

export const formatDuration = (minutes: number): string => {
  // Convert minutes to "2h 30m" format
}

export const getDifficultyColor = (difficulty: string): string => {
  // Return Tailwind color class for difficulty level
}
```

#### Progress Service (`/src/lib/progressService.ts`)
```typescript
export const ProgressService = {
  calculateOverallProgress: (enrollments: UserEnrollment[]) => {
    // Calculate user's overall learning progress
  },
  
  getCompletionStats: (progress: UserProgress[]) => {
    // Generate completion statistics by content type
  },
  
  estimateTimeToCompletion: (enrollment: UserEnrollment, averageRate: number) => {
    // Estimate time remaining based on progress rate
  }
};
```

#### Data Transformers (`/src/lib/dataTransformers.ts`)
```typescript
export const transformModuleForDisplay = (module: Module): DisplayModule => {
  // Transform raw module data for UI display
  // Add computed fields, format data, etc.
}

export const groupContentBySections = (contents: Content[]): GroupedContent => {
  // Group content items by section for organized display
}

export const transformProgressForChart = (progress: UserProgress[]): ChartData => {
  // Transform progress data for chart visualization
}
```

---

## 🎮 Interactive Features

### Game System

#### Game Architecture
Each game is a self-contained React component with:
- **State management** for game logic
- **Scoring system** with progress tracking
- **Instructions and hints** for guidance
- **Completion validation** and API integration

#### Example: Cipher Game (`/src/components/games/CipherGame.tsx`)
```typescript
export const CipherGame = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  
  const challenges = [
    { cipher: 'Caesar', text: 'KHOOR ZRUOG', answer: 'HELLO WORLD', shift: 3 },
    { cipher: 'Base64', text: 'SGVsbG8gV29ybGQ=', answer: 'Hello World' },
    // More challenges...
  ];
  
  const handleSubmit = async () => {
    const isCorrect = validateAnswer(userAnswer, challenges[currentChallenge].answer);
    if (isCorrect) {
      setScore(prev => prev + 100);
      await markContentComplete({ contentId: gameContentId, score: score + 100 });
    }
    // Move to next challenge or complete game
  };
  
  return (
    <div className="game-container">
      <GameHeader challenge={challenges[currentChallenge]} timeRemaining={timeRemaining} />
      <ChallengeDisplay challenge={challenges[currentChallenge]} />
      <AnswerInput value={userAnswer} onChange={setUserAnswer} />
      <SubmitButton onClick={handleSubmit} />
      <ScoreDisplay score={score} />
    </div>
  );
};
```

### Terminal System

#### Terminal Components
- **TerminalWindow**: Full terminal emulation with command history
- **LiveTerminal**: Real-time command execution interface
- **Command System**: Pre-configured commands and responses

#### Terminal Implementation (`/src/components/terminal/TerminalWindow.tsx`)
```typescript
export const TerminalWindow = ({ commands, onCommand }: TerminalProps) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  
  const executeCommand = async (command: string) => {
    setIsExecuting(true);
    setHistory(prev => [...prev, `$ ${command}`]);
    
    // Process command through terminal data system
    const response = await processTerminalCommand(command);
    setHistory(prev => [...prev, response]);
    
    // Check if command completes lab objective
    if (isLabCompletionCommand(command)) {
      await markContentComplete({ contentId: labContentId });
    }
    
    setIsExecuting(false);
    setCurrentCommand('');
  };
  
  return (
    <div className="terminal-window bg-black text-green-400 font-mono">
      <TerminalHeader />
      <TerminalOutput history={history} />
      <TerminalInput 
        value={currentCommand}
        onChange={setCurrentCommand}
        onExecute={executeCommand}
        disabled={isExecuting}
      />
    </div>
  );
};
```

### Progress Tracking System

#### Real-time Progress Updates
Progress tracking is integrated throughout the frontend:

```typescript
// Video progress tracking
export const VideoPlayer = ({ content }: VideoPlayerProps) => {
  const [updateProgress] = useUpdateContentProgressMutation();
  
  const handleTimeUpdate = useCallback((currentTime: number, duration: number) => {
    const percentage = (currentTime / duration) * 100;
    
    // Update progress every 10% or every 30 seconds
    if (percentage % 10 < 1 || Math.floor(currentTime) % 30 === 0) {
      updateProgress({ contentId: content.id, progressPercentage: percentage });
    }
    
    // Auto-complete at 90%
    if (percentage >= 90 && !content.isCompleted) {
      markContentComplete({ contentId: content.id });
    }
  }, [content.id]);
  
  return (
    <video
      onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget.currentTime, e.currentTarget.duration)}
      // Other props...
    />
  );
};

// Lab completion tracking
export const LabContent = ({ content }: LabContentProps) => {
  const [markComplete] = useMarkContentCompleteMutation();
  
  const handleLabCompletion = async (labResults: LabResults) => {
    await markComplete({ 
      contentId: content.id, 
      score: labResults.score,
      maxScore: labResults.maxScore 
    });
  };
  
  return (
    <div className="lab-container">
      <LabInstructions content={content} />
      <LabInterface onComplete={handleLabCompletion} />
    </div>
  );
};
```

---

## 🎨 Styling & Design System

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cyberpunk theme
        cyber: {
          green: '#00ff41',
          blue: '#0066ff',
          purple: '#8b00ff',
          pink: '#ff0080',
        },
        // Learning progress colors
        progress: {
          not_started: '#6b7280',
          in_progress: '#3b82f6', 
          completed: '#10b981',
        }
      },
      animation: {
        'matrix-rain': 'matrix-rain 2s linear infinite',
        'typewriter': 'typewriter 4s steps(40, end)',
        'glow': 'glow 2s ease-in-out infinite alternate',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
}
```

### Component Variants
Using class-variance-authority (CVA) for consistent styling:

```typescript
// Button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        cyber: "bg-cyber-green text-black hover:bg-cyber-green/80 font-bold",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2", 
        lg: "h-11 px-8",
      }
    }
  }
);
```

### Responsive Design
All components use Tailwind's responsive prefixes:
- `sm:` - 640px and up
- `md:` - 768px and up  
- `lg:` - 1024px and up
- `xl:` - 1280px and up

---

## 🔧 Admin Frontend Architecture

### Admin API Client (`/admin/src/services/api.js`)
```javascript
// Axios configuration with interceptors
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  withCredentials: true,
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods for all admin operations
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const phasesAPI = {
  getAll: () => api.get('/phases'),
  getById: (id) => api.get(`/phases/${id}`),
  create: (data) => api.post('/phases', data),
  update: (id, data) => api.put(`/phases/${id}`, data),
  delete: (id) => api.delete(`/phases/${id}`),
};

// Similar APIs for modules, content, enrollments, progress...
```

### Admin Components

#### Content Management
```jsx
// ContentManager.jsx - Main content management interface
export const ContentManager = () => {
  const [contents, setContents] = useState([]);
  const [filters, setFilters] = useState({ type: 'all', moduleId: null });
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  
  const loadContents = async () => {
    const response = await contentAPI.getAll({ ...filters, ...pagination });
    setContents(response.data.data);
  };
  
  return (
    <div className="content-manager">
      <ContentFilters filters={filters} onChange={setFilters} />
      <ContentList contents={contents} onEdit={handleEdit} onDelete={handleDelete} />
      <ContentPagination pagination={pagination} onChange={setPagination} />
    </div>
  );
};

// ContentDetailView.jsx - Content editing interface
export const ContentDetailView = ({ contentId }) => {
  const [content, setContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = async (contentData) => {
    if (contentId) {
      await contentAPI.update(contentId, contentData);
    } else {
      await contentAPI.create(contentData);
    }
    // Reload and show success message
  };
  
  return (
    <div className="content-detail">
      <ContentForm content={content} onSave={handleSave} />
      <ContentPreview content={content} />
    </div>
  );
};
```

#### Module Management
```jsx
// ModulesManagerEnhanced.jsx - Advanced module management
export const ModulesManagerEnhanced = () => {
  const [modules, setModules] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [draggedModule, setDraggedModule] = useState(null);
  
  const handleReorder = async (phaseId, newOrder) => {
    await modulesAPI.reorderInPhase(phaseId, { moduleOrders: newOrder });
    loadModules(); // Reload to reflect new order
  };
  
  const handleModuleMove = async (moduleId, newPhaseId, newOrder) => {
    await modulesAPI.update(moduleId, { phaseId: newPhaseId, order: newOrder });
    loadModules();
  };
  
  return (
    <div className="modules-manager">
      <PhaseSelector selected={selectedPhase} onChange={setSelectedPhase} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <ModuleList 
          modules={modules}
          onReorder={handleReorder}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </DragDropContext>
      <ModuleCreationModal onSave={handleCreate} />
    </div>
  );
};
```

---

## 🚀 Development Patterns & Best Practices

### Component Development Pattern
```typescript
// 1. Define props interface
interface ComponentProps {
  data: DataType;
  onAction: (id: string) => void;
  className?: string;
}

// 2. Create component with proper typing
export const Component: React.FC<ComponentProps> = ({ 
  data, 
  onAction, 
  className = '' 
}) => {
  // 3. Local state with proper typing
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 4. API integration with RTK Query
  const { data: apiData, isLoading, error: apiError } = useGetDataQuery(data.id);
  const [updateData] = useUpdateDataMutation();
  
  // 5. Event handlers
  const handleAction = useCallback(async () => {
    try {
      setLoading(true);
      await updateData({ id: data.id, ...updates });
      onAction(data.id);
    } catch (err) {
      setError('Action failed');
    } finally {
      setLoading(false);
    }
  }, [data.id, updateData, onAction]);
  
  // 6. Loading and error states
  if (isLoading) return <LoadingSkeleton />;
  if (apiError) return <ErrorState error={apiError} />;
  
  // 7. Render with proper className handling
  return (
    <div className={cn("base-styles", className)}>
      {/* Component content */}
    </div>
  );
};
```

### API Integration Pattern
```typescript
// 1. Define in RTK Query slice
endpoints: (builder) => ({
  getItems: builder.query<ItemsResponse, GetItemsRequest>({
    query: (params) => ({
      url: '/items',
      params,
    }),
    providesTags: ['Items'],
  }),
  
  updateItem: builder.mutation<Item, UpdateItemRequest>({
    query: ({ id, ...data }) => ({
      url: `/items/${id}`,
      method: 'PUT',
      body: data,
    }),
    invalidatesTags: ['Items'],
  }),
})

// 2. Use in components
const { data: items, isLoading, error } = useGetItemsQuery({ page: 1 });
const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
```

### Error Handling Pattern
```typescript
// Global error boundary
export const AppErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('App Error:', error, errorInfo);
        // Send to error reporting service
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// Component-level error handling
const ComponentWithErrorHandling = () => {
  const [error, setError] = useState<string | null>(null);
  
  const handleAsyncAction = async () => {
    try {
      setError(null);
      await riskyAsyncOperation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };
  
  if (error) {
    return <ErrorAlert message={error} onDismiss={() => setError(null)} />;
  }
  
  return <ComponentContent />;
};
```

### Performance Optimization Patterns
```typescript
// 1. Memoization for expensive calculations
const ExpensiveComponent = ({ data }: { data: ComplexData }) => {
  const processedData = useMemo(() => {
    return expensiveDataProcessing(data);
  }, [data]);
  
  return <div>{processedData}</div>;
};

// 2. Callback memoization to prevent unnecessary re-renders
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  
  const handleChildAction = useCallback((id: string) => {
    // Handle action without causing child re-renders
    console.log('Action for:', id);
  }, []); // Empty deps since action doesn't depend on state
  
  return (
    <div>
      <ChildComponent onAction={handleChildAction} />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  );
};

// 3. Component memoization for pure components
const PureChildComponent = React.memo(({ data, onAction }: ChildProps) => {
  return <div onClick={() => onAction(data.id)}>{data.name}</div>;
});

// 4. Lazy loading for code splitting
const LazyGameComponent = lazy(() => import('./components/games/CipherGame'));

const GamePage = () => {
  return (
    <Suspense fallback={<GameLoadingSkeleton />}>
      <LazyGameComponent />
    </Suspense>
  );
};
```

This comprehensive frontend reference provides complete context for rapid development and maintenance of both the main student portal and admin panel interfaces.