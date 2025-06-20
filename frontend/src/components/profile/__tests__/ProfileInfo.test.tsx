import { User } from "@/features/auth/authApi";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProfileInfo from "../ProfileInfo";

// Mock user data for testing
const mockUser: User = {
  _id: "user-123",
  username: "testuser",
  email: "test@example.com",
  profile: {
    firstName: "John",
    lastName: "Doe",
    displayName: "John Doe",
    avatar: "https://example.com/avatar.jpg",
    bio: "Cybersecurity enthusiast and learner",
    location: "New York, NY",
    website: "https://johndoe.com",
  },
  experienceLevel: "intermediate",
  stats: {
    totalPoints: 1250,
    level: 5,
    coursesCompleted: 3,
    labsCompleted: 12,
    gamesCompleted: 8,
    achievementsEarned: 15,
  },
  createdAt: "2023-01-15T10:30:00Z",
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ProfileInfo", () => {
  // 1. Expected use case
  it("renders correctly with valid user data", () => {
    renderWithRouter(<ProfileInfo user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();
    expect(screen.getByText("INTERMEDIATE")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("New York, NY")).toBeInTheDocument();
    expect(
      screen.getByText("Cybersecurity enthusiast and learner")
    ).toBeInTheDocument();
    expect(screen.getByText("1250")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  // 2. Edge case - minimal user data
  it("handles user with minimal profile data gracefully", () => {
    const minimalUser: User = {
      ...mockUser,
      profile: {
        avatar: undefined,
      },
    };

    renderWithRouter(<ProfileInfo user={minimalUser} />);

    expect(screen.getByText("@testuser")).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument(); // Should fall back to username
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  // 3. Experience level badge colors
  it("displays correct badge color for different experience levels", () => {
    const beginnerUser = { ...mockUser, experienceLevel: "beginner" as const };
    const { rerender } = renderWithRouter(<ProfileInfo user={beginnerUser} />);

    let badge = screen.getByText("BEGINNER");
    expect(badge).toHaveClass("bg-green-500", "text-black");

    const expertUser = { ...mockUser, experienceLevel: "expert" as const };
    rerender(
      <BrowserRouter>
        <ProfileInfo user={expertUser} />
      </BrowserRouter>
    );

    badge = screen.getByText("EXPERT");
    expect(badge).toHaveClass("bg-purple-500", "text-white");
  });

  // 4. User initials generation
  it("generates correct user initials", () => {
    renderWithRouter(<ProfileInfo user={mockUser} />);

    // Should generate "JD" from John Doe
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  // 5. Website link functionality
  it("renders website as clickable link", () => {
    renderWithRouter(<ProfileInfo user={mockUser} />);

    const websiteLink = screen.getByRole("link", {
      name: "https://johndoe.com",
    });
    expect(websiteLink).toHaveAttribute("href", "https://johndoe.com");
    expect(websiteLink).toHaveAttribute("target", "_blank");
    expect(websiteLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  // 6. Cybersecurity theme styling
  it("applies cybersecurity theme correctly", () => {
    renderWithRouter(<ProfileInfo user={mockUser} />);

    const card = screen
      .getByText("Basic Information")
      .closest(".border-green-500\\/30");
    expect(card).toBeInTheDocument();

    const title = screen.getByText("John Doe");
    expect(title).toHaveClass("text-green-400", "font-mono");
  });

  // 7. Conditional content rendering
  it("only renders bio section when bio exists", () => {
    const userWithoutBio = {
      ...mockUser,
      profile: {
        ...mockUser.profile,
        bio: undefined,
      },
    };

    renderWithRouter(<ProfileInfo user={userWithoutBio} />);

    expect(screen.queryByText("About")).not.toBeInTheDocument();
  });

  // 8. Date formatting
  it("formats join date correctly", () => {
    renderWithRouter(<ProfileInfo user={mockUser} />);

    expect(screen.getByText(/Joined/)).toBeInTheDocument();
    // Should format the date properly
    expect(screen.getByText(/1\/15\/2023/)).toBeInTheDocument();
  });

  // 9. Custom className prop
  it("applies custom className when provided", () => {
    const { container } = renderWithRouter(
      <ProfileInfo user={mockUser} className="custom-class" />
    );

    const card = container.querySelector(".custom-class");
    expect(card).toBeInTheDocument();
  });

  // 10. Accessibility
  it("has proper accessibility attributes", () => {
    renderWithRouter(<ProfileInfo user={mockUser} />);

    const avatar = screen.getByRole("img", { hidden: true });
    expect(avatar).toHaveAttribute("alt", "John Doe");
  });
});
