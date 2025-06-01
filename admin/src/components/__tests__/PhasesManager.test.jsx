import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAPI, mockAPIErrors, resetMocks } from "../../test/mocks/api";
import { renderWithRouter } from "../../test/utils/testUtils";
import PhasesManager from "../PhasesManager";

// Mock the API service
vi.mock("../../services/api", () => ({
  phasesAPI: mockAPI.phases,
}));

describe("PhasesManager", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    resetMocks();
    // Reset localStorage
    localStorage.clear();

    // Reset mock implementations to default
    mockAPI.phases.getAll.mockResolvedValue({
      success: true,
      data: [
        {
          id: "507f1f77bcf86cd799439011",
          title: "Beginner",
          description: "Introduction to cybersecurity concepts",
          icon: "Shield",
          order: 1,
          color: "#22c55e",
          isActive: true,
        },
        {
          id: "507f1f77bcf86cd799439012",
          title: "Intermediate",
          description: "Advanced cybersecurity techniques",
          icon: "Shield",
          order: 2,
          color: "#f59e0b",
          isActive: true,
        },
      ],
    });
  });

  describe("Component Rendering", () => {
    it("should render without crashing", async () => {
      renderWithRouter(<PhasesManager />);

      expect(screen.getByText("Phases Management")).toBeInTheDocument();
      expect(screen.getByText("Add New Phase")).toBeInTheDocument();

      // Wait for phases to load
      await waitFor(() => {
        expect(mockAPI.phases.getAll).toHaveBeenCalledTimes(1);
      });
    });

    it("should display loading state while fetching phases", async () => {
      // Mock a delayed response
      mockAPI.phases.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderWithRouter(<PhasesManager />);

      expect(screen.getByText("Loading phases...")).toBeInTheDocument();

      await waitFor(
        () => {
          expect(
            screen.queryByText("Loading phases...")
          ).not.toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    it("should display phases after successful load", async () => {
      renderWithRouter(<PhasesManager />);

      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
        expect(screen.getByText("Intermediate")).toBeInTheDocument();
      });
    });

    it("should display error message when phases fail to load", async () => {
      mockAPI.phases.getAll.mockRejectedValue(mockAPIErrors.serverError);

      renderWithRouter(<PhasesManager />);

      await waitFor(() => {
        expect(screen.getByText(/Internal server error/i)).toBeInTheDocument();
      });
    });
  });

  describe("Phase Creation", () => {
    it("should open create modal when Add New Phase button is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<PhasesManager />);

      const addButton = screen.getByText("Add New Phase");
      await user.click(addButton);

      expect(screen.getByText("Add New Phase")).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/order/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/color/i)).toBeInTheDocument();
    });

    it("should create a new phase successfully", async () => {
      const user = userEvent.setup();
      renderWithRouter(<PhasesManager />);

      // Open modal
      const addButton = screen.getByText("Add New Phase");
      await user.click(addButton);

      // Fill form
      await user.type(screen.getByLabelText(/title/i), "Advanced");
      await user.type(
        screen.getByLabelText(/description/i),
        "Advanced cybersecurity concepts"
      );
      await user.type(screen.getByLabelText(/icon/i), "⚡");
      await user.type(screen.getByLabelText(/order/i), "3");

      // Update color field
      const colorInput = screen.getByDisplayValue("#00ff00");
      await user.clear(colorInput);
      await user.type(colorInput, "#ef4444");

      // Submit form
      const createButton = screen.getByRole("button", {
        name: /create phase/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(mockAPI.phases.create).toHaveBeenCalledWith({
          title: "Advanced",
          description: "Advanced cybersecurity concepts",
          icon: "⚡",
          color: "#ef4444",
          order: 3,
        });
      });

      // Check success message
      await waitFor(() => {
        expect(
          screen.getByText(/phase created successfully/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate required fields", async () => {
      const user = userEvent.setup();
      renderWithRouter(<PhasesManager />);

      // Open modal
      const addButton = screen.getByText("Add New Phase");
      await user.click(addButton);

      // Try to submit without filling required fields
      const createButton = screen.getByRole("button", {
        name: /create phase/i,
      });
      await user.click(createButton);

      // Check validation messages
      await waitFor(() => {
        expect(
          screen.getByText(/all fields are required/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate color format", async () => {
      const user = userEvent.setup();
      renderWithRouter(<PhasesManager />);

      // Open modal
      const addButton = screen.getByText("Add New Phase");
      await user.click(addButton);

      // Fill form with invalid color
      await user.type(screen.getByLabelText(/title/i), "Test Phase");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description"
      );
      await user.type(screen.getByLabelText(/icon/i), "🔒");
      await user.type(screen.getByLabelText(/order/i), "1");

      // Enter invalid color
      const colorInput = screen.getByDisplayValue("#00ff00");
      await user.clear(colorInput);
      await user.type(colorInput, "invalid-color");

      // Try to submit
      const createButton = screen.getByRole("button", {
        name: /create phase/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid hex color/i)
        ).toBeInTheDocument();
      });
    });

    it("should handle creation errors", async () => {
      const user = userEvent.setup();
      mockAPI.phases.create.mockRejectedValue(mockAPIErrors.validationError);

      renderWithRouter(<PhasesManager />);

      // Open modal and fill form
      const addButton = screen.getByText("Add New Phase");
      await user.click(addButton);

      await user.type(screen.getByLabelText(/title/i), "Test Phase");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description"
      );
      await user.type(screen.getByLabelText(/icon/i), "🔒");
      await user.type(screen.getByLabelText(/order/i), "1");

      // Submit form
      const createButton = screen.getByRole("button", {
        name: /create phase/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByText(/validation error/i)).toBeInTheDocument();
      });
    });
  });

  describe("Phase Updates", () => {
    it("should open edit modal when edit button is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter(<PhasesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
      });

      // Click edit button (find by title attribute)
      const editButton = screen.getByTitle("Edit Phase");
      await user.click(editButton);

      expect(screen.getByText("Edit Phase")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Beginner")).toBeInTheDocument();
    });

    it("should update phase successfully", async () => {
      const user = userEvent.setup();
      renderWithRouter(<PhasesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
      });

      // Click edit button
      const editButton = screen.getByTitle("Edit Phase");
      await user.click(editButton);

      // Update form
      const titleInput = screen.getByDisplayValue("Beginner");
      await user.clear(titleInput);
      await user.type(titleInput, "Updated Beginner");

      // Submit form
      const updateButton = screen.getByRole("button", {
        name: /update phase/i,
      });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockAPI.phases.update).toHaveBeenCalledWith(
          "507f1f77bcf86cd799439011",
          expect.objectContaining({
            title: "Updated Beginner",
          })
        );
      });
    });

    it("should handle update errors", async () => {
      const user = userEvent.setup();
      mockAPI.phases.update.mockRejectedValue(mockAPIErrors.serverError);

      renderWithRouter(<PhasesManager />);

      // Wait for phases to load and click edit
      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
      });

      const editButton = screen.getByTitle("Edit Phase");
      await user.click(editButton);

      // Submit form
      const updateButton = screen.getByRole("button", {
        name: /update phase/i,
      });
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
      });
    });
  });

  describe("Phase Deletion", () => {
    it("should show confirmation dialog when delete button is clicked", async () => {
      const user = userEvent.setup();

      // Mock window.confirm
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

      renderWithRouter(<PhasesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByTitle("Delete Phase");
      await user.click(deleteButton);

      expect(confirmSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Are you sure you want to delete the phase "Beginner"'
        )
      );

      confirmSpy.mockRestore();
    });

    it("should delete phase when confirmed", async () => {
      const user = userEvent.setup();

      // Mock window.confirm to return true
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

      renderWithRouter(<PhasesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByTitle("Delete Phase");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockAPI.phases.delete).toHaveBeenCalledWith(
          "507f1f77bcf86cd799439011"
        );
      });

      // Check success message
      await waitFor(() => {
        expect(
          screen.getByText(/phase deleted successfully/i)
        ).toBeInTheDocument();
      });

      confirmSpy.mockRestore();
    });

    it("should cancel deletion when cancelled", async () => {
      const user = userEvent.setup();

      // Mock window.confirm to return false
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

      renderWithRouter(<PhasesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByTitle("Delete Phase");
      await user.click(deleteButton);

      expect(mockAPI.phases.delete).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it("should handle deletion errors", async () => {
      const user = userEvent.setup();

      // Mock window.confirm to return true and API to reject
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
      mockAPI.phases.delete.mockRejectedValue(mockAPIErrors.serverError);

      renderWithRouter(<PhasesManager />);

      // Wait for phases to load
      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByTitle("Delete Phase");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
      });

      confirmSpy.mockRestore();
    });
  });

  describe("User Experience", () => {
    it("should clear success messages after 5 seconds", async () => {
      vi.useFakeTimers();
      const user = userEvent.setup();

      renderWithRouter(<PhasesManager />);

      // Trigger a successful create operation
      const addButton = screen.getByText("Add New Phase");
      await user.click(addButton);

      await user.type(screen.getByLabelText(/title/i), "Test Phase");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description"
      );
      await user.type(screen.getByLabelText(/icon/i), "🔒");
      await user.type(screen.getByLabelText(/order/i), "1");

      const createButton = screen.getByRole("button", {
        name: /create phase/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(
          screen.getByText(/phase created successfully/i)
        ).toBeInTheDocument();
      });

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(
          screen.queryByText(/phase created successfully/i)
        ).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it("should close modal after successful operations", async () => {
      const user = userEvent.setup();
      renderWithRouter(<PhasesManager />);

      // Open modal
      const addButton = screen.getByText("Add New Phase");
      await user.click(addButton);

      expect(screen.getByText("Add New Phase")).toBeInTheDocument();

      // Fill and submit form
      await user.type(screen.getByLabelText(/title/i), "Test Phase");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description"
      );
      await user.type(screen.getByLabelText(/icon/i), "🔒");
      await user.type(screen.getByLabelText(/order/i), "1");

      const createButton = screen.getByRole("button", {
        name: /create phase/i,
      });
      await user.click(createButton);

      // Modal should close after successful creation
      await waitFor(() => {
        expect(screen.queryByText("Add New Phase")).not.toBeInTheDocument();
      });
    });

    it("should disable form during loading states", async () => {
      const user = userEvent.setup();

      // Mock a delayed API response
      mockAPI.phases.create.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderWithRouter(<PhasesManager />);

      // Open modal and fill form
      const addButton = screen.getByText("Add New Phase");
      await user.click(addButton);

      await user.type(screen.getByLabelText(/title/i), "Test Phase");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description"
      );
      await user.type(screen.getByLabelText(/icon/i), "🔒");
      await user.type(screen.getByLabelText(/order/i), "1");

      // Submit form
      const createButton = screen.getByRole("button", {
        name: /create phase/i,
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
      renderWithRouter(<PhasesManager />);

      // Check for proper form labels
      const addButton = screen.getByText("Add New Phase");
      expect(addButton).toHaveAttribute("type", "button");

      // Wait for phases to load
      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
      });

      // Check table structure
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("columnheader")).toHaveLength(7); // Order, ID, Title, Description, Icon, Color, Actions
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      renderWithRouter(<PhasesManager />);

      // Tab through interactive elements
      await user.tab();
      expect(screen.getByText("Add New Phase")).toHaveFocus();

      // Continue tabbing to reach table action buttons
      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
      });

      // Should be able to reach edit and delete buttons via keyboard
      const editButton = screen.getByTitle("Edit Phase");
      await user.tab();
      await user.tab();
      expect(editButton).toHaveFocus();
    });
  });
});
