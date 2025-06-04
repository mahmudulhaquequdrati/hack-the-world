import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../services/api";
import MyLabs from "../MyLabs";

// Create a mock AuthContext for testing
const AuthContext = createContext();

// Mock the useAuth hook
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
  AuthContext: createContext(),
}));

// Mock the API services
vi.mock("../../services/api", () => ({
  progressAPI: {
    getUserLabsProgress: vi.fn(),
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

const mockLabsProgressResponse = {
  success: true,
  data: {
    labs: [
      {
        id: "lab1",
        title: "Network Security Lab",
        description: "Learn to secure network infrastructures",
        type: "lab",
        moduleId: "module1",
        section: "Network Security",
        duration: 60,
        difficulty: "Intermediate",
        progress: {
          status: "in-progress",
          progressPercentage: 75,
          timeSpent: 45,
          score: null,
          maxScore: null,
          startedAt: "2024-01-15T10:00:00.000Z",
          completedAt: null,
        },
      },
      {
        id: "lab2",
        title: "Penetration Testing Lab",
        description: "Practice ethical hacking techniques",
        type: "lab",
        moduleId: "module2",
        section: "Penetration Testing",
        duration: 90,
        difficulty: "Advanced",
        progress: {
          status: "completed",
          progressPercentage: 100,
          timeSpent: 85,
          score: 95,
          maxScore: 100,
          startedAt: "2024-01-10T09:00:00.000Z",
          completedAt: "2024-01-10T10:25:00.000Z",
        },
      },
      {
        id: "lab3",
        title: "Cryptography Lab",
        description: "Implement encryption algorithms",
        type: "lab",
        moduleId: "module3",
        section: "Cryptography",
        duration: 45,
        difficulty: "Beginner",
        progress: {
          status: "not-started",
          progressPercentage: 0,
          timeSpent: 0,
          score: null,
          maxScore: null,
          startedAt: null,
          completedAt: null,
        },
      },
    ],
    statistics: {
      total: 3,
      notStarted: 1,
      inProgress: 1,
      completed: 1,
      totalDuration: 195,
      averageProgress: 58,
      totalTimeSpent: 130,
      averageScore: 95,
    },
    modules: [
      {
        id: "module1",
        title: "Network Security Fundamentals",
        difficulty: "Intermediate",
      },
      {
        id: "module2",
        title: "Ethical Hacking",
        difficulty: "Advanced",
      },
      {
        id: "module3",
        title: "Cryptography Basics",
        difficulty: "Beginner",
      },
    ],
  },
};

const mockEmptyLabsResponse = {
  success: true,
  data: {
    labs: [],
    statistics: {
      total: 0,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
      totalDuration: 0,
      averageProgress: 0,
      totalTimeSpent: 0,
      averageScore: 0,
    },
    modules: [],
  },
};

const renderWithProviders = (component, authValue = { user: mockUser }) => {
  // Mock the useAuth hook to return our test user
  useAuth.mockReturnValue(authValue);

  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("MyLabs Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        mockEmptyLabsResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(screen.getByText("[MY LABS]")).toBeInTheDocument();
      });
    });

    it("should display loading state initially", () => {
      api.progressAPI.getUserLabsProgress.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithProviders(<MyLabs />);
      expect(screen.getByText("Loading your labs...")).toBeInTheDocument();
    });

    it("should display correct header and description", async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        mockEmptyLabsResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(screen.getByText("[MY LABS]")).toBeInTheDocument();
      });

      expect(
        screen.getByText(
          "Practice your cybersecurity skills with hands-on lab exercises"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Data Fetching", () => {
    it("should fetch labs progress from API", async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        mockLabsProgressResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(api.progressAPI.getUserLabsProgress).toHaveBeenCalledWith(
          mockUser.id
        );
      });
    });

    it("should handle API errors gracefully", async () => {
      api.progressAPI.getUserLabsProgress.mockRejectedValue(
        new Error("API Error")
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your labs. Please try again.")
        ).toBeInTheDocument();
      });
    });

    it("should not fetch when user is not logged in", () => {
      renderWithProviders(<MyLabs />, { user: null });

      expect(api.progressAPI.getUserLabsProgress).not.toHaveBeenCalled();
    });
  });

  describe("Lab Display", () => {
    beforeEach(async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        mockLabsProgressResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
      });
    });

    it("should display lab titles and descriptions", () => {
      expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
      expect(screen.getByText("Penetration Testing Lab")).toBeInTheDocument();
      expect(screen.getByText("Cryptography Lab")).toBeInTheDocument();

      expect(
        screen.getByText("Learn to secure network infrastructures")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Practice ethical hacking techniques")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Implement encryption algorithms")
      ).toBeInTheDocument();
    });

    it("should display difficulty badges", () => {
      // Check for difficulty indicators
      expect(screen.getByText("Intermediate")).toBeInTheDocument();
      expect(screen.getByText("Advanced")).toBeInTheDocument();
      expect(screen.getByText("Beginner")).toBeInTheDocument();
    });

    it("should display module information", () => {
      expect(
        screen.getByText("Network Security Fundamentals")
      ).toBeInTheDocument();
      expect(screen.getByText("Ethical Hacking")).toBeInTheDocument();
      expect(screen.getByText("Cryptography Basics")).toBeInTheDocument();
    });

    it("should display correct durations", () => {
      expect(screen.getByText("60 min")).toBeInTheDocument();
      expect(screen.getByText("1h 30m")).toBeInTheDocument();
      expect(screen.getByText("45 min")).toBeInTheDocument();
    });
  });

  describe("Statistics Display", () => {
    beforeEach(async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        mockLabsProgressResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
      });
    });

    it("should display correct total statistics", () => {
      expect(screen.getByText("3")).toBeInTheDocument(); // Total labs
      expect(screen.getByText("1")).toBeInTheDocument(); // Not started
      expect(screen.getByText("1")).toBeInTheDocument(); // In progress
      expect(screen.getByText("1")).toBeInTheDocument(); // Completed
    });

    it("should display average progress", () => {
      expect(screen.getByText("58%")).toBeInTheDocument();
    });

    it("should display time spent", () => {
      expect(screen.getByText("2h 10m")).toBeInTheDocument(); // Total time spent
    });

    it("should display average score", () => {
      expect(screen.getByText("95%")).toBeInTheDocument();
    });
  });

  describe("Lab Status and Progress", () => {
    beforeEach(async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        mockLabsProgressResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
      });
    });

    it("should display correct status for in-progress labs", () => {
      expect(screen.getByText("In Progress")).toBeInTheDocument();
      expect(screen.getByText("Continue")).toBeInTheDocument();
    });

    it("should display correct status for completed labs", () => {
      expect(screen.getByText("Completed")).toBeInTheDocument();
      expect(screen.getByText("Review")).toBeInTheDocument();
    });

    it("should display correct status for not-started labs", () => {
      expect(screen.getByText("Not Started")).toBeInTheDocument();
      expect(screen.getByText("Start Lab")).toBeInTheDocument();
    });

    it("should show progress bar for in-progress labs", () => {
      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("should show completion info for completed labs", () => {
      expect(screen.getByText("Score: 95/100 (95%)")).toBeInTheDocument();
      expect(screen.getByText("Time Spent: 1h 25m")).toBeInTheDocument();
    });

    it("should show time spent for in-progress labs", () => {
      expect(screen.getByText("Time Spent: 45 min")).toBeInTheDocument();
    });
  });

  describe("Filtering and Search", () => {
    beforeEach(async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        mockLabsProgressResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
      });
    });

    it("should filter labs by status", async () => {
      // Filter by completed
      const completedFilter = screen.getByText("Completed");
      fireEvent.click(completedFilter);

      await waitFor(() => {
        expect(screen.getByText("Penetration Testing Lab")).toBeInTheDocument();
        expect(
          screen.queryByText("Network Security Lab")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Cryptography Lab")).not.toBeInTheDocument();
      });
    });

    it("should filter labs by in-progress status", async () => {
      // Filter by in-progress
      const inProgressFilter = screen.getByText("In Progress");
      fireEvent.click(inProgressFilter);

      await waitFor(() => {
        expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
        expect(
          screen.queryByText("Penetration Testing Lab")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Cryptography Lab")).not.toBeInTheDocument();
      });
    });

    it("should search labs by title", async () => {
      const searchInput = screen.getByPlaceholderText("Search labs...");
      fireEvent.change(searchInput, { target: { value: "Network" } });

      await waitFor(() => {
        expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
        expect(
          screen.queryByText("Penetration Testing Lab")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Cryptography Lab")).not.toBeInTheDocument();
      });
    });

    it("should search labs by module title", async () => {
      const searchInput = screen.getByPlaceholderText("Search labs...");
      fireEvent.change(searchInput, { target: { value: "Ethical" } });

      await waitFor(() => {
        expect(screen.getByText("Penetration Testing Lab")).toBeInTheDocument();
        expect(
          screen.queryByText("Network Security Lab")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Cryptography Lab")).not.toBeInTheDocument();
      });
    });

    it("should show all labs when filter is set to 'all'", async () => {
      // First apply a filter
      const completedFilter = screen.getByText("Completed");
      fireEvent.click(completedFilter);

      // Then reset to all
      const allFilter = screen.getByText("All");
      fireEvent.click(allFilter);

      await waitFor(() => {
        expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
        expect(screen.getByText("Penetration Testing Lab")).toBeInTheDocument();
        expect(screen.getByText("Cryptography Lab")).toBeInTheDocument();
      });
    });
  });

  describe("Empty States", () => {
    it("should show empty state when no labs are available", async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        mockEmptyLabsResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(screen.getByText("No labs found")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Enroll in modules to access hands-on lab exercises!"
          )
        ).toBeInTheDocument();
      });
    });

    it("should show empty state for filtered results", async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue({
        ...mockLabsProgressResponse,
        data: {
          ...mockLabsProgressResponse.data,
          labs: [
            {
              ...mockLabsProgressResponse.data.labs[0],
              progress: {
                ...mockLabsProgressResponse.data.labs[0].progress,
                status: "in-progress",
              },
            },
          ],
        },
      });

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
      });

      // Filter by completed (should show empty state)
      const completedFilter = screen.getByText("Completed");
      fireEvent.click(completedFilter);

      await waitFor(() => {
        expect(screen.getByText("No completed labs")).toBeInTheDocument();
        expect(
          screen.getByText("Try adjusting your search terms")
        ).toBeInTheDocument();
      });
    });

    it("should show empty state for search with no results", async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        mockLabsProgressResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search labs...");
      fireEvent.change(searchInput, { target: { value: "NonexistentLab" } });

      await waitFor(() => {
        expect(screen.getByText("No labs found")).toBeInTheDocument();
        expect(
          screen.getByText("Try adjusting your search terms")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API failures gracefully", async () => {
      api.progressAPI.getUserLabsProgress.mockRejectedValue(
        new Error("Network Error")
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your labs. Please try again.")
        ).toBeInTheDocument();
      });
    });

    it("should handle invalid API response", async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue({
        success: false,
        message: "Invalid request",
      });

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your labs. Please try again.")
        ).toBeInTheDocument();
      });
    });

    it("should handle missing data gracefully", async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue({
        success: true,
        data: null,
      });

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your labs. Please try again.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Navigation and Actions", () => {
    beforeEach(async () => {
      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        mockLabsProgressResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        expect(screen.getByText("Network Security Lab")).toBeInTheDocument();
      });
    });

    it("should render action buttons correctly", () => {
      expect(screen.getByText("Continue")).toBeInTheDocument(); // In progress lab
      expect(screen.getByText("Review")).toBeInTheDocument(); // Completed lab
      expect(screen.getByText("Start Lab")).toBeInTheDocument(); // Not started lab
    });

    it("should render view details buttons", () => {
      const viewButtons = screen.getAllByText("View");
      expect(viewButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Real Progress Integration", () => {
    it("should use server-provided statistics", async () => {
      const customStatsResponse = {
        ...mockLabsProgressResponse,
        data: {
          ...mockLabsProgressResponse.data,
          statistics: {
            total: 5,
            notStarted: 2,
            inProgress: 2,
            completed: 1,
            totalDuration: 300,
            averageProgress: 40,
            totalTimeSpent: 180,
            averageScore: 88,
          },
        },
      };

      api.progressAPI.getUserLabsProgress.mockResolvedValue(
        customStatsResponse
      );

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        // Check that server statistics are used
        expect(screen.getByText("5")).toBeInTheDocument(); // Total
        expect(screen.getByText("40%")).toBeInTheDocument(); // Average progress
        expect(screen.getByText("88%")).toBeInTheDocument(); // Average score
        expect(screen.getByText("3h")).toBeInTheDocument(); // Time spent
      });
    });

    it("should fallback to manual calculation when server stats unavailable", async () => {
      const noStatsResponse = {
        ...mockLabsProgressResponse,
        data: {
          ...mockLabsProgressResponse.data,
          statistics: {
            total: 0, // Indicates no server stats
            notStarted: 0,
            inProgress: 0,
            completed: 0,
            totalDuration: 0,
            averageProgress: 0,
            totalTimeSpent: 0,
            averageScore: 0,
          },
        },
      };

      api.progressAPI.getUserLabsProgress.mockResolvedValue(noStatsResponse);

      renderWithProviders(<MyLabs />);

      await waitFor(() => {
        // Should calculate stats from lab data
        expect(screen.getByText("3")).toBeInTheDocument(); // Total labs from data
      });
    });
  });
});
