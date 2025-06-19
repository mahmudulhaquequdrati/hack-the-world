import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { colorOptions, difficultyLevels } from "./constants/moduleConstants";

const BulkOperationsModal = ({
  isOpen,
  onClose,
  selectedModules,
  bulkOperation,
  bulkFormData,
  setBulkFormData,
  phases,
  onSubmit,
  saving,
  error,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleInputChange = (field, value) => {
    setBulkFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-lg w-full border border-purple-600">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-purple-400 font-mono">
              ► BULK OPERATIONS
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded">
            <p className="text-purple-300 text-sm font-mono">
              ▲ Operating on {selectedModules.size} selected modules
            </p>
          </div>

          {bulkOperation === "updatePhase" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-green-400 font-mono">
                ► Select New Phase
              </label>
              <select
                value={bulkFormData.phaseId}
                onChange={(e) => handleInputChange("phaseId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-700 text-green-400 font-mono"
                required
              >
                <option value="">Select Phase</option>
                {phases.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    ▸ {phase.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {bulkOperation === "updateDifficulty" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-green-400 font-mono">
                ► Select Difficulty Level
              </label>
              <select
                value={bulkFormData.difficulty}
                onChange={(e) => handleInputChange("difficulty", e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-700 text-green-400 font-mono"
                required
              >
                <option value="">Select Difficulty</option>
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>
                    ▸ {level}
                  </option>
                ))}
              </select>
            </div>
          )}

          {bulkOperation === "updateStatus" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-green-400 font-mono">
                ► Module Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={bulkFormData.isActive === true}
                    onChange={() => handleInputChange("isActive", true)}
                    className="mr-2"
                  />
                  <span className="text-green-400 font-mono">
                    ◆ Active
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={bulkFormData.isActive === false}
                    onChange={() => handleInputChange("isActive", false)}
                    className="mr-2"
                  />
                  <span className="text-red-400 font-mono">
                    ◇ Inactive
                  </span>
                </label>
              </div>
            </div>
          )}

          {bulkOperation === "updateColor" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-green-400 font-mono">
                ► Select Color Scheme
              </label>
              <select
                value={bulkFormData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-700 text-green-400 font-mono"
                required
              >
                <option value="">Select Color</option>
                {colorOptions.map((color) => (
                  <option key={color} value={color}>
                    ▸ {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-green-400 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 font-mono"
              disabled={saving}
            >
              ◄ Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 disabled:opacity-50 font-mono"
            >
              {saving ? "◊ Processing..." : "► Apply Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsModal;