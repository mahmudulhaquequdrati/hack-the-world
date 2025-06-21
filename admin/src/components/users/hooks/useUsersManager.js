import { useState, useEffect, useCallback } from 'react';
import useUsersAPI from './useUsersAPI';

/**
 * Custom hook for managing users manager functionality
 * @returns {Object} Manager state and functions
 */
const useUsersManager = () => {
  const {
    users,
    loading,
    error,
    success,
    pagination,
    fetchUsers,
    clearMessages,
    updatePagination,
    setError,
    setSuccess
  } = useUsersAPI();

  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    role: "",
    experienceLevel: "",
    adminStatus: "",
    search: "",
    sortBy: "createdAt:desc"
  });

  // Build query parameters from current state
  const buildQueryParams = useCallback(() => {
    const params = {
      page: pagination.current,
      limit: pagination.limit
    };

    if (filters.role) params.role = filters.role;
    if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
    if (filters.adminStatus) params.adminStatus = filters.adminStatus;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;

    return params;
  }, [pagination.current, pagination.limit, filters]);

  // Fetch users when filters or pagination change
  useEffect(() => {
    const params = buildQueryParams();
    fetchUsers(params);
  }, [buildQueryParams, fetchUsers]);

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset to first page when filters change
    updatePagination({ current: 1 });
  }, [updatePagination]);

  // Handle page changes
  const handlePageChange = useCallback((page) => {
    updatePagination({ current: page });
  }, [updatePagination]);

  // Handle view mode changes
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // Refresh users data
  const refreshUsers = useCallback(() => {
    const params = buildQueryParams();
    fetchUsers(params, true);
  }, [buildQueryParams, fetchUsers]);

  // Clear all messages
  const handleClearMessages = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  return {
    // Data & Loading States
    users,
    loading,
    error,
    success,
    pagination,
    
    // View Management
    viewMode,
    setViewMode: handleViewModeChange,
    
    // Filter Management
    filters,
    handleFilterChange,
    
    // Pagination Management
    handlePageChange,
    
    // Actions
    refreshUsers,
    clearMessages: handleClearMessages,
    
    // Direct state setters
    setError,
    setSuccess
  };
};

export default useUsersManager;