import React from "react";
import CircularProgress from "../ui/CircularProgress";
import StatusIndicator from "../ui/StatusIndicator";
import { 
  getProgressMetrics, 
  getProgressTrend, 
  formatDate, 
  formatDuration 
} from "../utils/enrollmentUtils";

const ProgressDetailsModal = ({ enrollment, isOpen, onClose, onStatusUpdate }) => {
  if (!isOpen || !enrollment) return null;

  const metrics = getProgressMetrics(enrollment);
  const trend = getProgressTrend(enrollment);

  const handleStatusChange = async (newStatus) => {
    if (onStatusUpdate) {
      await onStatusUpdate(enrollment, newStatus);
    }
  };

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
                <div className="flex items-center gap-2">
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
                {formatDuration(metrics.timeSpent)}
              </div>
              <div className="text-xs text-gray-400">Time Spent</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((metrics.timeSpent / (metrics.percentage || 1)) * 100) || 0}
              </div>
              <div className="text-xs text-gray-400">Min/Section</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-3">Timeline</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Enrolled:</span>
                <span className="text-white">{formatDate(enrollment.enrolledAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Activity:</span>
                <span className="text-white">
                  {formatDate(enrollment.lastAccessedAt || enrollment.enrolledAt)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Days Enrolled:</span>
                <span className="text-white">
                  {Math.ceil((new Date() - new Date(enrollment.enrolledAt)) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
            </div>
          </div>

          {/* Module Information */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-3">Module Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Title:</span>
                <span className="text-white">{enrollment.moduleId?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Phase:</span>
                <span className="text-white">{enrollment.moduleId?.phase?.title || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Difficulty:</span>
                <span className="text-white">{enrollment.moduleId?.difficulty || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Sections:</span>
                <span className="text-white">{metrics.total}</span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-3">Status Management</h4>
            <div className="flex gap-2">
              {["active", "paused", "completed", "dropped"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    enrollment.status === status
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressDetailsModal;