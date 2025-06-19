import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Layers } from "lucide-react";
import React from "react";
import { getIconOptions } from "../../lib/iconUtils";
import { colorOptions } from "./constants/phaseConstants";

const PhasesFormModal = ({
  isOpen,
  onClose,
  editingPhase,
  formData,
  onInputChange,
  onSubmit,
  saving,
  error,
  success,
  phases,
}) => {
  const iconOptions = getIconOptions();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-green-400/30 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-green-400/20 relative overflow-hidden">
        {/* Modal glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>

        <div className="relative z-10 p-6">
          {/* Enhanced Modal Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-green-400/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-400/50 flex items-center justify-center">
                <Layers className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wider">
                {editingPhase ? "◆ EDIT PHASE" : "◆ CREATE PHASE"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-2 rounded-lg hover:bg-red-400/10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider"
              >
                ▶ Phase Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                placeholder="Enter phase title..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider"
              >
                ▶ Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50 resize-none"
                placeholder="Enter phase description..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="icon"
                className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider"
              >
                ▶ Icon *
              </label>
              <select
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={onInputChange}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
                required
              >
                <option value="" className="bg-gray-900 text-green-400">
                  ◆ Select an icon
                </option>
                {iconOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-gray-900 text-green-400"
                  >
                    ▸ {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider"
                >
                  ▶ Color *
                </label>
                <select
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
                  required
                >
                  <option value="" className="bg-gray-900 text-green-400">
                    ◆ Select color
                  </option>
                  {colorOptions.map((color) => (
                    <option
                      key={color}
                      value={color}
                      className="bg-gray-900 text-green-400"
                    >
                      ▸ {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order field - only show when editing */}
              {editingPhase && (
                <div>
                  <label
                    htmlFor="order"
                    className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider"
                  >
                    ▶ Order *
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={onInputChange}
                    min="1"
                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                    placeholder="1"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    ◆ Editing existing phase order. Use drag & drop for
                    reordering.
                  </p>
                </div>
              )}

              {/* Auto-order notice for new phases */}
              {!editingPhase && (
                <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-400/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-green-400 font-mono text-sm">
                      <span className="font-bold">◆ AUTO-ORDER:</span> Order
                      will be automatically assigned as #{phases.length + 1}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-mono relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 animate-pulse"></div>
                <div className="relative z-10 flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {/* Enhanced Success Message */}
            {success && (
              <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl text-sm font-mono relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 animate-pulse"></div>
                <div className="relative z-10 flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  {success}
                </div>
              </div>
            )}

            {/* Enhanced Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-green-400/20">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-green-400/20 to-green-500/20 border-2 border-green-400/50 hover:from-green-400/30 hover:to-green-500/30 hover:border-green-400/70 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      ◊ SAVING...
                    </>
                  ) : editingPhase ? (
                    "◆ UPDATE PHASE"
                  ) : (
                    "◆ CREATE PHASE"
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

export default PhasesFormModal;