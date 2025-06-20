import { vi } from "vitest";

// Mock API responses
export const mockPhases = [
  {
    _id: "507f1f77bcf86cd799439011",
    title: "Foundation Phase",
    description: "Basic cybersecurity concepts",
    order: 1,
    isActive: true,
  },
  {
    _id: "507f1f77bcf86cd799439012",
    title: "Intermediate Phase",
    description: "Advanced cybersecurity topics",
    order: 2,
    isActive: true,
  },
];

export const mockModules = [
  {
    _id: "507f1f77bcf86cd799439013",
    phaseId: "507f1f77bcf86cd799439011",
    title: "Cybersecurity Basics",
    description: "Introduction to cybersecurity",
    icon: "Shield",
    difficulty: "Beginner",
    color: "#00ff00",
    order: 1,
    isActive: true,
    enrollments: 150,
    estimatedTime: 120,
  },
  {
    _id: "507f1f77bcf86cd799439014",
    phaseId: "507f1f77bcf86cd799439011",
    title: "Network Security",
    description: "Network security fundamentals",
    icon: "Network",
    difficulty: "Intermediate",
    color: "#00ff00",
    order: 2,
    isActive: true,
    enrollments: 89,
    estimatedTime: 180,
  },
];

export const mockContent = [
  {
    _id: "507f1f77bcf86cd799439015",
    moduleId: "507f1f77bcf86cd799439013",
    type: "video",
    title: "Introduction Video",
    description: "Basic introduction to cybersecurity",
    url: "https://example.com/video1",
    duration: 10,
    order: 1,
  },
  {
    _id: "507f1f77bcf86cd799439016",
    moduleId: "507f1f77bcf86cd799439013",
    type: "lab",
    title: "First Lab",
    description: "Hands-on cybersecurity lab",
    instructions: "Follow the steps to complete the lab",
    duration: 30,
    order: 2,
  },
];

// Mock API functions
export const mockPhasesAPI = {
  getAll: vi.fn(() => Promise.resolve({ success: true, data: mockPhases })),
  getById: vi.fn((id) =>
    Promise.resolve({ data: mockPhases.find((p) => p._id === id) })
  ),
  create: vi.fn((data) =>
    Promise.resolve({ data: { ...data, _id: "new-phase-id" } })
  ),
  update: vi.fn((id, data) => Promise.resolve({ data: { ...data, _id: id } })),
  delete: vi.fn(() => Promise.resolve({ success: true })),
};

export const mockModulesAPI = {
  getAll: vi.fn(() => Promise.resolve({ success: true, data: mockModules })),
  getWithPhases: vi.fn(() =>
    Promise.resolve({
      data: mockPhases.map((phase) => ({
        ...phase,
        modules: mockModules.filter((m) => m.phaseId === phase._id),
      })),
    })
  ),
  getByPhase: vi.fn((phaseId) =>
    Promise.resolve({ data: mockModules.filter((m) => m.phaseId === phaseId) })
  ),
  getById: vi.fn((id) =>
    Promise.resolve({ data: mockModules.find((m) => m._id === id) })
  ),
  create: vi.fn((data) =>
    Promise.resolve({ data: { ...data, _id: "new-module-id" } })
  ),
  update: vi.fn((id, data) => Promise.resolve({ data: { ...data, _id: id } })),
  delete: vi.fn(() => Promise.resolve({ success: true })),
  reorder: vi.fn(() => Promise.resolve({ success: true })),
};

export const mockContentAPI = {
  getAll: vi.fn(() =>
    Promise.resolve({
      data: mockContent,
      pagination: { page: 1, limit: 10, total: 2, pages: 1 },
    })
  ),
  getById: vi.fn((id) =>
    Promise.resolve({ data: mockContent.find((c) => c._id === id) })
  ),
  getByModule: vi.fn((moduleId) =>
    Promise.resolve({
      data: mockContent.filter((c) => c.moduleId === moduleId),
    })
  ),
  getByModuleGrouped: vi.fn((moduleId) =>
    Promise.resolve({
      data: { video: [mockContent[0]], lab: [mockContent[1]] },
    })
  ),
  getByType: vi.fn((type) =>
    Promise.resolve({ data: mockContent.filter((c) => c.type === type) })
  ),
  create: vi.fn((data) =>
    Promise.resolve({ data: { ...data, _id: "new-content-id" } })
  ),
  update: vi.fn((id, data) => Promise.resolve({ data: { ...data, _id: id } })),
  delete: vi.fn(() => Promise.resolve({ success: true })),
  permanentDelete: vi.fn(() => Promise.resolve({ success: true })),
};

export const mockAuthAPI = {
  login: vi.fn(() =>
    Promise.resolve({
      data: { token: "mock-token", user: { _id: "1", email: "admin@test.com" } },
    })
  ),
  register: vi.fn(() =>
    Promise.resolve({
      data: { token: "mock-token", user: { _id: "1", email: "admin@test.com" } },
    })
  ),
  getCurrentUser: vi.fn(() =>
    Promise.resolve({ data: { _id: "1", email: "admin@test.com" } })
  ),
  logout: vi.fn(() => Promise.resolve({ success: true })),
};

// Structured mock API object
export const mockAPI = {
  phases: mockPhasesAPI,
  modules: mockModulesAPI,
  content: mockContentAPI,
  auth: mockAuthAPI,
};

// Mock API errors
export const mockAPIErrors = {
  serverError: new Error("Internal server error"),
  notFound: new Error("Not found"),
  unauthorized: new Error("Unauthorized"),
  validation: new Error("Validation failed"),
};

// Reset function to clear all mocks
export const resetMocks = () => {
  vi.clearAllMocks();
  // Reset default implementations
  mockPhasesAPI.getAll.mockResolvedValue({ success: true, data: mockPhases });
  mockModulesAPI.getAll.mockResolvedValue({ success: true, data: mockModules });
  mockContentAPI.getAll.mockResolvedValue({
    success: true,
    data: mockContent,
    pagination: { page: 1, limit: 10, total: 2, pages: 1 },
  });
};

// Default export for easy mocking
export default {
  phasesAPI: mockPhasesAPI,
  modulesAPI: mockModulesAPI,
  contentAPI: mockContentAPI,
  authAPI: mockAuthAPI,
};
