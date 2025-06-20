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
  useGetCurrentUserQuery: vi.fn(),
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

// Import mocked authApi dynamically
interface MockedAuthApi {
  useLoginMutation: ReturnType<typeof vi.fn>;
  useRegisterMutation: ReturnType<typeof vi.fn>;
  useLogoutMutation: ReturnType<typeof vi.fn>;
  useForgotPasswordMutation: ReturnType<typeof vi.fn>;
  useResetPasswordMutation: ReturnType<typeof vi.fn>;
  useGetCurrentUserQuery: ReturnType<typeof vi.fn>;
}

let mockAuthApi: MockedAuthApi;

describe("useAuthRTK", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();

    // Import mocked hooks dynamically
    mockAuthApi = (await import("@/features/auth/authApi")) as unknown as MockedAuthApi;

    // Default mock implementations
    mockAuthApi.useLoginMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    mockAuthApi.useRegisterMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    mockAuthApi.useLogoutMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    mockAuthApi.useForgotPasswordMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    mockAuthApi.useResetPasswordMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false, error: null, reset: vi.fn() },
    ]);
    mockAuthApi.useGetCurrentUserQuery.mockReturnValue({
      error: null,
      refetch: vi.fn(),
      isLoading: false,
      data: null,
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
      const mockMutation = vi.fn().mockResolvedValue({
        unwrap: () => Promise.resolve(mockAuthResponse),
      });

      mockAuthApi.useLoginMutation.mockReturnValue([
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
      const mockMutation = vi.fn().mockResolvedValue({
        unwrap: () => Promise.resolve({ success: true, message: "Logged out" }),
      });

      mockAuthApi.useLogoutMutation.mockReturnValue([
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
      const mockMutation = vi.fn().mockResolvedValue({
        unwrap: () =>
          Promise.resolve({ success: true, message: "Reset email sent" }),
      });

      mockAuthApi.useForgotPasswordMutation.mockReturnValue([
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
      const mockMutation = vi.fn().mockResolvedValue({
        unwrap: () => Promise.resolve(mockAuthResponse),
      });

      mockAuthApi.useResetPasswordMutation.mockReturnValue([
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
      mockAuthApi.useLoginMutation.mockReturnValue([
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
      const mockError = {
        data: { message: "Invalid credentials" },
      };
      const mockMutation = vi.fn().mockRejectedValue(mockError);

      mockAuthApi.useLoginMutation.mockReturnValue([
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
        } catch (error: unknown) {
          expect((error as Error).message).toBe("Invalid credentials");
        }
      });
    });
  });

  describe("Security Best Practices", () => {
    it("should never store user data in localStorage", async () => {
      const mockMutation = vi.fn().mockResolvedValue({
        unwrap: () => Promise.resolve(mockAuthResponse),
      });

      mockAuthApi.useRegisterMutation.mockReturnValue([
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
