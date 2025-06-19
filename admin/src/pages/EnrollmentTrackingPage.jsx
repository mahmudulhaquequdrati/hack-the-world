import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { enrollmentAPI } from "../services/api";

// Import all the reusable components
import {
  useEnrollmentData,
  StatsPanel,
  FiltersAndControls,
  GridView,
  ListView,
  ProgressDetailsModal,
  sortEnrollments,
  filterEnrollments,
  paginateEnrollments,
} from "../components/enrollments";

const EnrollmentTrackingPage = () => {
  const navigate = useNavigate();

  // Use the custom hook for data management
  const {
    enrollments,
    modules,
    users,
    enrolledModules,
    totalStats,
    pagination,
    loading,
    error,
    success,
    refreshing,
    filters,
    updateFilters,
    resetFilters,
    refreshData,
    setError,
    setSuccess,
  } = useEnrollmentData();

  // UI state
  const [viewMode, setViewMode] = useState("grid"); // grid, list, users, modules, analytics
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("enrolledAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Get current view data based on view mode
  const getCurrentViewData = () => {
    switch (viewMode) {
      case "users":
        return users;
      case "modules":
        return enrolledModules;
      default:
        return enrollments;
    }
  };

  // Handle status change
  const handleStatusChange = async (enrollment, newStatus) => {
    try {
      const response = await enrollmentAPI.updateStatus(enrollment.id, newStatus);
      if (response.success) {
        setSuccess(`Status updated to ${newStatus}`);
        refreshData();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    }
  };

  // Handle progress details modal
  const handleProgressClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setProgressModalOpen(true);
  };

  const closeProgressModal = () => {
    setProgressModalOpen(false);
    setSelectedEnrollment(null);
  };

  // Handle sorting
  const handleSort = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
  };

  // Handle export
  const handleExport = () => {
    // Implementation for exporting data
    console.log("Exporting enrollment data...");
    setSuccess("Export functionality coming soon!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Handle item clicks
  const handleItemClick = (item) => {
    if (viewMode === "users") {
      navigate(`/users/${item.id}`);
    } else if (viewMode === "modules") {
      navigate(`/modules/${item.id}`);
    } else {
      handleProgressClick(item);
    }
  };

  const handleSecondaryAction = (item) => {
    if (viewMode === "users") {
      // Show user enrollments
      updateFilters({ search: item.username });
      setViewMode("grid");
    } else if (viewMode === "modules") {
      // Show module enrollments
      updateFilters({ moduleId: item.id });
      setViewMode("grid");
    }
  };

  // Process and sort data
  const processedData = (() => {
    let data = getCurrentViewData();
    
    // Apply sorting
    if (viewMode === "users") {
      data = [...data].sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case "username":
            aValue = a.username?.toLowerCase() || "";
            bValue = b.username?.toLowerCase() || "";
            break;
          case "totalEnrollments":
            aValue = a.enrollmentStats?.totalEnrollments || 0;
            bValue = b.enrollmentStats?.totalEnrollments || 0;
            break;
          case "averageProgress":
            aValue = a.enrollmentStats?.averageProgress || 0;
            bValue = b.enrollmentStats?.averageProgress || 0;
            break;
          case "lastActivity":
            aValue = new Date(a.enrollmentStats?.lastActivity || 0);
            bValue = new Date(b.enrollmentStats?.lastActivity || 0);
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    } else if (viewMode === "modules") {
      data = [...data].sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case "title":
            aValue = a.title?.toLowerCase() || "";
            bValue = b.title?.toLowerCase() || "";
            break;
          case "totalEnrollments":
            aValue = a.enrollmentStats?.totalEnrollments || 0;
            bValue = b.enrollmentStats?.totalEnrollments || 0;
            break;
          case "completionRate":
            aValue = a.enrollmentStats?.completionRate || 0;
            bValue = b.enrollmentStats?.completionRate || 0;
            break;
          case "difficulty":
            aValue = a.difficulty?.toLowerCase() || "";
            bValue = b.difficulty?.toLowerCase() || "";
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      data = sortEnrollments(data, sortBy, sortOrder);
    }
    
    return data;
  })();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Enrollment Tracking
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Monitor and manage student enrollments across all modules
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/enrollments/users"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200 w-full sm:w-auto text-center flex items-center gap-2"
              >
                👥 User-Based View
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 w-full sm:w-auto text-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Statistics Panel */}
        <StatsPanel stats={totalStats} loading={loading} />

        {/* Filters and Controls */}
        <FiltersAndControls
          filters={filters}
          onFiltersChange={updateFilters}
          modules={modules}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={refreshData}
          onExport={handleExport}
          loading={refreshing}
          showViewModeToggle={true}
          showExportButton={true}
        />

        {/* Main Content Area */}
        <div className="mb-6">
          {viewMode === "list" ? (
            <ListView
              data={processedData}
              viewMode={viewMode}
              onItemClick={handleItemClick}
              onProgressClick={handleProgressClick}
              onStatusChange={handleStatusChange}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
              loading={loading}
              error={error}
              emptyMessage={
                viewMode === "users" 
                  ? "No users found" 
                  : viewMode === "modules" 
                  ? "No modules found" 
                  : "No enrollments found"
              }
            />
          ) : (
            <GridView
              data={processedData}
              viewMode={viewMode}
              onItemClick={handleItemClick}
              onProgressClick={handleProgressClick}
              onStatusChange={handleStatusChange}
              onSecondaryAction={handleSecondaryAction}
              loading={loading}
              error={error}
              emptyMessage={
                viewMode === "users" 
                  ? "No users found" 
                  : viewMode === "modules" 
                  ? "No modules found" 
                  : "No enrollments found"
              }
            />
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={() => updateFilters({ page: Math.max(1, filters.page - 1) })}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-gray-300">
              Page {pagination.page} of {pagination.totalPages} 
              ({pagination.total} total items)
            </span>
            
            <button
              onClick={() => updateFilters({ page: Math.min(pagination.totalPages, filters.page + 1) })}
              disabled={!pagination.hasNext}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Progress Details Modal */}
        <ProgressDetailsModal
          enrollment={selectedEnrollment}
          isOpen={progressModalOpen}
          onClose={closeProgressModal}
          onStatusUpdate={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default EnrollmentTrackingPage;