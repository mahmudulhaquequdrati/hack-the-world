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
  id: "user-123",
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
};

// Test store setup
const createTestStore = () =>
  configureStore({
    reducer: {
      api: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

const renderWithProvider = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(<Provider store={store}>{component}</Provider>);
};

describe("EditProfileForm", () => {
  const mockOnCancel = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUpdateProfileMutation.mockReturnValue([
      mockUpdateProfile,
      {
        isLoading: false,
        isError: false,
        isSuccess: false,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useUpdateProfileMutation>);
  });

  // 1. Render test
  it("should render without crashing", () => {
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(
      screen.getByText("Update your profile information below.")
    ).toBeInTheDocument();
  });

  // 2. Form fields test
  it("should display form fields with current user data", () => {
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
    );

    const firstNameInput = screen.getByDisplayValue("John");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
  });

  // 4. Validation test
  it("should show validation error for invalid website URL", async () => {
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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

    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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

    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText("Updating...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /updating/i })).toBeDisabled();
  });

  // 8. Bio character count test
  it("should display bio character count", () => {
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText("24/500")).toBeInTheDocument(); // "Cybersecurity enthusiast" is 24 chars
  });

  // 9. Field length validation test
  it("should show error for bio exceeding 500 characters", async () => {
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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

    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
    );

    const submitButton = screen.getByText("Save Changes");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeInTheDocument();
    });
  });

  it("should show unsaved changes badge when form is modified", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
    );

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).toBeDisabled();
  });

  it("should enable save button when changes are made", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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

    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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

    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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

    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText("24/500")).toBeInTheDocument(); // "Cybersecurity enthusiast" is 24 characters
  });

  it("should show warning color for bio when approaching limit", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
    );

    const bioInput = screen.getByLabelText("Bio");
    await user.clear(bioInput);
    await user.type(bioInput, "x".repeat(460)); // Close to 500 limit

    const characterCount = screen.getByText("460/500");
    expect(characterCount).toHaveClass("text-yellow-400");
  });

  it("should handle cancel button correctly", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("should clear field errors when user starts typing", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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

    renderWithProvider(
      <EditProfileForm
        user={mockUser}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />
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
});
