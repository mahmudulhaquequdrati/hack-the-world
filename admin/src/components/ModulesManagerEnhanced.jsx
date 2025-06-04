import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  BookmarkSlashIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationCircleIcon,
  EyeIcon,
  ListBulletIcon,
  PencilIcon,
  PlusIcon,
  Squares2X2Icon,
  TrashIcon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI, enrollmentAPI, modulesAPI, phasesAPI } from "../services/api";

const ModulesManagerEnhanced = () => {
  const { user } = useAuth(); // Get current user from auth context
  const [modules, setModules] = useState([]);
  const [phases, setPhases] = useState([]);
  const [modulesWithPhases, setModulesWithPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [viewMode, setViewMode] = useState("grouped"); // Default to grouped view
  const [selectedPhase, setSelectedPhase] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedModuleForEnroll, setSelectedModuleForEnroll] = useState(null);
  const [enrollmentStats, setEnrollmentStats] = useState({});
  const [userEnrollments, setUserEnrollments] = useState({}); // Current user's enrollments
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    phaseId: "",
    title: "",
    description: "",
    icon: "",
    difficulty: "",
    color: "#00ff00",
    order: "",
    topics: "",
    prerequisites: "",
    learningOutcomes: "",
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching modules and phases data...");

      const [modulesRes, phasesRes, modulesWithPhasesRes] =
        await Promise.allSettled([
          modulesAPI.getAll(),
          phasesAPI.getAll(),
          modulesAPI.getWithPhases(),
        ]);

      if (modulesRes.status === "fulfilled") {
        console.log("Modules fetched successfully:", modulesRes.value);
        setModules(modulesRes.value.data || []);
      } else {
        console.error("Error fetching modules:", modulesRes.reason);
      }

      if (phasesRes.status === "fulfilled") {
        console.log("Phases fetched successfully:", phasesRes.value);
        setPhases(phasesRes.value.data || []);
      } else {
        console.error("Error fetching phases:", phasesRes.reason);
      }

      if (modulesWithPhasesRes.status === "fulfilled") {
        console.log(
          "Modules with phases fetched successfully:",
          modulesWithPhasesRes.value
        );
        setModulesWithPhases(modulesWithPhasesRes.value.data || []);
      } else {
        console.error(
          "Error fetching modules with phases:",
          modulesWithPhasesRes.reason
        );
      }

      // Set error if all failed
      if (modulesRes.status === "rejected" && phasesRes.status === "rejected") {
        setError(
          "Failed to load data. Please check your connection and authentication."
        );
      }

      // Fetch enrollment stats for all modules (non-blocking)
      if (
        modulesRes.status === "fulfilled" &&
        modulesRes.value.data?.length > 0
      ) {
        // Don't await this to avoid blocking the main UI
        fetchAllEnrollmentStats().catch((err) =>
          console.warn("Failed to fetch enrollment stats:", err)
        );
      }

      // Fetch current user's enrollments (non-blocking)
      if (user?.id) {
        fetchCurrentUserEnrollments().catch((err) =>
          console.warn("Failed to fetch user enrollments:", err)
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "Failed to load data. Please check your connection and authentication."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openModal = (module = null) => {
    setError("");
    setSuccess("");
    if (module) {
      setEditingModule(module);

      // Normalize color value from database
      let colorValue = module.color || "#00ff00";
      if (typeof colorValue === "string") {
        colorValue = colorValue.trim();
        if (!colorValue.startsWith("#")) {
          colorValue = "#" + colorValue;
        }
        // If invalid format, use default
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue)) {
          colorValue = "#00ff00";
        }
      }

      setFormData({
        phaseId: module.phaseId || "",
        title: module.title || "",
        description: module.description || "",
        icon: module.icon || "",
        difficulty: module.difficulty || "",
        color: colorValue,
        order: module.order?.toString() || "",
        topics: Array.isArray(module.topics) ? module.topics.join(", ") : "",
        prerequisites: Array.isArray(module.prerequisites)
          ? module.prerequisites.join(", ")
          : "",
        learningOutcomes: Array.isArray(module.learningOutcomes)
          ? module.learningOutcomes.join(", ")
          : "",
        isActive: module.isActive !== false,
      });
    } else {
      setEditingModule(null);
      setFormData({
        phaseId: "",
        title: "",
        description: "",
        icon: "",
        difficulty: "",
        color: "#00ff00",
        order: "",
        topics: "",
        prerequisites: "",
        learningOutcomes: "",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingModule(null);
    setError("");
    setSuccess("");
  };

  const handleReorder = async (phaseId, moduleId, direction) => {
    try {
      setSaving(true);

      // Get modules for this phase
      const phaseModules = modules.filter((m) => m.phaseId === phaseId);
      const sortedModules = phaseModules.sort((a, b) => a.order - b.order);

      // Find current module index
      const currentIndex = sortedModules.findIndex((m) => m.id === moduleId);
      if (currentIndex === -1) return;

      // Calculate new position
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sortedModules.length) return;

      // Create new order array
      const moduleOrders = sortedModules.map((module, index) => {
        let newOrder = index + 1;

        if (index === currentIndex) {
          newOrder = newIndex + 1;
        } else if (index === newIndex) {
          newOrder = currentIndex + 1;
        }

        return {
          moduleId: module.id,
          order: newOrder,
        };
      });

      await modulesAPI.reorder(phaseId, moduleOrders);
      setSuccess("Module order updated successfully!");
      fetchData();
    } catch (error) {
      console.error("Error reordering modules:", error);
      setError(error.response?.data?.message || "Failed to reorder modules");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Normalize and validate color value
      let colorValue = formData.color?.trim() || "#00ff00";

      // Ensure color starts with # and has valid format
      if (!colorValue.startsWith("#")) {
        colorValue = "#" + colorValue;
      }

      // If it's not a valid hex color, use default
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue)) {
        console.warn(
          "Invalid color format detected, using default:",
          colorValue
        );
        colorValue = "#00ff00";
      }

      // Handle prerequisites - convert to ObjectIds or leave empty
      let prerequisitesArray = [];
      if (formData.prerequisites && formData.prerequisites.trim()) {
        const prereqStrings = formData.prerequisites
          .split(",")
          .map((prereq) => prereq.trim())
          .filter(Boolean);

        // For now, skip prerequisites validation and send empty array
        // TODO: Implement proper module selection UI for prerequisites
        console.warn(
          "Prerequisites entered but will be ignored:",
          prereqStrings
        );
        console.log(
          "Note: Prerequisites must be valid MongoDB ObjectIds of existing modules"
        );
        prerequisitesArray = [];
      }

      const moduleData = {
        phaseId: formData.phaseId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim() || "Shield",
        difficulty: formData.difficulty,
        color: colorValue,
        order: parseInt(formData.order),
        topics: formData.topics
          ? formData.topics
              .split(",")
              .map((topic) => topic.trim())
              .filter(Boolean)
          : [],
        prerequisites: prerequisitesArray, // Send empty array for now
        learningOutcomes: formData.learningOutcomes
          ? formData.learningOutcomes
              .split(",")
              .map((outcome) => outcome.trim())
              .filter(Boolean)
          : [],
        isActive: formData.isActive,
      };

      // Validate required fields
      if (!moduleData.phaseId || !moduleData.title || !moduleData.description) {
        throw new Error("Phase, title, and description are required");
      }

      // Validate order is positive
      if (moduleData.order < 1) {
        throw new Error("Order must be a positive number");
      }

      console.log("Submitting module data:", moduleData);

      if (editingModule) {
        console.log("Updating module:", editingModule.id);
        const response = await modulesAPI.update(editingModule.id, moduleData);
        console.log("Update response:", response);
        setSuccess("Module updated successfully!");
      } else {
        console.log("Creating new module");
        const response = await modulesAPI.create(moduleData);
        console.log("Create response:", response);
        setSuccess("Module created successfully!");
      }

      await fetchData();

      // Auto-close modal after 1.5 seconds on success
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error("Error saving module:", error);

      let errorMessage = "Failed to save module";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (module) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the module "${module.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      console.log("Deleting module:", module.id);
      console.log("Deleting module:", module);
      const response = await modulesAPI.delete(module.id);
      console.log("Delete response:", response);

      setSuccess("Module deleted successfully!");
      await fetchData();
    } catch (error) {
      console.error("Error deleting module:", error);
      setError("Failed to delete module");
    } finally {
      setSaving(false);
    }
  };

  // Enrollment functions
  const handleEnrollClick = (module) => {
    setSelectedModuleForEnroll(module);
    setShowEnrollModal(true);
    setError("");
    setSuccess("");
    setSelectedUserId(""); // Reset user selection
    fetchUsersForEnrollment(); // Load users when modal opens
  };

  const fetchUsersForEnrollment = async () => {
    try {
      setLoadingUsers(true);
      // Note: This would typically be a /users endpoint, but for now we'll use current user
      // In a real admin panel, you'd have a users management endpoint
      const currentUser = await authAPI.getCurrentUser();
      if (currentUser.success) {
        setUsers([
          {
            id: currentUser.data.id,
            username: currentUser.data.username,
            email: currentUser.data.email,
            role: currentUser.data.role,
          },
        ]);
        setSelectedUserId(currentUser.data.id); // Auto-select current user for demo
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users for enrollment");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleEnrollConfirm = async () => {
    if (!selectedModuleForEnroll || !selectedUserId) {
      setError("Please select a user for enrollment");
      return;
    }

    try {
      setEnrolling(true);
      setError("");

      // Create enrollment with improved error handling
      const response = await enrollmentAPI.create(selectedModuleForEnroll.id);

      if (response.success) {
        setSuccess(
          `Successfully enrolled user in ${selectedModuleForEnroll.title}`
        );
        setShowEnrollModal(false);
        setSelectedModuleForEnroll(null);
        setSelectedUserId("");

        // Refresh enrollment stats and module data
        await Promise.all([
          fetchEnrollmentStats(selectedModuleForEnroll.id),
          fetchData(), // Refresh all data to show updated enrollment counts
        ]);
      } else {
        setError(response.message || "Failed to enroll user in module");
      }
    } catch (error) {
      console.error("Error enrolling in module:", error);

      // Enhanced error handling based on server response
      if (error.response?.status === 400) {
        const errorMsg =
          error.response?.data?.message ||
          "User already enrolled in this module";
        setError(errorMsg);
      } else if (error.response?.status === 404) {
        setError("Module not found or has been deleted");
      } else if (error.response?.status === 401) {
        setError("Authentication required. Please log in again");
      } else if (error.response?.status === 403) {
        setError("You don't have permission to enroll users");
      } else {
        setError("Failed to enroll user in module. Please try again.");
      }
    } finally {
      setEnrolling(false);
    }
  };

  const closeEnrollModal = () => {
    setShowEnrollModal(false);
    setSelectedModuleForEnroll(null);
    setSelectedUserId("");
    setUsers([]);
    setError("");
    setSuccess("");
  };

  const fetchEnrollmentStats = async (moduleId) => {
    try {
      // Get module enrollment statistics for admin
      const response = await enrollmentAPI.getModuleStats(moduleId);
      if (response.success) {
        setEnrollmentStats((prev) => ({
          ...prev,
          [moduleId]: response.data || {},
        }));
      }
    } catch (error) {
      console.error("Error fetching enrollment stats:", error);
      // Don't show error for stats as it's not critical
    }
  };

  // Enhanced function to fetch all enrollment stats for visible modules
  const fetchAllEnrollmentStats = async () => {
    try {
      const moduleIds = modules.map((module) => module.id);
      const statsPromises = moduleIds.map((moduleId) =>
        fetchEnrollmentStats(moduleId).catch((err) => {
          console.warn(`Failed to fetch stats for module ${moduleId}:`, err);
          return null;
        })
      );
      await Promise.all(statsPromises);
    } catch (error) {
      console.error("Error fetching enrollment stats for modules:", error);
    }
  };

  // Fetch current user's enrollments
  const fetchCurrentUserEnrollments = async () => {
    if (!user?.id) return;

    try {
      const response = await enrollmentAPI.getUserEnrollments();
      if (response.success && response.data) {
        // Convert to object with moduleId as key for easy lookup
        const enrollmentsMap = {};
        response.data.forEach((enrollment) => {
          enrollmentsMap[enrollment.moduleId] = enrollment;
        });
        setUserEnrollments(enrollmentsMap);
      }
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      // Don't show error for personal enrollments as it's not critical for admin
    }
  };

  // Helper function to get current user's enrollment status for a module
  const getCurrentUserEnrollmentStatus = (moduleId) => {
    const enrollment = userEnrollments[moduleId];
    if (!enrollment) {
      return {
        enrolled: false,
        status: null,
        enrollmentDate: null,
        progress: 0,
      };
    }

    return {
      enrolled: true,
      status: enrollment.status,
      enrollmentDate: enrollment.enrollmentDate,
      progress: enrollment.progress || 0,
      completedSections: enrollment.completedSections || 0,
      totalSections: enrollment.totalSections || 0,
    };
  };

  // Helper function to render current user enrollment badge
  const getCurrentUserEnrollmentBadge = (moduleId) => {
    const userStatus = getCurrentUserEnrollmentStatus(moduleId);

    if (!userStatus.enrolled) {
      return (
        <div className="flex items-center justify-center text-xs text-gray-500">
          <BookmarkSlashIcon className="w-3 h-3 mr-1" />
          <span>Not Enrolled</span>
        </div>
      );
    }

    const statusColors = {
      active: "text-green-400 bg-green-900/20 border-green-500/30",
      completed: "text-cyan-400 bg-cyan-900/20 border-cyan-500/30",
      paused: "text-yellow-400 bg-yellow-900/20 border-yellow-500/30",
      dropped: "text-red-400 bg-red-900/20 border-red-500/30",
    };

    const colorClass = statusColors[userStatus.status] || statusColors.active;

    return (
      <div
        className={`flex items-center justify-center text-xs px-2 py-1 rounded-full border ${colorClass}`}
      >
        <BookmarkIcon className="w-3 h-3 mr-1" />
        <span>Enrolled</span>
      </div>
    );
  };

  // Helper function to render enrollment status badge
  const getEnrollmentStatusBadge = (stats) => {
    if (!stats || stats.totalEnrollments === 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
          No Enrollments
        </span>
      );
    }

    const {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      pausedEnrollments,
      droppedEnrollments,
    } = stats;

    return (
      <div className="flex flex-wrap gap-1">
        {/* Total Badge */}
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
          Total: {totalEnrollments}
        </span>

        {/* Active Badge */}
        {activeEnrollments > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
            Active: {activeEnrollments}
          </span>
        )}

        {/* Completed Badge */}
        {completedEnrollments > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-600 text-white">
            Completed: {completedEnrollments}
          </span>
        )}

        {/* Paused Badge */}
        {pausedEnrollments > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-600 text-white">
            Paused: {pausedEnrollments}
          </span>
        )}

        {/* Dropped Badge */}
        {droppedEnrollments > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
            Dropped: {droppedEnrollments}
          </span>
        )}
      </div>
    );
  };

  // Helper function to get enrollment status icon
  const getEnrollmentStatusIcon = (stats) => {
    if (!stats || stats.totalEnrollments === 0) {
      return <UserGroupIcon className="w-4 h-4 text-gray-400" />;
    }

    const { activeEnrollments, completedEnrollments } = stats;

    if (completedEnrollments > activeEnrollments) {
      return <CheckIcon className="w-4 h-4 text-cyan-400" />;
    } else if (activeEnrollments > 0) {
      return <UserGroupIcon className="w-4 h-4 text-green-400" />;
    } else {
      return <UserGroupIcon className="w-4 h-4 text-yellow-400" />;
    }
  };

  const renderModuleStats = (module) => {
    const content = module.content || {};
    const contentStats = module.contentStats || {};
    const enrollStats = enrollmentStats[module.id] || {};

    return (
      <div className="text-xs text-gray-400 mt-1">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div>Videos: {content.videos?.length || 0}</div>
            <div>Labs: {content.labs?.length || 0}</div>
            <div>Games: {content.games?.length || 0}</div>
            <div>Duration: {contentStats.totalDuration || 0} min</div>
          </div>
          <div>
            <div className="text-cyan-400">
              Enrolled: {enrollStats.totalEnrollments || 0}
            </div>
            {enrollStats.activeEnrollments !== undefined && (
              <div className="text-green-400">
                Active: {enrollStats.activeEnrollments}
              </div>
            )}
            {enrollStats.completedEnrollments !== undefined && (
              <div className="text-blue-400">
                Completed: {enrollStats.completedEnrollments}
              </div>
            )}
            {enrollStats.averageProgress !== undefined && (
              <div className="text-yellow-400">
                Avg Progress: {Math.round(enrollStats.averageProgress)}%
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const filteredModules = selectedPhase
      ? modules.filter((m) => m.phaseId === selectedPhase)
      : modules;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-600">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Phase
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Content Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Enrollment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                My Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-600">
            {filteredModules.map((module) => {
              const enrollStats = enrollmentStats[module.id] || {};
              return (
                <tr
                  key={module.id}
                  className="hover:bg-gray-700/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="text-sm font-medium text-green-400">
                          {module.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate max-w-xs">
                          {module.description}
                        </div>
                      </div>
                      {getEnrollmentStatusIcon(enrollStats)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                    {` ${module.phase?.title}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        module.difficulty === "Beginner"
                          ? "bg-green-100 text-green-800"
                          : module.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : module.difficulty === "Advanced"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {module.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                    <div className="flex items-center space-x-1">
                      <span>{module.order}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() =>
                            handleReorder(module.phaseId, module.id, "up")
                          }
                          disabled={saving}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUpIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            handleReorder(module.phaseId, module.id, "down")
                          }
                          disabled={saving}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowDownIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                    {renderModuleStats(module)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      {getEnrollmentStatusBadge(enrollStats)}

                      {/* Quick Stats */}
                      {enrollStats.totalEnrollments > 0 && (
                        <div className="text-xs text-gray-400">
                          Completion: {enrollStats.completionRate || 0}%
                          {enrollStats.averageProgress !== undefined && (
                            <> • Avg: {enrollStats.averageProgress}%</>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCurrentUserEnrollmentBadge(module.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {module.isActive ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/modules/${module.id}`}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4 inline" />
                    </Link>
                    {getCurrentUserEnrollmentStatus(module.id).enrolled ? (
                      <span className="text-xs text-gray-400 cursor-not-allowed">
                        Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEnrollClick(module)}
                        className="text-purple-400 hover:text-purple-300"
                        disabled={saving}
                        title="Enroll User"
                      >
                        Enroll
                      </button>
                    )}
                    <button
                      onClick={() => openModal(module)}
                      className="text-cyber-green hover:text-green-300 mr-4"
                    >
                      <PencilIcon className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(module)}
                      className="text-red-400 hover:text-red-300"
                      disabled={saving}
                    >
                      <TrashIcon className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGroupedView = () => (
    <div className="space-y-6">
      {modulesWithPhases.map((phase) => (
        <div
          key={phase.id}
          className="bg-gray-800 p-6 rounded-lg shadow border border-gray-600"
        >
          <h3 className="text-lg font-medium text-green-400 mb-4">
            {phase.title} ({phase.modules?.length || 0} modules)
          </h3>
          {phase.modules && phase.modules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phase.modules.map((module) => {
                const enrollStats = enrollmentStats[module.id] || {};
                return (
                  <div
                    key={module.id}
                    className="border border-gray-600 rounded-lg p-4 bg-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-green-400">
                          {module.title}
                        </h4>
                        {getEnrollmentStatusIcon(enrollStats)}
                      </div>
                      <span className="text-xs text-gray-400">
                        #{module.order}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 mb-2">
                      {module.description}
                    </p>

                    {/* Difficulty Badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          module.difficulty === "Beginner"
                            ? "bg-green-100 text-green-800"
                            : module.difficulty === "Intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : module.difficulty === "Advanced"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {module.difficulty}
                      </span>
                    </div>

                    {/* Content Stats */}
                    {renderModuleStats(module)}

                    {/* Enrollment Status Section */}
                    <div className="mt-3 mb-3 p-2 bg-gray-800 rounded-md">
                      <div className="text-xs font-medium text-gray-400 mb-1">
                        Enrollment Status
                      </div>
                      {getEnrollmentStatusBadge(enrollStats)}

                      {/* Enhanced enrollment information */}
                      {enrollStats.totalEnrollments > 0 && (
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                          <span>{enrollStats.totalEnrollments} enrolled</span>
                          <span>
                            {enrollStats.completionRate || 0}% completion
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Current User Enrollment Status */}
                    <div className="mt-2 mb-3 p-2 bg-gray-900 rounded-md border border-gray-600">
                      <div className="text-xs font-medium text-cyan-400 mb-1">
                        My Enrollment
                      </div>
                      {getCurrentUserEnrollmentBadge(module.id)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex space-x-1">
                        <button
                          onClick={() =>
                            handleReorder(phase.id, module.id, "up")
                          }
                          disabled={saving}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUpIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            handleReorder(phase.id, module.id, "down")
                          }
                          disabled={saving}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowDownIcon className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="space-x-2">
                        <Link
                          to={`/modules/${module.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300"
                          title="View Details"
                        >
                          View
                        </Link>
                        {getCurrentUserEnrollmentStatus(module.id).enrolled ? (
                          <span className="text-xs text-gray-400 cursor-not-allowed">
                            Enrolled
                          </span>
                        ) : (
                          <button
                            onClick={() => handleEnrollClick(module)}
                            className="text-xs text-purple-400 hover:text-purple-300"
                            disabled={saving}
                            title="Enroll User"
                          >
                            Enroll
                          </button>
                        )}
                        <button
                          onClick={() => openModal(module)}
                          className="text-xs text-cyber-green hover:text-green-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(module)}
                          className="text-xs text-red-400 hover:text-red-300"
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">No modules found in this phase</p>
          )}
        </div>
      ))}
    </div>
  );

  // Add new render methods for grid view
  const renderGridView = () => {
    const filteredModules = selectedPhase
      ? modules.filter((m) => m.phaseId === selectedPhase)
      : modules;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 lg:gap-6 p-4 ">
        {filteredModules.map((module) => (
          <div
            key={module.id}
            className="terminal-window bg-gray-800 hover:bg-gray-750 transition-colors"
          >
            <div className="p-4 ">
              {/* Module Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-black font-bold text-sm"
                    style={{ backgroundColor: module.color }}
                  >
                    {module.order}
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      module.difficulty === "Beginner"
                        ? "bg-green-500 text-black"
                        : module.difficulty === "Intermediate"
                        ? "bg-yellow-500 text-black"
                        : module.difficulty === "Advanced"
                        ? "bg-orange-500 text-black"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {module.difficulty}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Link
                    to={`/modules/${module.id}`}
                    className="p-2 text-green-400 hover:text-cyber-green transition-colors"
                    title="View Details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => openModal(module)}
                    className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    title="Edit Module"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(module)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete Module"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Module Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-cyber-green line-clamp-2">
                  {module.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-3">
                  {module.description}
                </p>

                {/* Phase Info */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Phase:</span>
                  <span className="text-green-400">
                    {phases.find((p) => p.id === module.phaseId)?.title ||
                      "Unknown"}
                  </span>
                </div>

                {/* Module Stats */}
                {renderModuleStats(module)}

                {/* Current User Enrollment Status */}
                <div className="mt-2 pt-2 border-t border-gray-700">
                  {getCurrentUserEnrollmentBadge(module.id)}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
                {getCurrentUserEnrollmentStatus(module.id).enrolled ? (
                  <button
                    disabled
                    className="flex-1 btn-secondary text-xs py-2 opacity-75 cursor-not-allowed"
                    title="Already Enrolled"
                  >
                    <BookmarkIcon className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Enrolled</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnrollClick(module)}
                    className="flex-1 btn-secondary text-xs py-2"
                    title="Enroll User"
                  >
                    <UserPlusIcon className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Enroll</span>
                  </button>
                )}
                <Link
                  to={`/modules/${module.id}`}
                  className="flex-1 btn-primary text-xs py-2 text-center"
                >
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">View</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cyber-green">
            [ENHANCED MODULES MANAGEMENT]
          </h1>
          <p className="text-green-400 mt-2">
            Advanced module management with phase integration and content
            statistics
          </p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={loading}
          className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Add Module</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded flex items-center">
          <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center">
          <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="terminal-window">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Phase Filter */}
              <div className="flex-1 sm:flex-none">
                <label className="block text-sm font-medium text-green-400 mb-2">
                  Filter by Phase
                </label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                >
                  <option value="">All Phases</option>
                  {phases.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      {phase.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                View Mode
              </label>
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    viewMode === "grid"
                      ? "bg-cyan-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    viewMode === "list"
                      ? "bg-cyan-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => setViewMode("grouped")}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    viewMode === "grouped"
                      ? "bg-cyan-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <ChartBarIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Grouped</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="terminal-window">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {modules.length}
            </div>
            <div className="text-sm text-gray-400">Total Modules</div>
          </div>
        </div>
        <div className="terminal-window">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-cyber-green">
              {modules.filter((m) => m.isActive).length}
            </div>
            <div className="text-sm text-gray-400">Active Modules</div>
          </div>
        </div>
        <div className="terminal-window">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {phases.length}
            </div>
            <div className="text-sm text-gray-400">Total Phases</div>
          </div>
        </div>
        <div className="terminal-window">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {modules.filter((m) => m.difficulty === "Beginner").length}
            </div>
            <div className="text-sm text-gray-400">Beginner Modules</div>
          </div>
        </div>
      </div>

      {/* Content Display */}
      <div className="terminal-window">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-cyber-green text-lg">Loading modules...</div>
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              No modules found. Create your first module to get started.
            </div>
            <button onClick={() => openModal()} className="btn-primary">
              Create First Module
            </button>
          </div>
        ) : viewMode === "grid" ? (
          renderGridView()
        ) : viewMode === "list" ? (
          renderListView()
        ) : (
          renderGroupedView()
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-600">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-400">
                  {editingModule ? "Edit Module" : "Create Module"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-green-400"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Phase*
                    </label>
                    <select
                      name="phaseId"
                      value={formData.phaseId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                      required
                    >
                      <option value="">Select Phase</option>
                      {phases.map((phase) => (
                        <option key={phase.id} value={phase.id}>
                          {phase.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Order*
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                    required
                    maxLength="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-1">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                    required
                    maxLength="500"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Icon
                    </label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                      placeholder="Shield"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Difficulty*
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                      required
                    >
                      <option value="">Select Difficulty</option>
                      {difficultyLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-600 rounded-md bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-1">
                    Topics (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="topics"
                    value={formData.topics}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                    placeholder="Security Basics, Threat Models, Risk Assessment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-1">
                    Prerequisites (currently disabled)
                    <span className="text-xs text-gray-400 ml-2">
                      Note: Prerequisites require existing module ObjectIds
                    </span>
                  </label>
                  <input
                    type="text"
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400 opacity-50"
                    placeholder="Will be ignored for now - TODO: Add module selector"
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Future enhancement: This will be a dropdown to select
                    existing modules
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-1">
                    Learning Outcomes (comma-separated)
                  </label>
                  <textarea
                    name="learningOutcomes"
                    value={formData.learningOutcomes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                    rows="2"
                    placeholder="Understand security principles, Identify common threats"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-cyber-green focus:ring-cyber-green border-gray-600 rounded bg-gray-700"
                  />
                  <label className="ml-2 block text-sm text-green-400">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-green-400 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-cyber-green text-black rounded-md hover:bg-green-400 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingModule ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Modal */}
      {showEnrollModal && selectedModuleForEnroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-lg w-full border border-gray-600">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-400 flex items-center">
                  <UserPlusIcon className="h-6 w-6 mr-2" />
                  Enroll User in Module
                </h2>
                <button
                  onClick={closeEnrollModal}
                  className="text-gray-400 hover:text-green-400"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Module Information */}
              <div className="mb-6">
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-medium text-green-400 mb-2">
                    {selectedModuleForEnroll.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {selectedModuleForEnroll.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-blue-400">
                      Phase: {selectedModuleForEnroll.phase?.title || "N/A"}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedModuleForEnroll.difficulty === "Beginner"
                          ? "bg-green-100 text-green-800"
                          : selectedModuleForEnroll.difficulty ===
                            "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedModuleForEnroll.difficulty === "Advanced"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedModuleForEnroll.difficulty}
                    </span>
                  </div>

                  {/* Enrollment Statistics */}
                  {enrollmentStats[selectedModuleForEnroll.id] && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="text-xs text-gray-400">
                        <span className="text-cyan-400">
                          Current Enrollments:{" "}
                        </span>
                        {enrollmentStats[selectedModuleForEnroll.id]
                          .totalEnrollments || 0}
                        {enrollmentStats[selectedModuleForEnroll.id]
                          .activeEnrollments && (
                          <span className="ml-2">
                            (
                            <span className="text-green-400">
                              {
                                enrollmentStats[selectedModuleForEnroll.id]
                                  .activeEnrollments
                              }{" "}
                              active
                            </span>
                            )
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    <UsersIcon className="h-4 w-4 inline mr-1" />
                    Select User to Enroll
                  </label>
                  {loadingUsers ? (
                    <div className="flex items-center text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
                      Loading users...
                    </div>
                  ) : (
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-700 text-green-400"
                      disabled={users.length === 0}
                    >
                      <option value="">Select a user...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username} ({user.email}) - {user.role}
                        </option>
                      ))}
                    </select>
                  )}
                  {users.length === 0 && !loadingUsers && (
                    <p className="text-xs text-yellow-400 mt-1">
                      Note: In a full admin panel, this would show all system
                      users. Currently showing logged-in admin only.
                    </p>
                  )}
                </div>

                <p className="text-gray-400 text-sm">
                  This will create a new enrollment record and allow the user to
                  access the module content.
                </p>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeEnrollModal}
                  className="px-4 py-2 text-green-400 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                  disabled={enrolling}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnrollConfirm}
                  disabled={enrolling || !selectedUserId || loadingUsers}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 disabled:opacity-50 flex items-center"
                >
                  {enrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="h-4 w-4 mr-2" />
                      Confirm Enrollment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesManagerEnhanced;
