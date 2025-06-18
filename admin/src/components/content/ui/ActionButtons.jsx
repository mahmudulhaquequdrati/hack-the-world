import { PlusIcon, SparklesIcon } from "@heroicons/react/24/outline";
import React from "react";

const ActionButtons = ({ onAddContent, onBulkUpload, loading }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onAddContent}
          disabled={loading}
          className="bg-gradient-to-r from-green-400/10 to-green-500/10 border-2 border-green-400/30 hover:bg-gradient-to-r hover:from-green-400/20 hover:to-green-500/20 hover:border-green-400/50 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <PlusIcon className="w-5 h-5 mr-2 relative z-10" />
          <span className="hidden sm:inline relative z-10">▶ ADD CONTENT</span>
          <span className="sm:hidden relative z-10">+ ADD</span>
        </button>

        <button
          onClick={onBulkUpload}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-400/10 to-cyan-500/10 border-2 border-cyan-400/30 hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 text-cyan-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-400/20 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <SparklesIcon className="w-5 h-5 mr-2 relative z-10" />
          <span className="hidden sm:inline relative z-10">◇ BULK UPLOAD</span>
          <span className="sm:hidden relative z-10">BULK</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;