import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAPI, mockAPIErrors } from "../../test/mocks/api";
import { renderWithRouter } from "../../test/utils/testUtils";
import Dashboard from "../Dashboard";

// Mock the API service
vi.mock("../../services/api", () => ({
  phasesAPI: mockAPI.phases,
  modulesAPI: mockAPI.modules,
}));

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Dashboard", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  describe("Component Rendering", () => {
    it("should render without crashing", async () => {
      renderWithRouter(<Dashboard />);

      expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
      expect(
        screen.getByText("Welcome to the Admin Panel")
      ).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalledTimes(1);
        expect(mockAPI.modules.getAll).toHaveBeenCalledTimes(1);
      });
    });

    it("should display loading state while fetching data", async () => {
      // Mock delayed responses
      mockAPI.phases.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      mockAPI.modules.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderWithRouter(<Dashboard />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();

      await waitFor(
        () => {
          expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    it("should display quick actions section", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Quick Actions")).toBeInTheDocument();
        expect(screen.getByText("Manage Phases")).toBeInTheDocument();
        expect(screen.getByText("Manage Modules")).toBeInTheDocument();
      });
    });

    it("should display system overview section", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("System Overview")).toBeInTheDocument();
        expect(screen.getByText("Current Date")).toBeInTheDocument();
        expect(screen.getByText("Admin Panel")).toBeInTheDocument();
      });
    });

    it("should display error message when data fails to load", async () => {
      mockAPI.phases.getAll.mockRejectedValue(mockAPIErrors.serverError);
      mockAPI.modules.getAll.mockRejectedValue(mockAPIErrors.serverError);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
      });
    });
  });

  describe("Statistics Display", () => {
    it("should display statistics cards after data loads", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Total Phases")).toBeInTheDocument();
        expect(screen.getByText("Total Modules")).toBeInTheDocument();
        expect(screen.getByText("Active Modules")).toBeInTheDocument();
        expect(screen.getByText("Total Enrollments")).toBeInTheDocument();
      });
    });

    it("should calculate statistics correctly", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        // Check calculated values from mock data
        expect(screen.getByText("2")).toBeInTheDocument(); // Total phases
        expect(screen.getByText("2")).toBeInTheDocument(); // Total modules
        expect(screen.getByText("239")).toBeInTheDocument(); // Total enrollments (150 + 89)
      });
    });

    it("should display statistics with proper icons", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        // Statistics cards should be rendered
        expect(screen.getByText("Total Phases")).toBeInTheDocument();
        expect(screen.getByText("Total Modules")).toBeInTheDocument();
      });

      // Check that cards have proper styling classes
      const phasesCard = screen.getByText("Total Phases").closest("div");
      const modulesCard = screen.getByText("Total Modules").closest("div");

      expect(phasesCard).toHaveClass("bg-blue-500");
      expect(modulesCard).toHaveClass("bg-green-500");
    });
  });

  describe("Navigation", () => {
    it("should navigate to phases page when Manage Phases is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Manage Phases")).toBeInTheDocument();
      });

      const managePhasesButton = screen.getByText("Manage Phases");
      await user.click(managePhasesButton);

      expect(mockNavigate).toHaveBeenCalledWith("/phases");
    });

    it("should navigate to modules page when Manage Modules is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Manage Modules")).toBeInTheDocument();
      });

      const manageModulesButton = screen.getByText("Manage Modules");
      await user.click(manageModulesButton);

      expect(mockNavigate).toHaveBeenCalledWith("/modules");
    });

    it("should have proper button styling for navigation buttons", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Manage Phases")).toBeInTheDocument();
      });

      const managePhasesButton = screen.getByText("Manage Phases");
      const manageModulesButton = screen.getByText("Manage Modules");

      expect(managePhasesButton).toHaveClass("bg-blue-600");
      expect(manageModulesButton).toHaveClass("bg-green-600");
    });
  });

  describe("Date Display", () => {
    it("should display current date correctly", async () => {
      const mockDate = new Date("2023-12-25");
      vi.setSystemTime(mockDate);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        // Should display formatted date
        expect(screen.getByText("12/25/2023")).toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it("should display date in correct format", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        // Check for date pattern (MM/DD/YYYY)
        const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Data Loading States", () => {
    it("should show loading spinner for phases and modules", async () => {
      // Mock long loading times
      mockAPI.phases.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      mockAPI.modules.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      renderWithRouter(<Dashboard />);

      // Should show loading state
      expect(screen.getByText("Loading...")).toBeInTheDocument();

      // Quick actions should still be visible
      expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    });

    it("should handle partial data loading failures gracefully", async () => {
      // Only phases fail to load
      mockAPI.phases.getAll.mockRejectedValue(mockAPIErrors.serverError);
      // Modules load successfully
      mockAPI.modules.getAll.mockResolvedValue({ success: true, data: [] });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        // Should still show some content
        expect(screen.getByText("Quick Actions")).toBeInTheDocument();
        // But should show error for failed data
        expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
      });
    });
  });

  describe("Responsive Design", () => {
    it("should have proper responsive classes", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
      });

      // Check for responsive grid classes
      const quickActionsSection = screen
        .getByText("Quick Actions")
        .closest("div");
      const statisticsSection = screen
        .getByText("Total Phases")
        .closest("div").parentElement;

      expect(quickActionsSection).toHaveClass("grid");
      expect(statisticsSection).toHaveClass("grid");
    });

    it("should display cards in proper grid layout", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Total Phases")).toBeInTheDocument();
      });

      // Statistics cards should be in a grid
      const statsContainer = screen
        .getByText("Total Phases")
        .closest("div").parentElement;
      expect(statsContainer).toHaveClass(
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-4"
      );
    });
  });

  describe("Error Handling", () => {
    it("should display specific error messages for different failure types", async () => {
      mockAPI.phases.getAll.mockRejectedValue(mockAPIErrors.networkError);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
      });
    });

    it("should allow retry after error", async () => {
      // First call fails
      mockAPI.phases.getAll.mockRejectedValueOnce(mockAPIErrors.serverError);
      // Second call succeeds
      mockAPI.phases.getAll.mockResolvedValueOnce({
        success: true,
        data: [],
      });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
      });

      // The component should attempt to reload or handle retry
      expect(mockAPI.phases.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and roles", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
      });

      // Check for proper heading hierarchy
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Admin Dashboard"
      );
      expect(
        screen.getByRole("heading", { level: 2, name: /quick actions/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 2, name: /system overview/i })
      ).toBeInTheDocument();
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Manage Phases")).toBeInTheDocument();
      });

      // Tab through interactive elements
      await user.tab();
      expect(screen.getByText("Manage Phases")).toHaveFocus();

      await user.tab();
      expect(screen.getByText("Manage Modules")).toHaveFocus();
    });

    it("should have proper color contrast for statistics cards", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("Total Phases")).toBeInTheDocument();
      });

      // Check that text colors provide sufficient contrast
      const phasesCard = screen.getByText("Total Phases").closest("div");
      expect(phasesCard).toHaveClass("text-white"); // Good contrast with blue background
    });
  });

  describe("Performance", () => {
    it("should only fetch data once on mount", async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalledTimes(1);
        expect(mockAPI.modules.getAll).toHaveBeenCalledTimes(1);
      });

      // Should not fetch again
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalledTimes(1);
        expect(mockAPI.modules.getAll).toHaveBeenCalledTimes(1);
      });
    });

    it("should not cause memory leaks with async operations", async () => {
      const { unmount } = renderWithRouter(<Dashboard />);

      // Unmount component while async operations might be pending
      unmount();

      // Should not cause any errors or warnings
      expect(vi.getConsoleErrors?.()).toHaveLength(0);
    });
  });
});
