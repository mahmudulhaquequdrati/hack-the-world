import React, { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  UserIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CalendarIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { enrollmentAPI } from "../../services/api";
import LoadingState from "../shared/LoadingState";
import ErrorState from "../shared/ErrorState";

const UserEnrollmentDetail = ({ user, onBack }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch detailed enrollments for the user
  const fetchUserEnrollments = async () => {
    try {
      setLoading(true);
      const response = await enrollmentAPI.getUserDetails(user._id, { populate: true });
      
      console.log("User enrollment details:", response); // Debug logging
      
      if (response?.success) {
        setEnrollments(response.data || []);
      } else {
        console.error("API returned success: false", response);
        setError("Failed to retrieve user enrollment details");
      }
    } catch (err) {
      console.error("Error fetching user enrollments:", err);
      setError(`Failed to load enrollments: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchUserEnrollments();
    }
  }, [user]);

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

  if (loading) {
    return <LoadingState message="Loading user enrollment details..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchUserEnrollments} />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-8">
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
            
            return (
              <div
                key={enrollment.id}
                className={`relative overflow-hidden rounded-xl border-2 p-6 ${statusColors.border} bg-gradient-to-br from-gray-900/80 to-black/80`}
              >
                <div className={`absolute inset-0 ${statusColors.bg} opacity-30`}></div>
                
                <div className="relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Module Info */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full ${statusColors.bg} border-2 ${statusColors.border} flex items-center justify-center`}>
                          <AcademicCapIcon className={`w-5 h-5 ${statusColors.text}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold font-mono ${statusColors.text} text-lg`}>
                            {enrollment.moduleId?.title || "Unknown Module"}
                          </h4>
                          <p className="text-gray-400 font-mono text-sm mt-1">
                            {enrollment.moduleId?.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs font-mono text-orange-400">
                              Phase: {enrollment.moduleId?.phaseId?.title || "Unknown"}
                            </span>
                            <span className="text-xs font-mono text-purple-400">
                              Difficulty: {enrollment.moduleId?.difficulty || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center space-x-2">
                        <span className={`flex items-center space-x-2 px-3 py-1 rounded text-xs font-mono uppercase border ${statusColors.badge} ${statusColors.text}`}>
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
                          <span className="text-xs font-mono text-gray-400">PROGRESS</span>
                          <span className={`text-sm font-mono font-bold ${statusColors.text}`}>
                            {enrollment.progressPercentage || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${statusColors.text} bg-current`}
                            style={{ width: `${enrollment.progressPercentage || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-gray-800/30">
                          <div className="font-mono text-sm font-bold text-cyan-400">
                            {enrollment.completedSections || 0}/{enrollment.totalSections || 0}
                          </div>
                          <div className="text-xs font-mono uppercase text-gray-400">
                            Sections
                          </div>
                        </div>
                        
                        <div className="text-center p-3 rounded-lg bg-gray-800/30">
                          <div className="font-mono text-sm font-bold text-orange-400">
                            {formatTimeSpent(enrollment.timeSpent)}
                          </div>
                          <div className="text-xs font-mono uppercase text-gray-400">
                            Time
                          </div>
                        </div>
                      </div>

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
                            <span className="text-purple-400">{formatDate(enrollment.completedAt)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span>Last Active:</span>
                          <span className="text-green-400">{formatDate(enrollment.lastAccessedAt)}</span>
                        </div>
                      </div>
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
            <p className="text-xl font-mono text-gray-400 mb-2">No Enrollments Found</p>
            <p className="text-gray-500 font-mono">This user has not enrolled in any modules yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEnrollmentDetail;