import React, { useState } from 'react';
import { Module } from '@/lib/types';
import { getIconFromName } from '@/lib/iconUtils';
import { 
  BookOpen, 
  Clock, 
  Play, 
  Star, 
  UserCheck, 
  Zap, 
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Trophy
} from 'lucide-react';

interface EnhancedDiscoverSectionProps {
  availableModules: Module[];
  onModuleClick: (module: Module) => void;
}

export const EnhancedDiscoverSection = ({
  availableModules,
  onModuleClick
}: EnhancedDiscoverSectionProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Categorize available modules by difficulty
  const categorizedModules = {
    beginner: availableModules.filter(m => m.difficulty === "Beginner"),
    intermediate: availableModules.filter(m => m.difficulty === "Intermediate"),
    advanced: availableModules.filter(m => m.difficulty === "Advanced"),
  };

  // Filter modules based on search and category
  const filteredModules = availableModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || 
                         module.difficulty.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "green";
      case "intermediate": return "yellow";
      case "advanced": return "red";
      default: return "gray";
    }
  };

  const renderCourseCard = (module: Module) => {
    const ModuleIcon = getIconFromName(module.icon);
    const colorName = getDifficultyColor(module.difficulty);
    
    const stats = {
      videos: module.content?.videos?.length || 0,
      labs: module.labs || 0,
      games: module.games || 0,
    };

    if (viewMode === 'list') {
      return (
        <div
          key={module._id}
          className="group cursor-pointer bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-700/50 rounded-lg p-4 hover:border-cyan-400/50 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-cyan-800/10"
          onClick={() => onModuleClick(module)}
        >
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-lg bg-${colorName}-900/20 border border-${colorName}-400/30 flex items-center justify-center group-hover:animate-pulse`}>
              <ModuleIcon className={`w-6 h-6 text-${colorName}-400`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="text-lg font-bold text-white font-mono truncate group-hover:text-cyan-400 transition-colors">
                  {module.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-mono rounded border bg-${colorName}-900/20 border-${colorName}-400/30 text-${colorName}-400`}>
                  {module.difficulty}
                </span>
              </div>
              <p className="text-gray-400 text-sm line-clamp-1 font-mono">
                {module.description}
              </p>
            </div>

            {/* Stats */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{module.content?.estimatedHours || "2h"}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-blue-400">
                <Play className="w-3 h-3" />
                <span>{stats.videos}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-yellow-400">
                <Zap className="w-3 h-3" />
                <span>{stats.labs}</span>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
          </div>
        </div>
      );
    }

    // Grid view
    return (
      <div
        key={module._id}
        className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
        onClick={() => onModuleClick(module)}
      >
        <div className="relative overflow-hidden rounded-xl border-2 bg-gradient-to-br from-black/95 via-gray-900/90 to-black/95 border-gray-700/50 shadow-lg group-hover:border-cyan-400/50 group-hover:shadow-cyan-400/20">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Header */}
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 rounded-xl bg-${colorName}-900/20 border-2 border-${colorName}-400/30 flex items-center justify-center group-hover:animate-pulse`}>
                <ModuleIcon className={`w-8 h-8 text-${colorName}-400`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-white font-mono truncate group-hover:text-cyan-400 transition-colors">
                    {module.title}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-mono rounded-full border bg-${colorName}-900/20 border-${colorName}-400/30 text-${colorName}-400 animate-pulse`}>
                    {module.difficulty}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed font-mono line-clamp-2">
                  {module.description}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-6 pb-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-3 text-center">
                <Clock className="w-4 h-4 mx-auto mb-1 text-green-400" />
                <div className="text-green-400 font-mono text-sm font-bold">
                  {module.content?.estimatedHours || "2h"}
                </div>
              </div>
              <div className="bg-gray-900/50 border border-blue-400/20 rounded-lg p-3 text-center">
                <Play className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                <div className="text-blue-400 font-mono text-sm font-bold">
                  {stats.videos}
                </div>
              </div>
              <div className="bg-gray-900/50 border border-yellow-400/20 rounded-lg p-3 text-center">
                <Zap className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
                <div className="text-yellow-400 font-mono text-sm font-bold">
                  {stats.labs}
                </div>
              </div>
              <div className="bg-gray-900/50 border border-red-400/20 rounded-lg p-3 text-center">
                <Star className="w-4 h-4 mx-auto mb-1 text-red-400" />
                <div className="text-red-400 font-mono text-sm font-bold">
                  {stats.games}
                </div>
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {module.topics?.slice(0, 3).map((topic, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono border rounded-full px-2 py-1 bg-gray-900/50 border-cyan-400/30 text-cyan-400"
                >
                  {topic.toUpperCase()}
                </span>
              ))}
              {module.topics && module.topics.length > 3 && (
                <span className="text-xs font-mono border rounded-full px-2 py-1 bg-gray-900/50 border-gray-400/30 text-gray-400">
                  +{module.topics.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="px-6 pb-6">
            <button className="w-full h-12 font-mono uppercase tracking-wider text-sm font-bold bg-gradient-to-r from-cyan-600 to-cyan-500 border-2 border-cyan-400 text-black hover:from-cyan-500 hover:to-cyan-400 transition-all duration-300 rounded-lg">
              <span className="flex items-center justify-center space-x-2">
                <UserCheck className="w-4 h-4" />
                <span>ENROLL NOW</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black/60 border border-cyan-400/30 rounded-xl p-6 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent bg-[length:100%_4px] animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-mono text-sm">~/dashboard/discover/</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h3 className="text-2xl font-bold text-cyan-400 font-mono uppercase tracking-wider">
            DISCOVER_NEW_COURSES
          </h3>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white font-mono text-sm focus:border-cyan-400/50 focus:outline-none w-64"
              />
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-600/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-all ${viewMode === 'grid' 
                  ? 'bg-cyan-400 text-black' 
                  : 'bg-gray-900/50 text-gray-400 hover:text-cyan-400'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-all ${viewMode === 'list' 
                  ? 'bg-cyan-400 text-black' 
                  : 'bg-gray-900/50 text-gray-400 hover:text-cyan-400'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg px-4 py-3 text-center">
            <div className="text-cyan-400 font-mono text-sm">TOTAL</div>
            <div className="text-cyan-300 font-mono text-xl font-bold">{availableModules.length}</div>
          </div>
          <div className="bg-green-400/10 border border-green-400/30 rounded-lg px-4 py-3 text-center">
            <div className="text-green-400 font-mono text-sm">BEGINNER</div>
            <div className="text-green-300 font-mono text-xl font-bold">{categorizedModules.beginner.length}</div>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-3 text-center">
            <div className="text-yellow-400 font-mono text-sm">INTERMEDIATE</div>
            <div className="text-yellow-300 font-mono text-xl font-bold">{categorizedModules.intermediate.length}</div>
          </div>
          <div className="bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3 text-center">
            <div className="text-red-400 font-mono text-sm">ADVANCED</div>
            <div className="text-red-300 font-mono text-xl font-bold">{categorizedModules.advanced.length}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3">
          {[
            { key: "all", label: "ALL_LEVELS", count: availableModules.length, color: "cyan" },
            { key: "beginner", label: "BEGINNER", count: categorizedModules.beginner.length, color: "green" },
            { key: "intermediate", label: "INTERMEDIATE", count: categorizedModules.intermediate.length, color: "yellow" },
            { key: "advanced", label: "ADVANCED", count: categorizedModules.advanced.length, color: "red" }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-4 py-2 rounded-lg border-2 font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
                selectedFilter === filter.key
                  ? `bg-${filter.color}-400 text-black border-${filter.color}-400 shadow-lg shadow-${filter.color}-400/30`
                  : `bg-black/40 text-${filter.color}-400 border-${filter.color}-400/30 hover:border-${filter.color}-400/50 hover:bg-${filter.color}-400/10`
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Course List */}
      <div className="relative z-10">
        {filteredModules.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-black/60 border border-red-400/30 rounded-xl p-8">
              <Trophy className="w-16 h-16 text-red-400/50 mx-auto mb-4" />
              <h4 className="text-red-400 font-mono text-lg mb-2 uppercase tracking-wider">
                NO_COURSES_FOUND
              </h4>
              <p className="text-red-300/60 font-mono text-sm">
                No courses match your current filters
              </p>
            </div>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredModules.map(renderCourseCard)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-cyan-400/30 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono text-cyan-300/70">
          <span>showing {filteredModules.length} of {availableModules.length} courses</span>
          <span>filter: {selectedFilter} | view: {viewMode}</span>
        </div>
      </div>
    </div>
  );
};