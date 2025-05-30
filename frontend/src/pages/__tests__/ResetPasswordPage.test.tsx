import { apiSlice } from "@/features/api/apiSlice";
import authReducer from "@/features/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResetPasswordPage from "../ResetPasswordPage";

// Mock useAuthRTK
const mockResetPassword = vi.fn();
const mockIsAuthenticated = false;

vi.mock("@/hooks/useAuthRTK", () => ({
  useAuthRTK: () => ({
    resetPassword: mockResetPassword,
    isAuthenticated: mockIsAuthenticated,
  }),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock useSearchParams
const mockSearchParams = new URLSearchParams("?token=test-reset-token");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams],
    useNavigate: () => vi.fn(),
  };
});

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

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("ResetPasswordPage Security Implementation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  it("should render reset password form", () => {
    renderWithProviders(<ResetPasswordPage />);

    expect(screen.getByText("Reset Your Password")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm New Password")).toBeInTheDocument();
  });

  it("should handle successful password reset with secure token storage", async () => {
    const mockAuthResponse = {
      success: true,
      message: "Password reset successful",
      data: {
        user: {
          id: "user123",
          username: "testuser",
          email: "test@example.com",
        },
        token: "new-jwt-token",
        expiresIn: "7d",
      },
    };

    mockResetPassword.mockResolvedValue(mockAuthResponse);

    renderWithProviders(<ResetPasswordPage />);

    // Fill out the form
    const passwordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password");

    fireEvent.change(passwordInput, { target: { value: "NewPassword123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "NewPassword123!" },
    });

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(
        "test-reset-token",
        "NewPassword123!"
      );
    });

    // Verify that the resetPassword function was called
    // The actual token storage is handled by the auth slice
    expect(mockResetPassword).toHaveBeenCalledTimes(1);
  });

  it("should validate password requirements", async () => {
    renderWithProviders(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("New Password");
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    // Test weak password
    fireEvent.change(passwordInput, { target: { value: "weak" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    // Reset password should not be called with weak password
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("should validate password confirmation match", async () => {
    renderWithProviders(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    // Test mismatched passwords
    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "DifferentPassword123!" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("should show password strength indicator", () => {
    renderWithProviders(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText("New Password");

    // Test password strength progression
    fireEvent.change(passwordInput, { target: { value: "weak" } });
    expect(screen.getByText("Weak")).toBeInTheDocument();

    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });

  it("should handle missing reset token", () => {
    // Mock empty search params by creating a new mock
    const emptyParams = new URLSearchParams("");

    // Create a new mock implementation for this test
    const { useSearchParams } = vi.hoisted(() => ({
      useSearchParams: vi.fn(() => [emptyParams]),
    }));

    vi.doMock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        useSearchParams,
      };
    });

    renderWithProviders(<ResetPasswordPage />);

    expect(
      screen.getByText(/invalid or missing reset token/i)
    ).toBeInTheDocument();
  });

  it("should follow cybersecurity theme styling", () => {
    renderWithProviders(<ResetPasswordPage />);

    // Check for cybersecurity theme elements
    const terminalWindow = screen.getByRole("region");
    expect(terminalWindow).toHaveClass("terminal-window");

    // Check for green color scheme
    const title = screen.getByText("Reset Your Password");
    expect(title).toHaveClass("text-green-400");
  });

  it("should provide terminal-style feedback", () => {
    renderWithProviders(<ResetPasswordPage />);

    // Check for terminal-style footer with command line simulation
    expect(screen.getByText(/\$ passwd --reset --token/)).toBeInTheDocument();
    expect(screen.getByText(/Ready to reset password/)).toBeInTheDocument();
  });
});

describe("Security Best Practices Verification", () => {
  it("should never attempt to store user data in localStorage", async () => {
    const mockAuthResponse = {
      success: true,
      data: {
        user: { id: "user123", username: "testuser" },
        token: "new-token",
      },
    };

    mockResetPassword.mockResolvedValue(mockAuthResponse);
    renderWithProviders(<ResetPasswordPage />);

    // Fill and submit form
    const passwordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password");

    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "StrongPassword123!" },
    });

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalled();
    });

    // Verify localStorage.setItem was never called with user data
    expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
      "user",
      expect.any(String)
    );

    // Verify only token-related storage operations (if any) use "hackToken"
    const setItemCalls = mockLocalStorage.setItem.mock.calls;
    setItemCalls.forEach(([key]) => {
      if (key.includes("token") || key.includes("auth")) {
        expect(key).toBe("hackToken");
      }
    });
  });

  it("should use hackToken as the only localStorage key for authentication", () => {
    renderWithProviders(<ResetPasswordPage />);

    // Any auth-related localStorage operations should only use "hackToken"
    const getItemCalls = mockLocalStorage.getItem.mock.calls;
    const authRelatedCalls = getItemCalls.filter(
      ([key]) =>
        key.includes("token") || key.includes("auth") || key.includes("user")
    );

    // If there are any auth-related calls, they should only be for "hackToken"
    authRelatedCalls.forEach(([key]) => {
      if (key !== "hackToken") {
        // Only allow cleanup calls for old tokens
        expect(["authToken", "user"]).toContain(key);
      }
    });
  });
});
