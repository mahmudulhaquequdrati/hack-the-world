# Architecture Guide

## 🏗️ System Architecture Overview

Hack The World is built as a modern single-page application (SPA) using React 18 with TypeScript, designed for performance, maintainability, and scalability.

## 📁 Project Structure

```
hack-the-world/
├── public/                 # Static assets
├── src/
│   ├── components/        # 50+ reusable React components
│   │   ├── common/       # Shared UI components
│   │   ├── course/       # Course detail and enrollment
│   │   ├── enrolled/     # Learning interface components
│   │   ├── dashboard/    # User dashboard and progress
│   │   ├── landing/      # Marketing and landing page
│   │   ├── overview/     # Course navigation and structure
│   │   ├── games/        # Interactive security games
│   │   ├── terminal/     # Terminal emulation
│   │   ├── effects/      # Animation and visual effects
│   │   └── ui/          # shadcn/ui base components
│   ├── pages/            # Route-level page components
│   ├── lib/              # Core utilities and data management
│   │   ├── appData.ts    # **SINGLE SOURCE OF TRUTH**
│   │   ├── types.ts      # TypeScript interfaces
│   │   ├── constants.ts  # Application constants
│   │   ├── helpers.ts    # Utility functions
│   │   └── utils.ts      # General utilities
│   ├── hooks/            # Custom React hooks
│   ├── docs/             # Comprehensive documentation
│   └── assets/           # Images, icons, and media files
├── .cursor/              # Cursor AI rules and configuration
└── package.json          # Dependencies and scripts
```

## 🔄 Data Flow Architecture

### Centralized Data Management

```
src/lib/appData.ts (Single Source of Truth)
    ↓
Pages (Route Components)
    ↓
Feature Components (Dashboard, Course, etc.)
    ↓
Common Components (UI Elements)
```

#### Key Principles

- **Single Source of Truth**: All data flows through `src/lib/appData.ts`
- **Props-Down Pattern**: Data flows down through props, no direct data imports in leaf components
- **Functional State Updates**: State changes through defined utility functions
- **No Data Duplication**: Centralized data prevents synchronization issues

### Data Structures

#### Core Data Types

```typescript
// Main data structures from appData.ts
interface Phase {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  color: string;
  bgColor: string;
  borderColor: string;
  topics: string[];
  path: string;
  enrollPath: string;
  labs: number;
  games: number;
  assets: number;
  enrolled: boolean;
  completed: boolean;
}
```

#### Centralized Utility Functions

```typescript
// Data Access Functions
getAllModules(): Module[]
getEnrolledModules(): Module[]
getCompletedModules(): Module[]
getModulesByPhase(phaseId: string, enrolledOnly?: boolean): Module[]
getEnrolledPhases(): Phase[]
getPhaseById(phaseId: string): Phase | undefined
getModuleById(moduleId: string): Module | undefined

// Analytics Functions
getDashboardStats(): Stat[]
getOverallProgress(): number
getPhaseProgress(phaseId: string): number

// State Management Functions
updateModuleProgress(moduleId: string, progress: number): void
enrollInModule(moduleId: string): void
unenrollFromModule(moduleId: string): void
```

## 🧩 Component Architecture

### Component Hierarchy

```
App.tsx
├── Router
├── LandingPage
├── Dashboard
│   ├── DashboardTabs
│   │   ├── OverviewTab
│   │   ├── ProgressTab
│   │   ├── DashboardLabsTab
│   │   ├── DashboardGamesTab
│   │   └── AchievementsTab
│   └── Common Components
├── CyberSecOverview
│   ├── OverviewHeader
│   ├── PhaseNavigation
│   └── ModuleTree
├── CourseDetailPage
│   ├── CourseHero
│   ├── CourseInfoSidebar
│   ├── CourseTabsContainer
│   └── Course Tabs
├── EnrolledCoursePage
│   ├── CourseHeader
│   ├── SplitView
│   │   ├── VideoPlayer
│   │   └── AIPlayground
│   ├── FullScreenContent
│   ├── CourseTabs
│   └── ContentSidebar
└── Common Components
    ├── Header
    ├── ProgressBar
    ├── StatCard
    ├── DifficultyBadge
    └── UserAvatar
```

### Component Design Principles

#### 1. Functional Components Only

```typescript
// All components use functional pattern
const ComponentName = ({ prop1, prop2 }: ComponentProps) => {
  // Component logic
  return <JSX />;
};

export default ComponentName;
```

#### 2. TypeScript Interfaces

```typescript
// Every component has typed props
interface ComponentNameProps {
  required: string;
  optional?: number;
  callback: (data: string) => void;
}
```

#### 3. Consistent Export Pattern

```typescript
// Default exports for main components
export default ComponentName;

// Named exports for utilities
export { utilityFunction, CONSTANT_VALUE };
```

## 🔧 Technology Stack Details

### Core Technologies

#### React 18 + TypeScript

- **Functional Components**: 100% functional component architecture
- **Custom Hooks**: Reusable stateful logic
- **Context API**: Limited global state for theme and user preferences
- **Strict TypeScript**: No `any` types, complete type coverage

#### Vite Build System

```typescript
// vite.config.ts configuration highlights
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select"],
        },
      },
    },
  },
});
```

#### Tailwind CSS + shadcn/ui

```css
/* Custom utility classes for cybersecurity theme */
.hacker-btn {
  @apply relative bg-transparent border border-green-400/30 text-green-400;
  @apply hover:bg-green-400/10 hover:shadow-lg hover:shadow-green-400/20;
  @apply transition-all duration-300;
}

.terminal-window {
  @apply bg-black border border-green-400/30 rounded-lg;
  @apply shadow-lg shadow-green-400/10;
}
```

### Specialized Libraries

#### Terminal Emulation

- **xterm.js**: Real terminal emulation for cybersecurity tools
- **Custom Terminal Components**: Integrated with React state management

#### Animation System

```typescript
// Matrix rain effect implementation
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Matrix animation logic
  }, []);

  return <canvas ref={canvasRef} className="matrix-rain" />;
};
```

#### Data Visualization

- **Recharts**: Progress charts and analytics visualization
- **Custom Progress Components**: Cybersecurity-themed progress indicators

## 📊 State Management Strategy

### Local State with Hooks

```typescript
// Component-level state for UI interactions
const [isPlaying, setIsPlaying] = useState(false);
const [activeTab, setActiveTab] = useState("overview");
const [currentVideo, setCurrentVideo] = useState(0);
```

### Global State via Context

```typescript
// Limited global state for app-wide concerns
const ThemeContext = createContext<ThemeContextType>();
const UserContext = createContext<UserContextType>();
```

### Data Persistence

```typescript
// localStorage for user preferences and progress
const saveProgress = (moduleId: string, progress: number) => {
  localStorage.setItem(`progress-${moduleId}`, JSON.stringify(progress));
};
```

## 🎯 Routing Architecture

### Route Structure

```typescript
// Route organization in App.tsx
const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/overview", element: <CyberSecOverview /> },
  { path: "/course/:courseId", element: <CourseDetailPage /> },
  { path: "/learn/:courseId", element: <EnrolledCoursePage /> },
  { path: "/learn/:courseId/lab/:labId", element: <LabPage /> },
  { path: "/learn/:courseId/game/:gameId", element: <GamePage /> },
]);
```

### Dynamic Routing

```typescript
// URL-friendly ID generation for games and labs
const generateUrlId = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// Navigation functions
const openLabInNewTab = (labId: string) => {
  const urlId = generateUrlId(labId);
  window.open(`/learn/${courseId}/lab/${urlId}`, "_blank");
};
```

## 🔒 Security Architecture

### Input Validation

```typescript
// Zod schemas for data validation
const userInputSchema = z.object({
  command: z.string().max(500),
  message: z.string().max(1000),
});
```

### XSS Prevention

```typescript
// Safe content rendering
const sanitizeOutput = (content: string) => {
  return DOMPurify.sanitize(content);
};
```

### Educational Security

- No actual vulnerabilities in teaching materials
- Simulated environments for safe learning
- Clear boundaries between simulation and reality

## 📈 Performance Architecture

### Bundle Optimization

```typescript
// Code splitting by routes
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const EnrolledCoursePage = lazy(() => import("./pages/EnrolledCoursePage"));
```

### Component Optimization

```typescript
// Memoization for expensive computations
const expensiveCalculation = useMemo(() => {
  return computeProgress(allModules);
}, [allModules]);

// Callback memoization
const handleModuleClick = useCallback(
  (module: Module) => {
    navigate(module.path);
  },
  [navigate]
);
```

### Asset Optimization

- SVG icons for scalability
- Optimized images with appropriate formats
- Lazy loading for non-critical assets

## 🔧 Development Architecture

### Development Tools

```json
{
  "typescript": "^5.0.0",
  "vite": "^5.0.0",
  "eslint": "^8.0.0",
  "prettier": "^3.0.0",
  "tailwindcss": "^3.0.0"
}
```

### Code Quality Tools

- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Cursor Rules**: AI-assisted development guidelines

### Build Pipeline

```bash
# Development workflow
pnpm dev          # Vite dev server with HMR
pnpm build        # TypeScript compilation + Vite build
pnpm preview      # Preview production build
pnpm lint         # ESLint checking
```

## 🚀 Scalability Considerations

### Architecture Patterns Ready for Scale

- **Component Library**: Reusable components ready for extraction
- **API Layer**: Data utilities ready for backend integration
- **State Management**: Architecture prepared for Redux/Zustand if needed
- **Real-time Features**: WebSocket integration points identified

### Future Architecture Plans

- **Backend Integration**: REST API or GraphQL integration points
- **Authentication**: JWT token management and refresh logic
- **Real-time Updates**: WebSocket for live collaboration
- **Mobile Apps**: React Native code sharing opportunities

---

This architecture provides a solid foundation for current functionality while remaining flexible for future enhancements and scaling requirements.
