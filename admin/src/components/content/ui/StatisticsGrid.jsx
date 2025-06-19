import React from 'react';
import { calculateContentStats, formatDuration } from '../utils/contentUtils';

const StatisticsGrid = ({ content, contentTypes }) => {
  const stats = calculateContentStats(content, contentTypes);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total Content */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
        <div className="relative z-10">
          <div className="text-2xl font-bold text-green-400 font-mono">
            {stats.total}
          </div>
          <div className="text-sm text-gray-400 font-mono">Total Content</div>
        </div>
      </div>

      {/* Total Duration */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-cyan-400/30 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 animate-pulse"></div>
        <div className="relative z-10">
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {formatDuration(stats.totalDuration)}
          </div>
          <div className="text-sm text-gray-400 font-mono">Total Duration</div>
        </div>
      </div>

      {/* Published */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-blue-400/30 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 animate-pulse"></div>
        <div className="relative z-10">
          <div className="text-2xl font-bold text-blue-400 font-mono">
            {stats.published}
          </div>
          <div className="text-sm text-gray-400 font-mono">Published</div>
        </div>
      </div>

      {/* Unpublished */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-yellow-400/30 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 animate-pulse"></div>
        <div className="relative z-10">
          <div className="text-2xl font-bold text-yellow-400 font-mono">
            {stats.unpublished}
          </div>
          <div className="text-sm text-gray-400 font-mono">Unpublished</div>
        </div>
      </div>

      {/* Content by Type */}
      {contentTypes.map((type) => (
        <div
          key={type.value}
          className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-purple-400/30 rounded-xl p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">{type.icon}</span>
              <div className="text-lg font-bold text-purple-400 font-mono">
                {stats.byType[type.value] || 0}
              </div>
            </div>
            <div className="text-sm text-gray-400 font-mono">{type.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsGrid;