import React from "react";
import { Link } from "react-router-dom";
import StatusIndicator from "../ui/StatusIndicator";
import CircularProgress from "../ui/CircularProgress";
import { formatDate, getProgressTrend } from "../utils/enrollmentUtils";

const ListView = ({
  data,
  viewMode,
  onItemClick,
  onProgressClick,
  onStatusChange,
  onSort,
  sortBy,
  sortOrder,
  loading = false,
  error = null,
  emptyMessage = "No data found",
}) => {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-8 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
        <div className="text-red-400 text-lg mb-2">⚠️ Error Loading Data</div>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
        <div className="text-gray-400 text-lg mb-2">📭 {emptyMessage}</div>
        <p className="text-gray-500">Try adjusting your filters or refresh the page.</p>
      </div>
    );
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const handleSort = (column) => {
    const newOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    onSort?.(column, newOrder);
  };

  const renderHeader = () => {
    switch (viewMode) {
      case "users":
        return (
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-300">
            <div className="col-span-4">
              <button
                onClick={() => handleSort("username")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                User {getSortIcon("username")}
              </button>
            </div>
            <div className="col-span-2 text-center">
              <button
                onClick={() => handleSort("totalEnrollments")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Enrollments {getSortIcon("totalEnrollments")}
              </button>
            </div>
            <div className="col-span-2 text-center">
              <button
                onClick={() => handleSort("averageProgress")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Progress {getSortIcon("averageProgress")}
              </button>
            </div>
            <div className="col-span-2 text-center">
              <button
                onClick={() => handleSort("lastActivity")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Last Active {getSortIcon("lastActivity")}
              </button>
            </div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
        );
      case "modules":
        return (
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-300">
            <div className="col-span-4">
              <button
                onClick={() => handleSort("title")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Module {getSortIcon("title")}
              </button>
            </div>
            <div className="col-span-2 text-center">
              <button
                onClick={() => handleSort("totalEnrollments")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Students {getSortIcon("totalEnrollments")}
              </button>
            </div>
            <div className="col-span-2 text-center">
              <button
                onClick={() => handleSort("completionRate")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Completion {getSortIcon("completionRate")}
              </button>
            </div>
            <div className="col-span-2 text-center">
              <button
                onClick={() => handleSort("difficulty")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Difficulty {getSortIcon("difficulty")}
              </button>
            </div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
        );
      default: // enrollments
        return (
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-300">
            <div className="col-span-3">
              <button
                onClick={() => handleSort("username")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Student {getSortIcon("username")}
              </button>
            </div>
            <div className="col-span-3">
              <button
                onClick={() => handleSort("module")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Module {getSortIcon("module")}
              </button>
            </div>
            <div className="col-span-2 text-center">
              <button
                onClick={() => handleSort("progress")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Progress {getSortIcon("progress")}
              </button>
            </div>
            <div className="col-span-2 text-center">
              <button
                onClick={() => handleSort("status")}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                Status {getSortIcon("status")}
              </button>
            </div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
        );
    }
  };

  const renderRow = (item, index) => {
    switch (viewMode) {
      case "users":
        const userStats = item.enrollmentStats;
        return (
          <div
            key={item.id || index}
            className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-750 transition-colors"
          >
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {item.username?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <div className="text-white font-medium">{item.username}</div>
                <div className="text-gray-400 text-xs">{item.email}</div>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <div className="text-white font-medium">{userStats.totalEnrollments}</div>
              <div className="text-gray-400 text-xs">
                {userStats.activeEnrollments} active
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <CircularProgress
                percentage={userStats.averageProgress}
                size={32}
                strokeWidth={3}
                showLabel={false}
              />
              <span className="ml-2 text-white text-sm">{userStats.averageProgress}%</span>
            </div>
            <div className="col-span-2 text-center">
              <div className="text-white text-sm">
                {formatDate(userStats.lastActivity)}
              </div>
            </div>
            <div className="col-span-2 flex justify-center gap-1">
              <button
                onClick={() => onItemClick?.(item)}
                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
              >
                View
              </button>
            </div>
          </div>
        );

      case "modules":
        const moduleStats = item.enrollmentStats;
        return (
          <div
            key={item.id || index}
            className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-750 transition-colors"
          >
            <div className="col-span-4">
              <div className="text-white font-medium">{item.title}</div>
              <div className="text-gray-400 text-xs">
                {item.phase?.title || "No Phase"}
              </div>
            </div>
            <div className="col-span-2 text-center">
              <div className="text-white font-medium">{moduleStats.totalEnrollments}</div>
              <div className="text-gray-400 text-xs">
                {moduleStats.activeEnrollments} active
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <CircularProgress
                percentage={moduleStats.completionRate}
                size={32}
                strokeWidth={3}
                showLabel={false}
              />
              <span className="ml-2 text-white text-sm">{moduleStats.completionRate}%</span>
            </div>
            <div className="col-span-2 text-center">
              <div className="text-white text-sm">{item.difficulty || "N/A"}</div>
            </div>
            <div className="col-span-2 flex justify-center gap-1">
              <button
                onClick={() => onItemClick?.(item)}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
              >
                View
              </button>
            </div>
          </div>
        );

      default: // enrollments
        const trend = getProgressTrend(item);
        return (
          <div
            key={item.id || index}
            className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-750 transition-colors"
          >
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {item.userId?.username?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <div className="text-white font-medium">{item.userId?.username}</div>
                <div className="text-gray-400 text-xs">{item.userId?.email}</div>
              </div>
            </div>
            <div className="col-span-3">
              <Link
                to={`/modules/${item.moduleId?.id}`}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                {item.moduleId?.title}
              </Link>
              <div className="text-gray-400 text-xs">
                {item.moduleId?.phase?.title || "No Phase"}
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <CircularProgress
                percentage={item.progressPercentage || 0}
                size={32}
                strokeWidth={3}
                showLabel={false}
              />
              <span className="ml-2 text-white text-sm">{item.progressPercentage || 0}%</span>
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <StatusIndicator status={item.status} showLabel={true} />
            </div>
            <div className="col-span-2 flex justify-center gap-1">
              <button
                onClick={() => onProgressClick?.(item)}
                className="px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded transition-colors"
              >
                Details
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {renderHeader()}
      <div className="max-h-[600px] overflow-y-auto">
        {data.map(renderRow)}
      </div>
    </div>
  );
};

export default ListView;