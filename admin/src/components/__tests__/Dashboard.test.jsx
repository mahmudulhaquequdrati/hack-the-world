import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../services/api";
import Dashboard from "../../pages/Dashboard";

// Mock the API modules
vi.mock("../../services/api", () => ({
  contentAPI: {
    getAll: vi.fn(),
  },
  modulesAPI: {
    getWithPhases: vi.fn(),
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
    api.modulesAPI.getWithPhases.mockResolvedValue({
      data: [
        {
          _id: "1",
          title: "Phase 1",
          modules: [
            { _id: "module1", title: "Module 1", phaseId: "1" },
            { _id: "module2", title: "Module 2", phaseId: "1" },
          ],
        },
        {
          _id: "2",
          title: "Phase 2",
          modules: [
            { _id: "module3", title: "Module 3", phaseId: "2" },
          ],
        },
      ],
    });

    api.contentAPI.getAll.mockResolvedValue({
      data: [
        { _id: "content1", title: "Content 1", moduleId: "module1" },
        { _id: "content2", title: "Content 2", moduleId: "module2" },
        { _id: "content3", title: "Content 3", moduleId: "module3" },
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

      expect(screen.getByText("ADMIN_CONTROL_CENTER")).toBeInTheDocument();
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
      });

      // Wait for statistics to load
      await waitFor(() => {
        const statisticElements = screen.getAllByText("3");
        expect(statisticElements.length).toBeGreaterThan(0);
      });
    });

    it("should display system status", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("System Status")).toBeInTheDocument();
        expect(screen.getByText("Backend Server")).toBeInTheDocument();
        expect(screen.getByText("ONLINE")).toBeInTheDocument();
      });
    });

    it("should display quick actions", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Quick Actions")).toBeInTheDocument();
        expect(screen.getByText("Manage Phases")).toBeInTheDocument();
        expect(screen.getByText("Manage Modules")).toBeInTheDocument();
        expect(screen.getByText("Manage Content")).toBeInTheDocument();
      });
    });

    it("should display system information", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("System Information")).toBeInTheDocument();
        expect(screen.getByText("Platform")).toBeInTheDocument();
        expect(screen.getByText("Hack The World Learning Platform")).toBeInTheDocument();
      });
    });
  });

  describe("Statistics Cards", () => {
    it("should display correct phase count", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Total Phases")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument(); // 2 phases in mock data
      });
    });

    it("should display correct module count", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Total Modules")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument(); // 3 modules total in mock data
      });
    });

    it("should display correct content count", async () => {
      mockApiResponses();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Total Content")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument(); // 3 content items in mock data
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      api.modulesAPI.getWithPhases.mockRejectedValue(new Error("API Error"));
      api.contentAPI.getAll.mockRejectedValue(new Error("API Error"));

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should still render without crashing
      expect(screen.getByText("ADMIN_CONTROL_CENTER")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Failed to load statistics")).toBeInTheDocument();
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
});