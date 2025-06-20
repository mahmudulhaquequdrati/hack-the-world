import {
  BookOpenIcon,
  LinkIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import React from "react";

/**
 * Content Resources List Component
 * Displays content instructions, resources, and metadata
 */
const ContentResourcesList = ({ 
  content, 
  processedResources = null,
  metadataBreakdown = null,
  className = "" 
}) => {
  if (!content) return null;

  const hasInstructions = Boolean(content.instructions);
  const hasResources = Boolean(content.resources && content.resources.length > 0);
  const hasMetadata = Boolean(metadataBreakdown?.hasAnyMetadata);

  // If nothing to display, return null
  if (!hasInstructions && !hasResources && !hasMetadata) {
    return null;
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Instructions Section */}
      {hasInstructions && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Instructions
            </h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
              {content.instructions}
            </div>
          </div>
        </div>
      )}

      {/* Resources Section */}
      {hasResources && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <LinkIcon className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Resources{" "}
              <span className="text-gray-400 text-lg">
                ({content.resources.length})
              </span>
            </h2>
          </div>
          <div className="grid gap-4">
            {content.resources.map((resource, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-gray-700/50 rounded-xl border border-gray-600/50 hover:bg-gray-700 transition-colors"
              >
                <div className="p-2 bg-purple-600/20 rounded-lg mr-4">
                  <LinkIcon className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-gray-300 font-medium">
                  {resource}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Section */}
      {hasMetadata && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <StarIcon className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Metadata</h2>
          </div>
          
          <div className="space-y-6">
            {/* Difficulty and Estimated Time */}
            {(metadataBreakdown.difficulty || metadataBreakdown.estimatedTime) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metadataBreakdown.difficulty && (
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
                    <span className="text-gray-400 text-sm block mb-1">Difficulty</span>
                    <span className="text-white font-medium text-lg">
                      {metadataBreakdown.difficulty}
                    </span>
                  </div>
                )}
                {metadataBreakdown.estimatedTime && (
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
                    <span className="text-gray-400 text-sm block mb-1">Estimated Time</span>
                    <span className="text-white font-medium text-lg">
                      {metadataBreakdown.estimatedTime}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {metadataBreakdown.tags && metadataBreakdown.tags.length > 0 && (
              <div>
                <span className="text-gray-400 text-sm block mb-3">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {metadataBreakdown.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-600/50 rounded-full text-sm text-gray-300 border border-gray-600/30"
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
                <span className="text-gray-400 text-sm block mb-3">Prerequisites</span>
                <div className="space-y-2">
                  {metadataBreakdown.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex items-center text-white text-sm">
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
                <span className="text-gray-400 text-sm block mb-3">Tools Required</span>
                <div className="flex flex-wrap gap-2">
                  {metadataBreakdown.tools.map((tool, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm border border-blue-600/30"
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
                <span className="text-gray-400 text-sm block mb-3">Learning Objectives</span>
                <div className="space-y-2">
                  {metadataBreakdown.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start text-white text-sm">
                      <span className="text-green-400 mr-2 mt-1 text-xs">{index + 1}.</span>
                      <span className="flex-1">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentResourcesList;