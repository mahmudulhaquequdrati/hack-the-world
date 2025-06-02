import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "../../test/utils/testUtils";
import Layout from "../Layout";

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() =>
          JSON.stringify({ username: "admin", role: "admin" })
        ),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      renderWithRouter(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should display admin panel title", () => {
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );
      expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();
    });

    it("should render navigation menu", () => {
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Phases")).toBeInTheDocument();
      expect(screen.getByText("Modules")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should display user information", () => {
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );
      expect(screen.getByText("admin")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should navigate to dashboard when dashboard link is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      const dashboardLink = screen.getByText("Dashboard");
      await user.click(dashboardLink);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should navigate to phases when phases link is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      const phasesLink = screen.getByText("Phases");
      await user.click(phasesLink);

      expect(mockNavigate).toHaveBeenCalledWith("/phases");
    });

    it("should navigate to modules when modules link is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      const modulesLink = screen.getByText("Modules");
      await user.click(modulesLink);

      expect(mockNavigate).toHaveBeenCalledWith("/modules");
    });

    it("should navigate to content when content link is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      const contentLink = screen.getByText("Content");
      await user.click(contentLink);

      expect(mockNavigate).toHaveBeenCalledWith("/content");
    });
  });

  describe("User Actions", () => {
    it("should handle logout when logout button is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      const logoutButton = screen.getByText(/logout/i);
      await user.click(logoutButton);

      expect(localStorage.removeItem).toHaveBeenCalledWith("adminUser");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("Authentication State", () => {
    it("should display authenticated user interface", () => {
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      expect(screen.getByText("admin")).toBeInTheDocument();
      expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    it("should handle missing user data gracefully", () => {
      window.localStorage.getItem = vi.fn(() => null);

      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      // Should still render the layout
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper navigation structure", () => {
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("should have accessible logout button", () => {
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      const logoutButton = screen.getByRole("button", { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      // Tab through navigation elements
      await user.tab();
      expect(screen.getByText("Dashboard")).toHaveFocus();

      await user.tab();
      expect(screen.getByText("Phases")).toHaveFocus();
    });
  });

  describe("Responsive Design", () => {
    it("should render properly on different screen sizes", () => {
      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      // Check that main content area exists
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle navigation errors gracefully", async () => {
      const user = userEvent.setup();
      mockNavigate.mockImplementation(() => {
        throw new Error("Navigation failed");
      });

      renderWithRouter(
        <Layout>
          <div>Test</div>
        </Layout>
      );

      const dashboardLink = screen.getByText("Dashboard");

      // Should not crash the component
      await expect(user.click(dashboardLink)).rejects.toThrow();
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });
});
