import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../services/api";
import MyGames from "../MyGames";

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
    getUserGamesProgress: vi.fn(),
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

const mockGamesProgressResponse = {
  success: true,
  data: {
    games: [
      {
        id: "game1",
        title: "SQL Injection Challenge",
        description:
          "Learn to identify and exploit SQL injection vulnerabilities",
        type: "challenge",
        moduleId: "module1",
        section: "Security Testing",
        duration: 45,
        points: 100,
        difficulty: "Intermediate",
        progress: {
          status: "in-progress",
          progressPercentage: 50,
          timeSpent: 25,
          score: null,
          maxScore: null,
          startedAt: "2024-01-15T10:00:00.000Z",
          completedAt: null,
        },
      },
      {
        id: "game2",
        title: "Password Cracking Game",
        description: "Practice password cracking techniques",
        type: "game",
        moduleId: "module2",
        section: "Cryptography",
        duration: 30,
        points: 75,
        difficulty: "Beginner",
        progress: {
          status: "completed",
          progressPercentage: 100,
          timeSpent: 28,
          score: 75,
          maxScore: 75,
          startedAt: "2024-01-10T09:00:00.000Z",
          completedAt: "2024-01-10T09:28:00.000Z",
        },
      },
      {
        id: "game3",
        title: "Network Scanning Challenge",
        description: "Learn network reconnaissance techniques",
        type: "challenge",
        moduleId: "module3",
        section: "Network Security",
        duration: 60,
        points: 120,
        difficulty: "Advanced",
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
      games: 1,
      challenges: 2,
      notStarted: 1,
      inProgress: 1,
      completed: 1,
      totalDuration: 135,
      averageProgress: 50,
      totalTimeSpent: 53,
      averageScore: 75,
    },
    modules: [
      {
        id: "module1",
        title: "Web Security Fundamentals",
        difficulty: "Intermediate",
      },
      {
        id: "module2",
        title: "Cryptography Basics",
        difficulty: "Beginner",
      },
      {
        id: "module3",
        title: "Network Security",
        difficulty: "Advanced",
      },
    ],
  },
};

const mockEmptyGamesResponse = {
  success: true,
  data: {
    games: [],
    statistics: {
      total: 0,
      games: 0,
      challenges: 0,
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

describe("MyGames Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        mockEmptyGamesResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(screen.getByText("[MY GAMES]")).toBeInTheDocument();
      });
    });

    it("should display loading state initially", () => {
      api.progressAPI.getUserGamesProgress.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithProviders(<MyGames />);
      expect(screen.getByText("Loading your games...")).toBeInTheDocument();
    });

    it("should display correct header and description", async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        mockEmptyGamesResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(screen.getByText("[MY GAMES]")).toBeInTheDocument();
      });

      expect(
        screen.getByText(
          "Challenge yourself with interactive cybersecurity games and puzzles"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Data Fetching", () => {
    it("should fetch games progress from API", async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        mockGamesProgressResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(api.progressAPI.getUserGamesProgress).toHaveBeenCalledWith(
          mockUser.id
        );
      });
    });

    it("should handle API errors gracefully", async () => {
      api.progressAPI.getUserGamesProgress.mockRejectedValue(
        new Error("API Error")
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your games. Please try again.")
        ).toBeInTheDocument();
      });
    });

    it("should not fetch when user is not logged in", () => {
      renderWithProviders(<MyGames />, { user: null });

      expect(api.progressAPI.getUserGamesProgress).not.toHaveBeenCalled();
    });
  });

  describe("Game Display", () => {
    beforeEach(async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        mockGamesProgressResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
      });
    });

    it("should display game titles and descriptions", () => {
      expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
      expect(screen.getByText("Password Cracking Game")).toBeInTheDocument();
      expect(
        screen.getByText("Network Scanning Challenge")
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Learn to identify and exploit SQL injection vulnerabilities"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText("Practice password cracking techniques")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Learn network reconnaissance techniques")
      ).toBeInTheDocument();
    });

    it("should display game types and difficulty", () => {
      expect(screen.getByText("challenge")).toBeInTheDocument();
      expect(screen.getByText("game")).toBeInTheDocument();
      expect(screen.getByText("Intermediate")).toBeInTheDocument();
      expect(screen.getByText("Beginner")).toBeInTheDocument();
      expect(screen.getByText("Advanced")).toBeInTheDocument();
    });

    it("should display module information", () => {
      expect(screen.getByText("Web Security Fundamentals")).toBeInTheDocument();
      expect(screen.getByText("Cryptography Basics")).toBeInTheDocument();
      expect(screen.getByText("Network Security")).toBeInTheDocument();
    });

    it("should display correct durations and points", () => {
      expect(screen.getByText("45 min")).toBeInTheDocument();
      expect(screen.getByText("30 min")).toBeInTheDocument();
      expect(screen.getByText("1h")).toBeInTheDocument();
      expect(screen.getByText("100 pts")).toBeInTheDocument();
      expect(screen.getByText("75 pts")).toBeInTheDocument();
      expect(screen.getByText("120 pts")).toBeInTheDocument();
    });
  });

  describe("Statistics Display", () => {
    beforeEach(async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        mockGamesProgressResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
      });
    });

    it("should display correct total statistics", () => {
      expect(screen.getByText("3")).toBeInTheDocument(); // Total games
      expect(screen.getByText("1")).toBeInTheDocument(); // Games
      expect(screen.getByText("2")).toBeInTheDocument(); // Challenges
      expect(screen.getByText("1")).toBeInTheDocument(); // Not started
      expect(screen.getByText("1")).toBeInTheDocument(); // In progress
      expect(screen.getByText("1")).toBeInTheDocument(); // Completed
    });

    it("should display average progress", () => {
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("should display time spent", () => {
      expect(screen.getByText("53 min")).toBeInTheDocument(); // Total time spent
    });

    it("should display average score", () => {
      expect(screen.getByText("75%")).toBeInTheDocument();
    });
  });

  describe("Game Status and Actions", () => {
    beforeEach(async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        mockGamesProgressResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
      });
    });

    it("should display correct status for in-progress games", () => {
      expect(screen.getByText("In Progress")).toBeInTheDocument();
      expect(screen.getByText("Continue")).toBeInTheDocument();
    });

    it("should display correct status for completed games", () => {
      expect(screen.getByText("Completed")).toBeInTheDocument();
      expect(screen.getByText("Replay")).toBeInTheDocument();
    });

    it("should display correct status for not-started games", () => {
      expect(screen.getByText("Not Started")).toBeInTheDocument();
      expect(screen.getByText("Start Game")).toBeInTheDocument();
    });

    it("should show progress bar for in-progress games", () => {
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("should show completion info for completed games", () => {
      expect(screen.getByText("Score: 75/75 (100%)")).toBeInTheDocument();
      expect(screen.getByText("Time Spent: 28 min")).toBeInTheDocument();
    });

    it("should show time spent for in-progress games", () => {
      expect(screen.getByText("Time Spent: 25 min")).toBeInTheDocument();
    });
  });

  describe("Filtering and Search", () => {
    beforeEach(async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        mockGamesProgressResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
      });
    });

    it("should filter games by status", async () => {
      // Filter by completed
      const completedFilter = screen.getByText("Completed");
      fireEvent.click(completedFilter);

      await waitFor(() => {
        expect(screen.getByText("Password Cracking Game")).toBeInTheDocument();
        expect(
          screen.queryByText("SQL Injection Challenge")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Network Scanning Challenge")
        ).not.toBeInTheDocument();
      });
    });

    it("should filter games by in-progress status", async () => {
      // Filter by in-progress
      const inProgressFilter = screen.getByText("In Progress");
      fireEvent.click(inProgressFilter);

      await waitFor(() => {
        expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
        expect(
          screen.queryByText("Password Cracking Game")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Network Scanning Challenge")
        ).not.toBeInTheDocument();
      });
    });

    it("should search games by title", async () => {
      const searchInput = screen.getByPlaceholderText("Search games...");
      fireEvent.change(searchInput, { target: { value: "SQL" } });

      await waitFor(() => {
        expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
        expect(
          screen.queryByText("Password Cracking Game")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Network Scanning Challenge")
        ).not.toBeInTheDocument();
      });
    });

    it("should search games by module title", async () => {
      const searchInput = screen.getByPlaceholderText("Search games...");
      fireEvent.change(searchInput, { target: { value: "Cryptography" } });

      await waitFor(() => {
        expect(screen.getByText("Password Cracking Game")).toBeInTheDocument();
        expect(
          screen.queryByText("SQL Injection Challenge")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Network Scanning Challenge")
        ).not.toBeInTheDocument();
      });
    });

    it("should show all games when filter is set to 'all'", async () => {
      // First apply a filter
      const completedFilter = screen.getByText("Completed");
      fireEvent.click(completedFilter);

      // Then reset to all
      const allFilter = screen.getByText("All");
      fireEvent.click(allFilter);

      await waitFor(() => {
        expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
        expect(screen.getByText("Password Cracking Game")).toBeInTheDocument();
        expect(
          screen.getByText("Network Scanning Challenge")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Empty States", () => {
    it("should show empty state when no games are available", async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        mockEmptyGamesResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(screen.getByText("No games found")).toBeInTheDocument();
        expect(
          screen.getByText("Enroll in modules to access interactive games!")
        ).toBeInTheDocument();
      });
    });

    it("should show empty state for filtered results", async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue({
        ...mockGamesProgressResponse,
        data: {
          ...mockGamesProgressResponse.data,
          games: [
            {
              ...mockGamesProgressResponse.data.games[0],
              progress: {
                ...mockGamesProgressResponse.data.games[0].progress,
                status: "in-progress",
              },
            },
          ],
        },
      });

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
      });

      // Filter by completed (should show empty state)
      const completedFilter = screen.getByText("Completed");
      fireEvent.click(completedFilter);

      await waitFor(() => {
        expect(screen.getByText("No completed games")).toBeInTheDocument();
        expect(
          screen.getByText("Try adjusting your search terms")
        ).toBeInTheDocument();
      });
    });

    it("should show empty state for search with no results", async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        mockGamesProgressResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search games...");
      fireEvent.change(searchInput, { target: { value: "NonexistentGame" } });

      await waitFor(() => {
        expect(screen.getByText("No games found")).toBeInTheDocument();
        expect(
          screen.getByText("Try adjusting your search terms")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API failures gracefully", async () => {
      api.progressAPI.getUserGamesProgress.mockRejectedValue(
        new Error("Network Error")
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your games. Please try again.")
        ).toBeInTheDocument();
      });
    });

    it("should handle invalid API response", async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue({
        success: false,
        message: "Invalid request",
      });

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your games. Please try again.")
        ).toBeInTheDocument();
      });
    });

    it("should handle missing data gracefully", async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue({
        success: true,
        data: null,
      });

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load your games. Please try again.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Navigation and Actions", () => {
    beforeEach(async () => {
      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        mockGamesProgressResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        expect(screen.getByText("SQL Injection Challenge")).toBeInTheDocument();
      });
    });

    it("should render action buttons correctly", () => {
      expect(screen.getByText("Continue")).toBeInTheDocument(); // In progress game
      expect(screen.getByText("Replay")).toBeInTheDocument(); // Completed game
      expect(screen.getByText("Start Game")).toBeInTheDocument(); // Not started game
    });

    it("should render view details buttons", () => {
      const viewButtons = screen.getAllByText("View");
      expect(viewButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Real Progress Integration", () => {
    it("should use server-provided statistics", async () => {
      const customStatsResponse = {
        ...mockGamesProgressResponse,
        data: {
          ...mockGamesProgressResponse.data,
          statistics: {
            total: 5,
            games: 2,
            challenges: 3,
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

      api.progressAPI.getUserGamesProgress.mockResolvedValue(
        customStatsResponse
      );

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        // Check that server statistics are used
        expect(screen.getByText("5")).toBeInTheDocument(); // Total
        expect(screen.getByText("2")).toBeInTheDocument(); // Games
        expect(screen.getByText("3")).toBeInTheDocument(); // Challenges
        expect(screen.getByText("40%")).toBeInTheDocument(); // Average progress
        expect(screen.getByText("88%")).toBeInTheDocument(); // Average score
        expect(screen.getByText("3h")).toBeInTheDocument(); // Time spent
      });
    });

    it("should fallback to manual calculation when server stats unavailable", async () => {
      const noStatsResponse = {
        ...mockGamesProgressResponse,
        data: {
          ...mockGamesProgressResponse.data,
          statistics: {
            total: 0, // Indicates no server stats
            games: 0,
            challenges: 0,
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

      api.progressAPI.getUserGamesProgress.mockResolvedValue(noStatsResponse);

      renderWithProviders(<MyGames />);

      await waitFor(() => {
        // Should calculate stats from game data
        expect(screen.getByText("3")).toBeInTheDocument(); // Total games from data
      });
    });
  });
});
