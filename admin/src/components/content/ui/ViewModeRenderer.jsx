import React from "react";
import ContentCard from "../views/ContentCard";

const ViewModeRenderer = ({
  viewMode,
  hierarchicalData,
  groupedContent,
  expandedPhases,
  setExpandedPhases,
  expandedModules,
  setExpandedModules,
  contentTypes,
  onEdit,
  onDelete,
  modules = [],
  phases = [],
  // Drag-and-drop props
  isDragAndDropEnabled = false,
  draggedContent,
  dragOverContent,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  updateSectionContent,
}) => {
  // Helper function to get context data for content item
  const getContextData = (contentItem) => {
    const module = modules.find((m) => m._id === contentItem.moduleId);
    const phase = module ? phases.find((p) => p._id === module.phaseId) : null;
    return { module, phase };
  };

  // Helper function to get module color classes (using existing module.color)
  const getModuleColorClasses = (moduleColor) => {
    const baseColor = moduleColor || 'cyan'; // fallback to cyan
    return {
      border: `border-${baseColor}-400/30`,
      bgGradient: `from-${baseColor}-900/30 to-${baseColor}-800/30`,
      iconBg: `bg-gradient-to-br from-${baseColor}-400/20 to-${baseColor}-600/20`,
      iconBorder: `border-${baseColor}-400/50`,
      iconText: `text-${baseColor}-400`,
      iconShadow: `shadow-${baseColor}-400/20`,
      titleText: `text-${baseColor}-400`,
    };
  };

  // Helper function for difficulty badge colors (independent from module colors)
  const getDifficultyBadgeColors = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return { text: "text-green-400", border: "border-green-400/50", bg: "bg-green-400/10" };
      case "intermediate":
        return { text: "text-yellow-400", border: "border-yellow-400/50", bg: "bg-yellow-400/10" };
      case "advanced":
        return { text: "text-red-400", border: "border-red-400/50", bg: "bg-red-400/10" };
      case "expert":
        return { text: "text-purple-400", border: "border-purple-400/50", bg: "bg-purple-400/10" };
      default:
        return { text: "text-gray-400", border: "border-gray-400/50", bg: "bg-gray-400/10" };
    }
  };

  // Helper function to toggle phase expansion
  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

  // Helper function to toggle module expansion
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  // Render hierarchical view
  const renderHierarchicalView = () => {
    return (
      <div className="space-y-8">
        {hierarchicalData.map((phase) => (
          <div
            key={phase._id}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
            {/* Phase Header */}
            <div
              className="relative z-10 flex items-center justify-between  cursor-pointer p-4 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300"
              onClick={() => togglePhase(phase._id)}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-400/50 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-green-400/20">
                  <span className="text-2xl font-bold text-green-400 font-mono">
                    P
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wider">
                    📚 {phase.title}
                  </h2>
                  <p className="text-sm text-gray-400 font-mono">
                    ◆ {phase.modules.length} modules •{" "}
                    {phase.modules.reduce((sum, m) => sum + m.contentCount, 0)}{" "}
                    content items
                  </p>
                </div>
              </div>
              <div className="text-green-400 text-2xl font-mono">
                {expandedPhases.has(phase._id) ? "▲" : "▼"}
              </div>
            </div>

            {/* Modules */}
            {expandedPhases.has(phase._id) && (
              <div className="relative z-10 space-y-4 mt-6">
                {phase.modules.map((module) => {
                  const moduleColors = getModuleColorClasses(module.color);
                  const difficultyColors = getDifficultyBadgeColors(module.difficulty);

                  return (
                    <div key={module._id} className="ml-6">
                      {/* Enhanced Module Container with layered design like phase */}
                      <div className="bg-gradient-to-br from-gray-800/60 to-black/60 border border-gray-600/20 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-400/0 via-gray-400/2 to-gray-400/0 animate-pulse"></div>
                        
                        {/* Enhanced Module Header */}
                        <div
                          className={`relative z-10 flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r ${moduleColors.bgGradient} rounded-lg border ${moduleColors.border} hover:border-opacity-70 transition-all duration-300`}
                          onClick={() => toggleModule(module._id)}
                        >
                          <div className="flex items-center">
                            {/* Enhanced Icon with module colors */}
                            <div className={`w-12 h-12 ${moduleColors.iconBg} border-2 ${moduleColors.iconBorder} rounded-xl flex items-center justify-center mr-4 shadow-lg ${moduleColors.iconShadow}`}>
                              <span className={`text-2xl font-bold ${moduleColors.iconText} font-mono`}>
                                M
                              </span>
                            </div>
                            <div>
                              {/* Enhanced Title */}
                              <h3 className={`text-xl font-bold ${moduleColors.titleText} font-mono uppercase tracking-wider`}>
                                📖 {module.title}
                              </h3>
                              {/* Module Description */}
                              {module.description && (
                                <p className="text-sm text-gray-300 font-mono mb-2 max-w-md">
                                  {module.description}
                                </p>
                              )}
                              {/* Enhanced Content Count with Difficulty */}
                              <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                                ◆ {module.contentCount} content items • 
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${difficultyColors.bg} ${difficultyColors.border} ${difficultyColors.text}`}>
                                  {module.difficulty?.toUpperCase() || 'UNSET'}
                                </span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {/* Expand Arrow with module colors */}
                            <div className={`${moduleColors.titleText} text-2xl font-mono`}>
                              {expandedModules.has(module._id) ? "▲" : "▼"}
                            </div>
                          </div>
                        </div>

                        {/* Content Items grouped by sections */}
                        {expandedModules.has(module._id) &&
                          module.content.length > 0 && (
                            <div className="mt-4 ml-6">
                          {(() => {
                            // Group content by sections
                            const contentBySection = {};
                            module.content.forEach((contentItem) => {
                              const section =
                                contentItem.section || "No Section";
                              if (!contentBySection[section]) {
                                contentBySection[section] = [];
                              }
                              contentBySection[section].push(contentItem);
                            });

                            // Sort content within each section by order, then createdAt
                            Object.values(contentBySection).forEach(
                              (sectionContent) => {
                                sectionContent.sort((a, b) => {
                                  if (a.order && b.order) {
                                    return a.order - b.order;
                                  } else if (a.order && !b.order) {
                                    return -1;
                                  } else if (!a.order && b.order) {
                                    return 1;
                                  } else {
                                    return (
                                      new Date(a.createdAt) -
                                      new Date(b.createdAt)
                                    );
                                  }
                                });
                              }
                            );

                            return Object.entries(contentBySection).map(
                              ([sectionName, sectionContent]) => (
                                <div key={sectionName} className="mb-6">
                                  {/* Section Header */}
                                  <div className="flex items-center mb-3">
                                    <span className="text-sm font-semibold text-yellow-400 font-mono uppercase tracking-wider">
                                      📁 {sectionName} ({sectionContent.length})
                                    </span>
                                  </div>

                                  {/* Section Content Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sectionContent.map((contentItem) => (
                                      <ContentCard
                                        key={contentItem._id}
                                        contentItem={contentItem}
                                        contentTypes={contentTypes}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        showContext={false}
                                        contextData={{
                                          module: module,
                                          phase: phase,
                                        }}
                                        // Drag-and-drop props
                                        isDraggable={isDragAndDropEnabled}
                                        isDragging={
                                          draggedContent?._id === contentItem._id
                                        }
                                        isDraggedOver={
                                          dragOverContent?._id === contentItem._id
                                        }
                                        onDragStart={onDragStart}
                                        onDragEnd={onDragEnd}
                                        onDragOver={onDragOver}
                                        onDragEnter={onDragEnter}
                                        onDragLeave={onDragLeave}
                                        onDrop={(e, targetContent) =>
                                          onDrop?.(
                                            e,
                                            targetContent,
                                            sectionContent,
                                            (updatedContent) => {
                                              updateSectionContent?.(
                                                module._id,
                                                sectionName,
                                                updatedContent
                                              );
                                            }
                                          )
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>
                              )
                            );
                          })()}
                            </div>
                          )}

                        {expandedModules.has(module._id) &&
                          module.content.length === 0 && (
                            <div className="mt-4 ml-6 text-center text-gray-500 py-8">
                              <p className="font-mono">
                                No content items found in this module
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render grouped view
  const renderGroupedView = () => {
    return (
      <div className="space-y-6">
        {Object.entries(groupedContent).map(([groupName, groupContent]) => (
          <div
            key={groupName}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wider mb-4">
                📁 {groupName} ({groupContent.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupContent.map((contentItem) => (
                  <ContentCard
                    key={contentItem._id}
                    contentItem={contentItem}
                    contentTypes={contentTypes}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    showContext={true}
                    contextData={getContextData(contentItem)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    return (
      <div className="text-center text-gray-500 py-16">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-mono mb-2">No Content Found</h3>
        <p className="font-mono text-sm">
          {viewMode === "hierarchical"
            ? "No phases with content available"
            : "No content items match the current filters"}
        </p>
      </div>
    );
  };

  // Main render logic
  if (viewMode === "hierarchical") {
    if (!hierarchicalData?.length) {
      return renderEmptyState();
    }
    return renderHierarchicalView();
  }

  if (viewMode === "groupedByModule" || viewMode === "groupedByType") {
    if (!Object.keys(groupedContent).length) {
      return renderEmptyState();
    }
    return renderGroupedView();
  }

  return renderEmptyState();
};

export default ViewModeRenderer;
