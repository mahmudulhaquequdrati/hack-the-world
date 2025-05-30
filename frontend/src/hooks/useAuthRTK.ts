import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  useForgotPasswordMutation,
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useValidateTokenQuery,
  type APIErrorResponse,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from "@/features/auth/authApi";
import {
  clearAuth,
  logout as logoutAction,
  selectCurrentToken,
  selectCurrentUser,
  selectIsAuthenticated,
  setCredentials,
} from "@/features/auth/authSlice";

export const useAuthRTK = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // RTK Query hooks
  const [loginMutation, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation();
  const [
    registerMutation,
    { isLoading: isRegisterLoading, error: registerError },
  ] = useRegisterMutation();
  const [
    forgotPasswordMutation,
    { isLoading: isForgotPasswordLoading, error: forgotPasswordError },
  ] = useForgotPasswordMutation();
  const [
    resetPasswordMutation,
    { isLoading: isResetPasswordLoading, error: resetPasswordError },
  ] = useResetPasswordMutation();
  const [logoutMutation] = useLogoutMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Only run getCurrentUser query if we have a token
  const { error: getCurrentUserError, refetch: refetchCurrentUser } =
    useGetCurrentUserQuery(undefined, { skip: !token });

  // Only run validate token if we have a token
  const { data: tokenValidation, error: validateTokenError } =
    useValidateTokenQuery(undefined, { skip: !token });

  // Register function
  const register = useCallback(
    async (userData: RegisterRequest): Promise<AuthResponse> => {
      try {
        const result = await registerMutation(userData).unwrap();

        // Store credentials in Redux state
        dispatch(
          setCredentials({
            user: result.data.user,
            token: result.data.token,
          })
        );

        return result;
      } catch (error) {
        const errorData = error as {
          data?: APIErrorResponse;
          message?: string;
        };
        throw new Error(
          errorData?.data?.message ||
            errorData?.message ||
            "Registration failed"
        );
      }
    },
    [registerMutation, dispatch]
  );

  // Login function
  const login = useCallback(
    async (credentials: LoginRequest): Promise<AuthResponse> => {
      try {
        const result = await loginMutation(credentials).unwrap();

        // Store credentials in Redux state
        dispatch(
          setCredentials({
            user: result.data.user,
            token: result.data.token,
          })
        );

        return result;
      } catch (error) {
        const errorData = error as {
          data?: APIErrorResponse;
          message?: string;
        };
        throw new Error(
          errorData?.data?.message || errorData?.message || "Login failed"
        );
      }
    },
    [loginMutation, dispatch]
  );

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call logout endpoint
      await logoutMutation().unwrap();
    } catch {
      console.warn("Logout endpoint failed, clearing local state anyway");
    } finally {
      // Clear Redux state and localStorage
      dispatch(logoutAction());

      // Navigate to login page
      navigate("/login", { replace: true });
    }
  }, [logoutMutation, dispatch, navigate]);

  // Forgot password function
  const forgotPassword = useCallback(
    async (email: string): Promise<void> => {
      try {
        await forgotPasswordMutation({ email }).unwrap();
      } catch (error) {
        const errorData = error as {
          data?: APIErrorResponse;
          message?: string;
        };
        throw new Error(
          errorData?.data?.message ||
            errorData?.message ||
            "Failed to send reset email"
        );
      }
    },
    [forgotPasswordMutation]
  );

  // Reset password function
  const resetPassword = useCallback(
    async (resetToken: string, password: string): Promise<AuthResponse> => {
      try {
        const result = await resetPasswordMutation({
          token: resetToken,
          password,
        }).unwrap();

        // Store credentials in Redux state (user is automatically logged in after reset)
        dispatch(
          setCredentials({
            user: result.data.user,
            token: result.data.token,
          })
        );

        return result;
      } catch (error) {
        const errorData = error as {
          data?: APIErrorResponse;
          message?: string;
        };
        throw new Error(
          errorData?.data?.message ||
            errorData?.message ||
            "Password reset failed"
        );
      }
    },
    [resetPasswordMutation, dispatch]
  );

  // Get current user function
  const getCurrentUser = useCallback(async (): Promise<User> => {
    try {
      const result = await refetchCurrentUser().unwrap();
      return result.data.user;
    } catch (error) {
      const errorData = error as { data?: APIErrorResponse; message?: string };
      throw new Error(
        errorData?.data?.message ||
          errorData?.message ||
          "Failed to get user profile"
      );
    }
  }, [refetchCurrentUser]);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<string> => {
    if (!token) {
      throw new Error("No token to refresh");
    }

    try {
      const result = await refreshTokenMutation({ token }).unwrap();

      // Update token in state
      if (user) {
        dispatch(
          setCredentials({
            user,
            token: result.data.token,
          })
        );
      }

      return result.data.token;
    } catch (error) {
      // Clear auth state on refresh failure
      dispatch(clearAuth());
      const errorData = error as { data?: APIErrorResponse; message?: string };
      throw new Error(
        errorData?.data?.message || errorData?.message || "Token refresh failed"
      );
    }
  }, [refreshTokenMutation, dispatch, token, user]);

  // Validate token function
  const validateToken = useCallback(async (): Promise<boolean> => {
    if (!token) {
      return false;
    }

    try {
      return tokenValidation?.valid || false;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }, [token, tokenValidation]);

  // Clear error function
  const clearError = useCallback(() => {
    // Errors are handled by RTK Query, but we can provide a way to retry
    // In RTK Query, errors are cleared when the mutation is called again
  }, []);

  // Check if any operation is loading
  const isLoading =
    isLoginLoading ||
    isRegisterLoading ||
    isForgotPasswordLoading ||
    isResetPasswordLoading;

  // Get the first error from any operation
  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined
  ) => {
    if (!error) return null;

    // Handle FetchBaseQueryError (network/API errors)
    if ("data" in error) {
      const errorData = error.data as APIErrorResponse;
      return errorData?.message || "An error occurred";
    }

    // Handle SerializedError (other errors)
    if ("message" in error) {
      return error.message || "An error occurred";
    }

    return "An error occurred";
  };

  const error =
    getErrorMessage(loginError) ||
    getErrorMessage(registerError) ||
    getErrorMessage(forgotPasswordError) ||
    getErrorMessage(resetPasswordError) ||
    getErrorMessage(getCurrentUserError) ||
    getErrorMessage(validateTokenError);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    refreshToken,
    validateToken,
    clearError,

    // Additional RTK Query specific
    refetchCurrentUser,
  };
};

export default useAuthRTK;
