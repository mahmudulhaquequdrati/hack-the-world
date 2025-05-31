import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PasswordSettings, { PasswordUpdateData } from "../PasswordSettings";

// Mock data based on appData.ts structure
const mockPasswordData: PasswordUpdateData = {
  currentPassword: "CurrentPass123!",
  newPassword: "NewPassword456!",
  confirmPassword: "NewPassword456!",
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("PasswordSettings", () => {
  const mockOnPasswordUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Expected use case
  it("renders correctly with valid props", () => {
    renderWithRouter(
      <PasswordSettings onPasswordUpdate={mockOnPasswordUpdate} />
    );

    expect(screen.getByText("Password Settings")).toBeInTheDocument();
    expect(screen.getByLabelText("Current Password")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm New Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update password/i })
    ).toBeInTheDocument();
  });

  // 2. Edge case - form validation
  it("validates password requirements correctly", async () => {
    renderWithRouter(
      <PasswordSettings onPasswordUpdate={mockOnPasswordUpdate} />
    );

    const currentPasswordInput = screen.getByLabelText("Current Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
    const submitButton = screen.getByRole("button", {
      name: /update password/i,
    });

    // Test weak password - "weak" fails all validation except lowercase letter
    fireEvent.change(currentPasswordInput, { target: { value: "current123" } });
    fireEvent.change(newPasswordInput, { target: { value: "weak" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "weak" } });

    // Button should be disabled due to weak password
    expect(submitButton).toBeDisabled();

    // Submit the form to trigger validation
    fireEvent.click(submitButton);

    // The onPasswordUpdate should not be called because validation should fail
    expect(mockOnPasswordUpdate).not.toHaveBeenCalled();
  });

  // 3. Failure case - password mismatch
  it("displays error when passwords do not match", async () => {
    renderWithRouter(
      <PasswordSettings onPasswordUpdate={mockOnPasswordUpdate} />
    );

    const currentPasswordInput = screen.getByLabelText("Current Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
    const submitButton = screen.getByRole("button", {
      name: /update password/i,
    });

    fireEvent.change(currentPasswordInput, {
      target: { value: "CurrentPass123!" },
    });
    fireEvent.change(newPasswordInput, {
      target: { value: "NewPassword456!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "DifferentPass789!" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    expect(mockOnPasswordUpdate).not.toHaveBeenCalled();
  });

  // 4. User interaction - successful password update
  it("handles successful password update correctly", async () => {
    mockOnPasswordUpdate.mockResolvedValueOnce(undefined);

    renderWithRouter(
      <PasswordSettings onPasswordUpdate={mockOnPasswordUpdate} />
    );

    const currentPasswordInput = screen.getByLabelText("Current Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
    const submitButton = screen.getByRole("button", {
      name: /update password/i,
    });

    fireEvent.change(currentPasswordInput, {
      target: { value: mockPasswordData.currentPassword },
    });
    fireEvent.change(newPasswordInput, {
      target: { value: mockPasswordData.newPassword },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: mockPasswordData.confirmPassword },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnPasswordUpdate).toHaveBeenCalledWith({
        currentPassword: mockPasswordData.currentPassword,
        newPassword: mockPasswordData.newPassword,
        confirmPassword: mockPasswordData.confirmPassword,
      });
    });

    // Form should be cleared on success
    await waitFor(() => {
      expect(currentPasswordInput).toHaveValue("");
      expect(newPasswordInput).toHaveValue("");
      expect(confirmPasswordInput).toHaveValue("");
    });
  });

  // 5. Cybersecurity theme
  it("applies cybersecurity theme correctly", () => {
    renderWithRouter(
      <PasswordSettings onPasswordUpdate={mockOnPasswordUpdate} />
    );

    const card = screen
      .getByText("Password Settings")
      .closest(".border-green-500\\/30");
    expect(card).toBeInTheDocument();

    const currentPasswordInput = screen.getByLabelText("Current Password");
    expect(currentPasswordInput).toHaveClass("text-green-400");
    expect(currentPasswordInput).toHaveClass("font-mono");
  });

  // 6. Loading state
  it("displays loading state correctly", () => {
    renderWithRouter(
      <PasswordSettings
        onPasswordUpdate={mockOnPasswordUpdate}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole("button", {
      name: /updating password/i,
    });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Updating Password...");
  });

  // 7. Password visibility toggle
  it("toggles password visibility correctly", () => {
    renderWithRouter(
      <PasswordSettings onPasswordUpdate={mockOnPasswordUpdate} />
    );

    const currentPasswordInput = screen.getByLabelText("Current Password");
    const toggleButtons = screen.getAllByRole("button", { name: "" }); // Eye icons don't have text

    expect(currentPasswordInput).toHaveAttribute("type", "password");

    // Click the first toggle button (current password)
    fireEvent.click(toggleButtons[0]);

    expect(currentPasswordInput).toHaveAttribute("type", "text");
  });

  // 8. Error handling
  it("handles API errors gracefully", async () => {
    const errorMessage = "Current password is incorrect";
    mockOnPasswordUpdate.mockRejectedValueOnce(new Error(errorMessage));

    renderWithRouter(
      <PasswordSettings onPasswordUpdate={mockOnPasswordUpdate} />
    );

    const currentPasswordInput = screen.getByLabelText("Current Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
    const submitButton = screen.getByRole("button", {
      name: /update password/i,
    });

    fireEvent.change(currentPasswordInput, {
      target: { value: "WrongPassword123!" },
    });
    fireEvent.change(newPasswordInput, {
      target: { value: "NewPassword456!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "NewPassword456!" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnPasswordUpdate).toHaveBeenCalled();
    });

    // Error handling is now done by parent component
    // Component should not display any error messages itself
  });

  // 9. Same password validation
  it("prevents using same password as current", async () => {
    renderWithRouter(
      <PasswordSettings onPasswordUpdate={mockOnPasswordUpdate} />
    );

    const currentPasswordInput = screen.getByLabelText("Current Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password");
    const submitButton = screen.getByRole("button", {
      name: /update password/i,
    });

    const samePassword = "SamePassword123!";
    fireEvent.change(currentPasswordInput, { target: { value: samePassword } });
    fireEvent.change(newPasswordInput, { target: { value: samePassword } });
    fireEvent.change(confirmPasswordInput, { target: { value: samePassword } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("New password must be different from current password")
      ).toBeInTheDocument();
    });

    expect(mockOnPasswordUpdate).not.toHaveBeenCalled();
  });

  // 10. Password strength indicator
  it("shows password strength requirements", () => {
    renderWithRouter(
      <PasswordSettings onPasswordUpdate={mockOnPasswordUpdate} />
    );

    const newPasswordInput = screen.getByLabelText("New Password");

    // Type a weak password to trigger strength indicator
    fireEvent.change(newPasswordInput, { target: { value: "weak" } });

    expect(screen.getByText("Password Requirements:")).toBeInTheDocument();
    expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
    expect(screen.getByText("One uppercase letter")).toBeInTheDocument();
    expect(screen.getByText("One lowercase letter")).toBeInTheDocument();
    expect(screen.getByText("One number")).toBeInTheDocument();
    expect(screen.getByText("One special character")).toBeInTheDocument();
  });
});
