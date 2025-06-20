import React from 'react';
import ContentCard from '../views/ContentCard';

const ViewModeRenderer = ({
  viewMode,
  hierarchicalData,
  groupedContent,
  selectedPhaseId,
  setSelectedPhaseId,
  selectedModuleId,
  setSelectedModuleId,
  contentTypes,
  onEdit,
  onDelete,
  modules = [],
  phases = [],
}) => {
  // Helper function to get context data for content item
  const getContextData = (contentItem) => {
    const module = modules.find(m => m.id === contentItem.moduleId);
    const phase = module ? phases.find(p => p.id === module.phaseId) : null;
    return { module, phase };
  };

  // Render hierarchical view
  const renderHierarchicalView = () => {
    return (
      <div className="space-y-8">
        {hierarchicalData.map((phase) => (
          <div
            key={phase.id}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
            {/* Phase Header */}
            <div
              className="relative z-10 flex items-center justify-between mb-6 cursor-pointer p-4 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300"
              onClick={() =>
                setSelectedPhaseId(selectedPhaseId === phase.id ? "" : phase.id)
              }
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
                {selectedPhaseId === phase.id ? "▲" : "▼"}
              </div>
            </div>

            {/* Modules */}
            {selectedPhaseId === phase.id && (
              <div className="relative z-10 space-y-4 mt-6">
                {phase.modules.map((module) => (
                  <div key={module.id} className="ml-6">
                    <div
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-400/30 rounded-xl cursor-pointer hover:border-cyan-400/50 transition-all duration-300"
                      onClick={() =>
                        setSelectedModuleId(
                          selectedModuleId === module.id ? "" : module.id
                        )
                      }
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 border-2 border-cyan-400/50 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-cyan-400/20">
                          <span className="text-lg font-bold text-cyan-400 font-mono">
                            M
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-cyan-400 font-mono">
                            📖 {module.title}
                          </h3>
                          <p className="text-sm text-gray-400 font-mono">
                            ◆ {module.contentCount} content items
                          </p>
                        </div>
                      </div>
                      <div className="text-cyan-400 text-xl font-mono">
                        {selectedModuleId === module.id ? "▲" : "▼"}
                      </div>
                    </div>

                    {/* Content Items */}
                    {selectedModuleId === module.id &&
                      module.content.length > 0 && (
                        <div className="mt-4 ml-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {module.content.map((contentItem) => (
                              <ContentCard
                                key={contentItem.id}
                                contentItem={contentItem}
                                contentTypes={contentTypes}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                showContext={false}
                                contextData={{
                                  module: module,
                                  phase: phase
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedModuleId === module.id &&
                      module.content.length === 0 && (
                        <div className="mt-4 ml-6 text-center text-gray-500 py-8">
                          <p className="font-mono">
                            No content items found in this module
                          </p>
                        </div>
                      )}
                  </div>
                ))}
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
                    key={contentItem.id}
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
          {viewMode === 'hierarchical' 
            ? 'No phases with content available'
            : 'No content items match the current filters'
          }
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