import React from "react";
import { Link } from "react-router-dom";
import CircularProgress from "../ui/CircularProgress";
import { formatDate, calculateCompletionRate } from "../utils/enrollmentUtils";
import { cardColorClasses, animationClasses } from "../constants/enrollmentConstants";

const ModuleCard = ({
  module,
  onModuleClick,
  onEnrollmentsView,
  showActions = true,
  compact = false,
}) => {
  const stats = module.enrollmentStats;
  const completionRate = calculateCompletionRate(module.enrollments || []);
  const hasActiveEnrollments = stats.activeEnrollments > 0;

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "text-green-400";
      case "intermediate": return "text-yellow-400";
      case "advanced": return "text-orange-400";
      case "expert": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg border border-gray-700 ${cardColorClasses.blue} ${animationClasses.fadeIn} ${animationClasses.scaleHover} transition-all duration-300`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            {/* Module Info */}
            <div className="mb-2">
              <Link
                to={`/modules/${module.id}`}
                className="text-white font-medium hover:text-cyan-300 transition-colors"
              >
                {module.title || "Unknown Module"}
              </Link>
              {module.phase && (
                <span className="text-gray-500 text-xs ml-2">
                  ({module.phase.title})
                </span>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className={getDifficultyColor(module.difficulty)}>
                {module.difficulty || "Unknown"}
              </span>
              <span>•</span>
              <span>{stats.totalEnrollments} students</span>
              {module.estimatedDuration && (
                <>
                  <span>•</span>
                  <span>{module.estimatedDuration}h</span>
                </>
              )}
            </div>
          </div>

          {/* Progress Circle */}
          <div className="flex flex-col items-center gap-1">
            <CircularProgress
              percentage={completionRate}
              size={compact ? 40 : 50}
              strokeWidth={4}
              showLabel={true}
              animated={hasActiveEnrollments}
            />
            <span className="text-xs text-gray-400">Rate</span>
          </div>
        </div>

        {/* Description */}
        {!compact && module.description && (
          <p className="text-gray-400 text-xs mb-3 line-clamp-2">
            {module.description}
          </p>
        )}

        {/* Stats Grid */}
        {!compact && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{stats.totalEnrollments}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{stats.activeEnrollments}</div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-400">{stats.completedEnrollments}</div>
              <div className="text-xs text-gray-400">Done</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{stats.averageProgress}%</div>
              <div className="text-xs text-gray-400">Avg</div>
            </div>
          </div>
        )}

        {/* Progress Bars */}
        <div className="space-y-2 mb-3">
          {/* Completion Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Completion Rate</span>
              <span className="text-xs text-blue-400">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Average Progress */}
          {!compact && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Average Progress</span>
                <span className="text-xs text-purple-400">{stats.averageProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${stats.averageProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-700">
            <button
              onClick={() => onModuleClick?.(module)}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
            >
              📚 Details
            </button>
            <button
              onClick={() => onEnrollmentsView?.(module)}
              className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
            >
              👥 Students
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;