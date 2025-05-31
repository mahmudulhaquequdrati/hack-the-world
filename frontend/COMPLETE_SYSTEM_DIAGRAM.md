# 🛡️ Hack The World - Complete Frontend System Architecture

## 📊 System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        HACK THE WORLD FRONTEND SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                         DATA LAYER (appData.ts)                            │    │
│  │                        SINGLE SOURCE OF TRUTH                              │    │
│  ├─────────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                             │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │    │
│  │  │    PHASES    │  │   MODULES    │  │    GAMES     │  │     LABS     │    │    │
│  │  │  (3 phases)  │  │ (15 modules) │  │(50+ games)   │  │ (40+ labs)   │    │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │    │
│  │         │                 │                 │                 │            │    │
│  │         └─────────────────┼─────────────────┼─────────────────┘            │    │
│  │                           │                 │                              │    │
│  │  ┌──────────────┐  ┌──────┴─────────┐  ┌────┴──────────┐  ┌──────────────┐    │    │
│  │  │USER_PROGRESS │  │USER_ENROLLMENTS│  │USER_GAME_PROG │  │USER_LAB_PROG │    │    │
│  │  │ (tracking)   │  │  (enrollment)  │  │ (scores/comp) │  │(steps/comp)  │    │    │
│  │  └──────────────┘  └────────────────┘  └───────────────┘  └──────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                     │                                              │
│                                     ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                           COMPONENT LAYER                                  │    │
│  ├─────────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                             │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │    │
│  │  │  LANDING    │ │ DASHBOARD   │ │   COURSE    │ │  ENROLLED   │           │    │
│  │  │    PAGE     │ │    PAGE     │ │   DETAIL    │ │   COURSE    │           │    │
│  │  │             │ │             │ │    PAGE     │ │    PAGE     │           │    │
│  │  │ Overview of │ │ Progress    │ │ Module Info │ │ Learning    │           │    │
│  │  │ all phases  │ │ Tracking    │ │ & Content   │ │ Interface   │           │    │
│  │  │ & modules   │ │ Metrics     │ │ Overview    │ │ Video/Labs  │           │    │
│  │  └─────┬───────┘ └─────┬───────┘ └─────┬───────┘ └─────┬───────┘           │    │
│  │        │               │               │               │                   │    │
│  │        └───────────────┼───────────────┼───────────────┘                   │    │
│  │                        │               │                                   │    │
│  │  ┌─────────────────────┼───────────────┼─────────────────────┐             │    │
│  │  │              STANDALONE PAGES       │                     │             │    │
│  │  │                     │               │                     │             │    │
│  │  │  ┌─────────────┐ ┌──┴─────────┐ ┌───┴───────┐ ┌─────────┐ │             │    │
│  │  │  │  GAME PAGE  │ │  LAB PAGE  │ │ TERMINAL  │ │ WEBSEC  │ │             │    │
│  │  │  │             │ │            │ │   LAB     │ │  LAB    │ │             │    │
│  │  │  │ Interactive │ │ Step-by-   │ │ Command   │ │ Web     │ │             │    │
│  │  │  │ Security    │ │ Step Lab   │ │ Line      │ │ Security│ │             │    │
│  │  │  │ Challenges  │ │ Guidance   │ │ Practice  │ │ Testing │ │             │    │
│  │  │  └─────────────┘ └────────────┘ └───────────┘ └─────────┘ │             │    │
│  │  └─────────────────────────────────────────────────────────────┘             │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                     │                                              │
│                                     ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                        NAVIGATION LAYER                                    │    │
│  ├─────────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                             │    │
│  │  Route Patterns:                                                           │    │
│  │  ┌─ /                        → LandingPage                                 │    │
│  │  ├─ /overview                → CyberSecOverview                            │    │
│  │  ├─ /dashboard               → Dashboard                                   │    │
│  │  ├─ /course/:courseId        → CourseDetailPage                           │    │
│  │  ├─ /learn/:courseId         → EnrolledCoursePage                         │    │
│  │  ├─ /learn/:courseId/lab/:id → LabPage                                    │    │
│  │  ├─ /learn/:courseId/game/:id→ GamePage                                   │    │
│  │  ├─ /terminal-lab            → TerminalLab                                │    │
│  │  ├─ /websec-lab              → WebSecLab                                  │    │
│  │  └─ /social-eng-lab          → SocialEngLab                              │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔗 Core Schema Relationships

### 1. Phase-Module-Content Hierarchy

```
PHASES (1:Many) ──► MODULES (1:Many) ──► GAMES & LABS
   │                    │                      │
   │                    │                      ▼
   │                    │              CONTENT ITEMS
   │                    │             (Lessons, Videos)
   │                    │
   │                    ▼
   │            MODULE CURRICULUM
   │           (Learning Outcomes)
   │
   ▼
PHASE PROGRESS
(Aggregated Stats)
```

### 2. User Progress Tracking

```
USER (1) ──┬──► USER_ENROLLMENTS (Many)
           │         │
           │         ▼
           │    MODULE ENROLLMENT
           │   (Active/Completed)
           │
           ├──► USER_PROGRESS (Many)
           │         │
           │         ▼
           │    MODULE PROGRESS
           │    (0-100% completion)
           │
           ├──► USER_GAME_PROGRESS (Many)
           │         │
           │         ▼
           │    GAME SCORES & COMPLETION
           │
           └──► USER_LAB_PROGRESS (Many)
                     │
                     ▼
                STEP-BY-STEP COMPLETION
```

## 📋 Core Data Structures

### Phase Schema

```typescript
interface Phase {
  id: "beginner" | "intermediate" | "advanced";
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  order: number;
  modules: Module[]; // Populated dynamically
}
```

### Module Schema

```typescript
interface Module {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  progress: number; // 0-100
  color: string;
  bgColor: string;
  borderColor: string;
  topics: string[];
  path: string; // "/course/moduleId"
  enrollPath: string; // "/learn/moduleId"
  labs: number;
  games: number;
  assets: number;
  enrolled: boolean;
  completed: boolean;
}
```

### Game Schema

```typescript
interface GameData {
  name: string;
  description: string;
  type: "simulation" | "puzzle" | "strategy" | "quiz" | "ctf";
  maxPoints: number;
  timeLimit?: string;
  objectives: string[];
  difficulty: string;
  category: string;
}
```

### Lab Schema

```typescript
interface LabData {
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  objectives: string[];
  steps: LabStep[];
}

interface LabStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
```

## 🌊 Data Flow Patterns

### 1. Course Enrollment Flow

```
CyberSecOverview ──► CourseDetailPage ──► EnrolledCoursePage
       │                     │                    │
       ▼                     ▼                    ▼
  Display All         Module Details       Learning Interface
   Phases &              & Content           Video + Labs +
   Modules                                    Games + AI
       │                     │                    │
       ▼                     ▼                    ▼
enrollInNormalizedModule() ──► Update USER_ENROLLMENTS
                                      │
                                      ▼
                              Update Module.enrolled = true
```

### 2. Progress Tracking Flow

```
User Completes Activity ──► updateNormalizedModuleProgress()
           │                              │
           ▼                              ▼
    UI Updates Instantly           Update USER_PROGRESS
           │                              │
           ▼                              ▼
  Progress Bar Updates            Recalculate Phase Progress
           │                              │
           ▼                              ▼
 Dashboard Stats Update          Check Achievement Triggers
```

### 3. Navigation Flow

```
Landing Page ──► Overview ──► Course Detail ──► Enrolled Course
     │              │             │                   │
     ▼              ▼             ▼                   ▼
All Phases     Phase Filter   Enrollment         Learning Content
& Modules      by Difficulty    Button               │
     │              │             │                   ├─ Video Lessons
     ▼              ▼             ▼                   ├─ Interactive Labs
Dashboard ◄── Progress ◄── User Actions              └─ Security Games
```

## 🎮 Interactive Learning Components

### Lab Integration

```
EnrolledCoursePage ──► Lab Button ──► LabContent Component
         │                │                    │
         ▼                ▼                    ▼
   Full-screen       Open New Tab         Step-by-step
   Experience        Experience            Guidance
         │                │                    │
         ▼                ▼                    ▼
  Internal State    Dedicated Route      Progress Tracking
  (activeLab)      /learn/:id/lab/:id   (USER_LAB_PROGRESS)
```

### Game Integration

```
EnrolledCoursePage ──► Game Button ──► GameContent Component
         │                │                    │
         ▼                ▼                    ▼
   Full-screen       Open New Tab         Interactive
   Experience        Experience            Challenge
         │                │                    │
         ▼                ▼                    ▼
  Internal State    Dedicated Route      Score Tracking
  (activeGame)     /learn/:id/game/:id  (USER_GAME_PROGRESS)
```

## 📊 Dashboard Data Aggregation

### Progress Tab Data Flow

```
DashboardTabs ──► EnhancedProgressTab ──► ModuleProgressCard
      │                   │                       │
      ▼                   ▼                       ▼
getEnrolledModules() ──► Filter by Phase ──► Individual Module
      │                   │                       │
      ▼                   ▼                       ▼
Phase Progress ──► Module Categories ──► Progress Tracking
 Calculation        (All/Enrolled/        (Visual Progress
                    Completed)              Bars & Stats)
```

### Games Tab Data Flow

```
DashboardGamesTab ──► getEnrolledPhases() ──► Phase Expansion
         │                     │                     │
         ▼                     ▼                     ▼
 Game Collection ──► Module Grouping ──► Game Action Buttons
         │                     │                     │
         ▼                     ▼                     ▼
Score Tracking ──► Progress Stats ──► Navigation to Games
(USER_GAME_PROGRESS)   (Completion)    (/learn/:id/game/:id)
```

### Labs Tab Data Flow

```
DashboardLabsTab ──► getEnrolledPhases() ──► Phase Expansion
         │                     │                     │
         ▼                     ▼                     ▼
  Lab Collection ──► Module Grouping ──► Lab Action Buttons
         │                     │                     │
         ▼                     ▼                     ▼
Step Tracking ──► Completion Stats ──► Navigation to Labs
(USER_LAB_PROGRESS)    (Steps Done)     (/learn/:id/lab/:id)
```

## 🔄 Component State Management

### Page-Level State Flow

```
App.tsx ──► Route Protection ──► Page Components
   │               │                    │
   ▼               ▼                    ▼
Router Setup ──► Auth Guards ──► Data Loading
   │               │                    │
   ▼               ▼                    ▼
URL Patterns ──► Enrollment ──► Component Hierarchy
               Verification
```

### Component Communication

```
Parent Page ──props──► Feature Component ──props──► UI Component
     │                         │                        │
     ▼                         ▼                        ▼
State Mgmt ◄──events─── Business Logic ◄──events─── User Actions
     │                         │                        │
     ▼                         ▼                        ▼
API Calls ──► Data Updates ──► UI Updates ──► Progress Tracking
```

## 🎯 User Journey Mapping

### New User Journey

```
Landing Page → Overview → Course Selection → Enrollment → Learning
     │            │            │               │            │
     ▼            ▼            ▼               ▼            ▼
  Welcome     Phase Info   Module Details   Start Course  Progress
  Message     & Modules    & Content Info   Dashboard     Tracking
```

### Returning User Journey

```
Dashboard → Continue Learning → Complete Activities → Track Progress
    │             │                   │                   │
    ▼             ▼                   ▼                   ▼
Progress      Resume Course      Labs & Games        Achievement
Overview      from Last          Completion          Unlocking
              Position
```

## 🏗️ Component Architecture

### Page Component Hierarchy

```
App.tsx
├── LandingPage
├── CyberSecOverview
│   ├── PhaseCards
│   ├── ModuleCards
│   └── EnrollmentButtons
├── Dashboard
│   ├── LearningDashboard
│   │   ├── ProgressOverview
│   │   └── StatCards
│   └── DashboardTabs
│       ├── EnhancedProgressTab
│       ├── DashboardGamesTab
│       ├── DashboardLabsTab
│       └── AchievementsTab
├── CourseDetailPage
│   ├── CourseHero
│   ├── CourseInfoSidebar
│   ├── EnrollmentButton
│   └── CourseTabsContainer
│       ├── OverviewTab
│       ├── CurriculumTab
│       ├── LabsTab
│       └── GamesTab
├── EnrolledCoursePage
│   ├── CourseHeader
│   ├── VideoPlayer/FullScreenContent
│   ├── AIPlayground
│   ├── ContentSidebar
│   ├── LabContent
│   └── GameContent
├── GamePage (Standalone)
├── LabPage (Standalone)
├── TerminalLab (Standalone)
├── WebSecLab (Standalone)
└── SocialEngLab (Standalone)
```

## 🔍 Data Access Patterns

### Centralized Data Functions

```typescript
// Core Data Retrieval
getAllModules() → Module[]
getEnrolledModules() → Module[]
getCompletedModules() → Module[]
getModulesByPhase(phaseId) → Module[]

// Progress Functions
getOverallProgress() → number
getPhaseProgress(phaseId) → number
getDashboardStats() → UserStats

// Game & Lab Access
getGamesByModule(moduleId) → {[gameId: string]: GameData}
getLabsByModule(moduleId) → {[labId: string]: LabData}
getAllGamesForPhase(phaseId) → Games
getAllLabsForPhase(phaseId) → Labs

// Progress Updates
updateModuleProgress(moduleId, progress)
enrollInModule(moduleId)
unenrollFromModule(moduleId)
```

## 🚀 Performance Optimizations

### Data Loading Strategy

```
Static Data (appData.ts) ──► Immediate Loading
         │
         ▼
User Progress Data ──► Lazy Loading
         │
         ▼
Component-Specific Data ──► On-Demand Loading
```

### Component Optimization

```
React.memo ──► Expensive Components
     │
     ▼
useMemo ──► Complex Calculations
     │
     ▼
useCallback ──► Event Handlers
     │
     ▼
Code Splitting ──► Route-Based Loading
```

This documentation provides a complete visualization of how all schemas connect and flow through the Hack The World frontend system, ensuring nothing is missed in understanding the complete architecture.
