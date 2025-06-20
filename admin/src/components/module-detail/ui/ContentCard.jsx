import { EyeIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import {
  formatDuration,
  getContentTypeColor,
  getContentTypeIcon,
} from "../../../utils/contentHelpers.jsx";

/**
 * Content Card Component
 * Displays individual content item with type-specific styling
 */
const ContentCard = ({
  content,
  className = "",
  showSection = false,
  onContentClick = null,
}) => {
  if (!content) return null;

  const handleCardClick = () => {
    if (onContentClick) {
      onContentClick(content);
    }
  };

  const handleViewClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking view button
  };

  return (
    <div
      className={`p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Content Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Content Type Icon */}
          <div
            className={`p-2 rounded-lg border flex-shrink-0 ${getContentTypeColor(
              content.type
            )}`}
          >
            {getContentTypeIcon(content.type, "w-5 h-5")}
          </div>

          {/* Content Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium group-hover:text-green-400 transition-colors leading-tight truncate">
              {content.title}
            </h4>

            {/* Content Meta */}
            <div className="flex items-center space-x-2 mt-1 flex-wrap">
              {content.duration > 0 && (
                <span className="text-gray-400 text-xs">
                  {formatDuration(content.duration)}
                </span>
              )}

              {showSection && content.section && (
                <span className="text-xs px-2 py-1 bg-blue-600/20 rounded text-blue-400">
                  {content.section}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View Button */}
        <Link
          to={`/content/${content._id}`}
          className="p-2 bg-green-600/20 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-600/30 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
          title="View Details"
          onClick={handleViewClick}
        >
          <EyeIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* Content Description */}
      {content.description && (
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
          {content.description}
        </p>
      )}

      {/* Content Footer */}
      <div className="flex items-center justify-between ">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {content.order && (
            <span className="px-2 py-1 bg-gray-700/50 rounded">
              #{content.order}
            </span>
          )}

          {content.isActive !== undefined && (
            <span
              className={`px-2 py-1 rounded ${
                content.isActive
                  ? "bg-green-600/20 text-green-400"
                  : "bg-red-600/20 text-red-400"
              }`}
            >
              {content.isActive ? "Active" : "Inactive"}
            </span>
          )}
        </div>

        {/* Additional Metadata */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {content.createdAt && (
            <span
              title={`Created: ${new Date(
                content.createdAt
              ).toLocaleDateString()}`}
            >
              {new Date(content.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
