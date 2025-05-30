# Testing Strategy - Hack The World

## 📋 Overview

This document outlines the comprehensive testing strategy for the Hack The World cybersecurity learning platform, covering unit tests, integration tests, component tests, and end-to-end testing.

## 🎯 Testing Goals

### Primary Objectives

- **Reliability**: Ensure all learning components function correctly
- **User Experience**: Validate smooth learning flow and interactions
- **Data Integrity**: Protect user progress and course data
- **Performance**: Maintain fast loading and responsive UI
- **Accessibility**: Ensure platform works for all users
- **Cross-browser Compatibility**: Support modern browsers

### Coverage Targets

- **Unit Tests**: >90% code coverage
- **Integration Tests**: All API endpoints and data flows
- **Component Tests**: All interactive components
- **E2E Tests**: Critical user journeys
- **Performance Tests**: <3s load time, <1MB bundle size

## 🧪 Testing Framework Setup

### Core Testing Stack

```json
{
  "dependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "vitest": "^1.0.0",
    "jsdom": "^23.0.0",
    "msw": "^2.0.0",
    "playwright": "^1.40.0"
  }
}
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "**/*.d.ts", "**/*.config.*"],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Test Setup Configuration

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
import { expect, afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./mocks/server";

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

## 🧩 Unit Testing

### Component Testing Patterns

```typescript
// src/components/course/CourseCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CourseCard } from "./CourseCard";
import { mockCourse } from "@/test/mocks/data";

describe("CourseCard", () => {
  const defaultProps = {
    course: mockCourse,
    onEnroll: vi.fn(),
    onViewDetails: vi.fn(),
  };

  it("renders course information correctly", () => {
    render(<CourseCard {...defaultProps} />);

    expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.description)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.difficulty)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.duration)).toBeInTheDocument();
  });

  it("calls onEnroll when enroll button is clicked", async () => {
    const user = userEvent.setup();
    render(<CourseCard {...defaultProps} />);

    const enrollButton = screen.getByRole("button", { name: /enroll/i });
    await user.click(enrollButton);

    expect(defaultProps.onEnroll).toHaveBeenCalledWith(mockCourse.id);
  });

  it("displays enrollment status correctly", () => {
    const enrolledCourse = { ...mockCourse, enrolled: true };
    render(<CourseCard {...defaultProps} course={enrolledCourse} />);

    expect(screen.getByText(/enrolled/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /enroll/i })
    ).not.toBeInTheDocument();
  });

  it("shows progress bar for enrolled courses", () => {
    const courseWithProgress = {
      ...mockCourse,
      enrolled: true,
      progress: { progress: 65, completedContent: [1, 2, 3] },
    };

    render(<CourseCard {...defaultProps} course={courseWithProgress} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
  });
});
```

### Hook Testing

```typescript
// src/hooks/useUserProgress.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useUserProgress } from "./useUserProgress";
import * as appData from "@/lib/appData";

vi.mock("@/lib/appData");

describe("useUserProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with default progress state", () => {
    const { result } = renderHook(() => useUserProgress());

    expect(result.current.progress).toEqual({
      totalCourses: 15,
      completedCourses: 0,
      overallProgress: 0,
      timeSpent: 0,
      achievements: [],
      skillLevels: {},
      enrolledCourses: [],
    });
  });

  it("updates course progress correctly", async () => {
    const mockUpdateProgress = vi.spyOn(appData, "updateCourseProgress");
    const { result } = renderHook(() => useUserProgress());

    await act(async () => {
      result.current.updateProgress(1, 2);
    });

    expect(mockUpdateProgress).toHaveBeenCalledWith(1, 2, true);
  });

  it("enrolls in course and updates state", async () => {
    const mockEnrollInCourse = vi.spyOn(appData, "enrollInCourse");
    const { result } = renderHook(() => useUserProgress());

    await act(async () => {
      result.current.enrollCourse(1);
    });

    expect(mockEnrollInCourse).toHaveBeenCalledWith(1);
    expect(result.current.progress.enrolledCourses.length).toBeGreaterThan(0);
  });
});
```

### Utility Function Testing

```typescript
// src/lib/appData.test.ts
import { describe, it, expect } from "vitest";
import {
  getAllPhases,
  getCourseById,
  calculateOverallProgress,
  searchCourses,
} from "./appData";

describe("appData utilities", () => {
  describe("getAllPhases", () => {
    it("returns all three phases", () => {
      const phases = getAllPhases();
      expect(phases).toHaveLength(3);
      expect(phases[0].difficulty).toBe("Beginner");
      expect(phases[1].difficulty).toBe("Intermediate");
      expect(phases[2].difficulty).toBe("Advanced");
    });
  });

  describe("getCourseById", () => {
    it("returns correct course for valid ID", () => {
      const course = getCourseById(1);
      expect(course).toBeDefined();
      expect(course?.id).toBe(1);
    });

    it("returns undefined for invalid ID", () => {
      const course = getCourseById(999);
      expect(course).toBeUndefined();
    });
  });

  describe("calculateOverallProgress", () => {
    it("calculates progress correctly", () => {
      const enrolledCourses = [
        { id: 1, progress: { progress: 100 } },
        { id: 2, progress: { progress: 50 } },
        { id: 3, progress: { progress: 0 } },
      ];

      const progress = calculateOverallProgress(enrolledCourses);
      expect(progress).toBe(50); // (100 + 50 + 0) / 3
    });

    it("returns 0 for no enrolled courses", () => {
      const progress = calculateOverallProgress([]);
      expect(progress).toBe(0);
    });
  });

  describe("searchCourses", () => {
    it("finds courses by title", () => {
      const results = searchCourses("Network");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain("Network");
    });

    it("returns empty array for no matches", () => {
      const results = searchCourses("NonExistentCourse");
      expect(results).toHaveLength(0);
    });
  });
});
```

## 🔗 Integration Testing

### API Integration Tests

```typescript
// src/test/integration/course-enrollment.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { App } from "@/App";
import { BrowserRouter } from "react-router-dom";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";

describe("Course Enrollment Flow", () => {
  it("completes full enrollment process", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to courses page
    fireEvent.click(screen.getByText(/courses/i));

    // Find and click on a course
    await waitFor(() => {
      expect(
        screen.getByText("Network Security Fundamentals")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Network Security Fundamentals"));

    // Enroll in course
    fireEvent.click(screen.getByRole("button", { name: /enroll/i }));

    // Verify enrollment success
    await waitFor(() => {
      expect(screen.getByText(/successfully enrolled/i)).toBeInTheDocument();
    });

    // Verify navigation to enrolled course
    fireEvent.click(screen.getByText(/start learning/i));

    await waitFor(() => {
      expect(screen.getByTestId("video-player")).toBeInTheDocument();
      expect(screen.getByTestId("ai-playground")).toBeInTheDocument();
    });
  });

  it("handles enrollment failure gracefully", async () => {
    // Mock enrollment failure
    server.use(
      http.post("/api/courses/enroll", () => {
        return HttpResponse.json(
          { error: "Enrollment failed" },
          { status: 400 }
        );
      })
    );

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Attempt enrollment
    fireEvent.click(screen.getByText(/courses/i));
    fireEvent.click(screen.getByText("Network Security Fundamentals"));
    fireEvent.click(screen.getByRole("button", { name: /enroll/i }));

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/enrollment failed/i)).toBeInTheDocument();
    });
  });
});
```

### Data Flow Integration Tests

```typescript
// src/test/integration/progress-tracking.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EnrolledCoursePage } from "@/pages/EnrolledCoursePage";
import { AppProvider } from "@/contexts/AppContext";
import { mockCourseWithContent } from "@/test/mocks/data";

describe("Progress Tracking Integration", () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(<AppProvider>{component}</AppProvider>);
  };

  it("updates progress when video is completed", async () => {
    renderWithProvider(<EnrolledCoursePage courseId={1} />);

    const videoPlayer = screen.getByTestId("video-player");

    // Simulate video completion
    fireEvent(videoPlayer, new CustomEvent("ended"));

    await waitFor(() => {
      expect(screen.getByText(/progress updated/i)).toBeInTheDocument();
    });

    // Check progress bar update
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "20"); // 1 of 5 completed
  });

  it("unlocks achievements on milestone completion", async () => {
    renderWithProvider(<EnrolledCoursePage courseId={1} />);

    // Complete first content item
    fireEvent.click(screen.getByText(/mark as complete/i));

    await waitFor(() => {
      expect(screen.getByText(/achievement unlocked/i)).toBeInTheDocument();
      expect(screen.getByText(/first lesson complete/i)).toBeInTheDocument();
    });
  });
});
```

## 🎭 Component Testing

### Interactive Component Tests

```typescript
// src/components/terminal/AIPlayground.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AIPlayground } from "./AIPlayground";
import { mockCourse, mockContent } from "@/test/mocks/data";

describe("AIPlayground", () => {
  const defaultProps = {
    courseContext: mockCourse,
    currentContent: mockContent,
    mode: "terminal" as const,
    onModeChange: vi.fn(),
  };

  it("renders terminal mode by default", () => {
    render(<AIPlayground {...defaultProps} />);

    expect(screen.getByTestId("terminal-interface")).toBeInTheDocument();
    expect(screen.getByText(/hack@theworld:~$/)).toBeInTheDocument();
  });

  it("switches between modes correctly", async () => {
    render(<AIPlayground {...defaultProps} />);

    // Switch to chat mode
    fireEvent.click(screen.getByRole("button", { name: /chat/i }));

    await waitFor(() => {
      expect(defaultProps.onModeChange).toHaveBeenCalledWith("chat");
    });
  });

  it("executes terminal commands", async () => {
    render(<AIPlayground {...defaultProps} />);

    const commandInput = screen.getByPlaceholderText(/enter command/i);
    fireEvent.change(commandInput, { target: { value: "ls -la" } });
    fireEvent.submit(commandInput.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/total 8/)).toBeInTheDocument();
      expect(screen.getByText(/drwxr-xr-x/)).toBeInTheDocument();
    });
  });

  it("provides context-aware suggestions", async () => {
    render(<AIPlayground {...defaultProps} />);

    const commandInput = screen.getByPlaceholderText(/enter command/i);
    fireEvent.change(commandInput, { target: { value: "nmap" } });

    await waitFor(() => {
      expect(screen.getByText(/network mapping tool/i)).toBeInTheDocument();
      expect(screen.getByText(/try: nmap -sS target/i)).toBeInTheDocument();
    });
  });
});
```

### Game Component Tests

```typescript
// src/components/games/SecurityGame.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SecurityGame } from "./SecurityGame";
import { mockGame } from "@/test/mocks/data";

describe("SecurityGame", () => {
  const defaultProps = {
    game: mockGame,
    onComplete: vi.fn(),
    onExit: vi.fn(),
  };

  it("starts game correctly", async () => {
    render(<SecurityGame {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /start game/i }));

    await waitFor(() => {
      expect(screen.getByText(mockGame.title)).toBeInTheDocument();
      expect(screen.getByTestId("game-interface")).toBeInTheDocument();
    });
  });

  it("tracks score correctly", async () => {
    render(<SecurityGame {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /start game/i }));

    // Simulate correct answer
    fireEvent.click(screen.getByTestId("correct-answer"));

    await waitFor(() => {
      expect(screen.getByText(/score: 100/i)).toBeInTheDocument();
    });
  });

  it("completes game and calls onComplete", async () => {
    render(<SecurityGame {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /start game/i }));

    // Answer all questions correctly
    const questions = screen.getAllByTestId("game-question");
    for (const question of questions) {
      fireEvent.click(
        question.querySelector('[data-testid="correct-answer"]')!
      );
    }

    await waitFor(() => {
      expect(defaultProps.onComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          score: expect.any(Number),
          completed: true,
        })
      );
    });
  });
});
```

## 🌐 End-to-End Testing

### Playwright E2E Tests

```typescript
// e2e/learning-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Complete Learning Flow", () => {
  test("user can complete full learning journey", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // Verify landing page elements
    await expect(page.locator('[data-testid="matrix-rain"]')).toBeVisible();
    await expect(page.getByText("Hack The World")).toBeVisible();

    // Navigate to courses
    await page.click("text=Explore Courses");

    // Select beginner phase
    await page.click('[data-phase="1"]');

    // Enroll in first course
    await page.click(".course-card:first-child .enroll-button");

    // Verify enrollment success
    await expect(page.getByText("Successfully enrolled")).toBeVisible();

    // Start learning
    await page.click("text=Start Learning");

    // Verify split-screen interface
    await expect(page.locator('[data-testid="video-player"]')).toBeVisible();
    await expect(page.locator('[data-testid="ai-playground"]')).toBeVisible();

    // Interact with video player
    await page.click('[data-testid="play-button"]');

    // Wait for video to progress
    await page.waitForTimeout(5000);

    // Interact with AI playground
    await page.click('[data-testid="terminal-tab"]');
    await page.fill('[data-testid="terminal-input"]', "help");
    await page.press('[data-testid="terminal-input"]', "Enter");

    // Verify terminal response
    await expect(page.getByText("Available commands:")).toBeVisible();

    // Mark content as complete
    await page.click('[data-testid="mark-complete"]');

    // Verify progress update
    await expect(page.locator(".progress-bar")).toHaveAttribute(
      "aria-valuenow",
      "20"
    );

    // Navigate to dashboard
    await page.click("text=Dashboard");

    // Verify progress in dashboard
    await expect(page.getByText("1 course in progress")).toBeVisible();
    await expect(page.locator(".achievement-notification")).toBeVisible();
  });

  test("handles offline scenario gracefully", async ({ page, context }) => {
    // Start online
    await page.goto("/courses/1/learn");

    // Go offline
    await context.setOffline(true);

    // Try to load new content
    await page.click('[data-testid="next-content"]');

    // Verify offline message
    await expect(page.getByText("You are currently offline")).toBeVisible();
    await expect(
      page.getByText("Progress will sync when reconnected")
    ).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Verify auto-sync
    await expect(page.getByText("Connection restored")).toBeVisible();
  });
});
```

### Performance E2E Tests

```typescript
// e2e/performance.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Performance Tests", () => {
  test("homepage loads within performance budget", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");

    // Wait for main content to load
    await page.waitForSelector('[data-testid="hero-section"]');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Under 3 seconds

    // Check bundle size
    const response = await page.request.get("/assets/index.js");
    const content = await response.body();
    expect(content.length).toBeLessThan(1024 * 1024); // Under 1MB
  });

  test("video player loads and plays smoothly", async ({ page }) => {
    await page.goto("/courses/1/learn");

    // Measure video load time
    const videoLoadStart = Date.now();
    await page.click('[data-testid="play-button"]');

    // Wait for video to start playing
    await page.waitForFunction(() => {
      const video = document.querySelector("video");
      return video && !video.paused && video.currentTime > 0;
    });

    const videoLoadTime = Date.now() - videoLoadStart;
    expect(videoLoadTime).toBeLessThan(2000); // Video starts within 2 seconds
  });
});
```

## 📊 Test Data Management

### Mock Data Factory

```typescript
// src/test/mocks/data.ts
import type { Course, Phase, User, Achievement } from "@/types";

export const createMockCourse = (overrides: Partial<Course> = {}): Course => ({
  id: 1,
  title: "Network Security Fundamentals",
  description: "Learn the basics of network security",
  duration: "4 hours",
  difficulty: "Beginner",
  image: "/mock-course-image.jpg",
  instructor: "Dr. Jane Doe",
  rating: 4.5,
  enrollmentCount: 1250,
  skills: ["Network Security", "Firewalls", "VPNs"],
  content: [
    {
      id: 1,
      type: "video",
      title: "Introduction to Network Security",
      duration: "15 min",
      videoUrl: "/mock-video.mp4",
      completed: false,
    },
  ],
  ...overrides,
});

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: "1",
  name: "Test User",
  email: "test@example.com",
  avatar: "/mock-avatar.jpg",
  joinedAt: new Date("2024-01-01"),
  ...overrides,
});

export const createMockProgress = (overrides = {}) => ({
  totalCourses: 15,
  completedCourses: 3,
  overallProgress: 20,
  timeSpent: 7200, // 2 hours in seconds
  achievements: [],
  skillLevels: {
    "Network Security": 2,
    "Ethical Hacking": 1,
  },
  enrolledCourses: [createMockCourse()],
  ...overrides,
});
```

### MSW API Mocking

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { createMockCourse, createMockProgress } from "./data";

export const handlers = [
  // Course endpoints
  http.get("/api/courses", () => {
    return HttpResponse.json([
      createMockCourse({ id: 1 }),
      createMockCourse({ id: 2, title: "Advanced Penetration Testing" }),
      createMockCourse({ id: 3, title: "Cryptography Essentials" }),
    ]);
  }),

  http.get("/api/courses/:id", ({ params }) => {
    const courseId = parseInt(params.id as string);
    return HttpResponse.json(createMockCourse({ id: courseId }));
  }),

  http.post("/api/courses/enroll", async ({ request }) => {
    const { courseId } = await request.json();
    return HttpResponse.json({
      success: true,
      message: "Successfully enrolled",
      courseId,
    });
  }),

  // Progress endpoints
  http.get("/api/progress", () => {
    return HttpResponse.json(createMockProgress());
  }),

  http.post("/api/progress/update", async ({ request }) => {
    const { courseId, contentId } = await request.json();
    return HttpResponse.json({
      success: true,
      courseId,
      contentId,
      newProgress: 25,
    });
  }),

  // Achievement endpoints
  http.get("/api/achievements", () => {
    return HttpResponse.json([
      {
        id: "first-lesson",
        title: "First Lesson Complete",
        description: "Complete your first lesson",
        unlocked: true,
        unlockedAt: new Date(),
      },
    ]);
  }),
];
```

## 📈 Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "pnpm"

      - run: pnpm install

      - run: pnpm run type-check

      - run: pnpm run lint

      - run: pnpm run test:unit
        env:
          CI: true

      - run: pnpm run test:coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "pnpm"

      - run: pnpm install

      - run: npx playwright install

      - run: pnpm run build

      - run: pnpm run test:e2e

      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## 🎯 Test Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:unit": "vitest run --reporter=verbose",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:watch": "vitest --watch",
    "test:debug": "vitest --inspect-brk --no-coverage"
  }
}
```

## 📋 Testing Checklist

### Pre-commit Checklist

- [ ] All unit tests pass
- [ ] Code coverage >90%
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Component tests cover user interactions
- [ ] Mock data is realistic

### Pre-release Checklist

- [ ] All test suites pass
- [ ] E2E tests cover critical paths
- [ ] Performance tests meet targets
- [ ] Accessibility tests pass
- [ ] Cross-browser testing complete
- [ ] Mobile responsiveness tested

### Post-deployment Checklist

- [ ] Production smoke tests pass
- [ ] Real user monitoring active
- [ ] Error tracking configured
- [ ] Performance monitoring setup
- [ ] User feedback collection active

---

**Testing Framework**: Vitest + Testing Library + Playwright
**Coverage Target**: >90%
**Last Updated**: December 2024
