import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  phaseToDelete,
  saving,
}) => {
  if (!isOpen || !phaseToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-red-900/95 to-black/95 border-2 border-red-400/30 rounded-xl max-w-lg w-full shadow-2xl shadow-red-400/20 relative overflow-hidden">
        {/* Modal glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 animate-pulse"></div>

        <div className="relative z-10 p-6">
          {/* Enhanced Modal Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-red-400/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400/20 to-red-600/20 border border-red-400/50 flex items-center justify-center animate-pulse">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-red-400 font-mono uppercase tracking-wider">
                ◆ DELETE PHASE
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={saving}
              className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-2 rounded-lg hover:bg-red-400/10 disabled:opacity-50"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Warning Content */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/50 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-red-400 font-mono font-bold uppercase tracking-wider">
                    ◆ WARNING
                  </span>
                </div>
                <p className="text-red-300 font-mono text-sm leading-relaxed">
                  You are about to permanently delete the phase:
                </p>
                <div className="mt-3 p-3 bg-gradient-to-r from-red-800/50 to-red-900/50 border border-red-400/30 rounded-lg">
                  <p className="text-red-100 font-mono font-bold uppercase tracking-wider">
                    ▶ "{phaseToDelete.title}"
                  </p>
                </div>
                <p className="text-red-300 font-mono text-sm mt-3 leading-relaxed">
                  This action is{" "}
                  <span className="text-red-400 font-bold">IRREVERSIBLE</span>{" "}
                  and will permanently remove:
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-red-400/20 mt-6">
            <button
              onClick={onConfirm}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-red-400/20 to-red-500/20 border-2 border-red-400/50 hover:from-red-400/30 hover:to-red-500/30 hover:border-red-400/70 transition-all duration-300 text-red-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-400/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    ◊ DELETING...
                  </>
                ) : (
                  "◆ YES, DELETE PHASE"
                )}
              </span>
            </button>
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-2 border-gray-600/50 hover:from-gray-600/50 hover:to-gray-700/50 hover:border-gray-500/50 transition-all duration-300 text-gray-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg hover:shadow-gray-400/10 disabled:opacity-50"
            >
              ◄ CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
