import {
  ListBulletIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import React from "react";

const ActionButtons = ({
  viewMode,
  setViewMode,
  onAddPhase,
  loading,
  hasChanges,
  onSaveOrder,
  onResetOrder,
  saving,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Enhanced Terminal View Mode Toggle */}
        <div className="flex bg-gradient-to-r from-black/80 to-gray-900/80 border border-green-400/30 rounded-xl p-1 shadow-lg shadow-green-400/10">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider relative overflow-hidden ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-green-400/20 to-green-500/20 text-green-400 border border-green-400/50 shadow-lg shadow-green-400/20"
                : "text-green-400/60 hover:text-green-400 hover:bg-green-400/10 hover:shadow-md"
            }`}
          >
            {viewMode === "grid" && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 animate-pulse"></div>
            )}
            <Squares2X2Icon className="w-4 h-4 relative z-10" />
            <span className="hidden sm:inline relative z-10">GRID</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider relative overflow-hidden ${
              viewMode === "list"
                ? "bg-gradient-to-r from-green-400/20 to-green-500/20 text-green-400 border border-green-400/50 shadow-lg shadow-green-400/20"
                : "text-green-400/60 hover:text-green-400 hover:bg-green-400/10 hover:shadow-md"
            }`}
          >
            {viewMode === "list" && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 animate-pulse"></div>
            )}
            <ListBulletIcon className="w-4 h-4 relative z-10" />
            <span className="hidden sm:inline relative z-10">LIST</span>
          </button>
        </div>
        <button
          onClick={onAddPhase}
          disabled={loading}
          className="bg-gradient-to-r from-green-400/10 to-green-500/10 border-2 border-green-400/30 hover:bg-gradient-to-r hover:from-green-400/20 hover:to-green-500/20 hover:border-green-400/50 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <PlusIcon className="w-5 h-5 mr-2 relative z-10" />
          <span className="hidden sm:inline relative z-10">
            ▶ ADD NEW PHASE
          </span>
          <span className="sm:hidden relative z-10">+ ADD</span>
        </button>
      </div>

      {/* Drag-and-Drop Order Controls */}
      {hasChanges && (
        <div className="flex gap-2">
          <button
            onClick={onSaveOrder}
            disabled={saving}
            className="bg-gradient-to-r from-cyan-400/10 to-cyan-500/10 border-2 border-cyan-400/30 hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 text-cyan-400 font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-400/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center">
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  ◊ SAVING...
                </>
              ) : (
                "◆ SAVE ORDER"
              )}
            </span>
          </button>
          <button
            onClick={onResetOrder}
            disabled={saving}
            className="bg-gradient-to-r from-red-400/10 to-red-500/10 border-2 border-red-400/30 hover:bg-gradient-to-r hover:from-red-400/20 hover:to-red-500/20 hover:border-red-400/50 transition-all duration-300 text-red-400 font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-400/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">◄ RESET</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;