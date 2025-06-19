import React from "react";
import EnrollmentCard from "./EnrollmentCard";
import UserCard from "./UserCard";
import ModuleCard from "./ModuleCard";

const GridView = ({
  data,
  viewMode,
  onItemClick,
  onProgressClick,
  onStatusChange,
  onSecondaryAction,
  loading = false,
  error = null,
  emptyMessage = "No data found",
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-3/4"></div>
              </div>
              <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-600 rounded"></div>
              <div className="h-3 bg-gray-600 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-2">⚠️ Error Loading Data</div>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">📭 {emptyMessage}</div>
        <p className="text-gray-500">Try adjusting your filters or refresh the page.</p>
      </div>
    );
  }

  const renderCard = (item, index) => {
    switch (viewMode) {
      case "users":
        return (
          <UserCard
            key={item.id || index}
            user={item}
            onUserClick={onItemClick}
            onUserEnrollmentsView={onSecondaryAction}
            showActions={true}
          />
        );
      case "modules":
        return (
          <ModuleCard
            key={item.id || index}
            module={item}
            onModuleClick={onItemClick}
            onEnrollmentsView={onSecondaryAction}
            showActions={true}
          />
        );
      default: // enrollments
        return (
          <EnrollmentCard
            key={item.id || index}
            enrollment={item}
            onProgressClick={onProgressClick}
            onStatusChange={onStatusChange}
            showActions={true}
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map(renderCard)}
    </div>
  );
};

export default GridView;