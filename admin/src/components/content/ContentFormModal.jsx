import {
  ChevronRightIcon,
  EyeIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30 shadow-2xl transform animate-slideUp">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-cyan-500/30 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                {editingContent ? "✏️" : "➕"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-cyan-400">
                  {editingContent ? "Edit Content" : "Create New Content"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {editingContent
                    ? "Update content information"
                    : "Add new learning content to the database"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onResetForm();
              }}
              className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Module and Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a1 1 0 011-1h2a1 1 0 011 1v2M7 7h10"
                  />
                </svg>
                Module*
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
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400 transition-all duration-200"
                required
              >
                <option value="">Select Module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
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
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10M6 4v16a2 2 0 002 2h8a2 2 0 002-2V4M6 4H4a2 2 0 00-2 2v14a2 2 0 002 2h2"
                  />
                </svg>
                Content Type*
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400 transition-all duration-200"
                required
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
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
              Title*
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400 transition-all duration-200"
              required
              maxLength="100"
              placeholder="Enter a descriptive title for your content..."
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
                        <div>No existing sections found</div>
                        <div className="text-xs mt-1">
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
              Description*
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
              required
              maxLength="500"
              rows="3"
            />
          </div>

          {/* URL Input */}
          {formData.type === "video" && (
            <div className="space-y-2">
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
                Video URL*
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
                required={formData.type === "video"}
                placeholder="https://example.com/video.mp4"
              />
            </div>
          )}

          {/* Instructions Input */}
          {(formData.type === "lab" || formData.type === "game") && (
            <div className="space-y-2">
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
                Instructions*
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    instructions: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
                required={formData.type === "lab" || formData.type === "game"}
                maxLength="2000"
                rows="4"
                placeholder="Detailed instructions for the lab or game..."
              />
            </div>
          )}

          {/* Duration Input */}
          <div className="space-y-2">
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
              Duration (minutes)
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
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
              min="1"
              max="300"
            />
          </div>

          {/* Resources Input */}
          <div className="space-y-2">
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
              Resources (URLs or file paths)
            </label>
            <textarea
              value={formData.resources.join("\n")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  resources: e.target.value
                    .split("\n")
                    .filter((line) => line.trim() !== ""),
                }))
              }
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
              rows="3"
              placeholder="Enter each resource URL or file path on a new line"
            />
          </div>

          {/* Enhanced Metadata Section */}
          <div className="border-t border-cyan-500/30 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 font-mono retro-glow">
              📊 Advanced Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tags */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-cyan-400">
                  🏷️ Tags (comma-separated)
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
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
                  placeholder="cybersecurity, network, basics"
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-cyan-400">
                  📈 Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
                >
                  <option value="beginner">🟢 Beginner</option>
                  <option value="intermediate">🟡 Intermediate</option>
                  <option value="advanced">🟠 Advanced</option>
                  <option value="expert">🔴 Expert</option>
                </select>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-cyan-400">
                  🎯 Learning Objectives
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
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
                  rows="3"
                  placeholder="Enter each learning objective on a new line"
                />
              </div>

              {/* Technical Requirements */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-cyan-400">
                  💻 Technical Requirements
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
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
                  rows="3"
                  placeholder="Virtual machine, Kali Linux, etc."
                />
              </div>

              {/* Author & Version */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-cyan-400">
                  👤 Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
                  placeholder="Content author name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-cyan-400">
                  🔢 Version
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
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
                  placeholder="1.0"
                />
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-cyan-400">
                  🌐 Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Spanish</option>
                  <option value="fr">🇫🇷 French</option>
                  <option value="de">🇩🇪 German</option>
                  <option value="zh">🇨🇳 Chinese</option>
                  <option value="ja">🇯🇵 Japanese</option>
                </select>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-cyan-400">
                  🖼️ Thumbnail URL
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
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
            </div>

            {/* Accessibility Features */}
            <div className="mt-6">
              <label className="flex items-center text-sm font-semibold text-cyan-400 mb-3">
                ♿ Accessibility Features
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
                    className="rounded bg-gray-700 border-gray-600 text-cyan-400 focus:ring-cyan-400"
                  />
                  <span className="text-green-400 text-sm">
                    📝 Has Subtitles
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
                    className="rounded bg-gray-700 border-gray-600 text-cyan-400 focus:ring-cyan-400"
                  />
                  <span className="text-green-400 text-sm">
                    📄 Has Transcript
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
                    className="rounded bg-gray-700 border-gray-600 text-cyan-400 focus:ring-cyan-400"
                  />
                  <span className="text-green-400 text-sm">
                    🔊 Audio Description
                  </span>
                </label>
              </div>
            </div>

            {/* Publishing Status */}
            <div className="mt-6 flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublished: e.target.checked,
                    }))
                  }
                  className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                />
                <span className="text-green-400 font-semibold">
                  🚀 Publish Immediately
                </span>
              </label>
            </div>
          </div>

          {/* Form Submission */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                onResetForm();
              }}
              className="px-4 py-2 text-green-400 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-cyber-green text-black rounded-md hover:bg-green-400 disabled:opacity-50"
            >
              {loading ? "Saving..." : editingContent ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentFormModal;