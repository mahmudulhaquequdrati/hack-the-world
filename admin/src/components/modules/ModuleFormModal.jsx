import { XMarkIcon } from "@heroicons/react/24/outline";
import { BookOpen } from "lucide-react";
import React from "react";
import { getIconOptions } from "../../lib/iconUtils";
import { colorOptions, difficultyLevels } from "./constants/moduleConstants";

const ModuleFormModal = ({
  isOpen,
  onClose,
  editingModule,
  formData,
  setFormData,
  phases,
  onSubmit,
  saving,
  error,
  success,
}) => {
  if (!isOpen) {
    return null;
  }

  const iconOptions = getIconOptions();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-blue-400/30 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-blue-400/20 relative overflow-hidden">
        {/* Modal glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 animate-pulse"></div>

        <div className="relative z-10 p-6">
          {/* Enhanced Modal Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-blue-400/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-400/50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-blue-400 font-mono uppercase tracking-wider">
                {editingModule ? "◆ EDIT MODULE" : "◆ CREATE MODULE"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-2 rounded-lg hover:bg-red-400/10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Enhanced Module Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ Phase *
                </label>
                <select
                  name="phaseId"
                  value={formData.phaseId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                  required
                >
                  <option value="" className="bg-gray-900 text-blue-400">
                    ◆ Select Phase
                  </option>
                  {phases.map((phase) => (
                    <option
                      key={phase.id}
                      value={phase.id}
                      className="bg-gray-900 text-blue-400"
                    >
                      ▸ {phase.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                ▶ Module Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 placeholder-blue-400/50"
                required
                maxLength="100"
                placeholder="Enter module title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                ▶ Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 placeholder-blue-400/50 resize-none"
                required
                maxLength="500"
                rows="3"
                placeholder="Enter module description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ Icon
                </label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                >
                  <option value="" className="bg-gray-900 text-blue-400">
                    ◆ Select icon
                  </option>
                  {iconOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-gray-900 text-blue-400"
                    >
                      ▸ {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ Difficulty *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                  required
                >
                  <option value="" className="bg-gray-900 text-blue-400">
                    ◆ Select difficulty
                  </option>
                  {difficultyLevels.map((level) => (
                    <option
                      key={level}
                      value={level}
                      className="bg-gray-900 text-blue-400"
                    >
                      ▸ {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ Color
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                >
                  <option value="" className="bg-gray-900 text-blue-400">
                    ◆ Select color
                  </option>
                  {colorOptions.map((color) => (
                    <option
                      key={color}
                      value={color}
                      className="bg-gray-900 text-blue-400"
                    >
                      ▸ {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                ▶ Topics (comma-separated)
              </label>
              <input
                type="text"
                name="topics"
                value={formData.topics}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 placeholder-blue-400/50"
                placeholder="Security Basics, Threat Models, Risk Assessment..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Prerequisites (currently disabled)
                <span className="text-xs text-gray-400 ml-2">
                  Note: Prerequisites require existing module ObjectIds
                </span>
              </label>
              <input
                type="text"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400 opacity-50"
                placeholder="Will be ignored for now - TODO: Add module selector"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">
                Future enhancement: This will be a dropdown to select
                existing modules
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2 font-mono uppercase tracking-wider">
                ▶ Learning Outcomes (comma-separated)
              </label>
              <textarea
                name="learningOutcomes"
                value={formData.learningOutcomes}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-blue-400/30 rounded-xl text-blue-400 font-mono focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 placeholder-blue-400/50 resize-none"
                rows="2"
                placeholder="Understand security principles, Identify common threats..."
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-400/30 rounded-xl">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-400 focus:ring-blue-400/50 border-blue-400/50 rounded bg-gray-800 transition-all duration-300"
              />
              <label className="block text-sm text-blue-400 font-mono font-bold uppercase tracking-wider">
                ◆ MODULE ACTIVE
              </label>
            </div>

            {/* Enhanced Module Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-blue-400/20">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-400/20 to-blue-500/20 border-2 border-blue-400/50 hover:from-blue-400/30 hover:to-blue-500/30 hover:border-blue-400/70 transition-all duration-300 text-blue-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-400/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      ◊ SAVING...
                    </>
                  ) : editingModule ? (
                    "◆ UPDATE MODULE"
                  ) : (
                    "◆ CREATE MODULE"
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-2 border-gray-600/50 hover:from-gray-600/50 hover:to-gray-700/50 hover:border-gray-500/50 transition-all duration-300 text-gray-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg hover:shadow-gray-400/10"
              >
                ◄ CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModuleFormModal;