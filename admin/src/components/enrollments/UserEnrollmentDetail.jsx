import {
  AcademicCapIcon,
  ArrowLeftIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  PauseIcon,
  PlayIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { enrollmentAPI } from "../../services/api";
import ErrorState from "../shared/ErrorState";
import LoadingState from "../shared/LoadingState";

const UserEnrollmentDetail = ({ user, onBack }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enhancedMode, setEnhancedMode] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [expandedEnrollments, setExpandedEnrollments] = useState(new Set());

  // Fetch detailed enrollments for the user
  const fetchUserEnrollments = async (enhanced = false) => {
    try {
      setLoading(true);
      const apiCall = enhanced
        ? enrollmentAPI.getUserDetailsEnhanced(user._id, { populate: true })
        : enrollmentAPI.getUserDetails(user._id, { populate: true });

      const response = await apiCall;

      console.log("User enrollment details:", response); // Debug logging

      if (response?.success) {
        setEnrollments(response.data || []);
        setEnhancedMode(enhanced);
      } else {
        console.error("API returned success: false", response);
        setError("Failed to retrieve user enrollment details");
      }
    } catch (err) {
      console.error("Error fetching user enrollments:", err);
      setError(
        `Failed to load enrollments: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Sync progress and refresh data
  const handleSyncProgress = async () => {
    try {
      setSyncing(true);
      console.log("Syncing progress for user:", user._id);

      // Trigger progress sync - this will update backend data
      await enrollmentAPI.syncRecentProgress();

      // Refresh enrollment data
      await fetchUserEnrollments(enhancedMode);

      console.log("Progress sync completed");
    } catch (err) {
      console.error("Error syncing progress:", err);
      setError(
        `Failed to sync progress: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchUserEnrollments();
    }
  }, [user]);

  // Toggle enhanced mode
  const toggleEnhancedMode = () => {
    const newMode = !enhancedMode;
    setEnhancedMode(newMode);
    fetchUserEnrollments(newMode);
  };

  const getUserDisplayName = () => {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user.username || user.email || "Unknown User";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return {
          border: "border-green-500",
          bg: "bg-green-500/10",
          text: "text-green-400",
          badge: "bg-green-400/20 border-green-400/40",
        };
      case "completed":
        return {
          border: "border-purple-500",
          bg: "bg-purple-500/10",
          text: "text-purple-400",
          badge: "bg-purple-400/20 border-purple-400/40",
        };
      case "paused":
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-500/10",
          text: "text-yellow-400",
          badge: "bg-yellow-400/20 border-yellow-400/40",
        };
      case "dropped":
        return {
          border: "border-red-500",
          bg: "bg-red-500/10",
          text: "text-red-400",
          badge: "bg-red-400/20 border-red-400/40",
        };
      default:
        return {
          border: "border-gray-500",
          bg: "bg-gray-500/10",
          text: "text-gray-400",
          badge: "bg-gray-400/20 border-gray-400/40",
        };
    }
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
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ChartBarIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const formatTimeSpent = (minutes) => {
    if (!minutes || minutes === 0) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate estimated duration from completed content
  const getEstimatedDuration = (enrollment) => {
    if (enrollment.enhancedProgress?.detailedProgress) {
      // Sum up duration of completed content
      const completedDuration = enrollment.enhancedProgress.detailedProgress
        .filter(item => item.isCompleted)
        .reduce((total, item) => total + (item.duration || 15), 0); // Default 15 min if no duration
      return completedDuration;
    }
    
    // Fallback: estimate based on completed sections
    const completedSections = enrollment.completedSections || 0;
    return completedSections * 15; // Estimate 15 minutes per section
  };

  // Toggle enrollment expansion
  const toggleEnrollmentExpansion = (enrollmentId) => {
    setExpandedEnrollments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(enrollmentId)) {
        newSet.delete(enrollmentId);
      } else {
        newSet.add(enrollmentId);
      }
      return newSet;
    });
  };

  // Render content details
  const renderContentDetails = (enrollment) => {
    if (!enrollment.enhancedProgress?.detailedProgress) {
      return (
        <div className="text-center text-gray-400 py-4">
          <p className="text-sm font-mono">Enable Enhanced Mode to view content details</p>
        </div>
      );
    }

    const contentByType = enrollment.enhancedProgress.detailedProgress.reduce((acc, item) => {
      const type = item.type || 'document';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});

    const typeIcons = {
      video: '📹',
      lab: '🔬', 
      game: '🎮',
      document: '📄'
    };

    return (
      <div className="space-y-3">
        {Object.entries(contentByType).map(([type, items]) => (
          <div key={type} className="space-y-2">
            <h6 className="text-xs font-mono text-gray-400 uppercase flex items-center">
              <span className="mr-2">{typeIcons[type] || '📄'}</span>
              {type}s ({items.length})
            </h6>
            <div className="space-y-1">
              {items.map((item) => (
                <div 
                  key={item.contentId} 
                  className="flex items-center justify-between p-2 bg-gray-800/50 rounded text-xs font-mono"
                >
                  <div className="flex-1">
                    <div className="text-gray-300 font-medium">{item.title || 'Untitled Content'}</div>
                    {item.section && (
                      <div className="text-gray-500 text-xs">Section: {item.section}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{item.progressPercentage}%</span>
                    <span className={`px-2 py-1 rounded ${
                      item.isCompleted 
                        ? 'bg-green-500/20 text-green-400' 
                        : item.status === 'in-progress' 
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.isCompleted ? '✓' : item.status === 'in-progress' ? '◐' : '○'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render content type progress breakdown
  const renderContentTypeProgress = (contentTypeProgress) => {
    if (!contentTypeProgress) return null;

    const contentTypes = [
      { key: "video", label: "Videos", color: "blue", icon: "📹" },
      { key: "lab", label: "Labs", color: "orange", icon: "🔬" },
      { key: "game", label: "Games", color: "purple", icon: "🎮" },
      { key: "document", label: "Documents", color: "green", icon: "📄" },
    ];

    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {contentTypes.map(({ key, label, color, icon }) => {
          const progress = contentTypeProgress[key] || {
            completed: 0,
            total: 0,
          };
          const percentage =
            progress.total > 0
              ? Math.round((progress.completed / progress.total) * 100)
              : 0;

          if (progress.total === 0) return null; // Don't show if no content of this type

          return (
            <div
              key={key}
              className={`bg-${color}-500/10 border border-${color}-500/30 rounded-lg p-3`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{icon}</span>
                  <span
                    className={`text-sm font-mono text-${color}-400 uppercase`}
                  >
                    {label}
                  </span>
                </div>
                <span
                  className={`text-xs font-mono text-${color}-400 font-bold`}
                >
                  {progress.completed}/{progress.total}
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${color}-400 transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div
                className={`text-xs font-mono text-${color}-400/80 mt-1 text-center`}
              >
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <LoadingState message="Loading user enrollment details..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchUserEnrollments} />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Back Button and Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-green-400/30 hover:bg-gray-700/50 hover:border-green-400/60 text-green-400 font-mono text-sm rounded transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>BACK TO USERS</span>
            </button>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-400 font-mono uppercase tracking-wider">
                {getUserDisplayName()} - Enrollment Details
              </h2>
              <p className="text-gray-400 font-mono text-sm mt-1">
                {user.email} • {user.enrollmentSummary?.total || 0} enrollments
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Enhanced Mode Toggle */}
            <button
              onClick={toggleEnhancedMode}
              className={`flex items-center space-x-2 px-3 py-2 font-mono text-sm rounded transition-colors border ${
                enhancedMode
                  ? "bg-purple-500/20 border-purple-400/50 text-purple-400"
                  : "bg-gray-800/50 border-gray-600/50 text-gray-400 hover:border-purple-400/50 hover:text-purple-400"
              }`}
            >
              <ChartBarIcon className="w-4 h-4" />
              <span>{enhancedMode ? "Enhanced ON" : "Enhanced OFF"}</span>
            </button>

            {/* Sync Progress Button */}
            <button
              onClick={handleSyncProgress}
              disabled={syncing}
              className="flex items-center space-x-2 px-3 py-2 bg-cyan-500/20 border border-cyan-400/50 hover:bg-cyan-500/30 hover:border-cyan-400/70 text-cyan-400 font-mono text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ClockIcon
                className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}
              />
              <span>{syncing ? "Syncing..." : "Sync Progress"}</span>
            </button>
          </div>
        </div>

        {/* User Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-green-400/80 uppercase tracking-wider">
                  Active
                </p>
                <p className="text-2xl font-bold font-mono text-green-400">
                  {user.enrollmentSummary?.active || 0}
                </p>
              </div>
              <PlayIcon className="w-8 h-8 text-green-400/60" />
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-purple-400/80 uppercase tracking-wider">
                  Completed
                </p>
                <p className="text-2xl font-bold font-mono text-purple-400">
                  {user.enrollmentSummary?.completed || 0}
                </p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-purple-400/60" />
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-orange-400/80 uppercase tracking-wider">
                  Avg Progress
                </p>
                <p className="text-2xl font-bold font-mono text-orange-400">
                  {Math.round(user.enrollmentSummary?.averageProgress || 0)}%
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-orange-400/60" />
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-cyan-400/80 uppercase tracking-wider">
                  Time Spent
                </p>
                <p className="text-lg font-bold font-mono text-cyan-400">
                  {formatTimeSpent(user.enrollmentSummary?.totalTimeSpent)}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-cyan-400/60" />
            </div>
          </div>
        </div>

        {/* Enrollments List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-green-400 font-mono uppercase tracking-wider mb-4">
            Enrollment Details
          </h3>

          {enrollments.map((enrollment) => {
            const statusColors = getStatusColor(enrollment.status);
            const StatusIcon = () => getStatusIcon(enrollment.status);
            const isExpanded = expandedEnrollments.has(enrollment.id);

            return (
              <div
                key={enrollment.id}
                className={`relative overflow-hidden rounded-xl border-2 p-6 ${statusColors.border} bg-gradient-to-br from-gray-900/80 to-black/80`}
              >
                <div
                  className={`absolute inset-0 ${statusColors.bg} opacity-30`}
                ></div>

                <div className="relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Module Info */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full ${statusColors.bg} border-2 ${statusColors.border} flex items-center justify-center`}
                        >
                          <AcademicCapIcon
                            className={`w-5 h-5 ${statusColors.text}`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-bold font-mono ${statusColors.text} text-lg`}
                          >
                            {enrollment.moduleId?.title || "Unknown Module"}
                          </h4>
                          <p className="text-gray-400 font-mono text-sm mt-1">
                            {enrollment.moduleId?.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs font-mono text-orange-400">
                              Phase:{" "}
                              {enrollment.moduleId?.phaseId?.title || "Unknown"}
                            </span>
                            <span className="text-xs font-mono text-purple-400">
                              Difficulty:{" "}
                              {enrollment.moduleId?.difficulty || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center space-x-2">
                        <span
                          className={`flex items-center space-x-2 px-3 py-1 rounded text-xs font-mono uppercase border ${statusColors.badge} ${statusColors.text}`}
                        >
                          <StatusIcon />
                          <span>{enrollment.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Progress & Stats */}
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-mono text-gray-400">
                            PROGRESS
                          </span>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-sm font-mono font-bold ${statusColors.text}`}
                            >
                              {enrollment.enhancedProgress
                                ?.progressPercentage ||
                                enrollment.progressPercentage ||
                                0}
                              %
                            </span>

                            {/* Validation Indicators */}
                            {enhancedMode && enrollment.enhancedProgress && (
                              <span
                                className="text-xs text-purple-400"
                                title="Enhanced Progress Calculation"
                              >
                                ✨
                              </span>
                            )}

                            {/* Data Validation Indicators */}
                            {(() => {
                              const basicProgress =
                                enrollment.progressPercentage || 0;
                              const enhancedProgress =
                                enrollment.enhancedProgress
                                  ?.progressPercentage || basicProgress;
                              const totalSections =
                                enrollment.enhancedProgress?.totalSections ||
                                enrollment.totalSections ||
                                0;
                              const completedSections =
                                enrollment.enhancedProgress
                                  ?.completedSections ||
                                enrollment.completedSections ||
                                0;

                              // Check for inconsistencies
                              const hasInconsistency =
                                Math.abs(basicProgress - enhancedProgress) > 5;
                              const hasInvalidSections =
                                completedSections > totalSections;
                              const hasZeroSections =
                                totalSections === 0 && basicProgress > 0;

                              if (hasInconsistency) {
                                return (
                                  <span
                                    className="text-xs text-yellow-400"
                                    title={`Progress mismatch: Basic ${basicProgress}% vs Enhanced ${enhancedProgress}%`}
                                  >
                                    ⚠️
                                  </span>
                                );
                              }

                              if (hasInvalidSections) {
                                return (
                                  <span
                                    className="text-xs text-red-400"
                                    title={`Invalid: ${completedSections} completed > ${totalSections} total`}
                                  >
                                    ❌
                                  </span>
                                );
                              }

                              if (hasZeroSections) {
                                return (
                                  <span
                                    className="text-xs text-orange-400"
                                    title="Zero sections but progress > 0%"
                                  >
                                    🔄
                                  </span>
                                );
                              }

                              if (
                                enhancedMode &&
                                Math.abs(basicProgress - enhancedProgress) === 0
                              ) {
                                return (
                                  <span
                                    className="text-xs text-green-400"
                                    title="Progress data validated"
                                  >
                                    ✅
                                  </span>
                                );
                              }

                              return null;
                            })()}
                          </div>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${statusColors.text} bg-current`}
                            style={{
                              width: `${
                                enrollment.enhancedProgress
                                  ?.progressPercentage ||
                                enrollment.progressPercentage ||
                                0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-gray-800/30">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="font-mono text-sm font-bold text-cyan-400">
                              {enrollment.enhancedProgress?.completedSections ||
                                enrollment.completedSections ||
                                0}
                              /
                              {enrollment.enhancedProgress?.totalSections ||
                                enrollment.totalSections ||
                                0}
                            </span>

                            {/* Section validation indicator */}
                            {(() => {
                              const basicCompleted =
                                enrollment.completedSections || 0;
                              const basicTotal = enrollment.totalSections || 0;
                              const enhancedCompleted =
                                enrollment.enhancedProgress
                                  ?.completedSections || basicCompleted;
                              const enhancedTotal =
                                enrollment.enhancedProgress?.totalSections ||
                                basicTotal;

                              const hasSectionMismatch =
                                basicCompleted !== enhancedCompleted ||
                                basicTotal !== enhancedTotal;
                              const hasInvalidSections =
                                enhancedCompleted > enhancedTotal;

                              if (hasInvalidSections) {
                                return (
                                  <span
                                    className="text-xs text-red-400"
                                    title="Completed sections exceed total"
                                  >
                                    ❌
                                  </span>
                                );
                              }

                              if (enhancedMode && hasSectionMismatch) {
                                return (
                                  <span
                                    className="text-xs text-yellow-400"
                                    title={`Section mismatch: Basic ${basicCompleted}/${basicTotal} vs Enhanced ${enhancedCompleted}/${enhancedTotal}`}
                                  >
                                    ⚠️
                                  </span>
                                );
                              }

                              if (enhancedMode && !hasSectionMismatch) {
                                return (
                                  <span
                                    className="text-xs text-green-400"
                                    title="Section counts validated"
                                  >
                                    ✅
                                  </span>
                                );
                              }

                              return null;
                            })()}
                          </div>
                          <div className="text-xs font-mono uppercase text-gray-400">
                            Contents
                          </div>
                        </div>

                        <div className="text-center p-3 rounded-lg bg-gray-800/30">
                          <div className="font-mono text-sm font-bold text-orange-400">
                            {formatTimeSpent(getEstimatedDuration(enrollment))}
                          </div>
                          <div className="text-xs font-mono uppercase text-gray-400">
                            Completed Time
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Progress Breakdown */}
                      {enhancedMode && enrollment.enhancedProgress && (
                        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-purple-400/30">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-mono text-purple-400 uppercase flex items-center">
                              <ChartBarIcon className="w-4 h-4 mr-2" />
                              Content Type Progress
                            </h5>

                            {/* Progress Validation Status */}
                            {(() => {
                              const basicProgress =
                                enrollment.progressPercentage || 0;
                              const enhancedProgress =
                                enrollment.enhancedProgress
                                  ?.progressPercentage || basicProgress;
                              const basicCompleted =
                                enrollment.completedSections || 0;
                              const basicTotal = enrollment.totalSections || 0;
                              const enhancedCompleted =
                                enrollment.enhancedProgress
                                  ?.completedSections || basicCompleted;
                              const enhancedTotal =
                                enrollment.enhancedProgress?.totalSections ||
                                basicTotal;

                              const progressMatch =
                                Math.abs(basicProgress - enhancedProgress) <= 1;
                              const sectionsMatch =
                                basicCompleted === enhancedCompleted &&
                                basicTotal === enhancedTotal;
                              const dataValid =
                                enhancedCompleted <= enhancedTotal &&
                                enhancedTotal >= 0 &&
                                enhancedCompleted >= 0;

                              if (progressMatch && sectionsMatch && dataValid) {
                                return (
                                  <span className="text-xs font-mono px-2 py-1 bg-green-500/20 border border-green-400/40 text-green-400 rounded">
                                    VALIDATED ✅
                                  </span>
                                );
                              } else {
                                return (
                                  <span className="text-xs font-mono px-2 py-1 bg-yellow-500/20 border border-yellow-400/40 text-yellow-400 rounded">
                                    NEEDS SYNC ⚠️
                                  </span>
                                );
                              }
                            })()}
                          </div>
                          {renderContentTypeProgress(
                            enrollment.enhancedProgress.contentTypeProgress
                          )}
                        </div>
                      )}

                      {/* Validation Legend (only show when enhanced mode is on) */}
                      {enhancedMode && (
                        <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-600/30">
                          <h6 className="text-xs font-mono text-gray-400 uppercase mb-2">
                            Validation Indicators
                          </h6>
                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="flex items-center space-x-1">
                              <span>✅</span>
                              <span className="text-gray-400">Validated</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>⚠️</span>
                              <span className="text-gray-400">Mismatch</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>❌</span>
                              <span className="text-gray-400">Invalid</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>🔄</span>
                              <span className="text-gray-400">Needs Sync</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="space-y-2 text-xs font-mono text-gray-400">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>Enrolled:</span>
                          </span>
                          <span>{formatDate(enrollment.enrolledAt)}</span>
                        </div>

                        {enrollment.completedAt && (
                          <div className="flex items-center justify-between">
                            <span>Completed:</span>
                            <span className="text-purple-400">
                              {formatDate(enrollment.completedAt)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span>Last Active:</span>
                          <span className="text-green-400">
                            {formatDate(enrollment.lastAccessedAt)}
                          </span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <div className="mt-4 pt-4 border-t border-gray-600/30">
                        <button
                          onClick={() => toggleEnrollmentExpansion(enrollment.id)}
                          className="flex items-center justify-center w-full px-3 py-2 text-xs font-mono text-gray-400 hover:text-green-400 border border-gray-600/50 hover:border-green-400/50 rounded transition-colors"
                        >
                          <span className="mr-2">
                            {isExpanded ? "Hide Details" : "View Content Details"}
                          </span>
                          {isExpanded ? (
                            <ChevronUpIcon className="w-4 h-4" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Content Details (Collapsible) */}
                      {isExpanded && (
                        <div className="mt-4 p-4 bg-gray-900/80 rounded-lg border border-gray-600/30">
                          <h6 className="text-sm font-mono text-gray-300 uppercase mb-3">
                            Content Progress Details
                          </h6>
                          {renderContentDetails(enrollment)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && enrollments.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl font-mono text-gray-400 mb-2">
              No Enrollments Found
            </p>
            <p className="text-gray-500 font-mono">
              This user has not enrolled in any modules yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEnrollmentDetail;
