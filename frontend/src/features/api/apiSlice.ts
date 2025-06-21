import { transformApiModuleToCourse } from "@/lib/dataTransformers";
import type { Course, Phase } from "@/lib/types";
import type {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// API response types
interface ApiModuleResponse {
  _id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  difficulty: string;
  topics?: string[];
  phaseId?: string;
  content?: {
    videos: string[];
    labs: string[];
    games: string[];
    documents: string[];
    estimatedHours: number;
  };
  phase?: {
    _id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  };
  order?: number;
  isActive?: boolean;
  prerequisites?: string[];
  learningOutcomes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Helper to get accessToken from localStorage
const getAccessToken = () => {
  return localStorage.getItem("hackToken");
};

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  prepareHeaders: (headers, { endpoint }) => {
    // Public endpoints that don't need authorization
    const publicEndpoints = [
      "login",
      "register",
      "forgot-password",
      "reset-password",
      "getPhases",
      "getModules",
      "getModulesByPhase",
    ];

    // Add Authorization header for all non-public endpoints
    if (!publicEndpoints.includes(endpoint)) {
      const accessToken = getAccessToken();

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: Record<string, unknown>
  ) => {
    const result = await baseQuery(args, api, extraOptions);

    // Handle 401 unauthorized responses
    if ((result as { error?: FetchBaseQueryError })?.error?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("hackToken");
    }

    return result;
  },
  tagTypes: [
    "User",
    "Auth",
    "Phase",
    "Module",
    "Course",
    "Enrollment",
    "Progress",
    "Achievement",
    "Streak",
  ],
  endpoints: (builder) => ({
    // NOTE: getPhases removed - replaced by getPhasesWithModules for efficiency

    // Get phases with modules and user progress populated - comprehensive query
    getPhasesWithModules: builder.query<Phase[], void>({
      query: () => "/modules/with-phases",
      transformResponse: (response: { success: boolean; data: Phase[] }) => {
        // Backend should return phases with modules, labs, games, and user progress
        return response.data;
      },
      providesTags: ["Phase", "Module", "Progress", "Enrollment"],
    }),

    // NOTE: Individual phase/module queries removed - use comprehensive getPhasesWithModules instead

    // Course Content endpoints - using modules API
    getCourseById: builder.query<Course, string>({
      query: (courseId) => `/modules/${courseId}`,
      transformResponse: (response: {
        success: boolean;
        data: ApiModuleResponse;
      }) => {
        return transformApiModuleToCourse(response.data);
      },
      providesTags: (_result, _error, courseId) => [
        { type: "Course", id: courseId },
      ],
    }),

    // Enrollment endpoints
    enrollInModule: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (moduleId) => ({
        url: `/enrollments`,
        method: "POST",
        body: { moduleId },
      }),
      invalidatesTags: ["Enrollment", "Progress"],
    }),

    // Check enrollment status for a specific module
    getEnrollmentByModule: builder.query<
      {
        success: boolean;
        data: {
          _id: string;
          status: string;
          progressPercentage: number;
          enrolledAt: string;
          moduleId: { _id: string; title: string };
        } | null;
      },
      string
    >({
      query: (moduleId) => `/enrollments/module/${moduleId}`,
      transformResponse: (response: {
        success: boolean;
        data?: {
          _id: string;
          status: string;
          progressPercentage: number;
          enrolledAt: string;
          moduleId: { _id: string; title: string };
        };
        message?: string;
      }) => {
        // If no enrollment found, return null
        if (!response.success || !response.data) {
          return { success: false, data: null };
        }
        return { success: true, data: response.data };
      },
      providesTags: (_result, _error, moduleId) => [
        { type: "Enrollment", id: moduleId },
      ],
    }),

    // NOTE: unenrollFromModule removed - feature not implemented in UI

    // Get current user enrollments (without populate)
    getCurrentUserEnrollments: builder.query<
      {
        success: boolean;
        message: string;
        data: Array<{
          userId: string;
          moduleId: string;
          status: string;
          completedSections: number;
          totalSections: number;
          progressPercentage: number;
          estimatedCompletionDate: string | null;
          enrolledAt: string;
          lastAccessedAt: string;
          createdAt: string;
          updatedAt: string;
          isCompleted: boolean;
          isActive: boolean;
          _id: string;
        }>;
      },
      void
    >({
      query: () => "/enrollments/user/me",
      providesTags: ["Enrollment"],
    }),

    // NOTE: Basic progress endpoints removed - use content-specific progress tracking instead

    // T037: Removed deprecated progress endpoints - now handled by getContentWithModuleAndProgress
    // Deprecated: getContentProgress, startContent, updateContentProgress

    // Complete content mutation - kept for manual completion
    completeContent: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          _id: string;
          userId: string;
          contentId: {
            _id: string;
            title: string;
            type: string;
            section: string;
          };
          status: string;
          progressPercentage: number;
          startedAt: string;
          completedAt: string;
          score: number | null;
          maxScore: number | null;
        };
      },
      { contentId: string; score?: number; maxScore?: number }
    >({
      query: ({ contentId, score, maxScore }) => ({
        url: "/progress/content/complete",
        method: "POST",
        body: {
          contentId,
          ...(score !== undefined && { score }),
          ...(maxScore !== undefined && { maxScore }),
        },
      }),
      invalidatesTags: ["Progress"],
    }),

    getOverallProgress: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          overallStats: {
            totalModules: number;
            completedModules: number;
            inProgressModules: number;
            overallCompletionPercentage: number;
          };
          moduleProgress: Array<{
            module: {
              _id: string;
              title: string;
              description: string;
              difficulty: string;
              phase: string;
            };
            enrollment: {
              status: string;
              enrolledAt: string;
              progressPercentage: number;
            };
            content: {
              total: number;
              completed: number;
              inProgress: number;
              notStarted: number;
            };
          }>;
          contentStats: {
            totalContent: number;
            completedContent: number;
            inProgressContent: number;
            contentByType: {
              video: { total: number; completed: number };
              lab: { total: number; completed: number };
              game: { total: number; completed: number };
              document: { total: number; completed: number };
            };
          };
        };
      },
      string
    >({
      query: (userId) => `/progress/overview/${userId}`,
      providesTags: ["Progress"],
    }),

    getModuleProgress: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          module: {
            _id: string;
            title: string;
            description: string;
            difficulty: string;
            phase: string;
          };
          enrollment: {
            status: string;
            enrolledAt: string;
            progressPercentage: number;
          };
          content: Array<{
            _id: string;
            title: string;
            type: string;
            section: string;
            duration: number;
            progress: {
              status: string;
              progressPercentage: number;
              score: number | null;
              maxScore: number | null;
              startedAt: string;
              completedAt: string | null;
            } | null;
          }>;
          statistics: {
            totalContent: number;
            completedContent: number;
            inProgressContent: number;
            notStartedContent: number;
            completionPercentage: number;
            contentByType: {
              video: { total: number; completed: number };
              lab: { total: number; completed: number };
              game: { total: number; completed: number };
              document: { total: number; completed: number };
            };
          };
        };
      },
      { userId: string; moduleId: string }
    >({
      query: ({ userId, moduleId }) => `/progress/module/${userId}/${moduleId}`,
      providesTags: (_result, _error, { moduleId }) => [
        { type: "Progress", id: `module-${moduleId}` },
      ],
    }),

    getContentTypeProgress: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          content: Array<{
            _id: string;
            title: string;
            description: string;
            section: string;
            duration: number;
            module: {
              _id: string;
              title: string;
              difficulty: string;
              phase: string;
            };
            progress: {
              _id: string;
              status: string;
              progressPercentage: number;
              startedAt: string;
              completedAt: string | null;
              score: number | null;
              maxScore: number | null;
            } | null;
          }>;
          statistics: {
            total: number;
            completed: number;
            inProgress: number;
            notStarted: number;
            averageProgress: number;
          };
          modules: Array<{
            module: {
              _id: string;
              title: string;
            };
            enrollment: {
              status: string;
              enrolledAt: string;
            };
            content: Array<unknown>;
            statistics: {
              total: number;
              completed: number;
              inProgress: number;
              notStarted: number;
            };
          }>;
        };
      },
      {
        contentType: "video" | "lab" | "game" | "document";
        moduleId?: string;
        status?: "not-started" | "in-progress" | "completed";
      }
    >({
      query: ({ contentType, moduleId, status }) => {
        const params = new URLSearchParams();
        if (moduleId) params.append("moduleId", moduleId);
        if (status) params.append("status", status);

        return `/progress/content/me/${contentType}?${params.toString()}`;
      },
      providesTags: (_result, _error, { contentType }) => [
        { type: "Progress", id: `content-${contentType}` },
      ],
    }),

    // NOTE: Individual games/labs queries removed - use comprehensive content queries instead

    // Module overview endpoint for curriculum, labs, and games content
    getModuleOverview: builder.query<
      {
        [sectionName: string]: Array<{
          _id: string;
          type: "video" | "lab" | "game" | "text" | "quiz";
          title: string;
          description: string;
          section: string;
        }>;
      },
      string
    >({
      query: (moduleId) => `/content/module-overview/${moduleId}`,
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: {
          [sectionName: string]: Array<{
            _id: string;
            type: "video" | "lab" | "game" | "text" | "quiz";
            title: string;
            description: string;
            section: string;
          }>;
        };
      }) => response.data,
      providesTags: (_result, _error, moduleId) => [
        { type: "Course", id: `${moduleId}-overview` },
      ],
    }),

    // NOTE: Basic content queries removed - use optimized versions instead

    // T005/T012: Get optimized content list for lazy loading (reduced payload)
    getModuleContentGroupedOptimized: builder.query<
      {
        success: boolean;
        message: string;
        data: Record<
          string,
          Array<{
            contentId: string; // Real MongoDB ObjectId for progress tracking
            contentTitle: string;
            contentType: "video" | "lab" | "game" | "document";
            sectionTitle: string;
            duration?: number;
          }>
        >;
      },
      string
    >({
      query: (moduleId) => `/content/module/${moduleId}/grouped-optimized`,
      providesTags: (_result, _error, moduleId) => [
        { type: "Course", id: `optimized-content-${moduleId}` },
      ],
    }),

    // NOTE: Navigation context query removed - navigation handled client-side for better performance

    // T032: Get content with module and progress in one API call
    getContentWithModuleAndProgress: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          content: {
            _id: string;
            title: string;
            description?: string;
            type: "video" | "lab" | "game" | "document";
            url?: string;
            instructions?: string;
            duration?: number;
            section: string;
          };
          module: {
            _id: string;
            title: string;
            description: string;
            icon: string;
            color: string;
            difficulty: string;
          };
          progress: {
            _id?: string;
            status: "not-started" | "in-progress" | "completed";
            progressPercentage: number;
            startedAt?: string;
            completedAt?: string;
            score?: number;
            maxScore?: number;
            wasStarted: boolean;
          };
        };
      },
      string
    >({
      query: (contentId) => `/content/${contentId}/with-module-and-progress`,
      providesTags: (_result, _error, contentId) => [
        { type: "Course", id: `content-progress-${contentId}` },
        { type: "Progress", id: contentId },
      ],
    }),

    // NOTE: Individual content query removed - use getContentWithModuleAndProgress for comprehensive data

    // Achievement endpoints
    getUserAchievements: builder.query<
      {
        success: boolean;
        data: Array<{
          _id: string;
          slug: string;
          title: string;
          description: string;
          category: "module" | "lab" | "game" | "xp" | "general";
          requirements: {
            type: string;
            target: number;
            resource: string;
          };
          rewards: {
            xp: number;
            badge?: string;
            title?: string;
          };
          icon: string;
          difficulty: string;
          userProgress: {
            progress: number;
            target: number;
            progressPercentage: number;
            isCompleted: boolean;
            completedAt: string | null;
            earnedRewards: {
              xp: number;
              badge?: string;
              title?: string;
            };
          };
        }>;
        stats: {
          total: number;
          completed: number;
          percentage: number;
          totalXP: number;
        };
      },
      void
    >({
      query: () => "/achievements/user",
      providesTags: ["Achievement"],
    }),

    // NOTE: Achievement stats removed - basic achievements sufficient for current UI

    // Streak endpoints
    getStreakStatus: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          currentStreak: number;
          longestStreak: number;
          streakStatus: 'start' | 'active' | 'at_risk' | 'broken';
          daysSinceLastActivity: number | null;
          lastActivityDate: string | null;
        };
      },
      void
    >({
      query: () => "/streak/status",
      providesTags: ["Streak"],
    }),

    // NOTE: Streak mutations and leaderboard removed - read-only streak status sufficient for current UI

    // OPTIMIZED: Consolidated dashboard endpoint - reduces 4 API calls to 1
    getDashboardData: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          enrollments: Array<{
            userId: string;
            moduleId: string;
            status: string;
            completedSections: number;
            totalSections: number;
            progressPercentage: number;
            estimatedCompletionDate: string | null;
            enrolledAt: string;
            lastAccessedAt: string;
            createdAt: string;
            updatedAt: string;
            isCompleted: boolean;
            isActive: boolean;
            _id: string;
          }>;
          phases: Phase[];
          achievements: Array<{
            _id: string;
            slug: string;
            title: string;
            description: string;
            category: "module" | "lab" | "game" | "xp" | "general";
            requirements: {
              type: string;
              target: number;
              resource: string;
            };
            rewards: {
              xp: number;
              badge?: string;
              title?: string;
            };
            icon: string;
            difficulty: string;
            userProgress: {
              progress: number;
              target: number;
              progressPercentage: number;
              isCompleted: boolean;
              completedAt: string | null;
              earnedRewards: {
                xp: number;
                badge?: string;
                title?: string;
              };
            };
          }>;
          streak: {
            currentStreak: number;
            longestStreak: number;
            streakStatus: 'start' | 'active' | 'at_risk' | 'broken';
            daysSinceLastActivity: number | null;
            lastActivityDate: string | null;
          };
        };
      },
      void
    >({
      query: () => "/dashboard/comprehensive",
      providesTags: ["User", "Enrollment", "Progress", "Achievement", "Streak"],
    }),

    // OPTIMIZED: Consolidated course detail endpoint - reduces 3-4 API calls to 1
    getCourseDetailComplete: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          course: {
            _id: string;
            title: string;
            description: string;
            icon: string;
            duration: string;
            difficulty: string;
            topics?: string[];
            prerequisites?: string[];
            learningOutcomes?: string[];
            content?: {
              videos: string[];
              labs: string[];
              games: string[];
              documents: string[];
              estimatedHours: number;
            };
            phase?: {
              _id: string;
              title: string;
              description: string;
              icon: string;
              color: string;
              order: number;
            };
            order?: number;
            isActive?: boolean;
            createdAt?: string;
            updatedAt?: string;
          };
          enrollment: {
            _id: string;
            status: string;
            progressPercentage: number;
            enrolledAt: string;
            moduleId: { _id: string; title: string };
          } | null;
          moduleOverview?: {
            [sectionName: string]: Array<{
              _id: string;
              type: "video" | "lab" | "game" | "text" | "quiz";
              title: string;
              description: string;
              section: string;
            }>;
          };
        };
      },
      { courseId: string; includeOverview?: boolean }
    >({
      query: ({ courseId, includeOverview = false }) => 
        `/course/${courseId}/complete?includeOverview=${includeOverview}`,
      providesTags: (_result, _error, { courseId }) => [
        { type: "Course", id: courseId },
        { type: "Enrollment", id: courseId },
      ],
    }),
  }),
});

// Export hooks for usage in components - OPTIMIZED (removed unused endpoints)
export const {
  // Core optimized endpoints
  useGetPhasesWithModulesQuery,
  useGetCourseByIdQuery,
  
  // Enrollment management
  useEnrollInModuleMutation,
  useGetEnrollmentByModuleQuery,
  useGetCurrentUserEnrollmentsQuery,
  
  // Content management - optimized endpoints only
  useGetModuleOverviewQuery,
  useGetModuleContentGroupedOptimizedQuery,
  useGetContentWithModuleAndProgressQuery,
  useCompleteContentMutation,
  
  // Progress tracking - comprehensive endpoints
  useGetOverallProgressQuery,
  useGetModuleProgressQuery,
  useGetContentTypeProgressQuery,
  
  // User features
  useGetUserAchievementsQuery,
  useGetStreakStatusQuery,
  
  // OPTIMIZED: Consolidated endpoints
  useGetDashboardDataQuery,
  useGetCourseDetailCompleteQuery,
} = apiSlice;

export default apiSlice;
