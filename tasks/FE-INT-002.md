# FE-INT-002: Integrate Progress Tracking APIs

## 📋 Task Overview

**Task ID**: FE-INT-002
**Title**: Integrate Progress Tracking APIs
**Priority**: 🟡 High
**Status**: 📋 Not Started
**Assignee**: Developer
**Due Date**: January 24, 2025
**Estimated Hours**: 2-3 hours

## 🎯 Objective

Integrate user enrollment and progress tracking APIs with the frontend to provide real-time progress updates, enrollment management, and dashboard statistics. This connects the user's learning journey with the server-side tracking system.

## 🔧 Implementation Requirements

### 1. Create Progress API Integration

```typescript
// frontend/src/features/api/progressApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UserEnrollment {
  id: string;
  userId: string;
  moduleId: string;
  enrolledAt: string;
  completedAt?: string;
  isActive: boolean;
  progress: number; // 0-100
}

export interface UserProgress {
  id: string;
  userId: string;
  moduleId: string;
  contentId: string;
  status: "not_started" | "in_progress" | "completed";
  completedAt?: string;
  timeSpent: number; // in minutes
  lastAccessedAt: string;
}

export interface ProgressStats {
  totalModules: number;
  enrolledModules: number;
  completedModules: number;
  totalContent: number;
  completedContent: number;
  totalTimeSpent: number;
  averageProgress: number;
}

export const progressApi = createApi({
  reducerPath: "progressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Enrollment", "Progress"],
  endpoints: (builder) => ({
    // Enrollment endpoints
    enrollInModule: builder.mutation<
      { success: boolean; data: UserEnrollment },
      string
    >({
      query: (moduleId) => ({
        url: `/enrollment/${moduleId}`,
        method: "POST",
      }),
      invalidatesTags: ["Enrollment", "Progress"],
    }),
    getUserEnrollments: builder.query<
      { success: boolean; data: UserEnrollment[] },
      void
    >({
      query: () => "/enrollment",
      providesTags: ["Enrollment"],
    }),
    getModuleEnrollment: builder.query<
      { success: boolean; data: UserEnrollment },
      string
    >({
      query: (moduleId) => `/enrollment/${moduleId}`,
      providesTags: (result, error, moduleId) => [
        { type: "Enrollment", id: moduleId },
      ],
    }),

    // Progress endpoints
    updateContentProgress: builder.mutation<
      { success: boolean; data: UserProgress },
      {
        contentId: string;
        status: "in_progress" | "completed";
        timeSpent?: number;
      }
    >({
      query: ({ contentId, ...body }) => ({
        url: `/progress/${contentId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Progress", "Enrollment"],
    }),
    getModuleProgress: builder.query<
      { success: boolean; data: UserProgress[] },
      string
    >({
      query: (moduleId) => `/progress/module/${moduleId}`,
      providesTags: (result, error, moduleId) => [
        { type: "Progress", id: `module-${moduleId}` },
      ],
    }),
    getUserStats: builder.query<
      { success: boolean; data: ProgressStats },
      void
    >({
      query: () => "/progress/stats",
      providesTags: ["Progress"],
    }),
  }),
});

export const {
  useEnrollInModuleMutation,
  useGetUserEnrollmentsQuery,
  useGetModuleEnrollmentQuery,
  useUpdateContentProgressMutation,
  useGetModuleProgressQuery,
  useGetUserStatsQuery,
} = progressApi;
```

### 2. Update Module Card with Enrollment

```typescript
// frontend/src/components/course/ModuleCard.tsx
import {
  useEnrollInModuleMutation,
  useGetModuleEnrollmentQuery,
} from "@/features/api/progressApi";

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const { data: contentData, isLoading: contentLoading } =
    useGetContentByModuleQuery(module.id);
  const { data: enrollmentData, isLoading: enrollmentLoading } =
    useGetModuleEnrollmentQuery(module.id);
  const [enrollInModule, { isLoading: enrolling }] =
    useEnrollInModuleMutation();

  const content = contentData?.data || [];
  const enrollment = enrollmentData?.data;
  const isEnrolled = !!enrollment;

  const handleEnroll = async () => {
    try {
      await enrollInModule(module.id).unwrap();
      // Navigate to enrolled course page
      navigate(`/learn/${module.id}`);
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  const handleContinue = () => {
    navigate(`/learn/${module.id}`);
  };

  if (contentLoading || enrollmentLoading) {
    return <div className="animate-pulse h-48 bg-slate-700 rounded-lg"></div>;
  }

  return (
    <div className="bg-slate-800 border border-green-500/30 rounded-lg p-6">
      <h3 className="text-xl font-bold text-green-400 mb-2">{module.title}</h3>
      <p className="text-gray-300 mb-4">{module.description}</p>

      {/* Content Statistics */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Content:</span>
          <span className="text-white">{content.length} items</span>
        </div>
        {isEnrolled && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress:</span>
              <span className="text-green-400">{enrollment.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {isEnrolled ? (
        <div className="space-y-2">
          <button
            onClick={handleContinue}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded transition-colors"
          >
            Continue Learning
          </button>
          {enrollment.completedAt && (
            <div className="text-center text-sm text-green-400">
              ✅ Completed on{" "}
              {new Date(enrollment.completedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleEnroll}
          disabled={enrolling}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2 px-4 rounded transition-colors"
        >
          {enrolling ? "Enrolling..." : "Enroll Now"}
        </button>
      )}
    </div>
  );
};
```

### 3. Create Progress-Aware Content Viewer

```typescript
// frontend/src/components/enrolled/ContentViewer.tsx
import { useUpdateContentProgressMutation } from "@/features/api/progressApi";

interface ContentViewerProps {
  content: Content;
  progress?: UserProgress;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content, progress }) => {
  const [updateProgress] = useUpdateContentProgressMutation();
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  // Track time spent on content
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000 / 60)); // minutes
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startTime]);

  // Mark content as in progress when started
  useEffect(() => {
    if (progress?.status === "not_started") {
      updateProgress({
        contentId: content.id,
        status: "in_progress",
        timeSpent: 0,
      });
    }
  }, [content.id, progress?.status, updateProgress]);

  const handleComplete = async () => {
    try {
      await updateProgress({
        contentId: content.id,
        status: "completed",
        timeSpent: timeSpent + (progress?.timeSpent || 0),
      }).unwrap();
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const isCompleted = progress?.status === "completed";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-green-400">{content.title}</h2>
          <div className="flex items-center gap-2">
            {isCompleted && (
              <span className="text-green-400 text-sm">✅ Completed</span>
            )}
            <span className="text-gray-400 text-sm">
              {timeSpent + (progress?.timeSpent || 0)} min
            </span>
          </div>
        </div>
        <p className="text-gray-300">{content.description}</p>
      </div>

      {/* Content based on type */}
      {content.type === "video" && (
        <div className="space-y-4">
          {content.url ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={content.url}
                className="w-full h-full"
                allowFullScreen
                title={content.title}
                onLoad={() => {
                  // Mark as in progress when video loads
                  if (progress?.status === "not_started") {
                    updateProgress({
                      contentId: content.id,
                      status: "in_progress",
                    });
                  }
                }}
              />
            </div>
          ) : (
            <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Video URL not available</span>
            </div>
          )}
        </div>
      )}

      {content.type === "lab" && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">
              Lab Instructions
            </h3>
            <div className="text-gray-300 whitespace-pre-wrap mb-4">
              {content.instructions}
            </div>

            {/* Lab completion section */}
            <div className="border-t border-gray-600 pt-4">
              <h4 className="text-md font-semibold text-yellow-400 mb-2">
                Lab Completion
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                Have you completed all the lab exercises?
              </p>

              {!isCompleted && (
                <button
                  onClick={handleComplete}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded transition-colors"
                >
                  Mark Lab as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {content.type === "game" && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">
              Game Instructions
            </h3>
            <div className="text-gray-300 whitespace-pre-wrap mb-4">
              {content.instructions}
            </div>

            <div className="flex gap-3">
              <button className="bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded transition-colors">
                Start Game
              </button>

              {!isCompleted && (
                <button
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded transition-colors"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 4. Update Dashboard with Real Stats

```typescript
// frontend/src/pages/Dashboard.tsx
import {
  useGetUserStatsQuery,
  useGetUserEnrollmentsQuery,
} from "@/features/api/progressApi";

const Dashboard: React.FC = () => {
  const { data: statsData, isLoading: statsLoading } = useGetUserStatsQuery();
  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useGetUserEnrollmentsQuery();

  const stats = statsData?.data;
  const enrollments = enrollmentsData?.data || [];

  if (statsLoading || enrollmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-8">
          Learning Dashboard
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Enrolled Modules"
            value={stats?.enrolledModules || 0}
            total={stats?.totalModules || 0}
            color="blue"
            icon="📚"
          />
          <StatCard
            title="Completed Modules"
            value={stats?.completedModules || 0}
            total={stats?.enrolledModules || 0}
            color="green"
            icon="✅"
          />
          <StatCard
            title="Content Progress"
            value={stats?.completedContent || 0}
            total={stats?.totalContent || 0}
            color="yellow"
            icon="📊"
          />
          <StatCard
            title="Time Spent"
            value={`${stats?.totalTimeSpent || 0} min`}
            color="purple"
            icon="⏱️"
          />
        </div>

        {/* Overall Progress */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-green-400 mb-4">
            Overall Progress
          </h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Learning Progress</span>
            <span className="text-green-400">
              {stats?.averageProgress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats?.averageProgress || 0}%` }}
            />
          </div>
        </div>

        {/* Enrolled Modules */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">
            Your Enrolled Modules
          </h2>

          {enrollments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No enrolled modules yet.</p>
              <button
                onClick={() => navigate("/overview")}
                className="mt-4 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded transition-colors"
              >
                Explore Modules
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  total?: number;
  color: "blue" | "green" | "yellow" | "purple";
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  total,
  color,
  icon,
}) => {
  const colorClasses = {
    blue: "border-blue-500/30 text-blue-400",
    green: "border-green-500/30 text-green-400",
    yellow: "border-yellow-500/30 text-yellow-400",
    purple: "border-purple-500/30 text-purple-400",
  };

  return (
    <div
      className={`bg-slate-800 border rounded-lg p-4 ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {typeof value === "string"
              ? value
              : `${value}${total ? `/${total}` : ""}`}
          </div>
          <div className="text-sm text-gray-400">{title}</div>
        </div>
      </div>
    </div>
  );
};
```

### 5. Update Store Configuration

```typescript
// frontend/src/app/store.ts
import { progressApi } from "@/features/api/progressApi";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [progressApi.reducerPath]: progressApi.reducer, // Add progress API
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(contentApi.middleware)
      .concat(progressApi.middleware), // Add progress API middleware
});
```

## 🧪 Testing Requirements

### Integration Tests

```typescript
// frontend/src/features/api/__tests__/progressApi.test.ts
describe("Progress API", () => {
  it("should enroll user in module", async () => {
    const result = await store.dispatch(
      progressApi.endpoints.enrollInModule.initiate("test-module")
    );

    expect(result.data?.success).toBe(true);
    expect(result.data?.data.moduleId).toBe("test-module");
  });

  it("should update content progress", async () => {
    const result = await store.dispatch(
      progressApi.endpoints.updateContentProgress.initiate({
        contentId: "test-content",
        status: "completed",
        timeSpent: 30,
      })
    );

    expect(result.data?.success).toBe(true);
    expect(result.data?.data.status).toBe("completed");
  });

  it("should get user statistics", async () => {
    const result = await store.dispatch(
      progressApi.endpoints.getUserStats.initiate()
    );

    expect(result.data?.success).toBe(true);
    expect(result.data?.data).toHaveProperty("totalModules");
  });
});
```

## 🎯 Success Criteria

- [ ] Users can enroll in modules from frontend
- [ ] Progress tracking works in real-time
- [ ] Dashboard displays accurate statistics
- [ ] Content completion updates correctly
- [ ] Time tracking functions properly
- [ ] Enrollment status reflects across UI
- [ ] API integration handles errors gracefully
- [ ] Loading states provide good UX
- [ ] Progress persistence works correctly

## 🔗 Dependencies

**Depends on**: TRK-004 (Progress Tracking API)
**Blocks**: FE-ENH-001 (Enhanced Learning Interface)

## 📖 Notes

- Implements real-time progress tracking
- Provides comprehensive user statistics
- Handles enrollment and completion workflows
- Tracks time spent on content
- Maintains progress state across sessions
- Optimizes with RTK Query caching

**Benefits of Integrated Progress Tracking**:

- Real-time learning analytics
- Seamless enrollment experience
- Accurate progress visualization
- Time-based learning insights
- Enhanced user engagement
- Foundation for gamification features
