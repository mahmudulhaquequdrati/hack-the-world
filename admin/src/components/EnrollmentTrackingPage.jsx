import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { enrollmentAPI } from "../services/api";

const EnrollmentTrackingPage = () => {
  const navigate = useNavigate();

  // State management
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filter and search state
  const [filters, setFilters] = useState({
    status: "",
    moduleId: "",
    search: "",
    page: 1,
    limit: 20,
  });

  // Additional data state
  const [modules, setModules] = useState([]);
  const [pagination, setPagination] = useState({});
  const [totalStats, setTotalStats] = useState({});

  // UI state
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // list, grid, stats, modules, analytics
  const [refreshing, setRefreshing] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedEnrollmentForProgress, setSelectedEnrollmentForProgress] =
    useState(null);

  // Enrolled modules state
  const [enrolledModules, setEnrolledModules] = useState([]);
  const [moduleFilters, setModuleFilters] = useState({
    search: "",
    phase: "",
    sortBy: "title", // title, enrollments, completion, difficulty
    sortOrder: "asc", // asc, desc
  });

  // Status options for filtering
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "paused", label: "Paused" },
    { value: "dropped", label: "Dropped" },
  ];

  // Status colors for badges
  const statusColors = {
    active: "bg-green-500 text-white",
    completed: "bg-blue-500 text-white",
    paused: "bg-yellow-500 text-black",
    dropped: "bg-red-500 text-white",
  };

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

  // Process enrollments into enrolled modules with aggregated stats
  const processEnrolledModules = (enrollmentData) => {
    // Group enrollments by moduleId
    const modulesMap = new Map();

    enrollmentData.forEach((enrollment) => {
      const moduleId = enrollment.moduleId?.id;
      if (!moduleId) return;

      if (!modulesMap.has(moduleId)) {
        modulesMap.set(moduleId, {
          module: enrollment.moduleId,
          enrollments: [],
          stats: {
            total: 0,
            active: 0,
            completed: 0,
            paused: 0,
            dropped: 0,
            averageProgress: 0,
            completionRate: 0,
            lastActivity: null,
          },
        });
      }

      const moduleData = modulesMap.get(moduleId);
      moduleData.enrollments.push(enrollment);
    });

    // Calculate statistics for each module
    const processedModules = Array.from(modulesMap.values()).map(
      (moduleData) => {
        const { enrollments, module } = moduleData;
        const total = enrollments.length;
        const active = enrollments.filter((e) => e.status === "active").length;
        const completed = enrollments.filter(
          (e) => e.status === "completed"
        ).length;
        const paused = enrollments.filter((e) => e.status === "paused").length;
        const dropped = enrollments.filter(
          (e) => e.status === "dropped"
        ).length;

        const averageProgress =
          total > 0
            ? Math.round(
                enrollments.reduce(
                  (sum, e) => sum + (e.progressPercentage || 0),
                  0
                ) / total
              )
            : 0;

        const completionRate =
          total > 0 ? Math.round((completed / total) * 100) : 0;

        // Find most recent activity
        const lastActivity = enrollments.reduce((latest, enrollment) => {
          const lastAccessed = new Date(
            enrollment.lastAccessedAt || enrollment.enrolledAt
          );
          return !latest || lastAccessed > latest ? lastAccessed : latest;
        }, null);

        return {
          module,
          enrollments,
          stats: {
            total,
            active,
            completed,
            paused,
            dropped,
            averageProgress,
            completionRate,
            lastActivity,
          },
        };
      }
    );

    setEnrolledModules(processedModules);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset page when other filters change
    }));
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  };

  // Handle enrollment status change
  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      setError("");
      setSuccess("");

      let response;
      switch (newStatus) {
        case "paused":
          response = await enrollmentAPI.pause(enrollmentId);
          break;
        case "active":
          response = await enrollmentAPI.resume(enrollmentId);
          break;
        case "completed":
          response = await enrollmentAPI.complete(enrollmentId);
          break;
        default:
          throw new Error("Invalid status change");
      }

      if (response.success) {
        setSuccess(`Enrollment status updated to ${newStatus}`);
        await fetchEnrollments(); // Refresh data
      } else {
        setError("Failed to update enrollment status");
      }
    } catch (error) {
      console.error("Error updating enrollment status:", error);
      setError("Failed to update enrollment status");
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedEnrollments.length === 0) {
      setError("Please select enrollments to perform bulk action");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const promises = selectedEnrollments.map((enrollmentId) => {
        switch (action) {
          case "pause":
            return enrollmentAPI.pause(enrollmentId);
          case "resume":
            return enrollmentAPI.resume(enrollmentId);
          case "complete":
            return enrollmentAPI.complete(enrollmentId);
          default:
            throw new Error("Invalid bulk action");
        }
      });

      await Promise.all(promises);
      setSuccess(`Bulk ${action} completed successfully`);
      setSelectedEnrollments([]);
      await fetchEnrollments();
    } catch (error) {
      console.error("Error performing bulk action:", error);
      setError(`Failed to perform bulk ${action}`);
    }
  };

  // Handle module filter changes
  const handleModuleFilterChange = (key, value) => {
    setModuleFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Filter and sort enrolled modules
  const getFilteredAndSortedModules = () => {
    let filtered = [...enrolledModules];

    // Apply search filter
    if (moduleFilters.search) {
      const searchTerm = moduleFilters.search.toLowerCase();
      filtered = filtered.filter(
        (moduleData) =>
          moduleData.module?.title?.toLowerCase().includes(searchTerm) ||
          moduleData.module?.description?.toLowerCase().includes(searchTerm) ||
          moduleData.module?.difficulty?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply phase filter
    if (moduleFilters.phase) {
      filtered = filtered.filter(
        (moduleData) => moduleData.module?.phaseId === moduleFilters.phase
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (moduleFilters.sortBy) {
        case "title":
          aValue = a.module?.title || "";
          bValue = b.module?.title || "";
          break;
        case "enrollments":
          aValue = a.stats.total;
          bValue = b.stats.total;
          break;
        case "completion":
          aValue = a.stats.completionRate;
          bValue = b.stats.completionRate;
          break;
        case "difficulty":
          const difficultyOrder = {
            Beginner: 1,
            Intermediate: 2,
            Advanced: 3,
            Expert: 4,
          };
          aValue = difficultyOrder[a.module?.difficulty] || 0;
          bValue = difficultyOrder[b.module?.difficulty] || 0;
          break;
        default:
          aValue = a.module?.title || "";
          bValue = b.module?.title || "";
      }

      if (typeof aValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return moduleFilters.sortOrder === "asc" ? comparison : -comparison;
      } else {
        const comparison = aValue - bValue;
        return moduleFilters.sortOrder === "asc" ? comparison : -comparison;
      }
    });

    return filtered;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    if (percentage >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  // Enhanced progress color with gradient support
  const getProgressGradient = (percentage) => {
    if (percentage >= 80) return "from-green-400 to-green-600";
    if (percentage >= 60) return "from-blue-400 to-blue-600";
    if (percentage >= 40) return "from-yellow-400 to-yellow-600";
    if (percentage >= 20) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  // Get progress status text
  const getProgressStatus = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Fair";
    if (percentage >= 20) return "Poor";
    return "Critical";
  };

  // Get progress icon
  const getProgressIcon = (percentage) => {
    if (percentage >= 80) return "🚀";
    if (percentage >= 60) return "📈";
    if (percentage >= 40) return "⚡";
    if (percentage >= 20) return "⚠️";
    return "🔴";
  };

  // Get detailed progress metrics
  const getProgressMetrics = (enrollment) => {
    const progress = enrollment.progressPercentage || 0;
    const completed = enrollment.completedSections || 0;
    const total = enrollment.totalSections || 0;
    const timeSpent = enrollment.timeSpent || 0;

    return {
      percentage: progress,
      completed,
      total,
      timeSpent,
      remaining: total - completed,
      estimatedCompletion:
        total > 0
          ? Math.ceil(
              (total - completed) * (timeSpent / Math.max(completed, 1))
            )
          : 0,
      velocity: completed > 0 ? timeSpent / completed : 0,
      efficiency: total > 0 ? (completed / total) * 100 : 0,
    };
  };

  // Calculate progress trend (mock implementation - in real app would compare with historical data)
  const getProgressTrend = (enrollment) => {
    const progress = enrollment.progressPercentage || 0;
    const daysSinceEnrollment = Math.floor(
      (new Date() - new Date(enrollment.enrolledAt)) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceEnrollment === 0)
      return { trend: "new", icon: "🆕", text: "New", color: "blue" };

    const expectedProgress = Math.min(daysSinceEnrollment * 5, 100); // 5% per day expected

    if (progress > expectedProgress + 10)
      return { trend: "up", icon: "📈", text: "Above Average", color: "green" };
    if (progress < expectedProgress - 10)
      return { trend: "down", icon: "📉", text: "Below Average", color: "red" };
    return { trend: "stable", icon: "➡️", text: "On Track", color: "yellow" };
  };

  // Circular progress ring component
  const CircularProgress = ({
    percentage,
    size = 60,
    strokeWidth = 6,
    showLabel = true,
    showIcon = false,
    animated = true,
    color = null,
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const progressColor =
      color ||
      (percentage >= 80
        ? "#10b981"
        : percentage >= 60
        ? "#3b82f6"
        : percentage >= 40
        ? "#f59e0b"
        : percentage >= 20
        ? "#f97316"
        : "#ef4444");

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          className={`${animated ? "animate-pulse" : ""}`}
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : circumference}
            strokeLinecap="round"
            className={animated ? "transition-all duration-1000 ease-out" : ""}
            style={{
              strokeDashoffset: animated ? offset : circumference,
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {showIcon ? (
            <span className="text-xs">{getProgressIcon(percentage)}</span>
          ) : showLabel ? (
            <span className="text-xs font-bold text-white">{percentage}%</span>
          ) : null}
        </div>
      </div>
    );
  };

  // Enhanced status indicator component
  const StatusIndicator = ({ status, showPulse = true, size = "sm" }) => {
    const sizeClasses = {
      xs: "w-2 h-2",
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const getStatusConfig = (status) => {
      switch (status) {
        case "active":
          return { color: "bg-green-500", label: "Active", icon: "▶️" };
        case "completed":
          return { color: "bg-blue-500", label: "Completed", icon: "✅" };
        case "paused":
          return { color: "bg-yellow-500", label: "Paused", icon: "⏸️" };
        case "dropped":
          return { color: "bg-red-500", label: "Dropped", icon: "❌" };
        default:
          return { color: "bg-gray-500", label: "Unknown", icon: "❓" };
      }
    };

    const config = getStatusConfig(status);

    return (
      <div className="flex items-center gap-2">
        <div
          className={`${sizeClasses[size]} ${config.color} rounded-full ${
            showPulse && status === "active" ? "animate-pulse" : ""
          }`}
        />
        <span className="text-xs text-gray-300">{config.label}</span>
      </div>
    );
  };

  // Progress details modal component
  const ProgressDetailsModal = ({ enrollment, isOpen, onClose }) => {
    if (!isOpen || !enrollment) return null;

    const metrics = getProgressMetrics(enrollment);
    const trend = getProgressTrend(enrollment);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Progress Details
              </h3>
              <p className="text-sm text-gray-400">
                {enrollment.userId?.username} - {enrollment.moduleId?.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Overall Progress */}
            <div className="flex items-center gap-6">
              <CircularProgress
                percentage={metrics.percentage}
                size={80}
                strokeWidth={8}
                showLabel={true}
                animated={true}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold text-white">
                    {metrics.percentage}% Complete
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full bg-${trend.color}-600 text-white`}
                  >
                    {trend.icon} {trend.text}
                  </span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>
                    {metrics.completed} of {metrics.total} sections completed
                  </div>
                  <div>{metrics.remaining} sections remaining</div>
                  <div>
                    Status: <StatusIndicator status={enrollment.status} />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {metrics.completed}
                </div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {metrics.remaining}
                </div>
                <div className="text-xs text-gray-400">Remaining</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(metrics.timeSpent / 60)}h
                </div>
                <div className="text-xs text-gray-400">Time Spent</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {Math.round(metrics.velocity)}m
                </div>
                <div className="text-xs text-gray-400">Avg/Section</div>
              </div>
            </div>

            {/* Progress Bar with Labels */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Progress</span>
                <span>{metrics.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 progress-bar-container">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getProgressGradient(
                    metrics.percentage
                  )} progress-bar-fill`}
                  style={{ width: `${metrics.percentage}%` }}
                >
                  <div className="progress-bar-glow"></div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Timeline</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Enrolled:</span>
                  <span className="text-white">
                    {formatDate(enrollment.enrolledAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Access:</span>
                  <span className="text-white">
                    {enrollment.lastAccessedAt
                      ? formatDate(enrollment.lastAccessedAt)
                      : "Never"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Est. Completion:</span>
                  <span className="text-white">
                    {metrics.estimatedCompletion > 0
                      ? `${metrics.estimatedCompletion} days`
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced progress bar component
  const EnhancedProgressBar = ({
    percentage,
    showLabel = true,
    showIcon = true,
    size = "md",
    animated = true,
    showTrend = false,
    enrollment = null,
    clickable = false,
    showCircular = false,
  }) => {
    const sizeClasses = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4",
      xl: "h-6",
    };

    const trend = showTrend && enrollment ? getProgressTrend(enrollment) : null;

    const handleClick = () => {
      if (clickable && enrollment) {
        setSelectedEnrollmentForProgress(enrollment);
        setProgressModalOpen(true);
      }
    };

    if (showCircular) {
      return (
        <div
          className={`flex items-center gap-3 ${
            clickable ? "cursor-pointer hover:opacity-80" : ""
          }`}
          onClick={handleClick}
        >
          <CircularProgress
            percentage={percentage}
            size={
              size === "sm" ? 40 : size === "md" ? 50 : size === "lg" ? 60 : 70
            }
            strokeWidth={size === "sm" ? 4 : 6}
            showLabel={showLabel}
            showIcon={showIcon}
            animated={animated}
          />
          {showTrend && trend && (
            <span
              className={`text-xs px-2 py-1 rounded-full bg-${trend.color}-600 text-white`}
            >
              {trend.icon} {trend.text}
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        className={`w-full ${
          clickable ? "cursor-pointer hover:opacity-80" : ""
        }`}
        onClick={handleClick}
      >
        {showLabel && (
          <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              {showIcon && <span>{getProgressIcon(percentage)}</span>}
              <span>Progress</span>
              {trend && (
                <span
                  className={`text-xs px-2 py-1 rounded-full bg-${trend.color}-600 text-white`}
                >
                  {trend.icon} {trend.text}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{percentage}%</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  percentage >= 80
                    ? "bg-green-600 text-white"
                    : percentage >= 60
                    ? "bg-blue-600 text-white"
                    : percentage >= 40
                    ? "bg-yellow-600 text-black"
                    : "bg-red-600 text-white"
                }`}
              >
                {getProgressStatus(percentage)}
              </span>
            </div>
          </div>
        )}
        <div
          className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]} relative overflow-hidden progress-bar-container`}
        >
          <div
            className={`${
              sizeClasses[size]
            } rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getProgressGradient(
              percentage
            )} progress-bar-fill ${animated ? "animate-pulse" : ""}`}
            style={{ width: `${percentage}%` }}
          >
            {size === "xl" && (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {percentage}%
              </div>
            )}
          </div>
          {animated && <div className="progress-bar-glow"></div>}
        </div>
      </div>
    );
  };

  // Enhanced statistics card component
  const StatCard = ({
    title,
    value,
    icon,
    color,
    trend,
    subtitle,
    progress,
  }) => (
    <div
      className={`bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-${color}-500/50 transition-all duration-300 transform hover:scale-105`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`text-${color}-400 text-sm font-semibold`}>{title}</div>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              trend.direction === "up"
                ? "bg-green-600 text-white"
                : trend.direction === "down"
                ? "bg-red-600 text-white"
                : "bg-gray-600 text-white"
            }`}
          >
            {trend.icon} {trend.value}
          </span>
        )}
      </div>
      {subtitle && <div className="text-xs text-gray-400 mb-2">{subtitle}</div>}
      {progress !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className={`h-1 rounded-full bg-${color}-500 transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  // Render enhanced stats cards
  const renderStatsCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <StatCard
        title="Total Enrollments"
        value={totalStats.total || 0}
        icon="👥"
        color="cyan"
        subtitle="All time"
        progress={Math.min((totalStats.total / 100) * 100, 100)}
      />
      <StatCard
        title="Active Students"
        value={totalStats.active || 0}
        icon="🟢"
        color="green"
        subtitle="Currently learning"
        progress={
          totalStats.total > 0
            ? (totalStats.active / totalStats.total) * 100
            : 0
        }
        trend={{
          direction: "up",
          icon: "📈",
          value: "+12%",
        }}
      />
      <StatCard
        title="Completed"
        value={totalStats.completed || 0}
        icon="✅"
        color="blue"
        subtitle="Finished courses"
        progress={
          totalStats.total > 0
            ? (totalStats.completed / totalStats.total) * 100
            : 0
        }
      />
      <StatCard
        title="Paused"
        value={totalStats.paused || 0}
        icon="⏸️"
        color="yellow"
        subtitle="Temporarily stopped"
        progress={
          totalStats.total > 0
            ? (totalStats.paused / totalStats.total) * 100
            : 0
        }
      />
      <StatCard
        title="Dropped"
        value={totalStats.dropped || 0}
        icon="❌"
        color="red"
        subtitle="Discontinued"
        progress={
          totalStats.total > 0
            ? (totalStats.dropped / totalStats.total) * 100
            : 0
        }
        trend={{
          direction: "down",
          icon: "📉",
          value: "-5%",
        }}
      />
      <StatCard
        title="Avg Progress"
        value={`${totalStats.averageProgress || 0}%`}
        icon="📊"
        color="purple"
        subtitle="Overall completion"
        progress={totalStats.averageProgress || 0}
      />
      <StatCard
        title="Success Rate"
        value={`${totalStats.completionRate || 0}%`}
        icon="🎯"
        color="indigo"
        subtitle="Completion ratio"
        progress={totalStats.completionRate || 0}
        trend={{
          direction: "up",
          icon: "🚀",
          value: "+8%",
        }}
      />
    </div>
  );

  // Render filters and controls
  const renderFilters = () => (
    <div className="mb-8 space-y-6">
      {/* View Mode Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-lg w-fit">
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            viewMode === "list"
              ? "bg-cyan-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          📋 Enrollments List
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            viewMode === "grid"
              ? "bg-cyan-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          📱 Enrollments Grid
        </button>
        <button
          onClick={() => setViewMode("modules")}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            viewMode === "modules"
              ? "bg-cyan-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          📚 Enrolled Modules
        </button>
        <button
          onClick={() => setViewMode("analytics")}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            viewMode === "analytics"
              ? "bg-cyan-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          📊 Analytics
        </button>
      </div>

      {/* Conditional Filters Based on View Mode */}
      {viewMode === "modules" ? (
        // Module-specific filters
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Module Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Modules
              </label>
              <input
                type="text"
                placeholder="Search by title, description..."
                value={moduleFilters.search}
                onChange={(e) =>
                  handleModuleFilterChange("search", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Phase Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phase Filter
              </label>
              <select
                value={moduleFilters.phase}
                onChange={(e) =>
                  handleModuleFilterChange("phase", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">All Phases</option>
                {/* TODO: Add phase options dynamically */}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={moduleFilters.sortBy}
                onChange={(e) =>
                  handleModuleFilterChange("sortBy", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="title">Module Title</option>
                <option value="enrollments">Total Enrollments</option>
                <option value="completion">Completion Rate</option>
                <option value="difficulty">Difficulty Level</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort Order
              </label>
              <select
                value={moduleFilters.sortOrder}
                onChange={(e) =>
                  handleModuleFilterChange("sortOrder", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        // Original enrollment filters
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status Filter
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Module Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Module Filter
              </label>
              <select
                value={filters.moduleId}
                onChange={(e) => handleFilterChange("moduleId", e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">All Modules</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Users
              </label>
              <input
                type="text"
                placeholder="Search by username or email..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={fetchEnrollments}
                disabled={refreshing}
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:text-gray-400 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {refreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Refreshing...
                  </>
                ) : (
                  <>🔄 Refresh</>
                )}
              </button>
            </div>
          </div>

          {/* Bulk Actions (only for list/grid views) */}
          {selectedEnrollments.length > 0 && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {selectedEnrollments.length} enrollment(s) selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction("pause")}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors duration-200"
                  >
                    Pause Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction("resume")}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors duration-200"
                  >
                    Resume Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction("complete")}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200"
                  >
                    Complete Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render enrollment list view
  const renderListView = () => (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedEnrollments.length === filteredEnrollments.length &&
                    filteredEnrollments.length > 0
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedEnrollments(
                        filteredEnrollments.map((e) => e.id)
                      );
                    } else {
                      setSelectedEnrollments([]);
                    }
                  }}
                  className="rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-cyan-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                Student
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                Module
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                Progress
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                Enrolled
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                Last Access
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredEnrollments.map((enrollment) => (
              <tr key={enrollment.id} className="hover:bg-gray-700/50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedEnrollments.includes(enrollment.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEnrollments((prev) => [
                          ...prev,
                          enrollment.id,
                        ]);
                      } else {
                        setSelectedEnrollments((prev) =>
                          prev.filter((id) => id !== enrollment.id)
                        );
                      }
                    }}
                    className="rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-cyan-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-white font-medium">
                      {enrollment.userId?.username || "Unknown User"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {enrollment.userId?.email || "No email"}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/modules/${enrollment.moduleId?.id}`}
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
                  >
                    {enrollment.moduleId?.title || "Unknown Module"}
                  </Link>
                  <div className="text-sm text-gray-400">
                    {enrollment.moduleId?.difficulty || "Unknown"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      statusColors[enrollment.status] ||
                      "bg-gray-500 text-white"
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-32">
                    <EnhancedProgressBar
                      percentage={enrollment.progressPercentage || 0}
                      showLabel={false}
                      showIcon={true}
                      size="sm"
                      animated={true}
                      showTrend={true}
                      enrollment={enrollment}
                      clickable={true}
                    />
                    <div className="text-xs text-gray-400 mt-1 text-center">
                      {enrollment.completedSections || 0}/
                      {enrollment.totalSections || 0} sections
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {formatDate(enrollment.enrolledAt)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {enrollment.lastAccessedAt
                    ? formatDate(enrollment.lastAccessedAt)
                    : "Never"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {enrollment.status === "active" && (
                      <button
                        onClick={() =>
                          handleStatusChange(enrollment.id, "paused")
                        }
                        className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors duration-200"
                      >
                        Pause
                      </button>
                    )}
                    {enrollment.status === "paused" && (
                      <button
                        onClick={() =>
                          handleStatusChange(enrollment.id, "active")
                        }
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors duration-200"
                      >
                        Resume
                      </button>
                    )}
                    {enrollment.status !== "completed" && (
                      <button
                        onClick={() =>
                          handleStatusChange(enrollment.id, "completed")
                        }
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEnrollments.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          {loading
            ? "Loading enrollments..."
            : "No enrollments found matching your criteria."}
        </div>
      )}
    </div>
  );

  // Render enrollment grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEnrollments.map((enrollment) => (
        <div
          key={enrollment.id}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                {enrollment.userId?.username || "Unknown User"}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                {enrollment.userId?.email || "No email"}
              </p>
              <Link
                to={`/modules/${enrollment.moduleId?.id}`}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
              >
                {enrollment.moduleId?.title || "Unknown Module"}
              </Link>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                statusColors[enrollment.status] || "bg-gray-500 text-white"
              }`}
            >
              {enrollment.status}
            </span>
          </div>

          <div className="mb-4">
            <EnhancedProgressBar
              percentage={enrollment.progressPercentage || 0}
              showLabel={true}
              showIcon={true}
              size="md"
              animated={true}
              showTrend={true}
              enrollment={enrollment}
              clickable={true}
              showCircular={false}
            />
            <div className="text-xs text-gray-400 mt-2 text-center">
              {enrollment.completedSections || 0} of{" "}
              {enrollment.totalSections || 0} sections completed
            </div>
          </div>

          <div className="text-sm text-gray-400 mb-4">
            <div>Enrolled: {formatDate(enrollment.enrolledAt)}</div>
            <div>
              Last Access:{" "}
              {enrollment.lastAccessedAt
                ? formatDate(enrollment.lastAccessedAt)
                : "Never"}
            </div>
          </div>

          <div className="flex gap-2">
            {enrollment.status === "active" && (
              <button
                onClick={() => handleStatusChange(enrollment.id, "paused")}
                className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors duration-200"
              >
                Pause
              </button>
            )}
            {enrollment.status === "paused" && (
              <button
                onClick={() => handleStatusChange(enrollment.id, "active")}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors duration-200"
              >
                Resume
              </button>
            )}
            {enrollment.status !== "completed" && (
              <button
                onClick={() => handleStatusChange(enrollment.id, "completed")}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Render enrolled modules view
  const renderModulesView = () => {
    const filteredModules = getFilteredAndSortedModules();

    if (filteredModules.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-6xl text-gray-600 mb-4">📚</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Enrolled Modules Found
          </h3>
          <p className="text-gray-400">
            {moduleFilters.search || moduleFilters.phase
              ? "No modules match your current filter criteria."
              : "No students are currently enrolled in any modules."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Summary Header */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Enrolled Modules Overview
              </h3>
              <p className="text-sm text-gray-400">
                Showing {filteredModules.length} module(s) with active
                enrollments
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">
                {filteredModules.reduce(
                  (sum, moduleData) => sum + moduleData.stats.total,
                  0
                )}
              </div>
              <div className="text-sm text-gray-400">Total Enrollments</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredModules.map((moduleData) => (
            <div
              key={moduleData.module.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-colors duration-200"
            >
              {/* Module Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/modules/${moduleData.module.id}`}
                      className="text-xl font-semibold text-white hover:text-cyan-400 transition-colors duration-200"
                    >
                      {moduleData.module.title}
                    </Link>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                        moduleData.module.difficulty
                      )}`}
                    >
                      {moduleData.module.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {moduleData.module.description}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {moduleData.stats.total}
                  </div>
                  <div className="text-xs text-gray-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {moduleData.stats.active}
                  </div>
                  <div className="text-xs text-gray-400">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {moduleData.stats.completed}
                  </div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {moduleData.stats.completionRate}%
                  </div>
                  <div className="text-xs text-gray-400">Completion</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                  <span>Average Progress</span>
                  <span>{moduleData.stats.averageProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 progress-bar-container">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getProgressGradient(
                      moduleData.stats.averageProgress
                    )} progress-bar-fill`}
                    style={{ width: `${moduleData.stats.averageProgress}%` }}
                  >
                    <div className="progress-bar-glow"></div>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="flex flex-wrap gap-2 mb-4">
                {moduleData.stats.active > 0 && (
                  <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">
                    {moduleData.stats.active} Active
                  </span>
                )}
                {moduleData.stats.completed > 0 && (
                  <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                    {moduleData.stats.completed} Completed
                  </span>
                )}
                {moduleData.stats.paused > 0 && (
                  <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">
                    {moduleData.stats.paused} Paused
                  </span>
                )}
                {moduleData.stats.dropped > 0 && (
                  <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                    {moduleData.stats.dropped} Dropped
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
                <div>
                  Last Activity:{" "}
                  {moduleData.stats.lastActivity
                    ? formatDate(moduleData.stats.lastActivity)
                    : "No activity"}
                </div>
                <Link
                  to={`/modules/${moduleData.module.id}`}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination.pages || pagination.pages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-400">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total || 0)}{" "}
          of {pagination.total || 0} enrollments
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFilterChange("page", pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors duration-200"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-white">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handleFilterChange("page", pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-600 text-white";
      case "intermediate":
        return "bg-yellow-600 text-white";
      case "advanced":
        return "bg-orange-600 text-white";
      case "expert":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  // Filter enrollments based on search
  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (!filters.search) return true;

    const searchLower = filters.search.toLowerCase();
    return (
      enrollment.userId?.username?.toLowerCase().includes(searchLower) ||
      enrollment.userId?.email?.toLowerCase().includes(searchLower) ||
      enrollment.moduleId?.title?.toLowerCase().includes(searchLower)
    );
  });

  // Enhanced progress analytics
  const getProgressAnalytics = (enrollmentData) => {
    const analytics = {
      progressDistribution: {
        excellent: enrollmentData.filter(
          (e) => (e.progressPercentage || 0) >= 90
        ).length,
        good: enrollmentData.filter(
          (e) =>
            (e.progressPercentage || 0) >= 70 &&
            (e.progressPercentage || 0) < 90
        ).length,
        average: enrollmentData.filter(
          (e) =>
            (e.progressPercentage || 0) >= 50 &&
            (e.progressPercentage || 0) < 70
        ).length,
        poor: enrollmentData.filter(
          (e) =>
            (e.progressPercentage || 0) >= 30 &&
            (e.progressPercentage || 0) < 50
        ).length,
        critical: enrollmentData.filter((e) => (e.progressPercentage || 0) < 30)
          .length,
      },
      averageProgressByStatus: {
        active: Math.round(
          enrollmentData
            .filter((e) => e.status === "active")
            .reduce((sum, e) => sum + (e.progressPercentage || 0), 0) /
            Math.max(
              enrollmentData.filter((e) => e.status === "active").length,
              1
            )
        ),
        paused: Math.round(
          enrollmentData
            .filter((e) => e.status === "paused")
            .reduce((sum, e) => sum + (e.progressPercentage || 0), 0) /
            Math.max(
              enrollmentData.filter((e) => e.status === "paused").length,
              1
            )
        ),
        completed: 100,
        dropped: Math.round(
          enrollmentData
            .filter((e) => e.status === "dropped")
            .reduce((sum, e) => sum + (e.progressPercentage || 0), 0) /
            Math.max(
              enrollmentData.filter((e) => e.status === "dropped").length,
              1
            )
        ),
      },
      progressVelocity: enrollmentData
        .map((enrollment) => {
          const daysSinceEnrollment = Math.max(
            1,
            Math.floor(
              (new Date() - new Date(enrollment.enrolledAt)) /
                (1000 * 60 * 60 * 24)
            )
          );
          return {
            enrollmentId: enrollment.id,
            velocity:
              Math.round(
                ((enrollment.progressPercentage || 0) / daysSinceEnrollment) *
                  10
              ) / 10,
            username: enrollment.userId?.username,
            moduleTitle: enrollment.moduleId?.title,
          };
        })
        .sort((a, b) => b.velocity - a.velocity),
    };
    return analytics;
  };

  // Progress comparison chart component
  const ProgressComparisonChart = ({ analytics }) => {
    const { progressDistribution } = analytics;
    const total = Object.values(progressDistribution).reduce(
      (sum, count) => sum + count,
      0
    );

    if (total === 0) return null;

    const segments = [
      {
        label: "Excellent (90-100%)",
        count: progressDistribution.excellent,
        color: "bg-green-500",
        percentage: Math.round((progressDistribution.excellent / total) * 100),
      },
      {
        label: "Good (70-89%)",
        count: progressDistribution.good,
        color: "bg-blue-500",
        percentage: Math.round((progressDistribution.good / total) * 100),
      },
      {
        label: "Average (50-69%)",
        count: progressDistribution.average,
        color: "bg-yellow-500",
        percentage: Math.round((progressDistribution.average / total) * 100),
      },
      {
        label: "Poor (30-49%)",
        count: progressDistribution.poor,
        color: "bg-orange-500",
        percentage: Math.round((progressDistribution.poor / total) * 100),
      },
      {
        label: "Critical (<30%)",
        count: progressDistribution.critical,
        color: "bg-red-500",
        percentage: Math.round((progressDistribution.critical / total) * 100),
      },
    ];

    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Progress Distribution
        </h3>

        {/* Progress Bar Chart */}
        <div className="space-y-3 mb-6">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-300 text-right">
                {segment.label.split(" ")[0]}
              </div>
              <div className="flex-1 bg-gray-700 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-6 ${segment.color} rounded-full transition-all duration-1000 ease-out flex items-center justify-center text-white text-xs font-semibold`}
                  style={{ width: `${Math.max(segment.percentage, 5)}%` }}
                >
                  {segment.percentage > 10 && `${segment.count}`}
                </div>
                {segment.percentage <= 10 && segment.count > 0 && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-300">
                    {segment.count}
                  </div>
                )}
              </div>
              <div className="w-12 text-sm text-gray-400 text-right">
                {segment.percentage}%
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {progressDistribution.excellent + progressDistribution.good}
            </div>
            <div className="text-xs text-gray-400">Performing Well</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {progressDistribution.average}
            </div>
            <div className="text-xs text-gray-400">Average Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {progressDistribution.poor + progressDistribution.critical}
            </div>
            <div className="text-xs text-gray-400">Need Attention</div>
          </div>
        </div>
      </div>
    );
  };

  // Top performers component
  const TopPerformersWidget = ({ analytics }) => {
    const topPerformers = analytics.progressVelocity.slice(0, 5);

    if (topPerformers.length === 0) return null;

    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🏆 Top Progress Velocity
        </h3>
        <div className="space-y-3">
          {topPerformers.map((performer, index) => (
            <div
              key={performer.enrollmentId}
              className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0
                    ? "bg-yellow-500 text-black"
                    : index === 1
                    ? "bg-gray-400 text-black"
                    : index === 2
                    ? "bg-orange-600 text-white"
                    : "bg-gray-600 text-white"
                }`}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">
                  {performer.username}
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {performer.moduleTitle}
                </div>
              </div>
              <div className="text-right">
                <div className="text-cyan-400 font-bold">
                  {performer.velocity}%
                </div>
                <div className="text-xs text-gray-400">per day</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Progress insights component
  const ProgressInsights = ({ analytics }) => {
    const insights = [];

    // Generate insights based on analytics
    const { progressDistribution, averageProgressByStatus } = analytics;
    const total = Object.values(progressDistribution).reduce(
      (sum, count) => sum + count,
      0
    );

    if (progressDistribution.critical > total * 0.2) {
      insights.push({
        type: "warning",
        icon: "⚠️",
        title: "High Risk Students",
        message: `${progressDistribution.critical} students have critical progress (<30%). Consider intervention.`,
        action: "Review struggling students",
      });
    }

    if (progressDistribution.excellent > total * 0.3) {
      insights.push({
        type: "success",
        icon: "🎉",
        title: "Strong Performance",
        message: `${progressDistribution.excellent} students are excelling (90%+). Great engagement!`,
        action: "Recognize top performers",
      });
    }

    if (averageProgressByStatus.paused > averageProgressByStatus.active) {
      insights.push({
        type: "info",
        icon: "📊",
        title: "Paused vs Active",
        message:
          "Paused students have higher average progress than active ones.",
        action: "Investigate pause reasons",
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: "info",
        icon: "📈",
        title: "Steady Progress",
        message: "Overall progress metrics are within normal ranges.",
        action: "Continue monitoring",
      });
    }

    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Progress Insights
        </h3>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === "warning"
                  ? "bg-red-900/20 border-red-500"
                  : insight.type === "success"
                  ? "bg-green-900/20 border-green-500"
                  : "bg-blue-900/20 border-blue-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">
                    {insight.message}
                  </p>
                  <button
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      insight.type === "warning"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : insight.type === "success"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {insight.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render analytics view
  const renderAnalyticsView = () => {
    const analytics = getProgressAnalytics(enrollments);

    return (
      <div className="space-y-6">
        {/* Analytics Header */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Progress Analytics Dashboard
              </h3>
              <p className="text-gray-400">
                Comprehensive analysis of student progress and performance
                metrics
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">
                {enrollments.length}
              </div>
              <div className="text-sm text-gray-400">Total Enrollments</div>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Distribution Chart */}
          <ProgressComparisonChart analytics={analytics} />

          {/* Top Performers */}
          <TopPerformersWidget analytics={analytics} />

          {/* Progress Insights */}
          <div className="lg:col-span-2">
            <ProgressInsights analytics={analytics} />
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Average Progress by Status"
            value=""
            icon="📊"
            color="cyan"
            subtitle="Progress comparison"
          />
          {Object.entries(analytics.averageProgressByStatus).map(
            ([status, avgProgress]) => (
              <div
                key={status}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-300 capitalize">
                    {status}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      statusColors[status] || "bg-gray-500 text-white"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {avgProgress}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressGradient(
                      avgProgress
                    )}`}
                    style={{ width: `${avgProgress}%` }}
                  />
                </div>
              </div>
            )
          )}
        </div>

        {/* Progress Velocity Insights */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Progress Velocity Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {
                  analytics.progressVelocity.filter((p) => p.velocity > 5)
                    .length
                }
              </div>
              <div className="text-sm text-gray-400">
                Fast Learners (&gt;5%/day)
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {
                  analytics.progressVelocity.filter(
                    (p) => p.velocity >= 2 && p.velocity <= 5
                  ).length
                }
              </div>
              <div className="text-sm text-gray-400">
                Steady Progress (2-5%/day)
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {
                  analytics.progressVelocity.filter((p) => p.velocity < 2)
                    .length
                }
              </div>
              <div className="text-sm text-gray-400">
                Slow Progress (&lt;2%/day)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Effects
  useEffect(() => {
    fetchEnrollments();
  }, [filters.status, filters.moduleId, filters.page, filters.limit]);

  useEffect(() => {
    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-400">Loading enrollment data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Enrollment Tracking
              </h1>
              <p className="text-gray-400">
                Monitor and manage student enrollments across all modules
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Statistics Cards */}
        {renderStatsCards()}

        {/* Filters */}
        {renderFilters()}

        {/* Enrollments List/Grid/Analytics */}
        {viewMode === "list"
          ? renderListView()
          : viewMode === "grid"
          ? renderGridView()
          : viewMode === "modules"
          ? renderModulesView()
          : renderAnalyticsView()}

        {/* Pagination - only show for list/grid views */}
        {(viewMode === "list" || viewMode === "grid") && renderPagination()}

        {/* Progress Details Modal */}
        <ProgressDetailsModal
          enrollment={selectedEnrollmentForProgress}
          isOpen={progressModalOpen}
          onClose={() => {
            setProgressModalOpen(false);
            setSelectedEnrollmentForProgress(null);
          }}
        />
      </div>
    </div>
  );
};

export default EnrollmentTrackingPage;
