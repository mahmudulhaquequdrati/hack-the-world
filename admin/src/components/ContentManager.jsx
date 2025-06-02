import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { contentAPI, modulesAPI } from "../services/api";

const ContentManager = () => {
  const [content, setContent] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Section auto-complete state
  const [availableSections, setAvailableSections] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [sectionInputValue, setSectionInputValue] = useState("");

  // Filters (removed pagination)
  const [filters, setFilters] = useState({
    type: "",
    moduleId: "",
  });

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    moduleId: "",
    type: "video",
    title: "",
    description: "",
    section: "",
    url: "",
    instructions: "",
    duration: 1,
    resources: [],
  });

  // View modes (removed groupedBySection)
  const [viewMode, setViewMode] = useState("list"); // list, groupedByModule, groupedByType
  const [groupedContent, setGroupedContent] = useState({});

  const contentTypes = [
    { value: "video", label: "Video", icon: "🎥" },
    { value: "lab", label: "Lab", icon: "🧪" },
    { value: "game", label: "Game", icon: "🎮" },
    { value: "document", label: "Document", icon: "📄" },
  ];

  const difficulties = ["beginner", "intermediate", "advanced", "expert"];

  useEffect(() => {
    fetchModules();
    if (viewMode === "list") {
      fetchContent();
    } else if (viewMode === "groupedByModule") {
      if (modules.length > 0) {
        fetchAllModulesGrouped();
      }
    } else if (viewMode === "groupedByType") {
      if (filters.type) {
        fetchContentByType(filters.type);
      } else {
        fetchAllContentGroupedByType();
      }
    }
  }, [filters, viewMode]);

  useEffect(() => {
    // Fetch modules separately and then trigger appropriate content fetch
    fetchModules();
  }, []);

  useEffect(() => {
    if (filters.type || filters.moduleId) {
      if (filters.type && !filters.moduleId) {
        fetchContentByType(filters.type);
      } else if (filters.moduleId && !filters.type) {
        fetchContentByModule(filters.moduleId);
      } else if (filters.type && filters.moduleId) {
        fetchContentByType(filters.type, filters.moduleId);
      }
    } else {
      fetchContent();
    }
  }, [filters]);

  // Fetch available sections when module is selected
  useEffect(() => {
    if (formData.moduleId) {
      fetchSectionsByModule(formData.moduleId);
    } else {
      setAvailableSections([]);
    }
  }, [formData.moduleId]);

  const fetchModules = async () => {
    try {
      const response = await modulesAPI.getAll();
      setModules(response.data || []);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.moduleId) params.moduleId = filters.moduleId;
      // Remove pagination params

      const response = await contentAPI.getAll(params);
      setContent(response.data || []);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  const fetchContentByType = async (type, moduleId = null) => {
    try {
      setLoading(true);
      const response = await contentAPI.getByType(type, moduleId);
      setGroupedContent({ [type]: response.data || [] });
    } catch (err) {
      console.error("Error fetching content by type:", err);
      setError("Failed to fetch content by type");
    } finally {
      setLoading(false);
    }
  };

  const fetchContentByModule = async (moduleId) => {
    try {
      setLoading(true);
      const response = await contentAPI.getByModule(moduleId);
      setContent(response.data || []);
    } catch (err) {
      console.error("Error fetching content for module:", err);
      setError("Failed to fetch content for module");
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionsByModule = async (moduleId) => {
    try {
      setSectionLoading(true);
      const response = await contentAPI.getSectionsByModule(moduleId);
      setAvailableSections(response.data || []);
    } catch (err) {
      console.error("Failed to fetch sections:", err);
      setAvailableSections([]);
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchAllContentGroupedByType = async () => {
    try {
      setLoading(true);

      // Fetch all content in a single API call
      const response = await contentAPI.getAll({
        moduleId: filters.moduleId || undefined,
      });
      const allContent = response.data || [];

      // Group content by type on the frontend
      const allGroupedContent = {};

      allContent.forEach((item) => {
        const type = item.type;
        if (type) {
          if (!allGroupedContent[type]) {
            allGroupedContent[type] = [];
          }
          allGroupedContent[type].push(item);
        }
      });

      setGroupedContent(allGroupedContent);
    } catch (err) {
      console.error("Error fetching content grouped by type:", err);
      setError("Failed to fetch content grouped by type");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllModulesGrouped = async () => {
    try {
      setLoading(true);

      // Fetch all content in a single API call
      const response = await contentAPI.getAll();
      const allContent = response.data || [];

      // Group content by module and section on the frontend
      const allGroupedContent = {};

      // Initialize modules that have content
      allContent.forEach((item) => {
        const moduleId = item.moduleId || item.module?.id;
        const module = modules.find((m) => m.id === moduleId);

        if (module && moduleId) {
          if (!allGroupedContent[moduleId]) {
            allGroupedContent[moduleId] = {
              module: module,
              sections: {},
            };
          }

          const section = item.section || "No Section";
          if (!allGroupedContent[moduleId].sections[section]) {
            allGroupedContent[moduleId].sections[section] = [];
          }

          allGroupedContent[moduleId].sections[section].push(item);
        }
      });

      setGroupedContent(allGroupedContent);
    } catch (err) {
      console.error("Error fetching grouped content:", err);
      setError("Failed to fetch grouped content");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === "groupedByModule") {
      fetchAllModulesGrouped();
    } else if (mode === "groupedByType") {
      if (filters.type) {
        fetchContentByType(filters.type);
      } else {
        fetchAllContentGroupedByType();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      moduleId: "",
      type: "video",
      title: "",
      description: "",
      section: "",
      url: "",
      instructions: "",
      duration: 1,
      resources: [],
    });
    setEditingContent(null);
    // Reset section auto-complete state
    setSectionInputValue("");
    setShowSectionDropdown(false);
    setAvailableSections([]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // Validate required fields
      if (!formData.title || !formData.description || !formData.moduleId) {
        setError("Please fill in all required fields");
        return;
      }

      // Type-specific validation
      if (formData.type === "video" && !formData.url) {
        setError("URL is required for video content");
        return;
      }
      if (
        (formData.type === "lab" || formData.type === "game") &&
        !formData.instructions
      ) {
        setError("Instructions are required for lab and game content");
        return;
      }

      const contentData = { ...formData };

      if (editingContent) {
        await contentAPI.update(editingContent.id, contentData);
        setSuccess("Content updated successfully");
      } else {
        await contentAPI.create(contentData);
        setSuccess("Content created successfully");
      }

      setShowForm(false);
      resetForm();
      fetchContent();
      // Refresh grouped content if in grouped view
      if (viewMode === "groupedByModule") {
        fetchAllModulesGrouped();
      } else if (viewMode === "groupedByType") {
        if (filters.type) {
          fetchContentByType(filters.type);
        } else {
          fetchAllContentGroupedByType();
        }
      }
    } catch (err) {
      console.error("Error saving content:", err);
      setError(err.response?.data?.message || "Failed to save content");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contentItem) => {
    console.log(contentItem);

    setEditingContent(contentItem);
    setFormData({
      moduleId: contentItem.moduleId || "",
      type: contentItem.type || "video",
      title: contentItem.title || "",
      description: contentItem.description || "",
      section: contentItem.section || "",
      url: contentItem.url || "",
      instructions: contentItem.instructions || "",
      duration: contentItem.duration || 1,
      resources: contentItem.resources || [],
    });
    // Set section input value for auto-complete
    setSectionInputValue(contentItem.section || "");
    setShowForm(true);
  };

  const handleDelete = async (contentItem, permanent = false) => {
    if (
      !window.confirm(
        permanent
          ? `Are you sure you want to permanently delete "${contentItem.title}"? This action cannot be undone.`
          : `Are you sure you want to delete "${contentItem.title}"? This can be undone later.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      if (permanent) {
        await contentAPI.permanentDelete(contentItem.id);
        setSuccess("Content permanently deleted successfully");
      } else {
        await contentAPI.delete(contentItem.id);
        setSuccess("Content deleted successfully");
      }
      fetchContent();
      // Refresh grouped content if in grouped view
      if (viewMode === "groupedByModule") {
        fetchAllModulesGrouped();
      } else if (viewMode === "groupedByType") {
        if (filters.type) {
          fetchContentByType(filters.type);
        } else {
          fetchAllContentGroupedByType();
        }
      }
    } catch (err) {
      console.error("Error deleting content:", err);
      setError(err.response?.data?.message || "Failed to delete content");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionInputChange = (e) => {
    const value = e.target.value;
    setSectionInputValue(value);
    setFormData((prev) => ({ ...prev, section: value }));
    // Show dropdown when typing (if module is selected)
    if (formData.moduleId) {
      setShowSectionDropdown(true);
    }
  };

  const handleSectionSelect = (section) => {
    setSectionInputValue(section);
    setFormData((prev) => ({ ...prev, section }));
    setShowSectionDropdown(false);
  };

  const handleSectionInputFocus = () => {
    // Always show dropdown when focused (if module is selected)
    // This allows creating new sections even when no existing sections
    if (formData.moduleId) {
      setShowSectionDropdown(true);
    }
  };

  const handleSectionInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowSectionDropdown(false), 200);
  };

  const filteredSections = availableSections.filter((section) =>
    section.toLowerCase().includes(sectionInputValue.toLowerCase())
  );

  const renderContentList = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow border border-gray-600">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
              Content
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
              Module
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
              Section
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {content.map((item) => {
            const module = modules.find((m) => m.id === item.module?.id);
            const contentType = contentTypes.find((t) => t.value === item.type);

            return (
              <tr key={item.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-400">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-400">
                    {item.description?.substring(0, 100)}
                    {item.description?.length > 100 && "..."}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyber-green text-black">
                    {contentType?.icon} {contentType?.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {module?.title || "Unknown Module"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {item.section || "No Section"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {item.duration} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-cyber-green hover:text-green-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleDelete(item, true)}
                    className="text-red-600 hover:text-red-500"
                  >
                    Permanent
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderGroupedByModule = () => {
    return (
      <div className="space-y-6">
        {Object.entries(groupedContent).map(([moduleId, moduleData]) => (
          <div
            key={moduleId}
            className="bg-gray-800 p-6 rounded-lg shadow border border-gray-600"
          >
            <h3 className="text-lg font-medium text-green-400 mb-4">
              {moduleData.module?.title || "Unknown Module"}
            </h3>

            {/* Group content by sections within this module */}
            {Object.entries(moduleData.sections || {}).map(
              ([sectionName, sectionContent]) => (
                <div key={sectionName} className="mb-6 last:mb-0">
                  <h4 className="text-md font-medium text-cyan-400 mb-3 border-b border-gray-600 pb-2">
                    📁 {sectionName} ({sectionContent.length} items)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionContent.map((item) => {
                      const contentType = contentTypes.find(
                        (t) => t.value === item.type
                      );
                      return (
                        <div
                          key={item.id}
                          className="border border-gray-600 rounded-lg p-4 bg-gray-700"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyber-green text-black">
                              {contentType?.icon} {contentType?.label}
                            </span>
                          </div>
                          <h5 className="font-medium text-green-400">
                            {item.title}
                          </h5>
                          <p className="text-sm text-gray-400 mt-1">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-gray-500">
                              {item.duration} min
                            </span>
                            <div className="space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-xs text-cyber-green hover:text-green-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}

            {Object.keys(moduleData.sections || {}).length === 0 && (
              <p className="text-gray-500">No content found in this module</p>
            )}
          </div>
        ))}

        {Object.keys(groupedContent).length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No modules with content found</p>
          </div>
        )}
      </div>
    );
  };

  const renderGroupedByType = () => {
    return (
      <div className="space-y-6">
        {Object.entries(groupedContent).map(([typeName, items]) => {
          const contentType = contentTypes.find((t) => t.value === typeName);
          return (
            <div
              key={typeName}
              className="bg-gray-800 p-6 rounded-lg shadow border border-gray-600"
            >
              <h3 className="text-lg font-medium text-green-400 mb-4">
                {contentType?.icon} {contentType?.label} ({items.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                  const module = modules.find((m) => m.id === item.moduleId);
                  return (
                    <div
                      key={item.id}
                      className="border border-gray-600 rounded-lg p-4 bg-gray-700"
                    >
                      <h4 className="font-medium text-green-400">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">
                          {module?.title || "Unknown Module"} • {item.section} •{" "}
                          {item.duration} min
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-xs text-cyber-green hover:text-green-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {items.length === 0 && (
                <p className="text-gray-500">No {typeName} content found</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-600">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-400">
              {editingContent ? "Edit Content" : "Create New Content"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-green-400"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-400 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
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

              <div>
                <label className="block text-sm font-medium text-green-400 mb-1">
                  Content Type*
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
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

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Title*
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                required
                maxLength="100"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-green-400 mb-1">
                Section*
                <span className="ml-2 text-xs text-cyan-400">
                  [Debug: moduleId={formData.moduleId ? "✓" : "✗"}, disabled=
                  {!formData.moduleId ? "✓" : "✗"}]
                </span>
                {sectionLoading && (
                  <span className="ml-2 text-xs text-gray-400">
                    (Loading sections...)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={sectionInputValue}
                onChange={handleSectionInputChange}
                onFocus={() => {
                  console.log(
                    "Section input focused, moduleId:",
                    formData.moduleId,
                    "disabled:",
                    !formData.moduleId
                  );
                  handleSectionInputFocus();
                }}
                onBlur={handleSectionInputBlur}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                required
                maxLength="100"
                placeholder={
                  formData.moduleId
                    ? "Type to search existing sections or create new one"
                    : "Select a module first to see available sections"
                }
                disabled={!formData.moduleId}
              />
              {showSectionDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredSections.length > 0 ? (
                    <>
                      <div className="px-3 py-2 text-xs text-gray-400 bg-gray-800 border-b border-gray-600">
                        Existing sections (click to select):
                      </div>
                      {filteredSections.map((section) => (
                        <button
                          key={section}
                          type="button"
                          onClick={() => handleSectionSelect(section)}
                          className="w-full text-left px-4 py-2 text-green-400 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none transition-colors duration-150"
                        >
                          📁 {section}
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      {sectionInputValue ? (
                        <>
                          <div className="text-cyan-400 mb-1">
                            ✨ Create new section:
                          </div>
                          <div className="font-medium">
                            "{sectionInputValue}"
                          </div>
                          <div className="text-xs mt-1">
                            Press Enter or click outside to create
                          </div>
                        </>
                      ) : (
                        "No existing sections found. Type to create a new one."
                      )}
                    </div>
                  )}
                </div>
              )}
              {formData.moduleId &&
                availableSections.length > 0 &&
                !showSectionDropdown && (
                  <div className="mt-1 text-xs text-gray-400">
                    💡 {availableSections.length} existing section
                    {availableSections.length !== 1 ? "s" : ""} available
                  </div>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
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
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                required
                maxLength="500"
                rows="3"
              />
            </div>

            {formData.type === "video" && (
              <div>
                <label className="block text-sm font-medium text-green-400 mb-1">
                  Video URL*
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                  required={formData.type === "video"}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            )}

            {(formData.type === "lab" || formData.type === "game") && (
              <div>
                <label className="block text-sm font-medium text-green-400 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                  required={formData.type === "lab" || formData.type === "game"}
                  maxLength="2000"
                  rows="4"
                  placeholder="Detailed instructions for the lab or game..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
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
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                min="1"
                max="300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
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
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                rows="3"
                placeholder="Enter each resource URL or file path on a new line"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
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
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyber-green">
            [CONTENT MANAGEMENT]
          </h1>
          <p className="text-green-400 mt-2">
            Manage learning content including videos, labs, games, and documents
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Content
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded flex items-center">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center">
          <ExclamationCircleIcon className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-6 border border-gray-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Content Type Filter */}
            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Filter by Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
              >
                <option value="">All Types</option>
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Module Filter */}
            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Filter by Module
              </label>
              <select
                value={filters.moduleId}
                onChange={(e) => handleFilterChange("moduleId", e.target.value)}
                className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
              >
                <option value="">All Modules</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                View Mode
              </label>
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`px-3 py-2 text-sm rounded-l-md border ${
                    viewMode === "list"
                      ? "bg-cyber-green text-black border-cyber-green"
                      : "bg-gray-700 text-green-400 border-gray-600"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => handleViewModeChange("groupedByModule")}
                  className={`px-3 py-2 text-sm border-t border-r border-b ${
                    viewMode === "groupedByModule"
                      ? "bg-cyber-green text-black border-cyber-green"
                      : "bg-gray-700 text-green-400 border-gray-600"
                  }`}
                >
                  By Module
                </button>
                <button
                  onClick={() => handleViewModeChange("groupedByType")}
                  className={`px-3 py-2 text-sm rounded-r-md border-t border-r border-b ${
                    viewMode === "groupedByType"
                      ? "bg-cyber-green text-black border-cyber-green"
                      : "bg-gray-700 text-green-400 border-gray-600"
                  }`}
                >
                  By Type
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-green"></div>
          <p className="mt-2 text-green-400">Loading content...</p>
        </div>
      ) : (
        <>
          {viewMode === "list"
            ? renderContentList()
            : viewMode === "groupedByModule"
            ? renderGroupedByModule()
            : renderGroupedByType()}
        </>
      )}

      {/* Form Modal */}
      {showForm && renderForm()}
    </div>
  );
};

export default ContentManager;
