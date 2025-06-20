import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { AuthProvider } from "../../context/AuthContext";

// Mock user for testing
export const mockUser = {
  _id: "1",
  email: "admin@test.com",
  name: "Test Admin",
  role: "admin",
};

// Mock AuthContext
export const MockAuthProvider = ({ children, user = mockUser }) => {
  const mockAuthValue = {
    user,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  };

  return <AuthProvider value={mockAuthValue}>{children}</AuthProvider>;
};

// Custom render function that includes providers
export const renderWithProviders = (ui, options = {}) => {
  const { user = mockUser, ...renderOptions } = options;

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <MockAuthProvider user={user}>{children}</MockAuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Custom render function for router testing (alias for renderWithProviders)
export const renderWithRouter = renderWithProviders;

// Helper to create mock events
export const createMockEvent = (overrides = {}) => ({
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: {
    value: "",
    name: "",
    checked: false,
    ...overrides.target,
  },
  ...overrides,
});

// Helper to wait for async operations
export const waitFor = (callback, options = {}) => {
  return new Promise((resolve, reject) => {
    const { timeout = 1000, interval = 50 } = options;
    const startTime = Date.now();

    const check = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error("Timeout waiting for condition"));
        } else {
          setTimeout(check, interval);
        }
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error);
        } else {
          setTimeout(check, interval);
        }
      }
    };

    check();
  });
};

// Helper to create form data
export const createFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

// Re-export everything from testing library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
