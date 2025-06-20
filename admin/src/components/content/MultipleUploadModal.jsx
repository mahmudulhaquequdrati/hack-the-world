import { CheckCircleIcon, ExclamationCircleIcon, PlusIcon, XMarkIcon, MagnifyingGlassIcon, FolderIcon, ChevronRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Upload } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useContentSections } from "./hooks/useContentSections";

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
  // Section management for autocomplete
  const {
    availableSections,
    sectionLoading,
    handleSectionInputFocus,
    handleSectionInputBlur,
    handleSectionSelect,
    getFilteredSections,
    fetchSectionsByModule,
  } = useContentSections();

  // Per-item section dropdown state
  const [sectionDropdowns, setSectionDropdowns] = useState({});
  const [sectionInputValues, setSectionInputValues] = useState({});

  // Fetch sections when module changes
  useEffect(() => {
    if (selectedModuleForUpload) {
      fetchSectionsByModule(selectedModuleForUpload);
    }
  }, [selectedModuleForUpload, fetchSectionsByModule]);

  // Handle section input change for specific item
  const handleSectionInputChange = (itemId, value) => {
    setSectionInputValues(prev => ({ ...prev, [itemId]: value }));
    onUpdateUploadItem(itemId, "section", value);
  };

  // Handle section focus for specific item
  const handleItemSectionFocus = (itemId) => {
    if (selectedModuleForUpload) {
      setSectionDropdowns(prev => ({ ...prev, [itemId]: true }));
      handleSectionInputFocus(selectedModuleForUpload);
    }
  };

  // Handle section blur for specific item
  const handleItemSectionBlur = (itemId) => {
    setTimeout(() => {
      setSectionDropdowns(prev => ({ ...prev, [itemId]: false }));
    }, 200);
  };

  // Handle section selection for specific item
  const handleItemSectionSelect = (itemId, section) => {
    onUpdateUploadItem(itemId, "section", section);
    setSectionInputValues(prev => ({ ...prev, [itemId]: section }));
    setSectionDropdowns(prev => ({ ...prev, [itemId]: false }));
  };

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

                          <div className="relative">
                            <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                              ▶ Section
                            </label>
                            <div className="relative">
                              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                value={sectionInputValues[item.id] || item.section || ""}
                                onChange={(e) => handleSectionInputChange(item.id, e.target.value)}
                                onFocus={() => handleItemSectionFocus(item.id)}
                                onBlur={() => handleItemSectionBlur(item.id)}
                                className="w-full pl-10 pr-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-lg text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50 disabled:opacity-50"
                                placeholder={
                                  selectedModuleForUpload
                                    ? "🔍 Search existing sections or create new..."
                                    : "⚠️ Select a module first"
                                }
                                disabled={!selectedModuleForUpload}
                              />
                              {selectedModuleForUpload && !sectionLoading && (sectionInputValues[item.id] || item.section) && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <SparklesIcon className="h-4 w-4 text-green-400 animate-pulse" />
                                </div>
                              )}
                            </div>

                            {/* Section Dropdown */}
                            {sectionDropdowns[item.id] && selectedModuleForUpload && (
                              <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-green-500/50 rounded-lg shadow-2xl max-h-48 overflow-auto backdrop-blur-sm">
                                <div className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-green-500/30 rounded-t-lg">
                                  <div className="flex items-center text-xs text-green-400">
                                    <FolderIcon className="h-3 w-3 mr-1" />
                                    Available Sections
                                  </div>
                                </div>

                                {(() => {
                                  const currentInput = sectionInputValues[item.id] || item.section || "";
                                  const filteredSections = getFilteredSections(currentInput);
                                  
                                  if (filteredSections.length > 0) {
                                    return (
                                      <>
                                        <div className="px-4 py-2 text-xs text-gray-400 bg-gray-900/50 border-b border-gray-700">
                                          Existing sections ({filteredSections.length}) - Click to select:
                                        </div>
                                        {filteredSections.map((section) => (
                                          <button
                                            key={section}
                                            type="button"
                                            onClick={() => handleItemSectionSelect(item.id, section)}
                                            className="w-full text-left px-4 py-2 text-green-400 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-all duration-150 border-l-2 border-transparent hover:border-green-400 flex items-center group"
                                          >
                                            <FolderIcon className="h-4 w-4 mr-3 text-green-400 group-hover:scale-110 transition-transform duration-150" />
                                            <span className="flex-1">{section}</span>
                                            <ChevronRightIcon className="h-3 w-3 text-gray-500 group-hover:text-green-400 transition-colors duration-150" />
                                          </button>
                                        ))}
                                      </>
                                    );
                                  } else if (currentInput) {
                                    return (
                                      <div className="px-4 py-4 text-sm text-center">
                                        <div className="flex items-center justify-center mb-2">
                                          <SparklesIcon className="h-5 w-5 text-green-400 animate-pulse mr-2" />
                                          <span className="text-green-400 font-medium">Create New Section</span>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border border-green-500/30 rounded-lg p-3 mb-2">
                                          <div className="font-medium text-white">"{currentInput}"</div>
                                        </div>
                                        <div className="text-xs text-gray-400">Press Enter or click outside to create</div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div className="px-4 py-4 text-center text-gray-400">
                                        <FolderIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <div className="font-mono text-sm">No existing sections found</div>
                                        <div className="text-xs mt-1">Start typing to create a new section</div>
                                      </div>
                                    );
                                  }
                                })()}
                              </div>
                            )}
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