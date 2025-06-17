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
import { getIconFromName, getIconOptions } from "../lib/iconUtils";
import { BookOpen } from "lucide-react";

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

  // Bulk operations state
  const [selectedModules, setSelectedModules] = useState(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkOperation, setBulkOperation] = useState("");
  const [bulkFormData, setBulkFormData] = useState({
    phaseId: "",
    difficulty: "",
    isActive: true,
    color: "",
  });
  const [formData, setFormData] = useState({
    phaseId: "",
    title: "",
    description: "",
    icon: "",
    difficulty: "",
    color: "green",
    order: "",
    topics: "",
    prerequisites: "",
    learningOutcomes: "",
    isActive: true,
  });

  // Available icon options from utility
  const iconOptions = getIconOptions();

  // Available Tailwind color options
  const colorOptions = [
    "green",
    "blue",
    "red",
    "yellow",
    "purple",
    "pink",
    "indigo",
    "cyan",
    "orange",
    "gray",
    "black",
    "white",
    "emerald",
    "lime",
    "teal",
    "sky",
    "violet",
    "fuchsia",
    "rose",
    "slate",
    "zinc",
    "neutral",
    "stone",
    "amber",
  ];

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
      let colorValue = module.color || "green";
      if (typeof colorValue === "string") {
        colorValue = colorValue.trim();
        // If invalid color name, use default
        if (!colorOptions.includes(colorValue)) {
          colorValue = "green";
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
        color: "green",
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
      let colorValue = formData.color?.trim() || "green";

      // Validate color is a valid Tailwind color name
      if (!colorOptions.includes(colorValue)) {
        console.warn("Invalid color name detected, using default:", colorValue);
        colorValue = "green";
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
    <div className="space-y-8">
      {modulesWithPhases.map((phase) => (
        <div
          key={phase.id}
          className="bg-gradient-to-br from-blue-900/30 to-black/80 border-2 border-blue-400/30 rounded-xl p-6 shadow-2xl shadow-blue-400/10 relative overflow-hidden group hover:border-blue-400/50 transition-all duration-300"
        >
          {/* Phase container glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-400/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-400/50 flex items-center justify-center animate-pulse">
                  <Layers className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400 font-mono uppercase tracking-wider">
                  ▼ {phase.title} ▼
                </h3>
                <div className="px-3 py-1 bg-blue-400/20 border border-blue-400/50 rounded-full text-blue-400 text-xs font-mono font-bold">
                  {phase.modules?.length || 0} MODULES
                </div>
              </div>
              {phase.modules?.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const phaseModuleIds = phase.modules.map(m => m.id);
                      const allSelected = phaseModuleIds.every(id => selectedModules.has(id));
                      const newSelected = new Set(selectedModules);
                      
                      if (allSelected) {
                        phaseModuleIds.forEach(id => newSelected.delete(id));
                      } else {
                        phaseModuleIds.forEach(id => newSelected.add(id));
                      }
                      setSelectedModules(newSelected);
                    }}
                    className="text-xs px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 font-mono font-bold transition-all duration-300 shadow-lg hover:shadow-purple-400/20"
                  >
                    {phase.modules.every(m => selectedModules.has(m.id)) ? "◄ DESELECT PHASE" : "► SELECT PHASE"}
                  </button>
                </div>
              )}
            </div>
            {phase.modules && phase.modules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {phase.modules.map((module) => {
                  const enrollStats = enrollmentStats[module.id] || {};
                  const isSelected = selectedModules.has(module.id);
                  const getDifficultyColor = (difficulty) => {
                    switch (difficulty?.toLowerCase()) {
                      case 'beginner': return { text: 'text-green-400', border: 'border-green-400/50', bg: 'bg-green-400/10' };
                      case 'intermediate': return { text: 'text-yellow-400', border: 'border-yellow-400/50', bg: 'bg-yellow-400/10' };
                      case 'advanced': return { text: 'text-red-400', border: 'border-red-400/50', bg: 'bg-red-400/10' };
                      case 'expert': return { text: 'text-purple-400', border: 'border-purple-400/50', bg: 'bg-purple-400/10' };
                      default: return { text: 'text-gray-400', border: 'border-gray-400/50', bg: 'bg-gray-400/10' };
                    }
                  };
                  const difficultyColors = getDifficultyColor(module.difficulty);
                  
                  return (
                    <div
                      key={module.id}
                      className={`relative overflow-hidden rounded-xl border-2 p-6 group transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        isSelected 
                          ? "border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-pink-900/30 shadow-lg shadow-purple-500/20" 
                          : "border-blue-400/30 bg-gradient-to-br from-gray-900/80 to-black/80 hover:border-blue-400/50 hover:shadow-blue-400/20"
                      }`}
                    >
                      {/* Module card glow effect */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isSelected 
                          ? "bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0"
                          : "bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0"
                      }`}></div>
                      
                      {/* Status Indicators */}
                      <div className="absolute top-2 left-2 flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                        {isSelected && (
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                        )}
                      </div>

                      {/* Module Order Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className="w-8 h-8 rounded-full bg-blue-400/20 border-2 border-blue-400 text-blue-400 shadow-lg shadow-blue-400/30 flex items-center justify-center font-mono font-bold text-sm">
                          {module.order}
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleModuleSelect(module.id)}
                              className="w-5 h-5 text-purple-600 bg-gray-800 border-purple-400/50 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-300"
                            />
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-blue-400/30 shadow-lg shadow-blue-400/30 flex items-center justify-center group-hover:animate-pulse">
                              {(() => {
                                const IconComponent = getIconFromName(module.icon);
                                return <IconComponent className="w-5 h-5 text-blue-400" />;
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="font-bold text-blue-400 font-mono uppercase tracking-wider mb-2 group-hover:text-blue-300 transition-colors line-clamp-1">
                            ◆ {module.title}
                          </h4>
                          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border inline-block ${difficultyColors.text} ${difficultyColors.bg} ${difficultyColors.border}`}>
                            {module.difficulty}
                          </div>
                        </div>
                        {/* Description */}
                        <p className="text-gray-300 text-sm font-mono line-clamp-2 mb-4 leading-relaxed">
                          {module.description}
                        </p>

                        {/* Enhanced Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 hover:border-blue-400/50 transition-all duration-300">
                            <div className="text-center">
                              <div className="text-blue-400 font-mono text-sm font-bold">{enrollStats.totalEnrollments || 0}</div>
                              <div className="text-blue-400/60 text-xs font-mono uppercase">ENROLLED</div>
                            </div>
                          </div>
                          <div className="relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 hover:border-green-400/50 transition-all duration-300">
                            <div className="text-center">
                              <div className="text-green-400 font-mono text-sm font-bold">{module.content?.videos?.length || 0}</div>
                              <div className="text-green-400/60 text-xs font-mono uppercase">VIDEOS</div>
                            </div>
                          </div>
                        </div>

                        {/* User Enrollment Status */}
                        <div className="mb-4">
                          {getCurrentUserEnrollmentStatus(module.id).enrolled ? (
                            <div className="p-3 rounded-lg border bg-gradient-to-r from-cyan-900/20 to-cyan-800/20 border-cyan-400/30">
                              <div className="flex items-center justify-center space-x-2">
                                <BookmarkIcon className="w-4 h-4 text-cyan-400" />
                                <span className="text-cyan-400 font-mono text-sm font-bold uppercase">ENROLLED</span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-lg border bg-gradient-to-r from-gray-900/20 to-gray-800/20 border-gray-600/30">
                              <div className="flex items-center justify-center space-x-2">
                                <BookmarkSlashIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400 font-mono text-sm uppercase">NOT ENROLLED</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex space-x-2">
                          <Link
                            to={`/modules/${module.id}`}
                            className="flex-1 h-10 bg-blue-400/10 border border-blue-400/30 hover:bg-blue-400/20 hover:border-blue-400/50 transition-all duration-300 rounded-lg flex items-center justify-center font-mono text-blue-400 text-xs font-bold uppercase tracking-wider"
                            title="View Details"
                          >
                            <EyeIcon className="w-3 h-3 mr-1" />
                            VIEW
                          </Link>
                          <button
                            onClick={() => openModal(module)}
                            className="h-10 px-3 bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-cyan-400"
                            title="Edit Module"
                          >
                            <PencilIcon className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(module)}
                            className="h-10 px-3 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-red-400"
                            title="Delete Module"
                            disabled={saving}
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                  </div>
                );
              })}
            </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-blue-400 text-2xl font-mono mb-2">◆</div>
                <p className="text-gray-400 font-mono">No modules found in this phase</p>
              </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => {
          const enrollStats = enrollmentStats[module.id] || {};
          const userStatus = getCurrentUserEnrollmentStatus(module.id);
          const phaseTitle = phases.find((p) => p.id === module.phaseId)?.title || "Unknown";
          
          const getDifficultyColor = (difficulty) => {
            switch (difficulty.toLowerCase()) {
              case "beginner": return "text-green-400 border-green-400/50 bg-green-400/10";
              case "intermediate": return "text-yellow-400 border-yellow-400/50 bg-yellow-400/10";
              case "advanced": return "text-red-400 border-red-400/50 bg-red-400/10";
              case "expert": return "text-purple-400 border-purple-400/50 bg-purple-400/10";
              default: return "text-gray-400 border-gray-400/50 bg-gray-400/10";
            }
          };

          return (
            <div
              key={module.id}
              className="relative overflow-hidden rounded-xl border-2 border-green-400/30 bg-gradient-to-br from-gray-900/80 to-black/80 p-6 group hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/20"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Status Indicators */}
              <div className="absolute top-2 left-2 flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                {userStatus.enrolled && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                )}
              </div>

              {/* Module Order Badge */}
              <div className="absolute top-3 right-3 z-10">
                <div className="w-8 h-8 rounded-full bg-green-400/20 border-2 border-green-400 text-green-400 shadow-lg shadow-green-400/30 flex items-center justify-center font-mono font-bold text-sm">
                  {module.order}
                </div>
              </div>

              <div className="relative z-10">
                {/* Module Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-green-400/30 shadow-lg shadow-green-400/30 flex items-center justify-center group-hover:animate-pulse">
                    {(() => {
                      const IconComponent = getIconFromName(module.icon);
                      return <IconComponent className="w-6 h-6 text-green-400" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-400 font-mono uppercase tracking-wider group-hover:text-green-300 transition-colors line-clamp-1">
                      {module.title}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-mono font-bold uppercase border ${getDifficultyColor(module.difficulty)} inline-block mt-1`}>
                      {module.difficulty}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm font-mono line-clamp-3 mb-4 leading-relaxed">
                  {module.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 hover:border-green-400/50 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-green-400 font-mono text-sm font-bold">{phaseTitle}</div>
                      <div className="text-green-400/60 text-xs font-mono uppercase">PHASE</div>
                    </div>
                  </div>
                  <div className="relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 hover:border-blue-400/50 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-blue-400 font-mono text-sm font-bold">{enrollStats.totalEnrollments || 0}</div>
                      <div className="text-blue-400/60 text-xs font-mono uppercase">ENROLLED</div>
                    </div>
                  </div>
                </div>

                {/* User Status */}
                {userStatus.enrolled && (
                  <div className="mb-4 p-3 rounded-lg border bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-400/30">
                    <div className="flex items-center justify-center space-x-2">
                      <BookmarkIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-mono text-sm font-bold uppercase">ENROLLED</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    to={`/modules/${module.id}`}
                    className="flex-1 h-10 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-300 rounded-lg flex items-center justify-center font-mono text-green-400 text-sm font-bold uppercase tracking-wider"
                    title="View Details"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    VIEW
                  </Link>
                  <button
                    onClick={() => openModal(module)}
                    className="h-10 px-3 bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-cyan-400"
                    title="Edit Module"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(module)}
                    className="h-10 px-3 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-red-400"
                    title="Delete Module"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Bulk operations handlers
  const handleModuleSelect = (moduleId) => {
    const newSelected = new Set(selectedModules);
    if (newSelected.has(moduleId)) {
      newSelected.delete(moduleId);
    } else {
      newSelected.add(moduleId);
    }
    setSelectedModules(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedModules.size === modules.length) {
      setSelectedModules(new Set());
    } else {
      setSelectedModules(new Set(modules.map(m => m.id)));
    }
  };

  const handleBulkOperation = (operation) => {
    setBulkOperation(operation);
    setShowBulkModal(true);
    setError("");
    setSuccess("");
  };

  const handleBulkSubmit = async () => {
    if (selectedModules.size === 0) {
      setError("Please select modules to update");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const moduleIds = Array.from(selectedModules);
      const updateData = {};

      // Prepare update data based on operation
      if (bulkOperation === "updatePhase" && bulkFormData.phaseId) {
        updateData.phaseId = bulkFormData.phaseId;
      }
      if (bulkOperation === "updateDifficulty" && bulkFormData.difficulty) {
        updateData.difficulty = bulkFormData.difficulty;
      }
      if (bulkOperation === "updateStatus") {
        updateData.isActive = bulkFormData.isActive;
      }
      if (bulkOperation === "updateColor" && bulkFormData.color) {
        updateData.color = bulkFormData.color;
      }

      // Execute bulk update
      const updatePromises = moduleIds.map(moduleId => 
        modulesAPI.update(moduleId, updateData)
      );

      await Promise.all(updatePromises);

      setSuccess(`Successfully updated ${moduleIds.length} modules`);
      setShowBulkModal(false);
      setSelectedModules(new Set());
      setBulkFormData({
        phaseId: "",
        difficulty: "",
        isActive: true,
        color: "",
      });
      await fetchData();
    } catch (error) {
      console.error("Error in bulk update:", error);
      setError("Failed to update modules");
    } finally {
      setSaving(false);
    }
  };

  const closeBulkModal = () => {
    setShowBulkModal(false);
    setBulkOperation("");
    setBulkFormData({
      phaseId: "",
      difficulty: "",
      isActive: true,
      color: "",
    });
    setError("");
    setSuccess("");
  };

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Enhanced Terminal Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 border-2 border-blue-400/50 flex items-center justify-center animate-pulse">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-4xl font-bold text-blue-400 font-mono uppercase tracking-wider relative">
              <span className="relative z-10">MODULES_MANAGEMENT</span>
              <div className="absolute inset-0 bg-blue-400/20 blur-lg rounded"></div>
            </h2>
          </div>
          <div className="bg-gradient-to-r from-black/80 via-blue-900/20 to-black/80 border border-blue-400/30 rounded-xl p-4 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 animate-pulse"></div>
            <div className="relative z-10 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-blue-400 font-mono text-sm ml-4">
                <span className="text-green-300">admin@hacktheworld:</span>
                <span className="text-blue-400">~/modules</span>
                <span className="text-blue-400">$ ./manage --advanced-operations --bulk-actions --enhanced</span>
                <span className="animate-ping text-blue-400">█</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <div className="flex gap-2">
              <button
                onClick={() => openModal()}
                disabled={loading}
                className="bg-gradient-to-r from-blue-400/10 to-blue-500/10 border-2 border-blue-400/30 hover:bg-gradient-to-r hover:from-blue-400/20 hover:to-blue-500/20 hover:border-blue-400/50 transition-all duration-300 text-blue-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-400/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <PlusIcon className="w-5 h-5 mr-2 relative z-10" />
                <span className="hidden sm:inline relative z-10">▶ ADD MODULE</span>
                <span className="sm:hidden relative z-10">+ ADD</span>
              </button>
            </div>
          </div>
        </div>

      {/* Enhanced Bulk Operations Toolbar */}
      {selectedModules.size > 0 && (
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 animate-pulse"></div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-400 font-mono font-bold">
                  ► {selectedModules.size} MODULE{selectedModules.size !== 1 ? 'S' : ''} SELECTED
                </span>
              </div>
              <button
                onClick={() => setSelectedModules(new Set())}
                className="text-red-400 hover:text-red-300 text-sm font-mono transition-colors duration-300 hover:bg-red-400/10 px-2 py-1 rounded"
              >
                ◄ CLEAR
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleBulkOperation("updatePhase")}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-mono font-bold hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-400/20"
              >
                ◆ PHASE
              </button>
              <button
                onClick={() => handleBulkOperation("updateDifficulty")}
                className="px-3 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg text-xs font-mono font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
              >
                ◆ DIFFICULTY
              </button>
              <button
                onClick={() => handleBulkOperation("updateStatus")}
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-xs font-mono font-bold hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-green-400/20"
              >
                ◆ STATUS
              </button>
              <button
                onClick={() => handleBulkOperation("updateColor")}
                className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-xs font-mono font-bold hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-purple-400/20"
              >
                ◆ COLOR
              </button>
            </div>
          </div>
        </div>
      )}

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
      <div className="terminal-window retro-border">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Phase Filter */}
              <div className="flex-1 sm:flex-none">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono">
                  ► Filter by Phase
                </label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400 font-mono"
                >
                  <option value="">◆ All Phases</option>
                  {phases.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      ▸ {phase.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selection Controls */}
            <div className="flex gap-3">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-gradient-to-r from-cyan-400/10 to-cyan-500/10 text-cyan-400 rounded-xl hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-cyan-500/20 border border-cyan-500/30 font-mono text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-400/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">{selectedModules.size === modules.length ? "◄ DESELECT ALL" : "► SELECT ALL"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-900/30 to-black/80 border border-green-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-green-400/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 text-center">
            <div className="text-3xl font-bold text-green-400 font-mono mb-1">
              {modules.length}
            </div>
            <div className="text-xs text-green-400/60 font-mono uppercase tracking-wider">◆ TOTAL MODULES
            </div>
            <div className="w-full bg-green-400/20 h-1 rounded-full mt-2"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-cyan-900/30 to-black/80 border border-cyan-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-cyan-400/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 text-center">
            <div className="text-3xl font-bold text-cyan-400 font-mono mb-1">
              {modules.filter((m) => m.isActive).length}
            </div>
            <div className="text-xs text-cyan-400/60 font-mono uppercase tracking-wider">◆ ACTIVE MODULES
            </div>
            <div className="w-full bg-cyan-400/20 h-1 rounded-full mt-2"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-900/30 to-black/80 border border-blue-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-blue-400/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 text-center">
            <div className="text-3xl font-bold text-blue-400 font-mono mb-1">
              {phases.length}
            </div>
            <div className="text-xs text-blue-400/60 font-mono uppercase tracking-wider">◆ TOTAL PHASES
            </div>
            <div className="w-full bg-blue-400/20 h-1 rounded-full mt-2"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/30 to-black/80 border border-yellow-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-yellow-400/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 text-center">
            <div className="text-3xl font-bold text-yellow-400 font-mono mb-1">
              {modules.filter((m) => m.difficulty === "Beginner").length}
            </div>
            <div className="text-xs text-yellow-400/60 font-mono uppercase tracking-wider">◆ BEGINNER
            </div>
            <div className="w-full bg-yellow-400/20 h-1 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Content Display */}
      <div className="terminal-window retro-border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-cyber-green text-lg font-mono">
              ◄ ◊ ◊ ◊ LOADING MODULES ◊ ◊ ◊ ►
            </div>
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4 font-mono">
              ▲ No modules found. Create your first module to get started. ▲
            </div>
            <button onClick={() => openModal()} className="btn-primary">
              Create First Module
            </button>
          </div>
        ) : (
          renderGroupedView()
        )}
      </div>

      {/* Enhanced Module Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-blue-400/30 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-blue-400/20 relative overflow-hidden">
            {/* Modal glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 animate-pulse"></div>
            
            <div className="relative z-10 p-6">
              {/* Enhanced Modal Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-blue-400/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-400/50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-blue-400 font-mono uppercase tracking-wider">
                    {editingModule ? "◆ EDIT MODULE" : "◆ CREATE MODULE"}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-2 rounded-lg hover:bg-red-400/10"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Enhanced Module Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                      ▶ Phase *
                    </label>
                    <select
                      name="phaseId"
                      value={formData.phaseId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                      required
                    >
                      <option value="" className="bg-gray-900 text-blue-400">◆ Select Phase</option>
                      {phases.map((phase) => (
                        <option key={phase.id} value={phase.id} className="bg-gray-900 text-blue-400">
                          ▸ {phase.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                      ▶ Order *
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 placeholder-blue-400/50"
                      required
                      min="1"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                    ▶ Module Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 placeholder-blue-400/50"
                    required
                    maxLength="100"
                    placeholder="Enter module title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                    ▶ Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 placeholder-blue-400/50 resize-none"
                    required
                    maxLength="500"
                    rows="3"
                    placeholder="Enter module description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                      ▶ Icon
                    </label>
                    <select
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-900 text-blue-400">◆ Select icon</option>
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-900 text-blue-400">
                          ▸ {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                      ▶ Difficulty *
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                      required
                    >
                      <option value="" className="bg-gray-900 text-blue-400">◆ Select difficulty</option>
                      {difficultyLevels.map((level) => (
                        <option key={level} value={level} className="bg-gray-900 text-blue-400">
                          ▸ {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                      ▶ Color
                    </label>
                    <select
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-900 text-blue-400">◆ Select color</option>
                      {colorOptions.map((color) => (
                        <option key={color} value={color} className="bg-gray-900 text-blue-400">
                          ▸ {color.charAt(0).toUpperCase() + color.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                    ▶ Topics (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="topics"
                    value={formData.topics}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 placeholder-blue-400/50"
                    placeholder="Security Basics, Threat Models, Risk Assessment..."
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
                  <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                    ▶ Learning Outcomes (comma-separated)
                  </label>
                  <textarea
                    name="learningOutcomes"
                    value={formData.learningOutcomes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 placeholder-blue-400/50 resize-none"
                    rows="2"
                    placeholder="Understand security principles, Identify common threats..."
                  />
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-400/30 rounded-xl">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-400 focus:ring-blue-400/50 border-blue-400/50 rounded bg-gray-800 transition-all duration-300"
                  />
                  <label className="block text-sm text-blue-400 font-mono font-bold uppercase tracking-wider">
                    ◆ MODULE ACTIVE
                  </label>
                </div>

                {/* Enhanced Module Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-blue-400/20">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-blue-400/20 to-blue-500/20 border-2 border-blue-400/50 hover:from-blue-400/30 hover:to-blue-500/30 hover:border-blue-400/70 transition-all duration-300 text-blue-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-400/20 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                          ◊ SAVING...
                        </>
                      ) : (
                        editingModule ? "◆ UPDATE MODULE" : "◆ CREATE MODULE"
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-2 border-gray-600/50 hover:from-gray-600/50 hover:to-gray-700/50 hover:border-gray-500/50 transition-all duration-300 text-gray-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg hover:shadow-gray-400/10"
                  >
                    ◄ CANCEL
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

      {/* Bulk Operations Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-lg w-full border border-purple-600">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-400 font-mono">
                  ► BULK OPERATIONS
                </h2>
                <button
                  onClick={closeBulkModal}
                  className="text-gray-400 hover:text-red-400"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded">
                <p className="text-purple-300 text-sm font-mono">
                  ▲ Operating on {selectedModules.size} selected modules
                </p>
              </div>

              {bulkOperation === "updatePhase" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-green-400 font-mono">
                    ► Select New Phase
                  </label>
                  <select
                    value={bulkFormData.phaseId}
                    onChange={(e) => setBulkFormData(prev => ({...prev, phaseId: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-700 text-green-400 font-mono"
                    required
                  >
                    <option value="">Select Phase</option>
                    {phases.map((phase) => (
                      <option key={phase.id} value={phase.id}>
                        ▸ {phase.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {bulkOperation === "updateDifficulty" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-green-400 font-mono">
                    ► Select Difficulty Level
                  </label>
                  <select
                    value={bulkFormData.difficulty}
                    onChange={(e) => setBulkFormData(prev => ({...prev, difficulty: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-700 text-green-400 font-mono"
                    required
                  >
                    <option value="">Select Difficulty</option>
                    {difficultyLevels.map((level) => (
                      <option key={level} value={level}>
                        ▸ {level}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {bulkOperation === "updateStatus" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-green-400 font-mono">
                    ► Module Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        checked={bulkFormData.isActive === true}
                        onChange={() => setBulkFormData(prev => ({...prev, isActive: true}))}
                        className="mr-2"
                      />
                      <span className="text-green-400 font-mono">◆ Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        checked={bulkFormData.isActive === false}
                        onChange={() => setBulkFormData(prev => ({...prev, isActive: false}))}
                        className="mr-2"
                      />
                      <span className="text-red-400 font-mono">◇ Inactive</span>
                    </label>
                  </div>
                </div>
              )}

              {bulkOperation === "updateColor" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-green-400 font-mono">
                    ► Select Color Scheme
                  </label>
                  <select
                    value={bulkFormData.color}
                    onChange={(e) => setBulkFormData(prev => ({...prev, color: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-700 text-green-400 font-mono"
                    required
                  >
                    <option value="">Select Color</option>
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>
                        ▸ {color.charAt(0).toUpperCase() + color.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={closeBulkModal}
                  className="px-4 py-2 text-green-400 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 font-mono"
                  disabled={saving}
                >
                  ◄ Cancel
                </button>
                <button
                  onClick={handleBulkSubmit}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 disabled:opacity-50 font-mono"
                >
                  {saving ? "◊ Processing..." : "► Apply Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ModulesManagerEnhanced;
