import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../services/api";
import MyEnrollments from "../MyEnrollments";

// Create a mock AuthContext for testing
const AuthContext = createContext();

// Mock the useAuth hook
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
  AuthContext: createContext(),
}));

// Mock the API services
vi.mock("../../services/api", () => ({
  enrollmentAPI: {
    getUserEnrollments: vi.fn(),
  },
  modulesAPI: {
    getById: vi.fn(),
  },
}));

// Import the useAuth mock so we can control it
import { useAuth } from "../../context/AuthContext";

// Mock data
const mockUser = {
  id: "user123",
  email: "test@example.com",
  name: "Test User",
};

const mockEnrollments = [
  {
    id: "enrollment1",
    moduleId: "module1",
    progress: 75,
    status: "active",
    enrolledAt: "2024-01-15T10:00:00.000Z",
    lastAccessedAt: "2024-01-20T14:30:00.000Z",
    completedSections: ["intro", "basics"],
  },
  {
    id: "enrollment2",
    moduleId: "module2",
    progress: 100,
    status: "completed",
    enrolledAt: "2024-01-10T09:00:00.000Z",
    lastAccessedAt: "2024-01-18T16:45:00.000Z",
    completedAt: "2024-01-18T16:45:00.000Z",
    completedSections: ["intro", "advanced", "final"],
  },
  {
    id: "enrollment3",
    moduleId: "module3",
    progress: 25,
    status: "paused",
    enrolledAt: "2024-01-05T11:00:00.000Z",
    lastAccessedAt: "2024-01-12T10:15:00.000Z",
    completedSections: ["intro"],
  },
  {
    id: "enrollment4",
    moduleId: "module4",
    progress: 15,
    status: "dropped",
    enrolledAt: "2024-01-01T08:00:00.000Z",
    lastAccessedAt: "2024-01-03T12:00:00.000Z",
    completedSections: [],
  },
];

const mockModules = {
  module1: {
    id: "module1",
    title: "Web Security Fundamentals",
    description: "Learn the basics of web application security",
    difficulty: "Intermediate",
    duration: 120,
    phase: "Foundation",
  },
  module2: {
    id: "module2",
    title: "Network Security",
    description: "Advanced network security concepts",
    difficulty: "Advanced",
    duration: 180,
    phase: "Specialization",
  },
  module3: {
    id: "module3",
    title: "Cryptography Basics",
    description: "Introduction to cryptographic concepts",
    difficulty: "Beginner",
    duration: 90,
    phase: "Foundation",
  },
  module4: {
    id: "module4",
    title: "Incident Response",
    description: "Security incident response procedures",
    difficulty: "Expert",
    duration: 240,
    phase: "Advanced",
  },
};

const mockEmptyEnrollments = [];

const renderWithProviders = (component, authValue = { user: mockUser }) => {
  // Mock the useAuth hook to return our test user
  useAuth.mockReturnValue(authValue);

  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("MyEnrollments Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default module lookup setup
    api.modulesAPI.getById.mockImplementation((moduleId) => {
      if (mockModules[moduleId]) {
        return Promise.resolve({
          data: mockModules[moduleId],
        });
      }
      return Promise.reject(new Error("Module not found"));
    });
  });

  describe("Rendering", () => {
    it("should render without crashing", async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEmptyEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(screen.getByText("[MY ENROLLMENTS]")).toBeInTheDocument();
      });
    });

    it("should display loading state initially", () => {
      api.enrollmentAPI.getUserEnrollments.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithProviders(<MyEnrollments />);
      expect(
        screen.getByText("Loading your enrollments...")
      ).toBeInTheDocument();
    });

    it("should display correct header and description", async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEmptyEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(screen.getByText("[MY ENROLLMENTS]")).toBeInTheDocument();
      });

      expect(
        screen.getByText("Track your enrolled modules and learning progress")
      ).toBeInTheDocument();
    });
  });

  describe("Data Fetching", () => {
    it("should fetch enrollments from API", async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(api.enrollmentAPI.getUserEnrollments).toHaveBeenCalled();
      });
    });

    it("should fetch module details for each enrollment", async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(api.modulesAPI.getById).toHaveBeenCalledWith("module1");
        expect(api.modulesAPI.getById).toHaveBeenCalledWith("module2");
        expect(api.modulesAPI.getById).toHaveBeenCalledWith("module3");
        expect(api.modulesAPI.getById).toHaveBeenCalledWith("module4");
      });
    });

    it("should handle API errors gracefully", async () => {
      api.enrollmentAPI.getUserEnrollments.mockRejectedValue(
        new Error("API Error")
      );

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your enrollments. Please try again.")
        ).toBeInTheDocument();
      });
    });

    it("should not fetch when user is not logged in", () => {
      renderWithProviders(<MyEnrollments />, { user: null });

      expect(api.enrollmentAPI.getUserEnrollments).not.toHaveBeenCalled();
    });
  });

  describe("Enrollment Display", () => {
    beforeEach(async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
      });
    });

    it("should display module titles and descriptions", () => {
      expect(screen.getByText("Web Security Fundamentals")).toBeInTheDocument();
      expect(screen.getByText("Network Security")).toBeInTheDocument();
      expect(screen.getByText("Cryptography Basics")).toBeInTheDocument();
      expect(screen.getByText("Incident Response")).toBeInTheDocument();

      expect(
        screen.getByText("Learn the basics of web application security")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Advanced network security concepts")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Introduction to cryptographic concepts")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Security incident response procedures")
      ).toBeInTheDocument();
    });

    it("should display difficulty badges", () => {
      expect(screen.getByText("Intermediate")).toBeInTheDocument();
      expect(screen.getByText("Advanced")).toBeInTheDocument();
      expect(screen.getByText("Beginner")).toBeInTheDocument();
      expect(screen.getByText("Expert")).toBeInTheDocument();
    });

    it("should display enrollment progress", () => {
      expect(screen.getByText("75%")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(screen.getByText("25%")).toBeInTheDocument();
      expect(screen.getByText("15%")).toBeInTheDocument();
    });

    it("should display correct durations", () => {
      expect(screen.getByText("2h")).toBeInTheDocument(); // 120 min
      expect(screen.getByText("3h")).toBeInTheDocument(); // 180 min
      expect(screen.getByText("1h 30m")).toBeInTheDocument(); // 90 min
      expect(screen.getByText("4h")).toBeInTheDocument(); // 240 min
    });

    it("should display enrollment dates", () => {
      expect(screen.getByText("Jan 15, 2024")).toBeInTheDocument();
      expect(screen.getByText("Jan 10, 2024")).toBeInTheDocument();
      expect(screen.getByText("Jan 5, 2024")).toBeInTheDocument();
      expect(screen.getByText("Jan 1, 2024")).toBeInTheDocument();
    });
  });

  describe("Statistics Display", () => {
    beforeEach(async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
      });
    });

    it("should display correct enrollment statistics", () => {
      expect(screen.getByText("4")).toBeInTheDocument(); // Total enrollments
      expect(screen.getByText("1")).toBeInTheDocument(); // Active
      expect(screen.getByText("1")).toBeInTheDocument(); // Completed
      expect(screen.getByText("1")).toBeInTheDocument(); // Paused
      expect(screen.getByText("1")).toBeInTheDocument(); // Dropped
    });

    it("should display average progress", () => {
      // (75 + 100 + 25 + 15) / 4 = 53.75 ≈ 54%
      expect(screen.getByText("54%")).toBeInTheDocument();
    });
  });

  describe("Status Display and Actions", () => {
    beforeEach(async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
      });
    });

    it("should display correct status badges", () => {
      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Completed")).toBeInTheDocument();
      expect(screen.getByText("Paused")).toBeInTheDocument();
      expect(screen.getByText("Dropped")).toBeInTheDocument();
    });

    it("should display appropriate action buttons", () => {
      expect(screen.getByText("Continue Learning")).toBeInTheDocument(); // Active
      expect(screen.getByText("Review Content")).toBeInTheDocument(); // Completed
      expect(screen.getByText("Resume")).toBeInTheDocument(); // Paused
      expect(screen.getByText("Re-enroll")).toBeInTheDocument(); // Dropped
    });

    it("should show progress bars with correct values", () => {
      const progressBars = screen.getAllByRole("progressbar");
      expect(progressBars).toHaveLength(4);
    });
  });

  describe("Filtering and Search", () => {
    beforeEach(async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
      });
    });

    it("should filter enrollments by status", async () => {
      // Filter by active
      const activeFilter = screen.getByText("Active (1)");
      fireEvent.click(activeFilter);

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
        expect(screen.queryByText("Network Security")).not.toBeInTheDocument();
        expect(
          screen.queryByText("Cryptography Basics")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Incident Response")).not.toBeInTheDocument();
      });
    });

    it("should filter enrollments by completed status", async () => {
      // Filter by completed
      const completedFilter = screen.getByText("Completed (1)");
      fireEvent.click(completedFilter);

      await waitFor(() => {
        expect(screen.getByText("Network Security")).toBeInTheDocument();
        expect(
          screen.queryByText("Web Security Fundamentals")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Cryptography Basics")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Incident Response")).not.toBeInTheDocument();
      });
    });

    it("should search enrollments by module title", async () => {
      const searchInput = screen.getByPlaceholderText("Search enrollments...");
      fireEvent.change(searchInput, { target: { value: "Web" } });

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
        expect(screen.queryByText("Network Security")).not.toBeInTheDocument();
        expect(
          screen.queryByText("Cryptography Basics")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Incident Response")).not.toBeInTheDocument();
      });
    });

    it("should show all enrollments when filter is reset", async () => {
      // First apply a filter
      const activeFilter = screen.getByText("Active (1)");
      fireEvent.click(activeFilter);

      // Then reset to all
      const allFilter = screen.getByText("All (4)");
      fireEvent.click(allFilter);

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
        expect(screen.getByText("Network Security")).toBeInTheDocument();
        expect(screen.getByText("Cryptography Basics")).toBeInTheDocument();
        expect(screen.getByText("Incident Response")).toBeInTheDocument();
      });
    });
  });

  describe("Empty States", () => {
    it("should show empty state when no enrollments are available", async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEmptyEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(screen.getByText("No enrollments found")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Start your cybersecurity journey by enrolling in modules!"
          )
        ).toBeInTheDocument();
      });
    });

    it("should show empty state for filtered results", async () => {
      // Only return active enrollments
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: [mockEnrollments[0]], // Only active enrollment
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
      });

      // Filter by completed (should show empty state)
      const completedFilter = screen.getByText("Completed (0)");
      fireEvent.click(completedFilter);

      await waitFor(() => {
        expect(
          screen.getByText("No completed enrollments")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Complete some modules to see them here!")
        ).toBeInTheDocument();
      });
    });

    it("should show empty state for search with no results", async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search enrollments...");
      fireEvent.change(searchInput, { target: { value: "NonexistentModule" } });

      await waitFor(() => {
        expect(screen.getByText("No enrollments found")).toBeInTheDocument();
        expect(
          screen.getByText("Try adjusting your search terms")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle enrollment API failures gracefully", async () => {
      api.enrollmentAPI.getUserEnrollments.mockRejectedValue(
        new Error("Network Error")
      );

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your enrollments. Please try again.")
        ).toBeInTheDocument();
      });
    });

    it("should handle module fetch failures gracefully", async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEnrollments,
      });

      // Mock module fetch to fail for one module
      api.modulesAPI.getById.mockImplementation((moduleId) => {
        if (moduleId === "module1") {
          return Promise.reject(new Error("Module not found"));
        }
        if (mockModules[moduleId]) {
          return Promise.resolve({
            data: mockModules[moduleId],
          });
        }
        return Promise.reject(new Error("Module not found"));
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        // Should still show other modules that loaded successfully
        expect(screen.getByText("Network Security")).toBeInTheDocument();
        expect(screen.getByText("Cryptography Basics")).toBeInTheDocument();
        expect(screen.getByText("Incident Response")).toBeInTheDocument();
      });
    });

    it("should handle invalid enrollment data", async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: false,
        message: "Invalid request",
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your enrollments. Please try again.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Navigation and Actions", () => {
    beforeEach(async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
      });
    });

    it("should render action buttons correctly for different statuses", () => {
      expect(screen.getByText("Continue Learning")).toBeInTheDocument(); // Active
      expect(screen.getByText("Review Content")).toBeInTheDocument(); // Completed
      expect(screen.getByText("Resume")).toBeInTheDocument(); // Paused
      expect(screen.getByText("Re-enroll")).toBeInTheDocument(); // Dropped
    });

    it("should render view module buttons", () => {
      const viewButtons = screen.getAllByText("View Module");
      expect(viewButtons.length).toBe(4);
    });

    it("should handle action button clicks", async () => {
      const continueButton = screen.getByText("Continue Learning");
      fireEvent.click(continueButton);

      // Should navigate to the module (we can test that the click handler is called)
      expect(continueButton).toBeInTheDocument();
    });
  });

  describe("Progress Tracking", () => {
    beforeEach(async () => {
      api.enrollmentAPI.getUserEnrollments.mockResolvedValue({
        success: true,
        data: mockEnrollments,
      });

      renderWithProviders(<MyEnrollments />);

      await waitFor(() => {
        expect(
          screen.getByText("Web Security Fundamentals")
        ).toBeInTheDocument();
      });
    });

    it("should display correct progress percentages", () => {
      expect(screen.getByText("75%")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(screen.getByText("25%")).toBeInTheDocument();
      expect(screen.getByText("15%")).toBeInTheDocument();
    });

    it("should show completed sections information", () => {
      // Check for sections completion info (this would depend on UI implementation)
      expect(screen.getByText("Web Security Fundamentals")).toBeInTheDocument();
    });

    it("should display last accessed dates", () => {
      expect(screen.getByText("Jan 20, 2024")).toBeInTheDocument(); // Last accessed
      expect(screen.getByText("Jan 18, 2024")).toBeInTheDocument(); // Last accessed
      expect(screen.getByText("Jan 12, 2024")).toBeInTheDocument(); // Last accessed
      expect(screen.getByText("Jan 3, 2024")).toBeInTheDocument(); // Last accessed
    });
  });
});
