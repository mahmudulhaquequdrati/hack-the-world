import React from "react";
import { Link } from "react-router-dom";
import CircularProgress from "../ui/CircularProgress";
import StatusIndicator from "../ui/StatusIndicator";
import { formatDate } from "../utils/enrollmentUtils";
import { cardColorClasses, animationClasses } from "../constants/enrollmentConstants";

const UserCard = ({
  user,
  onUserClick,
  onUserEnrollmentsView,
  showActions = true,
  compact = false,
}) => {
  const stats = user.enrollmentStats;
  const hasActiveEnrollments = stats.activeEnrollments > 0;

  return (
    <div
      className={`bg-gray-800 rounded-lg border border-gray-700 ${cardColorClasses.green} ${animationClasses.fadeIn} ${animationClasses.scaleHover} transition-all duration-300`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.username?.charAt(0)?.toUpperCase() || "?"}
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">
                {user.username || "Unknown User"}
              </h3>
              <p className="text-gray-400 text-xs truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {stats.totalEnrollments} enrollments
                </span>
                {hasActiveEnrollments && (
                  <StatusIndicator 
                    status="active" 
                    size="xs" 
                    showLabel={false}
                    showPulse={true}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Progress Circle */}
          <div className="flex flex-col items-center gap-1">
            <CircularProgress
              percentage={stats.averageProgress || 0}
              size={compact ? 40 : 50}
              strokeWidth={4}
              showLabel={true}
              animated={hasActiveEnrollments}
            />
            <span className="text-xs text-gray-400">Avg</span>
          </div>
        </div>

        {/* Stats Grid */}
        {!compact && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{stats.activeEnrollments}</div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{stats.completedEnrollments}</div>
              <div className="text-xs text-gray-400">Done</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{stats.pausedEnrollments}</div>
              <div className="text-xs text-gray-400">Paused</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{stats.droppedEnrollments}</div>
              <div className="text-xs text-gray-400">Dropped</div>
            </div>
          </div>
        )}

        {/* Last Activity */}
        <div className="text-xs text-gray-400 mb-3">
          <span className="block">Last Activity</span>
          <span className="text-gray-300">{formatDate(stats.lastActivity)}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Overall Progress</span>
            <span className="text-xs text-green-400">{stats.averageProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${stats.averageProgress || 0}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-700">
            <button
              onClick={() => onUserClick?.(user)}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
            >
              👤 Profile
            </button>
            <button
              onClick={() => onUserEnrollmentsView?.(user)}
              className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
            >
              📚 Enrollments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;