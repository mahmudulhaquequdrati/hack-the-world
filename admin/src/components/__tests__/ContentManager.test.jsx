import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/utils/testUtils";
import ContentManager from "../ContentManager";

// Mock the API services
vi.mock("../../services/api", () => ({
  contentAPI: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getByModule: vi.fn(),
    getByModuleGrouped: vi.fn(),
    getByType: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    permanentDelete: vi.fn(),
  },
  modulesAPI: {
    getAll: vi.fn(),
  },
}));

// Import mocked services for usage in tests
import { contentAPI, modulesAPI } from "../../services/api";

// Mock data
const mockModules = [
  {
    id: "module-1",
    title: "Cybersecurity Basics",
    phaseId: "phase-1",
  },
  {
    id: "module-2",
    title: "Advanced Security",
    phaseId: "phase-2",
  },
];

const mockContent = [
  {
    id: "content-1",
    moduleId: "module-1",
    type: "video",
    title: "Introduction to Cybersecurity",
    description: "Basic cybersecurity concepts",
    section: "Introduction",
    url: "https://example.com/video.mp4",
    duration: 15,
    resources: [],
    isActive: true,
  },
  {
    id: "content-2",
    moduleId: "module-1",
    type: "lab",
    title: "Security Assessment Lab",
    description: "Hands-on security lab",
    section: "Core Concepts",
    instructions: "Complete the assessment tasks",
    duration: 45,
    resources: [],
    isActive: true,
  },
];

const mockGroupedContentByModule = {
  Introduction: [mockContent[0]],
  "Core Concepts": [mockContent[1]],
};

describe("ContentManager", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock responses
    modulesAPI.getAll.mockResolvedValue({
      success: true,
      data: mockModules,
    });

    contentAPI.getAll.mockResolvedValue({
      success: true,
      data: mockContent,
    });
  });

  describe("Initial Rendering", () => {
    it("should render content management interface", async () => {
      renderWithProviders(<ContentManager />);

      expect(screen.getByText("[CONTENT MANAGEMENT]")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Manage learning content including videos, labs, games, and documents"
        )
      ).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });
    });

    it("should show loading state initially", () => {
      renderWithProviders(<ContentManager />);
      expect(screen.getByText("Loading content...")).toBeInTheDocument();
    });

    it("should load modules and content on mount", async () => {
      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(modulesAPI.getAll).toHaveBeenCalledTimes(1);
        expect(contentAPI.getAll).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Content Display", () => {
    it("should display content in list view", async () => {
      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
        expect(screen.getByText("Security Assessment Lab")).toBeInTheDocument();
      });

      // Check content type badges
      expect(screen.getByText("🎥 Video")).toBeInTheDocument();
      expect(screen.getByText("🧪 Lab")).toBeInTheDocument();
    });

    it("should display content metadata", async () => {
      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        // Check duration
        expect(screen.getByText("15 min")).toBeInTheDocument();
        expect(screen.getByText("45 min")).toBeInTheDocument();
        // Check sections
        expect(screen.getByText("Introduction")).toBeInTheDocument();
        expect(screen.getByText("Core Concepts")).toBeInTheDocument();
      });
    });

    it("should NOT show pagination controls", async () => {
      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Pagination should not exist
      expect(screen.queryByText("Previous")).not.toBeInTheDocument();
      expect(screen.queryByText("Next")).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Showing \d+ to \d+ of \d+ results/)
      ).not.toBeInTheDocument();
    });
  });

  describe("View Modes", () => {
    it("should default to list view", async () => {
      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        const listButton = screen.getByText("List");
        expect(listButton).toHaveClass("bg-cyber-green");
      });
    });

    it("should switch to grouped by module view", async () => {
      contentAPI.getByModuleGrouped.mockResolvedValue({
        success: true,
        data: mockGroupedContentByModule,
      });

      renderWithProviders(<ContentManager />);

      const moduleButton = screen.getByText("By Module");
      fireEvent.click(moduleButton);

      await waitFor(() => {
        expect(moduleButton).toHaveClass("bg-cyber-green");
        expect(contentAPI.getByModuleGrouped).toHaveBeenCalledWith("module-1");
        expect(contentAPI.getByModuleGrouped).toHaveBeenCalledWith("module-2");
      });
    });

    it("should switch to grouped by type view", async () => {
      contentAPI.getByType.mockResolvedValue({
        success: true,
        data: [mockContent[0]],
      });

      renderWithProviders(<ContentManager />);

      const typeButton = screen.getByText("By Type");
      fireEvent.click(typeButton);

      await waitFor(() => {
        expect(typeButton).toHaveClass("bg-cyber-green");
        expect(contentAPI.getByType).toHaveBeenCalledWith("video", null);
        expect(contentAPI.getByType).toHaveBeenCalledWith("lab", null);
        expect(contentAPI.getByType).toHaveBeenCalledWith("game", null);
        expect(contentAPI.getByType).toHaveBeenCalledWith("document", null);
      });
    });
  });

  describe("Filtering", () => {
    it("should filter content by type", async () => {
      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Select video filter
      const typeFilter = screen.getByDisplayValue("All Types");
      fireEvent.change(typeFilter, { target: { value: "video" } });

      await waitFor(() => {
        expect(contentAPI.getAll).toHaveBeenCalledWith({
          type: "video",
        });
      });
    });

    it("should filter content by module", async () => {
      renderWithProviders(<ContentManager />);

      const moduleFilter = screen.getByDisplayValue("All Modules");
      fireEvent.change(moduleFilter, { target: { value: "module-1" } });

      await waitFor(() => {
        expect(contentAPI.getAll).toHaveBeenCalledWith({
          moduleId: "module-1",
        });
      });
    });

    it("should call API without pagination parameters", async () => {
      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(contentAPI.getAll).toHaveBeenCalledWith({});
      });

      // Should not include page or limit parameters
      expect(contentAPI.getAll).not.toHaveBeenCalledWith(
        expect.objectContaining({ page: expect.any(Number) })
      );
      expect(contentAPI.getAll).not.toHaveBeenCalledWith(
        expect.objectContaining({ limit: expect.any(Number) })
      );
    });
  });

  describe("Content Creation", () => {
    it("should open create form when Add Content button is clicked", async () => {
      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      const addButton = screen.getByText("Add Content");
      fireEvent.click(addButton);

      expect(screen.getByText("Create New Content")).toBeInTheDocument();
    });

    it("should create video content with required fields", async () => {
      contentAPI.create.mockResolvedValue({
        success: true,
        data: mockContent[0],
      });

      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      const addButton = screen.getByText("Add Content");
      fireEvent.click(addButton);

      // Fill form
      fireEvent.change(screen.getByLabelText("Module*"), {
        target: { value: "module-1" },
      });
      fireEvent.change(screen.getByLabelText("Content Type*"), {
        target: { value: "video" },
      });
      fireEvent.change(screen.getByLabelText("Title*"), {
        target: { value: "Test Video" },
      });
      fireEvent.change(screen.getByLabelText("Section*"), {
        target: { value: "Test Section" },
      });
      fireEvent.change(screen.getByLabelText("Description*"), {
        target: { value: "Test description" },
      });
      fireEvent.change(screen.getByLabelText("Video URL*"), {
        target: { value: "https://example.com/test.mp4" },
      });

      const submitButton = screen.getByText("Create");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(contentAPI.create).toHaveBeenCalledWith({
          moduleId: "module-1",
          type: "video",
          title: "Test Video",
          section: "Test Section",
          description: "Test description",
          url: "https://example.com/test.mp4",
          instructions: "",
          duration: 1,
          resources: [],
        });
      });
    });

    it("should require instructions for lab content", async () => {
      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      const addButton = screen.getByText("Add Content");
      fireEvent.click(addButton);

      // Fill form with lab type
      fireEvent.change(screen.getByLabelText("Content Type*"), {
        target: { value: "lab" },
      });

      // Instructions field should appear and be required
      expect(screen.getByLabelText("Instructions*")).toBeInTheDocument();
    });
  });

  describe("Content Actions", () => {
    it("should delete content when delete button is clicked", async () => {
      contentAPI.delete.mockResolvedValue({ success: true });
      window.confirm = vi.fn(() => true);

      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(contentAPI.delete).toHaveBeenCalledWith("content-1");
        expect(window.confirm).toHaveBeenCalledWith(
          expect.stringContaining("Are you sure you want to delete")
        );
      });
    });

    it("should permanently delete content when permanent delete is clicked", async () => {
      contentAPI.permanentDelete.mockResolvedValue({ success: true });
      window.confirm = vi.fn(() => true);

      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByText("Permanent");
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(contentAPI.permanentDelete).toHaveBeenCalledWith("content-1");
        expect(window.confirm).toHaveBeenCalledWith(
          expect.stringContaining("Are you sure you want to permanently delete")
        );
      });
    });

    it("should not delete when confirmation is cancelled", async () => {
      window.confirm = vi.fn(() => false);

      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);
      });

      expect(contentAPI.delete).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      contentAPI.getAll.mockRejectedValue(new Error("API Error"));

      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(screen.getByText("Failed to fetch content")).toBeInTheDocument();
      });
    });

    it("should handle form submission errors", async () => {
      contentAPI.getAll.mockResolvedValue({
        success: true,
        data: mockContent,
      });
      contentAPI.create.mockRejectedValue({
        response: { data: { message: "Validation error" } },
      });

      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Open form and fill required fields
      fireEvent.click(screen.getByText("Add Content"));

      fireEvent.change(screen.getByLabelText("Module*"), {
        target: { value: "module-1" },
      });
      fireEvent.change(screen.getByLabelText("Title*"), {
        target: { value: "Test" },
      });
      fireEvent.change(screen.getByLabelText("Section*"), {
        target: { value: "Test" },
      });
      fireEvent.change(screen.getByLabelText("Description*"), {
        target: { value: "Test" },
      });

      const submitButton = screen.getByText("Create");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Validation error")).toBeInTheDocument();
      });
    });
  });

  describe("Success Messages", () => {
    it("should display success message after content creation", async () => {
      contentAPI.create.mockResolvedValue({
        success: true,
        data: mockContent[0],
      });

      renderWithProviders(<ContentManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Create content
      fireEvent.click(screen.getByText("Add Content"));

      // Fill and submit form (minimal required fields)
      fireEvent.change(screen.getByLabelText("Module*"), {
        target: { value: "module-1" },
      });
      fireEvent.change(screen.getByLabelText("Title*"), {
        target: { value: "Test Content" },
      });
      fireEvent.change(screen.getByLabelText("Section*"), {
        target: { value: "Test Section" },
      });
      fireEvent.change(screen.getByLabelText("Description*"), {
        target: { value: "Test description" },
      });

      const submitButton = screen.getByText("Create");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Content created successfully")
        ).toBeInTheDocument();
      });
    });
  });
});
