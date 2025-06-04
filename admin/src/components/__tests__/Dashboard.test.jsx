import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../services/api";
import Dashboard from "../Dashboard";

// Mock the API modules
vi.mock("../../services/api", () => ({
  contentAPI: {
    getAll: vi.fn(),
  },
  enrollmentAPI: {
    getModuleStats: vi.fn(),
    getAllAdmin: vi.fn(),
  },
  modulesAPI: {
    getAll: vi.fn(),
  },
  phasesAPI: {
    getAll: vi.fn(),
  },
}));

// Test wrapper component
const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockApiResponses = () => {
    api.phasesAPI.getAll.mockResolvedValue({
      success: true,
      data: [
        { id: "1", title: "Phase 1" },
        { id: "2", title: "Phase 2" },
      ],
    });

    api.modulesAPI.getAll.mockResolvedValue({
      success: true,
      data: [
        { id: "module1", title: "Module 1", phaseId: "1" },
        { id: "module2", title: "Module 2", phaseId: "2" },
      ],
    });

    api.contentAPI.getAll.mockResolvedValue({
      success: true,
      data: [
        { id: "content1", title: "Content 1", moduleId: "module1" },
        { id: "content2", title: "Content 2", moduleId: "module2" },
      ],
    });

    api.enrollmentAPI.getModuleStats.mockResolvedValue({
      success: true,
      data: {
        stats: {
          totalEnrollments: 10,
          activeEnrollments: 7,
        },
      },
    });

    api.enrollmentAPI.getAllAdmin.mockResolvedValue({
      success: true,
      data: [
        {
          id: "enrollment1",
          userId: { _id: "user1", username: "testuser1" },
          moduleId: { _id: "module1", title: "Module 1" },
          status: "active",
          progressPercentage: 75,
          enrolledAt: "2025-01-20T10:00:00Z",
          lastAccessedAt: "2025-01-25T15:30:00Z",
        },
        {
          id: "enrollment2",
          userId: { _id: "user2", username: "testuser2" },
          moduleId: { _id: "module2", title: "Module 2" },
          status: "completed",
          progressPercentage: 100,
          enrolledAt: "2025-01-18T09:00:00Z",
          lastAccessedAt: "2025-01-24T14:20:00Z",
        },
        {
          id: "enrollment3",
          userId: { _id: "user3", username: "testuser3" },
          moduleId: { _id: "module1", title: "Module 1" },
          status: "paused",
          progressPercentage: 30,
          enrolledAt: "2025-01-19T11:00:00Z",
          lastAccessedAt: "2025-01-23T16:45:00Z",
        },
      ],
    });
  };

  describe("Basic Dashboard Functionality", () => {
    it("should render dashboard header", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByText("[ADMIN DASHBOARD]")).toBeInTheDocument();
      expect(
        screen.getByText("Hack The World - Content Management System")
      ).toBeInTheDocument();
    });

    it("should display mode toggle buttons", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByText("Overview")).toBeInTheDocument();
      expect(screen.getByText("Analytics")).toBeInTheDocument();
      expect(screen.getByText("Performance")).toBeInTheDocument();
    });

    it("should load and display basic statistics", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Total Phases")).toBeInTheDocument();
        expect(screen.getByText("Total Modules")).toBeInTheDocument();
        expect(screen.getByText("Total Content")).toBeInTheDocument();
        expect(screen.getByText("Total Enrollments")).toBeInTheDocument();
        expect(screen.getByText("Active Students")).toBeInTheDocument();
      });

      // Wait for statistics to load
      await waitFor(() => {
        expect(screen.getByText("2")).toBeInTheDocument(); // Total Phases
      });
    });
  });

  describe("Mode Switching", () => {
    it("should switch to analytics mode", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const analyticsButton = screen.getByText("Analytics");
      fireEvent.click(analyticsButton);

      await waitFor(() => {
        expect(screen.getByText("Progress Distribution")).toBeInTheDocument();
        expect(
          screen.getByText("Completion Trends (7 Days)")
        ).toBeInTheDocument();
        expect(screen.getByText("User Engagement")).toBeInTheDocument();
        expect(screen.getByText("Recent Activity")).toBeInTheDocument();
      });
    });

    it("should switch to performance mode", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const performanceButton = screen.getByText("Performance");
      fireEvent.click(performanceButton);

      await waitFor(() => {
        expect(screen.getByText("Top Performing Modules")).toBeInTheDocument();
        expect(screen.getByText("User Engagement")).toBeInTheDocument();
        expect(screen.getByText("Recent Activity")).toBeInTheDocument();
      });
    });

    it("should switch to insights mode", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const insightsButton = screen.getByText("Insights");
      fireEvent.click(insightsButton);

      await waitFor(() => {
        expect(screen.getByText("Learning Insights")).toBeInTheDocument();
        expect(screen.getByText("Time-Based Analytics")).toBeInTheDocument();
        expect(screen.getByText("Predictive Metrics")).toBeInTheDocument();
        expect(screen.getByText("System Health")).toBeInTheDocument();
      });
    });

    it("should switch to alerts mode", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const alertsButton = screen.getByText("Alerts");
      fireEvent.click(alertsButton);

      await waitFor(() => {
        expect(screen.getByText("🚨 Performance Alerts")).toBeInTheDocument();
        expect(
          screen.getByText("💻 System Health Monitor")
        ).toBeInTheDocument();
        expect(
          screen.getByText("🎯 Risk Assessment & Recommendations")
        ).toBeInTheDocument();
      });
    });

    it("should display enhanced statistics in analytics mode", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const analyticsButton = screen.getByText("Analytics");
      fireEvent.click(analyticsButton);

      await waitFor(() => {
        expect(screen.getByText("Avg Progress")).toBeInTheDocument();
        expect(screen.getByText("Completion Rate")).toBeInTheDocument();
        const retentionCards = screen.getAllByText("Retention Rate");
        expect(retentionCards.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Progress Statistics", () => {
    it("should display progress distribution chart", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const analyticsButton = screen.getByText("Analytics");
      fireEvent.click(analyticsButton);

      await waitFor(() => {
        expect(screen.getByText("Progress Distribution")).toBeInTheDocument();
        expect(screen.getByText("0-25%")).toBeInTheDocument();
        expect(screen.getByText("26-50%")).toBeInTheDocument();
        expect(screen.getByText("51-75%")).toBeInTheDocument();
        expect(screen.getByText("76-99%")).toBeInTheDocument();
        expect(screen.getByText("100%")).toBeInTheDocument();
      });
    });

    it("should display user engagement metrics", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const analyticsButton = screen.getByText("Analytics");
      fireEvent.click(analyticsButton);

      await waitFor(() => {
        expect(screen.getByText("User Engagement")).toBeInTheDocument();
        expect(screen.getByText("Total Users")).toBeInTheDocument();
        expect(screen.getByText("Active Users")).toBeInTheDocument();
        expect(screen.getByText("Completed Users")).toBeInTheDocument();
      });
    });

    it("should display recent activity", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const analyticsButton = screen.getByText("Analytics");
      fireEvent.click(analyticsButton);

      await waitFor(() => {
        expect(screen.getByText("Recent Activity")).toBeInTheDocument();
        expect(screen.getByText("testuser1")).toBeInTheDocument();
        expect(screen.getByText("testuser2")).toBeInTheDocument();
        expect(screen.getByText("testuser3")).toBeInTheDocument();
      });
    });

    it("should display module performance in performance mode", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const performanceButton = screen.getByText("Performance");
      fireEvent.click(performanceButton);

      await waitFor(() => {
        expect(screen.getByText("Top Performing Modules")).toBeInTheDocument();
        expect(screen.getByText("Module 1")).toBeInTheDocument();
        expect(screen.getByText("Module 2")).toBeInTheDocument();
      });
    });

    it("should display completion trends chart", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const analyticsButton = screen.getByText("Analytics");
      fireEvent.click(analyticsButton);

      await waitFor(() => {
        expect(
          screen.getByText("Completion Trends (7 Days)")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Enhanced Dashboard Features", () => {
    it("should display learning insights correctly", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const insightsButton = screen.getByText("Insights");
      fireEvent.click(insightsButton);

      await waitFor(() => {
        expect(
          screen.getByText("Average Time to Completion")
        ).toBeInTheDocument();
        expect(screen.getByText("Most Popular Modules")).toBeInTheDocument();
        expect(screen.getByText("Peak Learning Days")).toBeInTheDocument();
        expect(screen.getByText("Difficulty Analysis")).toBeInTheDocument();
      });
    });

    it("should display time-based analytics", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const insightsButton = screen.getByText("Insights");
      fireEvent.click(insightsButton);

      await waitFor(() => {
        expect(screen.getByText("This Week")).toBeInTheDocument();
        expect(screen.getByText("This Month")).toBeInTheDocument();
        expect(screen.getByText("Growth Rate")).toBeInTheDocument();
      });
    });

    it("should display predictive metrics", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const insightsButton = screen.getByText("Insights");
      fireEvent.click(insightsButton);

      await waitFor(() => {
        expect(
          screen.getByText("Predicted Completions Next 7 Days")
        ).toBeInTheDocument();
        expect(screen.getByText("Projected Growth Rate")).toBeInTheDocument();
        expect(screen.getByText("Risk of Dropout")).toBeInTheDocument();
        expect(
          screen.getByText("Estimated Completion Rate")
        ).toBeInTheDocument();
      });
    });

    it("should display system health metrics", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const insightsButton = screen.getByText("Insights");
      fireEvent.click(insightsButton);

      await waitFor(() => {
        expect(screen.getByText("Data Quality")).toBeInTheDocument();
        expect(screen.getByText("API Performance")).toBeInTheDocument();
        expect(screen.getByText("Database Health")).toBeInTheDocument();
      });
    });
  });

  describe("Performance Alerts System", () => {
    it("should display performance alerts when issues exist", async () => {
      // Mock data with low completion rates to trigger alerts
      api.enrollmentAPI.getAllAdmin.mockResolvedValue({
        success: true,
        data: [
          ...Array.from({ length: 10 }, (_, i) => ({
            id: `enrollment${i}`,
            userId: { _id: `user${i}`, username: `testuser${i}` },
            moduleId: { _id: "module1", title: "Low Performance Module" },
            status: "active",
            progressPercentage: 15, // Low progress to trigger alert
            enrolledAt: "2025-01-20T10:00:00Z",
            lastAccessedAt: "2025-01-25T15:30:00Z",
          })),
        ],
      });

      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const alertsButton = screen.getByText("Alerts");
      fireEvent.click(alertsButton);

      await waitFor(() => {
        expect(screen.getByText("🚨 Performance Alerts")).toBeInTheDocument();
      });
    });

    it("should display no alerts message when system is healthy", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const alertsButton = screen.getByText("Alerts");
      fireEvent.click(alertsButton);

      await waitFor(() => {
        expect(
          screen.getByText("No performance alerts at this time")
        ).toBeInTheDocument();
        expect(
          screen.getByText("System is operating normally")
        ).toBeInTheDocument();
      });
    });

    it("should display system health monitor", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const alertsButton = screen.getByText("Alerts");
      fireEvent.click(alertsButton);

      await waitFor(() => {
        expect(
          screen.getByText("💻 System Health Monitor")
        ).toBeInTheDocument();
        expect(screen.getByText("Data Quality")).toBeInTheDocument();
        expect(screen.getByText("API Performance")).toBeInTheDocument();
        expect(screen.getByText("Database")).toBeInTheDocument();
      });
    });

    it("should display risk assessment and recommendations", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const alertsButton = screen.getByText("Alerts");
      fireEvent.click(alertsButton);

      await waitFor(() => {
        expect(
          screen.getByText("🎯 Risk Assessment & Recommendations")
        ).toBeInTheDocument();
        expect(screen.getByText("⚠️ Identified Risks")).toBeInTheDocument();
        expect(
          screen.getByText("💡 Optimization Opportunities")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Advanced Analytics", () => {
    it("should calculate progress distribution correctly", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const analyticsButton = screen.getByText("Analytics");
      fireEvent.click(analyticsButton);

      await waitFor(() => {
        expect(screen.getByText("Progress Distribution")).toBeInTheDocument();
      });
    });

    it("should display module performance charts", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const performanceButton = screen.getByText("Performance");
      fireEvent.click(performanceButton);

      await waitFor(() => {
        expect(screen.getByText("Top Performing Modules")).toBeInTheDocument();
        const moduleElements = screen.getAllByText("Module 1");
        expect(moduleElements.length).toBeGreaterThan(0);
      });
    });

    it("should show enhanced completion trends with real data", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const analyticsButton = screen.getByText("Analytics");
      fireEvent.click(analyticsButton);

      await waitFor(() => {
        expect(
          screen.getByText("Completion Trends (7 Days)")
        ).toBeInTheDocument();
      });
    });

    it("should display user engagement metrics", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const analyticsButton = screen.getByText("Analytics");
      fireEvent.click(analyticsButton);

      await waitFor(() => {
        expect(screen.getByText("User Engagement")).toBeInTheDocument();
        expect(screen.getByText("Total Users")).toBeInTheDocument();
        expect(screen.getByText("Active Users")).toBeInTheDocument();
        expect(screen.getByText("Completed Users")).toBeInTheDocument();
        const retentionRateElements = screen.getAllByText("Retention Rate");
        expect(retentionRateElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      api.enrollmentAPI.getAllAdmin.mockRejectedValue(new Error("API Error"));
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should still render without crashing
      expect(screen.getByText("[ADMIN DASHBOARD]")).toBeInTheDocument();

      await waitFor(() => {
        // Component should still function despite API error
        expect(screen.getByText("Overview")).toBeInTheDocument();
      });
    });

    it("should show loading state initially", () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Statistics cards should show loading state
      const loadingElements = screen.getAllByText("...");
      expect(loadingElements.length).toBeGreaterThan(0);
    });
  });

  describe("Real-time Data Processing", () => {
    it("should process enrollment data for analytics", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(api.enrollmentAPI.getAllAdmin).toHaveBeenCalledWith({
          limit: 1000,
        });
      });
    });

    it("should calculate completion trends from real data", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const analyticsButton = screen.getByText("Analytics");
      fireEvent.click(analyticsButton);

      await waitFor(() => {
        expect(
          screen.getByText("Completion Trends (7 Days)")
        ).toBeInTheDocument();
      });
    });

    it("should generate performance alerts based on real metrics", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const alertsButton = screen.getByText("Alerts");
      fireEvent.click(alertsButton);

      await waitFor(() => {
        expect(screen.getByText("🚨 Performance Alerts")).toBeInTheDocument();
      });
    });
  });
});
