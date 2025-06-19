import { BookOpenIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import { formatDuration } from "../../../utils/contentHelpers.jsx";
import ContentCard from "./ContentCard";

/**
 * Content Sections List Component
 * Displays content organized by sections with statistics
 */
const ContentSectionsList = ({ 
  processedSections, 
  totalContentCount = 0,
  onContentClick = null,
  className = ""
}) => {
  if (!processedSections || Object.keys(processedSections).length === 0) {
    return (
      <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl ${className}`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <BookOpenIcon className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Content by Sections
            <span className="text-gray-400 text-lg ml-2">(0 total)</span>
          </h2>
        </div>

        <div className="text-center text-gray-400 py-8">
          <BookOpenIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No content found in this module.</p>
          <p className="text-sm">
            <Link
              to="/content"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Create new content
            </Link>{" "}
            to get started.
          </p>
        </div>
      </div>
    );
  }

  const sectionEntries = Object.entries(processedSections);

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <BookOpenIcon className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Content by Sections
          <span className="text-gray-400 text-lg ml-2">
            ({totalContentCount} total)
          </span>
        </h2>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sectionEntries.map(([sectionName, sectionData]) => (
          <div key={sectionName} id={`section-${sectionName}`} className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-600/50">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-semibold text-white">
                  {sectionName}
                </h3>
                <span className="px-3 py-1 bg-gray-600/50 rounded-full text-sm text-gray-300">
                  {sectionData.count} items
                </span>
              </div>
              
              {/* Section Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                {sectionData.totalDuration > 0 && (
                  <span className="flex items-center space-x-1">
                    <span>Duration:</span>
                    <span className="text-white font-medium">
                      {formatDuration(sectionData.totalDuration)}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Section Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sectionData.items.map((item) => (
                <ContentCard
                  key={item.id}
                  content={item}
                  onContentClick={onContentClick}
                  showSection={false} // Don't show section since we're already in section context
                />
              ))}
            </div>

            {/* Section Summary */}
            {sectionData.items.length > 3 && (
              <div className="mt-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Section "{sectionName}" contains {sectionData.count} content items
                  </span>
                  <Link
                    to={`/content?section=${encodeURIComponent(sectionName)}`}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    View all in section →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sections Overview */}
      {sectionEntries.length > 1 && (
        <div className="mt-8 pt-6 border-t border-gray-600/50">
          <h4 className="text-lg font-semibold text-white mb-4">Sections Overview</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectionEntries.map(([sectionName, sectionData]) => (
              <div
                key={`overview-${sectionName}`}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white truncate" title={sectionName}>
                    {sectionName}
                  </h5>
                  <span className="text-green-400 font-semibold">
                    {sectionData.count}
                  </span>
                </div>
                
                {sectionData.totalDuration > 0 && (
                  <div className="text-sm text-gray-400">
                    {formatDuration(sectionData.totalDuration)}
                  </div>
                )}
                
                <button
                  onClick={() => {
                    const element = document.getElementById(`section-${sectionName}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Jump to section ↑
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentSectionsList;