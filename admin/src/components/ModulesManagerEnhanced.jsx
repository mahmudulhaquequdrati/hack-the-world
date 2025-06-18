import {
  BookmarkIcon,
  BookmarkSlashIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationCircleIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BookOpen, BoxSelectIcon, Layers } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getIconFromName, getIconOptions } from "../lib/iconUtils";
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
  const [selectedPhase, setSelectedPhase] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedModuleForEnroll, setSelectedModuleForEnroll] = useState(null);
  const [enrollmentStats, setEnrollmentStats] = useState({});
  const [userEnrollments, setUserEnrollments] = useState({}); // Current user's enrollments
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

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
    topics: "",
    prerequisites: "",
    learningOutcomes: "",
    isActive: true,
  });

  // Drag-and-drop state for modules
  const [draggedModule, setDraggedModule] = useState(null);
  const [dragOverModule, setDragOverModule] = useState(null);
  const [isDraggingModule, setIsDraggingModule] = useState(false);
  const [hasModuleChanges, setHasModuleChanges] = useState(false);

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

      // Auto-calculate order for new modules
      if (!editingModule) {
        // For new modules, find max order in the selected phase and add 1
        const phaseModules = modules.filter(
          (m) => m.phaseId === formData.phaseId
        );
        const maxOrder =
          phaseModules.length > 0
            ? Math.max(...phaseModules.map((m) => m.order || 0))
            : 0;
        moduleData.order = maxOrder + 1;
      } else {
        // For editing, keep existing order
        moduleData.order = editingModule.order;
      }

      // Validate required fields
      if (!moduleData.phaseId || !moduleData.title || !moduleData.description) {
        throw new Error("Phase, title, and description are required");
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

  const handleDelete = (module) => {
    setModuleToDelete(module);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!moduleToDelete) return;

    try {
      setSaving(true);
      setError("");

      console.log("Deleting module:", moduleToDelete.id);
      const response = await modulesAPI.delete(moduleToDelete.id);
      console.log("Delete response:", response);

      setSuccess("Module deleted successfully!");
      setShowDeleteModal(false);
      setModuleToDelete(null);
      await fetchData();
    } catch (error) {
      console.error("Error deleting module:", error);
      setError("Failed to delete module");
    } finally {
      setSaving(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setModuleToDelete(null);
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

  const renderGroupedView = () => (
    <div className="space-y-8">
      {modulesWithPhases.map((phase) => {
        // Get phase color for dynamic styling
        const phaseColor = phase.color || "green";
        const phaseColorClasses = {
          green: {
            container:
              "bg-gradient-to-br from-green-900/30 to-black/80 border-2 border-green-400/30 shadow-2xl shadow-green-400/10 hover:border-green-400/50",
            glow: "bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0",
            border: "border-green-400/20",
            icon: "bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-400/50 text-green-400",
            title: "text-green-400",
            badge: "bg-green-400/20 border border-green-400/50 text-green-400",
            button:
              "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-400/20",
          },
          blue: {
            container:
              "bg-gradient-to-br from-blue-900/30 to-black/80 border-2 border-blue-400/30 shadow-2xl shadow-blue-400/10 hover:border-blue-400/50",
            glow: "bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0",
            border: "border-blue-400/20",
            icon: "bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-400/50 text-blue-400",
            title: "text-blue-400",
            badge: "bg-blue-400/20 border border-blue-400/50 text-blue-400",
            button:
              "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-400/20",
          },
          red: {
            container:
              "bg-gradient-to-br from-red-900/30 to-black/80 border-2 border-red-400/30 shadow-2xl shadow-red-400/10 hover:border-red-400/50",
            glow: "bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0",
            border: "border-red-400/20",
            icon: "bg-gradient-to-br from-red-400/20 to-red-600/20 border border-red-400/50 text-red-400",
            title: "text-red-400",
            badge: "bg-red-400/20 border border-red-400/50 text-red-400",
            button:
              "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-400/20",
          },
          purple: {
            container:
              "bg-gradient-to-br from-purple-900/30 to-black/80 border-2 border-purple-400/30 shadow-2xl shadow-purple-400/10 hover:border-purple-400/50",
            glow: "bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0",
            border: "border-purple-400/20",
            icon: "bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-400/50 text-purple-400",
            title: "text-purple-400",
            badge:
              "bg-purple-400/20 border border-purple-400/50 text-purple-400",
            button:
              "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-400/20",
          },
          cyan: {
            container:
              "bg-gradient-to-br from-cyan-900/30 to-black/80 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-400/10 hover:border-cyan-400/50",
            glow: "bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0",
            border: "border-cyan-400/20",
            icon: "bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 border border-cyan-400/50 text-cyan-400",
            title: "text-cyan-400",
            badge: "bg-cyan-400/20 border border-cyan-400/50 text-cyan-400",
            button:
              "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-400/20",
          },
        };
        const colors = phaseColorClasses[phaseColor] || phaseColorClasses.green;

        return (
          <div
            key={phase.id}
            className={`${colors.container} rounded-xl p-6 relative overflow-hidden group transition-all duration-300`}
          >
            {/* Phase container glow effect */}
            <div
              className={`absolute inset-0 ${colors.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            ></div>

            <div className="relative z-10">
              <div
                className={`flex items-center justify-between mb-6 pb-4 border-b ${colors.border}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${colors.icon} flex items-center justify-center animate-pulse`}
                  >
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3
                    className={`text-xl font-bold ${colors.title} font-mono uppercase tracking-wider`}
                  >
                    ▼ {phase.title} ▼
                  </h3>
                  <div
                    className={`px-3 py-1 ${colors.badge} rounded-full text-xs font-mono font-bold`}
                  >
                    {phase.modules?.length || 0} MODULES
                  </div>
                </div>
                {phase.modules?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const phaseModuleIds = phase.modules.map((m) => m.id);
                        const allSelected = phaseModuleIds.every((id) =>
                          selectedModules.has(id)
                        );
                        const newSelected = new Set(selectedModules);

                        if (allSelected) {
                          phaseModuleIds.forEach((id) =>
                            newSelected.delete(id)
                          );
                        } else {
                          phaseModuleIds.forEach((id) => newSelected.add(id));
                        }
                        setSelectedModules(newSelected);
                      }}
                      className="text-xs px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 font-mono font-bold transition-all duration-300 shadow-lg hover:shadow-purple-400/20"
                    >
                      {phase.modules.every((m) => selectedModules.has(m.id))
                        ? "◄ DESELECT PHASE"
                        : "► SELECT PHASE"}
                    </button>
                  </div>
                )}
              </div>
              {phase.modules && phase.modules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {phase.modules
                    .sort((a, b) => a.order - b.order)
                    .map((module) => {
                      const enrollStats = enrollmentStats[module.id] || {};
                      const getDifficultyColor = (difficulty) => {
                        switch (difficulty?.toLowerCase()) {
                          case "beginner":
                            return {
                              text: "text-green-400",
                              border: "border-green-400/50",
                              bg: "bg-green-400/10",
                            };
                          case "intermediate":
                            return {
                              text: "text-yellow-400",
                              border: "border-yellow-400/50",
                              bg: "bg-yellow-400/10",
                            };
                          case "advanced":
                            return {
                              text: "text-red-400",
                              border: "border-red-400/50",
                              bg: "bg-red-400/10",
                            };
                          case "expert":
                            return {
                              text: "text-purple-400",
                              border: "border-purple-400/50",
                              bg: "bg-purple-400/10",
                            };
                          default:
                            return {
                              text: "text-gray-400",
                              border: "border-gray-400/50",
                              bg: "bg-gray-400/10",
                            };
                        }
                      };
                      const difficultyColors = getDifficultyColor(
                        module.difficulty
                      );

                      return (
                        <div
                          key={module.id}
                          draggable={true}
                          onDragStart={(e) => handleModuleDragStart(e, module)}
                          onDragEnd={handleModuleDragEnd}
                          onDragOver={handleModuleDragOver}
                          onDragEnter={(e) => handleModuleDragEnter(e, module)}
                          onDragLeave={handleModuleDragLeave}
                          onDrop={(e) => handleModuleDrop(e, module)}
                          className={`relative overflow-hidden rounded-xl border-2 p-6 group transition-all duration-300 cursor-move select-none ${
                            draggedModule?.id === module.id
                              ? "opacity-50 scale-95 rotate-1"
                              : dragOverModule?.id === module.id
                              ? "scale-110 shadow-2xl border-yellow-400 ring-4 ring-yellow-400/30"
                              : "hover:scale-105 hover:shadow-lg"
                          } ${
                            module.color === "green"
                              ? "border-green-400/30 bg-gradient-to-br from-green-900/40 to-black/80 hover:border-green-400/50 hover:shadow-green-400/30"
                              : module.color === "blue"
                              ? "border-blue-400/30 bg-gradient-to-br from-blue-900/40 to-black/80 hover:border-blue-400/50 hover:shadow-blue-400/30"
                              : module.color === "red"
                              ? "border-red-400/30 bg-gradient-to-br from-red-900/40 to-black/80 hover:border-red-400/50 hover:shadow-red-400/30"
                              : module.color === "yellow"
                              ? "border-yellow-400/30 bg-gradient-to-br from-yellow-900/40 to-black/80 hover:border-yellow-400/50 hover:shadow-yellow-400/30"
                              : module.color === "purple"
                              ? "border-purple-400/30 bg-gradient-to-br from-purple-900/40 to-black/80 hover:border-purple-400/50 hover:shadow-purple-400/30"
                              : module.color === "pink"
                              ? "border-pink-400/30 bg-gradient-to-br from-pink-900/40 to-black/80 hover:border-pink-400/50 hover:shadow-pink-400/30"
                              : module.color === "indigo"
                              ? "border-indigo-400/30 bg-gradient-to-br from-indigo-900/40 to-black/80 hover:border-indigo-400/50 hover:shadow-indigo-400/30"
                              : module.color === "cyan"
                              ? "border-cyan-400/30 bg-gradient-to-br from-cyan-900/40 to-black/80 hover:border-cyan-400/50 hover:shadow-cyan-400/30"
                              : module.color === "orange"
                              ? "border-orange-400/30 bg-gradient-to-br from-orange-900/40 to-black/80 hover:border-orange-400/50 hover:shadow-orange-400/30"
                              : module.color === "gray"
                              ? "border-gray-400/30 bg-gradient-to-br from-gray-900/40 to-black/80 hover:border-gray-400/50 hover:shadow-gray-400/30"
                              : "border-green-400/30 bg-gradient-to-br from-green-900/40 to-black/80 hover:border-green-400/50 hover:shadow-green-400/30"
                          }`}
                        >
                          {/* Module card glow effect */}
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                              module.color === "green"
                                ? "bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0"
                                : module.color === "blue"
                                ? "bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0"
                                : module.color === "red"
                                ? "bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0"
                                : module.color === "yellow"
                                ? "bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0"
                                : module.color === "purple"
                                ? "bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0"
                                : module.color === "pink"
                                ? "bg-gradient-to-r from-pink-400/0 via-pink-400/10 to-pink-400/0"
                                : module.color === "indigo"
                                ? "bg-gradient-to-r from-indigo-400/0 via-indigo-400/10 to-indigo-400/0"
                                : module.color === "cyan"
                                ? "bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0"
                                : module.color === "orange"
                                ? "bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0"
                                : module.color === "gray"
                                ? "bg-gradient-to-r from-gray-400/0 via-gray-400/10 to-gray-400/0"
                                : "bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0"
                            }`}
                          ></div>

                          {/* Status Indicators */}
                          <div className="absolute top-2 left-2 flex space-x-1">
                            <div
                              className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${
                                module.color === "green"
                                  ? "bg-green-400 shadow-green-400/50"
                                  : module.color === "blue"
                                  ? "bg-blue-400 shadow-blue-400/50"
                                  : module.color === "red"
                                  ? "bg-red-400 shadow-red-400/50"
                                  : module.color === "yellow"
                                  ? "bg-yellow-400 shadow-yellow-400/50"
                                  : module.color === "purple"
                                  ? "bg-purple-400 shadow-purple-400/50"
                                  : module.color === "pink"
                                  ? "bg-pink-400 shadow-pink-400/50"
                                  : module.color === "indigo"
                                  ? "bg-indigo-400 shadow-indigo-400/50"
                                  : module.color === "cyan"
                                  ? "bg-cyan-400 shadow-cyan-400/50"
                                  : module.color === "orange"
                                  ? "bg-orange-400 shadow-orange-400/50"
                                  : module.color === "gray"
                                  ? "bg-gray-400 shadow-gray-400/50"
                                  : "bg-green-400 shadow-green-400/50"
                              }`}
                            ></div>
                            {isDraggingModule && (
                              <div className="w-2 h-2 rounded-full animate-ping bg-yellow-400 shadow-lg shadow-yellow-400/50"></div>
                            )}
                          </div>

                          {/* Module Drag Handle Indicator */}
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="flex flex-col space-y-0.5 opacity-40 hover:opacity-80 transition-opacity duration-300">
                              <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
                              <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
                            </div>
                          </div>

                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800/50 to-black/50 border-2 shadow-lg flex items-center justify-center group-hover:animate-pulse ${
                                    module.color === "green"
                                      ? "border-green-400/30 shadow-green-400/30"
                                      : module.color === "blue"
                                      ? "border-blue-400/30 shadow-blue-400/30"
                                      : module.color === "red"
                                      ? "border-red-400/30 shadow-red-400/30"
                                      : module.color === "yellow"
                                      ? "border-yellow-400/30 shadow-yellow-400/30"
                                      : module.color === "purple"
                                      ? "border-purple-400/30 shadow-purple-400/30"
                                      : module.color === "pink"
                                      ? "border-pink-400/30 shadow-pink-400/30"
                                      : module.color === "indigo"
                                      ? "border-indigo-400/30 shadow-indigo-400/30"
                                      : module.color === "cyan"
                                      ? "border-cyan-400/30 shadow-cyan-400/30"
                                      : module.color === "orange"
                                      ? "border-orange-400/30 shadow-orange-400/30"
                                      : module.color === "gray"
                                      ? "border-gray-400/30 shadow-gray-400/30"
                                      : "border-green-400/30 shadow-green-400/30"
                                  }`}
                                >
                                  {(() => {
                                    const IconComponent = getIconFromName(
                                      module.icon
                                    );
                                    return (
                                      <IconComponent
                                        className={`w-6 h-6 ${
                                          module.color === "green"
                                            ? "text-green-400"
                                            : module.color === "blue"
                                            ? "text-blue-400"
                                            : module.color === "red"
                                            ? "text-red-400"
                                            : module.color === "yellow"
                                            ? "text-yellow-400"
                                            : module.color === "purple"
                                            ? "text-purple-400"
                                            : module.color === "pink"
                                            ? "text-pink-400"
                                            : module.color === "indigo"
                                            ? "text-indigo-400"
                                            : module.color === "cyan"
                                            ? "text-cyan-400"
                                            : module.color === "orange"
                                            ? "text-orange-400"
                                            : module.color === "gray"
                                            ? "text-gray-400"
                                            : "text-green-400"
                                        }`}
                                      />
                                    );
                                  })()}
                                </div>
                                <div className="mb-3">
                                  <h4
                                    className={`font-bold font-mono uppercase tracking-wider  transition-colors line-clamp-1 ${
                                      module.color === "green"
                                        ? "text-green-400 group-hover:text-green-300"
                                        : module.color === "blue"
                                        ? "text-blue-400 group-hover:text-blue-300"
                                        : module.color === "red"
                                        ? "text-red-400 group-hover:text-red-300"
                                        : module.color === "yellow"
                                        ? "text-yellow-400 group-hover:text-yellow-300"
                                        : module.color === "purple"
                                        ? "text-purple-400 group-hover:text-purple-300"
                                        : module.color === "pink"
                                        ? "text-pink-400 group-hover:text-pink-300"
                                        : module.color === "indigo"
                                        ? "text-indigo-400 group-hover:text-indigo-300"
                                        : module.color === "cyan"
                                        ? "text-cyan-400 group-hover:text-cyan-300"
                                        : module.color === "orange"
                                        ? "text-orange-400 group-hover:text-orange-300"
                                        : module.color === "gray"
                                        ? "text-gray-400 group-hover:text-gray-300"
                                        : "text-green-400 group-hover:text-green-300"
                                    }`}
                                  >
                                    ◆ {module.title}
                                  </h4>
                                  <div
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border inline-block ${difficultyColors.text} ${difficultyColors.bg} ${difficultyColors.border}`}
                                  >
                                    {module.difficulty}
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {/* Module Order Badge */}
                                <div className="z-10">
                                  <div
                                    className={`w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center font-mono font-bold text-sm ${
                                      module.color === "green"
                                        ? "bg-green-400/20 border-green-400 text-green-400 shadow-green-400/30"
                                        : module.color === "blue"
                                        ? "bg-blue-400/20 border-blue-400 text-blue-400 shadow-blue-400/30"
                                        : module.color === "red"
                                        ? "bg-red-400/20 border-red-400 text-red-400 shadow-red-400/30"
                                        : module.color === "yellow"
                                        ? "bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-yellow-400/30"
                                        : module.color === "purple"
                                        ? "bg-purple-400/20 border-purple-400 text-purple-400 shadow-purple-400/30"
                                        : module.color === "pink"
                                        ? "bg-pink-400/20 border-pink-400 text-pink-400 shadow-pink-400/30"
                                        : module.color === "indigo"
                                        ? "bg-indigo-400/20 border-indigo-400 text-indigo-400 shadow-indigo-400/30"
                                        : module.color === "cyan"
                                        ? "bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-cyan-400/30"
                                        : module.color === "orange"
                                        ? "bg-orange-400/20 border-orange-400 text-orange-400 shadow-orange-400/30"
                                        : module.color === "gray"
                                        ? "bg-gray-400/20 border-gray-400 text-gray-400 shadow-gray-400/30"
                                        : "bg-green-400/20 border-green-400 text-green-400 shadow-green-400/30"
                                    }`}
                                  >
                                    {module.order}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm font-mono line-clamp-2 mb-4 leading-relaxed mt-4">
                              {module.description}
                            </p>

                            {/* Enhanced Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div
                                className={`relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 transition-all duration-300 ${
                                  module.color === "green"
                                    ? "hover:border-green-400/50"
                                    : module.color === "blue"
                                    ? "hover:border-blue-400/50"
                                    : module.color === "red"
                                    ? "hover:border-red-400/50"
                                    : module.color === "yellow"
                                    ? "hover:border-yellow-400/50"
                                    : module.color === "purple"
                                    ? "hover:border-purple-400/50"
                                    : module.color === "pink"
                                    ? "hover:border-pink-400/50"
                                    : module.color === "indigo"
                                    ? "hover:border-indigo-400/50"
                                    : module.color === "cyan"
                                    ? "hover:border-cyan-400/50"
                                    : module.color === "orange"
                                    ? "hover:border-orange-400/50"
                                    : module.color === "gray"
                                    ? "hover:border-gray-400/50"
                                    : "hover:border-green-400/50"
                                }`}
                              >
                                <div className="text-center">
                                  <div
                                    className={`font-mono text-sm font-bold ${
                                      module.color === "green"
                                        ? "text-green-400"
                                        : module.color === "blue"
                                        ? "text-blue-400"
                                        : module.color === "red"
                                        ? "text-red-400"
                                        : module.color === "yellow"
                                        ? "text-yellow-400"
                                        : module.color === "purple"
                                        ? "text-purple-400"
                                        : module.color === "pink"
                                        ? "text-pink-400"
                                        : module.color === "indigo"
                                        ? "text-indigo-400"
                                        : module.color === "cyan"
                                        ? "text-cyan-400"
                                        : module.color === "orange"
                                        ? "text-orange-400"
                                        : module.color === "gray"
                                        ? "text-gray-400"
                                        : "text-green-400"
                                    }`}
                                  >
                                    {enrollStats.totalEnrollments || 0}
                                  </div>
                                  <div
                                    className={`text-xs font-mono uppercase ${
                                      module.color === "green"
                                        ? "text-green-400/60"
                                        : module.color === "blue"
                                        ? "text-blue-400/60"
                                        : module.color === "red"
                                        ? "text-red-400/60"
                                        : module.color === "yellow"
                                        ? "text-yellow-400/60"
                                        : module.color === "purple"
                                        ? "text-purple-400/60"
                                        : module.color === "pink"
                                        ? "text-pink-400/60"
                                        : module.color === "indigo"
                                        ? "text-indigo-400/60"
                                        : module.color === "cyan"
                                        ? "text-cyan-400/60"
                                        : module.color === "orange"
                                        ? "text-orange-400/60"
                                        : module.color === "gray"
                                        ? "text-gray-400/60"
                                        : "text-green-400/60"
                                    }`}
                                  >
                                    ENROLLED
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 transition-all duration-300 ${
                                  module.color === "green"
                                    ? "hover:border-green-400/50"
                                    : module.color === "blue"
                                    ? "hover:border-blue-400/50"
                                    : module.color === "red"
                                    ? "hover:border-red-400/50"
                                    : module.color === "yellow"
                                    ? "hover:border-yellow-400/50"
                                    : module.color === "purple"
                                    ? "hover:border-purple-400/50"
                                    : module.color === "pink"
                                    ? "hover:border-pink-400/50"
                                    : module.color === "indigo"
                                    ? "hover:border-indigo-400/50"
                                    : module.color === "cyan"
                                    ? "hover:border-cyan-400/50"
                                    : module.color === "orange"
                                    ? "hover:border-orange-400/50"
                                    : module.color === "gray"
                                    ? "hover:border-gray-400/50"
                                    : "hover:border-green-400/50"
                                }`}
                              >
                                <div className="text-center">
                                  <div
                                    className={`font-mono text-sm font-bold ${
                                      module.color === "green"
                                        ? "text-green-400"
                                        : module.color === "blue"
                                        ? "text-blue-400"
                                        : module.color === "red"
                                        ? "text-red-400"
                                        : module.color === "yellow"
                                        ? "text-yellow-400"
                                        : module.color === "purple"
                                        ? "text-purple-400"
                                        : module.color === "pink"
                                        ? "text-pink-400"
                                        : module.color === "indigo"
                                        ? "text-indigo-400"
                                        : module.color === "cyan"
                                        ? "text-cyan-400"
                                        : module.color === "orange"
                                        ? "text-orange-400"
                                        : module.color === "gray"
                                        ? "text-gray-400"
                                        : "text-green-400"
                                    }`}
                                  >
                                    {module.content?.videos?.length || 0}
                                  </div>
                                  <div
                                    className={`text-xs font-mono uppercase ${
                                      module.color === "green"
                                        ? "text-green-400/60"
                                        : module.color === "blue"
                                        ? "text-blue-400/60"
                                        : module.color === "red"
                                        ? "text-red-400/60"
                                        : module.color === "yellow"
                                        ? "text-yellow-400/60"
                                        : module.color === "purple"
                                        ? "text-purple-400/60"
                                        : module.color === "pink"
                                        ? "text-pink-400/60"
                                        : module.color === "indigo"
                                        ? "text-indigo-400/60"
                                        : module.color === "cyan"
                                        ? "text-cyan-400/60"
                                        : module.color === "orange"
                                        ? "text-orange-400/60"
                                        : module.color === "gray"
                                        ? "text-gray-400/60"
                                        : "text-green-400/60"
                                    }`}
                                  >
                                    VIDEOS
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Enhanced Action Buttons */}
                            <div className="flex space-x-2">
                              <Link
                                to={`/modules/${module.id}`}
                                className={`flex-1 h-10 border transition-all duration-300 rounded-lg flex items-center justify-center font-mono text-xs font-bold uppercase tracking-wider ${
                                  module.color === "green"
                                    ? "bg-green-400/10 border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 text-green-400"
                                    : module.color === "blue"
                                    ? "bg-blue-400/10 border-blue-400/30 hover:bg-blue-400/20 hover:border-blue-400/50 text-blue-400"
                                    : module.color === "red"
                                    ? "bg-red-400/10 border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 text-red-400"
                                    : module.color === "yellow"
                                    ? "bg-yellow-400/10 border-yellow-400/30 hover:bg-yellow-400/20 hover:border-yellow-400/50 text-yellow-400"
                                    : module.color === "purple"
                                    ? "bg-purple-400/10 border-purple-400/30 hover:bg-purple-400/20 hover:border-purple-400/50 text-purple-400"
                                    : module.color === "pink"
                                    ? "bg-pink-400/10 border-pink-400/30 hover:bg-pink-400/20 hover:border-pink-400/50 text-pink-400"
                                    : module.color === "indigo"
                                    ? "bg-indigo-400/10 border-indigo-400/30 hover:bg-indigo-400/20 hover:border-indigo-400/50 text-indigo-400"
                                    : module.color === "cyan"
                                    ? "bg-cyan-400/10 border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 text-cyan-400"
                                    : module.color === "orange"
                                    ? "bg-orange-400/10 border-orange-400/30 hover:bg-orange-400/20 hover:border-orange-400/50 text-orange-400"
                                    : module.color === "gray"
                                    ? "bg-gray-400/10 border-gray-400/30 hover:bg-gray-400/20 hover:border-gray-400/50 text-gray-400"
                                    : "bg-green-400/10 border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 text-green-400"
                                }`}
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
                  <p className="text-gray-400 font-mono">
                    No modules found in this phase
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Bulk operations handlers
  const handleSelectAll = () => {
    if (selectedModules.size === modules.length) {
      setSelectedModules(new Set());
    } else {
      setSelectedModules(new Set(modules.map((m) => m.id)));
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
      const updatePromises = moduleIds.map((moduleId) =>
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

  // Drag-and-drop handlers for modules within phases
  const handleModuleDragStart = (e, module) => {
    setDraggedModule(module);
    setIsDraggingModule(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);

    // Add visual feedback to dragged element
    e.target.style.opacity = "0.5";
  };

  const handleModuleDragEnd = (e) => {
    setDraggedModule(null);
    setDragOverModule(null);
    setIsDraggingModule(false);
    e.target.style.opacity = "1";
  };

  const handleModuleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleModuleDragEnter = (e, module) => {
    e.preventDefault();
    if (
      draggedModule &&
      draggedModule.id !== module.id &&
      draggedModule.phaseId === module.phaseId
    ) {
      setDragOverModule(module);
    }
  };

  const handleModuleDragLeave = (e) => {
    // Only clear dragOverModule if we're really leaving the element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverModule(null);
    }
  };

  const handleModuleDrop = (e, targetModule) => {
    e.preventDefault();

    if (
      !draggedModule ||
      draggedModule.id === targetModule.id ||
      draggedModule.phaseId !== targetModule.phaseId
    ) {
      return;
    }

    // Get modules in the same phase sorted by order
    const phaseModules =
      modulesWithPhases.find((phase) => phase.id === draggedModule.phaseId)
        ?.modules || [];

    const sortedModules = [...phaseModules].sort((a, b) => a.order - b.order);

    // Find indices
    const draggedIndex = sortedModules.findIndex(
      (m) => m.id === draggedModule.id
    );
    const targetIndex = sortedModules.findIndex(
      (m) => m.id === targetModule.id
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder modules array
    const newModules = [...sortedModules];
    const [movedModule] = newModules.splice(draggedIndex, 1);
    newModules.splice(targetIndex, 0, movedModule);

    // Recalculate orders for this phase only
    const updatedModules = newModules.map((module, index) => ({
      ...module,
      order: index + 1,
    }));

    // Update modulesWithPhases state immediately for instant UI feedback
    const updatedModulesWithPhases = modulesWithPhases.map((phase) => {
      if (phase.id === draggedModule.phaseId) {
        return {
          ...phase,
          modules: updatedModules,
        };
      }
      return phase;
    });

    setModulesWithPhases(updatedModulesWithPhases);
    setHasModuleChanges(true);
    setSuccess(
      "Module order updated! Click 'Save Module Order' to persist changes."
    );

    // Clear drag state
    setDraggedModule(null);
    setDragOverModule(null);
    setIsDraggingModule(false);
  };

  // Save reordered modules to backend
  const saveModuleOrder = async () => {
    try {
      setSaving(true);
      setError("");

      // Group modules by phase and send batch updates per phase
      const phaseUpdates = [];
      modulesWithPhases.forEach((phase) => {
        if (phase.modules && phase.modules.length > 0) {
          const moduleOrders = phase.modules.map((module) => ({
            moduleId: module.id,
            order: module.order,
          }));
          console.log(`Updating phase ${phase.id} with modules:`, moduleOrders);
          phaseUpdates.push(modulesAPI.reorder(phase.id, moduleOrders));
        }
      });

      console.log(`Sending ${phaseUpdates.length} phase updates`);
      // Send batch updates for all phases
      await Promise.all(phaseUpdates);

      setSuccess("Module order saved successfully!");
      setHasModuleChanges(false);

      // Refresh data to ensure consistency
      await fetchData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error saving module order:", error);
      setError("Failed to save module order. Please try again.");

      // Refresh to restore original order on error
      await fetchData();
      setHasModuleChanges(false);

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Reset module order changes
  const resetModuleOrder = () => {
    fetchData(); // Reload original order
    setHasModuleChanges(false);
    setSuccess("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Enhanced Terminal Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-400/50 flex items-center justify-center animate-pulse">
              <BookOpen className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold text-green-400 font-mono uppercase tracking-wider relative">
              <span className="relative z-10">MODULES_MANAGEMENT</span>
              <div className="absolute inset-0 bg-green-400/20 blur-lg rounded"></div>
            </h2>
          </div>
          <div className="bg-gradient-to-r from-black/80 via-green-900/20 to-black/80 border border-green-400/30 rounded-xl p-4 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
            <div className="relative z-10 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-green-400 font-mono text-sm ml-4">
                <span className="text-green-300">admin@hacktheworld:</span>
                <span className="text-blue-400">~/modules</span>
                <span className="text-green-400">
                  $ ./manage --advanced-operations --bulk-actions --enhanced
                </span>
                <span className="animate-ping text-green-400">█</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => openModal()}
              disabled={loading}
              className="bg-gradient-to-r from-green-400/10 to-green-500/10 border-2 border-green-400/30 hover:bg-gradient-to-r hover:from-green-400/20 hover:to-green-500/20 hover:border-green-400/50 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <PlusIcon className="w-5 h-5 mr-2 relative z-10" />
              <span className="hidden sm:inline relative z-10">
                ▶ ADD MODULE
              </span>
              <span className="sm:hidden relative z-10">+ ADD</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Phase Filter */}
            <div className="flex items-center gap-3">
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="px-4 py-2 border border-green-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-900/80 text-green-400 font-mono shadow-lg shadow-green-400/20 backdrop-blur-sm hover:shadow-green-400/30 transition-all duration-300"
              >
                <option value="">◆ All Phases</option>
                {phases.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    ▸ {phase.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Select All Button */}
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-gradient-to-r from-cyan-400/10 to-cyan-500/10 text-cyan-400 rounded-xl hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-cyan-500/20 border border-cyan-500/30 font-mono text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-400/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {selectedModules.size === modules.length
                  ? "◄ DESELECT ALL"
                  : "► SELECT ALL"}
              </span>
            </button>

            {/* Module Drag-and-Drop Order Controls */}
            {hasModuleChanges && (
              <div className="flex gap-2">
                <button
                  onClick={saveModuleOrder}
                  disabled={saving}
                  className="bg-gradient-to-r from-cyan-400/10 to-cyan-500/10 border-2 border-cyan-400/30 hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 text-cyan-400 font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-400/20 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center text-xs">
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        ◊ SAVING...
                      </>
                    ) : (
                      "◆ SAVE MODULE ORDER"
                    )}
                  </span>
                </button>
                <button
                  onClick={resetModuleOrder}
                  disabled={saving}
                  className="bg-gradient-to-r from-red-400/10 to-red-500/10 border-2 border-red-400/30 hover:bg-gradient-to-r hover:from-red-400/20 hover:to-red-500/20 hover:border-red-400/50 transition-all duration-300 text-red-400 font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-400/20 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-xs">◄ RESET</span>
                </button>
              </div>
            )}
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
                    ► {selectedModules.size} MODULE
                    {selectedModules.size !== 1 ? "S" : ""} SELECTED
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

        {/* Enhanced Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-900/30 to-black/80 border border-green-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-green-400/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 text-center">
              <div className="text-3xl font-bold text-green-400 font-mono mb-1">
                {modules.length}
              </div>
              <div className="text-xs text-green-400/60 font-mono uppercase tracking-wider">
                ◆ TOTAL MODULES
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
              <div className="text-xs text-cyan-400/60 font-mono uppercase tracking-wider">
                ◆ ACTIVE MODULES
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
              <div className="text-xs text-blue-400/60 font-mono uppercase tracking-wider">
                ◆ TOTAL PHASES
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
              <div className="text-xs text-yellow-400/60 font-mono uppercase tracking-wider">
                ◆ BEGINNER
              </div>
              <div className="w-full bg-yellow-400/20 h-1 rounded-full mt-2"></div>
            </div>
          </div>
        </div>

        {/* Module Drag-and-Drop Instructions */}
        {!loading && modulesWithPhases.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-400/30 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 animate-pulse"></div>
            <div className="relative z-10 flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <p className="text-purple-400 font-mono text-sm">
                <span className="font-bold">◆ MODULE DRAG & DROP:</span> Drag
                module cards within the same phase to reorder them, then click
                <span className="text-cyan-400 font-bold">
                  {" "}
                  ◆ SAVE MODULE ORDER{" "}
                </span>
                to persist changes
                {isDraggingModule && (
                  <span className="text-yellow-400 font-bold animate-pulse ml-2">
                    ► CURRENTLY DRAGGING MODULE...
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Content Display */}
        <div className="">
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
                        <option value="" className="bg-gray-900 text-blue-400">
                          ◆ Select Phase
                        </option>
                        {phases.map((phase) => (
                          <option
                            key={phase.id}
                            value={phase.id}
                            className="bg-gray-900 text-blue-400"
                          >
                            ▸ {phase.title}
                          </option>
                        ))}
                      </select>
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
                        <option value="" className="bg-gray-900 text-blue-400">
                          ◆ Select icon
                        </option>
                        {iconOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="bg-gray-900 text-blue-400"
                          >
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
                        <option value="" className="bg-gray-900 text-blue-400">
                          ◆ Select difficulty
                        </option>
                        {difficultyLevels.map((level) => (
                          <option
                            key={level}
                            value={level}
                            className="bg-gray-900 text-blue-400"
                          >
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
                        <option value="" className="bg-gray-900 text-blue-400">
                          ◆ Select color
                        </option>
                        {colorOptions.map((color) => (
                          <option
                            key={color}
                            value={color}
                            className="bg-gray-900 text-blue-400"
                          >
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
                        ) : editingModule ? (
                          "◆ UPDATE MODULE"
                        ) : (
                          "◆ CREATE MODULE"
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
                    This will create a new enrollment record and allow the user
                    to access the module content.
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
                      onChange={(e) =>
                        setBulkFormData((prev) => ({
                          ...prev,
                          phaseId: e.target.value,
                        }))
                      }
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
                      onChange={(e) =>
                        setBulkFormData((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
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
                          onChange={() =>
                            setBulkFormData((prev) => ({
                              ...prev,
                              isActive: true,
                            }))
                          }
                          className="mr-2"
                        />
                        <span className="text-green-400 font-mono">
                          ◆ Active
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="status"
                          checked={bulkFormData.isActive === false}
                          onChange={() =>
                            setBulkFormData((prev) => ({
                              ...prev,
                              isActive: false,
                            }))
                          }
                          className="mr-2"
                        />
                        <span className="text-red-400 font-mono">
                          ◇ Inactive
                        </span>
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
                      onChange={(e) =>
                        setBulkFormData((prev) => ({
                          ...prev,
                          color: e.target.value,
                        }))
                      }
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && moduleToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-red-400/50 rounded-xl p-6 max-w-md w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 animate-pulse"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-400/20 border border-red-400/50 flex items-center justify-center">
                    <TrashIcon className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-red-400 font-mono uppercase tracking-wider">
                    ⚠ CONFIRM DELETE
                  </h3>
                </div>

                <div className="mb-6 p-4 bg-red-900/20 border border-red-400/30 rounded-lg">
                  <p className="text-red-400 font-mono text-sm mb-2">
                    You are about to permanently delete:
                  </p>
                  <p className="text-white font-mono font-bold">
                    "{moduleToDelete.title}"
                  </p>
                  <p className="text-red-400/80 font-mono text-xs mt-2">
                    This action cannot be undone. All module data, content, and
                    enrollments will be lost.
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-700/80 text-gray-300 border border-gray-600/50 rounded-lg hover:bg-gray-600/80 font-mono transition-all duration-300"
                    disabled={saving}
                  >
                    ◄ Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={saving}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 disabled:opacity-50 font-mono font-bold transition-all duration-300 shadow-lg hover:shadow-red-400/20"
                  >
                    {saving ? "◊ Deleting..." : "⚠ DELETE FOREVER"}
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
