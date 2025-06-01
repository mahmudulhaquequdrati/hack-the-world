import { vi } from "vitest";

// Mock data with realistic MongoDB ObjectIds
export const mockPhases = [
  {
    id: "507f1f77bcf86cd799439011",
    title: "Beginner",
    description: "Introduction to cybersecurity concepts",
    icon: "🛡️",
    order: 1,
    color: "#22c55e",
    isActive: true,
  },
  {
    id: "507f1f77bcf86cd799439012",
    title: "Intermediate",
    description: "Advanced cybersecurity techniques",
    icon: "⚔️",
    order: 2,
    color: "#f59e0b",
    isActive: true,
  },
];

export const mockModules = [
  {
    id: "507f1f77bcf86cd799439021",
    title: "Introduction to Cybersecurity",
    description: "Learn the basics of cybersecurity",
    phaseId: "507f1f77bcf86cd799439011",
    order: 1,
    difficulty: "beginner",
    estimatedTime: 120,
    topics: ["Security Fundamentals", "Threat Landscape"],
    isActive: true,
    enrolledCount: 150,
  },
  {
    id: "507f1f77bcf86cd799439022",
    title: "Network Security",
    description: "Understanding network vulnerabilities",
    phaseId: "507f1f77bcf86cd799439011",
    order: 2,
    difficulty: "intermediate",
    estimatedTime: 180,
    topics: ["Firewalls", "VPN", "Network Monitoring"],
    isActive: true,
    enrolledCount: 89,
  },
];

// Create fresh mock functions for each test
const createMockAPI = () => ({
  phases: {
    getAll: vi.fn().mockResolvedValue({
      success: true,
      data: mockPhases,
    }),
    getById: vi.fn().mockImplementation((id) =>
      Promise.resolve({
        success: true,
        data: mockPhases.find((p) => p.id === id),
      })
    ),
    create: vi.fn().mockImplementation((phaseData) =>
      Promise.resolve({
        success: true,
        data: { ...phaseData, id: "507f1f77bcf86cd799439013" },
      })
    ),
    update: vi.fn().mockImplementation((id, phaseData) =>
      Promise.resolve({
        success: true,
        data: { ...phaseData, id: id },
      })
    ),
    delete: vi.fn().mockResolvedValue({
      success: true,
      message: "Phase deleted successfully",
    }),
  },
  modules: {
    getAll: vi.fn().mockResolvedValue({
      success: true,
      data: mockModules,
    }),
    getByPhase: vi.fn().mockImplementation((phaseId) =>
      Promise.resolve({
        success: true,
        data: mockModules.filter((m) => m.phaseId === phaseId),
      })
    ),
    getById: vi.fn().mockImplementation((id) =>
      Promise.resolve({
        success: true,
        data: mockModules.find((m) => m.id === id),
      })
    ),
    create: vi.fn().mockImplementation((moduleData) =>
      Promise.resolve({
        success: true,
        data: { ...moduleData, id: "507f1f77bcf86cd799439023" },
      })
    ),
    update: vi.fn().mockImplementation((id, moduleData) =>
      Promise.resolve({
        success: true,
        data: { ...moduleData, id: id },
      })
    ),
    delete: vi.fn().mockResolvedValue({
      success: true,
      message: "Module deleted successfully",
    }),
    reorder: vi.fn().mockResolvedValue({
      success: true,
      message: "Modules reordered successfully",
    }),
  },
  auth: {
    login: vi.fn().mockResolvedValue({
      success: true,
      data: {
        token: "mock-jwt-token",
        user: {
          id: "507f1f77bcf86cd799439001",
          username: "admin",
          email: "admin@example.com",
          role: "admin",
        },
      },
    }),
    register: vi.fn().mockResolvedValue({
      success: true,
      data: {
        token: "mock-jwt-token",
        user: {
          id: "507f1f77bcf86cd799439002",
          username: "newadmin",
          email: "newadmin@example.com",
          role: "admin",
        },
      },
    }),
    getCurrentUser: vi.fn().mockResolvedValue({
      success: true,
      data: {
        id: "507f1f77bcf86cd799439001",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
      },
    }),
    logout: vi.fn().mockResolvedValue({
      success: true,
      message: "Logged out successfully",
    }),
  },
});

// Export the mock API - will be recreated for each test
export const mockAPI = createMockAPI();

// Mock API errors
export const mockAPIErrors = {
  networkError: new Error("Network Error"),
  unauthorizedError: {
    response: {
      status: 401,
      data: { success: false, message: "Unauthorized" },
    },
  },
  validationError: {
    response: {
      status: 400,
      data: { success: false, message: "Validation error" },
    },
  },
  serverError: {
    response: {
      status: 500,
      data: { success: false, message: "Internal server error" },
    },
  },
};

// Helper function to reset all mocks
export const resetMocks = () => {
  Object.values(mockAPI.phases).forEach((mock) => mock.mockClear());
  Object.values(mockAPI.modules).forEach((mock) => mock.mockClear());
  Object.values(mockAPI.auth).forEach((mock) => mock.mockClear());
};

export default mockAPI;
