import { apiSlice } from "@/features/api/apiSlice";

// Types for authentication API
export interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
  };
  experienceLevel: "beginner" | "intermediate" | "advanced" | "expert";
  stats: {
    totalPoints: number;
    level: number;
    coursesCompleted: number;
    labsCompleted: number;
    gamesCompleted: number;
    achievementsEarned: number;
  };
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    expiresIn: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  experienceLevel?: "beginner" | "intermediate" | "advanced";
}

export interface LoginRequest {
  login: string; // username or email
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface APIErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    msg: string;
    value?: string;
  }>;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register endpoint
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // Login endpoint
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // Get current user endpoint
    getCurrentUser: builder.query<
      { success: true; data: { user: User } },
      void
    >({
      query: () => "/auth/me",
    }),

    // Refresh token endpoint
    refreshToken: builder.mutation<
      { success: true; data: { token: string; expiresIn: string } },
      RefreshTokenRequest
    >({
      query: (data) => ({
        url: "/auth/refresh",
        method: "POST",
        body: data,
      }),
    }),

    // Validate token endpoint
    validateToken: builder.query<
      {
        success: true;
        valid: true;
        data: {
          userId: string;
          username: string;
          role: string;
          expiresAt: string;
        };
      },
      void
    >({
      query: () => "/auth/validate-token",
    }),

    // Forgot password endpoint
    forgotPassword: builder.mutation<
      { success: true; message: string },
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password endpoint
    resetPassword: builder.mutation<AuthResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Logout endpoint
    logout: builder.mutation<{ success: true; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useValidateTokenQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
