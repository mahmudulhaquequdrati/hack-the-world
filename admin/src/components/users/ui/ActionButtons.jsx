import {
  ListBulletIcon,
  Squares2X2Icon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import React from "react";

/**
 * Action Buttons Component for Users Management
 * Provides view mode controls and filters
 */
const ActionButtons = ({
  viewMode,
  setViewMode,
  filters,
  onFilterChange,
  loading,
}) => {
  return (
    <div className="bg-gradient-to-r from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-mono font-bold uppercase tracking-wider">
              FILTERS
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Role Filter */}
            <select
              className="px-3 py-2 bg-black/60 border border-green-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 text-green-400 font-mono text-sm"
              value={filters.role}
              onChange={(e) => onFilterChange("role", e.target.value)}
              disabled={loading}
            >
              <option value="">ALL ROLES</option>
              <option value="student">STUDENT</option>
              <option value="admin">ADMIN</option>
            </select>

            {/* Experience Level Filter */}
            <select
              className="px-3 py-2 bg-black/60 border border-green-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 text-green-400 font-mono text-sm"
              value={filters.experienceLevel}
              onChange={(e) => onFilterChange("experienceLevel", e.target.value)}
              disabled={loading}
            >
              <option value="">ALL LEVELS</option>
              <option value="beginner">BEGINNER</option>
              <option value="intermediate">INTERMEDIATE</option>
              <option value="advanced">ADVANCED</option>
              <option value="expert">EXPERT</option>
            </select>

            {/* Sort Filter */}
            <select
              className="px-3 py-2 bg-black/60 border border-green-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 text-green-400 font-mono text-sm"
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value)}
              disabled={loading}
            >
              <option value="createdAt:desc">NEWEST FIRST</option>
              <option value="createdAt:asc">OLDEST FIRST</option>
              <option value="name:asc">NAME A-Z</option>
              <option value="name:desc">NAME Z-A</option>
              <option value="totalPoints:desc">HIGHEST POINTS</option>
              <option value="level:desc">HIGHEST LEVEL</option>
            </select>
          </div>
        </div>

        {/* Right side - View Mode */}
        <div className="flex items-center space-x-2">
          <span className="text-green-400 font-mono font-bold uppercase tracking-wider text-sm">
            VIEW
          </span>
          <div className="flex items-center bg-black/60 border border-green-400/30 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              disabled={loading}
              className={`p-2 rounded-md transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-green-400/20 text-green-400 shadow-lg shadow-green-400/30"
                  : "text-gray-400 hover:text-green-400 hover:bg-green-400/10"
              }`}
              title="Grid View"
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              disabled={loading}
              className={`p-2 rounded-md transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-green-400/20 text-green-400 shadow-lg shadow-green-400/30"
                  : "text-gray-400 hover:text-green-400 hover:bg-green-400/10"
              }`}
              title="List View"
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;