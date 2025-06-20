import {
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  ArrowLeftIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Gauge } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { getIconFromName } from "../../../lib/iconUtils";
import { formatDuration } from "../../../utils/contentHelpers.jsx";
import { getColorValue, getDifficultyBadgeStyle } from "../utils/moduleDetailUtils";

/**
 * Module Hero Section Component
 * Displays module header with title, description, and key metrics
 */
const ModuleHeroSection = ({ 
  module, 
  phase, 
  statistics,
  onNavigateBack,
  breadcrumbs = [],
  showEditButton = false,
  className = "" 
}) => {
  if (!module) return null;

  const ModuleIcon = getIconFromName(module.icon);
  const moduleColor = getColorValue(module.color);
  const difficultyStyle = getDifficultyBadgeStyle(module.difficulty);

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
              title="Back to modules"
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
          {showEditButton && (
            <Link 
              to="/modules" 
              className="px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-600/30 hover:text-green-300 transition-all flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Module
            </Link>
          )}
        </div>

        {/* Hero Content */}
        <div className="flex items-start space-x-6">
          {/* Large Module Icon */}
          <div
            className="p-4 rounded-2xl border-2 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: `${moduleColor}30`,
              borderColor: `${moduleColor}50`,
            }}
          >
            <ModuleIcon
              className="w-12 h-12"
              style={{ color: moduleColor }}
            />
          </div>

          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center space-x-3 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-900/30 text-blue-400 border border-blue-500/30">
                Module
              </span>
              {module.difficulty && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${difficultyStyle.className}`}
                >
                  {difficultyStyle.label}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-3 leading-tight break-words">
              {module.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mb-6">
              {module.description}
            </p>

            {/* Key Metrics */}
            <div className="flex items-center space-x-6 flex-wrap gap-y-2">
              {statistics?.totalContent > 0 && (
                <div className="flex items-center text-gray-400">
                  <BookOpenIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    {statistics.totalContent} Content
                  </span>
                </div>
              )}
              
              {statistics?.totalDuration > 0 && (
                <div className="flex items-center text-gray-400">
                  <ClockIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    {formatDuration(statistics.totalDuration)}
                  </span>
                </div>
              )}
              
              {phase && (
                <div className="flex items-center text-gray-400">
                  <StarIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">{phase.title}</span>
                </div>
              )}
              
              {module.content?.estimatedHours && (
                <div className="flex items-center text-gray-400">
                  <Gauge className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    {module.content.estimatedHours}h est.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleHeroSection;