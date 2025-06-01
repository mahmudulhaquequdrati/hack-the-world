import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock the AuthContext since we're testing admin components
const MockAuthProvider = ({ children, mockUser = null }) => {
  const mockAuthValue = {
    user: mockUser || {
      id: "507f1f77bcf86cd799439001",
      username: "admin",
      email: "admin@example.com",
      role: "admin",
    },
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: true,
    loading: false,
  };

  return (
    <div data-testid="mock-auth-provider">
      {React.cloneElement(children, { authContext: mockAuthValue })}
    </div>
  );
};

// Custom render function with providers
export const renderWithProviders = (ui, options = {}) => {
  const { initialEntries = ["/"], mockUser = null, ...renderOptions } = options;

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <MockAuthProvider mockUser={mockUser}>{children}</MockAuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Custom render function for admin components that need routing
export const renderWithRouter = (ui, options = {}) => {
  const { initialEntries = ["/"] } = options;

  const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

  return render(ui, { wrapper: Wrapper, ...options });
};

// Helper functions for common test patterns
export const createMockEvent = (name, value) => ({
  target: { name, value },
});

export const fillForm = async (fields) => {
  const user = userEvent.setup();

  for (const [name, value] of Object.entries(fields)) {
    const input =
      screen.getByRole("textbox", { name: new RegExp(name, "i") }) ||
      screen.getByDisplayValue("") ||
      screen.getByLabelText(new RegExp(name, "i"));

    await user.clear(input);
    await user.type(input, value);
  }
};

export const selectFromDropdown = async (label, value) => {
  const user = userEvent.setup();
  const select = screen.getByLabelText(new RegExp(label, "i"));
  await user.selectOptions(select, value);
};

export const clickButton = async (buttonText) => {
  const user = userEvent.setup();
  const button = screen.getByRole("button", {
    name: new RegExp(buttonText, "i"),
  });
  await user.click(button);
};

export const expectLoading = () => {
  expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
};

export const expectError = (message) => {
  expect(screen.getByText(new RegExp(message, "i"))).toBeInTheDocument();
};

export const expectSuccess = (message) => {
  expect(screen.getByText(new RegExp(message, "i"))).toBeInTheDocument();
};

export const waitForElementToDisappear = async (element) => {
  await waitFor(() => {
    expect(element).not.toBeInTheDocument();
  });
};

// Mock fetch for API calls
export const mockFetch = (data, options = {}) => {
  const { status = 200, ok = true } = options;

  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  });
};

// Common mock data generators
export const createMockPhase = (overrides = {}) => ({
  id: "507f1f77bcf86cd799439011",
  name: "Test Phase",
  description: "Test phase description",
  order: 1,
  color: "#22c55e",
  isActive: true,
  ...overrides,
});

export const createMockModule = (overrides = {}) => ({
  id: "507f1f77bcf86cd799439021",
  title: "Test Module",
  description: "Test module description",
  phaseId: "507f1f77bcf86cd799439011",
  order: 1,
  difficulty: "beginner",
  estimatedTime: 120,
  topics: ["Topic 1", "Topic 2"],
  isActive: true,
  enrolledCount: 50,
  ...overrides,
});

// Re-export testing library utilities
export { fireEvent, render, screen, userEvent, waitFor };

export default {
  renderWithProviders,
  renderWithRouter,
  createMockEvent,
  fillForm,
  selectFromDropdown,
  clickButton,
  expectLoading,
  expectError,
  expectSuccess,
  waitForElementToDisappear,
  mockFetch,
  createMockPhase,
  createMockModule,
};
