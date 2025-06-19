import { useEffect, useState } from "react";
import api, { enrollmentAPI } from "../../../services/api";

export const useEnrollmentData = (initialFilters = {}) => {
  // State management
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Filter and search state
  const [filters, setFilters] = useState({
    status: "",
    moduleId: "",
    search: "",
    page: 1,
    limit: 20,
    ...initialFilters,
  });

  // Additional data state
  const [modules, setModules] = useState([]);
  const [pagination, setPagination] = useState({});
  const [totalStats, setTotalStats] = useState({});
  const [users, setUsers] = useState([]);
  const [enrolledModules, setEnrolledModules] = useState([]);

  // Fetch enrollments data
  const fetchEnrollments = async () => {
    try {
      setRefreshing(true);
      setError("");

      const response = await enrollmentAPI.getAllAdmin(filters);

      if (response.success) {
        setEnrollments(response.data || []);
        setPagination(response.pagination || {});

        // Calculate total statistics
        calculateTotalStats(response.data || []);

        // Process enrolled modules data
        processEnrolledModules(response.data || []);
        
        // Process users data
        processUsers(response.data || []);
      } else {
        setError("Failed to fetch enrollments");
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setError("Failed to fetch enrollments. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch modules for filter dropdown
  const fetchModules = async () => {
    try {
      const response = await api.modules.getAll();
      if (response.success) {
        setModules(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  // Calculate total statistics
  const calculateTotalStats = (enrollmentData) => {
    const stats = {
      total: enrollmentData.length,
      active: enrollmentData.filter((e) => e.status === "active").length,
      completed: enrollmentData.filter((e) => e.status === "completed").length,
      paused: enrollmentData.filter((e) => e.status === "paused").length,
      dropped: enrollmentData.filter((e) => e.status === "dropped").length,
      averageProgress:
        enrollmentData.length > 0
          ? Math.round(
              enrollmentData.reduce(
                (sum, e) => sum + (e.progressPercentage || 0),
                0
              ) / enrollmentData.length
            )
          : 0,
      completionRate:
        enrollmentData.length > 0
          ? Math.round(
              (enrollmentData.filter((e) => e.status === "completed").length /
                enrollmentData.length) *
                100
            )
          : 0,
    };
    setTotalStats(stats);
  };

  // Process enrollments into users with aggregated stats
  const processUsers = (enrollmentData) => {
    const usersMap = new Map();

    enrollmentData.forEach((enrollment) => {
      const userId = enrollment.userId?.id;
      if (!userId) return;

      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          user: enrollment.userId,
          enrollments: [],
          stats: {
            totalEnrollments: 0,
            activeEnrollments: 0,
            completedEnrollments: 0,
            pausedEnrollments: 0,
            droppedEnrollments: 0,
            averageProgress: 0,
            lastActivity: null,
          },
        });
      }

      const userData = usersMap.get(userId);
      userData.enrollments.push(enrollment);
    });

    // Calculate statistics for each user
    const processedUsers = Array.from(usersMap.values()).map((userData) => {
      const { enrollments, user } = userData;
      const totalEnrollments = enrollments.length;
      const activeEnrollments = enrollments.filter((e) => e.status === "active").length;
      const completedEnrollments = enrollments.filter((e) => e.status === "completed").length;
      const pausedEnrollments = enrollments.filter((e) => e.status === "paused").length;
      const droppedEnrollments = enrollments.filter((e) => e.status === "dropped").length;

      const averageProgress =
        totalEnrollments > 0
          ? Math.round(
              enrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) / totalEnrollments
            )
          : 0;

      // Find most recent activity
      const lastActivity = enrollments.reduce((latest, enrollment) => {
        const lastAccessed = new Date(enrollment.lastAccessedAt || enrollment.enrolledAt);
        return !latest || lastAccessed > latest ? lastAccessed : latest;
      }, null);

      return {
        ...user,
        enrollmentStats: {
          totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          pausedEnrollments,
          droppedEnrollments,
          averageProgress,
          lastActivity,
        },
        enrollments,
      };
    });

    setUsers(processedUsers);
  };

  // Process enrolled modules with statistics
  const processEnrolledModules = (enrollmentData) => {
    const modulesMap = new Map();

    enrollmentData.forEach((enrollment) => {
      const moduleId = enrollment.moduleId?.id;
      if (!moduleId) return;

      if (!modulesMap.has(moduleId)) {
        modulesMap.set(moduleId, {
          module: enrollment.moduleId,
          enrollments: [],
          stats: {
            totalEnrollments: 0,
            activeEnrollments: 0,
            completedEnrollments: 0,
            averageProgress: 0,
            completionRate: 0,
          },
        });
      }

      const moduleData = modulesMap.get(moduleId);
      moduleData.enrollments.push(enrollment);
    });

    // Calculate statistics for each module
    const processedModules = Array.from(modulesMap.values()).map((moduleData) => {
      const { enrollments, module } = moduleData;
      const totalEnrollments = enrollments.length;
      const activeEnrollments = enrollments.filter((e) => e.status === "active").length;
      const completedEnrollments = enrollments.filter((e) => e.status === "completed").length;

      const averageProgress =
        totalEnrollments > 0
          ? Math.round(
              enrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) / totalEnrollments
            )
          : 0;

      const completionRate =
        totalEnrollments > 0
          ? Math.round((completedEnrollments / totalEnrollments) * 100)
          : 0;

      return {
        ...module,
        enrollmentStats: {
          totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          averageProgress,
          completionRate,
        },
        enrollments,
      };
    });

    setEnrolledModules(processedModules);
  };

  // Initialize data
  useEffect(() => {
    fetchEnrollments();
    fetchModules();
  }, [filters]);

  // Utility functions
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      moduleId: "",
      search: "",
      page: 1,
      limit: 20,
    });
  };

  const refreshData = () => {
    fetchEnrollments();
  };

  return {
    // Data
    enrollments,
    modules,
    users,
    enrolledModules,
    totalStats,
    pagination,

    // State
    loading,
    error,
    success,
    refreshing,
    filters,

    // Actions
    updateFilters,
    resetFilters,
    refreshData,
    setError,
    setSuccess,
    fetchEnrollments,
    fetchModules,
  };
};