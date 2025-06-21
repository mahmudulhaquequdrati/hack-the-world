import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import useUsersManager from "../components/users/hooks/useUsersManager";
import TerminalHeader from "../components/users/ui/TerminalHeader";
import ActionButtons from "../components/users/ui/ActionButtons";
import UserCard from "../components/users/views/UserCard";

const UsersManager = () => {
  const {
    // Data & Loading States
    users,
    loading,
    error,
    success,
    pagination,
    // View Management
    viewMode,
    setViewMode,
    // Filter Management
    filters,
    handleFilterChange,
    // Pagination Management
    handlePageChange,
  } = useUsersManager();

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Enhanced Terminal Header */}
        <TerminalHeader userCount={pagination.total} loading={loading} />

        {/* Action Buttons */}
        <ActionButtons
          viewMode={viewMode}
          setViewMode={setViewMode}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center">
            <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Loading Animation */}
        {loading ? (
          <div className="text-center py-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="text-green-400 font-mono text-lg">
                LOADING USER DATA...
              </div>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Terminal Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    viewMode="grid"
                  />
                ))}
              </div>
            )}

            {/* Enhanced List View */}
            {viewMode === "list" && (
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl overflow-hidden shadow-2xl shadow-green-400/10">
                {/* Enhanced Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-green-900/30 to-green-800/30 border-b border-green-400/30">
                      <tr>
                        <th className="text-left p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ USER
                        </th>
                        <th className="text-left p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ ROLE
                        </th>
                        <th className="text-left p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ LEVEL
                        </th>
                        <th className="text-left p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ LVL
                        </th>
                        <th className="text-left p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ POINTS
                        </th>
                        <th className="text-center p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <UserCard
                          key={user._id}
                          user={user}
                          viewMode="list"
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards for List View */}
                <div className="lg:hidden space-y-4 p-4">
                  {users.map((user) => (
                    <UserCard
                      key={user._id}
                      user={user}
                      viewMode="grid"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {users.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-green-400/30 flex items-center justify-center mx-auto mb-6">
                  <UsersIcon className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wider mb-2">
                  NO USERS FOUND
                </h3>
                <p className="text-gray-400 font-mono">
                  {filters.role || filters.experienceLevel
                    ? "Try adjusting your filters to see more results"
                    : "No users have been registered yet"}
                </p>
              </div>
            )}

            {/* Enhanced Pagination */}
            {pagination.pages > 1 && !loading && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400/10 transition-all duration-300 text-green-400 font-mono"
                >
                  PREV
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                    let page;
                    if (pagination.pages <= 5) {
                      page = i + 1;
                    } else if (pagination.current <= 3) {
                      page = i + 1;
                    } else if (pagination.current >= pagination.pages - 2) {
                      page = pagination.pages - 4 + i;
                    } else {
                      page = pagination.current - 2 + i;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-mono font-bold transition-all duration-300 ${
                          page === pagination.current
                            ? "bg-green-400/20 text-green-400 border-2 border-green-400 shadow-lg shadow-green-400/30"
                            : "bg-black/60 text-gray-400 border border-green-400/30 hover:bg-green-400/10 hover:text-green-400"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400/10 transition-all duration-300 text-green-400 font-mono"
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersManager;
