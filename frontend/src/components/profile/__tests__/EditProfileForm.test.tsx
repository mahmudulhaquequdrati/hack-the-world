import { apiSlice } from "@/features/api/apiSlice";
import { User, useUpdateProfileMutation } from "@/features/auth/authApi";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditProfileForm from "../EditProfileForm";

// Mock the mutation hook
vi.mock("@/features/auth/authApi", async () => {
  const actual = await vi.importActual("@/features/auth/authApi");
  return {
    ...actual,
    useUpdateProfileMutation: vi.fn(),
  };
});

const mockUpdateProfile = vi.fn();
const mockUseUpdateProfileMutation = useUpdateProfileMutation as ReturnType<
  typeof vi.fn
>;

// Mock user data
const mockUser: User = {
  _id: "user-123",
  username: "testuser",
  email: "test@example.com",
  profile: {
    firstName: "John",
    lastName: "Doe",
    displayName: "John Doe",
    bio: "Cybersecurity enthusiast",
    location: "New York",
    website: "https://johndoe.com",
    avatar: "https://example.com/avatar.jpg",
  },
  experienceLevel: "beginner",
  stats: {
    totalPoints: 100,
    level: 1,
    coursesCompleted: 0,
    labsCompleted: 0,
    gamesCompleted: 0,
    achievementsEarned: 0,
  },
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
};

// Test store setup
const createTestStore = (initialState = {}) =>
  configureStore({
    reducer: {
      api: apiSlice.reducer,
      auth: (
        state = { user: mockUser, token: "test-token", isAuthenticated: true }
      ) => state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState: {
      auth: { user: mockUser, token: "test-token", isAuthenticated: true },
      ...initialState,
    },
  });

interface MockedProviderProps {
  children: React.ReactNode;
  store?: ReturnType<typeof createTestStore>;
}

const MockedProvider = ({
  children,
  store = createTestStore(),
}: MockedProviderProps) => <Provider store={store}>{children}</Provider>;

describe("EditProfileForm", () => {
  const mockOnCancel = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Set up localStorage mock
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => "test-token"), // Mock token exists
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    // Default mock implementation
    mockUseUpdateProfileMutation.mockReturnValue([
      mockUpdateProfile,
      { isLoading: false, isSuccess: false, error: null },
    ]);
  });

  // 1. Render test
  it("should render without crashing", () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(
      screen.getByText("Update your profile information below.")
    ).toBeInTheDocument();
  });

  // 2. Form fields test
  it("should display form fields with current user data", () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Cybersecurity enthusiast")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("New York")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://johndoe.com")).toBeInTheDocument();
  });

  // 3. Input interaction test
  it("should update form fields when user types", () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const firstNameInput = screen.getByDisplayValue("John");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
  });

  // 4. Validation test
  it("should show validation error for invalid website URL", async () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const websiteInput = screen.getByDisplayValue("https://johndoe.com");
    fireEvent.change(websiteInput, { target: { value: "invalid-url" } });

    const submitButton = screen.getByText("Save Changes");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Website must be a valid URL starting with http:// or https://"
        )
      ).toBeInTheDocument();
    });
  });

  // 5. Successful submission test
  it("should call updateProfile and onSuccess when form is submitted successfully", async () => {
    mockUpdateProfile.mockResolvedValue({});

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const firstNameInput = screen.getByDisplayValue("John");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    const submitButton = screen.getByText("Save Changes");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        firstName: "Jane",
        lastName: "Doe",
        displayName: "John Doe",
        bio: "Cybersecurity enthusiast",
        location: "New York",
        website: "https://johndoe.com",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  // 6. Cancel functionality test
  it("should call onCancel when cancel button is clicked", () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  // 7. Loading state test
  it("should show loading state when submission is in progress", () => {
    mockUseUpdateProfileMutation.mockReturnValue([
      mockUpdateProfile,
      {
        isLoading: true,
        isError: false,
        isSuccess: false,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useUpdateProfileMutation>);

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    expect(screen.getByText("Updating...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /updating/i })).toBeDisabled();
  });

  // 8. Bio character count test
  it("should display bio character count", () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    expect(screen.getByText("24/500")).toBeInTheDocument(); // "Cybersecurity enthusiast" is 24 chars
  });

  // 9. Field length validation test
  it("should show error for bio exceeding 500 characters", async () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const bioInput = screen.getByDisplayValue("Cybersecurity enthusiast");
    const longBio = "A".repeat(501); // 501 characters
    fireEvent.change(bioInput, { target: { value: longBio } });

    const submitButton = screen.getByText("Save Changes");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Bio cannot exceed 500 characters")
      ).toBeInTheDocument();
    });
  });

  // 10. Server error handling test
  it("should handle server validation errors", async () => {
    const serverError = {
      data: {
        errors: [{ field: "firstName", msg: "First name is required" }],
      },
    };

    mockUpdateProfile.mockRejectedValue(serverError);

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const submitButton = screen.getByText("Save Changes");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeInTheDocument();
    });
  });

  it("should show unsaved changes badge when form is modified", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    // Initially no badge
    expect(screen.queryByText("Unsaved Changes")).not.toBeInTheDocument();

    // Modify a field
    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Jane");

    // Badge should appear
    expect(screen.getByText("Unsaved Changes")).toBeInTheDocument();
  });

  it("should disable save button when no changes are made", () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).toBeDisabled();
  });

  it("should enable save button when changes are made", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Jane");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).toBeEnabled();
  });

  it("should show loading state when form is being submitted", () => {
    mockUseUpdateProfileMutation.mockReturnValue([
      mockUpdateProfile,
      { isLoading: true, isSuccess: false, isError: false },
    ]);

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    expect(screen.getByText("Updating...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /updating/i })).toBeDisabled();

    // All form fields should be disabled
    expect(screen.getByLabelText("First Name")).toBeDisabled();
    expect(screen.getByLabelText("Last Name")).toBeDisabled();
    expect(screen.getByLabelText("Display Name")).toBeDisabled();
    expect(screen.getByLabelText("Bio")).toBeDisabled();
    expect(screen.getByLabelText("Location")).toBeDisabled();
    expect(screen.getByLabelText("Website")).toBeDisabled();
  });

  it("should show success message when update is successful", async () => {
    mockUseUpdateProfileMutation.mockReturnValue([
      mockUpdateProfile,
      { isLoading: false, isSuccess: true, isError: false },
    ]);

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    expect(screen.getByText("Profile Updated!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your profile information has been successfully updated."
      )
    ).toBeInTheDocument();
  });

  it("should handle form submission correctly", async () => {
    const user = userEvent.setup();
    mockUpdateProfile.mockResolvedValue({ data: { user: mockUser } });

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    // Modify first name
    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Jane");

    // Submit form
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        firstName: "Jane",
        lastName: "Doe",
        displayName: "John Doe",
        bio: "Cybersecurity enthusiast",
        location: "New York",
        website: "https://johndoe.com",
      });
    });
  });

  it("should validate website URL format", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    // Enter invalid website URL
    const websiteInput = screen.getByLabelText("Website");
    await user.clear(websiteInput);
    await user.type(websiteInput, "invalid-url");

    // Try to submit
    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Jane"); // Make a change to enable submit

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    expect(
      screen.getByText(
        "Website must be a valid URL starting with http:// or https://"
      )
    ).toBeInTheDocument();
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it("should show character count for bio field", () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    expect(screen.getByText("24/500")).toBeInTheDocument(); // "Cybersecurity enthusiast" is 24 characters
  });

  it("should show warning color for bio when approaching limit", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const bioInput = screen.getByLabelText("Bio");
    await user.clear(bioInput);
    await user.type(bioInput, "x".repeat(460)); // Close to 500 limit

    const characterCount = screen.getByText("460/500");
    expect(characterCount).toHaveClass("text-yellow-400");
  });

  it("should handle cancel button correctly", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("should clear field errors when user starts typing", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    // Enter invalid website URL to trigger error
    const websiteInput = screen.getByLabelText("Website");
    await user.clear(websiteInput);
    await user.type(websiteInput, "invalid-url");

    // Make a change to enable submit
    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Jane");

    // Submit to show error
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    expect(
      screen.getByText(
        "Website must be a valid URL starting with http:// or https://"
      )
    ).toBeInTheDocument();

    // Start typing in website field again
    await user.clear(websiteInput);
    await user.type(websiteInput, "https://");

    // Error should be cleared
    expect(
      screen.queryByText(
        "Website must be a valid URL starting with http:// or https://"
      )
    ).not.toBeInTheDocument();
  });

  it("should handle empty field values correctly", async () => {
    const user = userEvent.setup();
    mockUpdateProfile.mockResolvedValue({ data: { user: mockUser } });

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    // Clear all optional fields
    await user.clear(screen.getByLabelText("First Name"));
    await user.clear(screen.getByLabelText("Last Name"));
    await user.clear(screen.getByLabelText("Display Name"));
    await user.clear(screen.getByLabelText("Bio"));
    await user.clear(screen.getByLabelText("Location"));
    await user.clear(screen.getByLabelText("Website"));

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        firstName: "",
        lastName: "",
        displayName: "",
        bio: "",
        location: "",
        website: "",
      });
    });
  });

  it("should display token debug information in development", () => {
    // Set NODE_ENV to development
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={() => {}}
          onSuccess={() => {}}
        />
      </MockedProvider>
    );

    expect(screen.getByText(/Debug - Token Status:/)).toBeInTheDocument();
    expect(screen.getByText(/✓ Available/)).toBeInTheDocument();

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  it("should handle missing authentication token", () => {
    // Mock store without token
    const storeWithoutToken = createTestStore({
      auth: { user: mockUser, token: null, isAuthenticated: false },
    });

    // Mock localStorage without token
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => null), // No token
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    render(
      <MockedProvider store={storeWithoutToken}>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    // Try to submit the form
    const submitButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitButton);

    expect(
      screen.getByText("You must be logged in to update your profile")
    ).toBeInTheDocument();
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it("should handle 401 unauthorized error", async () => {
    const mockError = {
      status: 401,
      data: { message: "Unauthorized" },
    };

    mockUpdateProfile.mockRejectedValueOnce(mockError);
    mockUseUpdateProfileMutation.mockReturnValue([
      mockUpdateProfile,
      { isLoading: false, isSuccess: false, error: mockError },
    ]);

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const firstNameInput = screen.getByLabelText("First Name");
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "Jane");

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Your session has expired. Please log in again.")
      ).toBeInTheDocument();
    });
  });

  it("should call updateProfile and onSuccess when form is submitted successfully", async () => {
    const mockOnSuccess = vi.fn();

    mockUpdateProfile.mockResolvedValueOnce({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          ...mockUser,
          profile: { ...mockUser.profile, firstName: "Jane" },
        },
      },
    });

    mockUseUpdateProfileMutation.mockReturnValue([
      mockUpdateProfile,
      { isLoading: false, isSuccess: true, error: null },
    ]);

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const firstNameInput = screen.getByLabelText("First Name");
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "Jane");

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        firstName: "Jane",
        lastName: "Doe",
        displayName: "John Doe",
        bio: "Cybersecurity enthusiast",
        location: "New York",
        website: "https://johndoe.com",
      });
    });
  });

  it("should handle server validation errors", async () => {
    const mockError = {
      data: {
        errors: [{ field: "firstName", msg: "First name is required" }],
      },
    };

    mockUpdateProfile.mockRejectedValueOnce(mockError);

    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const firstNameInput = screen.getByLabelText("First Name");
    await userEvent.clear(firstNameInput);

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeInTheDocument();
    });
  });

  it("should display unsaved changes badge when form has changes", async () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    // Initially no unsaved changes badge
    expect(screen.queryByText("Unsaved Changes")).not.toBeInTheDocument();

    // Make a change
    const firstNameInput = screen.getByLabelText("First Name");
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "Jane");

    // Now unsaved changes badge should appear
    expect(screen.getByText("Unsaved Changes")).toBeInTheDocument();
  });

  it("should validate website URL format", async () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const websiteInput = screen.getByLabelText("Website");
    await userEvent.clear(websiteInput);
    await userEvent.type(websiteInput, "invalid-url");

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitButton);

    expect(
      screen.getByText(
        "Website must be a valid URL starting with http:// or https://"
      )
    ).toBeInTheDocument();
  });

  it("should clear field errors when user starts typing", async () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const websiteInput = screen.getByLabelText("Website");
    await userEvent.clear(websiteInput);
    await userEvent.type(websiteInput, "invalid-url");

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitButton);

    expect(
      screen.getByText(
        "Website must be a valid URL starting with http:// or https://"
      )
    ).toBeInTheDocument();

    // Start typing a valid URL
    await userEvent.clear(websiteInput);
    await userEvent.type(websiteInput, "https://valid-url.com");

    // Error should be cleared
    expect(
      screen.queryByText(
        "Website must be a valid URL starting with http:// or https://"
      )
    ).not.toBeInTheDocument();
  });

  it("should display character count for bio field", () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    expect(screen.getByText("24/500")).toBeInTheDocument();
  });

  it("should warn when bio approaches character limit", async () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const bioTextarea = screen.getByLabelText("Bio");
    await userEvent.clear(bioTextarea);
    await userEvent.type(bioTextarea, "x".repeat(451)); // Over 450 characters

    const characterCount = screen.getByText(/451\/500/);
    expect(characterCount).toHaveClass("text-yellow-400");
  });

  it("should disable save button when no changes are made", () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    expect(submitButton).toBeDisabled();
  });

  it("should enable save button when changes are made", async () => {
    render(
      <MockedProvider>
        <EditProfileForm
          user={mockUser}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      </MockedProvider>
    );

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    expect(submitButton).toBeDisabled();

    const firstNameInput = screen.getByLabelText("First Name");
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "Jane");

    expect(submitButton).not.toBeDisabled();
  });
});
