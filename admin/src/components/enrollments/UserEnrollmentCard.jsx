import React from "react";
import {
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const UserEnrollmentCard = ({ user, onSelect }) => {
  const { enrollmentSummary } = user;

  const getCompletionRate = () => {
    if (!enrollmentSummary.total) return 0;
    return Math.round((enrollmentSummary.completed / enrollmentSummary.total) * 100);
  };

  const getUserDisplayName = () => {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user.username || user.email || "Unknown User";
  };

  const formatTimeSpent = (minutes) => {
    if (!minutes || minutes === 0) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatLastActivity = (date) => {
    if (!date) return "Never";
    const lastActivity = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return lastActivity.toLocaleDateString();
  };

  const getStatusIcon = (status, count) => {
    if (count === 0) return null;
    
    switch (status) {
      case 'active':
        return <PlayIcon className="w-4 h-4 text-green-400" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-purple-400" />;
      case 'paused':
        return <PauseIcon className="w-4 h-4 text-yellow-400" />;
      case 'dropped':
        return <XCircleIcon className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div 
      onClick={onSelect}
      className="relative overflow-hidden rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-gray-900/80 to-black/80 p-6 group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-cyan-500/60 cursor-pointer"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        {/* User Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center">
            {user.profile?.avatar ? (
              <img
                src={user.profile.avatar}
                alt={getUserDisplayName()}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="w-6 h-6 text-cyan-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-bold font-mono text-cyan-400 text-sm truncate">
              {getUserDisplayName()}
            </h4>
            <p className="font-mono text-xs text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Enrollment Summary Stats */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400 uppercase">Total Enrollments</span>
            <span className="text-lg font-mono font-bold text-cyan-400">
              {enrollmentSummary.total}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400 uppercase">Completion Rate</span>
            <span className="text-sm font-mono font-bold text-purple-400">
              {getCompletionRate()}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400 uppercase">Avg Progress</span>
            <span className="text-sm font-mono font-bold text-green-400">
              {Math.round(enrollmentSummary.averageProgress || 0)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-400 to-purple-400 transition-all duration-300"
              style={{ width: `${Math.round(enrollmentSummary.averageProgress || 0)}%` }}
            ></div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800/30">
            {getStatusIcon('active', enrollmentSummary.active)}
            <div>
              <div className="text-xs font-mono text-green-400 font-bold">
                {enrollmentSummary.active}
              </div>
              <div className="text-xs font-mono text-gray-400 uppercase">
                Active
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800/30">
            {getStatusIcon('completed', enrollmentSummary.completed)}
            <div>
              <div className="text-xs font-mono text-purple-400 font-bold">
                {enrollmentSummary.completed}
              </div>
              <div className="text-xs font-mono text-gray-400 uppercase">
                Done
              </div>
            </div>
          </div>
        </div>

        {/* Time and Activity */}
        <div className="space-y-2 text-xs font-mono text-gray-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <ClockIcon className="w-3 h-3" />
              <span>Time Spent:</span>
            </span>
            <span className="text-orange-400">
              {formatTimeSpent(enrollmentSummary.totalTimeSpent)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Last Activity:</span>
            <span className="text-green-300">
              {formatLastActivity(enrollmentSummary.lastActivity)}
            </span>
          </div>
        </div>

        {/* Hover indicator */}
        <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            Click to view details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserEnrollmentCard;