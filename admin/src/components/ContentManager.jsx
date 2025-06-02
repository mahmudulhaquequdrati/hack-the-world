import {
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  ExclamationCircleIcon,
  EyeIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
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
    { value: "video", label: "Video", icon: "🎥", color: "bg-blue-500" },
    { value: "lab", label: "Lab", icon: "🧪", color: "bg-purple-500" },
    { value: "game", label: "Game", icon: "🎮", color: "bg-green-500" },
    {
      value: "document",
      label: "Document",
      icon: "📄",
      color: "bg-yellow-500",
    },
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
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-cyan-500/30">
      {/* Enhanced Table Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 border-b border-cyan-500/30">
        <div className="flex items-center">
          <FolderIcon className="h-5 w-5 text-cyan-400 mr-2" />
          <h3 className="text-lg font-semibold text-cyan-400">
            Content Database
          </h3>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {content.length} items
            </span>
            <div className="h-4 w-px bg-gray-600"></div>
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              {content.reduce((total, item) => total + (item.duration || 0), 0)}{" "}
              min total
            </span>
          </div>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Content Information
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Type & Duration
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Module & Section
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700/50">
          {content.map((item, index) => {
            const module = modules.find((m) => m.id === item.module?.id);
            const contentType = contentTypes.find((t) => t.value === item.type);

            return (
              <tr
                key={item.id}
                className="hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/30 transition-all duration-200 group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg ${contentType?.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    >
                      {contentType?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-green-400 truncate group-hover:text-green-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {item.description?.substring(0, 120)}
                        {item.description?.length > 120 && "..."}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm ${contentType?.color}`}
                    >
                      {contentType?.label}
                    </span>
                    <div className="flex items-center text-xs text-gray-400">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {item.duration} min
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-300 font-medium">
                      {module?.title || "Unknown Module"}
                    </div>
                    <div className="flex items-center text-xs text-cyan-400">
                      <FolderIcon className="h-3 w-3 mr-1" />
                      {item.section || "No Section"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center text-sm font-medium"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <div className="h-4 w-px bg-gray-600"></div>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 flex items-center text-sm font-medium"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                    <button
                      onClick={() => handleDelete(item, true)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center text-sm font-medium"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Permanent
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {content.length === 0 && (
        <div className="text-center py-12">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400 opacity-50" />
          <h3 className="mt-2 text-sm font-medium text-gray-400">
            No content found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first content item.
          </p>
        </div>
      )}
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
                setShowForm(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          {/* Module and Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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
              <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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
            <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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
            <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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
                        onClick={() => handleSectionSelect(section)}
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
            <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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
              <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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
              <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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
            <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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
            <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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

          {/* Form Submission */}
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
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
            <FolderIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              [CONTENT MANAGEMENT]
            </h1>
            <p className="text-green-400 mt-1 flex items-center">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Manage learning content including videos, labs, games, and
              documents
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Content
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border border-green-500/50 text-green-400 px-6 py-4 rounded-lg flex items-center shadow-lg animate-slideUp">
          <CheckCircleIcon className="w-6 h-6 mr-3 text-green-500" />
          <div>
            <div className="font-semibold">Success!</div>
            <div className="text-sm">{success}</div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg flex items-center shadow-lg animate-slideUp">
          <ExclamationCircleIcon className="w-6 h-6 mr-3 text-red-500" />
          <div>
            <div className="font-semibold">Error!</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}

      {/* Enhanced Controls */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-xl border border-cyan-500/30">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6">
            {/* Content Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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
                Filter by Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400 transition-all duration-200"
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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-cyan-400 flex items-center">
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
                Filter by Module
              </label>
              <select
                value={filters.moduleId}
                onChange={(e) => handleFilterChange("moduleId", e.target.value)}
                className="px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400 transition-all duration-200"
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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-cyan-400 flex items-center">
                <EyeIcon className="h-4 w-4 mr-2" />
                View Mode
              </label>
              <div className="flex rounded-lg shadow-sm border border-gray-600 overflow-hidden">
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  }`}
                >
                  📋 List
                </button>
                <button
                  onClick={() => handleViewModeChange("groupedByModule")}
                  className={`px-4 py-2 text-sm font-medium border-l border-gray-600 transition-all duration-200 ${
                    viewMode === "groupedByModule"
                      ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  }`}
                >
                  📚 By Module
                </button>
                <button
                  onClick={() => handleViewModeChange("groupedByType")}
                  className={`px-4 py-2 text-sm font-medium border-l border-gray-600 transition-all duration-200 ${
                    viewMode === "groupedByType"
                      ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  }`}
                >
                  🎯 By Type
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-900/50 rounded-lg border border-gray-600">
              <span className="text-gray-400">Total Items:</span>
              <span className="font-bold text-cyan-400">{content.length}</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-900/50 rounded-lg border border-gray-600">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Total Time:</span>
              <span className="font-bold text-green-400">
                {content.reduce(
                  (total, item) => total + (item.duration || 0),
                  0
                )}{" "}
                min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent shadow-lg"></div>
          <p className="mt-4 text-cyan-400 font-medium">Loading content...</p>
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
