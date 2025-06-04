import {
  ArrowLeftIcon,
  BeakerIcon,
  BookmarkIcon,
  BookmarkSlashIcon,
  BookOpenIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  EyeIcon,
  PencilIcon,
  PuzzlePieceIcon,
  UserPlusIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  contentAPI,
  enrollmentAPI,
  modulesAPI,
  phasesAPI,
} from "../services/api";

const ModuleDetailView = () => {
  const { user } = useAuth(); // Get current user from auth context
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [phase, setPhase] = useState(null);
  const [content, setContent] = useState([]);
  const [contentGrouped, setContentGrouped] = useState({});
  const [enrollmentStats, setEnrollmentStats] = useState(null);
  const [userEnrollmentStatus, setUserEnrollmentStatus] = useState(null);
  const [statistics, setStatistics] = useState({
    totalContent: 0,
    videoCount: 0,
    labCount: 0,
    gameCount: 0,
    documentCount: 0,
    totalDuration: 0,
    avgDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (moduleId) {
      fetchModuleData();
    }
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch module details
      const moduleResponse = await modulesAPI.getById(moduleId);
      const moduleData = moduleResponse.data;
      setModule(moduleData);

      // Fetch phase details if module has a phaseId
      if (moduleData.phaseId) {
        try {
          const phaseResponse = await phasesAPI.getById(moduleData.phaseId);
          setPhase(phaseResponse.data);
        } catch (phaseError) {
          console.warn("Could not fetch phase details:", phaseError);
        }
      }

      // Fetch content for this module
      const contentResponse = await contentAPI.getByModule(moduleId);
      const contentList = contentResponse.data || [];
      setContent(contentList);

      // Fetch grouped content for better organization
      try {
        const groupedResponse = await contentAPI.getByModuleGrouped(moduleId);
        setContentGrouped(groupedResponse.data || {});
      } catch (groupedError) {
        console.warn("Could not fetch grouped content:", groupedError);
      }

      // Fetch enrollment statistics
      try {
        const enrollmentStatsResponse = await enrollmentAPI.getModuleStats(
          moduleId
        );
        setEnrollmentStats(enrollmentStatsResponse.data);
      } catch (enrollmentError) {
        console.warn("Could not fetch enrollment stats:", enrollmentError);
      }

      // Fetch current user's enrollment status for this module
      if (user?.id) {
        try {
          const userEnrollmentsResponse =
            await enrollmentAPI.getUserEnrollments();
          if (userEnrollmentsResponse.success && userEnrollmentsResponse.data) {
            const userEnrollment = userEnrollmentsResponse.data.find(
              (enrollment) => enrollment.moduleId === moduleId
            );
            setUserEnrollmentStatus(userEnrollment || null);
          }
        } catch (userEnrollmentError) {
          console.warn(
            "Could not fetch user enrollment status:",
            userEnrollmentError
          );
        }
      }

      // Calculate statistics
      calculateStatistics(contentList);
    } catch (error) {
      console.error("Error fetching module data:", error);
      setError(
        error.response?.data?.message || "Failed to load module details"
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (contentList) => {
    const stats = {
      totalContent: contentList.length,
      videoCount: 0,
      labCount: 0,
      gameCount: 0,
      documentCount: 0,
      totalDuration: 0,
      avgDuration: 0,
    };

    contentList.forEach((item) => {
      // Count by type
      switch (item.type) {
        case "video":
          stats.videoCount++;
          break;
        case "lab":
          stats.labCount++;
          break;
        case "game":
          stats.gameCount++;
          break;
        case "document":
          stats.documentCount++;
          break;
      }

      // Sum duration
      if (item.duration) {
        stats.totalDuration += item.duration;
      }
    });

    // Calculate average duration
    stats.avgDuration =
      stats.totalContent > 0
        ? Math.round(stats.totalDuration / stats.totalContent)
        : 0;

    setStatistics(stats);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: "bg-green-900/30 text-green-400 border-green-500/30",
      intermediate: "bg-yellow-900/30 text-yellow-400 border-yellow-500/30",
      advanced: "bg-red-900/30 text-red-400 border-red-500/30",
      expert: "bg-purple-900/30 text-purple-400 border-purple-500/30",
    };
    return (
      colors[difficulty] || "bg-gray-900/30 text-gray-400 border-gray-500/30"
    );
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <VideoCameraIcon className="w-5 h-5" />;
      case "lab":
        return <BeakerIcon className="w-5 h-5" />;
      case "game":
        return <PuzzlePieceIcon className="w-5 h-5" />;
      case "document":
        return <DocumentIcon className="w-5 h-5" />;
      default:
        return <BookOpenIcon className="w-5 h-5" />;
    }
  };

  const getContentTypeColor = (type) => {
    const colors = {
      video: "text-red-400",
      lab: "text-blue-400",
      game: "text-purple-400",
      document: "text-green-400",
    };
    return colors[type] || "text-gray-400";
  };

  const handleEnrollment = async () => {
    try {
      setEnrolling(true);
      setError("");
      setSuccess("");

      const response = await enrollmentAPI.create(moduleId);

      if (response.success) {
        setSuccess(`Successfully enrolled in ${module.title}`);
      } else {
        setError(response.message || "Failed to enroll in module");
      }
    } catch (error) {
      console.error("Error enrolling in module:", error);
      if (error.response?.status === 400) {
        setError("Already enrolled in this module or enrollment not available");
      } else {
        setError("Failed to enroll in module. Please try again.");
      }
    } finally {
      setEnrolling(false);
    }
  };

  // Helper function to render enrollment status badge
  const getEnrollmentStatusBadge = (stats) => {
    if (!stats || !stats.stats || stats.stats.totalEnrollments === 0) {
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
    } = stats.stats;

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

  // Helper function to render current user enrollment status
  const getCurrentUserEnrollmentBadge = () => {
    if (!userEnrollmentStatus) {
      return (
        <div className="flex items-center text-sm text-gray-500">
          <BookmarkSlashIcon className="w-4 h-4 mr-2" />
          <span>You are not enrolled in this module</span>
        </div>
      );
    }

    const statusColors = {
      active: "text-green-400 bg-green-900/20 border-green-500/30",
      completed: "text-cyan-400 bg-cyan-900/20 border-cyan-500/30",
      paused: "text-yellow-400 bg-yellow-900/20 border-yellow-500/30",
      dropped: "text-red-400 bg-red-900/20 border-red-500/30",
    };

    const colorClass =
      statusColors[userEnrollmentStatus.status] || statusColors.active;

    return (
      <div className="space-y-2">
        <div
          className={`flex items-center text-sm px-3 py-2 rounded-lg border ${colorClass}`}
        >
          <BookmarkIcon className="w-4 h-4 mr-2" />
          <span>You are {userEnrollmentStatus.status} in this module</span>
        </div>

        {userEnrollmentStatus.progress > 0 && (
          <div className="text-sm text-gray-400">
            <div className="flex items-center justify-between mb-1">
              <span>Your Progress:</span>
              <span className="font-medium text-cyber-green">
                {userEnrollmentStatus.progress}%
              </span>
            </div>
            <div className="bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${userEnrollmentStatus.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {userEnrollmentStatus.enrollmentDate && (
          <div className="text-xs text-gray-500">
            Enrolled:{" "}
            {new Date(userEnrollmentStatus.enrollmentDate).toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyber-green">Loading module details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/modules")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">
            Module Details
          </h1>
        </div>
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/modules")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">
            Module Details
          </h1>
        </div>
        <div className="text-gray-400">Module not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/modules")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <nav className="text-sm text-gray-400 mb-1">
              <Link to="/modules" className="hover:text-green-400">
                Modules
              </Link>
              {phase && (
                <>
                  <span className="mx-2">/</span>
                  <Link
                    to={`/phases/${phase.id}`}
                    className="hover:text-green-400"
                  >
                    {phase.title}
                  </Link>
                </>
              )}
              <span className="mx-2">/</span>
              <span className="text-cyber-green">{module.title}</span>
            </nav>
            <h1 className="text-3xl font-bold text-cyber-green">
              [{module.title.toUpperCase()}]
            </h1>
          </div>
        </div>
        <Link to={`/modules`} className="btn-secondary flex items-center">
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit Module
        </Link>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded flex items-center">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center">
          <ExclamationCircleIcon className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Module Info Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: module.color || "#00ff00" }}
          >
            {module.icon || "📚"}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-bold text-cyber-green">
                {module.title}
              </h2>
              {module.difficulty && (
                <span
                  className={`px-3 py-1 text-xs rounded-full border ${getDifficultyColor(
                    module.difficulty
                  )}`}
                >
                  {module.difficulty.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-gray-300 mb-4">{module.description}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center text-gray-400">
                <span className="font-medium">Order:</span>
                <span className="ml-1 text-cyber-green">#{module.order}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <span className="font-medium">Color:</span>
                <div
                  className="ml-2 w-4 h-4 rounded border border-gray-600"
                  style={{ backgroundColor: module.color }}
                ></div>
                <span className="ml-1 text-gray-300">{module.color}</span>
              </div>
              {module.estimatedHours && (
                <div className="flex items-center text-gray-400">
                  <span className="font-medium">Est. Hours:</span>
                  <span className="ml-1 text-cyber-green">
                    {module.estimatedHours}h
                  </span>
                </div>
              )}
              {phase && (
                <div className="flex items-center text-gray-400">
                  <span className="font-medium">Phase:</span>
                  <Link
                    to={`/phases/${phase.id}`}
                    className="ml-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {phase.title}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpenIcon className="w-8 h-8 text-cyan-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total Content</p>
              <p className="text-2xl font-bold text-cyber-green">
                {statistics.totalContent}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <VideoCameraIcon className="w-8 h-8 text-red-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Videos</p>
              <p className="text-2xl font-bold text-cyber-green">
                {statistics.videoCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <BeakerIcon className="w-8 h-8 text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Labs</p>
              <p className="text-2xl font-bold text-cyber-green">
                {statistics.labCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <PuzzlePieceIcon className="w-8 h-8 text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Games</p>
              <p className="text-2xl font-bold text-cyber-green">
                {statistics.gameCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <DocumentIcon className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Documents</p>
              <p className="text-2xl font-bold text-cyber-green">
                {statistics.documentCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="w-8 h-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total Duration</p>
              <p className="text-2xl font-bold text-cyber-green">
                {formatDuration(statistics.totalDuration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Statistics Section */}
      {enrollmentStats && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-cyber-green flex items-center">
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Enrollment Statistics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center">
                <UserPlusIcon className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Total Enrolled</p>
                  <p className="text-2xl font-bold text-cyber-green">
                    {enrollmentStats.stats?.totalEnrollments || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Active Students</p>
                  <p className="text-2xl font-bold text-cyber-green">
                    {enrollmentStats.stats?.activeEnrollments || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center">
                <CubeIcon className="w-8 h-8 text-cyan-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-cyber-green">
                    {enrollmentStats.stats?.completedEnrollments || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-black font-bold text-sm">%</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Completion Rate</p>
                  <p className="text-2xl font-bold text-cyber-green">
                    {enrollmentStats.stats?.completionRate || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Status Badges */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              Status Breakdown
            </h4>
            {getEnrollmentStatusBadge(enrollmentStats)}
          </div>

          {/* Progress Information */}
          {enrollmentStats.stats?.averageProgress !== undefined && (
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Average Progress</span>
                <span className="text-lg font-bold text-cyber-green">
                  {enrollmentStats.stats.averageProgress}%
                </span>
              </div>
              <div className="mt-2 bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enrollmentStats.stats.averageProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current User Enrollment Status */}
      {user && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-cyan-400 flex items-center">
              <BookmarkIcon className="w-5 h-5 mr-2" />
              My Enrollment Status
            </h3>
          </div>
          {getCurrentUserEnrollmentBadge()}
        </div>
      )}

      {/* Content List */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-cyber-green flex items-center">
            <BookOpenIcon className="w-5 h-5 mr-2" />
            Content in this Module ({content.length})
          </h3>
        </div>

        {content.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            <BookOpenIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No content found in this module.</p>
            <p className="text-sm mt-2">
              <Link to="/content" className="text-cyber-green hover:underline">
                Create new content
              </Link>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {content.map((item, index) => (
              <div
                key={item.id}
                className="px-6 py-4 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`${getContentTypeColor(item.type)}`}>
                      {getContentTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-green-400">
                          {item.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.type === "video"
                              ? "bg-red-900/30 text-red-400"
                              : item.type === "lab"
                              ? "bg-blue-900/30 text-blue-400"
                              : item.type === "game"
                              ? "bg-purple-900/30 text-purple-400"
                              : "bg-green-900/30 text-green-400"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {item.description}
                      </p>
                      {item.section && (
                        <p className="text-xs text-gray-500 mt-1">
                          Section: {item.section}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {item.duration && (
                      <div className="flex items-center text-sm text-gray-400">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {formatDuration(item.duration)}
                      </div>
                    )}
                    <Link
                      to={`/content`}
                      className="text-gray-400 hover:text-cyber-green transition-colors"
                      title="View content details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Metadata */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyber-green mb-4">
            Module Metadata
          </h3>
          <div className="space-y-3">
            {module.learningOutcomes && module.learningOutcomes.length > 0 && (
              <div>
                <span className="text-gray-400 block mb-2">
                  Learning Outcomes:
                </span>
                <ul className="space-y-1">
                  {module.learningOutcomes.map((outcome, index) => (
                    <li
                      key={index}
                      className="text-green-400 text-sm flex items-start"
                    >
                      <span className="text-cyan-400 mr-2">•</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Created:</span>
              <span className="text-green-400">
                {module.createdAt
                  ? new Date(module.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Updated:</span>
              <span className="text-green-400">
                {module.updatedAt
                  ? new Date(module.updatedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Module ID:</span>
              <span className="text-green-400 font-mono text-sm">
                {module.id}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyber-green mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to={`/content?moduleId=${moduleId}`}
              className="flex items-center w-full px-4 py-2 text-left text-green-400 hover:bg-gray-700 rounded transition-colors"
            >
              <BookOpenIcon className="w-5 h-5 mr-3" />
              View Module Content
            </Link>
            <Link
              to={`/modules/${moduleId}/progress`}
              className="flex items-center w-full px-4 py-2 text-left text-cyan-400 hover:bg-gray-700 rounded transition-colors"
            >
              <ChartBarIcon className="w-5 h-5 mr-3" />
              View Progress Details
            </Link>
            {userEnrollmentStatus ? (
              <button
                disabled
                className="flex items-center w-full px-4 py-2 text-left text-gray-400 cursor-not-allowed rounded transition-colors opacity-75"
              >
                <BookmarkIcon className="w-5 h-5 mr-3" />
                Already Enrolled in Module
              </button>
            ) : (
              <button
                onClick={handleEnrollment}
                disabled={enrolling}
                className="flex items-center w-full px-4 py-2 text-left text-purple-400 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
              >
                {enrolling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400 mr-3"></div>
                    Enrolling User...
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="w-5 h-5 mr-3" />
                    Enroll User in Module
                  </>
                )}
              </button>
            )}
            {phase && (
              <Link
                to={`/phases/${phase.id}`}
                className="flex items-center w-full px-4 py-2 text-left text-green-400 hover:bg-gray-700 rounded transition-colors"
              >
                <CubeIcon className="w-5 h-5 mr-3" />
                View Parent Phase
              </Link>
            )}
            <Link
              to="/content"
              className="flex items-center w-full px-4 py-2 text-left text-green-400 hover:bg-gray-700 rounded transition-colors"
            >
              <DocumentIcon className="w-5 h-5 mr-3" />
              Create New Content
            </Link>
            <button
              onClick={() => navigate("/modules")}
              className="flex items-center w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-700 rounded transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-3" />
              Back to Modules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailView;
