import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { contentAPI, modulesAPI, progressAPI } from "../services/api";

const ModuleProgressDetailView = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moduleData, setModuleData] = useState(null);
  const [progressStats, setProgressStats] = useState(null);
  const [moduleContent, setModuleContent] = useState([]);
  const [userProgressData, setUserProgressData] = useState([]);

  // UI state
  const [selectedTab, setSelectedTab] = useState("overview"); // overview, users, content, analytics
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("completion");

  // Fetch module data
  const fetchModuleData = async () => {
    try {
      setError("");
      const response = await modulesAPI.getById(moduleId);
      if (response.success) {
        setModuleData(response.data);
      } else {
        setError("Failed to fetch module data");
      }
    } catch (error) {
      console.error("Error fetching module data:", error);
      setError("Failed to fetch module data. Please try again.");
    }
  };

  // Fetch progress statistics
  const fetchProgressStats = async () => {
    try {
      const response = await progressAPI.getModuleStats(moduleId);
      if (response.success) {
        setProgressStats(response.data);
        setUserProgressData(response.data.userProgressSummary || []);
      } else {
        setError("Failed to fetch progress statistics");
      }
    } catch (error) {
      console.error("Error fetching progress stats:", error);
      setError("Failed to fetch progress statistics");
    }
  };

  // Fetch module content
  const fetchModuleContent = async () => {
    try {
      const response = await contentAPI.getByModuleGrouped(moduleId);
      if (response.success) {
        setModuleContent(response.data);
      }
    } catch (error) {
      console.error("Error fetching module content:", error);
    }
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchModuleData(),
      fetchProgressStats(),
      fetchModuleContent(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (moduleId) {
      fetchData();
    }
  }, [moduleId]);

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

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-blue-400";
    if (percentage >= 40) return "text-yellow-400";
    if (percentage >= 20) return "text-orange-400";
    return "text-red-400";
  };

  const getProgressGradient = (percentage) => {
    if (percentage >= 80) return "from-green-600 to-green-400";
    if (percentage >= 60) return "from-blue-600 to-blue-400";
    if (percentage >= 40) return "from-yellow-600 to-yellow-400";
    if (percentage >= 20) return "from-orange-600 to-orange-400";
    return "from-red-600 to-red-400";
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
        const completion = user.completionPercentage || 0;
        switch (filterStatus) {
          case "completed":
            return completion >= 100;
          case "in-progress":
            return completion > 0 && completion < 100;
          case "not-started":
            return completion === 0;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "completion":
          return (b.completionPercentage || 0) - (a.completionPercentage || 0);
        case "username":
          return (a.user?.username || "").localeCompare(b.user?.username || "");
        case "timeSpent":
          return (b.totalTimeSpent || 0) - (a.totalTimeSpent || 0);
        case "enrolled":
          return (
            new Date(b.enrollment?.enrolledAt || 0) -
            new Date(a.enrollment?.enrolledAt || 0)
          );
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Statistics Card Component
  const StatCard = ({ title, value, icon, color, subtitle, progress }) => (
    <div
      className={`bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-${color}-500/50 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`text-${color}-400 text-sm font-semibold`}>{title}</div>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mb-2">{subtitle}</div>}
      {progress !== undefined && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-${color}-500 transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );

  // Enhanced Progress Bar Component
  const ProgressBar = ({ percentage, showLabel = true, size = "md" }) => {
    const sizeClasses = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4",
    };

    return (
      <div className="w-full">
        {showLabel && (
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Progress</span>
            <span className="font-bold">{percentage}%</span>
          </div>
        )}
        <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]}`}>
          <div
            className={`${
              sizeClasses[size]
            } rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getProgressGradient(
              percentage
            )}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-lg w-fit mb-6">
      {[
        { id: "overview", label: "📊 Overview", icon: "📊" },
        { id: "users", label: "👥 User Progress", icon: "👥" },
        { id: "content", label: "📋 Content Progress", icon: "📋" },
        { id: "analytics", label: "📈 Analytics", icon: "📈" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setSelectedTab(tab.id)}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            selectedTab === tab.id
              ? "bg-cyan-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  // Overview Tab Content
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Module Information */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">
              {moduleData?.title}
            </h3>
            <p className="text-gray-400 mb-4">{moduleData?.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-400">Difficulty</div>
                <div className="text-white font-medium capitalize">
                  {moduleData?.difficulty}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Duration</div>
                <div className="text-white font-medium">
                  {moduleData?.duration || 0} hours
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Prerequisites</div>
                <div className="text-white font-medium">
                  {moduleData?.prerequisites?.length || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Phase</div>
                <div className="text-white font-medium">
                  {moduleData?.phaseId?.title || "Unknown"}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-6">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl border-2"
              style={{
                backgroundColor: moduleData?.color || "#10b981",
                borderColor: moduleData?.color || "#10b981",
              }}
            >
              {moduleData?.icon || "📚"}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Users"
          value={progressStats?.overview?.totalUsers || 0}
          icon="👥"
          color="cyan"
          subtitle="Enrolled students"
        />
        <StatCard
          title="Total Content"
          value={progressStats?.overview?.totalContent || 0}
          icon="📚"
          color="blue"
          subtitle="Learning materials"
        />
        <StatCard
          title="Completed"
          value={progressStats?.progressByStatus?.completed || 0}
          icon="✅"
          color="green"
          subtitle="Finished users"
          progress={
            progressStats?.overview?.totalUsers > 0
              ? ((progressStats?.progressByStatus?.completed || 0) /
                  progressStats.overview.totalUsers) *
                100
              : 0
          }
        />
        <StatCard
          title="In Progress"
          value={progressStats?.progressByStatus?.inProgress || 0}
          icon="⏳"
          color="yellow"
          subtitle="Active learners"
          progress={
            progressStats?.overview?.totalUsers > 0
              ? ((progressStats?.progressByStatus?.inProgress || 0) /
                  progressStats.overview.totalUsers) *
                100
              : 0
          }
        />
        <StatCard
          title="Not Started"
          value={progressStats?.progressByStatus?.notStarted || 0}
          icon="⭕"
          color="red"
          subtitle="Pending users"
          progress={
            progressStats?.overview?.totalUsers > 0
              ? ((progressStats?.progressByStatus?.notStarted || 0) /
                  progressStats.overview.totalUsers) *
                100
              : 0
          }
        />
        <StatCard
          title="Avg. Completion"
          value={`${Math.round(
            (progressStats?.overview?.totalProgress || 0) /
              Math.max(progressStats?.overview?.totalUsers || 1, 1)
          )}%`}
          icon="📊"
          color="purple"
          subtitle="Overall progress"
        />
      </div>

      {/* Content Type Progress */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Content Completion Rates
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(progressStats?.completionRates || {}).map(
            ([type, rate]) => (
              <div key={type} className="text-center">
                <div className="text-2xl mb-2">{getContentTypeIcon(type)}</div>
                <div className="text-lg font-bold text-white">
                  {Math.round(rate || 0)}%
                </div>
                <div className="text-sm text-gray-400 capitalize">{type}</div>
                <ProgressBar
                  percentage={Math.round(rate || 0)}
                  showLabel={false}
                  size="sm"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );

  // Users Tab Content
  const renderUsersTab = () => {
    const filteredUsers = getFilteredAndSortedUsers();

    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Users
              </label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="not-started">Not Started</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="completion">Completion %</option>
                <option value="username">Username</option>
                <option value="timeSpent">Time Spent</option>
                <option value="enrolled">Enrollment Date</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                {filteredUsers.length} of {userProgressData.length} users
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <div
              key={user.user?.id || index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500/50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                    {user.user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {user.user?.username || "Unknown User"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {user.user?.email || "No email"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Enrolled: {formatDate(user.enrollment?.enrolledAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div
                      className={`text-xl font-bold ${getProgressColor(
                        user.completionPercentage || 0
                      )}`}
                    >
                      {user.completionPercentage || 0}%
                    </div>
                    <div className="text-xs text-gray-400">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">
                      {user.completedContent || 0}
                    </div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">
                      {Math.round(user.totalTimeSpent || 0)}m
                    </div>
                    <div className="text-xs text-gray-400">Time Spent</div>
                  </div>
                  <div className="w-32">
                    <ProgressBar
                      percentage={user.completionPercentage || 0}
                      showLabel={false}
                      size="md"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No users found matching your criteria.
          </div>
        )}
      </div>
    );
  };

  // Content Tab Content
  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Content Progress Overview
        </h3>
        <div className="text-gray-400">
          Detailed content progress view would show individual content items and
          their completion rates. This would require additional API endpoints to
          get content-specific progress data.
        </div>
      </div>
    </div>
  );

  // Analytics Tab Content
  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Time Spent Analytics */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Average Time Spent by Content Type
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(progressStats?.averageTimeSpent || {}).map(
            ([type, time]) => (
              <div
                key={type}
                className="text-center p-4 bg-gray-700 rounded-lg"
              >
                <div className="text-2xl mb-2">{getContentTypeIcon(type)}</div>
                <div className="text-lg font-bold text-white">
                  {Math.round(time || 0)}m
                </div>
                <div className="text-sm text-gray-400 capitalize">{type}</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Progress Distribution */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Progress Distribution
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Completed (100%)</span>
            <span className="text-green-400 font-bold">
              {progressStats?.progressByStatus?.completed || 0} users
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">In Progress (1-99%)</span>
            <span className="text-yellow-400 font-bold">
              {progressStats?.progressByStatus?.inProgress || 0} users
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Not Started (0%)</span>
            <span className="text-red-400 font-bold">
              {progressStats?.progressByStatus?.notStarted || 0} users
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-400">Loading module progress...</p>
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
                <Link to="/modules" className="hover:text-white">
                  Modules
                </Link>
                <span>›</span>
                <span className="text-white">Progress Details</span>
              </nav>
              <h1 className="text-3xl font-bold text-white mb-2">
                Module Progress Details
              </h1>
              <p className="text-gray-400">
                Detailed progress analytics for {moduleData?.title}
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

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Tab Content */}
        {selectedTab === "overview" && renderOverviewTab()}
        {selectedTab === "users" && renderUsersTab()}
        {selectedTab === "content" && renderContentTab()}
        {selectedTab === "analytics" && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default ModuleProgressDetailView;
