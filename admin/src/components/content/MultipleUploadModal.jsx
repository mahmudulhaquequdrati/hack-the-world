import { CheckCircleIcon, ExclamationCircleIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Upload } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-green-400/30 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-green-400/20 relative overflow-hidden">
        {/* Modal glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>

        <div className="relative z-10 p-6">
          {/* Enhanced Terminal Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-green-400/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-400/50 flex items-center justify-center animate-pulse">
                <Upload className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wider">
                  ◆ BULK CONTENT UPLOAD
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-green-400/80 font-mono text-sm">
                    admin@hacktheworld:~/content/bulk
                    <span className="animate-ping text-green-400">█</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-2 rounded-lg hover:bg-red-400/10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Phase and Module Selection */}
            <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-400/30 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-green-400 font-mono uppercase tracking-wider mb-4">
                  ◆ Target Selection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                      ▶ 📚 Select Phase
                    </label>
                    <select
                      value={selectedPhaseForUpload}
                      onChange={(e) => {
                        setSelectedPhaseForUpload(e.target.value);
                        setSelectedModuleForUpload(""); // Reset module selection
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-900 text-green-400">◆ Select Phase</option>
                      {phases.map((phase) => (
                        <option key={phase.id} value={phase.id} className="bg-gray-900 text-green-400">
                          ▸ {phase.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                      ▶ 📖 Select Module
                    </label>
                    <select
                      value={selectedModuleForUpload}
                      onChange={(e) => setSelectedModuleForUpload(e.target.value)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!selectedPhaseForUpload}
                    >
                      <option value="" className="bg-gray-900 text-green-400">◆ Select Module</option>
                      {modules
                        .filter(
                          (module) => module.phaseId === selectedPhaseForUpload
                        )
                        .map((module) => (
                          <option key={module.id} value={module.id} className="bg-gray-900 text-green-400">
                            ▸ {module.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Items */}
            {selectedModuleForUpload && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-green-400 font-mono uppercase tracking-wider">
                    ◆ Content Items ({multipleUploads.length})
                  </h3>
                  <button
                    onClick={onAddNewUploadItem}
                    className="bg-gradient-to-r from-green-400/10 to-green-500/10 border-2 border-green-400/30 hover:bg-gradient-to-r hover:from-green-400/20 hover:to-green-500/20 hover:border-green-400/50 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <PlusIcon className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">▶ ADD ITEM</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {multipleUploads.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-6 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-400/50 flex items-center justify-center">
                              <span className="text-sm font-bold text-green-400 font-mono">{itemIndex + 1}</span>
                            </div>
                            <h4 className="text-md font-bold text-green-400 font-mono uppercase tracking-wider">
                              ◆ Content Item #{itemIndex + 1}
                            </h4>
                          </div>
                          {multipleUploads.length > 1 && (
                            <button
                              onClick={() => onRemoveUploadItem(item.id)}
                              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-all duration-300"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                              ▶ Type
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
                              className="w-full px-3 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-lg text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
                            >
                              {contentTypes.map((type) => (
                                <option key={type.value} value={type.value} className="bg-gray-900 text-green-400">
                                  ▸ {type.icon} {type.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                              ▶ Title *
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
                              className="w-full px-3 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-lg text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                              placeholder="Content title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                              ▶ Section
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
                              className="w-full px-3 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-lg text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                              placeholder="Content section"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                              ▶ Description *
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
                              className="w-full px-3 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-lg text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50 resize-none"
                              rows="2"
                              placeholder="Content description"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                              ▶ Duration (min)
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
                              className="w-full px-3 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-lg text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                              min="1"
                              placeholder="15"
                            />
                          </div>

                          {item.type === "video" && (
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                                ▶ Video URL *
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
                                className="w-full px-3 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-lg text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                                placeholder="https://example.com/video.mp4"
                              />
                            </div>
                          )}

                          {(item.type === "lab" || item.type === "game") && (
                            <div className="md:col-span-3">
                              <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                                ▶ Instructions *
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
                                className="w-full px-3 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-lg text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50 resize-none"
                                rows="3"
                                placeholder="Detailed instructions..."
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-mono relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 animate-pulse"></div>
                <div className="relative z-10 flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                  {error}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-green-400/20">
              <button
                onClick={onSubmit}
                disabled={
                  loading ||
                  !selectedModuleForUpload ||
                  multipleUploads.length === 0
                }
                className="flex-1 bg-gradient-to-r from-green-400/20 to-green-500/20 border-2 border-green-400/50 hover:from-green-400/30 hover:to-green-500/30 hover:border-green-400/70 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      ◊ CREATING...
                    </>
                  ) : (
                    "◆ CREATE ALL CONTENT"
                  )}
                </span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-2 border-gray-600/50 hover:from-gray-600/50 hover:to-gray-700/50 hover:border-gray-500/50 transition-all duration-300 text-gray-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg hover:shadow-gray-400/10"
                disabled={loading}
              >
                ◄ CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleUploadModal;