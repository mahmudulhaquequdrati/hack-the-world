import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/utils/testUtils";
import ContentManager from "../../pages/ContentManager";

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
    getSectionsByModule: vi.fn(),
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
    _id: "module-1",
    title: "Cybersecurity Basics",
    phaseId: "phase-1",
  },
  {
    _id: "module-2",
    title: "Advanced Security",
    phaseId: "phase-2",
  },
];

const mockContent = [
  {
    _id: "content-1",
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
    _id: "content-2",
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

const mockSections = ["Fundamentals", "Practical Labs", "Advanced Topics"];

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

    contentAPI.getSectionsByModule.mockResolvedValue({ data: mockSections });
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

  describe("Section Auto-complete Functionality", () => {
    beforeEach(async () => {
      render(<ContentManager />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText("[CONTENT MANAGEMENT]")).toBeInTheDocument();
      });

      // Open the form
      const addButton = screen.getByText("Add Content");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Create New Content")).toBeInTheDocument();
      });
    });

    it("should disable section input when no module is selected", async () => {
      const sectionInput = screen.getByPlaceholderText(
        "Select a module first to see available sections"
      );
      expect(sectionInput).toBeDisabled();
    });

    it("should enable section input and fetch sections when module is selected", async () => {
      const user = userEvent.setup();

      // Select a module
      const moduleSelect = screen.getByDisplayValue("Select Module");
      await user.selectOptions(moduleSelect, "module-1");

      await waitFor(() => {
        expect(contentAPI.getSectionsByModule).toHaveBeenCalledWith("module-1");
      });

      const sectionInput = screen.getByPlaceholderText(
        "Type to search existing sections or create new one"
      );
      expect(sectionInput).not.toBeDisabled();
    });

    it("should show existing sections in dropdown when typing", async () => {
      const user = userEvent.setup();

      // Select a module first
      const moduleSelect = screen.getByDisplayValue("Select Module");
      await user.selectOptions(moduleSelect, "module-1");

      await waitFor(() => {
        expect(contentAPI.getSectionsByModule).toHaveBeenCalled();
      });

      // Type in section input
      const sectionInput = screen.getByPlaceholderText(
        "Type to search existing sections or create new one"
      );
      await user.click(sectionInput);
      await user.type(sectionInput, "Fun");

      await waitFor(() => {
        expect(
          screen.getByText("Existing sections (click to select):")
        ).toBeInTheDocument();
        expect(screen.getByText("📁 Fundamentals")).toBeInTheDocument();
      });
    });

    it("should filter sections based on input", async () => {
      const user = userEvent.setup();

      // Select a module
      const moduleSelect = screen.getByDisplayValue("Select Module");
      await user.selectOptions(moduleSelect, "module-1");

      await waitFor(() => {
        expect(contentAPI.getSectionsByModule).toHaveBeenCalled();
      });

      // Type specific text
      const sectionInput = screen.getByPlaceholderText(
        "Type to search existing sections or create new one"
      );
      await user.click(sectionInput);
      await user.type(sectionInput, "Practical");

      await waitFor(() => {
        expect(screen.getByText("📁 Practical Labs")).toBeInTheDocument();
        expect(screen.queryByText("📁 Fundamentals")).not.toBeInTheDocument();
      });
    });

    it("should select section when clicked from dropdown", async () => {
      const user = userEvent.setup();

      // Select a module
      const moduleSelect = screen.getByDisplayValue("Select Module");
      await user.selectOptions(moduleSelect, "module-1");

      await waitFor(() => {
        expect(contentAPI.getSectionsByModule).toHaveBeenCalled();
      });

      // Click on section input to show dropdown
      const sectionInput = screen.getByPlaceholderText(
        "Type to search existing sections or create new one"
      );
      await user.click(sectionInput);

      await waitFor(() => {
        expect(screen.getByText("📁 Fundamentals")).toBeInTheDocument();
      });

      // Click on a section
      const fundamentalsOption = screen.getByText("📁 Fundamentals");
      await user.click(fundamentalsOption);

      expect(sectionInput.value).toBe("Fundamentals");
    });

    it("should show create new section message for non-existing sections", async () => {
      const user = userEvent.setup();

      // Select a module
      const moduleSelect = screen.getByDisplayValue("Select Module");
      await user.selectOptions(moduleSelect, "module-1");

      await waitFor(() => {
        expect(contentAPI.getSectionsByModule).toHaveBeenCalled();
      });

      // Type a new section name
      const sectionInput = screen.getByPlaceholderText(
        "Type to search existing sections or create new one"
      );
      await user.click(sectionInput);
      await user.type(sectionInput, "New Section");

      await waitFor(() => {
        expect(screen.getByText("✨ Create new section:")).toBeInTheDocument();
        expect(screen.getByText('"New Section"')).toBeInTheDocument();
      });
    });

    it("should show section count when available", async () => {
      const user = userEvent.setup();

      // Select a module
      const moduleSelect = screen.getByDisplayValue("Select Module");
      await user.selectOptions(moduleSelect, "module-1");

      await waitFor(() => {
        expect(contentAPI.getSectionsByModule).toHaveBeenCalled();
      });

      // Click away from section input to hide dropdown
      const titleInput = screen.getByLabelText("Title*");
      await user.click(titleInput);

      await waitFor(() => {
        expect(
          screen.getByText("💡 3 existing sections available")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Content Creation with Section", () => {
    it("should create content with selected section", async () => {
      const user = userEvent.setup();

      contentAPI.create.mockResolvedValue({
        data: {
          _id: "new-content",
          title: "Test Content",
          section: "Fundamentals",
        },
      });

      render(<ContentManager />);

      // Wait for initial load and open form
      await waitFor(() => {
        expect(screen.getByText("[CONTENT MANAGEMENT]")).toBeInTheDocument();
      });

      const addButton = screen.getByText("Add Content");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Create New Content")).toBeInTheDocument();
      });

      // Fill in form
      const moduleSelect = screen.getByDisplayValue("Select Module");
      await user.selectOptions(moduleSelect, "module-1");

      const titleInput = screen.getByLabelText("Title*");
      await user.type(titleInput, "Test Content");

      const descriptionInput = screen.getByLabelText("Description*");
      await user.type(descriptionInput, "Test description");

      // Wait for sections to load and select one
      await waitFor(() => {
        expect(contentAPI.getSectionsByModule).toHaveBeenCalled();
      });

      const sectionInput = screen.getByPlaceholderText(
        "Type to search existing sections or create new one"
      );
      await user.click(sectionInput);

      await waitFor(() => {
        expect(screen.getByText("📁 Fundamentals")).toBeInTheDocument();
      });

      await user.click(screen.getByText("📁 Fundamentals"));

      // Submit form
      const submitButton = screen.getByText("Create");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(contentAPI.create).toHaveBeenCalledWith(
          expect.objectContaining({
            moduleId: "module-1",
            title: "Test Content",
            description: "Test description",
            section: "Fundamentals",
          })
        );
      });
    });

    it("should handle section loading state", async () => {
      const user = userEvent.setup();

      // Mock slow API response
      contentAPI.getSectionsByModule.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: mockSections }), 100)
          )
      );

      render(<ContentManager />);

      await waitFor(() => {
        expect(screen.getByText("[CONTENT MANAGEMENT]")).toBeInTheDocument();
      });

      const addButton = screen.getByText("Add Content");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Create New Content")).toBeInTheDocument();
      });

      // Select module to trigger loading
      const moduleSelect = screen.getByDisplayValue("Select Module");
      await user.selectOptions(moduleSelect, "module-1");

      // Check loading state
      expect(screen.getByText("(Loading sections...)")).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(
          screen.queryByText("(Loading sections...)")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Edit Content with Section", () => {
    it("should populate section field when editing content", async () => {
      render(<ContentManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Click edit button for first content item
      const editButtons = screen.getAllByText("Edit");
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Edit Content")).toBeInTheDocument();
      });

      // Check that section field is populated
      const sectionInput = screen.getByDisplayValue("Fundamentals");
      expect(sectionInput).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle section fetch error gracefully", async () => {
      const user = userEvent.setup();

      contentAPI.getSectionsByModule.mockRejectedValue(new Error("API Error"));

      render(<ContentManager />);

      await waitFor(() => {
        expect(screen.getByText("[CONTENT MANAGEMENT]")).toBeInTheDocument();
      });

      const addButton = screen.getByText("Add Content");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Create New Content")).toBeInTheDocument();
      });

      // Select module
      const moduleSelect = screen.getByDisplayValue("Select Module");
      await user.selectOptions(moduleSelect, "module-1");

      // API should be called and fail, but UI should still work
      await waitFor(() => {
        expect(contentAPI.getSectionsByModule).toHaveBeenCalled();
      });

      // Section input should still be enabled
      const sectionInput = screen.getByPlaceholderText(
        "Type to search existing sections or create new one"
      );
      expect(sectionInput).not.toBeDisabled();
    });
  });
});
