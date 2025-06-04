import {
  AcademicCapIcon,
  BookmarkIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  PauseIcon,
  PlayIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { enrollmentAPI, modulesAPI } from "../services/api";

const MyEnrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [modules, setModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed, paused, dropped
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchMyEnrollments();
    }
  }, [user]);

  const fetchMyEnrollments = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch user's enrollments
      const enrollmentsResponse = await enrollmentAPI.getUserEnrollments();
      if (enrollmentsResponse.success && enrollmentsResponse.data) {
        setEnrollments(enrollmentsResponse.data);

        // Fetch module details for each enrollment
        const moduleIds = [
          ...new Set(enrollmentsResponse.data.map((e) => e.moduleId)),
        ];
        const modulePromises = moduleIds.map((moduleId) =>
          modulesAPI.getById(moduleId).catch((err) => {
            console.warn(`Failed to fetch module ${moduleId}:`, err);
            return null;
          })
        );

        const moduleResponses = await Promise.allSettled(modulePromises);
        const modulesData = {};

        moduleResponses.forEach((response, index) => {
          if (response.status === "fulfilled" && response.value?.data) {
            modulesData[moduleIds[index]] = response.value.data;
          }
        });

        setModules(modulesData);
      }
    } catch (error) {
      console.error("Error fetching my enrollments:", error);
      setError("Failed to load your enrollments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "text-green-400 bg-green-900/20 border-green-500/30",
      completed: "text-cyan-400 bg-cyan-900/20 border-cyan-500/30",
      paused: "text-yellow-400 bg-yellow-900/20 border-yellow-500/30",
      dropped: "text-red-400 bg-red-900/20 border-red-500/30",
    };
    return colors[status] || colors.active;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <PlayIcon className="w-4 h-4" />;
      case "completed":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "paused":
        return <PauseIcon className="w-4 h-4" />;
      case "dropped":
        return <XMarkIcon className="w-4 h-4" />;
      default:
        return <PlayIcon className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: "bg-green-500 text-black",
      Intermediate: "bg-yellow-500 text-black",
      Advanced: "bg-orange-500 text-black",
      Expert: "bg-red-500 text-white",
    };
    return colors[difficulty] || "bg-gray-500 text-white";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateStats = () => {
    const stats = {
      total: enrollments.length,
      active: enrollments.filter((e) => e.status === "active").length,
      completed: enrollments.filter((e) => e.status === "completed").length,
      paused: enrollments.filter((e) => e.status === "paused").length,
      dropped: enrollments.filter((e) => e.status === "dropped").length,
      averageProgress: 0,
    };

    if (stats.total > 0) {
      const totalProgress = enrollments.reduce(
        (sum, e) => sum + (e.progress || 0),
        0
      );
      stats.averageProgress = Math.round(totalProgress / stats.total);
    }

    return stats;
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (filter !== "all" && enrollment.status !== filter) return false;

    if (searchTerm) {
      const module = modules[enrollment.moduleId];
      const moduleTitle = module?.title?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      return moduleTitle.includes(search);
    }

    return true;
  });

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyber-green">Loading your enrollments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cyber-green">
            [MY ENROLLMENTS]
          </h1>
          <p className="text-green-400 mt-2">
            Track your learning progress and enrolled modules
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm text-gray-400">
            <AcademicCapIcon className="w-5 h-5 mr-2" />
            <span>Welcome, {user?.username || "Student"}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center">
          <XMarkIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <BookmarkIcon className="w-8 h-8 text-cyan-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-bold text-cyber-green">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <PlayIcon className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-cyber-green">
                {stats.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-cyan-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-cyber-green">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <PauseIcon className="w-8 h-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Paused</p>
              <p className="text-2xl font-bold text-cyber-green">
                {stats.paused}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <XMarkIcon className="w-8 h-8 text-red-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Dropped</p>
              <p className="text-2xl font-bold text-cyber-green">
                {stats.dropped}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Avg Progress</p>
              <p className="text-2xl font-bold text-cyber-green">
                {stats.averageProgress}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All", count: stats.total },
              { key: "active", label: "Active", count: stats.active },
              { key: "completed", label: "Completed", count: stats.completed },
              { key: "paused", label: "Paused", count: stats.paused },
              { key: "dropped", label: "Dropped", count: stats.dropped },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search enrollments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-green-400 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Enrollments List */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-cyber-green flex items-center">
            <BookmarkIcon className="w-5 h-5 mr-2" />
            Your Enrolled Modules ({filteredEnrollments.length})
          </h3>
        </div>

        {filteredEnrollments.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            <BookmarkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">
              {filter === "all"
                ? "No enrollments found"
                : `No ${filter} enrollments`}
            </p>
            <p className="text-sm">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start your cybersecurity journey by enrolling in modules!"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredEnrollments.map((enrollment) => {
              const module = modules[enrollment.moduleId];

              return (
                <div
                  key={enrollment.id}
                  className="px-6 py-4 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Module Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-green-400 text-lg">
                            {module?.title || `Module ${enrollment.moduleId}`}
                          </h4>

                          {/* Status Badge */}
                          <div
                            className={`flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(
                              enrollment.status
                            )}`}
                          >
                            {getStatusIcon(enrollment.status)}
                            <span className="ml-1">
                              {enrollment.status.charAt(0).toUpperCase() +
                                enrollment.status.slice(1)}
                            </span>
                          </div>

                          {/* Difficulty Badge */}
                          {module?.difficulty && (
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(
                                module.difficulty
                              )}`}
                            >
                              {module.difficulty}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {module?.description ||
                            "Module description not available"}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400">
                              Progress
                            </span>
                            <span className="text-xs font-medium text-cyber-green">
                              {enrollment.progress || 0}%
                            </span>
                          </div>
                          <div className="bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Meta Information */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            <span>
                              Enrolled: {formatDate(enrollment.enrolledAt)}
                            </span>
                          </div>
                          {enrollment.lastAccessedAt && (
                            <div className="flex items-center">
                              <ClockIcon className="w-3 h-3 mr-1" />
                              <span>
                                Last Access:{" "}
                                {formatDate(enrollment.lastAccessedAt)}
                              </span>
                            </div>
                          )}
                          {enrollment.completedSections !== undefined &&
                            enrollment.totalSections !== undefined && (
                              <div className="flex items-center">
                                <TrophyIcon className="w-3 h-3 mr-1" />
                                <span>
                                  Sections: {enrollment.completedSections}/
                                  {enrollment.totalSections}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {/* Action Button based on status */}
                      {enrollment.status === "active" && (
                        <button
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                          title="Continue Learning"
                        >
                          Continue Learning
                        </button>
                      )}
                      {enrollment.status === "completed" && (
                        <button
                          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-md transition-colors"
                          title="Review Content"
                        >
                          Review Content
                        </button>
                      )}
                      {enrollment.status === "paused" && (
                        <button
                          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-md transition-colors"
                          title="Resume Learning"
                        >
                          Resume
                        </button>
                      )}
                      {enrollment.status === "dropped" && (
                        <button
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                          title="Re-enroll in Module"
                        >
                          Re-enroll
                        </button>
                      )}

                      {/* View Module Button */}
                      {module && (
                        <Link
                          to={`/modules/${module.id}`}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
                          title="View Module Details"
                        >
                          View Module
                        </Link>
                      )}

                      {/* Progress Details Icon */}
                      <button
                        className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                        title="View Progress Details"
                      >
                        <ChartBarIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollments;
