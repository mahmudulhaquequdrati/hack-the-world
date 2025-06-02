import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

// Set up axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure proper headers for CORS
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    // Handle CORS errors specifically
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error(
        "CORS/Network Error: Check if server is running and CORS is configured correctly"
      );
      // Don't redirect on network errors, just log them
      return Promise.reject(
        new Error(
          "Network connection failed. Please check if the server is running."
        )
      );
    }

    if (error.response?.status === 401) {
      console.log(error.response.data, "error");
      // Token expired or invalid
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Phases API
export const phasesAPI = {
  // Get all phases
  getAll: async () => {
    const response = await axios.get("/phases");
    return response.data;
  },

  // Get single phase
  getById: async (phaseId) => {
    const response = await axios.get(`/phases/${phaseId}`);
    return response.data;
  },

  // Create new phase
  create: async (phaseData) => {
    const response = await axios.post("/phases", phaseData);
    return response.data;
  },

  // Update phase
  update: async (phaseId, phaseData) => {
    const response = await axios.put(`/phases/${phaseId}`, phaseData);
    return response.data;
  },

  // Delete phase
  delete: async (phaseId) => {
    const response = await axios.delete(`/phases/${phaseId}`);
    return response.data;
  },
};

// Modules API
export const modulesAPI = {
  // Get all modules
  getAll: async () => {
    const response = await axios.get("/modules");
    return response.data;
  },

  // Get modules with phases (for course page)
  getWithPhases: async () => {
    const response = await axios.get("/modules/with-phases");
    return response.data;
  },

  // Get modules by phase
  getByPhase: async (phaseId) => {
    const response = await axios.get(`/modules/phase/${phaseId}`);
    return response.data;
  },

  // Get single module
  getById: async (moduleId) => {
    const response = await axios.get(`/modules/${moduleId}`);
    return response.data;
  },

  // Create new module
  create: async (moduleData) => {
    const response = await axios.post("/modules", moduleData);
    return response.data;
  },

  // Update module
  update: async (moduleId, moduleData) => {
    const response = await axios.put(`/modules/${moduleId}`, moduleData);
    return response.data;
  },

  // Delete module
  delete: async (moduleId) => {
    const response = await axios.delete(`/modules/${moduleId}`);
    return response.data;
  },

  // Reorder modules within a phase
  reorder: async (phaseId, moduleOrders) => {
    const response = await axios.put(`/modules/phase/${phaseId}/reorder`, {
      moduleOrders,
    });
    return response.data;
  },
};

// Content API
export const contentAPI = {
  // Get all content with filtering and pagination
  getAll: async (params = {}) => {
    const response = await axios.get("/content", { params });
    return response.data;
  },

  // Get content by ID
  getById: async (contentId) => {
    const response = await axios.get(`/content/${contentId}`);
    return response.data;
  },

  // Get content by module ID
  getByModule: async (moduleId) => {
    const response = await axios.get(`/content/module/${moduleId}`);
    return response.data;
  },

  // Get content by module ID grouped by type
  getByModuleGrouped: async (moduleId) => {
    const response = await axios.get(`/content/module/${moduleId}/grouped`);
    return response.data;
  },

  // Get content by type
  getByType: async (type, moduleId = null) => {
    const params = moduleId ? { moduleId } : {};
    const response = await axios.get(`/content/type/${type}`, { params });
    return response.data;
  },

  // Create new content
  create: async (contentData) => {
    const response = await axios.post("/content", contentData);
    return response.data;
  },

  // Update content
  update: async (contentId, contentData) => {
    const response = await axios.put(`/content/${contentId}`, contentData);
    return response.data;
  },

  // Soft delete content
  delete: async (contentId) => {
    const response = await axios.delete(`/content/${contentId}`);
    return response.data;
  },

  // Permanently delete content
  permanentDelete: async (contentId) => {
    const response = await axios.delete(`/content/${contentId}/permanent`);
    return response.data;
  },
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await axios.post("/auth/login", {
      login: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post("/auth/register", userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axios.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await axios.post("/auth/logout");
    return response.data;
  },
};

export default {
  phases: phasesAPI,
  modules: modulesAPI,
  content: contentAPI,
  auth: authAPI,
};
