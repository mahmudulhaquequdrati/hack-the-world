# API Reference - Hack The World

## 📋 Overview

This document provides comprehensive reference for all data structures, interfaces, utility functions, and type definitions used throughout the Hack The World platform.

## 🏗️ Core Data Structures

### Phase System

```typescript
interface Phase {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  color: string;
  icon: React.ComponentType;
  courses: Course[];
  estimatedHours: number;
  prerequisites?: string[];
}
```

### Course Structure

```typescript
interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  instructor: string;
  rating: number;
  enrollmentCount: number;
  skills: string[];
  content: Content[];
  labs?: Lab[];
  games?: Game[];
  progress?: CourseProgress;
}

interface Content {
  id: number;
  type: "video" | "text" | "interactive" | "assessment";
  title: string;
  duration?: string;
  videoUrl?: string;
  textContent?: string;
  interactiveComponent?: string;
  completed?: boolean;
}
```

### User Progress System

```typescript
interface UserProgress {
  totalCourses: number;
  completedCourses: number;
  currentCourse?: Course;
  overallProgress: number;
  timeSpent: number;
  achievements: Achievement[];
  skillLevels: Record<string, number>;
  enrolledCourses: Course[];
}

interface CourseProgress {
  courseId: number;
  progress: number;
  completedContent: number[];
  timeSpent: number;
  lastAccessed: Date;
  currentContentId?: number;
}
```

### Achievement System

```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  condition: string;
  points: number;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  unlocked: boolean;
  unlockedAt?: Date;
}

type AchievementCategory =
  | "First Steps"
  | "Course Completion"
  | "Skill Mastery"
  | "Speed Learning"
  | "Exploration"
  | "Community"
  | "Special Events"
  | "Elite Status";
```

### Interactive Components

```typescript
interface Lab {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  environment: "browser" | "virtual-machine" | "sandbox";
  objectives: string[];
  tools: string[];
  scenario: string;
  completed?: boolean;
}

interface Game {
  id: number;
  title: string;
  description: string;
  type: "quiz" | "simulation" | "puzzle" | "scenario";
  difficulty: "Easy" | "Medium" | "Hard";
  playTime: string;
  maxScore: number;
  userScore?: number;
  completed?: boolean;
}
```

## 🔧 Utility Functions

### Data Management (`src/lib/appData.ts`)

```typescript
// Core data retrieval functions
export const getAllPhases = (): Phase[] => PHASES_DATA;
export const getPhaseById = (id: number): Phase | undefined;
export const getCourseById = (courseId: number): Course | undefined;
export const getCoursesInPhase = (phaseId: number): Course[];

// Progress calculation utilities
export const calculateOverallProgress = (enrolledCourses: Course[]): number;
export const calculateCourseProgress = (course: Course): number;
export const getTotalEstimatedHours = (): number;
export const getCompletedCoursesCount = (enrolledCourses: Course[]): number;

// Search and filtering
export const searchCourses = (query: string, phase?: number): Course[];
export const filterCoursesByDifficulty = (
  courses: Course[],
  difficulty: string
): Course[];
export const filterCoursesBySkill = (courses: Course[], skill: string): Course[];
```

### User State Management

```typescript
// User progress utilities
export const initializeUserProgress = (): UserProgress;
export const updateCourseProgress = (
  courseId: number,
  contentId: number,
  completed: boolean
): void;
export const enrollInCourse = (courseId: number): void;
export const markContentComplete = (courseId: number, contentId: number): void;

// Achievement system
export const checkAchievements = (userProgress: UserProgress): Achievement[];
export const unlockAchievement = (achievementId: string): void;
export const getAchievementsByCategory = (
  category: AchievementCategory
): Achievement[];
```

### Theme and Styling (`src/lib/utils.ts`)

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for conditional class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme-specific utilities
export const getPhaseColor = (phaseId: number): string;
export const getDifficultyColor = (difficulty: string): string;
export const getProgressColor = (progress: number): string;
```

## 🎨 Component Props Interfaces

### Core Layout Components

```typescript
interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  className?: string;
}

interface NavigationProps {
  currentPath: string;
  user?: User;
  onLogout?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavigationItem[];
}
```

### Learning Interface Components

```typescript
interface EnrolledCoursePageProps {
  courseId: number;
  initialContentId?: number;
}

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
}

interface AIPlaygroundProps {
  courseContext: Course;
  currentContent: Content;
  mode: "terminal" | "chat" | "analysis";
  onModeChange: (mode: string) => void;
}

interface TerminalProps {
  commands: TerminalCommand[];
  onCommand: (command: string) => void;
  theme?: "matrix" | "dark" | "light";
  readonly?: boolean;
}
```

### Dashboard Components

```typescript
interface DashboardStatsProps {
  userProgress: UserProgress;
  recentActivity: Activity[];
  className?: string;
}

interface ProgressChartProps {
  data: ProgressData[];
  timeframe: "week" | "month" | "year";
  type: "line" | "bar" | "area";
}

interface AchievementCardProps {
  achievement: Achievement;
  size?: "small" | "medium" | "large";
  showProgress?: boolean;
  onClick?: () => void;
}
```

### Interactive Learning Components

```typescript
interface GameLauncherProps {
  game: Game;
  onStart: () => void;
  onComplete: (score: number) => void;
  disabled?: boolean;
}

interface LabEnvironmentProps {
  lab: Lab;
  tools: LabTool[];
  onToolSelect: (tool: string) => void;
  onComplete: () => void;
}

interface QuizComponentProps {
  questions: Question[];
  onSubmit: (answers: Answer[]) => void;
  timeLimit?: number;
  showProgress?: boolean;
}
```

## 🔄 Hooks and Context

### Custom Hooks

```typescript
// User progress management
export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress>();
  const updateProgress = (courseId: number, contentId: number) => void;
  const enrollCourse = (courseId: number) => void;
  return { progress, updateProgress, enrollCourse };
};

// Course data management
export const useCourseData = (courseId: number) => {
  const [course, setCourse] = useState<Course>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  return { course, loading, error };
};

// Achievement tracking
export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>();
  const checkForUnlocks = (userProgress: UserProgress) => void;
  const unlockAchievement = (id: string) => void;
  return { achievements, checkForUnlocks, unlockAchievement };
};
```

### Context Providers

```typescript
interface AppContextType {
  user: User | null;
  userProgress: UserProgress | null;
  updateUserProgress: (progress: Partial<UserProgress>) => void;
  enrolledCourses: Course[];
  enrollInCourse: (courseId: number) => void;
}

interface ThemeContextType {
  theme: "dark" | "light" | "matrix";
  setTheme: (theme: string) => void;
  matrixEffects: boolean;
  toggleMatrixEffects: () => void;
}
```

## 🎯 Event Handlers and Callbacks

### Common Event Types

```typescript
type NavigationHandler = (path: string) => void;
type ProgressHandler = (courseId: number, progress: number) => void;
type CompletionHandler = (courseId: number, contentId: number) => void;
type AchievementHandler = (achievementId: string) => void;
type ErrorHandler = (error: Error | string) => void;

// Video player events
interface VideoPlayerEvents {
  onPlay?: () => void;
  onPause?: () => void;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
  onError?: ErrorHandler;
}

// Interactive component events
interface InteractiveEvents {
  onStart?: () => void;
  onComplete?: (result: any) => void;
  onExit?: () => void;
  onSave?: (data: any) => void;
}
```

## 📊 Constants and Enums

### Platform Constants

```typescript
export const PLATFORM_CONFIG = {
  MAX_ENROLLMENT: 10,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  AUTOSAVE_INTERVAL: 5 * 60 * 1000, // 5 minutes
  VIDEO_PROGRESS_THRESHOLD: 0.9, // 90% for completion
  ACHIEVEMENT_POINTS: {
    Common: 10,
    Rare: 25,
    Epic: 50,
    Legendary: 100,
  },
} as const;

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  COURSE_DETAIL: "/courses/:id",
  ENROLLED_COURSE: "/courses/:id/learn",
  PROFILE: "/profile",
  ACHIEVEMENTS: "/achievements",
} as const;
```

### Theme Colors and Styles

```typescript
export const CYBERSECURITY_THEME = {
  colors: {
    primary: {
      matrix: "#00ff41",
      cyber: "#00d4ff",
      warning: "#ff6b35",
      danger: "#ff073a",
    },
    phases: {
      beginner: "#4ade80",
      intermediate: "#fb923c",
      advanced: "#f87171",
    },
    achievements: {
      common: "#6b7280",
      rare: "#3b82f6",
      epic: "#8b5cf6",
      legendary: "#f59e0b",
    },
  },
  effects: {
    matrixRain: true,
    glitchText: true,
    neonGlow: true,
    scanlines: true,
  },
} as const;
```

## 🔍 Search and Filtering

### Search Configuration

```typescript
interface SearchConfig {
  fields: string[];
  weights: Record<string, number>;
  fuzzyThreshold: number;
  maxResults: number;
}

export const COURSE_SEARCH_CONFIG: SearchConfig = {
  fields: ["title", "description", "skills", "instructor"],
  weights: {
    title: 0.4,
    description: 0.3,
    skills: 0.2,
    instructor: 0.1,
  },
  fuzzyThreshold: 0.6,
  maxResults: 50,
};
```

### Filter Options

```typescript
export const FILTER_OPTIONS = {
  difficulty: ["Beginner", "Intermediate", "Advanced"],
  duration: ["< 1 hour", "1-3 hours", "3-6 hours", "6+ hours"],
  skills: [
    "Network Security",
    "Ethical Hacking",
    "Cryptography",
    "Incident Response",
    "Malware Analysis",
    "Social Engineering",
    "Digital Forensics",
    "Risk Assessment",
  ],
  rating: [1, 2, 3, 4, 5],
} as const;
```

## 🧪 Testing Utilities

### Mock Data Generators

```typescript
export const generateMockCourse = (overrides?: Partial<Course>): Course;
export const generateMockUser = (overrides?: Partial<User>): User;
export const generateMockProgress = (
  overrides?: Partial<UserProgress>
): UserProgress;
export const generateMockAchievement = (
  overrides?: Partial<Achievement>
): Achievement;
```

### Test Helpers

```typescript
export const renderWithProviders = (
  component: React.ReactElement,
  options?: RenderOptions
): RenderResult;

export const createMockUserProgress = (
  completedCourses: number = 0,
  totalCourses: number = 15
): UserProgress;

export const simulateVideoProgress = (
  component: any,
  progress: number
): void;
```

---

**API Version**: 1.0.0
**Last Updated**: December 2024
**TypeScript Coverage**: 100%
