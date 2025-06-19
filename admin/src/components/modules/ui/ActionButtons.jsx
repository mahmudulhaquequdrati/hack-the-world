import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";

const ActionButtons = ({
  onAddModule,
  loading,
  selectedPhase,
  setSelectedPhase,
  phases,
  selectedModules,
  modules,
  onSelectAll,
  hasModuleChanges,
  onSaveModuleOrder,
  onResetModuleOrder,
  saving,
  onBulkOperation,
  onClearSelection,
}) => {
  return (
    <>
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={onAddModule}
            disabled={loading}
            className="bg-gradient-to-r from-green-400/10 to-green-500/10 border-2 border-green-400/30 hover:bg-gradient-to-r hover:from-green-400/20 hover:to-green-500/20 hover:border-green-400/50 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <PlusIcon className="w-5 h-5 mr-2 relative z-10" />
            <span className="hidden sm:inline relative z-10">
              ▶ ADD MODULE
            </span>
            <span className="sm:hidden relative z-10">+ ADD</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Phase Filter */}
          <div className="flex items-center gap-3">
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="px-4 py-2 border border-green-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-900/80 text-green-400 font-mono shadow-lg shadow-green-400/20 backdrop-blur-sm hover:shadow-green-400/30 transition-all duration-300"
            >
              <option value="">◆ All Phases</option>
              {phases.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  ▸ {phase.title}
                </option>
              ))}
            </select>
          </div>

          {/* Select All Button */}
          <button
            onClick={onSelectAll}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400/10 to-cyan-500/10 text-cyan-400 rounded-xl hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-cyan-500/20 border border-cyan-500/30 font-mono text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-400/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">
              {selectedModules.size === modules.length
                ? "◄ DESELECT ALL"
                : "► SELECT ALL"}
            </span>
          </button>

          {/* Module Drag-and-Drop Order Controls */}
          {hasModuleChanges && (
            <div className="flex gap-2">
              <button
                onClick={onSaveModuleOrder}
                disabled={saving}
                className="bg-gradient-to-r from-cyan-400/10 to-cyan-500/10 border-2 border-cyan-400/30 hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 text-cyan-400 font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-400/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center text-xs">
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      ◊ SAVING...
                    </>
                  ) : (
                    "◆ SAVE MODULE ORDER"
                  )}
                </span>
              </button>
              <button
                onClick={onResetModuleOrder}
                disabled={saving}
                className="bg-gradient-to-r from-red-400/10 to-red-500/10 border-2 border-red-400/30 hover:bg-gradient-to-r hover:from-red-400/20 hover:to-red-500/20 hover:border-red-400/50 transition-all duration-300 text-red-400 font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-400/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-xs">◄ RESET</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Bulk Operations Toolbar */}
      {selectedModules.size > 0 && (
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 animate-pulse"></div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-400 font-mono font-bold">
                  ► {selectedModules.size} MODULE
                  {selectedModules.size !== 1 ? "S" : ""} SELECTED
                </span>
              </div>
              <button
                onClick={onClearSelection}
                className="text-red-400 hover:text-red-300 text-sm font-mono transition-colors duration-300 hover:bg-red-400/10 px-2 py-1 rounded"
              >
                ◄ CLEAR
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onBulkOperation("updatePhase")}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-mono font-bold hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-400/20"
              >
                ◆ PHASE
              </button>
              <button
                onClick={() => onBulkOperation("updateDifficulty")}
                className="px-3 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg text-xs font-mono font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
              >
                ◆ DIFFICULTY
              </button>
              <button
                onClick={() => onBulkOperation("updateStatus")}
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-xs font-mono font-bold hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-green-400/20"
              >
                ◆ STATUS
              </button>
              <button
                onClick={() => onBulkOperation("updateColor")}
                className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-xs font-mono font-bold hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-purple-400/20"
              >
                ◆ COLOR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;