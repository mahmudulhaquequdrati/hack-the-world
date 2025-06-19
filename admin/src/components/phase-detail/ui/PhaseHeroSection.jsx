import {
  ArrowLeftIcon,
  CubeIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import { getIconFromName } from "../../../lib/iconUtils";
import { createBreadcrumbs } from "../utils/phaseDetailUtils";

const PhaseHeroSection = ({ 
  phase, 
  statistics, 
  onNavigateBack,
  showEditButton = true,
  className = ""
}) => {
  if (!phase) return null;

  const breadcrumbs = createBreadcrumbs(phase);

  return (
    <div className={`relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-purple-500/10"></div>
      <div className="relative px-6 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateBack}
              className="p-2 bg-gray-700/50 rounded-lg text-green-400 hover:text-green-300 hover:bg-gray-700 transition-all"
              title="Back to phases"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <nav className="text-sm text-gray-400 flex items-center">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {crumb.path ? (
                    <Link 
                      to={crumb.path} 
                      className="hover:text-green-400 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={crumb.active ? "text-green-400" : "text-gray-400"}>
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
              to="/phases" 
              className="px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-600/30 hover:text-green-300 transition-all flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Phase
            </Link>
          )}
        </div>

        {/* Hero Content */}
        <div className="flex items-start space-x-6">
          {/* Large Phase Icon */}
          <div
            className="p-4 rounded-2xl border-2 backdrop-blur-sm flex items-center justify-center"
            style={{
              backgroundColor: `${phase.color || "green"}30`,
              borderColor: `${phase.color || "green"}50`,
            }}
          >
            {(() => {
              const PhaseIcon = getIconFromName(phase.icon);
              return (
                <PhaseIcon
                  className="w-12 h-12"
                  style={{ color: phase.color || "green" }}
                />
              );
            })()}
          </div>

          {/* Title and Meta */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-900/30 text-purple-400 border border-purple-500/30">
                Phase
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-600/50 text-gray-300">
                #{phase.order}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
              {phase.title}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
              {phase.description}
            </p>

            {/* Key Metrics */}
            <div className="flex items-center space-x-6 mt-6">
              <div className="flex items-center text-gray-400">
                <CubeIcon className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {statistics.totalModules} Module{statistics.totalModules !== 1 ? 's' : ''}
                </span>
              </div>
              {statistics.totalEstimatedHours > 0 && (
                <div className="flex items-center text-gray-400">
                  <span className="mr-2">⏱️</span>
                  <span className="font-medium">
                    {statistics.totalEstimatedHours}h total
                  </span>
                </div>
              )}
              <div className="flex items-center text-gray-400">
                <span className="text-xs px-2 py-1 bg-gray-600/50 rounded text-gray-300 uppercase">
                  #{phase.order}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseHeroSection;