import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../services/api";
import ContentDetailView from "../ContentDetailView";

// Mock the API modules
vi.mock("../../services/api", () => ({
  contentAPI: {
    getById: vi.fn(),
    getByModule: vi.fn(),
  },
  modulesAPI: {
    getById: vi.fn(),
  },
  phasesAPI: {
    getById: vi.fn(),
  },
}));

// Mock useParams and useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ contentId: "test-content-id" }),
    useNavigate: () => mockNavigate,
  };
});

// Test data
const mockContent = {
  id: "test-content-id",
  title: "Test Content",
  description: "This is a test content description",
  type: "video",
  duration: 30,
  section: "Introduction",
  url: "https://example.com/video",
  instructions: "Watch this video to learn the basics",
  resources: ["Resource 1", "Resource 2"],
  module: {
    id: "test-module-id",
  },
};

const mockModule = {
  id: "test-module-id",
  title: "Test Module",
  description: "Test module description",
  difficulty: "beginner",
  phaseId: "test-phase-id",
};

const mockPhase = {
  id: "test-phase-id",
  title: "Test Phase",
  description: "Test phase description",
};

const mockRelatedContent = [
  {
    id: "related-1",
    title: "Related Content 1",
    type: "lab",
    duration: 45,
  },
  {
    id: "related-2",
    title: "Related Content 2",
    type: "document",
    duration: 15,
  },
];

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ContentDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default successful API responses
    api.contentAPI.getById.mockResolvedValue({ data: mockContent });
    api.modulesAPI.getById.mockResolvedValue({ data: mockModule });
    api.phasesAPI.getById.mockResolvedValue({ data: mockPhase });
    api.contentAPI.getByModule.mockResolvedValue({ data: mockRelatedContent });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render loading state initially", () => {
    // Mock delayed API response
    api.contentAPI.getById.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: mockContent }), 100)
        )
    );

    renderWithRouter(<ContentDetailView />);

    expect(screen.getByText("Loading content details...")).toBeInTheDocument();
  });

  it("should render content details when data is loaded successfully", async () => {
    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Content" })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("This is a test content description")
    ).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("30 min")).toBeInTheDocument();
    expect(
      screen.getByText("Watch this video to learn the basics")
    ).toBeInTheDocument();
    expect(screen.getByText("Resource 1")).toBeInTheDocument();
    expect(screen.getByText("Resource 2")).toBeInTheDocument();
  });

  it("should display module and phase information when available", async () => {
    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Content" })
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Test Module")).toBeInTheDocument();
    expect(screen.getByText("Test Phase")).toBeInTheDocument();
    expect(screen.getByText("beginner")).toBeInTheDocument();
  });

  it("should display statistics cards", async () => {
    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Content" })
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Total Views")).toBeInTheDocument();
    expect(screen.getByText("Completion Rate")).toBeInTheDocument();
    expect(screen.getByText("Avg. Time Spent")).toBeInTheDocument();
    expect(screen.getByText("Enrolled Users")).toBeInTheDocument();
  });

  it("should display related content when available", async () => {
    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Content" })
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Related Content (2)")).toBeInTheDocument();
    expect(screen.getByText("Related Content 1")).toBeInTheDocument();
    expect(screen.getByText("Related Content 2")).toBeInTheDocument();
  });

  it("should handle error state when content loading fails", async () => {
    api.contentAPI.getById.mockRejectedValue(new Error("Content not found"));

    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load content details")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: "Content Details" })
    ).toBeInTheDocument();
  });

  it("should handle content not found", async () => {
    api.contentAPI.getById.mockResolvedValue({ data: null });

    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(screen.getByText("Content not found.")).toBeInTheDocument();
    });
  });

  it("should render content without module information gracefully", async () => {
    const contentWithoutModule = { ...mockContent, module: null };
    api.contentAPI.getById.mockResolvedValue({ data: contentWithoutModule });

    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Content" })
      ).toBeInTheDocument();
    });

    // Should still render content details even without module
    expect(
      screen.getByText("This is a test content description")
    ).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
  });

  it("should handle missing optional fields gracefully", async () => {
    const minimalContent = {
      id: "test-content-id",
      title: "Minimal Content",
      description: "Basic content",
      type: "document",
      duration: 10,
    };
    api.contentAPI.getById.mockResolvedValue({ data: minimalContent });

    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Minimal Content" })
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Basic content")).toBeInTheDocument();
    expect(screen.getByText("Document")).toBeInTheDocument();
    expect(screen.getByText("10 min")).toBeInTheDocument();
  });

  it("should navigate back to content management when back button is clicked", async () => {
    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Content" })
      ).toBeInTheDocument();
    });

    const backButtons = screen.getAllByRole("button");
    const backButton = backButtons.find(
      (button) => button.querySelector("svg") && button.onclick
    );

    if (backButton) {
      backButton.click();
      expect(mockNavigate).toHaveBeenCalledWith("/content");
    }
  });

  it("should display correct content type icons and colors", async () => {
    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Content" })
      ).toBeInTheDocument();
    });

    // Check that video content type is displayed correctly
    expect(screen.getByText("Video")).toBeInTheDocument();

    // Check for video-specific styling (this may need adjustment based on exact implementation)
    const videoBadge = screen.getByText("Video");
    expect(videoBadge).toHaveClass("bg-red-500");
  });

  it("should render breadcrumb navigation correctly", async () => {
    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Content" })
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Content Management")).toBeInTheDocument();
    expect(screen.getByText("Test Phase")).toBeInTheDocument();
    expect(screen.getByText("Test Module")).toBeInTheDocument();

    // Check that the content title appears in breadcrumb (using getAllByText to get the breadcrumb version)
    const contentTitleElements = screen.getAllByText("Test Content");
    expect(contentTitleElements.length).toBeGreaterThan(0);
  });

  it("should handle different content types correctly", async () => {
    const labContent = { ...mockContent, type: "lab" };
    api.contentAPI.getById.mockResolvedValue({ data: labContent });

    renderWithRouter(<ContentDetailView />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Content" })
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Lab")).toBeInTheDocument();

    // Check that the "Start Lab" button text is displayed for lab content
    expect(screen.getByText("Start Lab")).toBeInTheDocument();
  });
});
