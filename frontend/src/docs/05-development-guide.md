# Development Guide

## 🚀 Getting Started

This guide provides comprehensive instructions for setting up, developing, and contributing to the Hack The World cybersecurity learning platform.

## 📋 Prerequisites

### Required Software

- **Node.js**: Version 18 or higher
- **pnpm**: Latest version (required - do not use npm or yarn)
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd hack-the-world

# Install dependencies (must use pnpm)
pnpm install

# Start development server
pnpm dev
```

### 2. Environment Setup

```bash
# Copy environment file (if needed)
cp .env.example .env.local

# Configure development environment variables
# VITE_API_BASE_URL=http://localhost:3000
# VITE_ENABLE_ANALYTICS=false
```

### 3. Development Commands

```bash
# Development
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors
pnpm format       # Format with Prettier
pnpm type-check   # TypeScript type checking

# Testing (when implemented)
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Generate coverage report
```

## 🏗️ Project Architecture

### Core Principles

1. **Functional Components Only**: Use React functional components with hooks
2. **TypeScript First**: 100% TypeScript coverage, no `any` types
3. **Centralized Data**: All data flows through `src/lib/appData.ts`
4. **Component Reusability**: Design for multiple use cases
5. **Cybersecurity Theme**: Maintain authentic terminal aesthetic

### Data Flow Pattern

```typescript
// Data flows in one direction
src/lib/appData.ts → Pages → Feature Components → Common Components

// Example data access
import { getAllModules, getEnrolledModules } from '@/lib/appData';

const Dashboard = () => {
  const allModules = getAllModules();
  const enrolledModules = getEnrolledModules();

  return <DashboardContent modules={allModules} enrolled={enrolledModules} />;
};
```

### File Organization

```
src/
├── components/    # 50+ reusable components
│   ├── common/   # Shared UI components
│   ├── course/   # Course-specific components
│   ├── enrolled/ # Learning interface
│   ├── dashboard/# Dashboard components
│   └── ...       # Feature-based organization
├── pages/        # Route-level components
├── lib/          # Data and utilities
├── hooks/        # Custom React hooks
├── docs/         # Documentation (17 files)
└── assets/       # Static files
```

## 🎯 Development Standards

### Component Development

#### 1. Component Structure

```typescript
// ComponentName.tsx
import { ComponentType } from "react";
import { cn } from "@/lib/utils";

interface ComponentNameProps {
  required: string;
  optional?: number;
  callback: (data: string) => void;
  className?: string;
}

const ComponentName = ({
  required,
  optional = 0,
  callback,
  className = "",
}: ComponentNameProps) => {
  // Component logic here

  return (
    <div className={cn("base-styles", className)}>{/* JSX content */}</div>
  );
};

export default ComponentName;
```

#### 2. TypeScript Requirements

```typescript
// Always define interfaces for props
interface Props {
  // Use specific types, never 'any'
  data: ModuleData[];
  onAction: (id: string) => void;
  isActive?: boolean; // Optional props with ?
}

// Use proper typing for event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  onAction(data.id);
};

// Type custom hooks properly
const useCustomHook = (
  initialValue: string
): [string, (value: string) => void] => {
  const [state, setState] = useState(initialValue);
  return [state, setState];
};
```

#### 3. Styling Guidelines

```typescript
// Use Tailwind classes with cn() utility
import { cn } from "@/lib/utils";

const Component = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "base bg-black text-green-400 border border-green-400/30",
      "hover:bg-green-400/10 transition-colors",
      className
    )}
  >
    Content
  </div>
);

// Custom CSS only for complex animations
// Define in src/index.css with cybersecurity theme
```

### Data Management

#### 1. Using Centralized Data

```typescript
// ✅ Correct - Import from appData.ts
import { getAllModules, getModuleById, getPhaseProgress } from "@/lib/appData";

const CourseOverview = () => {
  const modules = getAllModules();
  const progress = getPhaseProgress("beginner");

  return <ModuleList modules={modules} progress={progress} />;
};

// ❌ Incorrect - Don't create local data
const badData = [
  { id: "foundations", title: "Foundations" }, // Duplicates appData
];
```

#### 2. State Management

```typescript
// Use React hooks for component state
const [activeTab, setActiveTab] = useState("overview");
const [isLoading, setIsLoading] = useState(false);

// Use useMemo for expensive calculations
const sortedModules = useMemo(
  () => modules.sort((a, b) => a.title.localeCompare(b.title)),
  [modules]
);

// Use useCallback for stable function references
const handleModuleClick = useCallback(
  (moduleId: string) => {
    navigate(`/course/${moduleId}`);
  },
  [navigate]
);
```

### Error Handling

#### 1. Component Error Boundaries

```typescript
// Create error boundary components
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="text-red-400 p-4 border border-red-400/30 rounded">
    <h2>Something went wrong:</h2>
    <pre className="text-sm mt-2">{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className="mt-4 px-4 py-2 bg-red-400/20"
    >
      Try again
    </button>
  </div>
);

// Wrap components that might fail
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <RiskyComponent />
</ErrorBoundary>;
```

#### 2. Async Error Handling

```typescript
// Handle loading and error states
const [data, setData] = useState<Module[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
```

## 🎨 Design System Usage

### 1. Color System

```typescript
// Use CSS custom properties for colors
const colorClasses = {
  primary: "text-green-400 bg-green-400/10 border-green-400/30",
  beginner: "text-green-400 bg-green-400/10",
  intermediate: "text-yellow-400 bg-yellow-400/10",
  advanced: "text-red-400 bg-red-400/10",
  expert: "text-purple-400 bg-purple-400/10",
};

// Terminal theme utilities
const terminalStyles = {
  window:
    "bg-black border border-green-400/30 rounded-lg shadow-lg shadow-green-400/10",
  text: "font-mono text-green-400",
  cursor: "animate-pulse text-green-400",
};
```

### 2. Typography

```typescript
// Use consistent typography classes
const textStyles = {
  heading: "font-mono text-2xl font-bold text-green-400",
  body: "font-sans text-gray-300",
  terminal: "font-mono text-green-400 text-sm",
  code: "font-mono text-green-300 bg-black/50 px-2 py-1 rounded",
};
```

### 3. Animation Guidelines

```typescript
// Use Tailwind transition classes
const animationClasses = {
  button: "transition-all duration-300 hover:scale-105",
  fade: "transition-opacity duration-200",
  slide: "transition-transform duration-300",
};

// Custom animations in CSS for complex effects
// See src/index.css for matrix rain, glitch effects, etc.
```

## 🧪 Testing Strategy

### 1. Component Testing

```typescript
// Use React Testing Library for component tests
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Component from "./Component";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const mockClick = vi.fn();
    render(<Component onClick={mockClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockClick).toHaveBeenCalledOnce();
  });

  it("handles edge cases", () => {
    render(<Component data={[]} />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
```

### 2. Integration Testing

```typescript
// Test component interactions and data flow
import { renderWithRouter } from "@/test-utils";

describe("Dashboard Integration", () => {
  it("navigates between tabs correctly", async () => {
    renderWithRouter(<Dashboard />);

    const labsTab = screen.getByText("Labs");
    fireEvent.click(labsTab);

    await screen.findByText("Available Labs");
    expect(screen.getByText("SQL Injection Lab")).toBeInTheDocument();
  });
});
```

### 3. Utility Function Testing

```typescript
// Test utility functions with comprehensive cases
import { getAllModules, getPhaseProgress } from "@/lib/appData";

describe("Data Utilities", () => {
  it("returns all modules correctly", () => {
    const modules = getAllModules();
    expect(modules).toHaveLength(15);
    expect(modules[0]).toHaveProperty("id");
    expect(modules[0]).toHaveProperty("title");
  });

  it("calculates phase progress correctly", () => {
    const progress = getPhaseProgress("beginner");
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);
  });
});
```

## 🔄 Development Workflow

### 1. Feature Development Process

```bash
# 1. Create feature branch
git checkout -b feature/new-component

# 2. Develop with hot reload
pnpm dev

# 3. Test your changes
pnpm lint
pnpm type-check
pnpm test  # when available

# 4. Build to verify
pnpm build

# 5. Commit and push
git add .
git commit -m "feat: add new component with tests"
git push origin feature/new-component
```

### 2. Code Review Checklist

- [ ] TypeScript compilation passes without errors
- [ ] ESLint rules followed
- [ ] Component props properly typed
- [ ] Cybersecurity theme maintained
- [ ] Responsive design implemented
- [ ] Accessibility features included
- [ ] Performance considerations addressed
- [ ] Documentation updated (if needed)

### 3. Git Commit Conventions

```bash
# Use conventional commit format
feat: add new security game component
fix: resolve navigation bug in course page
docs: update API reference documentation
style: improve button hover animations
refactor: simplify data fetching logic
test: add comprehensive component tests
perf: optimize matrix rain animation
```

## 📚 Documentation Requirements

### 1. Component Documentation

````typescript
/**
 * Interactive security game component with scoring system
 *
 * @param game - Game configuration and metadata
 * @param onScoreUpdate - Callback when score changes
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <SecurityGame
 *   game={gameData}
 *   onScoreUpdate={(score) => updateLeaderboard(score)}
 * />
 * ```
 */
interface SecurityGameProps {
  game: GameData;
  onScoreUpdate: (score: number) => void;
  className?: string;
}
````

### 2. API Documentation

````typescript
// Document utility functions
/**
 * Retrieves all modules from all learning phases
 *
 * @returns Array of all available modules
 * @example
 * ```typescript
 * const modules = getAllModules();
 * console.log(`Total modules: ${modules.length}`);
 * ```
 */
export const getAllModules = (): Module[] => {
  return PHASES_DATA.flatMap((phase) => phase.modules);
};
````

### 3. Update Documentation

When adding new features:

1. Update relevant files in `src/docs/`
2. Add component examples to `04-component-library.md`
3. Document new data structures in `06-api-reference.md`
4. Update user flows in `03-user-experience.md`

## 🚀 Performance Guidelines

### 1. Bundle Optimization

```typescript
// Use dynamic imports for code splitting
const LazyComponent = lazy(() => import("./ExpensiveComponent"));

// Wrap in Suspense with loading fallback
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>;
```

### 2. React Optimization

```typescript
// Memoize expensive components
const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(
    () => data.map((item) => expensiveCalculation(item)),
    [data]
  );

  return <div>{/* Render processed data */}</div>;
});

// Stable callback references
const handleClick = useCallback(
  (id: string) => {
    // Handle click
  },
  [
    /* dependencies */
  ]
);
```

### 3. Asset Optimization

```typescript
// Lazy load images
const LazyImage = ({ src, alt }: ImageProps) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className="transition-opacity duration-300"
  />
);

// Optimize animations
const useReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
```

## 🔧 Troubleshooting

### Common Issues

#### 1. TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
pnpm install

# Check TypeScript configuration
pnpm type-check
```

#### 2. Build Failures

```bash
# Clear build cache
rm -rf dist
pnpm build

# Check for circular dependencies
npm ls --depth=0
```

#### 3. Development Server Issues

```bash
# Clear all caches
rm -rf node_modules/.vite
rm -rf node_modules/.cache
pnpm install
pnpm dev
```

### Getting Help

1. **Check Documentation**: Review relevant files in `src/docs/`
2. **Search Issues**: Look for similar problems in project issues
3. **Code Review**: Ask team members for guidance
4. **Debugging**: Use browser dev tools and React Developer Tools

---

This development guide provides the foundation for contributing to the Hack The World platform while maintaining code quality, performance, and the authentic cybersecurity experience.
