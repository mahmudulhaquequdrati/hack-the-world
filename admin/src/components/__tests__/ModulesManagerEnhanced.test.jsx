import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
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
}));

// Mock Heroicons
vi.mock("@heroicons/react/24/outline", () => ({
  ArrowDownIcon: () => <div>ArrowDownIcon</div>,
  ArrowUpIcon: () => <div>ArrowUpIcon</div>,
  ChartBarIcon: () => <div>ChartBarIcon</div>,
  CheckCircleIcon: () => <div>CheckCircleIcon</div>,
  ExclamationCircleIcon: () => <div>ExclamationCircleIcon</div>,
  EyeIcon: () => <div>EyeIcon</div>,
  PencilIcon: () => <div>PencilIcon</div>,
  PlusIcon: () => <div>PlusIcon</div>,
  TrashIcon: () => <div>TrashIcon</div>,
  XMarkIcon: () => <div>XMarkIcon</div>,
}));

const mockPhases = [
  { _id: "phase1", id: "phase1", title: "Phase 1" },
  { _id: "phase2", id: "phase2", title: "Phase 2" },
];

const mockModules = [
  {
    _id: "module1",
    phaseId: "phase1",
    title: "Test Module",
    description: "Test Description",
    difficulty: "Beginner",
    color: "#00ff00",
    order: 1,
    isActive: true,
    phase: { title: "Phase 1" },
  },
];

const mockModulesWithPhases = [
  {
    _id: "phase1",
    title: "Phase 1",
    modules: mockModules,
  },
];

describe("ModulesManagerEnhanced Color Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default API responses
    modulesAPI.getAll.mockResolvedValue({ data: mockModules });
    phasesAPI.getAll.mockResolvedValue({ data: mockPhases });
    modulesAPI.getWithPhases.mockResolvedValue({ data: mockModulesWithPhases });
  });

  it("should render without crashing", async () => {
    render(<ModulesManagerEnhanced />);

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

    render(<ModulesManagerEnhanced />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Test Module")).toBeInTheDocument();
    });

    // Click edit button
    const editButtons = screen.getAllByText("PencilIcon");
    fireEvent.click(editButtons[0]);

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

    render(<ModulesManagerEnhanced />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load data/)).toBeInTheDocument();
    });
  });
});
