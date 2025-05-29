# Component Library

## 📚 Overview

The Hack The World platform includes 50+ reusable React components organized by feature and functionality. All components follow consistent patterns, use TypeScript interfaces, and maintain the cybersecurity theme.

## 🏗️ Component Organization

### Directory Structure

```
src/components/
├── common/       # Shared UI components
├── course/       # Course detail and enrollment
├── enrolled/     # Learning interface components
├── dashboard/    # User dashboard and progress
├── landing/      # Marketing and landing page
├── overview/     # Course navigation and structure
├── games/        # Interactive security games
├── terminal/     # Terminal emulation
├── effects/      # Animation and visual effects
└── ui/          # shadcn/ui base components
```

## 🧩 Common Components

### DifficultyBadge

Visual indicator for course/content difficulty levels.

```typescript
interface DifficultyBadgeProps {
  difficulty: string;
  className?: string;
}

// Usage
<DifficultyBadge difficulty="Beginner" />
<DifficultyBadge difficulty="Intermediate" />
<DifficultyBadge difficulty="Advanced" />
```

**Features:**

- Color-coded badges (Green, Yellow, Red, Purple)
- Consistent styling across platform
- Responsive design

### ProgressBar

Cybersecurity-themed progress visualization.

```typescript
interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showPercentage?: boolean;
}

// Usage
<ProgressBar value={75} showPercentage />
<ProgressBar value={45} className="w-full" />
```

**Features:**

- Green terminal-style progress bar
- Optional percentage display
- Smooth animation transitions

### StatCard

Dashboard statistics display component.

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  className?: string;
}

// Usage
<StatCard
  title="Modules Completed"
  value={12}
  icon={Target}
  color="text-green-400"
/>;
```

**Features:**

- Icon integration with Lucide React
- Customizable colors and styling
- Consistent card layout

### Header

Main navigation header with authentication state.

```typescript
interface HeaderProps {
  navigate: (path: string) => void;
}

// Usage
<Header navigate={navigate} />;
```

**Features:**

- Responsive navigation menu
- User authentication status
- Platform branding with cybersecurity theme

### UserAvatar

User profile display with logout functionality.

```typescript
interface UserAvatarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    level?: string;
    points?: number;
  };
}

// Usage
<UserAvatar user={currentUser} />;
```

**Features:**

- Profile image or fallback initials
- User info display
- Dropdown with logout option

## 🎓 Course Components

### CourseHero

Main course header with enrollment actions.

```typescript
interface CourseHeroProps {
  course: Course;
}

// Usage
<CourseHero course={courseData} />;
```

**Features:**

- Course title and description
- Difficulty and duration display
- Enrollment status and actions

### CourseFeatures

Quick overview of course content metrics.

```typescript
interface CourseFeaturesProps {
  lessons: number;
  labs: number;
  games: number;
}

// Usage
<CourseFeatures lessons={15} labs={8} games={5} />;
```

### CourseInfoSidebar

Detailed course information sidebar.

```typescript
interface CourseInfoSidebarProps {
  course: Course;
}

// Usage
<CourseInfoSidebar course={courseData} />;
```

**Features:**

- Prerequisites display
- Learning outcomes
- Course statistics

### EnrollmentButton

Dynamic enrollment action button.

```typescript
interface EnrollmentButtonProps {
  enrollmentStatus: string;
  onEnrollment: () => void;
}

// Usage
<EnrollmentButton enrollmentStatus="available" onEnrollment={handleEnroll} />;
```

## 📖 Enrolled Course Components

### VideoPlayer

Full-featured video player for lessons.

```typescript
interface VideoPlayerProps {
  lesson: EnrolledLesson;
  isPlaying: boolean;
  currentVideo: number;
  totalLessons: number;
  completedLessons: string[];
  isMaximized?: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onMarkComplete: (lessonId: string) => void;
  onMaximize: () => void;
  onRestore?: () => void;
}
```

**Features:**

- Play/pause controls
- Lesson navigation
- Progress tracking
- Maximize/minimize functionality

### AIPlayground

Multi-mode interactive learning workspace.

```typescript
interface AIPlaygroundProps {
  playgroundModes: PlaygroundMode[];
  activeMode: string;
  terminalHistory: TerminalMessage[];
  chatMessages: ChatMessage[];
  analysisResult: string;
  isAnalyzing: boolean;
  isMaximized?: boolean;
  onModeChange: (mode: string) => void;
  onTerminalCommand: (command: string) => void;
  onChatMessage: (message: string) => void;
  onAnalysis: (input: string) => void;
  onMaximize: () => void;
  onRestore?: () => void;
}
```

**Features:**

- Terminal emulation mode
- AI chat integration
- Analysis tools
- Context-aware mode switching

### SplitView

Resizable split-pane layout component.

```typescript
interface SplitViewProps {
  leftPane: ReactNode;
  rightPane: ReactNode;
  leftPaneWidth: number;
  videoMaximized: boolean;
  playgroundMaximized: boolean;
  isResizing: boolean;
  onLeftPaneWidthChange: (width: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
}
```

**Features:**

- Drag-to-resize functionality
- Maximize/minimize individual panes
- Responsive layout adaptation

### ContentSidebar

Lesson navigation and progress sidebar.

```typescript
interface ContentSidebarProps {
  course: EnrolledCourse;
  currentVideo: number;
  completedLessons: string[];
  isOpen: boolean;
  onClose: () => void;
  onLessonSelect: (lessonIndex: number) => void;
}
```

**Features:**

- Lesson tree navigation
- Progress indicators
- Content type icons
- Collapsible sidebar

## 📊 Dashboard Components

### DashboardTabs

Main dashboard navigation and content organization.

```typescript
interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onModuleClick: (module: Module) => void;
  getAllModules: () => Module[];
  getEnrolledModules: () => Module[];
  achievements: Achievement[];
}
```

### LearningDashboard

Comprehensive learning progress visualization.

```typescript
interface LearningDashboardProps {
  enrolledModules: Module[];
}
```

**Features:**

- Circular progress indicators
- Learning statistics
- Module progress cards
- Achievement tracking

### CourseTree

Hierarchical course structure display.

```typescript
interface CourseTreeProps {
  phases: Phase[];
  expandedPhases: string[];
  onTogglePhase: (phaseId: string) => void;
  onModuleClick: (module: Module) => void;
  getAllModules: () => Module[];
  getEnrolledModules: () => Module[];
  getCompletedModules: () => Module[];
}
```

**Features:**

- Expandable phase sections
- Module enrollment status
- Progress visualization
- Interactive navigation

### AchievementCard

Individual achievement display component.

```typescript
interface AchievementCardProps {
  achievement: Achievement;
}
```

**Features:**

- Icon integration
- Earned/unearned states
- Description tooltips
- Visual celebration effects

## 🎮 Game Components

### CipherGame

Caesar cipher decoding challenge.

```typescript
interface CipherGameProps {
  onScoreUpdate: (points: number) => void;
}
```

### HashCrackGame

Hash cracking simulation game.

```typescript
interface HashCrackGameProps {
  onScoreUpdate: (points: number) => void;
}
```

### PortScanGame

Network port scanning simulation.

```typescript
interface PortScanGameProps {
  onScoreUpdate: (points: number) => void;
}
```

## 🖥️ Terminal Components

### LiveTerminal

Real-time terminal simulation with command execution.

```typescript
interface LiveTerminalProps {
  commands?: string[];
  title?: string;
  className?: string;
}
```

**Features:**

- Authentic terminal styling
- Command history
- Realistic command output
- Cybersecurity tool simulation

### TerminalWindow

Styled terminal container with macOS-style controls.

```typescript
interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  height?: string;
}
```

**Features:**

- Terminal window styling
- Traffic light controls
- Customizable dimensions
- Green glow effects

## ✨ Effects Components

### MatrixRain

Animated matrix-style background effect.

```typescript
// Usage
<MatrixRain />
```

**Features:**

- Canvas-based animation
- Responsive sizing
- Performance-optimized rendering
- Cybersecurity aesthetic

### TypewriterText

Animated typewriter text effect.

```typescript
interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  showCursor?: boolean;
}
```

**Features:**

- Character-by-character animation
- Configurable typing speed
- Blinking cursor effect
- Terminal-style appearance

## 🎨 Landing Page Components

### HeroSection

Main landing page hero with call-to-action.

```typescript
interface HeroSectionProps {
  onStartJourney: () => void;
  onViewDemo: () => void;
  stats: Array<{
    label: string;
    value: string;
  }>;
}
```

### FeaturesSection

Platform features showcase with cards.

```typescript
interface FeaturesSectionProps {
  features: Feature[];
  onFeatureClick?: (feature: Feature) => void;
}
```

### InteractiveDemoSection

Live platform demonstration with threat intelligence.

```typescript
interface InteractiveDemoSectionProps {
  liveStats: ThreatStat[];
  gameScore: number;
  onScoreUpdate: (points: number) => void;
  onNavigateToOverview: () => void;
  onEnterCyberRange: () => void;
}
```

## 🔧 Component Development Patterns

### TypeScript Interface Pattern

```typescript
// Every component has a typed interface
interface ComponentNameProps {
  required: string;
  optional?: number;
  callback: (data: string) => void;
  children?: ReactNode;
}

const ComponentName = ({
  required,
  optional,
  callback,
}: ComponentNameProps) => {
  // Component implementation
  return <div>{/* JSX content */}</div>;
};

export default ComponentName;
```

### Styling Pattern

```typescript
// Consistent className prop handling
interface ComponentProps {
  className?: string;
}

const Component = ({ className = "" }: ComponentProps) => {
  return <div className={cn("base-styles", className)}>{/* Content */}</div>;
};
```

### Event Handling Pattern

```typescript
// Callback prop pattern for events
interface ComponentProps {
  onAction: (data: ActionData) => void;
  onComplete?: () => void;
}

const Component = ({ onAction, onComplete }: ComponentProps) => {
  const handleClick = () => {
    onAction({ type: "click", timestamp: Date.now() });
    onComplete?.();
  };

  return <button onClick={handleClick}>Action</button>;
};
```

## 📚 Usage Guidelines

### Component Reusability

- Design components for multiple use cases
- Use composition over complex prop APIs
- Provide sensible defaults for optional props
- Include className prop for styling flexibility

### Performance Considerations

- Use React.memo for expensive components
- Implement useMemo for expensive calculations
- Use useCallback for stable function references
- Avoid inline object creation in render

### Accessibility Standards

- Include proper ARIA labels
- Ensure keyboard navigation support
- Maintain semantic HTML structure
- Test with screen readers

### Testing Approach

- Test component props and interactions
- Mock external dependencies
- Test accessibility features
- Include error boundary testing

---

This component library provides a comprehensive foundation for building cybersecurity-themed educational interfaces with consistent patterns, strong typing, and excellent user experience.
