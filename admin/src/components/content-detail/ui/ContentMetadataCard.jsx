import { StarIcon } from "@heroicons/react/24/outline";
import React from "react";

/**
 * Content Metadata Card Component
 * Displays content metadata in the sidebar
 */
const ContentMetadataCard = ({ 
  metadataBreakdown = null,
  className = "" 
}) => {
  if (!metadataBreakdown?.hasAnyMetadata) return null;

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-orange-600/20 rounded-lg">
          <StarIcon className="w-5 h-5 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Metadata</h2>
      </div>
      
      <div className="space-y-4">
        {/* Difficulty and Estimated Time */}
        {(metadataBreakdown.difficulty || metadataBreakdown.estimatedTime) && (
          <div className="grid grid-cols-1 gap-3">
            {metadataBreakdown.difficulty && (
              <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <span className="text-gray-400 text-xs block mb-1">Difficulty</span>
                <span className="text-white font-medium">
                  {metadataBreakdown.difficulty}
                </span>
              </div>
            )}
            {metadataBreakdown.estimatedTime && (
              <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <span className="text-gray-400 text-xs block mb-1">Estimated Time</span>
                <span className="text-white font-medium">
                  {metadataBreakdown.estimatedTime}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {metadataBreakdown.tags && metadataBreakdown.tags.length > 0 && (
          <div>
            <span className="text-gray-400 text-xs block mb-2">Tags</span>
            <div className="flex flex-wrap gap-1">
              {metadataBreakdown.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-600/50 rounded-full text-xs text-gray-300 border border-gray-600/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {metadataBreakdown.prerequisites && metadataBreakdown.prerequisites.length > 0 && (
          <div>
            <span className="text-gray-400 text-xs block mb-2">Prerequisites</span>
            <div className="space-y-1">
              {metadataBreakdown.prerequisites.map((prereq, index) => (
                <div key={index} className="flex items-center text-white text-xs">
                  <span className="text-orange-400 mr-2">•</span>
                  {prereq}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools */}
        {metadataBreakdown.tools && metadataBreakdown.tools.length > 0 && (
          <div>
            <span className="text-gray-400 text-xs block mb-2">Tools Required</span>
            <div className="flex flex-wrap gap-1">
              {metadataBreakdown.tools.map((tool, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-md text-xs border border-blue-600/30"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        {metadataBreakdown.objectives && metadataBreakdown.objectives.length > 0 && (
          <div>
            <span className="text-gray-400 text-xs block mb-2">Learning Objectives</span>
            <div className="space-y-1">
              {metadataBreakdown.objectives.map((objective, index) => (
                <div key={index} className="flex items-start text-white text-xs">
                  <span className="text-green-400 mr-2 mt-0.5 text-xs">{index + 1}.</span>
                  <span className="flex-1">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentMetadataCard;