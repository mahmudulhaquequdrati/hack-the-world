import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { contentAPI, modulesAPI, phasesAPI } from "../../services/api";
import PhaseDetailView from "../PhaseDetailView";

// Mock the API modules
vi.mock("../../services/api", () => ({
  phasesAPI: {
    getById: vi.fn(),
  },
  modulesAPI: {
    getByPhase: vi.fn(),
  },
  contentAPI: {
    getByModule: vi.fn(),
  },
}));

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ phaseId: "test-phase-id" }),
    useNavigate: () => mockNavigate,
  };
});

const mockPhase = {
  id: "test-phase-id",
  title: "Test Phase",
  description: "Test phase description",
  icon: "🔒",
  color: "#00ff00",
  order: 1,
  createdAt: "2025-01-20T10:00:00Z",
  updatedAt: "2025-01-21T10:00:00Z",
};

const mockModules = [
  {
    id: "module-1",
    title: "Test Module 1",
    description: "First test module",
    order: 1,
    difficulty: "beginner",
    estimatedHours: 2,
  },
  {
    id: "module-2",
    title: "Test Module 2",
    description: "Second test module",
    order: 2,
    difficulty: "intermediate",
    estimatedHours: 3,
  },
];

const mockContent = [
  {
    id: "content-1",
    title: "Test Content 1",
    type: "video",
    duration: 30,
  },
  {
    id: "content-2",
    title: "Test Content 2",
    type: "lab",
    duration: 60,
  },
];

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("PhaseDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", () => {
    phasesAPI.getById.mockImplementation(() => new Promise(() => {})); // Never resolves
    modulesAPI.getByPhase.mockImplementation(() => new Promise(() => {}));

    renderWithRouter(<PhaseDetailView />);

    expect(screen.getByText("Loading phase details...")).toBeInTheDocument();
  });

  it("should render phase details when data is loaded successfully", async () => {
    phasesAPI.getById.mockResolvedValue({ data: mockPhase });
    modulesAPI.getByPhase.mockResolvedValue({ data: mockModules });
    contentAPI.getByModule.mockResolvedValue({ data: mockContent });

    renderWithRouter(<PhaseDetailView />);

    await waitFor(() => {
      expect(screen.getByText("[TEST PHASE]")).toBeInTheDocument();
    });

    expect(screen.getByText("Test phase description")).toBeInTheDocument();
    expect(screen.getByText("Order:")).toBeInTheDocument();
    expect(screen.getByText("#00ff00")).toBeInTheDocument();
  });

  it("should render error state when phase loading fails", async () => {
    const errorMessage = "Failed to load phase details";
    phasesAPI.getById.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    renderWithRouter(<PhaseDetailView />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("should render modules list correctly", async () => {
    phasesAPI.getById.mockResolvedValue({ data: mockPhase });
    modulesAPI.getByPhase.mockResolvedValue({ data: mockModules });
    contentAPI.getByModule.mockResolvedValue({ data: mockContent });

    renderWithRouter(<PhaseDetailView />);

    await waitFor(() => {
      expect(screen.getByText("Modules in this Phase (2)")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Module 1")).toBeInTheDocument();
    expect(screen.getByText("Test Module 2")).toBeInTheDocument();
  });
});
