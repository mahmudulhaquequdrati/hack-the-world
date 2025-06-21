import { EyeIcon, UsersIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import { formatUserDisplayName } from "../utils/userUtils";
import { getUserRoleColorClasses, getExperienceLevelColorClasses } from "../constants/userConstants";

const UserCard = ({ user, viewMode }) => {
  const colors = getUserRoleColorClasses(user.role);
  const experienceColors = getExperienceLevelColorClasses(user.experienceLevel);

  if (viewMode === "grid") {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border-2 p-6 group transition-all duration-300 hover:scale-105 hover:shadow-lg ${colors.border} ${colors.bg} ${colors.hoverBorder} ${colors.hoverShadow}`}
      >
        {/* Glow Effect */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${colors.glow}`}
        ></div>

        {/* Status Indicators */}
        <div className="absolute top-2 left-2 flex space-x-1">
          <div
            className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${
              user.role === 'admin' ? 'bg-red-400 shadow-red-400/50' : 'bg-blue-400 shadow-blue-400/50'
            }`}
          ></div>
        </div>

        {/* User Level Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm ${colors.badge}`}>
            {user.stats?.level || 1}
          </div>
        </div>

        <div className="relative z-10">
          {/* User Icon */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`${colors.icon} flex items-center justify-center group-hover:animate-pulse`}>
              <UsersIcon className={`w-6 h-6 ${colors.iconText}`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold font-mono uppercase tracking-wide truncate ${colors.text} ${colors.hoverText} transition-colors`}>
                {formatUserDisplayName(user)}
              </h3>
              <p className="text-gray-400 text-sm font-mono truncate">{user.email}</p>
            </div>
          </div>

          {/* User Stats */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm font-mono">Role:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium border font-mono uppercase ${
                user.role === 'admin' ? 'bg-red-400/20 text-red-400 border-red-400' : 'bg-blue-400/20 text-blue-400 border-blue-400'
              }`}>
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm font-mono">Level:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium border font-mono ${experienceColors.badge}`}>
                {user.experienceLevel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm font-mono">Points:</span>
              <span className={`font-bold font-mono ${colors.text}`}>
                {user.stats?.totalPoints || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm font-mono">Streak:</span>
              <span className={`font-bold font-mono ${colors.text}`}>
                {user.stats?.currentStreak || 0} days
              </span>
            </div>
          </div>

          {/* Joined Date */}
          <div className="text-center mb-4">
            <p className="text-gray-500 text-xs font-mono">
              JOINED: {new Date(user.createdAt).toLocaleDateString().toUpperCase()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-2">
            <Link
              to={`/users/${user._id}`}
              className={`flex-1 h-10 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-green-400 hover:text-green-300 shadow-lg hover:shadow-green-400/20 font-mono text-sm uppercase tracking-wide`}
              title="View User Details"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              VIEW
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // List view for desktop table
  return (
    <tr
      className={`border-b border-green-400/20 hover:bg-gradient-to-r hover:from-green-900/20 hover:to-green-800/20 transition-all duration-300 group bg-gradient-to-r ${
        user._id % 2 === 0
          ? "from-gray-900/30 to-gray-800/30"
          : "from-gray-800/30 to-gray-900/30"
      }`}
    >
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 shadow-lg transition-all duration-300 group-hover:scale-110 ${colors.icon}`}>
            <UsersIcon className={`w-5 h-5 ${colors.iconText}`} />
          </div>
          <div>
            <div className={`font-bold font-mono uppercase tracking-wider ${colors.text} ${colors.hoverText} transition-colors`}>
              {formatUserDisplayName(user)}
            </div>
            <div className="text-gray-400 text-sm font-mono">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`px-2 py-1 rounded text-xs font-medium border font-mono uppercase ${
          user.role === 'admin' ? 'bg-red-400/20 text-red-400 border-red-400' : 'bg-blue-400/20 text-blue-400 border-blue-400'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="p-4">
        <span className={`px-2 py-1 rounded text-xs font-medium border font-mono ${experienceColors.badge}`}>
          {user.experienceLevel}
        </span>
      </td>
      <td className="p-4">
        <div className={`font-bold font-mono text-lg ${colors.text}`}>
          {user.stats?.level || 1}
        </div>
      </td>
      <td className="p-4">
        <div className={`font-bold font-mono text-lg ${colors.text}`}>
          {user.stats?.totalPoints || 0}
        </div>
      </td>
      <td className="p-4">
        <div className="flex justify-center gap-2">
          <Link
            to={`/users/${user._id}`}
            className="p-3 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-300 rounded-lg text-green-400 hover:text-green-300 shadow-lg hover:shadow-green-400/20"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default UserCard;