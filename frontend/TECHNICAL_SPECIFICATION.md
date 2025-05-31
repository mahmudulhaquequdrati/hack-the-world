# 🛡️ Hack The World - Complete Technical Specification

## 📋 Table of Contents

- [🏗️ System Architecture](#system-architecture)
- [📊 Data Management](#data-management)
- [🧱 Component Specifications](#component-specifications)
- [🔄 Data Flow Implementation](#data-flow-implementation)
- [🗺️ Navigation System](#navigation-system)
- [📈 Progress Tracking](#progress-tracking)
- [🎮 Interactive Components](#interactive-components)
- [🔧 Implementation Details](#implementation-details)

---

## 🏗️ System Architecture

### Core Architecture Layers

```typescript
// Layer 1: Data Layer (appData.ts)
export const PHASES: Phase[] = [...]
export const MODULES: Module[] = [...]
export const GAMES: GameData[] = [...]
export const LABS: LabData[] = [...]
export const USER_PROGRESS: UserProgress[] = [...]
export const USER_ENROLLMENTS: UserEnrollment[] = [...]
export const USER_GAME_PROGRESS: UserGameProgress[] = [...]
export const USER_LAB_PROGRESS: UserLabProgress[] = [...]

// Layer 2: Business Logic (Helper Functions)
export const getAllModules = () => Module[]
export const getEnrolledModules = () => Module[]
export const updateModuleProgress = (moduleId: string, progress: number) => void
export const enrollInModule = (moduleId: string) => void

// Layer 3: Component Layer (React Components)
// Layer 4: Page Layer (Route Components)
// Layer 5: Navigation Layer (React Router)
```

### Data Relationships Matrix

| Entity  | Relates To         | Relationship Type | Key Fields |
| ------- | ------------------ | ----------------- | ---------- |
| PHASES  | MODULES            | 1:Many            | phaseId    |
| MODULES | GAMES              | 1:Many            | moduleId   |
| MODULES | LABS               | 1:Many            | moduleId   |
| MODULES | USER_PROGRESS      | 1:Many            | moduleId   |
| MODULES | USER_ENROLLMENTS   | 1:Many            | moduleId   |
| GAMES   | USER_GAME_PROGRESS | 1:Many            | gameId     |
| LABS    | USER_LAB_PROGRESS  | 1:Many            | labId      |

---

## 📊 Data Management

### Primary Data Structures

#### 1. Phase Structure

```typescript
interface Phase {
  id: "beginner" | "intermediate" | "advanced";
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  order: number;
  modules: Module[]; // Dynamically populated
}

// Implementation in appData.ts
export const PHASES = [
  {
    id: "beginner",
    title: "Beginner Phase",
    description: "Foundation courses for cybersecurity beginners",
    icon: "Lightbulb",
    color: "text-green-400",
    order: 1,
  },
  // ... 2 more phases
];
```

#### 2. Module Structure

```typescript
interface Module {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  icon: string; // Icon name for database compatibility
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  color: string;
  bgColor: string;
  borderColor: string;
  path: string; // "/course/moduleId"
  enrollPath: string; // "/learn/moduleId"
  order: number;

  // Computed fields (added by helper functions)
  progress?: number; // 0-100
  enrolled?: boolean;
  completed?: boolean;
  topics?: string[];
  labs?: number;
  games?: number;
  assets?: number;
}

// Implementation: 15 modules across 3 phases
// Beginner: 6 modules
// Intermediate: 6 modules
// Advanced: 3 modules
```

#### 3. Game Structure

```typescript
interface GameData {
  name: string;
  description: string;
  type: "simulation" | "puzzle" | "strategy" | "quiz" | "ctf" | "scenario";
  maxPoints: number;
  timeLimit?: string;
  objectives: string[];
  difficulty?: string;
  category?: string;
}

// Organized by modules in GAMES object:
export const GAMES: { [moduleId: string]: { [gameId: string]: GameData } } = {
  foundations: {
    "security-policy-builder": {
      name: "Security Policy Builder",
      description: "Create comprehensive security policies",
      type: "simulation",
      maxPoints: 100,
      objectives: ["Policy creation", "Risk assessment", "Compliance"],
    },
    // ... more games
  },
  // ... more modules
};
```

#### 4. Lab Structure

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

// Organized by modules in LABS object:
export const LABS: { [moduleId: string]: { [labId: string]: LabData } } = {
  foundations: {
    "risk-assessment-simulation": {
      name: "Risk Assessment Simulation",
      description: "Hands-on risk assessment practice",
      difficulty: "Beginner",
      duration: "45 minutes",
      objectives: ["Risk identification", "Impact analysis"],
      steps: [
        {
          id: "ras-step-1",
          title: "Asset Identification",
          description: "Identify critical assets",
          completed: false,
        },
        // ... more steps
      ],
    },
    // ... more labs
  },
  // ... more modules
};
```

#### 5. Progress Tracking Structures

```typescript
// User Progress
interface UserProgress {
  id: string;
  userId: string;
  moduleId: string;
  progress: number; // 0-100
  completed: boolean;
  completedAt?: string;
  startedAt?: string;
  lastAccessedAt?: string;
}

// User Enrollments
interface UserEnrollment {
  id: string;
  userId: string;
  moduleId: string;
  enrolledAt: string;
  status: "active" | "completed" | "paused" | "dropped";
}

// Game Progress
interface UserGameProgress {
  id: string;
  userId: string;
  gameId: string;
  completed: boolean;
  score: number;
  maxScore: number;
  completedAt?: string;
  attempts: number;
}

// Lab Progress
interface UserLabProgress {
  id: string;
  userId: string;
  labId: string;
  completed: boolean;
  completedSteps: string[];
  completedAt?: string;
  startedAt?: string;
}
```

### Data Access Functions

#### Core Retrieval Functions

```typescript
// Phase Functions
export const getAllPhases = (): Phase[]
export const getPhaseById = (phaseId: string): Phase | undefined
export const getEnrolledPhases = (): Phase[]

// Module Functions
export const getAllModules = (): Module[]
export const getEnrolledModules = (): Module[]
export const getCompletedModules = (): Module[]
export const getModulesByPhase = (phaseId: string, enrolledOnly?: boolean): Module[]
export const getModuleById = (moduleId: string): Module | undefined

// Game Functions
export const getGamesByModule = (moduleId: string): {[gameId: string]: GameData}
export const getAllGamesForPhase = (phaseId: string): {[gameId: string]: GameData}
export const getGameData = (moduleId: string, gameId: string): GameData | null

// Lab Functions
export const getLabsByModule = (moduleId: string): {[labId: string]: LabData}
export const getAllLabsForPhase = (phaseId: string): {[labId: string]: LabData}
export const getLabData = (moduleId: string, labId: string): LabData | null
```

#### Progress Functions

```typescript
// Progress Calculation
export const getOverallProgress = (): number
export const getPhaseProgress = (phaseId: string): number
export const getDashboardStats = (): UserStats

// Progress Updates
export const updateModuleProgress = (moduleId: string, progress: number): void
export const enrollInModule = (moduleId: string): void
export const unenrollFromModule = (moduleId: string): void

// Detailed Progress
export const getDetailedCourseProgress = (courseId: string): DetailedProgress
```

---

## 🧱 Component Specifications

### Page Components

#### 1. LandingPage

```typescript
// Location: src/pages/LandingPage.tsx
// Purpose: Entry point and platform overview
// Data Dependencies: PHASES (overview only)

const LandingPage = () => {
  // Components Used:
  // - HeroSection
  // - FeatureOverview
  // - PhasePreview
  // - CallToAction
  // Navigation Targets:
  // - /overview (main CTA)
  // - /signup
  // - /login
};
```

#### 2. CyberSecOverview

```typescript
// Location: src/pages/CyberSecOverview.tsx
// Purpose: Complete learning path overview with enrollment
// Data Dependencies: ALL (phases, modules, progress)

const CyberSecOverview = () => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [enrollingModules, setEnrollingModules] = useState<Set<string>>(
    new Set()
  );

  // Key Functions:
  const handleEnroll = async (path: string) => {
    const moduleId = path.split("/").pop();
    if (!moduleId) return;

    setEnrollingModules((prev) => new Set(prev).add(moduleId));

    // Simulate enrollment
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update data
    enrollInNormalizedModule(moduleId);
    const updatedPhases = getNormalizedPhases();
    setPhases(updatedPhases);

    // Navigate to enrolled course
    const enrolledModule = getNormalizedModuleById(moduleId);
    if (enrolledModule) {
      navigate(enrolledModule.enrollPath);
    }
  };

  // Components Used:
  // - PhaseCard (for each phase)
  // - ModuleCard (for each module)
  // - ProgressOverview
  // - EnrollmentButton
};
```

#### 3. Dashboard

```typescript
// Location: src/pages/Dashboard.tsx
// Purpose: User progress hub and navigation center
// Data Dependencies: Enrolled modules, achievements, progress

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("progress");
  const enrolledModules = getEnrolledModules();
  const achievements = ACHIEVEMENTS_DATA;

  const handleModuleClick = (module: Module) => {
    if (module.enrolled) {
      navigate(module.enrollPath, { state: { from: "dashboard" } });
    } else {
      navigate(module.path, { state: { from: "dashboard" } });
    }
  };

  // Components Used:
  // - LearningDashboard (progress overview)
  // - DashboardTabs (main navigation)
  //   - EnhancedProgressTab
  //   - DashboardGamesTab
  //   - DashboardLabsTab
  //   - AchievementsTab
};
```

#### 4. CourseDetailPage

```typescript
// Location: src/pages/CourseDetailPage.tsx
// Purpose: Detailed module information and enrollment
// Data Dependencies: Single module details, games, labs

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (courseId) {
      const courseData = getNormalizedCourseById(courseId);
      setCourse(courseData);
    }
  }, [courseId]);

  const handleEnrollment = () => {
    if (course?.enrolled) {
      navigate(`/learn/${courseId}`);
    } else {
      setCourse((prev) => (prev ? { ...prev, enrolled: true } : null));
      navigate(`/learn/${courseId}`);
    }
  };

  // Components Used:
  // - CourseHero
  // - CourseInfoSidebar
  // - EnrollmentButton
  // - CourseTabsContainer
  //   - OverviewTab
  //   - CurriculumTab
  //   - LabsTab
  //   - GamesTab
};
```

#### 5. EnrolledCoursePage

```typescript
// Location: src/pages/EnrolledCoursePage.tsx
// Purpose: Main learning interface with video, labs, games
// Data Dependencies: Module content, progress, user state

const EnrolledCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<EnrolledCourse | null>(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // AI Playground State
  const [playgroundMode, setPlaygroundMode] = useState("terminal");
  const [terminalHistory, setTerminalHistory] = useState<TerminalMessage[]>([]);
  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([]);

  // Navigation Functions
  const openLabInNewTab = (labId: string) => {
    const urlFriendlyLabId = labId
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    window.open(`/learn/${courseId}/lab/${urlFriendlyLabId}`, "_blank");
  };

  const openGameInNewTab = (gameId: string) => {
    const urlFriendlyGameId = gameId
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    window.open(`/learn/${courseId}/game/${urlFriendlyGameId}`, "_blank");
  };

  // Components Used:
  // - CourseHeader
  // - VideoPlayer or FullScreenContent
  // - AIPlayground
  // - ContentSidebar
  // - LabContent (when lab active)
  // - GameContent (when game active)
};
```

### Feature Components

#### 1. DashboardTabs

```typescript
// Location: src/components/dashboard/DashboardTabs.tsx
// Purpose: Main navigation hub for dashboard

export const DashboardTabs = ({
  activeTab,
  onTabChange,
  onModuleClick,
  getAllModules,
  getEnrolledModules,
  achievements,
}: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="progress">my_progress</TabsTrigger>
        <TabsTrigger value="labs">my_labs</TabsTrigger>
        <TabsTrigger value="games">my_games</TabsTrigger>
        <TabsTrigger value="achievements">achievements</TabsTrigger>
      </TabsList>

      <TabsContent value="progress">
        <EnhancedProgressTab
          enrolledModules={getEnrolledModules()}
          onModuleClick={onModuleClick}
          getAllModules={getAllModules}
        />
      </TabsContent>

      <TabsContent value="labs">
        <DashboardLabsTab
          phases={getEnrolledPhases()}
          getModulesByPhase={getModulesByPhase}
        />
      </TabsContent>

      <TabsContent value="games">
        <DashboardGamesTab
          phases={getEnrolledPhases()}
          getModulesByPhase={getModulesByPhase}
        />
      </TabsContent>

      <TabsContent value="achievements">
        <AchievementsTab achievements={achievements} />
      </TabsContent>
    </Tabs>
  );
};
```

#### 2. EnhancedProgressTab

```typescript
// Location: src/components/dashboard/EnhancedProgressTab.tsx
// Purpose: Detailed progress tracking and filtering

export const EnhancedProgressTab = ({
  enrolledModules,
  onModuleClick,
  getAllModules,
}: EnhancedProgressTabProps) => {
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [selectedEnrollmentFilter, setSelectedEnrollmentFilter] =
    useState<string>("enrolled");

  // Group modules by phase
  const categorizedModules = {
    beginner: enrolledModules.filter((m) => m.phaseId === "beginner"),
    intermediate: enrolledModules.filter((m) => m.phaseId === "intermediate"),
    advanced: enrolledModules.filter((m) => m.phaseId === "advanced"),
  };

  // Filter logic for different views
  const filteredModules =
    selectedPhase === "all"
      ? enrolledModules
      : categorizedModules[selectedPhase as keyof typeof categorizedModules] ||
        [];

  return (
    <div className="space-y-8">
      {/* Phase Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(categorizedModules).map(([phase, modules]) => (
          <PhaseProgressCard
            key={phase}
            phase={phase}
            modules={modules}
            isActive={selectedPhase === phase}
            onClick={() => setSelectedPhase(phase)}
          />
        ))}
      </div>

      {/* Module Timeline */}
      <div className="space-y-4">
        {filteredModules.map((module) => (
          <ModuleProgressCard
            key={module.id}
            module={module}
            onClick={() => onModuleClick(module)}
          />
        ))}
      </div>
    </div>
  );
};
```

#### 3. DashboardGamesTab

```typescript
// Location: src/components/dashboard/DashboardGamesTab.tsx
// Purpose: Games overview and navigation

export const DashboardGamesTab = ({
  phases,
  getModulesByPhase,
}: DashboardGamesTabProps) => {
  const navigate = useNavigate();
  const [expandedPhases, setExpandedPhases] = useState<string[]>(["beginner"]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const handlePlayGame = (game: GameItem) => {
    // URL-friendly ID generation
    const gameId = game.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    navigate(`/learn/${game.moduleId}/game/${gameId}`);
  };

  return (
    <div className="space-y-6">
      {phases.map((phase) => (
        <div key={phase.id}>
          {/* Phase Header */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => togglePhase(phase.id)}
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                expandedPhases.includes(phase.id) ? "rotate-90" : ""
              }`}
            />
            <phase.icon className="w-5 h-5 mr-2" />
            <span>{phase.title}</span>
          </div>

          {/* Modules and Games */}
          {expandedPhases.includes(phase.id) && (
            <div className="ml-6 mt-4 space-y-4">
              {getModulesByPhase(phase.id, true).map((module) => (
                <ModuleGamesSection
                  key={module.id}
                  module={module}
                  onPlayGame={handlePlayGame}
                  expanded={expandedModules.includes(module.id)}
                  onToggle={() => toggleModule(module.id)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

#### 4. DashboardLabsTab

```typescript
// Location: src/components/dashboard/DashboardLabsTab.tsx
// Purpose: Labs overview and navigation

export const DashboardLabsTab = ({
  phases,
  getModulesByPhase,
}: DashboardLabsTabProps) => {
  const navigate = useNavigate();
  const [expandedPhases, setExpandedPhases] = useState<string[]>(["beginner"]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const handleStartLab = (lab: LabItem) => {
    // URL-friendly ID generation
    const labId = lab.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    navigate(`/learn/${lab.moduleId}/lab/${labId}`);
  };

  // Similar structure to DashboardGamesTab but for labs
  return (
    <div className="space-y-6">
      {phases.map((phase) => (
        <PhaseLabsSection
          key={phase.id}
          phase={phase}
          modules={getModulesByPhase(phase.id, true)}
          onStartLab={handleStartLab}
          expandedPhases={expandedPhases}
          expandedModules={expandedModules}
          onTogglePhase={togglePhase}
          onToggleModule={toggleModule}
        />
      ))}
    </div>
  );
};
```

---

## 🔄 Data Flow Implementation

### Enrollment Flow

```typescript
// 1. User clicks enroll button (CyberSecOverview)
const handleEnroll = async (path: string) => {
  const moduleId = path.split("/").pop();

  // 2. Update UI state (loading)
  setEnrollingModules((prev) => new Set(prev).add(moduleId));

  // 3. Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 4. Update data layer
  enrollInNormalizedModule(moduleId);

  // 5. Refresh UI data
  const updatedPhases = getNormalizedPhases();
  setPhases(updatedPhases);

  // 6. Navigate to learning interface
  const enrolledModule = getNormalizedModuleById(moduleId);
  if (enrolledModule) {
    navigate(enrolledModule.enrollPath);
  }
};

// Behind the scenes: enrollInNormalizedModule()
export const enrollInNormalizedModule = (moduleId: string): void => {
  const existingEnrollment = USER_ENROLLMENTS.find(
    (ue) => ue.moduleId === moduleId
  );

  if (!existingEnrollment) {
    USER_ENROLLMENTS.push({
      id: `ue-${Date.now()}`,
      userId: "user-1",
      moduleId,
      enrolledAt: new Date().toISOString(),
      status: "active",
    });
  } else if (existingEnrollment.status === "dropped") {
    existingEnrollment.status = "active";
    existingEnrollment.enrolledAt = new Date().toISOString();
  }
};
```

### Progress Update Flow

```typescript
// 1. User completes activity (lesson/lab/game)
const markLessonComplete = (lessonId: string) => {
  // 2. Update local state immediately
  setCompletedLessons((prev) => [...prev, lessonId]);

  // 3. Calculate new progress
  const allLessons = getAllLessons();
  const newProgress = Math.round(
    ((completedLessons.length + 1) / allLessons.length) * 100
  );

  // 4. Update data layer
  updateNormalizedModuleProgress(courseId, newProgress);

  // 5. Trigger side effects (achievements, stats updates)
  // This happens automatically in updateNormalizedModuleProgress
};

// Behind the scenes: updateNormalizedModuleProgress()
export const updateNormalizedModuleProgress = (
  moduleId: string,
  progress: number
): void => {
  const existingProgress = USER_PROGRESS.find((up) => up.moduleId === moduleId);

  if (existingProgress) {
    existingProgress.progress = progress;
    existingProgress.completed = progress >= 100;
    existingProgress.lastAccessedAt = new Date().toISOString();
    if (progress >= 100 && !existingProgress.completedAt) {
      existingProgress.completedAt = new Date().toISOString();
    }
  } else {
    USER_PROGRESS.push({
      id: `up-${Date.now()}`,
      userId: "user-1",
      moduleId,
      progress,
      completed: progress >= 100,
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      completedAt: progress >= 100 ? new Date().toISOString() : undefined,
    });
  }
};
```

### Navigation Flow

```typescript
// URL-friendly ID generation pattern
const generateUrlId = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") // Spaces to dashes
    .replace(/[^a-z0-9-]/g, ""); // Remove special characters
};

// Game navigation from dashboard
const handlePlayGame = (game: GameItem) => {
  const gameId = generateUrlId(game.name);
  navigate(`/learn/${game.moduleId}/game/${gameId}`);
};

// Lab navigation from dashboard
const handleStartLab = (lab: LabItem) => {
  const labId = generateUrlId(lab.name);
  navigate(`/learn/${lab.moduleId}/lab/${labId}`);
};

// Reverse lookup in GamePage/LabPage
const GamePage = () => {
  const { courseId, gameId } = useParams();
  const [gameData, setGameData] = useState<Game | null>(null);

  useEffect(() => {
    const games = getGamesByModule(courseId);

    // Multiple lookup strategies
    let game =
      games.find((g) => g.id === gameId) || // Direct ID
      games.find((g) => generateUrlId(g.name) === gameId) || // URL-friendly
      games.find((g) => g.name.toLowerCase() === gameId?.toLowerCase()); // Fallback

    setGameData(game || null);
  }, [courseId, gameId]);
};
```

---

## 🗺️ Navigation System

### Route Configuration

```typescript
// App.tsx Route Setup
<Router>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/overview" element={<CyberSecOverview />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />

    {/* Protected Routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    {/* Course Routes */}
    <Route path="/course/:courseId" element={<CourseDetailPage />} />
    <Route
      path="/learn/:courseId"
      element={
        <ProtectedRoute>
          <EnrolledCoursePage />
        </ProtectedRoute>
      }
    />

    {/* Interactive Content Routes */}
    <Route
      path="/learn/:courseId/game/:gameId"
      element={
        <ProtectedRoute>
          <GamePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/learn/:courseId/lab/:labId"
      element={
        <ProtectedRoute>
          <LabPage />
        </ProtectedRoute>
      }
    />

    {/* Standalone Lab Routes */}
    <Route path="/terminal-lab" element={<TerminalLab />} />
    <Route path="/websec-lab" element={<WebSecLab />} />
    <Route path="/social-eng-lab" element={<SocialEngLab />} />

    {/* Utility Routes */}
    <Route path="/demo" element={<PlatformDemo />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</Router>
```

### Navigation Hooks

```typescript
// Custom navigation hook
const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    // Dashboard navigation
    toDashboard: () => navigate("/dashboard"),
    toOverview: () => navigate("/overview"),

    // Course navigation
    toCourse: (courseId: string) => navigate(`/course/${courseId}`),
    toEnrolledCourse: (courseId: string) => navigate(`/learn/${courseId}`),

    // Interactive content navigation
    toGame: (courseId: string, gameId: string) => {
      const urlId = generateUrlId(gameId);
      navigate(`/learn/${courseId}/game/${urlId}`);
    },
    toLab: (courseId: string, labId: string) => {
      const urlId = generateUrlId(labId);
      navigate(`/learn/${courseId}/lab/${urlId}`);
    },

    // New tab navigation
    openGameInNewTab: (courseId: string, gameId: string) => {
      const urlId = generateUrlId(gameId);
      window.open(`/learn/${courseId}/game/${urlId}`, "_blank");
    },
    openLabInNewTab: (courseId: string, labId: string) => {
      const urlId = generateUrlId(labId);
      window.open(`/learn/${courseId}/lab/${urlId}`, "_blank");
    },
  };
};
```

---

## 📈 Progress Tracking

### Progress Calculation System

```typescript
// Overall progress calculation
export const getOverallProgress = (): number => {
  const enrolledModules = getEnrolledModules();
  if (enrolledModules.length === 0) return 0;

  const totalProgress = enrolledModules.reduce(
    (sum, module) => sum + module.progress,
    0
  );
  return Math.round(totalProgress / enrolledModules.length);
};

// Phase-specific progress
export const getPhaseProgress = (phaseId: string): number => {
  const phaseModules = getModulesByPhase(phaseId, true); // enrolled only
  if (phaseModules.length === 0) return 0;

  const totalProgress = phaseModules.reduce(
    (sum, module) => sum + module.progress,
    0
  );
  return Math.round(totalProgress / phaseModules.length);
};

// Detailed course progress
export const getDetailedCourseProgress = (courseId: string) => {
  const course = getCourseById(courseId);
  if (!course) return null;

  // Calculate lesson completion
  const moduleLessons = USER_LESSON_PROGRESS.filter(
    (lp) => lp.moduleId === courseId && lp.userId === "user-1"
  );
  const totalLessons = course.curriculum.reduce(
    (sum, section) => sum + section.lessons,
    0
  );
  const completedLessons = moduleLessons.filter(
    (lesson) => lesson.completed
  ).length;

  // Calculate lab completion
  const moduleLabProgress = USER_LAB_PROGRESS.filter(
    (ulp) =>
      ulp.userId === "user-1" &&
      Object.keys(getLabsByModule(courseId)).includes(ulp.labId)
  );
  const totalLabs = course.labsData.length;
  const completedLabs = moduleLabProgress.filter((lab) => lab.completed).length;

  // Calculate game completion
  const moduleGameProgress = USER_GAME_PROGRESS.filter(
    (ugp) =>
      ugp.userId === "user-1" &&
      Object.keys(getGamesByModule(courseId)).includes(ugp.gameId)
  );
  const totalGames = course.gamesData.length;
  const completedGames = moduleGameProgress.filter(
    (game) => game.completed
  ).length;

  // Weighted progress calculation
  const lessonWeight = 0.6; // 60%
  const labWeight = 0.25; // 25%
  const gameWeight = 0.15; // 15%

  const lessonProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const labProgress = totalLabs > 0 ? (completedLabs / totalLabs) * 100 : 0;
  const gameProgress = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;

  const weightedProgress = Math.round(
    lessonProgress * lessonWeight +
      labProgress * labWeight +
      gameProgress * gameWeight
  );

  return {
    overallProgress: weightedProgress,
    completedLessons,
    totalLessons,
    completedLabs,
    totalLabs,
    completedGames,
    totalGames,
    lessonProgress: Math.round(lessonProgress),
    labProgress: Math.round(labProgress),
    gameProgress: Math.round(gameProgress),
  };
};
```

### Dashboard Statistics

```typescript
export const getDashboardStats = () => {
  const enrolledModules = getEnrolledModules();
  const completedModules = getCompletedModules();

  // Game statistics
  const totalGamesCompleted = USER_GAME_PROGRESS.filter(
    (ugp) => ugp.completed
  ).length;
  const totalGameScore = USER_GAME_PROGRESS.reduce(
    (sum, ugp) => sum + ugp.score,
    0
  );

  // Lab statistics
  const totalLabsCompleted = USER_LAB_PROGRESS.filter(
    (ulp) => ulp.completed
  ).length;

  // Achievement statistics
  const totalAchievements = USER_ACHIEVEMENTS.filter((ua) => ua.earned).length;

  return {
    enrolledCourses: enrolledModules.length,
    completedCourses: completedModules.length,
    totalGames: totalGamesCompleted,
    totalLabs: totalLabsCompleted,
    totalAchievements,
    totalPoints: totalGameScore,
    currentStreak: 7, // Calculate based on daily activity
    weeklyGoal: 12,
    weeklyProgress: 8,
  };
};
```

---

## 🎮 Interactive Components

### Game Integration

```typescript
// Game content in EnrolledCoursePage
const GameContent = ({ course, activeGame, onOpenInNewTab, onClose }) => {
  const game = course.games.find((game) => game.id === activeGame);

  if (!game) return null;

  return (
    <ContentContainer
      title={game.name}
      contentType="game"
      onOpenInNewTab={() => onOpenInNewTab(activeGame)}
      onClose={onClose}
    >
      <LoadingContent title="Game Loading..." description={game.description} />
    </ContentContainer>
  );
};

// Standalone GamePage
const GamePage = () => {
  const { courseId, gameId } = useParams();
  const [gameData, setGameData] = useState<Game | null>(null);

  useEffect(() => {
    const games = getGamesByModule(courseId);
    const game = findByUrlId(games, gameId);
    setGameData(game || null);
  }, [courseId, gameId]);

  if (!gameData) {
    return <div>Game not found</div>;
  }

  return <GameDisplay game={gameData} />;
};
```

### Lab Integration

```typescript
// Lab content in EnrolledCoursePage
const LabContent = ({ course, activeLab, onOpenInNewTab, onClose }) => {
  const lab = course.labs.find((lab) => lab.id === activeLab);

  if (!lab) return null;

  return (
    <ContentContainer
      title={lab.name}
      contentType="lab"
      onOpenInNewTab={() => onOpenInNewTab(activeLab)}
      onClose={onClose}
    >
      <LabInterface
        lab={lab}
        onStepComplete={(stepId) => updateLabProgress(activeLab, stepId)}
      />
    </ContentContainer>
  );
};

// Standalone LabPage
const LabPage = () => {
  const { courseId, labId } = useParams();
  const [labData, setLabData] = useState<Lab | null>(null);

  useEffect(() => {
    const labs = getLabsByModule(courseId);
    const lab = findByUrlId(labs, labId);
    setLabData(lab || null);
  }, [courseId, labId]);

  return labData ? <LabDisplay lab={labData} /> : <div>Lab not found</div>;
};
```

### Terminal Integration

```typescript
// AI Playground with Terminal
const AIPlayground = ({ mode, terminalHistory, onCommandExecute }) => {
  const [currentCommand, setCurrentCommand] = useState("");

  const handleCommandSubmit = (command: string) => {
    // Add command to history
    const newMessage: TerminalMessage = {
      type: "command",
      content: `$ ${command}`,
    };

    // Simulate command execution
    const response = simulateCommandExecution(command);
    const responseMessage: TerminalMessage = {
      type: "output",
      content: response,
    };

    onCommandExecute([newMessage, responseMessage]);
    setCurrentCommand("");
  };

  return (
    <div className="bg-black border border-green-500/30 rounded p-4">
      <div className="font-mono text-green-400 text-sm">
        {/* Terminal history */}
        {terminalHistory.map((message, index) => (
          <div
            key={index}
            className={
              message.type === "command" ? "text-green-300" : "text-green-400"
            }
          >
            {message.content}
          </div>
        ))}

        {/* Current command input */}
        <div className="flex">
          <span className="text-green-300">$ </span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCommandSubmit(currentCommand);
              }
            }}
            className="bg-transparent outline-none flex-1 text-green-400"
            placeholder="Enter command..."
          />
        </div>
      </div>
    </div>
  );
};
```

---

## 🔧 Implementation Details

### State Management Patterns

```typescript
// Page-level state management
const EnrolledCoursePage = () => {
  // Course data state
  const [course, setCourse] = useState<EnrolledCourse | null>(null);
  const [loading, setLoading] = useState(true);

  // Navigation state
  const [currentVideo, setCurrentVideo] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  // Interactive content state
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // UI state
  const [contentSidebarOpen, setContentSidebarOpen] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(60);
  const [isResizing, setIsResizing] = useState(false);

  // Maximization state
  const [videoMaximized, setVideoMaximized] = useState(false);
  const [playgroundMaximized, setPlaygroundMaximized] = useState(false);

  // AI Playground state
  const [playgroundMode, setPlaygroundMode] = useState("terminal");
  const [terminalHistory, setTerminalHistory] = useState<TerminalMessage[]>([]);
  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([]);
};
```

### Performance Optimizations

```typescript
// Memoized components
const ModuleProgressCard = React.memo(({ module, onClick }) => {
  return <Card onClick={onClick}>{/* Component content */}</Card>;
});

// Memoized calculations
const EnhancedProgressTab = ({ enrolledModules }) => {
  const categorizedModules = useMemo(
    () => ({
      beginner: enrolledModules.filter((m) => m.phaseId === "beginner"),
      intermediate: enrolledModules.filter((m) => m.phaseId === "intermediate"),
      advanced: enrolledModules.filter((m) => m.phaseId === "advanced"),
    }),
    [enrolledModules]
  );

  const sortedModules = useMemo(() => {
    return [...filteredModules].sort((a, b) => {
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;
      if (a.progress !== b.progress) return b.progress - a.progress;
      return 0;
    });
  }, [filteredModules]);
};

// Memoized callbacks
const Dashboard = () => {
  const handleModuleClick = useCallback(
    (module: Module) => {
      if (module.enrolled) {
        navigate(module.enrollPath, { state: { from: "dashboard" } });
      } else {
        navigate(module.path, { state: { from: "dashboard" } });
      }
    },
    [navigate]
  );
};
```

### Error Handling

```typescript
// Loading states
if (loading) {
  return <LoadingSpinner message="LOADING_COURSE_DATA..." />;
}

// Error states
if (!course) {
  return (
    <ErrorState
      title="COURSE_NOT_FOUND"
      message="The requested course could not be found."
      buttonText="BACK_TO_OVERVIEW"
      onButtonClick={() => navigate("/overview")}
    />
  );
}

// Try-catch for data operations
const handleEnroll = async (path: string) => {
  try {
    const moduleId = path.split("/").pop();
    if (!moduleId) return;

    setEnrollingModules((prev) => new Set(prev).add(moduleId));
    await new Promise((resolve) => setTimeout(resolve, 1500));

    enrollInNormalizedModule(moduleId);
    // ... success handling
  } catch (error) {
    console.error("Enrollment failed:", error);
    // ... error handling
  } finally {
    setEnrollingModules((prev) => {
      const newSet = new Set(prev);
      newSet.delete(moduleId);
      return newSet;
    });
  }
};
```

This comprehensive technical specification documents every aspect of the Hack The World frontend system, ensuring complete understanding of all components, data flows, and implementation details.
