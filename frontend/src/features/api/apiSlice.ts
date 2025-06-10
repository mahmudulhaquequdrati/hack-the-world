import { transformApiModuleToCourse } from "@/lib/dataTransformers";
import type { Course, GameData, LabData, Module, Phase } from "@/lib/types";
import type {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// API response types
interface ApiModuleResponse {
  id: string;
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
    id: string;
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
  ],
  endpoints: (builder) => ({
    // Phase Discovery endpoints
    getPhases: builder.query<Phase[], void>({
      query: () => "/phases",
      transformResponse: (response: { success: boolean; data: Phase[] }) =>
        response.data,
      providesTags: ["Phase"],
    }),

    // Get phases with modules and user progress populated - comprehensive query
    getPhasesWithModules: builder.query<Phase[], void>({
      query: () => "/modules/with-phases",
      transformResponse: (response: { success: boolean; data: Phase[] }) => {
        // Backend should return phases with modules, labs, games, and user progress
        return response.data;
      },
      providesTags: ["Phase", "Module", "Progress", "Enrollment"],
    }),

    getPhaseById: builder.query<Phase, string>({
      query: (phaseId) => `/phases/${phaseId}`,
      transformResponse: (response: { success: boolean; data: Phase }) =>
        response.data,
      providesTags: (result, error, phaseId) => [
        { type: "Phase", id: phaseId },
      ],
    }),

    // Module Organization endpoints
    getModules: builder.query<Module[], void>({
      query: () => "/modules",
      transformResponse: (response: { success: boolean; data: Module[] }) =>
        response.data,
      providesTags: ["Module"],
    }),

    getModulesByPhase: builder.query<Module[], string>({
      query: (phaseId) => `/modules/phase/${phaseId}`,
      transformResponse: (response: { success: boolean; data: Module[] }) =>
        response.data,
      providesTags: (result, error, phaseId) => [
        { type: "Module", id: phaseId },
      ],
    }),

    getModuleById: builder.query<Module, string>({
      query: (moduleId) => `/modules/${moduleId}`,
      transformResponse: (response: { success: boolean; data: Module }) =>
        response.data,
      providesTags: (result, error, moduleId) => [
        { type: "Module", id: moduleId },
      ],
    }),

    // Course Content endpoints - using modules API
    getCourseById: builder.query<Course, string>({
      query: (courseId) => `/modules/${courseId}`,
      transformResponse: (response: {
        success: boolean;
        data: ApiModuleResponse;
      }) => {
        return transformApiModuleToCourse(response.data);
      },
      providesTags: (result, error, courseId) => [
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
          id: string;
          status: string;
          progressPercentage: number;
          enrolledAt: string;
          moduleId: { id: string; title: string };
        } | null;
      },
      string
    >({
      query: (moduleId) => `/enrollments/module/${moduleId}`,
      transformResponse: (response: {
        success: boolean;
        data?: {
          id: string;
          status: string;
          progressPercentage: number;
          enrolledAt: string;
          moduleId: { id: string; title: string };
        };
        message?: string;
      }) => {
        // If no enrollment found, return null
        if (!response.success || !response.data) {
          return { success: false, data: null };
        }
        return { success: true, data: response.data };
      },
      providesTags: (result, error, moduleId) => [
        { type: "Enrollment", id: moduleId },
      ],
    }),

    unenrollFromModule: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (moduleId) => ({
        url: `/enrollments/unenroll`,
        method: "DELETE",
        body: { moduleId },
      }),
      invalidatesTags: ["Enrollment", "Progress"],
    }),

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
          id: string;
        }>;
      },
      void
    >({
      query: () => "/enrollments/user/me",
      providesTags: ["Enrollment"],
    }),

    getUserEnrollments: builder.query<
      { moduleId: string; enrolledAt: string; progress: number }[],
      void
    >({
      query: () => "/enrollments",
      providesTags: ["Enrollment"],
    }),

    // Progress Tracking endpoints
    getUserProgress: builder.query<
      { moduleId: string; progress: number; completedAt?: string }[],
      void
    >({
      query: () => "/progress",
      providesTags: ["Progress"],
    }),

    updateProgress: builder.mutation<
      { success: boolean },
      { moduleId: string; progress: number }
    >({
      query: ({ moduleId, progress }) => ({
        url: `/progress/${moduleId}`,
        method: "PUT",
        body: { progress },
      }),
      invalidatesTags: ["Progress"],
    }),

    // Content endpoints
    getGamesByModule: builder.query<{ [gameId: string]: GameData }, string>({
      query: (moduleId) => `/modules/${moduleId}/games`,
      providesTags: (result, error, moduleId) => [
        { type: "Course", id: `${moduleId}-games` },
      ],
    }),

    getLabsByModule: builder.query<{ [labId: string]: LabData }, string>({
      query: (moduleId) => `/modules/${moduleId}/labs`,
      providesTags: (result, error, moduleId) => [
        { type: "Course", id: `${moduleId}-labs` },
      ],
    }),

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
      providesTags: (result, error, moduleId) => [
        { type: "Course", id: `${moduleId}-overview` },
      ],
    }),

    // Get module content grouped by sections for enrolled course page
    getModuleContentGrouped: builder.query<
      {
        success: boolean;
        data: Record<
          string,
          Array<{
            id: string;
            title: string;
            description?: string;
            type: "video" | "lab" | "game" | "document";
            duration?: number;
            url?: string;
            instructions?: string;
            metadata?: Record<string, unknown>;
            order?: number;
          }>
        >;
      },
      string
    >({
      query: (moduleId) => `/content/module/${moduleId}/grouped`,
      providesTags: (result, error, moduleId) => [
        { type: "Course", id: `content-${moduleId}` },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPhasesQuery,
  useGetPhasesWithModulesQuery,
  useGetPhaseByIdQuery,
  useGetModulesQuery,
  useGetModulesByPhaseQuery,
  useGetModuleByIdQuery,
  useGetCourseByIdQuery,
  useEnrollInModuleMutation,
  useGetEnrollmentByModuleQuery,
  useUnenrollFromModuleMutation,
  useGetCurrentUserEnrollmentsQuery,
  useGetUserEnrollmentsQuery,
  useGetUserProgressQuery,
  useUpdateProgressMutation,
  useGetGamesByModuleQuery,
  useGetLabsByModuleQuery,
  useGetModuleOverviewQuery,
  useGetModuleContentGroupedQuery,
} = apiSlice;

export default apiSlice;
