import {
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  PlayIcon,
  BeakerIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { formatDuration } from "../../../utils/contentHelpers.jsx";

/**
 * Module Statistics Card Component
 * Displays comprehensive statistics about module content
 */
const ModuleStatisticsCard = ({ 
  statistics, 
  className = "" 
}) => {
  if (!statistics) return null;

  const getContentTypeIcon = (type) => {
    const icons = {
      video: PlayIcon,
      lab: BeakerIcon,
      game: PuzzlePieceIcon,
      document: DocumentTextIcon,
    };
    return icons[type] || DocumentTextIcon;
  };

  const getContentTypeColor = (type) => {
    const colors = {
      video: "text-blue-400",
      lab: "text-green-400",
      game: "text-purple-400",
      document: "text-yellow-400",
    };
    return colors[type] || "text-gray-400";
  };

  const contentTypes = [
    { type: 'video', label: 'Videos', count: statistics.videoCount || 0 },
    { type: 'lab', label: 'Labs', count: statistics.labCount || 0 },
    { type: 'game', label: 'Games', count: statistics.gameCount || 0 },
    { type: 'document', label: 'Documents', count: statistics.documentCount || 0 },
  ].filter(item => item.count > 0);

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <ChartBarIcon className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Content Statistics</h3>
      </div>

      {/* Statistics Grid */}
      <div className="space-y-4">
        {/* Total Content */}
        <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
          <span className="text-gray-400 text-sm font-medium">Total Content</span>
          <span className="text-white font-bold text-lg">
            {statistics.totalContent || 0}
          </span>
        </div>

        {/* Total Duration */}
        {statistics.totalDuration > 0 && (
          <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
            <div className="flex items-center text-gray-400 text-sm font-medium">
              <ClockIcon className="w-4 h-4 mr-2" />
              Total Duration
            </div>
            <span className="text-white font-semibold">
              {formatDuration(statistics.totalDuration)}
            </span>
          </div>
        )}

        {/* Average Duration */}
        {statistics.averageDuration > 0 && (
          <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
            <span className="text-gray-400 text-sm font-medium">Avg. Duration</span>
            <span className="text-white font-semibold">
              {formatDuration(statistics.averageDuration)}
            </span>
          </div>
        )}

        {/* Content Types Breakdown */}
        {contentTypes.length > 0 && (
          <div className="pt-2">
            <h4 className="text-gray-300 text-sm font-semibold mb-3">Content Types</h4>
            <div className="space-y-3">
              {contentTypes.map(({ type, label, count }) => {
                const IconComponent = getContentTypeIcon(type);
                const colorClass = getContentTypeColor(type);
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-4 h-4 ${colorClass}`} />
                      <span className="text-gray-400 text-sm">{label}</span>
                    </div>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {statistics.totalContent === 0 && (
          <div className="text-center py-6">
            <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400 text-sm">No content statistics available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleStatisticsCard;