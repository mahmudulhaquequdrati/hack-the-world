import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { contentAPI, progressAPI } from "../services/api";

const ContentProgressDetailView = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contentData, setContentData] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [userProgressData, setUserProgressData] = useState([]);
  const [progressStats, setProgressStats] = useState(null);

  // UI state
  const [selectedTab, setSelectedTab] = useState("overview"); // overview, users, analytics
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("progress");

  // Fetch content data
  const fetchContentData = async () => {
    try {
      setError("");
      const response = await contentAPI.getById(contentId);
      if (response.success) {
        setContentData(response.data);
        // If content has moduleId, fetch module data too
        if (response.data.moduleId) {
          await fetchModuleData(response.data.moduleId);
        }
      } else {
        setError("Failed to fetch content data");
      }
    } catch (error) {
      console.error("Error fetching content data:", error);
      setError("Failed to fetch content data. Please try again.");
    }
  };

  // Fetch module data
  const fetchModuleData = async (moduleId) => {
    try {
      const response = await progressAPI.getModuleStats(moduleId);
      if (response.success) {
        setModuleData(response.data);
        // Extract user progress data for this specific content
        const contentSpecificProgress =
          response.data.userProgressSummary?.filter((user) =>
            user.contentProgress?.some((cp) => cp.contentId === contentId)
          ) || [];
        setUserProgressData(contentSpecificProgress);

        // Calculate content-specific statistics
        const totalUsers = contentSpecificProgress.length;
        const completedUsers = contentSpecificProgress.filter(
          (user) =>
            user.contentProgress?.find((cp) => cp.contentId === contentId)
              ?.status === "completed"
        ).length;
        const inProgressUsers = contentSpecificProgress.filter(
          (user) =>
            user.contentProgress?.find((cp) => cp.contentId === contentId)
              ?.status === "in-progress"
        ).length;

        setProgressStats({
          totalUsers,
          completedUsers,
          inProgressUsers,
          notStartedUsers: totalUsers - completedUsers - inProgressUsers,
          completionRate:
            totalUsers > 0
              ? Math.round((completedUsers / totalUsers) * 100)
              : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching module data:", error);
    }
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    await fetchContentData();
    setLoading(false);
  };

  useEffect(() => {
    if (contentId) {
      fetchData();
    }
  }, [contentId]);

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case "video":
        return "🎥";
      case "lab":
        return "🧪";
      case "game":
        return "🎮";
      case "document":
        return "📄";
      default:
        return "📁";
    }
  };

  const getContentTypeColor = (type) => {
    switch (type) {
      case "video":
        return "text-red-400";
      case "lab":
        return "text-blue-400";
      case "game":
        return "text-purple-400";
      case "document":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "in-progress":
        return "bg-blue-500 text-white";
      case "not-started":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-blue-400";
    if (percentage >= 40) return "text-yellow-400";
    if (percentage >= 20) return "text-orange-400";
    return "text-red-400";
  };

  // Filter and sort user progress data
  const getFilteredAndSortedUsers = () => {
    let filtered = [...userProgressData];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.user?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter((user) => {
        const contentProgress = user.contentProgress?.find(
          (cp) => cp.contentId === contentId
        );
        return contentProgress?.status === filterStatus;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aProgress = a.contentProgress?.find(
        (cp) => cp.contentId === contentId
      );
      const bProgress = b.contentProgress?.find(
        (cp) => cp.contentId === contentId
      );

      switch (sortBy) {
        case "progress":
          return (
            (bProgress?.progressPercentage || 0) -
            (aProgress?.progressPercentage || 0)
          );
        case "username":
          return (a.user?.username || "").localeCompare(b.user?.username || "");
        case "timeSpent":
          return (bProgress?.timeSpent || 0) - (aProgress?.timeSpent || 0);
        case "completed":
          return (bProgress?.completedAt || 0) - (aProgress?.completedAt || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Statistics Card Component
  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div
      className={`bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-${color}-500/50 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`text-${color}-400 text-sm font-semibold`}>{title}</div>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );

  // Progress Bar Component
  const ProgressBar = ({ percentage, showLabel = true, size = "md" }) => {
    const height = size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3";
    const textSize =
      size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs";

    return (
      <div className="w-full">
        <div className={`bg-gray-700 rounded-full ${height} overflow-hidden`}>
          <div
            className={`h-full bg-gradient-to-r ${
              percentage >= 80
                ? "from-green-600 to-green-400"
                : percentage >= 60
                ? "from-blue-600 to-blue-400"
                : percentage >= 40
                ? "from-yellow-600 to-yellow-400"
                : percentage >= 20
                ? "from-orange-600 to-orange-400"
                : "from-red-600 to-red-400"
            } transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {showLabel && (
          <div
            className={`${textSize} ${getProgressColor(
              percentage
            )} mt-1 text-center`}
          >
            {percentage.toFixed(1)}%
          </div>
        )}
      </div>
    );
  };

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-6">
      {[
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "users", label: "User Progress", icon: "👥" },
        { id: "analytics", label: "Analytics", icon: "📈" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setSelectedTab(tab.id)}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-all duration-200 ${
            selectedTab === tab.id
              ? "bg-cyan-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-400">Loading content progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                <Link to="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
                <span>›</span>
                <Link to="/content" className="hover:text-white">
                  Content
                </Link>
                <span>›</span>
                <span className="text-white">Progress Details</span>
              </nav>
              <h1 className="text-3xl font-bold text-white mb-2">
                Content Progress Details
              </h1>
              <p className="text-gray-400">
                Detailed progress analytics for {contentData?.title}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                ← Back
              </button>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Content Information */}
        {contentData && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`text-2xl ${getContentTypeColor(
                      contentData.type
                    )}`}
                  >
                    {getContentTypeIcon(contentData.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {contentData.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        contentData.type === "video"
                          ? "bg-red-900/30 text-red-400"
                          : contentData.type === "lab"
                          ? "bg-blue-900/30 text-blue-400"
                          : contentData.type === "game"
                          ? "bg-purple-900/30 text-purple-400"
                          : "bg-green-900/30 text-green-400"
                      }`}
                    >
                      {contentData.type}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">{contentData.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Module</div>
                    <div className="text-white font-medium">
                      {moduleData?.module?.title || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Duration</div>
                    <div className="text-white font-medium">
                      {contentData.duration
                        ? `${contentData.duration} min`
                        : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Section</div>
                    <div className="text-white font-medium">
                      {contentData.section || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Type</div>
                    <div className="text-white font-medium capitalize">
                      {contentData.type}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Tab Content */}
        {selectedTab === "overview" && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            {progressStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                  title="Total Users"
                  value={progressStats.totalUsers}
                  icon="👥"
                  color="blue"
                  subtitle="Accessed this content"
                />
                <StatCard
                  title="Completed"
                  value={progressStats.completedUsers}
                  icon="✅"
                  color="green"
                  subtitle={`${progressStats.completionRate}% completion rate`}
                />
                <StatCard
                  title="In Progress"
                  value={progressStats.inProgressUsers}
                  icon="⏳"
                  color="yellow"
                  subtitle="Currently learning"
                />
                <StatCard
                  title="Not Started"
                  value={progressStats.notStartedUsers}
                  icon="⭕"
                  color="gray"
                  subtitle="Haven't started yet"
                />
                <StatCard
                  title="Completion Rate"
                  value={`${progressStats.completionRate}%`}
                  icon="📊"
                  color="cyan"
                  subtitle="Overall success rate"
                />
              </div>
            )}

            {/* Content Analytics Placeholder */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Content Analytics
              </h3>
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-lg mb-2">Advanced Analytics Coming Soon</p>
                <p className="text-sm">
                  Detailed content analytics including engagement metrics, time
                  spent, and learning patterns will be available in a future
                  update.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "users" && (
          <div className="space-y-6">
            {/* User Progress Controls */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="not-started">Not Started</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="progress">Sort by Progress</option>
                  <option value="username">Sort by Username</option>
                  <option value="timeSpent">Sort by Time Spent</option>
                  <option value="completed">Sort by Completion Date</option>
                </select>
              </div>
            </div>

            {/* User Progress List */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">
                  User Progress ({getFilteredAndSortedUsers().length})
                </h3>
              </div>
              <div className="divide-y divide-gray-700">
                {getFilteredAndSortedUsers().length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <div className="text-4xl mb-4">👥</div>
                    <p className="text-lg mb-2">No User Progress Found</p>
                    <p className="text-sm">
                      {searchTerm || filterStatus
                        ? "Try adjusting your search or filter criteria."
                        : "No users have accessed this content yet."}
                    </p>
                  </div>
                ) : (
                  getFilteredAndSortedUsers().map((user, index) => {
                    const contentProgress = user.contentProgress?.find(
                      (cp) => cp.contentId === contentId
                    );
                    const progress = contentProgress?.progressPercentage || 0;
                    const status = contentProgress?.status || "not-started";
                    const timeSpent = contentProgress?.timeSpent || 0;

                    return (
                      <div
                        key={index}
                        className="p-6 hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.user?.username?.charAt(0).toUpperCase() ||
                                "?"}
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {user.user?.username || "Unknown User"}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {user.user?.email || "No email"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-sm text-gray-400">
                                Status
                              </div>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                  status
                                )}`}
                              >
                                {status.replace("-", " ")}
                              </span>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-400">
                                Progress
                              </div>
                              <div className="w-20">
                                <ProgressBar
                                  percentage={progress}
                                  showLabel={true}
                                  size="sm"
                                />
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-400">
                                Time Spent
                              </div>
                              <div className="text-white font-medium">
                                {timeSpent > 0 ? `${timeSpent}m` : "0m"}
                              </div>
                            </div>
                            {contentProgress?.completedAt && (
                              <div className="text-center">
                                <div className="text-sm text-gray-400">
                                  Completed
                                </div>
                                <div className="text-green-400 text-sm">
                                  {formatDate(contentProgress.completedAt)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === "analytics" && (
          <div className="space-y-6">
            {/* Analytics Placeholder */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Advanced Analytics
              </h3>
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-6">📈</div>
                <p className="text-xl mb-4">Detailed Analytics Coming Soon</p>
                <p className="text-sm max-w-2xl mx-auto">
                  This section will include comprehensive analytics such as:
                  learning patterns, engagement metrics, completion trends,
                  time-to-completion analysis, and performance comparisons.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/content/${contentId}`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              📄 View Content Details
            </Link>
            {moduleData?.module?.id && (
              <Link
                to={`/modules/${moduleData.module.id}`}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                📚 View Module
              </Link>
            )}
            <Link
              to="/content"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              📋 Back to Content List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentProgressDetailView;
