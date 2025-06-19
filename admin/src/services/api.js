import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

// Set up axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Request deduplication cache
const pendingRequests = new Map();
const requestCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds cache for admin operations

// Create deduplicated axios instance
const createDedupedRequest = (config) => {
  // Include request body for POST requests in the key
  const bodyKey = config.data ? JSON.stringify(config.data) : '';
  const paramsKey = config.params ? JSON.stringify(config.params) : '';
  const key = `${config.method?.toLowerCase() || 'get'}-${config.url}-${paramsKey}-${bodyKey}`;
  
  // Return pending request if already in progress
  if (pendingRequests.has(key)) {
    console.log(`🔄 Deduplicating request: ${key}`);
    return pendingRequests.get(key);
  }
  
  // Check cache for GET requests only
  if ((!config.method || config.method.toLowerCase() === 'get') && requestCache.has(key)) {
    const cached = requestCache.get(key);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`📋 Using cached response: ${key}`);
      return Promise.resolve(cached.data);
    } else {
      requestCache.delete(key);
    }
  }
  
  // Create new request
  const requestPromise = axios(config).then(response => {
    // Cache GET responses only
    if (!config.method || config.method.toLowerCase() === 'get') {
      requestCache.set(key, {
        data: response,
        timestamp: Date.now()
      });
    }
    return response;
  }).catch(error => {
    throw error;
  }).finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, requestPromise);
  return requestPromise;
};

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
    const response = await createDedupedRequest({ url: "/phases" });
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

  // Batch update phase orders
  batchUpdateOrder: async (data) => {
    const response = await axios.put("/phases/batch-order", data);
    return response.data;
  },
};

// Modules API
export const modulesAPI = {
  // Get all modules
  getAll: async () => {
    const response = await createDedupedRequest({ url: "/modules" });
    return response.data;
  },

  // Get modules with phases (for course page)
  getWithPhases: async () => {
    const response = await createDedupedRequest({ url: "/modules/with-phases" });
    return response.data;
  },

  // Get modules by phase
  getByPhase: async (phaseId) => {
    const response = await createDedupedRequest({ url: `/modules/phase/${phaseId}` });
    return response.data;
  },

  // Get single module
  getById: async (moduleId) => {
    const response = await createDedupedRequest({ url: `/modules/${moduleId}` });
    return response.data;
  },

  // Get module with phase information
  getByIdWithPhase: async (moduleId) => {
    const response = await createDedupedRequest({ 
      url: `/modules/${moduleId}`, 
      params: { includePhase: true }
    });
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

  // Batch update module orders (similar to phases)
  batchUpdateOrder: async (data) => {
    const response = await axios.put("/modules/batch-order", data);
    return response.data;
  },
};

// Content API
export const contentAPI = {
  // Get all content with filtering and pagination
  getAll: async (params = {}) => {
    const response = await createDedupedRequest({ url: "/content", params });
    return response.data;
  },

  // Get content by ID
  getById: async (contentId) => {
    const response = await createDedupedRequest({ url: `/content/${contentId}` });
    return response.data;
  },

  // Get content by ID with module info (admin-optimized)
  getByIdWithModule: async (contentId) => {
    const response = await createDedupedRequest({ 
      url: `/content/${contentId}`,
      params: { includeModule: true }
    });
    return response.data;
  },

  // Get content with module and progress (for student frontend)
  getWithModuleAndProgress: async (contentId) => {
    const response = await createDedupedRequest({ url: `/content/${contentId}/with-module-and-progress` });
    return response.data;
  },

  // Get content by module ID (not used yet)
  getByModule: async (moduleId) => {
    const response = await createDedupedRequest({ url: `/content/module/${moduleId}` });
    return response.data;
  },

  // Get content by module ID grouped by type
  getByModuleGrouped: async (moduleId) => {
    const response = await createDedupedRequest({ url: `/content/module/${moduleId}/grouped` });
    return response.data;
  },

  // Get module content overview with statistics
  getModuleOverview: async (moduleId) => {
    const response = await createDedupedRequest({ url: `/content/module-overview/${moduleId}` });
    return response.data;
  },

  // Get content by type
  getByType: async (type, moduleId = null) => {
    const params = moduleId ? { moduleId } : {};
    const response = await createDedupedRequest({ url: `/content/type/${type}`, params });
    return response.data;
  },

  // Get distinct sections by module
  getSectionsByModule: async (moduleId) => {
    const response = await createDedupedRequest({ url: `/content/sections/by-module/${moduleId}` });
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

// Enrollment API
export const enrollmentAPI = {
  // Create enrollment (enroll user in module)
  create: async (moduleId) => {
    const response = await axios.post("/enrollments", { moduleId });
    return response.data;
  },

  // Get user enrollments
  getUserEnrollments: async (params = {}) => {
    const response = await axios.get("/enrollments", { params });
    return response.data;
  },

  // Get enrollment by module
  getByModule: async (moduleId) => {
    const response = await axios.get(`/enrollments/module/${moduleId}`);
    return response.data;
  },

  // Update enrollment progress
  updateProgress: async (enrollmentId, completedSections) => {
    const response = await axios.put(`/enrollments/${enrollmentId}/progress`, {
      completedSections,
    });
    return response.data;
  },

  // Pause enrollment
  pause: async (enrollmentId) => {
    const response = await axios.put(`/enrollments/${enrollmentId}/pause`);
    return response.data;
  },

  // Resume enrollment
  resume: async (enrollmentId) => {
    const response = await axios.put(`/enrollments/${enrollmentId}/resume`);
    return response.data;
  },

  // Complete enrollment
  complete: async (enrollmentId) => {
    const response = await axios.put(`/enrollments/${enrollmentId}/complete`);
    return response.data;
  },

  // Unenroll (delete enrollment)
  delete: async (enrollmentId) => {
    const response = await axios.delete(`/enrollments/${enrollmentId}`);
    return response.data;
  },

  // Admin: Get all enrollments
  getAllAdmin: async (params = {}) => {
    const response = await createDedupedRequest({ url: "/enrollments/admin/all", params });
    return response.data;
  },

  // Admin: Get module enrollment statistics
  getModuleStats: async (moduleId) => {
    const response = await createDedupedRequest({ url: `/enrollments/admin/stats/${moduleId}` });
    return response.data;
  },

  // Admin: Get batch module enrollment statistics (optimized)
  getBatchModuleStats: async (moduleIds) => {
    // If only one module, use single endpoint
    if (moduleIds.length === 1) {
      return enrollmentAPI.getModuleStats(moduleIds[0]);
    }

    // Use new batch endpoint for multiple modules
    try {
      const response = await createDedupedRequest({
        method: 'POST',
        url: "/enrollments/admin/stats/batch",
        data: { moduleIds }
      });
      return response.data;
    } catch (error) {
      console.warn('Batch stats endpoint failed, falling back to individual calls:', error);
      
      // Fallback to individual calls if batch endpoint fails
      const statsPromises = moduleIds.map(moduleId => 
        enrollmentAPI.getModuleStats(moduleId)
      );
      
      const results = await Promise.allSettled(statsPromises);
      const batchStats = {};
      
      results.forEach((result, index) => {
        const moduleId = moduleIds[index];
        if (result.status === 'fulfilled') {
          batchStats[moduleId] = result.value;
        } else {
          console.warn(`Failed to fetch stats for module ${moduleId}:`, result.reason);
          batchStats[moduleId] = { stats: { totalEnrollments: 0, activeEnrollments: 0 } };
        }
      });
      
      return { success: true, data: batchStats };
    }
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

// Progress API
export const progressAPI = {
  // Get user's overall progress
  getUserProgress: async (userId, params = {}) => {
    const response = await axios.get(`/progress/${userId}`, { params });
    return response.data;
  },

  // Get module-specific progress for a user
  getUserModuleProgress: async (userId, moduleId) => {
    const response = await axios.get(`/progress/${userId}/${moduleId}`);
    return response.data;
  },

  // Update content progress
  updateProgress: async (progressData) => {
    const response = await axios.post("/progress", progressData);
    return response.data;
  },

  // Mark content as completed
  markContentCompleted: async (progressId, score = null) => {
    const data = score !== null ? { score } : {};
    const response = await axios.put(`/progress/${progressId}/complete`, data);
    return response.data;
  },

  // Get module progress statistics
  getModuleStats: async (moduleId) => {
    const response = await axios.get(`/progress/stats/${moduleId}`);
    return response.data;
  },

  // Get user's labs progress across all enrolled modules
  getUserLabsProgress: async (userId, params = {}) => {
    const response = await axios.get(`/progress/${userId}/labs`, { params });
    return response.data;
  },

  // Get user's games progress across all enrolled modules
  getUserGamesProgress: async (userId, params = {}) => {
    const response = await axios.get(`/progress/${userId}/games`, { params });
    return response.data;
  },
};

export default {
  phases: phasesAPI,
  modules: modulesAPI,
  content: contentAPI,
  enrollment: enrollmentAPI,
  auth: authAPI,
  progress: progressAPI,
};
