import { apiSlice } from "@/features/api/apiSlice";
import authReducer from "@/features/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { useAuthRTK } from "../useAuthRTK";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock auth API hooks with simple vi.fn() implementations
vi.mock("@/features/auth/authApi", () => ({
  useLoginMutation: vi.fn(),
  useRegisterMutation: vi.fn(),
  useLogoutMutation: vi.fn(),
  useForgotPasswordMutation: vi.fn(),
  useResetPasswordMutation: vi.fn(),
  useRefreshTokenMutation: vi.fn(),
  useGetCurrentUserQuery: vi.fn(),
  useValidateTokenQuery: vi.fn(),
}));

// Mock data
const mockUser = {
  id: "user123",
  username: "testuser",
  email: "test@example.com",
  profile: {
    firstName: "Test",
    lastName: "User",
    displayName: "Test User",
    avatar: "",
  },
  experienceLevel: "beginner" as const,
  stats: {
    totalPoints: 100,
    level: 1,
    coursesCompleted: 0,
    labsCompleted: 0,
    gamesCompleted: 0,
    achievementsEarned: 0,
  },
  createdAt: "2023-01-01T00:00:00.000Z",
};

const mockAuthResponse = {
  success: true,
  message: "Login successful",
  data: {
    user: mockUser,
    token: "mock-jwt-token",
    expiresIn: "7d",
  },
};

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Test store factory
const createTestStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

// Test wrapper component
const createWrapper = () => {
  const store = createTestStore();
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("useAuthRTK", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();

    // Import mocked hooks
    const authApi = require("@/features/auth/authApi");

    // Default mock implementations
    authApi.useLoginMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    authApi.useRegisterMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    authApi.useLogoutMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    authApi.useForgotPasswordMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    authApi.useResetPasswordMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    authApi.useRefreshTokenMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    authApi.useGetCurrentUserQuery.mockReturnValue({
      error: null,
      refetch: vi.fn(),
      isLoading: false,
      data: null,
    });
    authApi.useValidateTokenQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  describe("Initial State", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() => useAuthRTK(), {
        wrapper: createWrapper(),
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should initialize with stored token only", () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === "hackToken") return "stored-token";
        return null;
      });

      const { result } = renderHook(() => useAuthRTK(), {
        wrapper: createWrapper(),
      });

      // Token should be loaded, but user should be null (will be fetched from API)
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBe("stored-token");
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe("Authentication Functions", () => {
    it("should handle successful login", async () => {
      const authApi = require("@/features/auth/authApi");
      const mockMutation = vi.fn().mockResolvedValue({
        unwrap: () => Promise.resolve(mockAuthResponse),
      });

      authApi.useLoginMutation.mockReturnValue([
        mockMutation,
        { isLoading: false, error: null, reset: vi.fn() },
      ]);

      const { result } = renderHook(() => useAuthRTK(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const response = await result.current.login({
          login: "test@example.com",
          password: "password123",
        });

        expect(response).toEqual(mockAuthResponse);
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "hackToken",
          "mock-jwt-token"
        );
        // User data should NOT be stored in localStorage
        expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
          "user",
          expect.any(String)
        );
      });
    });

    it("should handle logout", async () => {
      const authApi = require("@/features/auth/authApi");
      const mockMutation = vi.fn().mockResolvedValue({
        unwrap: () => Promise.resolve({ success: true, message: "Logged out" }),
      });

      authApi.useLogoutMutation.mockReturnValue([
        mockMutation,
        { isLoading: false, error: null, reset: vi.fn() },
      ]);

      const { result } = renderHook(() => useAuthRTK(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.logout();

        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("hackToken");
        // Should also clean up old token names
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("authToken");
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user");
        expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
      });
    });
  });

  describe("Password Reset Functions", () => {
    it("should handle forgot password", async () => {
      const authApi = require("@/features/auth/authApi");
      const mockMutation = vi.fn().mockResolvedValue({
        unwrap: () =>
          Promise.resolve({ success: true, message: "Reset email sent" }),
      });

      authApi.useForgotPasswordMutation.mockReturnValue([
        mockMutation,
        { isLoading: false, error: null, reset: vi.fn() },
      ]);

      const { result } = renderHook(() => useAuthRTK(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.forgotPassword("test@example.com");

        expect(mockMutation).toHaveBeenCalledWith({
          email: "test@example.com",
        });
      });
    });

    it("should handle reset password", async () => {
      const authApi = require("@/features/auth/authApi");
      const mockMutation = vi.fn().mockResolvedValue({
        unwrap: () => Promise.resolve(mockAuthResponse),
      });

      authApi.useResetPasswordMutation.mockReturnValue([
        mockMutation,
        { isLoading: false, error: null, reset: vi.fn() },
      ]);

      const { result } = renderHook(() => useAuthRTK(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const response = await result.current.resetPassword(
          "reset-token",
          "newpassword123"
        );

        expect(response).toEqual(mockAuthResponse);
        expect(mockMutation).toHaveBeenCalledWith({
          token: "reset-token",
          password: "newpassword123",
        });
      });
    });
  });

  describe("Loading States", () => {
    it("should track loading state correctly", () => {
      const authApi = require("@/features/auth/authApi");
      authApi.useLoginMutation.mockReturnValue([
        vi.fn(),
        { isLoading: true, error: null, reset: vi.fn() },
      ]);

      const { result } = renderHook(() => useAuthRTK(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle login errors correctly", async () => {
      const authApi = require("@/features/auth/authApi");
      const mockError = {
        data: { message: "Invalid credentials" },
      };
      const mockMutation = vi.fn().mockRejectedValue(mockError);

      authApi.useLoginMutation.mockReturnValue([
        mockMutation,
        { isLoading: false, error: mockError, reset: vi.fn() },
      ]);

      const { result } = renderHook(() => useAuthRTK(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.login({
            login: "test@example.com",
            password: "wrongpassword",
          });
        } catch (error) {
          expect(error.message).toBe("Invalid credentials");
        }
      });
    });
  });

  describe("Security Best Practices", () => {
    it("should never store user data in localStorage", async () => {
      const authApi = require("@/features/auth/authApi");
      const mockMutation = vi.fn().mockResolvedValue({
        unwrap: () => Promise.resolve(mockAuthResponse),
      });

      authApi.useRegisterMutation.mockReturnValue([
        mockMutation,
        { isLoading: false, error: null, reset: vi.fn() },
      ]);

      const { result } = renderHook(() => useAuthRTK(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.register({
          username: "newuser",
          email: "new@example.com",
          password: "password123",
          experienceLevel: "beginner",
        });

        // Only token should be stored
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "hackToken",
          "mock-jwt-token"
        );
        // User data should NEVER be stored in localStorage
        expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
          "user",
          expect.any(String)
        );
      });
    });

    it("should use hackToken as the token name", () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === "hackToken") return "test-token";
        return null;
      });

      renderHook(() => useAuthRTK(), {
        wrapper: createWrapper(),
      });

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("hackToken");
      expect(mockLocalStorage.getItem).not.toHaveBeenCalledWith("authToken");
    });
  });
});
