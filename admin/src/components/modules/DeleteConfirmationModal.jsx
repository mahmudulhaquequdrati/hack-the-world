import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  moduleToDelete,
  saving
}) => {
  if (!isOpen || !moduleToDelete) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-red-400/50 rounded-xl p-6 max-w-md w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 animate-pulse"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-400/20 border border-red-400/50 flex items-center justify-center">
              <TrashIcon className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-400 font-mono uppercase tracking-wider">
              ⚠ CONFIRM DELETE
            </h3>
          </div>

          <div className="mb-6 p-4 bg-red-900/20 border border-red-400/30 rounded-lg">
            <p className="text-red-400 font-mono text-sm mb-2">
              You are about to permanently delete:
            </p>
            <p className="text-white font-mono font-bold">
              "{moduleToDelete.title}"
            </p>
            <p className="text-red-400/80 font-mono text-xs mt-2">
              This action cannot be undone. All module data and content
              will be lost.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700/80 text-gray-300 border border-gray-600/50 rounded-lg hover:bg-gray-600/80 font-mono transition-all duration-300"
              disabled={saving}
            >
              ◄ Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={saving}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 disabled:opacity-50 font-mono font-bold transition-all duration-300 shadow-lg hover:shadow-red-400/20"
            >
              {saving ? "◊ Deleting..." : "⚠ DELETE FOREVER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;