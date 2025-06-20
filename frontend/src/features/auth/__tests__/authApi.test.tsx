import { apiSlice } from "@/features/api/apiSlice";
import { configureStore } from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";
import { authApi } from "../authApi";
import authReducer from "../authSlice";

// Mock store setup
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState: initialState,
  });
};

// Wrapper component for RTK Query
const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

// Mock fetch with proper typing
const mockFetch = vi.fn() as MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  describe("changePassword", () => {
    it("should change password and return success message", async () => {
      const mockUser = {
        id: "user-123",
        username: "testuser",
        email: "test@example.com",
        profile: {
          firstName: "Test",
          lastName: "User",
        },
        experienceLevel: "beginner" as const,
        stats: {
          totalPoints: 0,
          level: 1,
          coursesCompleted: 0,
          labsCompleted: 0,
          gamesCompleted: 0,
          achievementsEarned: 0,
        },
        createdAt: "2023-01-01T00:00:00.000Z",
      };

      const initialState = {
        auth: {
          user: mockUser,
          token: "old-token",
          isAuthenticated: true,
        },
      };

      const store = createTestStore(initialState);

      // Mock successful password change response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: "Password updated successfully",
          data: {
            token: "new-token",
            expiresIn: "7d",
          },
        }),
      } as Response);

      const { result } = renderHook(() => authApi.useChangePasswordMutation(), {
        wrapper: createWrapper(store),
      });

      const [changePassword] = result.current;

      // Execute password change
      const passwordData = {
        currentPassword: "CurrentPass123!",
        newPassword: "NewPassword456!",
      };

      const response = await changePassword(passwordData);

      expect(response.data?.success).toBe(true);
      expect(response.data?.data?.token).toBe("new-token");

      // Verify API call was made correctly
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/profile/change-password"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(passwordData),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("should handle password change failure", async () => {
      const mockUser = {
        id: "user-123",
        username: "testuser",
        email: "test@example.com",
        profile: {
          firstName: "Test",
          lastName: "User",
        },
        experienceLevel: "beginner" as const,
        stats: {
          totalPoints: 0,
          level: 1,
          coursesCompleted: 0,
          labsCompleted: 0,
          gamesCompleted: 0,
          achievementsEarned: 0,
        },
        createdAt: "2023-01-01T00:00:00.000Z",
      };

      const initialState = {
        auth: {
          user: mockUser,
          token: "original-token",
          isAuthenticated: true,
        },
      };

      const store = createTestStore(initialState);

      // Mock failed password change response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          message: "Current password is incorrect",
        }),
      } as Response);

      const { result } = renderHook(() => authApi.useChangePasswordMutation(), {
        wrapper: createWrapper(store),
      });

      const [changePassword] = result.current;

      const passwordData = {
        currentPassword: "WrongPassword123!",
        newPassword: "NewPassword456!",
      };

      const response = await changePassword(passwordData);

      expect(response.error).toBeDefined();
    });
  });

  describe("other auth endpoints", () => {
    it("should handle login successfully", async () => {
      const store = createTestStore();

      const mockResponse = {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: "user-123",
            username: "testuser",
            email: "test@example.com",
            profile: {},
            experienceLevel: "beginner",
            stats: {
              totalPoints: 0,
              level: 1,
              coursesCompleted: 0,
              labsCompleted: 0,
              gamesCompleted: 0,
              achievementsEarned: 0,
            },
            createdAt: "2023-01-01T00:00:00.000Z",
          },
          token: "auth-token",
          expiresIn: "7d",
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const { result } = renderHook(() => authApi.useLoginMutation(), {
        wrapper: createWrapper(store),
      });

      const [login] = result.current;

      const loginData = {
        login: "testuser",
        password: "password123",
      };

      const response = await login(loginData).unwrap();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(loginData),
        })
      );
    });

    it("should handle registration successfully", async () => {
      const store = createTestStore();

      const mockResponse = {
        success: true,
        message: "Registration successful",
        data: {
          user: {
            id: "user-123",
            username: "newuser",
            email: "newuser@example.com",
            profile: {
              firstName: "New",
              lastName: "User",
            },
            experienceLevel: "beginner",
            stats: {
              totalPoints: 0,
              level: 1,
              coursesCompleted: 0,
              labsCompleted: 0,
              gamesCompleted: 0,
              achievementsEarned: 0,
            },
            createdAt: "2023-01-01T00:00:00.000Z",
          },
          token: "auth-token",
          expiresIn: "7d",
        },
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => authApi.useRegisterMutation(), {
        wrapper: createWrapper(store),
      });

      const [register] = result.current;

      const registerData = {
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        firstName: "New",
        lastName: "User",
      };

      const response = await register(registerData).unwrap();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(registerData),
        })
      );
    });
  });
});
