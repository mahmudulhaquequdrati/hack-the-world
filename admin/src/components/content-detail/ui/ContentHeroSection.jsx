import {
  ClockIcon,
  CubeIcon,
  ArrowLeftIcon,
  PencilIcon,
  PlayIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { Gauge } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { 
  getContentTypeIcon, 
  getContentTypeColor, 
  formatDuration 
} from "../../../utils/contentHelpers.jsx";
import { getModuleColor } from "../utils/contentDetailUtils";

/**
 * Content Hero Section Component
 * Displays content header with title, description, and key metrics
 */
const ContentHeroSection = ({ 
  content, 
  module, 
  onNavigateBack,
  onContentUrlClick,
  breadcrumbs = [],
  showEditButton = false,
  className = "" 
}) => {
  if (!content) return null;

  const contentTypeColor = getContentTypeColor(content.type);
  const moduleColor = module?.color ? getModuleColor(module.color) : "#10b981";

  // Get content action details
  const getContentActionDetails = () => {
    switch (content.type) {
      case "video":
        return { label: "Watch Video", icon: PlayIcon };
      case "lab":
        return { label: "Start Lab", icon: PlayIcon };
      case "game":
        return { label: "Play Game", icon: PlayIcon };
      case "document":
        return { label: "View Document", icon: LinkIcon };
      default:
        return { label: "View Content", icon: PlayIcon };
    }
  };

  const actionDetails = getContentActionDetails();
  const ActionIcon = actionDetails.icon;

  return (
    <div className={`relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-purple-500/10"></div>
      
      <div className="relative px-6 py-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateBack}
              className="p-2 bg-gray-700/50 rounded-lg text-green-400 hover:text-green-300 hover:bg-gray-700 transition-all"
              title="Back to content"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <nav className="text-sm text-gray-400 flex items-center">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {crumb.href ? (
                    <Link 
                      to={crumb.href} 
                      className="hover:text-green-400 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-green-400">
                      {crumb.label}
                    </span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="mx-2 text-gray-600">/</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
          {showEditButton && content.id && (
            <Link 
              to={`/content/${content.id}/edit`}
              className="px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-600/30 hover:text-green-300 transition-all flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Content
            </Link>
          )}
        </div>

        {/* Hero Content */}
        <div className="flex items-start space-x-6">
          {/* Large Content Type Icon */}
          <div
            className={`p-4 rounded-2xl border-2 backdrop-blur-sm flex items-center justify-center flex-shrink-0 ${contentTypeColor}`}
          >
            {getContentTypeIcon(content.type, "w-12 h-12")}
          </div>

          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center space-x-3 mb-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${contentTypeColor}`}>
                {content.type}
              </span>
              {content.section && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                  {content.section}
                </span>
              )}
              {(module?.difficulty || content.metadata?.difficulty) && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-orange-600/20 text-orange-400 border-orange-500/30`}>
                  {/* Capitalize difficulty properly as mentioned by user */}
                  {(module?.difficulty || content.metadata?.difficulty).charAt(0).toUpperCase() + 
                   (module?.difficulty || content.metadata?.difficulty).slice(1)}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-3 leading-tight break-words">
              {content.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mb-6">
              {content.description}
            </p>

            {/* Key Metrics */}
            <div className="flex items-center space-x-6 flex-wrap gap-y-2">
              {content.duration > 0 && (
                <div className="flex items-center text-gray-400">
                  <ClockIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    {formatDuration(content.duration)}
                  </span>
                </div>
              )}
              
              {module && (
                <div className="flex items-center text-gray-400">
                  <CubeIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">{module.title}</span>
                </div>
              )}
              
              
              {content.metadata?.estimatedTime && (
                <div className="flex items-center text-gray-400">
                  <Gauge className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    {content.metadata.estimatedTime}
                  </span>
                </div>
              )}

              {content.order && (
                <div className="flex items-center text-gray-400">
                  <span className="text-sm mr-2">#</span>
                  <span className="font-medium">
                    Order {content.order}
                  </span>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            {content.url && (
              <div className="mt-8">
                <button
                  onClick={onContentUrlClick}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ActionIcon className="w-6 h-6 mr-3" />
                  {actionDetails.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentHeroSection;