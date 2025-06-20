import React, { useEffect, useState, useRef } from "react";
import { UserIcon, AcademicCapIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { enrollmentAPI } from "../../services/api";
import LoadingState from "../shared/LoadingState";
import ErrorState from "../shared/ErrorState";
import UserEnrollmentCard from "./UserEnrollmentCard";
import useDebounce from "../../hooks/useDebounce";

const UserEnrollmentList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const abortControllerRef = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Fetch users with enrollment summary
  const fetchUsers = async (resetPage = false, isSearching = false) => {
    try {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Set appropriate loading state
      if (isSearching) {
        setSearchLoading(true);
        setError(null); // Clear previous errors when searching
      } else {
        setLoading(true);
      }
      
      const params = {
        page: resetPage ? 1 : pagination.page,
        limit: pagination.limit,
        ...(debouncedSearch && { search: debouncedSearch }),
      };

      const response = await enrollmentAPI.getUsersSummary(params);
      
      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      console.log("Users summary response:", response); // Debug logging
      
      if (response?.success) {
        setUsers(response.data || []);
        setPagination(response.pagination || pagination);
        setError(null);
      } else {
        console.error("API returned success: false", response);
        setError("Failed to retrieve users enrollment data");
      }
    } catch (err) {
      // Don't show error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }
      
      console.error("Error fetching users:", err);
      setError(`Failed to load users: ${err.response?.data?.message || err.message}`);
    } finally {
      if (isSearching) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
      
      // Clear the abort controller reference
      abortControllerRef.current = null;
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle debounced search changes
  useEffect(() => {
    // Skip initial empty search and current loading state
    if (loading) return;
    
    // Always reset to page 1 when searching and indicate it's a search operation
    fetchUsers(true, true);
  }, [debouncedSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchUsers();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // If search is cleared, immediately show all results
    if (!value.trim()) {
      setUsers([]); // Clear results immediately for better UX
    }
  };

  // Sync progress for all users
  const handleSyncProgress = async () => {
    try {
      setSyncing(true);
      console.log("Syncing progress for all users...");
      
      // Call the sync API
      await enrollmentAPI.syncRecentProgress();
      
      // Refresh user data
      await fetchUsers(true, false);
      
      console.log("Progress sync completed");
    } catch (err) {
      console.error("Error syncing progress:", err);
      setError(`Failed to sync progress: ${err.response?.data?.message || err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  if (loading && users.length === 0) {
    return <LoadingState message="Loading users..." />;
  }

  if (error && users.length === 0) {
    return <ErrorState message={error} onRetry={() => fetchUsers()} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <div>
            <h2 className="text-2xl font-bold text-green-400 font-mono uppercase tracking-wider">
              User Enrollments Overview
            </h2>
            <p className="text-gray-400 font-mono text-sm mt-2">
              Click on a user to view their detailed enrollment progress
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleSyncProgress}
              disabled={syncing || loading}
              className="flex items-center space-x-2 px-3 py-2 bg-cyan-500/20 border border-cyan-400/50 hover:bg-cyan-500/30 hover:border-cyan-400/70 text-cyan-400 font-mono text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{syncing ? 'Syncing...' : 'Sync All'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-12 py-2 bg-gray-900/50 border border-green-400/30 rounded-lg text-green-400 placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-green-400/60 transition-colors"
          />
          {/* Search loading indicator */}
          {searchLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        {/* Search status */}
        {searchInput && debouncedSearch !== searchInput && (
          <div className="text-xs text-gray-500 font-mono mt-1 text-center">
            Searching...
          </div>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserEnrollmentCard
            key={user._id}
            user={user}
            onSelect={() => onUserSelect(user)}
          />
        ))}
      </div>

      {/* Empty State */}
      {!loading && !searchLoading && users.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl font-mono text-gray-400 mb-2">No Users with Enrollments Found</p>
          <p className="text-gray-500 font-mono">
            {debouncedSearch ? `No results found for "${debouncedSearch}"` : "No users have enrolled in any modules yet"}
          </p>
          {debouncedSearch && (
            <button
              onClick={() => setSearchInput("")}
              className="mt-4 px-4 py-2 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 text-green-400 font-mono text-sm rounded transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
            className="px-4 py-2 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed text-green-400 font-mono text-sm rounded transition-colors"
          >
            PREV
          </button>
          
          <span className="text-green-400 font-mono text-sm">
            PAGE {pagination.page} OF {pagination.pages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages || loading}
            className="px-4 py-2 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed text-green-400 font-mono text-sm rounded transition-colors"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
};

export default UserEnrollmentList;