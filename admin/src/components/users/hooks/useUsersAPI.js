import { useState, useCallback } from 'react';
import { usersAPI } from '../../../services/api';

/**
 * Custom hook for managing users API operations
 * @returns {Object} API state and functions
 */
const useUsersAPI = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });

  /**
   * Fetches all users from the API with pagination and filtering
   * @param {Object} params - Query parameters for filtering and pagination
   * @param {boolean} showLoader - Whether to show loading state
   */
  const fetchUsers = useCallback(async (params = {}, showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");
      console.log("🔄 Fetching users...", params);
      
      const response = await usersAPI.getAll(params);
      console.log("✅ Users fetched:", response);

      setUsers(response.data || []);
      setPagination(response.pagination || {
        current: 1,
        pages: 1,
        total: 0,
        limit: 20,
        hasNext: false,
        hasPrev: false
      });
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      let errorMessage = "Failed to load users";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setUsers([]);
      setPagination({
        current: 1,
        pages: 1,
        total: 0,
        limit: 20,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  /**
   * Fetches complete user data including enrollments, progress, achievements
   * @param {string} userId - User ID to fetch
   */
  const fetchUserComplete = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 Fetching complete user data for:", userId);
      
      const response = await usersAPI.getCompleteById(userId);
      console.log("✅ User complete data fetched:", response);

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching user complete data:", error);
      let errorMessage = "Failed to load user details";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clears error and success messages
   */
  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  /**
   * Updates pagination state
   * @param {Object} newPagination - New pagination state
   */
  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  return {
    // Data
    users,
    loading,
    error,
    success,
    pagination,
    
    // Actions
    fetchUsers,
    fetchUserComplete,
    clearMessages,
    updatePagination,
    
    // Direct state setters (for external control)
    setUsers,
    setError,
    setSuccess,
    setLoading,
    setPagination
  };
};

export default useUsersAPI;