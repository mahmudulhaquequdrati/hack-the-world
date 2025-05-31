import type { RootState } from "@/app/store";
import { apiSlice } from "@/features/api/apiSlice";
import { setCredentials, updateUser } from "./authSlice";

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
    bio?: string;
    location?: string;
    website?: string;
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

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateAvatarRequest {
  avatar: string;
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
      providesTags: ["User"],
      // Sync RTK Query data with Redux state
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data?.user) {
            dispatch(updateUser(data.data.user));
          }
        } catch {
          // Error is handled by the component
        }
      },
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

    // Update profile endpoint
    updateProfile: builder.mutation<
      { success: true; message: string; data: { user: User } },
      UpdateProfileRequest
    >({
      query: (data) => ({
        url: "/profile/basic",
        method: "PUT",
        body: data,
      }),
      // Optimistic update with proper Redux sync
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        // 1. Optimistically update RTK Query cache
        const patchResult = dispatch(
          authApi.util.updateQueryData("getCurrentUser", undefined, (draft) => {
            if (draft.data?.user?.profile) {
              Object.assign(draft.data.user.profile, patch);
            }
          })
        );

        try {
          // 2. Wait for the actual API call to complete
          const { data } = await queryFulfilled;

          // 3. Update Redux auth state with the server response
          if (data.data?.user) {
            dispatch(updateUser(data.data.user));
          }
        } catch {
          // 4. Rollback optimistic update if the API call fails
          patchResult.undo();
        }
      },
      invalidatesTags: ["User"],
    }),

    // Change password endpoint
    changePassword: builder.mutation<
      {
        success: true;
        message: string;
        data: { token: string; expiresIn: string };
      },
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: "/profile/change-password",
        method: "PUT",
        body: data,
      }),
      // Handle token refresh after password change
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;

          // Update the token in auth state
          if (data.data?.token) {
            // Get current user from state to avoid losing user data
            const currentState = getState() as RootState;
            const currentUser = currentState.auth.user;

            if (currentUser) {
              dispatch(
                setCredentials({
                  user: currentUser,
                  token: data.data.token,
                })
              );
            }
          }
        } catch {
          // Error is handled by the component
        }
      },
    }),

    // Update avatar endpoint
    updateAvatar: builder.mutation<
      { success: true; message: string; data: { user: User } },
      UpdateAvatarRequest
    >({
      query: (data) => ({
        url: "/profile/avatar",
        method: "PUT",
        body: data,
      }),
      // Optimistic update for avatar with proper Redux sync
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        // 1. Optimistically update RTK Query cache
        const patchResult = dispatch(
          authApi.util.updateQueryData("getCurrentUser", undefined, (draft) => {
            if (draft.data?.user?.profile) {
              draft.data.user.profile.avatar = patch.avatar;
            }
          })
        );

        try {
          // 2. Wait for the actual API call to complete
          const { data } = await queryFulfilled;

          // 3. Update Redux auth state with the server response
          if (data.data?.user) {
            dispatch(updateUser(data.data.user));
          }
        } catch {
          // 4. Rollback optimistic update if the API call fails
          patchResult.undo();
        }
      },
      invalidatesTags: ["User"],
    }),

    // Get profile stats endpoint
    getProfileStats: builder.query<
      {
        success: true;
        data: {
          stats: User["stats"];
          experienceLevel: User["experienceLevel"];
          username: string;
        };
      },
      void
    >({
      query: () => "/profile/stats",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdateAvatarMutation,
  useGetProfileStatsQuery,
} = authApi;
