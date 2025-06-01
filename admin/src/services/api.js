import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

// Set up axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    if (error.response?.status === 401) {
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
  auth: authAPI,
};
