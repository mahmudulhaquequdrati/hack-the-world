import React from "react";
import { Link } from "react-router-dom";
import CircularProgress from "../ui/CircularProgress";
import StatusIndicator from "../ui/StatusIndicator";
import { formatDate, getProgressTrend } from "../utils/enrollmentUtils";
import { cardColorClasses, animationClasses } from "../constants/enrollmentConstants";

const EnrollmentCard = ({
  enrollment,
  onProgressClick,
  onStatusChange,
  showActions = true,
  compact = false,
}) => {
  const trend = getProgressTrend(enrollment);
  const isActive = enrollment.status === "active";

  return (
    <div
      className={`bg-gray-800 rounded-lg border border-gray-700 ${cardColorClasses.cyan} ${animationClasses.fadeIn} ${animationClasses.scaleHover} transition-all duration-300`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {enrollment.userId?.username?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">
                  {enrollment.userId?.username || "Unknown User"}
                </h3>
                <p className="text-gray-400 text-xs truncate">
                  {enrollment.userId?.email}
                </p>
              </div>
            </div>

            {/* Module Info */}
            <div className="mb-2">
              <Link
                to={`/modules/${enrollment.moduleId?.id}`}
                className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors"
              >
                {enrollment.moduleId?.title || "Unknown Module"}
              </Link>
              {enrollment.moduleId?.phase && (
                <span className="text-gray-500 text-xs ml-2">
                  ({enrollment.moduleId.phase.title})
                </span>
              )}
            </div>
          </div>

          {/* Progress Circle */}
          <div className="flex flex-col items-center gap-1">
            <CircularProgress
              percentage={enrollment.progressPercentage || 0}
              size={compact ? 40 : 50}
              strokeWidth={4}
              showLabel={true}
              animated={isActive}
            />
            <StatusIndicator 
              status={enrollment.status} 
              size="xs" 
              showLabel={false}
              showPulse={isActive}
            />
          </div>
        </div>

        {/* Progress Details */}
        {!compact && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Progress</span>
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full bg-${trend.color}-600 text-white`}
                >
                  {trend.icon} {trend.text}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${enrollment.progressPercentage || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div>
            <span className="block">Enrolled</span>
            <span className="text-gray-300">{formatDate(enrollment.enrolledAt)}</span>
          </div>
          <div>
            <span className="block">Last Active</span>
            <span className="text-gray-300">
              {formatDate(enrollment.lastAccessedAt || enrollment.enrolledAt)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
            <button
              onClick={() => onProgressClick?.(enrollment)}
              className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
            >
              📊 Details
            </button>
            <select
              value={enrollment.status}
              onChange={(e) => onStatusChange?.(enrollment, e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentCard;