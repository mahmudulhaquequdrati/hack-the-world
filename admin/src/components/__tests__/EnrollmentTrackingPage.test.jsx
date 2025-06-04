import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../services/api";
import EnrollmentTrackingPage from "../EnrollmentTrackingPage";

// Mock the API services
vi.mock("../../services/api", () => ({
  enrollmentAPI: {
    getAllAdmin: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    complete: vi.fn(),
  },
  default: {
    modules: {
      getAll: vi.fn(),
    },
  },
}));

// Mock react-router-dom hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Link: ({ to, children, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

const mockEnrollments = [
  {
    _id: "1",
    userId: {
      username: "testuser1",
      email: "test1@example.com",
    },
    moduleId: {
      _id: "module1",
      title: "Introduction to Cybersecurity",
      difficulty: "beginner",
    },
    status: "active",
    progressPercentage: 45,
    completedSections: 3,
    totalSections: 8,
    enrolledAt: "2024-01-15T10:00:00Z",
    lastAccessedAt: "2024-01-20T14:30:00Z",
  },
  {
    _id: "2",
    userId: {
      username: "testuser2",
      email: "test2@example.com",
    },
    moduleId: {
      _id: "module2",
      title: "Advanced Network Security",
      difficulty: "advanced",
    },
    status: "completed",
    progressPercentage: 100,
    completedSections: 12,
    totalSections: 12,
    enrolledAt: "2024-01-10T09:00:00Z",
    lastAccessedAt: "2024-01-18T16:45:00Z",
  },
];

const mockModules = [
  {
    id: "module1",
    title: "Introduction to Cybersecurity",
  },
  {
    id: "module2",
    title: "Advanced Network Security",
  },
];

describe("EnrollmentTrackingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default successful API responses
    api.enrollmentAPI.getAllAdmin.mockResolvedValue({
      success: true,
      data: mockEnrollments,
      pagination: {
        page: 1,
        limit: 20,
        pages: 1,
        total: 2,
      },
    });

    api.default.modules.getAll.mockResolvedValue({
      success: true,
      data: mockModules,
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <EnrollmentTrackingPage />
      </BrowserRouter>
    );
  };

  it("should render enrollment tracking page header", async () => {
    renderComponent();

    expect(screen.getByText("Enrollment Tracking")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Monitor and manage student enrollments across all modules"
      )
    ).toBeInTheDocument();
  });

  it("should display loading state initially", () => {
    renderComponent();

    expect(screen.getByText("Loading enrollment data...")).toBeInTheDocument();
  });

  it("should display enrollment statistics cards", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Total Enrollments")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Completed")).toBeInTheDocument();
      expect(screen.getByText("Paused")).toBeInTheDocument();
      expect(screen.getByText("Dropped")).toBeInTheDocument();
      expect(screen.getByText("Avg Progress")).toBeInTheDocument();
      expect(screen.getByText("Completion Rate")).toBeInTheDocument();
    });
  });

  it("should display enrollment data in list view", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("testuser1")).toBeInTheDocument();
      expect(screen.getByText("test1@example.com")).toBeInTheDocument();
      expect(
        screen.getAllByText("Introduction to Cybersecurity")[0]
      ).toBeInTheDocument();
      expect(screen.getByText("testuser2")).toBeInTheDocument();
      expect(screen.getByText("Advanced Network Security")).toBeInTheDocument();
    });
  });

  it("should allow switching between list and grid views", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("testuser1")).toBeInTheDocument();
    });

    // Switch to grid view
    fireEvent.click(screen.getByText("📱 Enrollments Grid"));

    // Should still show enrollment data but in grid format
    expect(screen.getByText("testuser1")).toBeInTheDocument();
    expect(
      screen.getAllByText("Introduction to Cybersecurity")[0]
    ).toBeInTheDocument();
  });

  it("should handle search functionality", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("testuser1")).toBeInTheDocument();
      expect(screen.getByText("testuser2")).toBeInTheDocument();
    });

    // Search for specific user
    const searchInput = screen.getByPlaceholderText(
      "Search by username, email, or module..."
    );
    fireEvent.change(searchInput, { target: { value: "testuser1" } });

    // Should show only matching enrollment
    expect(screen.getByText("testuser1")).toBeInTheDocument();
    expect(screen.queryByText("testuser2")).not.toBeInTheDocument();
  });

  it("should handle status filtering", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("testuser1")).toBeInTheDocument();
      expect(screen.getByText("testuser2")).toBeInTheDocument();
    });

    // Filter by completed status
    const statusFilter = screen.getByDisplayValue("All Statuses");
    fireEvent.change(statusFilter, { target: { value: "completed" } });

    await waitFor(() => {
      expect(api.enrollmentAPI.getAllAdmin).toHaveBeenCalledWith(
        expect.objectContaining({ status: "completed" })
      );
    });
  });

  it("should handle enrollment status changes", async () => {
    api.enrollmentAPI.pause.mockResolvedValue({ success: true });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("testuser1")).toBeInTheDocument();
    });

    // Find and click pause button for active enrollment (use getAllByText to handle multiple)
    const pauseButtons = screen.getAllByText("Pause");
    fireEvent.click(pauseButtons[0]);

    await waitFor(() => {
      expect(api.enrollmentAPI.pause).toHaveBeenCalledWith("1");
    });
  });

  it("should handle bulk actions", async () => {
    api.enrollmentAPI.pause.mockResolvedValue({ success: true });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("testuser1")).toBeInTheDocument();
    });

    // Select enrollments
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // First enrollment checkbox (index 0 is "select all")

    // Bulk pause action should appear
    await waitFor(() => {
      expect(screen.getByText("1 selected:")).toBeInTheDocument();
    });

    // Use a more specific selector for bulk actions
    const bulkActionsContainer = screen.getByText("1 selected:").parentElement;
    const bulkPauseButton = bulkActionsContainer.querySelector("button");
    fireEvent.click(bulkPauseButton);

    await waitFor(() => {
      expect(api.enrollmentAPI.pause).toHaveBeenCalledWith("1");
    });
  });

  it("should handle API errors gracefully", async () => {
    api.enrollmentAPI.getAllAdmin.mockRejectedValue(new Error("API Error"));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch enrollments. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("should display empty state when no enrollments found", async () => {
    api.enrollmentAPI.getAllAdmin.mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 20, pages: 0, total: 0 },
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("No enrollments found matching your criteria.")
      ).toBeInTheDocument();
    });
  });

  it("should calculate and display correct statistics", async () => {
    renderComponent();

    await waitFor(() => {
      // Check for total enrollments
      expect(screen.getByText("2")).toBeInTheDocument(); // Total enrollments

      // Check for completion rate
      expect(screen.getByText("50%")).toBeInTheDocument(); // Completion rate (1/2 * 100)

      // Check for average progress
      expect(screen.getByText("73%")).toBeInTheDocument(); // Average progress ((45+100)/2 = 72.5 rounded to 73)
    });
  });

  describe("View Mode Switching", () => {
    it("switches to grid view when grid button is clicked", async () => {
      render(
        <BrowserRouter>
          <EnrollmentTrackingPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("testuser1")).toBeInTheDocument();
      });

      const gridButton = screen.getByText("📱 Enrollments Grid");
      fireEvent.click(gridButton);

      expect(gridButton).toHaveClass("bg-cyan-600 text-white");
    });

    it("switches to modules view when modules button is clicked", async () => {
      render(
        <BrowserRouter>
          <EnrollmentTrackingPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("testuser1")).toBeInTheDocument();
      });

      const modulesButton = screen.getByText("📚 Enrolled Modules");
      fireEvent.click(modulesButton);

      expect(modulesButton).toHaveClass("bg-cyan-600 text-white");

      await waitFor(() => {
        expect(
          screen.getByText("Enrolled Modules Overview")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Enrolled Modules View", () => {
    beforeEach(async () => {
      render(
        <BrowserRouter>
          <EnrollmentTrackingPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("testuser1")).toBeInTheDocument();
      });

      const modulesButton = screen.getByText("📚 Enrolled Modules");
      fireEvent.click(modulesButton);

      await waitFor(() => {
        expect(
          screen.getByText("Enrolled Modules Overview")
        ).toBeInTheDocument();
      });
    });

    it("displays enrolled modules with aggregated statistics", async () => {
      // Check if modules are displayed
      expect(
        screen.getByText("Introduction to Cybersecurity")
      ).toBeInTheDocument();
      expect(screen.getByText("Advanced Network Security")).toBeInTheDocument();

      // Check if statistics are calculated correctly
      // Module 1 should have 2 enrollments (1 active, 1 completed)
      const moduleCards = screen.getAllByText("2"); // Total enrollments for module 1
      expect(moduleCards.length).toBeGreaterThan(0);
    });

    it("shows correct difficulty badges", async () => {
      expect(screen.getByText("Beginner")).toBeInTheDocument();
      expect(screen.getByText("Advanced")).toBeInTheDocument();
    });

    it("displays total enrollments summary", async () => {
      expect(screen.getByText("Total Enrollments")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument(); // Total of all enrollments
    });

    it("shows View Details links for each module", async () => {
      const viewDetailsLinks = screen.getAllByText("View Details →");
      expect(viewDetailsLinks).toHaveLength(2); // One for each module
    });
  });

  describe("Module Filtering and Sorting", () => {
    beforeEach(async () => {
      render(
        <BrowserRouter>
          <EnrollmentTrackingPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("testuser1")).toBeInTheDocument();
      });

      const modulesButton = screen.getByText("📚 Enrolled Modules");
      fireEvent.click(modulesButton);

      await waitFor(() => {
        expect(
          screen.getByText("Enrolled Modules Overview")
        ).toBeInTheDocument();
      });
    });

    it("filters modules by search term", async () => {
      const searchInput = screen.getByPlaceholderText(
        "Search by title, description..."
      );
      fireEvent.change(searchInput, { target: { value: "Cybersecurity" } });

      await waitFor(() => {
        expect(
          screen.getByText("Introduction to Cybersecurity")
        ).toBeInTheDocument();
        expect(
          screen.queryByText("Advanced Network Security")
        ).not.toBeInTheDocument();
      });
    });

    it("changes sort order when sort options are selected", async () => {
      const sortBySelect = screen.getByDisplayValue("Module Title");
      fireEvent.change(sortBySelect, { target: { value: "enrollments" } });

      expect(sortBySelect.value).toBe("enrollments");

      const sortOrderSelect = screen.getByDisplayValue("Ascending");
      fireEvent.change(sortOrderSelect, { target: { value: "desc" } });

      expect(sortOrderSelect.value).toBe("desc");
    });
  });

  describe("Enrollment List Display", () => {
    it("displays enrollment data correctly", async () => {
      render(
        <BrowserRouter>
          <EnrollmentTrackingPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("testuser1")).toBeInTheDocument();
        expect(screen.getByText("test1@example.com")).toBeInTheDocument();
        expect(screen.getByText("testuser2")).toBeInTheDocument();
        expect(screen.getByText("test2@example.com")).toBeInTheDocument();
      });

      // Check enrollment status badges
      expect(screen.getByText("active")).toBeInTheDocument();
      expect(screen.getByText("completed")).toBeInTheDocument();
      expect(screen.getByText("paused")).toBeInTheDocument();
    });

    it("allows switching between list and grid views", async () => {
      render(
        <BrowserRouter>
          <EnrollmentTrackingPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("testuser1")).toBeInTheDocument();
      });

      // Switch to grid view
      fireEvent.click(screen.getByText("📱 Enrollments Grid"));

      // Should still show enrollment data but in grid format
      expect(screen.getByText("testuser1")).toBeInTheDocument();
      expect(screen.getByText("testuser2")).toBeInTheDocument();
    });
  });

  describe("Search and Filter Functionality", () => {
    it("handles search functionality", async () => {
      render(
        <BrowserRouter>
          <EnrollmentTrackingPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("testuser1")).toBeInTheDocument();
      });

      // Search for specific user
      const searchInput = screen.getByPlaceholderText(
        "Search by username or email..."
      );
      fireEvent.change(searchInput, { target: { value: "testuser1" } });

      // Should filter results
      expect(searchInput.value).toBe("testuser1");
    });

    it("handles status filter changes", async () => {
      render(
        <BrowserRouter>
          <EnrollmentTrackingPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("testuser1")).toBeInTheDocument();
      });

      // Change status filter
      const statusSelect = screen.getByDisplayValue("All Statuses");
      fireEvent.change(statusSelect, { target: { value: "active" } });

      expect(statusSelect.value).toBe("active");
    });
  });

  describe("Bulk Actions", () => {
    it("handles bulk actions", async () => {
      render(
        <BrowserRouter>
          <EnrollmentTrackingPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("testuser1")).toBeInTheDocument();
      });

      // Select an enrollment
      const checkbox = screen.getAllByRole("checkbox")[0];
      fireEvent.click(checkbox);

      // Bulk pause action should appear
      await waitFor(() => {
        expect(
          screen.getByText(/enrollment\(s\) selected/)
        ).toBeInTheDocument();
      });

      // Try bulk pause action
      const pauseButton = screen.getByText("Pause Selected");
      fireEvent.click(pauseButton);

      await waitFor(() => {
        expect(api.enrollmentAPI.pause).toHaveBeenCalled();
      });
    });
  });

  describe("Empty States", () => {
    it("shows empty state when no modules have enrollments", async () => {
      api.enrollmentAPI.getAllAdmin.mockResolvedValue({
        success: true,
        data: [],
        pagination: { page: 1, limit: 20, pages: 0, total: 0 },
      });

      render(
        <BrowserRouter>
          <EnrollmentTrackingPage />
        </BrowserRouter>
      );

      const modulesButton = screen.getByText("📚 Enrolled Modules");
      fireEvent.click(modulesButton);

      await waitFor(() => {
        expect(
          screen.getByText("No Enrolled Modules Found")
        ).toBeInTheDocument();
        expect(
          screen.getByText("No students are currently enrolled in any modules.")
        ).toBeInTheDocument();
      });
    });
  });
});
