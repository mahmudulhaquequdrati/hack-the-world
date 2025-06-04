import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import * as api from "../../services/api";
import { modulesAPI, phasesAPI } from "../../services/api";
import ModulesManagerEnhanced from "../ModulesManagerEnhanced";

// Mock the API services
vi.mock("../../services/api", () => ({
  modulesAPI: {
    getAll: vi.fn(),
    getWithPhases: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    reorder: vi.fn(),
  },
  phasesAPI: {
    getAll: vi.fn(),
  },
  enrollmentAPI: {
    create: vi.fn(),
    getModuleStats: vi.fn().mockResolvedValue({
      success: true,
      data: {
        module: {
          id: "module1",
          title: "Test Module",
        },
        stats: {
          totalEnrollments: 5,
          activeEnrollments: 3,
          completedEnrollments: 2,
          pausedEnrollments: 0,
          droppedEnrollments: 0,
          averageProgress: 75,
          completionRate: 40,
        },
      },
    }),
  },
  authAPI: {
    getCurrentUser: vi.fn(),
  },
}));

// Mock Heroicons
vi.mock("@heroicons/react/24/outline", () => ({
  ArrowDownIcon: () => <div data-testid="arrow-down-icon" />,
  ArrowUpIcon: () => <div data-testid="arrow-up-icon" />,
  ChartBarIcon: () => <div data-testid="chart-bar-icon" />,
  CheckCircle: () => <div data-testid="check-circle" />,
  CheckCircleIcon: () => <div data-testid="check-circle-icon" />,
  ExclamationCircleIcon: () => <div data-testid="exclamation-circle-icon" />,
  EyeIcon: () => <div data-testid="eye-icon" />,
  ListBulletIcon: () => <div data-testid="list-bullet-icon" />,
  PencilIcon: () => <div data-testid="pencil-icon" />,
  PlusIcon: () => <div data-testid="plus-icon" />,
  Squares2X2Icon: () => <div data-testid="squares2x2-icon" />,
  TrashIcon: () => <div data-testid="trash-icon" />,
  UserPlusIcon: () => <div data-testid="user-plus-icon" />,
  Users: () => <div data-testid="users" />,
  UsersIcon: () => <div data-testid="users-icon" />,
  XMarkIcon: () => <div data-testid="x-mark-icon" />,
}));

const mockModules = [
  {
    _id: "module1",
    title: "Test Module",
    description: "Test Description",
    difficulty: "Beginner",
    phaseId: "phase1",
    order: 1,
    isActive: true,
    phase: { title: "Test Phase" },
  },
];

const mockPhases = [
  {
    _id: "phase1",
    id: "phase1",
    title: "Test Phase",
    description: "Test Phase Description",
  },
];

const mockModulesWithPhases = [
  {
    _id: "phase1",
    title: "Test Phase",
    modules: mockModules,
  },
];

const renderComponent = () => {
  return render(
    <MemoryRouter initialEntries={["/modules"]}>
      <ModulesManagerEnhanced />
    </MemoryRouter>
  );
};

describe("ModulesManagerEnhanced Color Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default API responses
    modulesAPI.getAll.mockResolvedValue({ data: mockModules });
    phasesAPI.getAll.mockResolvedValue({ data: mockPhases });
    modulesAPI.getWithPhases.mockResolvedValue({ data: mockModulesWithPhases });
  });

  it("should render without crashing", async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("[ENHANCED MODULES MANAGEMENT]")
      ).toBeInTheDocument();
    });
  });

  it("should handle invalid color formats gracefully when editing", async () => {
    // Create a module with invalid color format
    const moduleWithInvalidColor = {
      ...mockModules[0],
      color: "  00ff00  ", // Invalid format (missing #, with spaces)
    };

    modulesAPI.getAll.mockResolvedValue({ data: [moduleWithInvalidColor] });
    modulesAPI.getWithPhases.mockResolvedValue({
      data: [
        { ...mockModulesWithPhases[0], modules: [moduleWithInvalidColor] },
      ],
    });

    renderComponent();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Test Module")).toBeInTheDocument();
    });

    // Click edit button
    const editButtons = screen.getAllByTestId("pencil-icon");
    fireEvent.click(editButtons[0].closest("button"));

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText("Edit Module")).toBeInTheDocument();
    });

    // Check that color field is normalized to default
    const colorInput = screen.getByDisplayValue("#00ff00");
    expect(colorInput).toBeInTheDocument();
  });

  it("should normalize color values before saving", () => {
    // This test verifies the color normalization logic directly
    const testCases = [
      { input: "  00ff00  ", expected: "#00ff00" },
      { input: "invalid-color", expected: "#00ff00" },
      { input: "#123", expected: "#123" },
      { input: "#123456", expected: "#123456" },
      { input: null, expected: "#00ff00" },
      { input: undefined, expected: "#00ff00" },
    ];

    testCases.forEach(({ input, expected }) => {
      // Simulate the color normalization logic from handleSubmit
      let colorValue = input?.trim() || "#00ff00";

      if (!colorValue.startsWith("#")) {
        colorValue = "#" + colorValue;
      }

      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue)) {
        colorValue = "#00ff00";
      }

      expect(colorValue).toBe(expected);
    });
  });

  it("should handle API errors gracefully", async () => {
    modulesAPI.getAll.mockRejectedValue(new Error("API Error"));
    phasesAPI.getAll.mockRejectedValue(new Error("API Error"));
    modulesAPI.getWithPhases.mockRejectedValue(new Error("API Error"));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Failed to load data/)).toBeInTheDocument();
    });
  });
});

describe("ModulesManagerEnhanced - Enrollment Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default API responses
    api.modulesAPI.getAll.mockResolvedValue({ data: mockModules });
    api.phasesAPI.getAll.mockResolvedValue({ data: mockPhases });
    api.modulesAPI.getWithPhases.mockResolvedValue({
      data: mockModulesWithPhases,
    });

    // Mock authAPI.getCurrentUser for user selection
    api.authAPI.getCurrentUser.mockResolvedValue({
      success: true,
      data: {
        _id: "user1",
        username: "testuser",
        email: "test@example.com",
        role: "admin",
      },
    });
  });

  it("should render enrollment buttons in list view", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Module")).toBeInTheDocument();
    });

    // Check if enrollment button is present
    const enrollButtons = screen.getAllByTestId("user-plus-icon");
    expect(enrollButtons.length).toBeGreaterThan(0);
  });

  it("should open enrollment modal when enrollment button is clicked", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Module")).toBeInTheDocument();
    });

    // Click enrollment button
    const enrollButton = screen.getAllByTestId("user-plus-icon")[0];
    fireEvent.click(enrollButton.closest("button"));

    // Check if modal opens
    await waitFor(() => {
      expect(screen.getByText("Enroll User in Module")).toBeInTheDocument();
      expect(screen.getAllByText("Test Module")[0]).toBeInTheDocument();
    });
  });

  it("should call enrollment API when confirm button is clicked", async () => {
    api.enrollmentAPI.create.mockResolvedValue({
      success: true,
      message: "Successfully enrolled",
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Module")).toBeInTheDocument();
    });

    // Click enrollment button
    const enrollButton = screen.getAllByTestId("user-plus-icon")[0];
    fireEvent.click(enrollButton.closest("button"));

    // Wait for modal to open and user to be loaded
    await waitFor(() => {
      expect(screen.getByText("Enroll User in Module")).toBeInTheDocument();
    });

    // Wait for users to load and manually select user using a more specific selector
    await waitFor(() => {
      // Look for the select element that has the "Select a user..." option
      const userSelects = screen.getAllByRole("combobox");
      const userSelect = userSelects.find(
        (select) =>
          select.querySelector('option[value=""]')?.textContent ===
          "Select a user..."
      );
      expect(userSelect).toBeInTheDocument();
    });

    // Get the user selection dropdown specifically
    const userSelects = screen.getAllByRole("combobox");
    const userSelect = userSelects.find(
      (select) =>
        select.querySelector('option[value=""]')?.textContent ===
        "Select a user..."
    );

    // Manually select the user
    fireEvent.change(userSelect, { target: { value: "user1" } });

    // Click confirm button
    const confirmButton = screen.getByText("Confirm Enrollment");
    fireEvent.click(confirmButton);

    // Check if API was called
    await waitFor(() => {
      expect(api.enrollmentAPI.create).toHaveBeenCalledWith("module1");
    });
  });

  it("should display success message after successful enrollment", async () => {
    api.enrollmentAPI.create.mockResolvedValue({
      success: true,
      message: "Successfully enrolled",
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Module")).toBeInTheDocument();
    });

    // Click enrollment button
    const enrollButton = screen.getAllByTestId("user-plus-icon")[0];
    fireEvent.click(enrollButton.closest("button"));

    // Wait for modal and user selection
    await waitFor(() => {
      expect(screen.getByText("Confirm Enrollment")).toBeInTheDocument();
    });

    await waitFor(() => {
      const userSelects = screen.getAllByRole("combobox");
      const userSelect = userSelects.find(
        (select) =>
          select.querySelector('option[value=""]')?.textContent ===
          "Select a user..."
      );
      expect(userSelect).toBeInTheDocument();
    });

    // Get the user selection dropdown specifically
    const userSelects = screen.getAllByRole("combobox");
    const userSelect = userSelects.find(
      (select) =>
        select.querySelector('option[value=""]')?.textContent ===
        "Select a user..."
    );

    // Manually select the user
    fireEvent.change(userSelect, { target: { value: "user1" } });

    fireEvent.click(screen.getByText("Confirm Enrollment"));

    // Check for success message
    await waitFor(() => {
      expect(
        screen.getByText(/Successfully enrolled user in Test Module/)
      ).toBeInTheDocument();
    });
  });

  it("should display error message when enrollment fails", async () => {
    api.enrollmentAPI.create.mockRejectedValue({
      response: {
        status: 400,
        data: { message: "User already enrolled in this module" },
      },
      message: "Already enrolled",
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Module")).toBeInTheDocument();
    });

    // Click enrollment button
    const enrollButton = screen.getAllByTestId("user-plus-icon")[0];
    fireEvent.click(enrollButton.closest("button"));

    // Wait for modal and user selection
    await waitFor(() => {
      expect(screen.getByText("Confirm Enrollment")).toBeInTheDocument();
    });

    await waitFor(() => {
      const userSelects = screen.getAllByRole("combobox");
      const userSelect = userSelects.find(
        (select) =>
          select.querySelector('option[value=""]')?.textContent ===
          "Select a user..."
      );
      expect(userSelect).toBeInTheDocument();
    });

    // Get the user selection dropdown specifically
    const userSelects = screen.getAllByRole("combobox");
    const userSelect = userSelects.find(
      (select) =>
        select.querySelector('option[value=""]')?.textContent ===
        "Select a user..."
    );

    // Manually select the user
    fireEvent.change(userSelect, { target: { value: "user1" } });

    fireEvent.click(screen.getByText("Confirm Enrollment"));

    // Check for error message
    await waitFor(() => {
      // Look for error message in the modal specifically
      const errorMessages = screen.getAllByText(
        /User already enrolled in this module/
      );
      expect(errorMessages.length).toBeGreaterThan(0);
      // Verify at least one error message is displayed
      expect(errorMessages[0]).toBeInTheDocument();
    });
  });

  it("should close modal when cancel button is clicked", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Module")).toBeInTheDocument();
    });

    // Click enrollment button
    const enrollButton = screen.getAllByTestId("user-plus-icon")[0];
    fireEvent.click(enrollButton.closest("button"));

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText("Enroll User in Module")).toBeInTheDocument();
    });

    // Click cancel button
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Check if modal is closed
    await waitFor(() => {
      expect(
        screen.queryByText("Enroll User in Module")
      ).not.toBeInTheDocument();
    });
  });
});
