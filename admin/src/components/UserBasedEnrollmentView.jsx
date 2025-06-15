import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ChartBarIcon,
  UserIcon,
  BookOpenIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import api, { enrollmentAPI } from "../services/api";

const UserBasedEnrollmentView = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [detailView, setDetailView] = useState(false);

  // Fetch all users with enrollment statistics
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all users
      const usersResponse = await api.users.getAll();
      if (!usersResponse.success) {
        throw new Error("Failed to fetch users");
      }

      // Fetch all enrollments to calculate user statistics
      const enrollmentsResponse = await enrollmentAPI.getAllAdmin({});
      const enrollments = enrollmentsResponse.data || [];

      // Process users with enrollment statistics
      const usersWithStats = (usersResponse.data || []).map((user) => {
        const userEnrollments = enrollments.filter(
          (enrollment) => enrollment.userId?.id === user.id
        );

        const stats = {
          totalEnrollments: userEnrollments.length,
          activeEnrollments: userEnrollments.filter(
            (e) => e.status === "active"
          ).length,
          completedEnrollments: userEnrollments.filter(
            (e) => e.status === "completed"
          ).length,
          pausedEnrollments: userEnrollments.filter(
            (e) => e.status === "paused"
          ).length,
          droppedEnrollments: userEnrollments.filter(
            (e) => e.status === "dropped"
          ).length,
          averageProgress:
            userEnrollments.length > 0
              ? Math.round(
                  userEnrollments.reduce(
                    (sum, e) => sum + (e.progressPercentage || 0),
                    0
                  ) / userEnrollments.length
                )
              : 0,
          lastActivity: userEnrollments.reduce((latest, enrollment) => {
            const lastAccessed = new Date(
              enrollment.lastAccessedAt || enrollment.enrolledAt
            );
            return !latest || lastAccessed > latest ? lastAccessed : latest;
          }, null),
        };

        return {
          ...user,
          enrollmentStats: stats,
        };
      });

      // Sort users by total enrollments (most active first)
      usersWithStats.sort(
        (a, b) =>
          b.enrollmentStats.totalEnrollments -
          a.enrollmentStats.totalEnrollments
      );

      setUsers(usersWithStats);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users and enrollment data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed enrollments for a specific user
  const fetchUserEnrollments = async (userId) => {
    try {
      setEnrollmentLoading(true);
      
      // Get user enrollments with detailed module information
      const response = await enrollmentAPI.getAllAdmin({
        userId: userId,
        limit: 100, // Get all enrollments for this user
      });

      if (response.success) {
        setUserEnrollments(response.data || []);
      } else {
        setError("Failed to fetch user enrollments");
      }
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      setError("Failed to fetch user enrollments");
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    setDetailView(true);
    await fetchUserEnrollments(user.id);
  };

  // Close detail view
  const closeDetailView = () => {
    setDetailView(false);
    setSelectedUser(null);
    setUserEnrollments([]);
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower)
    );
  });

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get user role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-600 text-white";
      case "student":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-600 text-white";
      case "completed":
        return "bg-blue-600 text-white";
      case "paused":
        return "bg-yellow-600 text-white";
      case "dropped":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  // Get progress color
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "from-green-400 to-green-600";
    if (percentage >= 60) return "from-blue-400 to-blue-600";
    if (percentage >= 40) return "from-yellow-400 to-yellow-600";
    if (percentage >= 20) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  // User enrollment detail modal
  const UserEnrollmentModal = () => {
    if (!detailView || !selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 retro-card animate-slideUp">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 retro-header">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {selectedUser.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-cyber-green retro-glow">
                  {selectedUser.username}
                </h2>
                <p className="text-cyan-400">{selectedUser.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(
                      selectedUser.role
                    )}`}
                  >
                    {selectedUser.role}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Joined {formatDate(selectedUser.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={closeDetailView}
              className="text-gray-400 hover:text-white transition-colors retro-button"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* User Statistics */}
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 retro-text-cyan">
              📊 Enrollment Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center retro-card">
                <div className="text-2xl font-bold text-blue-400">
                  {selectedUser.enrollmentStats.totalEnrollments}
                </div>
                <div className="text-xs text-gray-400">Total Enrollments</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center retro-card">
                <div className="text-2xl font-bold text-green-400">
                  {selectedUser.enrollmentStats.activeEnrollments}
                </div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center retro-card">
                <div className="text-2xl font-bold text-cyan-400">
                  {selectedUser.enrollmentStats.completedEnrollments}
                </div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center retro-card">
                <div className="text-2xl font-bold text-purple-400">
                  {selectedUser.enrollmentStats.averageProgress}%
                </div>
                <div className="text-xs text-gray-400">Avg Progress</div>
              </div>
            </div>
          </div>

          {/* Enrollments List */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cyan-400 retro-text-cyan">
                📚 Enrollments ({userEnrollments.length})
              </h3>
              {enrollmentLoading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
              )}
            </div>

            {enrollmentLoading ? (
              <div className="text-center py-8 text-gray-400">
                Loading enrollments...
              </div>
            ) : userEnrollments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpenIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No enrollments found for this user.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-cyan-500 transition-colors retro-card animate-fadeIn"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Link
                            to={`/modules/${enrollment.moduleId?.id}`}
                            className="text-lg font-semibold text-green-400 hover:text-cyan-400 transition-colors retro-text-green"
                          >
                            {enrollment.moduleId?.title || "Unknown Module"}
                          </Link>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
                              enrollment.status
                            )}`}
                          >
                            {enrollment.status}
                          </span>
                          {enrollment.moduleId?.difficulty && (
                            <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded-full">
                              {enrollment.moduleId.difficulty}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-400 mb-3">
                          {enrollment.moduleId?.description ||
                            "No description available"}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm text-gray-300 mb-1">
                            <span>Progress</span>
                            <span className="font-bold">
                              {enrollment.progressPercentage || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${getProgressColor(
                                enrollment.progressPercentage || 0
                              )}`}
                              style={{
                                width: `${enrollment.progressPercentage || 0}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {enrollment.completedSections || 0} of{" "}
                            {enrollment.totalSections || 0} sections completed
                          </div>
                        </div>

                        {/* Enrollment Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                          <div>
                            <span className="text-gray-500">Enrolled:</span>{" "}
                            {formatDate(enrollment.enrolledAt)}
                          </div>
                          <div>
                            <span className="text-gray-500">Last Access:</span>{" "}
                            {enrollment.lastAccessedAt
                              ? formatDate(enrollment.lastAccessedAt)
                              : "Never"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/modules/${enrollment.moduleId?.id}`}
                          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors retro-button"
                          title="View Module"
                        >
                          <EyeIcon className="w-4 h-4 text-cyan-400" />
                        </Link>
                        <button
                          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors retro-button"
                          title="View Progress Details"
                        >
                          <ChartBarIcon className="w-4 h-4 text-green-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-700">
            <button
              onClick={closeDetailView}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors retro-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-400">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 retro-grid-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 retro-header p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-cyber-green retro-glow">
                👥 User-Based Enrollment View
              </h1>
              <p className="text-cyan-400 mt-2">
                Browse users and view their enrollment details
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/enrollments"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors retro-button"
              >
                Back to Enrollments
              </Link>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700 retro-card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, username, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 retro-input"
                />
              </div>
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700 retro-card">
            <UserGroupIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Users Found
            </h3>
            <p className="text-gray-400">
              {searchTerm
                ? "No users match your search criteria."
                : "No users available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-200 cursor-pointer transform hover:scale-105 retro-card animate-fadeIn"
              >
                {/* User Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Enrollment Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">
                      {user.enrollmentStats.totalEnrollments}
                    </div>
                    <div className="text-xs text-gray-400">Enrollments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">
                      {user.enrollmentStats.activeEnrollments}
                    </div>
                    <div className="text-xs text-gray-400">Active</div>
                  </div>
                </div>

                {/* Progress Indicator */}
                {user.enrollmentStats.totalEnrollments > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                      <span>Average Progress</span>
                      <span className="font-bold">
                        {user.enrollmentStats.averageProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${getProgressColor(
                          user.enrollmentStats.averageProgress
                        )}`}
                        style={{
                          width: `${user.enrollmentStats.averageProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Status Summary */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {user.enrollmentStats.completedEnrollments > 0 && (
                    <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                      {user.enrollmentStats.completedEnrollments} Completed
                    </span>
                  )}
                  {user.enrollmentStats.pausedEnrollments > 0 && (
                    <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">
                      {user.enrollmentStats.pausedEnrollments} Paused
                    </span>
                  )}
                  {user.enrollmentStats.droppedEnrollments > 0 && (
                    <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                      {user.enrollmentStats.droppedEnrollments} Dropped
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
                  <div>
                    Last activity:{" "}
                    {user.enrollmentStats.lastActivity
                      ? formatDate(user.enrollmentStats.lastActivity)
                      : "No activity"}
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User Enrollment Detail Modal */}
        <UserEnrollmentModal />
      </div>
    </div>
  );
};

export default UserBasedEnrollmentView;