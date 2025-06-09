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
        url: `/enrollments/enroll`,
        method: "POST",
        body: { moduleId },
      }),
      invalidatesTags: ["Enrollment", "Progress"],
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
  useUnenrollFromModuleMutation,
  useGetUserEnrollmentsQuery,
  useGetUserProgressQuery,
  useUpdateProgressMutation,
  useGetGamesByModuleQuery,
  useGetLabsByModuleQuery,
  useGetModuleOverviewQuery,
} = apiSlice;

export default apiSlice;
