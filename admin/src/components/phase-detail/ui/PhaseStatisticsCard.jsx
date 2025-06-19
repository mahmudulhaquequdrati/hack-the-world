import { CubeIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";
import React from "react";
import { getDifficultyBadgeStyle } from "../utils/phaseDetailUtils";

const PhaseStatisticsCard = ({ 
  statistics, 
  className = "",
  showDetailedStats = true 
}) => {
  if (!statistics) return null;

  const difficultyStats = [
    { key: 'beginnerModules', label: 'Beginner', difficulty: 'beginner' },
    { key: 'intermediateModules', label: 'Intermediate', difficulty: 'intermediate' },
    { key: 'advancedModules', label: 'Advanced', difficulty: 'advanced' },
    { key: 'expertModules', label: 'Expert', difficulty: 'expert' },
  ].filter(stat => statistics[stat.key] > 0);

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl ${className}`}>
      {/* Main Statistics */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-blue-600/20 rounded-xl">
          <CubeIcon className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <p className="text-lg text-gray-400 font-medium">Total Modules in Phase</p>
          <p className="text-4xl font-bold text-white">
            {statistics.totalModules}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Modules available in this learning phase
          </p>
        </div>
      </div>

      {showDetailedStats && statistics.totalModules > 0 && (
        <>
          {/* Time Statistics */}
          {statistics.totalEstimatedHours > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Estimated Time</p>
                  <p className="text-sm text-gray-400">Total learning duration</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {statistics.totalEstimatedHours}h
                </p>
                {statistics.averageEstimatedHours > 0 && (
                  <p className="text-sm text-gray-400">
                    ~{statistics.averageEstimatedHours}h avg
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Difficulty Distribution */}
          {difficultyStats.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <ChartBarIcon className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="text-white font-medium">Difficulty Distribution</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {difficultyStats.map(({ key, label, difficulty }) => {
                  const count = statistics[key];
                  const percentage = Math.round((count / statistics.totalModules) * 100);
                  const difficultyStyle = getDifficultyBadgeStyle(difficulty);
                  
                  return (
                    <div 
                      key={key}
                      className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span 
                          className={`text-xs px-2 py-1 rounded-full font-medium border ${difficultyStyle.className}`}
                        >
                          {label}
                        </span>
                        <span className="text-white font-bold">{count}</span>
                      </div>
                      <div className="w-full bg-gray-600/50 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: difficultyStyle.className.includes('green') ? '#22c55e' :
                                            difficultyStyle.className.includes('yellow') ? '#eab308' :
                                            difficultyStyle.className.includes('red') ? '#ef4444' : '#8b5cf6'
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{percentage}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {statistics.totalModules === 0 && (
        <div className="text-center py-8">
          <CubeIcon className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
          <p className="text-gray-400 mb-2">No modules in this phase yet</p>
          <p className="text-sm text-gray-500">
            Add modules to see detailed statistics
          </p>
        </div>
      )}
    </div>
  );
};

export default PhaseStatisticsCard;