import {
  BookOpenIcon,
  LinkIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import React from "react";

/**
 * Content Resources List Component
 * Displays content instructions, resources, and metadata
 */
const ContentResourcesList = ({ 
  content, 
  outcomesBreakdown = null,
  className = "" 
}) => {
  if (!content) return null;

  const hasInstructions = Boolean(content.instructions);
  const hasResources = Boolean(content.resources && content.resources.length > 0);
  const hasOutcomes = Boolean(outcomesBreakdown?.hasAnyOutcomes);

  // If nothing to display, return null
  if (!hasInstructions && !hasResources && !hasOutcomes) {
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
            {content.resources.map((resource, index) => {
              // Handle both old string format and new object format
              const isObject = typeof resource === 'object' && resource !== null;
              const resourceName = isObject ? resource.name : resource;
              const resourceType = isObject ? resource.type : 'text';
              const resourceUrl = isObject ? resource.url : null;
              const resourceDescription = isObject ? resource.description : null;
              
              return (
                <div
                  key={index}
                  className="p-4 bg-gray-700/50 rounded-xl border border-gray-600/50 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <LinkIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-gray-300 font-medium">
                          {resourceName}
                        </span>
                        {isObject && (
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-md border border-purple-600/30">
                            {resourceType}
                          </span>
                        )}
                      </div>
                      {resourceDescription && (
                        <p className="text-gray-400 text-sm mb-2">
                          {resourceDescription}
                        </p>
                      )}
                      {resourceUrl && (
                        <a
                          href={resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 text-sm underline"
                        >
                          Open Resource
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* Learning Outcomes Section */}
      {hasOutcomes && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-emerald-600/20 rounded-lg">
              <AcademicCapIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Learning Outcomes{" "}
              <span className="text-gray-400 text-lg">
                ({outcomesBreakdown.totalOutcomes})
              </span>
            </h2>
          </div>
          <div className="grid gap-6">
            {outcomesBreakdown.outcomes.map((outcome, index) => (
              <div
                key={index}
                className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50 hover:bg-gray-700/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {outcome.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {outcome.description}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    {outcome.category && (
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        outcome.category === 'primary' 
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-600/30'
                          : 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                      }`}>
                        {outcome.category.charAt(0).toUpperCase() + outcome.category.slice(1)}
                      </span>
                    )}
                    {outcome.difficulty && (
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        outcome.difficulty === 'beginner' 
                          ? 'bg-green-600/20 text-green-300 border border-green-600/30'
                          : outcome.difficulty === 'intermediate'
                          ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/30'
                          : 'bg-orange-600/20 text-orange-300 border border-orange-600/30'
                      }`}>
                        {outcome.difficulty.charAt(0).toUpperCase() + outcome.difficulty.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
                
                {outcome.skills && outcome.skills.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-400 text-sm block mb-2">Skills Covered:</span>
                    <div className="flex flex-wrap gap-2">
                      {outcome.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-gray-600/50 rounded-md text-sm text-gray-300 border border-gray-600/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentResourcesList;