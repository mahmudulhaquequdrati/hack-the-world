import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAPI, resetMocks } from "../../test/mocks/api";
import { renderWithRouter } from "../../test/utils/testUtils";
import Login from "../Login";

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMocks();
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        setItem: vi.fn(),
        getItem: vi.fn(() => null),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      renderWithRouter(<Login />);
      expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
    });

    it("should display login form elements", () => {
      renderWithRouter(<Login />);

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login/i })
      ).toBeInTheDocument();
    });

    it("should display cybersecurity themed styling", () => {
      renderWithRouter(<Login />);

      expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should validate required fields", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      });
    });

    it("should validate password field", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      await user.type(screen.getByLabelText(/username/i), "admin");

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it("should validate minimum password length", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      await user.type(screen.getByLabelText(/username/i), "admin");
      await user.type(screen.getByLabelText(/password/i), "123");

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Authentication", () => {
    it("should login successfully with valid credentials", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          user: { username: "admin", role: "admin" },
          token: "mock-token",
        },
      };

      mockAPI.auth.login.mockResolvedValue(mockResponse);

      renderWithRouter(<Login />);

      await user.type(screen.getByLabelText(/username/i), "admin");
      await user.type(screen.getByLabelText(/password/i), "password123");

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(mockAPI.auth.login).toHaveBeenCalledWith({
          username: "admin",
          password: "password123",
        });
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "adminUser",
        JSON.stringify({
          user: { username: "admin", role: "admin" },
          token: "mock-token",
        })
      );

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should handle invalid credentials", async () => {
      const user = userEvent.setup();
      mockAPI.auth.login.mockRejectedValue({
        response: { data: { message: "Invalid credentials" } },
      });

      renderWithRouter(<Login />);

      await user.type(screen.getByLabelText(/username/i), "admin");
      await user.type(screen.getByLabelText(/password/i), "wrongpassword");

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });

      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should handle network errors", async () => {
      const user = userEvent.setup();
      mockAPI.auth.login.mockRejectedValue(new Error("Network error"));

      renderWithRouter(<Login />);

      await user.type(screen.getByLabelText(/username/i), "admin");
      await user.type(screen.getByLabelText(/password/i), "password123");

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });
    });
  });

  describe("Loading States", () => {
    it("should show loading state during authentication", async () => {
      const user = userEvent.setup();

      // Mock a delayed response
      mockAPI.auth.login.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  success: true,
                  data: { user: { username: "admin" }, token: "token" },
                }),
              100
            )
          )
      );

      renderWithRouter(<Login />);

      await user.type(screen.getByLabelText(/username/i), "admin");
      await user.type(screen.getByLabelText(/password/i), "password123");

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      // Should show loading state
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
      expect(loginButton).toBeDisabled();

      // Wait for loading to complete
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("should disable form during loading", async () => {
      const user = userEvent.setup();

      mockAPI.auth.login.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderWithRouter(<Login />);

      await user.type(screen.getByLabelText(/username/i), "admin");
      await user.type(screen.getByLabelText(/password/i), "password123");

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      // Form should be disabled
      expect(screen.getByLabelText(/username/i)).toBeDisabled();
      expect(screen.getByLabelText(/password/i)).toBeDisabled();
      expect(loginButton).toBeDisabled();
    });
  });

  describe("User Experience", () => {
    it("should clear error messages when user starts typing", async () => {
      const user = userEvent.setup();
      mockAPI.auth.login.mockRejectedValue({
        response: { data: { message: "Invalid credentials" } },
      });

      renderWithRouter(<Login />);

      // Trigger error
      await user.type(screen.getByLabelText(/username/i), "admin");
      await user.type(screen.getByLabelText(/password/i), "wrong");

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });

      // Start typing - error should clear
      await user.clear(screen.getByLabelText(/password/i));
      await user.type(screen.getByLabelText(/password/i), "new");

      expect(
        screen.queryByText(/Invalid credentials/i)
      ).not.toBeInTheDocument();
    });

    it("should support enter key submission", async () => {
      const user = userEvent.setup();
      mockAPI.auth.login.mockResolvedValue({
        success: true,
        data: { user: { username: "admin" }, token: "token" },
      });

      renderWithRouter(<Login />);

      await user.type(screen.getByLabelText(/username/i), "admin");
      await user.type(screen.getByLabelText(/password/i), "password123");

      // Press Enter
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(mockAPI.auth.login).toHaveBeenCalled();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper form labels", () => {
      renderWithRouter(<Login />);

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("should have proper form structure", () => {
      renderWithRouter(<Login />);

      const form = screen.getByRole("form");
      expect(form).toBeInTheDocument();
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      await user.tab();
      expect(screen.getByLabelText(/username/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/password/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("button", { name: /login/i })).toHaveFocus();
    });

    it("should announce errors to screen readers", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/username is required/i);
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute("role", "alert");
      });
    });
  });

  describe("Security", () => {
    it("should not expose sensitive data in DOM", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, "secretpassword");

      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should clear password on error", async () => {
      const user = userEvent.setup();
      mockAPI.auth.login.mockRejectedValue({
        response: { data: { message: "Invalid credentials" } },
      });

      renderWithRouter(<Login />);

      await user.type(screen.getByLabelText(/username/i), "admin");
      await user.type(screen.getByLabelText(/password/i), "wrongpassword");

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });

      // Password field should be cleared for security
      expect(screen.getByLabelText(/password/i)).toHaveValue("");
    });
  });
});
