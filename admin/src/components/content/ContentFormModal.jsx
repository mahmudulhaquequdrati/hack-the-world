import {
  CheckCircleIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  EyeIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FileText } from "lucide-react";
import React from "react";

const ContentFormModal = ({
  isOpen,
  onClose,
  editingContent,
  formData,
  setFormData,
  modules,
  availableSections,
  sectionInputValue,
  setSectionInputValue,
  showSectionDropdown,
  setShowSectionDropdown,
  sectionLoading,
  filteredSections,
  onSubmit,
  loading,
  onSectionInputChange,
  onSectionInputFocus,
  onSectionInputBlur,
  onSectionSelect,
  onResetForm,
  contentTypes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-green-400/30 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-green-400/20 relative overflow-hidden">
        {/* Modal glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>

        <div className="relative z-10 p-6">
          {/* Enhanced Terminal Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-green-400/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-400/50 flex items-center justify-center animate-pulse">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wider">
                  {editingContent ? "◆ EDIT CONTENT" : "◆ CREATE CONTENT"}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-green-400/80 font-mono text-sm">
                    {editingContent
                      ? "admin@hacktheworld:~/content/edit"
                      : "admin@hacktheworld:~/content/create"}
                    <span className="animate-ping text-green-400">█</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onResetForm();
              }}
              className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-2 rounded-lg hover:bg-red-400/10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Module and Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ Module *
                </label>
                <select
                  value={formData.moduleId}
                  onChange={(e) => {
                    console.log("Module selected:", e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      moduleId: e.target.value,
                    }));
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                  required
                >
                  <option value="" className="bg-gray-900 text-green-400">◆ Select Module</option>
                  {modules.map((module) => (
                    <option key={module._id} value={module._id} className="bg-gray-900 text-green-400">
                      ▸ {module.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ Content Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
                  required
                >
                  {contentTypes.map((type) => (
                    <option key={type.value} value={type.value} className="bg-gray-900 text-green-400">
                      ▸ {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                ▶ Content Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                required
                maxLength="100"
                placeholder="Enter content title..."
              />
            </div>

          {/* Enhanced Section Input */}
          <div className="relative">
            <label className="flex items-center text-sm font-semibold text-cyan-400">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Section*
            </label>

            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={sectionInputValue}
                onChange={onSectionInputChange}
                onFocus={() => {
                  console.log(
                    "Section input focused, moduleId:",
                    formData.moduleId,
                    "disabled:",
                    !formData.moduleId
                  );
                  onSectionInputFocus();
                }}
                onBlur={onSectionInputBlur}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                required
                maxLength="100"
                placeholder={
                  formData.moduleId
                    ? "🔍 Search existing sections or create new one..."
                    : "⚠️ Select a module first to manage sections"
                }
                disabled={!formData.moduleId}
              />
              {formData.moduleId && !sectionLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {sectionInputValue && (
                    <SparklesIcon className="h-4 w-4 text-cyan-400 animate-pulse" />
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Dropdown */}
            {showSectionDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-cyan-500/50 rounded-lg shadow-2xl max-h-64 overflow-auto backdrop-blur-sm">
                {/* Dropdown Header */}
                <div className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-cyan-500/30 rounded-t-lg">
                  <div className="flex items-center text-xs text-cyan-400">
                    <FolderIcon className="h-3 w-3 mr-1" />
                    Section Management
                  </div>
                </div>

                {filteredSections.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-xs text-gray-400 bg-gray-900/50 border-b border-gray-700 flex items-center">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      Existing sections ({filteredSections.length}) - Click to
                      select:
                    </div>
                    {filteredSections.map((section, index) => (
                      <button
                        key={section}
                        type="button"
                        onClick={() => onSectionSelect(section)}
                        className="w-full text-left px-4 py-3 text-green-400 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 focus:bg-gradient-to-r focus:from-gray-700 focus:to-gray-600 focus:outline-none transition-all duration-150 border-l-2 border-transparent hover:border-cyan-400 flex items-center group"
                      >
                        <FolderIcon className="h-4 w-4 mr-3 text-cyan-400 group-hover:scale-110 transition-transform duration-150" />
                        <span className="flex-1">{section}</span>
                        <ChevronRightIcon className="h-3 w-3 text-gray-500 group-hover:text-cyan-400 transition-colors duration-150" />
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-4 text-sm">
                    {sectionInputValue ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <SparklesIcon className="h-5 w-5 text-cyan-400 animate-pulse mr-2" />
                          <span className="text-cyan-400 font-medium">
                            Create New Section
                          </span>
                        </div>
                        <div className="bg-gradient-to-r from-cyan-900/20 to-green-900/20 border border-cyan-500/30 rounded-lg p-3 mb-2">
                          <div className="font-medium text-white">
                            "{sectionInputValue}"
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 flex items-center justify-center">
                          <kbd className="px-2 py-1 bg-gray-700 rounded text-xs mr-1">
                            Enter
                          </kbd>
                          <span>or click outside to create</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <FolderIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <div className="font-mono">No existing sections found</div>
                        <div className="text-xs mt-1 font-mono">
                          Type to create a new section
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                ▶ Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50 resize-none"
                required
                maxLength="500"
                rows="3"
                placeholder="Enter content description..."
              />
            </div>

            {/* URL Input */}
            {formData.type === "video" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ Video URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                  required={formData.type === "video"}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            )}

            {/* Instructions Input */}
            {(formData.type === "lab" || formData.type === "game") && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ Instructions *
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50 resize-none"
                  required={formData.type === "lab" || formData.type === "game"}
                  maxLength="2000"
                  rows="4"
                  placeholder="Detailed instructions for the lab or game..."
                />
              </div>
            )}

            {/* Duration and Order Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                  min="1"
                  max="300"
                  placeholder="15"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ Order (optional)
                </label>
                <input
                  type="number"
                  value={formData.order || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: e.target.value ? parseInt(e.target.value) : null,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                  min="1"
                  placeholder="Auto-assigned if empty"
                />
                <p className="text-xs text-green-400/60 font-mono">
                  ℹ️ Leave empty for auto-assignment. Use drag-and-drop for reordering.
                </p>
              </div>
            </div>

            {/* Structured Resources Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                ▶ 📚 Resources
              </label>
              
              {/* Resources List */}
              <div className="space-y-3">
                {formData.resources.map((resource, index) => (
                  <div key={index} className="bg-gray-800/40 border border-green-400/20 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-green-400 mb-1">Name *</label>
                        <input
                          type="text"
                          value={resource.name || ""}
                          onChange={(e) => {
                            const newResources = [...formData.resources];
                            newResources[index] = { ...resource, name: e.target.value };
                            setFormData(prev => ({ ...prev, resources: newResources }));
                          }}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-green-400/20 rounded text-green-400 text-sm"
                          placeholder="Resource name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-green-400 mb-1">Type *</label>
                        <select
                          value={resource.type || "url"}
                          onChange={(e) => {
                            const newResources = [...formData.resources];
                            newResources[index] = { ...resource, type: e.target.value };
                            setFormData(prev => ({ ...prev, resources: newResources }));
                          }}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-green-400/20 rounded text-green-400 text-sm"
                        >
                          <option value="url">🔗 URL</option>
                          <option value="file">📄 File</option>
                          <option value="document">📋 Document</option>
                          <option value="tool">🔧 Tool</option>
                          <option value="reference">📖 Reference</option>
                          <option value="video">🎥 Video</option>
                          <option value="download">⬇️ Download</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-green-400 mb-1">URL</label>
                        <input
                          type="url"
                          value={resource.url || ""}
                          onChange={(e) => {
                            const newResources = [...formData.resources];
                            newResources[index] = { ...resource, url: e.target.value };
                            setFormData(prev => ({ ...prev, resources: newResources }));
                          }}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-green-400/20 rounded text-green-400 text-sm"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-green-400 mb-1">Category</label>
                        <select
                          value={resource.category || "supplementary"}
                          onChange={(e) => {
                            const newResources = [...formData.resources];
                            newResources[index] = { ...resource, category: e.target.value };
                            setFormData(prev => ({ ...prev, resources: newResources }));
                          }}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-green-400/20 rounded text-green-400 text-sm"
                        >
                          <option value="essential">🔴 Essential</option>
                          <option value="supplementary">🟡 Supplementary</option>
                          <option value="advanced">🟠 Advanced</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-green-400 mb-1">Description</label>
                        <input
                          type="text"
                          value={resource.description || ""}
                          onChange={(e) => {
                            const newResources = [...formData.resources];
                            newResources[index] = { ...resource, description: e.target.value };
                            setFormData(prev => ({ ...prev, resources: newResources }));
                          }}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-green-400/20 rounded text-green-400 text-sm"
                          placeholder="Brief description of the resource"
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={resource.downloadable || false}
                            onChange={(e) => {
                              const newResources = [...formData.resources];
                              newResources[index] = { ...resource, downloadable: e.target.checked };
                              setFormData(prev => ({ ...prev, resources: newResources }));
                            }}
                            className="rounded bg-gray-700 border-green-400/30 text-green-400"
                          />
                          <span className="text-green-400 text-xs">📥 Downloadable</span>
                        </label>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const newResources = formData.resources.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, resources: newResources }));
                          }}
                          className="px-3 py-1 bg-red-600/20 border border-red-400/30 rounded text-red-400 text-xs hover:bg-red-600/30"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add Resource Button */}
                <button
                  type="button"
                  onClick={() => {
                    const newResource = {
                      name: "",
                      type: "url",
                      url: "",
                      description: "",
                      category: "supplementary",
                      downloadable: false
                    };
                    setFormData(prev => ({ 
                      ...prev, 
                      resources: [...prev.resources, newResource] 
                    }));
                  }}
                  className="w-full py-3 border-2 border-dashed border-green-400/30 rounded-lg text-green-400 hover:border-green-400/50 hover:bg-green-400/5 transition-all duration-300 font-mono text-sm"
                >
                  ➕ Add Resource
                </button>
              </div>
            </div>

            {/* Outcomes Section (for labs and games) */}
            {(formData.type === "lab" || formData.type === "game") && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ 🎯 Learning Outcomes *
                </label>
                
                {/* Outcomes List */}
                <div className="space-y-3">
                  {formData.outcomes.map((outcome, index) => (
                    <div key={index} className="bg-blue-900/20 border border-blue-400/20 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-blue-400 mb-1">Title *</label>
                          <input
                            type="text"
                            value={outcome.title || ""}
                            onChange={(e) => {
                              const newOutcomes = [...formData.outcomes];
                              newOutcomes[index] = { ...outcome, title: e.target.value };
                              setFormData(prev => ({ ...prev, outcomes: newOutcomes }));
                            }}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-blue-400/20 rounded text-blue-400 text-sm"
                            placeholder="What will students learn?"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-400 mb-1">Description *</label>
                          <textarea
                            value={outcome.description || ""}
                            onChange={(e) => {
                              const newOutcomes = [...formData.outcomes];
                              newOutcomes[index] = { ...outcome, description: e.target.value };
                              setFormData(prev => ({ ...prev, outcomes: newOutcomes }));
                            }}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-blue-400/20 rounded text-blue-400 text-sm resize-none"
                            rows="2"
                            placeholder="Detailed description of the learning outcome"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-400 mb-1">Skills (comma-separated)</label>
                          <input
                            type="text"
                            value={outcome.skills ? outcome.skills.join(", ") : ""}
                            onChange={(e) => {
                              const newOutcomes = [...formData.outcomes];
                              newOutcomes[index] = { 
                                ...outcome, 
                                skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                              };
                              setFormData(prev => ({ ...prev, outcomes: newOutcomes }));
                            }}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-blue-400/20 rounded text-blue-400 text-sm"
                            placeholder="penetration testing, vulnerability assessment, etc."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-blue-400 mb-1">Category</label>
                            <select
                              value={outcome.category || "primary"}
                              onChange={(e) => {
                                const newOutcomes = [...formData.outcomes];
                                newOutcomes[index] = { ...outcome, category: e.target.value };
                                setFormData(prev => ({ ...prev, outcomes: newOutcomes }));
                              }}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-blue-400/20 rounded text-blue-400 text-sm"
                            >
                              <option value="primary">🎯 Primary</option>
                              <option value="secondary">📚 Secondary</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-blue-400 mb-1">Difficulty</label>
                            <select
                              value={outcome.difficulty || "beginner"}
                              onChange={(e) => {
                                const newOutcomes = [...formData.outcomes];
                                newOutcomes[index] = { ...outcome, difficulty: e.target.value };
                                setFormData(prev => ({ ...prev, outcomes: newOutcomes }));
                              }}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-blue-400/20 rounded text-blue-400 text-sm"
                            >
                              <option value="beginner">🟢 Beginner</option>
                              <option value="intermediate">🟡 Intermediate</option>
                              <option value="advanced">🔴 Advanced</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const newOutcomes = formData.outcomes.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, outcomes: newOutcomes }));
                            }}
                            className="px-3 py-1 bg-red-600/20 border border-red-400/30 rounded text-red-400 text-xs hover:bg-red-600/30"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Outcome Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const newOutcome = {
                        title: "",
                        description: "",
                        skills: [],
                        category: "primary",
                        difficulty: "beginner"
                      };
                      setFormData(prev => ({ 
                        ...prev, 
                        outcomes: [...prev.outcomes, newOutcome] 
                      }));
                    }}
                    className="w-full py-3 border-2 border-dashed border-blue-400/30 rounded-lg text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/5 transition-all duration-300 font-mono text-sm"
                  >
                    🎯 Add Learning Outcome
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Metadata Section */}
            <div className="border-t border-green-400/30 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono uppercase tracking-wider">
                ◆ 📊 Advanced Metadata
              </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ 🏷️ Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                  placeholder="cybersecurity, network, basics"
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ 📈 Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
                >
                  <option value="beginner" className="bg-gray-900 text-green-400">▸ 🟢 Beginner</option>
                  <option value="intermediate" className="bg-gray-900 text-green-400">▸ 🟡 Intermediate</option>
                  <option value="advanced" className="bg-gray-900 text-green-400">▸ 🟠 Advanced</option>
                  <option value="expert" className="bg-gray-900 text-green-400">▸ 🔴 Expert</option>
                </select>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ 🎯 Learning Objectives
                </label>
                <textarea
                  value={formData.learningObjectives.join("\n")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      learningObjectives: e.target.value
                        .split("\n")
                        .filter(Boolean),
                    }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50 resize-none"
                  rows="3"
                  placeholder="Enter each learning objective on a new line"
                />
              </div>

              {/* Technical Requirements */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ 💻 Technical Requirements
                </label>
                <textarea
                  value={formData.technicalRequirements.join("\n")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      technicalRequirements: e.target.value
                        .split("\n")
                        .filter(Boolean),
                    }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50 resize-none"
                  rows="3"
                  placeholder="Virtual machine, Kali Linux, etc."
                />
              </div>

              {/* Author & Version */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ 👤 Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                  placeholder="Content author name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ 🔢 Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      version: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                  placeholder="1.0"
                />
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ 🌐 Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
                >
                  <option value="en" className="bg-gray-900 text-green-400">▸ 🇺🇸 English</option>
                  <option value="es" className="bg-gray-900 text-green-400">▸ 🇪🇸 Spanish</option>
                  <option value="fr" className="bg-gray-900 text-green-400">▸ 🇫🇷 French</option>
                  <option value="de" className="bg-gray-900 text-green-400">▸ 🇩🇪 German</option>
                  <option value="zh" className="bg-gray-900 text-green-400">▸ 🇨🇳 Chinese</option>
                  <option value="ja" className="bg-gray-900 text-green-400">▸ 🇯🇵 Japanese</option>
                </select>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider">
                  ▶ 🖼️ Thumbnail URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnailUrl: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
            </div>

              {/* Accessibility Features */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-green-400 mb-3 font-mono uppercase tracking-wider">
                  ▶ ♿ Accessibility Features
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.accessibility.hasSubtitles}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accessibility: {
                            ...prev.accessibility,
                            hasSubtitles: e.target.checked,
                          },
                        }))
                      }
                      className="rounded bg-gray-700 border-green-400/30 text-green-400 focus:ring-green-400"
                    />
                    <span className="text-green-400 text-sm font-mono">
                      ▸ 📝 Has Subtitles
                    </span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.accessibility.hasTranscript}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accessibility: {
                            ...prev.accessibility,
                            hasTranscript: e.target.checked,
                          },
                        }))
                      }
                      className="rounded bg-gray-700 border-green-400/30 text-green-400 focus:ring-green-400"
                    />
                    <span className="text-green-400 text-sm font-mono">
                      ▸ 📄 Has Transcript
                    </span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.accessibility.hasAudioDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accessibility: {
                            ...prev.accessibility,
                            hasAudioDescription: e.target.checked,
                          },
                        }))
                      }
                      className="rounded bg-gray-700 border-green-400/30 text-green-400 focus:ring-green-400"
                    />
                    <span className="text-green-400 text-sm font-mono">
                      ▸ 🔊 Audio Description
                    </span>
                  </label>
                </div>
              </div>

              {/* Activation Status */}
              <div className="mt-6">
                <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-400/30 rounded-xl p-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="rounded bg-gray-700 border-green-400/30 text-green-400 focus:ring-green-400"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-semibold font-mono uppercase tracking-wider">
                        ◆ ⚡ Activate Immediately
                      </span>
                    </div>
                  </label>
                  <p className="text-green-400/60 text-xs mt-2 ml-8 font-mono">
                    Content will be active and available to students immediately after creation
                  </p>
                </div>
              </div>
            </div>

            {/* Form Submission */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-green-400/20">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-400/20 to-green-500/20 border-2 border-green-400/50 hover:from-green-400/30 hover:to-green-500/30 hover:border-green-400/70 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      ◊ SAVING...
                    </>
                  ) : editingContent ? (
                    "◆ UPDATE CONTENT"
                  ) : (
                    "◆ CREATE CONTENT"
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onResetForm();
                }}
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

export default ContentFormModal;