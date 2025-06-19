import React from "react";
import { statusOptions, viewModes, moduleFilterOptions } from "../constants/enrollmentConstants";

const FiltersAndControls = ({
  filters,
  onFiltersChange,
  modules = [],
  viewMode,
  onViewModeChange,
  onRefresh,
  onExport,
  loading = false,
  showViewModeToggle = true,
  showExportButton = true,
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const handleReset = () => {
    onFiltersChange({
      status: "",
      moduleId: "",
      search: "",
      page: 1,
      limit: 20,
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
      {/* Search and Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search Students/Modules
          </label>
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Username, email, or module name..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Module Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Module
          </label>
          <select
            value={filters.moduleId || ""}
            onChange={(e) => handleFilterChange("moduleId", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">All Modules</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
        </div>

        {/* Items per page */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Items per page
          </label>
          <select
            value={filters.limit || 20}
            onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Action Buttons and View Mode */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            🔄 Reset Filters
          </button>

          {showExportButton && (
            <button
              onClick={onExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              📊 Export Data
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        {showViewModeToggle && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">View:</span>
            <div className="flex bg-gray-700 rounded-lg p-1">
              {viewModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => onViewModeChange(mode.value)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    viewMode === mode.value
                      ? "bg-cyan-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-600"
                  }`}
                >
                  <span>{mode.icon}</span>
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {(filters.search || filters.status || filters.moduleId) && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            {filters.search && (
              <span className="px-2 py-1 bg-cyan-600 text-white text-xs rounded-full">
                Search: "{filters.search}"
              </span>
            )}
            {filters.status && (
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                Status: {statusOptions.find(s => s.value === filters.status)?.label}
              </span>
            )}
            {filters.moduleId && (
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                Module: {modules.find(m => m.id === filters.moduleId)?.title || "Selected"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersAndControls;