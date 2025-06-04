import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../services/api";
import ModuleDetailView from "../ModuleDetailView";

// Mock the API services
vi.mock("../../services/api", () => ({
  modulesAPI: {
    getById: vi.fn(),
  },
  phasesAPI: {
    getById: vi.fn(),
  },
  contentAPI: {
    getByModule: vi.fn(),
    getByModuleGrouped: vi.fn(),
  },
}));

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ moduleId: "test-module-id" }),
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ModuleDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockModule = {
    id: "test-module-id",
    _id: "test-module-id",
    title: "Test Module",
    description: "This is a test module for cybersecurity learning",
    difficulty: "intermediate",
    color: "#00ff00",
    icon: "🔒",
    order: 1,
    estimatedHours: 5,
    phaseId: "test-phase-id",
    learningOutcomes: ["Understand security basics", "Apply threat modeling"],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
    isActive: true,
  };

  const mockPhase = {
    id: "test-phase-id",
    _id: "test-phase-id",
    title: "Foundation Phase",
    description: "Learn cybersecurity fundamentals",
    color: "#0088ff",
  };

  const mockContent = [
    {
      id: "content-1",
      _id: "content-1",
      title: "Introduction Video",
      description: "Learn the basics of cybersecurity",
      type: "video",
      duration: 30,
      section: "Introduction",
      moduleId: "test-module-id",
    },
    {
      id: "content-2",
      _id: "content-2",
      title: "Security Lab",
      description: "Practice penetration testing",
      type: "lab",
      duration: 90,
      section: "Hands-on",
      moduleId: "test-module-id",
    },
    {
      id: "content-3",
      _id: "content-3",
      title: "Capture the Flag",
      description: "Solve security challenges",
      type: "game",
      duration: 60,
      section: "Practice",
      moduleId: "test-module-id",
    },
    {
      id: "content-4",
      _id: "content-4",
      title: "Security Guide",
      description: "Comprehensive security documentation",
      type: "document",
      duration: 15,
      section: "Reference",
      moduleId: "test-module-id",
    },
  ];

  it("should display loading state initially", () => {
    // Mock APIs to not resolve immediately
    api.modulesAPI.getById.mockImplementation(() => new Promise(() => {}));
    api.contentAPI.getByModule.mockImplementation(() => new Promise(() => {}));

    renderWithRouter(<ModuleDetailView />);

    expect(screen.getByText("Loading module details...")).toBeInTheDocument();
  });

  it("should display module details when loaded successfully", async () => {
    // Mock successful API responses
    api.modulesAPI.getById.mockResolvedValue({ data: mockModule });
    api.phasesAPI.getById.mockResolvedValue({ data: mockPhase });
    api.contentAPI.getByModule.mockResolvedValue({ data: mockContent });
    api.contentAPI.getByModuleGrouped.mockResolvedValue({ data: {} });

    renderWithRouter(<ModuleDetailView />);

    // Wait for module details to load
    await waitFor(() => {
      expect(screen.getByText("[TEST MODULE]")).toBeInTheDocument();
    });

    // Check basic module information
    expect(screen.getByText("Test Module")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test module for cybersecurity learning")
    ).toBeInTheDocument();
    expect(screen.getByText("INTERMEDIATE")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("5h")).toBeInTheDocument();

    // Check phase information
    expect(screen.getByText("Foundation Phase")).toBeInTheDocument();

    // Check statistics
    expect(screen.getByText("4")).toBeInTheDocument(); // Total content
    expect(screen.getByText("1")).toBeInTheDocument(); // Videos (first occurrence)
    expect(screen.getByText("195 min")).toBeInTheDocument(); // Total duration
  });

  it("should display content list with different types", async () => {
    api.modulesAPI.getById.mockResolvedValue({ data: mockModule });
    api.phasesAPI.getById.mockResolvedValue({ data: mockPhase });
    api.contentAPI.getByModule.mockResolvedValue({ data: mockContent });
    api.contentAPI.getByModuleGrouped.mockResolvedValue({ data: {} });

    renderWithRouter(<ModuleDetailView />);

    await waitFor(() => {
      expect(
        screen.getByText("Content in this Module (4)")
      ).toBeInTheDocument();
    });

    // Check different content types are displayed
    expect(screen.getByText("Introduction Video")).toBeInTheDocument();
    expect(screen.getByText("Security Lab")).toBeInTheDocument();
    expect(screen.getByText("Capture the Flag")).toBeInTheDocument();
    expect(screen.getByText("Security Guide")).toBeInTheDocument();

    // Check content type badges
    expect(screen.getByText("video")).toBeInTheDocument();
    expect(screen.getByText("lab")).toBeInTheDocument();
    expect(screen.getByText("game")).toBeInTheDocument();
    expect(screen.getByText("document")).toBeInTheDocument();

    // Check sections are displayed
    expect(screen.getByText("Section: Introduction")).toBeInTheDocument();
    expect(screen.getByText("Section: Hands-on")).toBeInTheDocument();
    expect(screen.getByText("Section: Practice")).toBeInTheDocument();
    expect(screen.getByText("Section: Reference")).toBeInTheDocument();
  });

  it("should display learning outcomes when available", async () => {
    api.modulesAPI.getById.mockResolvedValue({ data: mockModule });
    api.phasesAPI.getById.mockResolvedValue({ data: mockPhase });
    api.contentAPI.getByModule.mockResolvedValue({ data: [] });
    api.contentAPI.getByModuleGrouped.mockResolvedValue({ data: {} });

    renderWithRouter(<ModuleDetailView />);

    await waitFor(() => {
      expect(screen.getByText("Learning Outcomes:")).toBeInTheDocument();
    });

    expect(screen.getByText("Understand security basics")).toBeInTheDocument();
    expect(screen.getByText("Apply threat modeling")).toBeInTheDocument();
  });

  it("should handle error states gracefully", async () => {
    api.modulesAPI.getById.mockRejectedValue({
      response: { data: { message: "Module not found" } },
    });

    renderWithRouter(<ModuleDetailView />);

    await waitFor(() => {
      expect(screen.getByText("Module not found")).toBeInTheDocument();
    });

    expect(screen.getByText("Module Details")).toBeInTheDocument();
  });

  it("should display empty state when no content is available", async () => {
    api.modulesAPI.getById.mockResolvedValue({ data: mockModule });
    api.phasesAPI.getById.mockResolvedValue({ data: mockPhase });
    api.contentAPI.getByModule.mockResolvedValue({ data: [] });
    api.contentAPI.getByModuleGrouped.mockResolvedValue({ data: {} });

    renderWithRouter(<ModuleDetailView />);

    await waitFor(() => {
      expect(
        screen.getByText("Content in this Module (0)")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("No content found in this module.")
    ).toBeInTheDocument();
    expect(screen.getByText("Create new content")).toBeInTheDocument();
  });

  it("should calculate content statistics correctly", async () => {
    api.modulesAPI.getById.mockResolvedValue({ data: mockModule });
    api.phasesAPI.getById.mockResolvedValue({ data: mockPhase });
    api.contentAPI.getByModule.mockResolvedValue({ data: mockContent });
    api.contentAPI.getByModuleGrouped.mockResolvedValue({ data: {} });

    renderWithRouter(<ModuleDetailView />);

    await waitFor(() => {
      expect(screen.getByText("4")).toBeInTheDocument(); // Total Content
    });

    // Check content type counts
    const videoElements = screen.getAllByText("1");
    expect(videoElements.length).toBeGreaterThan(0); // Videos, Labs, Games, Documents (all show 1)
  });

  it("should handle module without phase gracefully", async () => {
    const moduleWithoutPhase = { ...mockModule, phaseId: null };

    api.modulesAPI.getById.mockResolvedValue({ data: moduleWithoutPhase });
    api.contentAPI.getByModule.mockResolvedValue({ data: [] });
    api.contentAPI.getByModuleGrouped.mockResolvedValue({ data: {} });

    renderWithRouter(<ModuleDetailView />);

    await waitFor(() => {
      expect(screen.getByText("[TEST MODULE]")).toBeInTheDocument();
    });

    // Should not crash and should still display module info
    expect(screen.getByText("Test Module")).toBeInTheDocument();
    // Phase link should not be present in breadcrumb
    expect(screen.queryByText("Foundation Phase")).not.toBeInTheDocument();
  });
});
