import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAPI, mockAPIErrors } from "../../test/mocks/api";
import { renderWithRouter } from "../../test/utils/testUtils";
import ModulesManager from "../ModulesManager";

// Mock the API service
vi.mock("../../services/api", () => ({
  modulesAPI: mockAPI.modules,
  phasesAPI: mockAPI.phases,
}));

describe("ModulesManager", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  describe("Component Rendering", () => {
    it("should render without crashing", async () => {
      renderWithRouter(<ModulesManager />);

      expect(screen.getByText("Modules Management")).toBeInTheDocument();
      expect(screen.getByText("Add New Module")).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(mockAPI.modules.getAll).toHaveBeenCalledTimes(1);
        expect(mockAPI.phases.getAll).toHaveBeenCalledTimes(1);
      });
    });

    it("should display loading state while fetching data", async () => {
      // Mock delayed responses
      mockAPI.modules.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      mockAPI.phases.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderWithRouter(<ModulesManager />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();

      await waitFor(
        () => {
          expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    it("should display statistics dashboard", async () => {
      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(screen.getByText("Total Modules")).toBeInTheDocument();
        expect(screen.getByText("Active Modules")).toBeInTheDocument();
        expect(screen.getByText("Total Enrollments")).toBeInTheDocument();
        expect(screen.getByText("Avg. Duration")).toBeInTheDocument();
      });

      // Check calculated statistics
      expect(screen.getByText("2")).toBeInTheDocument(); // Total modules
      expect(screen.getByText("239")).toBeInTheDocument(); // Total enrollments (150 + 89)
    });

    it("should display modules after successful load", async () => {
      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
        expect(screen.getByText("Network Security")).toBeInTheDocument();
      });
    });

    it("should display error message when modules fail to load", async () => {
      mockAPI.modules.getAll.mockRejectedValue(mockAPIErrors.serverError);

      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(screen.getByText(/error loading modules/i)).toBeInTheDocument();
      });
    });
  });

  describe("Module Creation", () => {
    it("should open create modal when Add New Module button is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for phases to load first
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalled();
      });

      const addButton = screen.getByText("Add New Module");
      await user.click(addButton);

      expect(screen.getByText("Add New Module")).toBeInTheDocument();
      expect(screen.getByLabelText(/module title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phase/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/order/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/difficulty/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/estimated time/i)).toBeInTheDocument();
    });

    it("should create a new module successfully", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for data to load
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalled();
      });

      // Open modal
      const addButton = screen.getByText("Add New Module");
      await user.click(addButton);

      // Fill form
      await user.type(
        screen.getByLabelText(/module title/i),
        "Advanced Penetration Testing"
      );
      await user.type(
        screen.getByLabelText(/description/i),
        "Learn advanced penetration testing techniques"
      );
      await user.selectOptions(
        screen.getByLabelText(/phase/i),
        "507f1f77bcf86cd799439012"
      );
      await user.type(screen.getByLabelText(/order/i), "1");
      await user.selectOptions(
        screen.getByLabelText(/difficulty/i),
        "advanced"
      );
      await user.type(screen.getByLabelText(/estimated time/i), "240");
      await user.type(
        screen.getByLabelText(/topics/i),
        "SQL Injection, XSS, Buffer Overflow"
      );

      // Submit form
      const createButton = screen.getByRole("button", {
        name: /create module/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(mockAPI.modules.create).toHaveBeenCalledWith({
          title: "Advanced Penetration Testing",
          description: "Learn advanced penetration testing techniques",
          phaseId: "507f1f77bcf86cd799439012",
          order: 1,
          difficulty: "advanced",
          estimatedTime: 240,
          topics: ["SQL Injection", "XSS", "Buffer Overflow"],
          isActive: true,
        });
      });

      // Check success message
      await waitFor(() => {
        expect(
          screen.getByText(/module created successfully/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate required fields", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalled();
      });

      // Open modal
      const addButton = screen.getByText("Add New Module");
      await user.click(addButton);

      // Try to submit without filling required fields
      const createButton = screen.getByRole("button", {
        name: /create module/i,
      });
      await user.click(createButton);

      // Check validation messages
      expect(screen.getByText(/module title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phase is required/i)).toBeInTheDocument();
    });

    it("should validate estimated time is positive", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalled();
      });

      // Open modal
      const addButton = screen.getByText("Add New Module");
      await user.click(addButton);

      // Fill form with invalid estimated time
      await user.type(screen.getByLabelText(/module title/i), "Test Module");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description"
      );
      await user.type(screen.getByLabelText(/estimated time/i), "-10");

      // Try to submit
      const createButton = screen.getByRole("button", {
        name: /create module/i,
      });
      await user.click(createButton);

      expect(
        screen.getByText(/estimated time must be positive/i)
      ).toBeInTheDocument();
    });

    it("should handle creation errors", async () => {
      const user = userEvent.setup();
      mockAPI.modules.create.mockRejectedValue(mockAPIErrors.validationError);

      renderWithRouter(<ModulesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalled();
      });

      // Open modal and fill form
      const addButton = screen.getByText("Add New Module");
      await user.click(addButton);

      await user.type(screen.getByLabelText(/module title/i), "Test Module");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description"
      );

      // Submit form
      const createButton = screen.getByRole("button", {
        name: /create module/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByText(/validation error/i)).toBeInTheDocument();
      });
    });
  });

  describe("Module Updates", () => {
    it("should open edit modal when edit button is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for modules to load
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Click edit button for first module
      const editButtons = screen.getAllByText("Edit");
      await user.click(editButtons[0]);

      expect(screen.getByText("Edit Module")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Introduction to Cybersecurity")
      ).toBeInTheDocument();
    });

    it("should update module successfully", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for modules to load
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Click edit button
      const editButtons = screen.getAllByText("Edit");
      await user.click(editButtons[0]);

      // Update form
      const titleInput = screen.getByDisplayValue(
        "Introduction to Cybersecurity"
      );
      await user.clear(titleInput);
      await user.type(titleInput, "Updated Introduction to Cybersecurity");

      // Submit form
      const updateButton = screen.getByRole("button", {
        name: /update module/i,
      });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockAPI.modules.update).toHaveBeenCalledWith(
          "507f1f77bcf86cd799439021",
          expect.objectContaining({
            title: "Updated Introduction to Cybersecurity",
          })
        );
      });
    });

    it("should handle topics as comma-separated values", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for modules to load
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Click edit button
      const editButtons = screen.getAllByText("Edit");
      await user.click(editButtons[0]);

      // Update topics
      const topicsInput = screen.getByLabelText(/topics/i);
      await user.clear(topicsInput);
      await user.type(topicsInput, "Topic 1, Topic 2, Topic 3");

      // Submit form
      const updateButton = screen.getByRole("button", {
        name: /update module/i,
      });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockAPI.modules.update).toHaveBeenCalledWith(
          "507f1f77bcf86cd799439021",
          expect.objectContaining({
            topics: ["Topic 1", "Topic 2", "Topic 3"],
          })
        );
      });
    });

    it("should handle update errors", async () => {
      const user = userEvent.setup();
      mockAPI.modules.update.mockRejectedValue(mockAPIErrors.serverError);

      renderWithRouter(<ModulesManager />);

      // Wait for modules to load and click edit
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText("Edit");
      await user.click(editButtons[0]);

      // Submit form
      const updateButton = screen.getByRole("button", {
        name: /update module/i,
      });
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
      });
    });
  });

  describe("Module Deletion", () => {
    it("should show confirmation dialog when delete button is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for modules to load
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Click delete button
      const deleteButtons = screen.getAllByText("Delete");
      await user.click(deleteButtons[0]);

      expect(
        screen.getByText(/are you sure you want to delete/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/this action cannot be undone/i)
      ).toBeInTheDocument();
    });

    it("should delete module when confirmed", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for modules to load
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Click delete button
      const deleteButtons = screen.getAllByText("Delete");
      await user.click(deleteButtons[0]);

      // Confirm deletion
      const confirmButton = screen.getByRole("button", {
        name: /yes, delete/i,
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockAPI.modules.delete).toHaveBeenCalledWith(
          "507f1f77bcf86cd799439021"
        );
      });

      // Check success message
      await waitFor(() => {
        expect(
          screen.getByText(/module deleted successfully/i)
        ).toBeInTheDocument();
      });
    });

    it("should cancel deletion when cancelled", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for modules to load
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Click delete button
      const deleteButtons = screen.getAllByText("Delete");
      await user.click(deleteButtons[0]);

      // Cancel deletion
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockAPI.modules.delete).not.toHaveBeenCalled();
      expect(
        screen.queryByText(/are you sure you want to delete/i)
      ).not.toBeInTheDocument();
    });

    it("should handle deletion errors", async () => {
      const user = userEvent.setup();
      mockAPI.modules.delete.mockRejectedValue(mockAPIErrors.serverError);

      renderWithRouter(<ModulesManager />);

      // Wait for modules to load
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Click delete and confirm
      const deleteButtons = screen.getAllByText("Delete");
      await user.click(deleteButtons[0]);

      const confirmButton = screen.getByRole("button", {
        name: /yes, delete/i,
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
      });
    });
  });

  describe("Data Display and Sorting", () => {
    it("should display difficulty badges with correct colors", async () => {
      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Check difficulty badges
      const beginnerBadge = screen.getByText("beginner");
      const intermediateBadge = screen.getByText("intermediate");

      expect(beginnerBadge).toBeInTheDocument();
      expect(intermediateBadge).toBeInTheDocument();
    });

    it("should display phase information correctly", async () => {
      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Both modules should show they belong to the Beginner phase
      const phaseNames = screen.getAllByText("Beginner");
      expect(phaseNames).toHaveLength(2); // One for each module
    });

    it("should display topics as formatted list", async () => {
      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(
          screen.getByText("Security Fundamentals, Threat Landscape")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Firewalls, VPN, Network Monitoring")
        ).toBeInTheDocument();
      });
    });

    it("should display enrollment counts and estimated times", async () => {
      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(screen.getByText("150")).toBeInTheDocument(); // First module enrollment
        expect(screen.getByText("89")).toBeInTheDocument(); // Second module enrollment
        expect(screen.getByText("120 min")).toBeInTheDocument(); // First module time
        expect(screen.getByText("180 min")).toBeInTheDocument(); // Second module time
      });
    });
  });

  describe("Statistics Calculations", () => {
    it("should calculate total modules correctly", async () => {
      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(screen.getByText("Total Modules")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
      });
    });

    it("should calculate active modules correctly", async () => {
      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(screen.getByText("Active Modules")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument(); // Both test modules are active
      });
    });

    it("should calculate total enrollments correctly", async () => {
      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(screen.getByText("Total Enrollments")).toBeInTheDocument();
        expect(screen.getByText("239")).toBeInTheDocument(); // 150 + 89
      });
    });

    it("should calculate average duration correctly", async () => {
      renderWithRouter(<ModulesManager />);

      await waitFor(() => {
        expect(screen.getByText("Avg. Duration")).toBeInTheDocument();
        expect(screen.getByText("150 min")).toBeInTheDocument(); // (120 + 180) / 2
      });
    });
  });

  describe("User Experience", () => {
    it("should clear success messages after 5 seconds", async () => {
      vi.useFakeTimers();
      const user = userEvent.setup();

      renderWithRouter(<ModulesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalled();
      });

      // Trigger a successful create operation
      const addButton = screen.getByText("Add New Module");
      await user.click(addButton);

      await user.type(screen.getByLabelText(/module title/i), "Test Module");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description"
      );

      const createButton = screen.getByRole("button", {
        name: /create module/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(
          screen.getByText(/module created successfully/i)
        ).toBeInTheDocument();
      });

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(
          screen.queryByText(/module created successfully/i)
        ).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it("should close modal after successful operations", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalled();
      });

      // Open modal
      const addButton = screen.getByText("Add New Module");
      await user.click(addButton);

      expect(screen.getByText("Add New Module")).toBeInTheDocument();

      // Fill and submit form
      await user.type(screen.getByLabelText(/module title/i), "Test Module");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description"
      );

      const createButton = screen.getByRole("button", {
        name: /create module/i,
      });
      await user.click(createButton);

      // Modal should close after successful creation
      await waitFor(() => {
        expect(screen.queryByText("Add New Module")).not.toBeInTheDocument();
      });
    });

    it("should disable form during loading states", async () => {
      const user = userEvent.setup();

      // Mock a delayed API response
      mockAPI.modules.create.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderWithRouter(<ModulesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalled();
      });

      // Open modal and fill form
      const addButton = screen.getByText("Add New Module");
      await user.click(addButton);

      await user.type(screen.getByLabelText(/module title/i), "Test Module");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description"
      );

      // Submit form
      const createButton = screen.getByRole("button", {
        name: /create module/i,
      });
      await user.click(createButton);

      // Button should be disabled during loading
      expect(createButton).toBeDisabled();

      // Wait for operation to complete
      await waitFor(
        () => {
          expect(createButton).not.toBeDisabled();
        },
        { timeout: 200 }
      );
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and roles", async () => {
      renderWithRouter(<ModulesManager />);

      // Check for proper form labels
      const addButton = screen.getByText("Add New Module");
      expect(addButton).toHaveAttribute("type", "button");

      // Wait for modules to load
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Check table structure
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("columnheader")).toHaveLength(8); // Title, Phase, Order, Difficulty, Time, Topics, Enrolled, Actions
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      renderWithRouter(<ModulesManager />);

      // Tab through interactive elements
      await user.tab();
      expect(screen.getByText("Add New Module")).toHaveFocus();

      // Continue tabbing to reach table action buttons
      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
      });

      // Should be able to reach edit and delete buttons via keyboard
      const editButtons = screen.getAllByText("Edit");
      await user.tab();
      await user.tab();
      expect(editButtons[0]).toHaveFocus();
    });
  });
});
