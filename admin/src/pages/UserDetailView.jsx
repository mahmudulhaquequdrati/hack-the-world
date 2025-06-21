import { 
  ArrowLeftIcon,
  UsersIcon,
  TrophyIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CalendarIcon,
  FireIcon,
  StarIcon,
  ClockIcon,
  BookOpenIcon,
  BeakerIcon,
  PuzzlePieceIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TERMINAL_CHARS } from "../lib/colorUtils";
import useUsersAPI from "../components/users/hooks/useUsersAPI";
import { 
  getUserRoleBadge, 
  getExperienceBadge, 
  getAdminStatusBadge,
  getStreakStatusColor,
  formatUserDisplayName 
} from "../components/users/utils/userUtils";

const UserDetailView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { loading, error, fetchUserComplete } = useUsersAPI();

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const data = await fetchUserComplete(userId);
      setUserData(data);
    } catch (err) {
      setUserData(null);
    }
  };

  const getContentTypeIcon = (type) => {
    const icons = {
      video: BookOpenIcon,
      lab: BeakerIcon,
      game: PuzzlePieceIcon,
      document: DocumentTextIcon
    };
    return icons[type] || DocumentTextIcon;
  };

  const StatCard = ({ title, value, icon: Icon, color = "text-green-400" }) => (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-mono uppercase">{title}</p>
          <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mb-4"></div>
          <div className="text-green-400 font-mono">
            LOADING USER DETAILS...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/users')}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-green-400/30 flex items-center justify-center text-green-400 hover:text-green-300 hover:border-green-400/50 transition-all duration-300 shadow-lg hover:shadow-green-400/20"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-green-400 font-mono uppercase">USER DETAILS</h1>
          </div>
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchUserData}
              className="px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 rounded text-sm hover:bg-red-600/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/users')}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-green-400">User Details</h1>
          </div>
          <div className="text-gray-400">User not found.</div>
        </div>
      </div>
    );
  }

  const { user, enrollments, progress, achievements, stats, streakInfo, recentActivity } = userData;

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/users')}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-green-400/30 flex items-center justify-center text-green-400 hover:text-green-300 hover:border-green-400/50 transition-all duration-300 shadow-lg hover:shadow-green-400/20"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-green-400 font-mono uppercase tracking-wider">
              {TERMINAL_CHARS.BRACKET_OPEN}USER_DETAILS{TERMINAL_CHARS.BRACKET_CLOSE}
            </h1>
            <p className="text-green-400/70 text-sm font-mono">
              Detailed user information and statistics
            </p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-green-400/30 shadow-lg shadow-green-400/30 flex items-center justify-center">
                  <UsersIcon className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-400 font-mono uppercase tracking-wide">
                    {formatUserDisplayName(user)}
                  </h2>
                  <p className="text-gray-400 font-mono">{user.email}</p>
                  <p className="text-sm text-gray-500 font-mono">
                    JOINED: {new Date(user.createdAt).toLocaleDateString().toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border font-mono uppercase ${getUserRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border font-mono ${getExperienceBadge(user.experienceLevel)}`}>
                    {user.experienceLevel}
                  </span>
                </div>
                {user.adminStatus && user.role === 'admin' && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-center border font-mono uppercase ${getAdminStatusBadge(user.adminStatus)}`}>
                    {user.adminStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard
            title="Level"
            value={user.stats?.level || 1}
            icon={StarIcon}
            color="text-yellow-400"
          />
          <StatCard
            title="Total Points"
            value={user.stats?.totalPoints || 0}
            icon={TrophyIcon}
            color="text-green-400"
          />
          <StatCard
            title="Current Streak"
            value={`${streakInfo?.currentStreak || 0} days`}
            icon={FireIcon}
            color={getStreakStatusColor(streakInfo?.streakStatus)}
          />
          <StatCard
            title="Courses"
            value={user.stats?.coursesCompleted || 0}
            icon={AcademicCapIcon}
            color="text-blue-400"
          />
          <StatCard
            title="Labs"
            value={user.stats?.labsCompleted || 0}
            icon={BeakerIcon}
            color="text-purple-400"
          />
          <StatCard
            title="Achievements"
            value={user.stats?.achievementsEarned || 0}
            icon={TrophyIcon}
            color="text-orange-400"
          />
        </div>

        {/* Simple Overview Section */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wider mb-6">USER OVERVIEW</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollments Summary */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-green-400 font-mono">ENROLLMENTS ({enrollments.length})</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {enrollments.slice(0, 5).map((enrollment) => (
                  <div key={enrollment._id} className="p-3 bg-black/50 rounded-lg border border-green-400/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-green-400 font-mono">{enrollment.moduleId?.title}</h5>
                        <p className="text-sm text-gray-400 font-mono">
                          {enrollment.moduleId?.phaseId?.title}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-mono uppercase ${
                        enrollment.status === 'completed' ? 'bg-green-900/20 text-green-400' :
                        enrollment.status === 'active' ? 'bg-blue-900/20 text-blue-400' :
                        'bg-gray-900/20 text-gray-400'
                      }`}>
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-green-400 font-mono">RECENT ACTIVITY</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="p-3 bg-black/50 rounded-lg border border-green-400/20">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-green-400 font-mono">{activity.contentTitle}</p>
                        <p className="text-xs text-gray-400 font-mono">
                          {activity.moduleTitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs font-mono uppercase ${
                          activity.status === 'completed' ? 'bg-green-900/20 text-green-400' :
                          activity.status === 'in_progress' ? 'bg-yellow-900/20 text-yellow-400' :
                          'bg-gray-900/20 text-gray-400'
                        }`}>
                          {activity.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailView;