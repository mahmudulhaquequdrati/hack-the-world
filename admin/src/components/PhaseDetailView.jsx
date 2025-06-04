import {
  ArrowLeftIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  DocumentIcon,
  EyeIcon,
  PencilIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  contentAPI,
  enrollmentAPI,
  modulesAPI,
  phasesAPI,
} from "../services/api";

const PhaseDetailView = () => {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrollmentStats, setEnrollmentStats] = useState({});
  const [statistics, setStatistics] = useState({
    totalModules: 0,
    totalContent: 0,
    completionRate: 0,
    averageDuration: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (phaseId) {
      fetchPhaseData();
    }
  }, [phaseId]);

  const fetchPhaseData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch phase details
      const phaseResponse = await phasesAPI.getById(phaseId);
      setPhase(phaseResponse.data);

      // Fetch modules for this phase
      const modulesResponse = await modulesAPI.getByPhase(phaseId);
      const modulesList = modulesResponse.data || [];
      setModules(modulesList);

      // Fetch enrollment statistics for all modules
      await fetchAllEnrollmentStats(modulesList);

      // Calculate statistics
      await calculateStatistics(modulesList);
    } catch (error) {
      console.error("Error fetching phase data:", error);
      setError(error.response?.data?.message || "Failed to load phase details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrollment statistics for all modules in the phase
  const fetchAllEnrollmentStats = async (modulesList) => {
    try {
      const statsPromises = modulesList.map(async (module) => {
        try {
          const response = await enrollmentAPI.getModuleStats(module.id);
          return {
            moduleId: module.id,
            stats: response.data?.stats || {},
          };
        } catch (error) {
          console.warn(`Failed to fetch stats for module ${module.id}:`, error);
          return {
            moduleId: module.id,
            stats: {},
          };
        }
      });

      const statsResults = await Promise.all(statsPromises);
      const statsMap = {};
      statsResults.forEach(({ moduleId, stats }) => {
        statsMap[moduleId] = stats;
      });
      setEnrollmentStats(statsMap);
    } catch (error) {
      console.error("Error fetching enrollment stats:", error);
    }
  };

  const calculateStatistics = async (modulesList) => {
    try {
      let totalContent = 0;
      let totalDuration = 0;
      let totalEnrollments = 0;
      let activeEnrollments = 0;

      // Calculate content statistics for each module
      for (const module of modulesList) {
        try {
          const contentResponse = await contentAPI.getByModule(module.id);
          const moduleContent = contentResponse.data || [];
          totalContent += moduleContent.length;

          // Calculate duration from content
          moduleContent.forEach((content) => {
            if (content.duration) {
              totalDuration += content.duration;
            }
          });

          // Add enrollment statistics
          const moduleStats = enrollmentStats[module.id] || {};
          totalEnrollments += moduleStats.totalEnrollments || 0;
          activeEnrollments += moduleStats.activeEnrollments || 0;
        } catch (err) {
          console.warn(`Failed to fetch content for module ${module.id}:`, err);
        }
      }

      setStatistics({
        totalModules: modulesList.length,
        totalContent,
        completionRate: 0, // This would require user progress data
        averageDuration:
          modulesList.length > 0
            ? Math.round(totalDuration / modulesList.length)
            : 0,
        totalEnrollments,
        activeEnrollments,
      });
    } catch (error) {
      console.error("Error calculating statistics:", error);
    }
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

  const getModuleProgressColor = (moduleIndex) => {
    const colors = [
      "bg-green-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
    ];
    return colors[moduleIndex % colors.length];
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
          {totalEnrollments}
        </span>

        {/* Active Badge */}
        {activeEnrollments > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
            {activeEnrollments} active
          </span>
        )}

        {/* Completed Badge */}
        {completedEnrollments > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-600 text-white">
            {completedEnrollments} done
          </span>
        )}
      </div>
    );
  };

  // Helper function to get enrollment status icon
  const getEnrollmentStatusIcon = (stats) => {
    if (!stats || stats.totalEnrollments === 0) {
      return <UsersIcon className="w-4 h-4 text-gray-400" />;
    }

    const { activeEnrollments, completedEnrollments } = stats;

    if (completedEnrollments > activeEnrollments) {
      return <CheckCircleIcon className="w-4 h-4 text-cyan-400" />;
    } else if (activeEnrollments > 0) {
      return <UsersIcon className="w-4 h-4 text-green-400" />;
    } else {
      return <UsersIcon className="w-4 h-4 text-yellow-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyber-green">Loading phase details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/phases")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">Phase Details</h1>
        </div>
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!phase) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/phases")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">Phase Details</h1>
        </div>
        <div className="text-gray-400">Phase not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/phases")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <nav className="text-sm text-gray-400 mb-1">
              <Link to="/phases" className="hover:text-green-400">
                Phases
              </Link>
              <span className="mx-2">/</span>
              <span className="text-cyber-green">{phase.title}</span>
            </nav>
            <h1 className="text-3xl font-bold text-cyber-green">
              [{phase.title.toUpperCase()}]
            </h1>
          </div>
        </div>
        <Link to={`/phases`} className="btn-secondary flex items-center">
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit Phase
        </Link>
      </div>

      {/* Phase Info Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: phase.color || "#00ff00" }}
          >
            {phase.icon || "🔒"}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-cyber-green mb-2">
              {phase.title}
            </h2>
            <p className="text-gray-300 mb-4">{phase.description}</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center text-gray-400">
                <span className="font-medium">Order:</span>
                <span className="ml-1 text-cyber-green">#{phase.order}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <span className="font-medium">Color:</span>
                <div
                  className="ml-2 w-4 h-4 rounded border border-gray-600"
                  style={{ backgroundColor: phase.color }}
                ></div>
                <span className="ml-1 text-gray-300">{phase.color}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <CubeIcon className="w-8 h-8 text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total Modules</p>
              <p className="text-2xl font-bold text-cyber-green">
                {statistics.totalModules}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <DocumentIcon className="w-8 h-8 text-green-400 mr-3" />
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
            <ClockIcon className="w-8 h-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Avg Duration</p>
              <p className="text-2xl font-bold text-cyber-green">
                {formatDuration(statistics.averageDuration)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-cyber-green">
                {statistics.completionRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <UserPlusIcon className="w-8 h-8 text-cyan-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total Enrolled</p>
              <p className="text-2xl font-bold text-cyber-green">
                {statistics.totalEnrollments}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Active Students</p>
              <p className="text-2xl font-bold text-cyber-green">
                {statistics.activeEnrollments}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-cyber-green flex items-center">
            <CubeIcon className="w-5 h-5 mr-2" />
            Modules in this Phase ({modules.length})
          </h3>
        </div>

        {modules.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            <CubeIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No modules found in this phase.</p>
            <p className="text-sm mt-2">
              <Link to="/modules" className="text-cyber-green hover:underline">
                Create a new module
              </Link>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {modules.map((module, index) => {
              const enrollStats = enrollmentStats[module.id] || {};
              return (
                <div
                  key={module.id}
                  className="px-6 py-4 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${getModuleProgressColor(
                            index
                          )}`}
                        ></div>
                        <span className="text-sm text-gray-400">
                          #{module.order}
                        </span>
                        {getEnrollmentStatusIcon(enrollStats)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-medium text-green-400">
                            {module.title}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-1 mb-2">
                          {module.description}
                        </p>

                        <div className="flex items-center space-x-4">
                          {module.difficulty && (
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                module.difficulty === "beginner"
                                  ? "bg-green-900/30 text-green-400"
                                  : module.difficulty === "intermediate"
                                  ? "bg-yellow-900/30 text-yellow-400"
                                  : module.difficulty === "advanced"
                                  ? "bg-red-900/30 text-red-400"
                                  : "bg-purple-900/30 text-purple-400"
                              }`}
                            >
                              {module.difficulty}
                            </span>
                          )}

                          {/* Enrollment Status Badges */}
                          <div className="flex items-center space-x-2">
                            {getEnrollmentStatusBadge(enrollStats)}
                          </div>
                        </div>

                        {/* Quick enrollment stats */}
                        {enrollStats.totalEnrollments > 0 && (
                          <div className="text-xs text-gray-400 mt-2">
                            Completion: {enrollStats.completionRate || 0}%
                            {enrollStats.averageProgress !== undefined && (
                              <>
                                {" "}
                                • Avg Progress: {enrollStats.averageProgress}%
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {module.estimatedHours && (
                        <div className="flex items-center text-sm text-gray-400">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {module.estimatedHours}h
                        </div>
                      )}
                      <Link
                        to={`/modules/${module.id}`}
                        className="text-gray-400 hover:text-cyber-green transition-colors"
                        title="View module details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase Metadata */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyber-green mb-4">
            Phase Metadata
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Created:</span>
              <span className="text-green-400">
                {phase.createdAt
                  ? new Date(phase.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Updated:</span>
              <span className="text-green-400">
                {phase.updatedAt
                  ? new Date(phase.updatedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Phase ID:</span>
              <span className="text-green-400 font-mono text-sm">
                {phase.id}
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
              to={`/modules?phaseId=${phaseId}`}
              className="flex items-center w-full px-4 py-2 text-left text-green-400 hover:bg-gray-700 rounded transition-colors"
            >
              <CubeIcon className="w-5 h-5 mr-3" />
              View All Modules
            </Link>
            <Link
              to={`/content?phaseId=${phaseId}`}
              className="flex items-center w-full px-4 py-2 text-left text-green-400 hover:bg-gray-700 rounded transition-colors"
            >
              <DocumentIcon className="w-5 h-5 mr-3" />
              View Phase Content
            </Link>
            <button
              onClick={() => navigate("/phases")}
              className="flex items-center w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-700 rounded transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-3" />
              Back to Phases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseDetailView;
