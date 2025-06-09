import type { Course, GameData, LabData, Module, Phase } from "@/lib/types";
import type {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
      providesTags: ["Phase"],
    }),

    getPhaseById: builder.query<Phase, string>({
      query: (phaseId) => `/phases/${phaseId}`,
      providesTags: (result, error, phaseId) => [
        { type: "Phase", id: phaseId },
      ],
    }),

    // Module Organization endpoints
    getModules: builder.query<Module[], void>({
      query: () => "/modules",
      providesTags: ["Module"],
    }),

    getModulesByPhase: builder.query<Module[], string>({
      query: (phaseId) => `/phases/${phaseId}/modules`,
      providesTags: (result, error, phaseId) => [
        { type: "Module", id: phaseId },
      ],
    }),

    getModuleById: builder.query<Module, string>({
      query: (moduleId) => `/modules/${moduleId}`,
      providesTags: (result, error, moduleId) => [
        { type: "Module", id: moduleId },
      ],
    }),

    // Course Content endpoints
    getCourseById: builder.query<Course, string>({
      query: (courseId) => `/courses/${courseId}`,
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
  }),
});

// Export hooks for usage in components
export const {
  useGetPhasesQuery,
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
} = apiSlice;

export default apiSlice;
