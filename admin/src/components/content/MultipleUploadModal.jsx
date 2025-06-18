import { PlusIcon, SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

const MultipleUploadModal = ({
  isOpen,
  onClose,
  phases,
  modules,
  selectedPhaseForUpload,
  setSelectedPhaseForUpload,
  selectedModuleForUpload,
  setSelectedModuleForUpload,
  multipleUploads,
  onAddNewUploadItem,
  onRemoveUploadItem,
  onUpdateUploadItem,
  onSubmit,
  contentTypes,
  loading,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/30 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-400">
                  Multiple Content Upload
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Upload multiple content items to a module at once
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Phase and Module Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-purple-400 mb-2">
                📚 Select Phase
              </label>
              <select
                value={selectedPhaseForUpload}
                onChange={(e) => {
                  setSelectedPhaseForUpload(e.target.value);
                  setSelectedModuleForUpload(""); // Reset module selection
                }}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-700 text-green-400"
              >
                <option value="">Select Phase</option>
                {phases.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-purple-400 mb-2">
                📖 Select Module
              </label>
              <select
                value={selectedModuleForUpload}
                onChange={(e) => setSelectedModuleForUpload(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-700 text-green-400"
                disabled={!selectedPhaseForUpload}
              >
                <option value="">Select Module</option>
                {modules
                  .filter(
                    (module) => module.phaseId === selectedPhaseForUpload
                  )
                  .map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Content Items */}
          {selectedModuleForUpload && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-cyan-400">
                  Content Items ({multipleUploads.length})
                </h3>
                <button
                  onClick={onAddNewUploadItem}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {multipleUploads.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-800 border border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-green-400">
                        Item #{itemIndex + 1}
                      </h4>
                      {multipleUploads.length > 1 && (
                        <button
                          onClick={() => onRemoveUploadItem(item.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-cyan-400 mb-1">
                          Type
                        </label>
                        <select
                          value={item.type}
                          onChange={(e) =>
                            onUpdateUploadItem(
                              item.id,
                              "type",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                        >
                          {contentTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-cyan-400 mb-1">
                          Title*
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            onUpdateUploadItem(
                              item.id,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                          placeholder="Content title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-cyan-400 mb-1">
                          Section
                        </label>
                        <input
                          type="text"
                          value={item.section}
                          onChange={(e) =>
                            onUpdateUploadItem(
                              item.id,
                              "section",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                          placeholder="Content section"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm text-cyan-400 mb-1">
                          Description*
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            onUpdateUploadItem(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                          rows="2"
                          placeholder="Content description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-cyan-400 mb-1">
                          Duration (min)
                        </label>
                        <input
                          type="number"
                          value={item.duration}
                          onChange={(e) =>
                            onUpdateUploadItem(
                              item.id,
                              "duration",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                          min="1"
                        />
                      </div>

                      {item.type === "video" && (
                        <div className="md:col-span-2">
                          <label className="block text-sm text-cyan-400 mb-1">
                            Video URL*
                          </label>
                          <input
                            type="url"
                            value={item.url}
                            onChange={(e) =>
                              onUpdateUploadItem(
                                item.id,
                                "url",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>
                      )}

                      {(item.type === "lab" || item.type === "game") && (
                        <div className="md:col-span-3">
                          <label className="block text-sm text-cyan-400 mb-1">
                            Instructions*
                          </label>
                          <textarea
                            value={item.instructions}
                            onChange={(e) =>
                              onUpdateUploadItem(
                                item.id,
                                "instructions",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                            rows="3"
                            placeholder="Detailed instructions..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-600">
            <button
              onClick={onClose}
              className="px-6 py-2 text-green-400 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={
                loading ||
                !selectedModuleForUpload ||
                multipleUploads.length === 0
              }
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Create {multipleUploads.length} Items
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleUploadModal;