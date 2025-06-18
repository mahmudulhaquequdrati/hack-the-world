import { ClockIcon } from "@heroicons/react/24/outline";
import React from "react";

const ContentFiltersAndControls = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  contentTypes,
  modules,
  content,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {/* Content Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
              ▶ Filter by Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange("type", e.target.value)}
              className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
            >
              <option value="">All Types</option>
              {contentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Module Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
              ▶ Filter by Module
            </label>
            <select
              value={filters.moduleId}
              onChange={(e) => onFilterChange("moduleId", e.target.value)}
              className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
            >
              <option value="">All Modules</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* View Mode */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
            ▶ View Mode
          </label>
          <div className="flex bg-gradient-to-r from-black/80 to-gray-900/80 border border-green-400/30 rounded-xl p-1 shadow-lg shadow-green-400/10">
            <button
              onClick={() => onViewModeChange("hierarchical")}
              className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider relative overflow-hidden ${
                viewMode === "hierarchical"
                  ? "bg-gradient-to-r from-green-400/20 to-green-500/20 text-green-400 border border-green-400/50 shadow-lg shadow-green-400/20"
                  : "text-green-400/60 hover:text-green-400 hover:bg-green-400/10 hover:shadow-md"
              }`}
            >
              {viewMode === "hierarchical" && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 animate-pulse"></div>
              )}
              <span className="relative z-10">🔗 TREE</span>
            </button>
            <button
              onClick={() => onViewModeChange("groupedByModule")}
              className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider relative overflow-hidden ${
                viewMode === "groupedByModule"
                  ? "bg-gradient-to-r from-green-400/20 to-green-500/20 text-green-400 border border-green-400/50 shadow-lg shadow-green-400/20"
                  : "text-green-400/60 hover:text-green-400 hover:bg-green-400/10 hover:shadow-md"
              }`}
            >
              {viewMode === "groupedByModule" && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 animate-pulse"></div>
              )}
              <span className="relative z-10">📚 MODULE</span>
            </button>
            <button
              onClick={() => onViewModeChange("groupedByType")}
              className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider relative overflow-hidden ${
                viewMode === "groupedByType"
                  ? "bg-gradient-to-r from-green-400/20 to-green-500/20 text-green-400 border border-green-400/50 shadow-lg shadow-green-400/20"
                  : "text-green-400/60 hover:text-green-400 hover:bg-green-400/10 hover:shadow-md"
              }`}
            >
              {viewMode === "groupedByType" && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 animate-pulse"></div>
              )}
              <span className="relative z-10">🎯 TYPE</span>
            </button>
          </div>
        </div>
        {/* Statistics */}
        <div className="">
          <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
            ▶ STATISTICS
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-sm">
            <div className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-400/30 rounded-xl shadow-lg shadow-green-400/10">
              <span className="text-green-400 font-mono uppercase tracking-wider">
                ITEMS:
              </span>
              <span className="font-bold text-green-400 font-mono">
                {content.length}
              </span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-900/20 to-cyan-800/20 border border-cyan-400/30 rounded-xl shadow-lg shadow-cyan-400/10 ">
              <ClockIcon className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-400 font-mono uppercase tracking-wider">
                TIME:
              </span>
              <span className="font-bold text-cyan-400 font-mono text-nowrap">
                {content.reduce(
                  (total, item) => total + (item.duration || 0),
                  0
                )}{" "}
                MIN
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentFiltersAndControls;
