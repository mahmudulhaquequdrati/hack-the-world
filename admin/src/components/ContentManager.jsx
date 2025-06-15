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
import { Link } from "react-router-dom";
import { contentAPI, modulesAPI, phasesAPI } from "../services/api";

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
    // Enhanced metadata fields
    tags: [],
    difficulty: "beginner",
    prerequisites: [],
    learningObjectives: [],
    estimatedTime: 1,
    contentFormat: "",
    language: "en",
    accessibility: {
      hasSubtitles: false,
      hasTranscript: false,
      hasAudioDescription: false,
    },
    technicalRequirements: [],
    author: "",
    version: "1.0",
    lastUpdated: "",
    isPublished: false,
    thumbnailUrl: "",
  });

  // Multiple upload state
  const [showMultipleUpload, setShowMultipleUpload] = useState(false);
  const [multipleUploads, setMultipleUploads] = useState([]);
  const [selectedPhaseForUpload, setSelectedPhaseForUpload] = useState("");
  const [selectedModuleForUpload, setSelectedModuleForUpload] = useState("");
  const [phases, setPhases] = useState([]);

  // View modes (removed list view)
  const [viewMode, setViewMode] = useState("hierarchical"); // Default to hierarchical view
  const [groupedContent, setGroupedContent] = useState({});
  
  // Hierarchical navigation state
  const [selectedPhaseId, setSelectedPhaseId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [hierarchicalData, setHierarchicalData] = useState([]);

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


  useEffect(() => {
    fetchModules();
    fetchPhases();
  }, []);

  // Separate useEffect for content loading based on view mode and dependencies
  useEffect(() => {
    if (viewMode === "hierarchical") {
      if (phases.length > 0 && modules.length > 0) {
        fetchHierarchicalData();
      }
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
  }, [filters, viewMode, modules, phases]); // Added phases to dependency array

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

  const fetchPhases = async () => {
    try {
      const response = await phasesAPI.getAll();
      setPhases(response.data || []);
    } catch (err) {
      console.error("Error fetching phases:", err);
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

  const fetchHierarchicalData = async () => {
    try {
      setLoading(true);

      // Fetch all content
      const contentResponse = await contentAPI.getAll();
      const allContent = contentResponse.data || [];

      // Create hierarchical structure: Phases -> Modules -> Content
      const hierarchical = phases.map(phase => {
        const phaseModules = modules.filter(module => module.phaseId === phase.id);
        
        return {
          ...phase,
          modules: phaseModules.map(module => {
            const moduleContent = allContent.filter(content => content.moduleId === module.id);
            
            // Group content by sections within each module
            const contentBySections = {};
            moduleContent.forEach(content => {
              const section = content.section || "Uncategorized";
              if (!contentBySections[section]) {
                contentBySections[section] = [];
              }
              contentBySections[section].push(content);
            });

            return {
              ...module,
              content: moduleContent,
              contentBySections,
              contentCount: moduleContent.length,
              totalDuration: moduleContent.reduce((sum, item) => sum + (item.duration || 0), 0)
            };
          }).filter(module => module.content.length > 0) // Only show modules with content
        };
      }).filter(phase => phase.modules.length > 0); // Only show phases with modules that have content

      setHierarchicalData(hierarchical);
    } catch (err) {
      console.error("Error fetching hierarchical data:", err);
      setError("Failed to fetch hierarchical data");
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
    if (mode === "hierarchical") {
      fetchHierarchicalData();
    } else if (mode === "groupedByModule") {
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
      // Enhanced metadata fields
      tags: [],
      difficulty: "beginner",
      prerequisites: [],
      learningObjectives: [],
      estimatedTime: 1,
      contentFormat: "",
      language: "en",
      accessibility: {
        hasSubtitles: false,
        hasTranscript: false,
        hasAudioDescription: false,
      },
      technicalRequirements: [],
      author: "",
      version: "1.0",
      lastUpdated: "",
      isPublished: false,
      thumbnailUrl: "",
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
      // Refresh grouped content based on current view mode
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
      // Enhanced metadata fields
      tags: contentItem.tags || [],
      difficulty: contentItem.difficulty || "beginner",
      prerequisites: contentItem.prerequisites || [],
      learningObjectives: contentItem.learningObjectives || [],
      estimatedTime: contentItem.estimatedTime || 1,
      contentFormat: contentItem.contentFormat || "",
      language: contentItem.language || "en",
      accessibility: {
        hasSubtitles: contentItem.accessibility?.hasSubtitles || false,
        hasTranscript: contentItem.accessibility?.hasTranscript || false,
        hasAudioDescription: contentItem.accessibility?.hasAudioDescription || false,
      },
      technicalRequirements: contentItem.technicalRequirements || [],
      author: contentItem.author || "",
      version: contentItem.version || "1.0",
      lastUpdated: contentItem.lastUpdated || "",
      isPublished: contentItem.isPublished || false,
      thumbnailUrl: contentItem.thumbnailUrl || "",
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
      // Refresh grouped content based on current view mode
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

  // Multiple upload handlers
  const handleMultipleUploadStart = () => {
    setShowMultipleUpload(true);
    setMultipleUploads([{
      id: Date.now(),
      type: "video",
      title: "",
      description: "",
      section: "",
      url: "",
      instructions: "",
      duration: 1,
      resources: [],
    }]);
    setSelectedPhaseForUpload("");
    setSelectedModuleForUpload("");
  };

  const addNewUploadItem = () => {
    setMultipleUploads(prev => [...prev, {
      id: Date.now(),
      type: "video",
      title: "",
      description: "",
      section: "",
      url: "",
      instructions: "",
      duration: 1,
      resources: [],
    }]);
  };

  const removeUploadItem = (id) => {
    setMultipleUploads(prev => prev.filter(item => item.id !== id));
  };

  const updateUploadItem = (id, field, value) => {
    setMultipleUploads(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleMultipleUploadSubmit = async () => {
    if (!selectedModuleForUpload) {
      setError("Please select a module for upload");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Validate all items
      for (const item of multipleUploads) {
        if (!item.title || !item.description) {
          setError("Please fill in title and description for all items");
          return;
        }
        if (item.type === "video" && !item.url) {
          setError("URL is required for video content");
          return;
        }
        if ((item.type === "lab" || item.type === "game") && !item.instructions) {
          setError("Instructions are required for lab and game content");
          return;
        }
      }

      // Create all content items
      const createPromises = multipleUploads.map(item => {
        const contentData = {
          ...item,
          moduleId: selectedModuleForUpload,
        };
        delete contentData.id; // Remove temporary ID
        return contentAPI.create(contentData);
      });

      await Promise.all(createPromises);

      setSuccess(`Successfully created ${multipleUploads.length} content items`);
      setShowMultipleUpload(false);
      setMultipleUploads([]);
      fetchContent();
      // Refresh grouped content
      if (viewMode === "groupedByModule") {
        fetchAllModulesGrouped();
      } else if (viewMode === "groupedByType") {
        fetchAllContentGroupedByType();
      }
    } catch (err) {
      console.error("Error creating multiple content:", err);
      setError("Failed to create content items");
    } finally {
      setLoading(false);
    }
  };

  const closeMultipleUpload = () => {
    setShowMultipleUpload(false);
    setMultipleUploads([]);
    setSelectedPhaseForUpload("");
    setSelectedModuleForUpload("");
    setError("");
    setSuccess("");
  };

  const renderHierarchicalView = () => {
    return (
      <div className="space-y-8">
        {hierarchicalData.map((phase) => (
          <div key={phase.id} className="retro-card p-6">
            {/* Phase Header */}
            <div 
              className="flex items-center justify-between mb-6 cursor-pointer p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all"
              onClick={() => setSelectedPhaseId(selectedPhaseId === phase.id ? "" : phase.id)}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-white font-mono">P</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-purple-400 font-mono retro-glow">
                    📚 {phase.title}
                  </h2>
                  <p className="text-sm text-gray-400 font-mono">
                    {phase.modules.length} modules • {phase.modules.reduce((sum, m) => sum + m.contentCount, 0)} content items
                  </p>
                </div>
              </div>
              <div className="text-purple-400 text-2xl font-mono">
                {selectedPhaseId === phase.id ? "▲" : "▼"}
              </div>
            </div>

            {/* Modules (shown when phase is expanded) */}
            {selectedPhaseId === phase.id && (
              <div className="space-y-4 ml-8">
                {phase.modules.map((module) => (
                  <div key={module.id} className="border border-cyan-500/30 rounded-lg">
                    {/* Module Header */}
                    <div 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-900/30 to-green-900/30 rounded-t-lg cursor-pointer hover:bg-gradient-to-r hover:from-cyan-800/40 hover:to-green-800/40 transition-all"
                      onClick={() => setSelectedModuleId(selectedModuleId === module.id ? "" : module.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg font-bold text-white font-mono">M</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-cyan-400 font-mono">
                            📖 {module.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono">
                            <span>{module.contentCount} items</span>
                            <span>{module.totalDuration} min</span>
                            <span className={`px-2 py-1 rounded ${
                              module.difficulty === "Beginner" ? "bg-green-900 text-green-400" :
                              module.difficulty === "Intermediate" ? "bg-yellow-900 text-yellow-400" :
                              module.difficulty === "Advanced" ? "bg-orange-900 text-orange-400" :
                              "bg-red-900 text-red-400"
                            }`}>
                              {module.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-cyan-400 text-xl font-mono">
                        {selectedModuleId === module.id ? "▲" : "▼"}
                      </div>
                    </div>

                    {/* Content (shown when module is expanded) */}
                    {selectedModuleId === module.id && (
                      <div className="p-4 bg-gray-900/50 rounded-b-lg">
                        {Object.entries(module.contentBySections).map(([sectionName, sectionContent]) => (
                          <div key={sectionName} className="mb-6 last:mb-0">
                            <h4 className="text-md font-medium text-green-400 font-mono mb-3 border-b border-green-500/30 pb-2">
                              📁 {sectionName} ({sectionContent.length} items)
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {sectionContent.map((contentItem) => {
                                const contentType = contentTypes.find(t => t.value === contentItem.type);
                                return (
                                  <div key={contentItem.id} className="bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-lg p-4 hover:border-green-500/50 transition-all group">
                                    <div className="flex items-start justify-between mb-2">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${contentType?.color} text-white`}>
                                        {contentType?.icon} {contentType?.label}
                                      </span>
                                      <span className="text-xs text-gray-400 font-mono">{contentItem.duration}m</span>
                                    </div>
                                    
                                    <h5 className="font-medium text-green-400 mb-1 line-clamp-2 group-hover:text-green-300 transition-colors">
                                      {contentItem.title}
                                    </h5>
                                    
                                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                                      {contentItem.description}
                                    </p>
                                    
                                    <div className="flex gap-2">
                                      <Link
                                        to={`/content/${contentItem.id}`}
                                        className="text-xs text-green-400 hover:text-green-300 transition-colors font-mono"
                                      >
                                        [VIEW]
                                      </Link>
                                      <button
                                        onClick={() => handleEdit(contentItem)}
                                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                                      >
                                        [EDIT]
                                      </button>
                                      <button
                                        onClick={() => handleDelete(contentItem)}
                                        className="text-xs text-red-400 hover:text-red-300 transition-colors font-mono"
                                      >
                                        [DELETE]
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {hierarchicalData.length === 0 && (
          <div className="text-center py-12 retro-card">
            <div className="text-gray-400 mb-4 font-mono retro-text-cyan">
              ◆ No content hierarchy found ◆
            </div>
            <p className="text-gray-600 text-sm font-mono">
              Create some content to see the hierarchical structure
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderGroupedByModule = () => {
    return (
      <div className="space-y-6">
        {Object.entries(groupedContent).map(([moduleId, moduleData]) => (
          <div
            key={moduleId}
            className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-600"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionContent.map((item) => {
                      const contentType = contentTypes.find(
                        (t) => t.value === item.type
                      );
                      return (
                        <div
                          key={item.id}
                          className="border border-gray-600 rounded-lg p-4 bg-gray-700 hover:bg-gray-650 transition-colors duration-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyber-green text-black">
                              {contentType?.icon} {contentType?.label}
                            </span>
                          </div>
                          <h5 className="font-medium text-green-400 mb-1 line-clamp-2">
                            {item.title}
                          </h5>
                          <p className="text-sm text-gray-400 mt-1 mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {item.duration} min
                            </span>
                            <div className="flex gap-2">
                              <Link
                                to={`/content/${item.id}`}
                                className="text-xs text-green-400 hover:text-green-300 transition-colors"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
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
              <p className="text-gray-500 text-center py-4">
                No content found in this module
              </p>
            )}
          </div>
        ))}

        {Object.keys(groupedContent).length === 0 && (
          <div className="text-center py-8">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400 opacity-50 mb-4" />
            <p className="text-gray-500 text-lg">
              No modules with content found
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Start by creating some content for your modules
            </p>
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
              className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-600"
            >
              <h3 className="text-lg font-medium text-green-400 mb-4 flex items-center">
                <span className="mr-2">{contentType?.icon}</span>
                {contentType?.label} ({items.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => {
                  const module = modules.find((m) => m.id === item.moduleId);
                  return (
                    <div
                      key={item.id}
                      className="border border-gray-600 rounded-lg p-4 bg-gray-700 hover:bg-gray-650 transition-colors duration-200"
                    >
                      <h4 className="font-medium text-green-400 mb-1 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="space-y-2 mb-3">
                        <div className="text-xs text-gray-500">
                          📚 {module?.title || "Unknown Module"}
                        </div>
                        <div className="text-xs text-cyan-400">
                          📁 {item.section || "No Section"}
                        </div>
                        <div className="text-xs text-gray-500">
                          ⏱️ {item.duration} min
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/content/${item.id}`}
                          className="text-xs text-green-400 hover:text-green-300 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {items.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No {typeName} content found
                </p>
              )}
            </div>
          );
        })}

        {Object.keys(groupedContent).length === 0 && (
          <div className="text-center py-8">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400 opacity-50 mb-4" />
            <p className="text-gray-500 text-lg">No content found</p>
            <p className="text-gray-600 text-sm mt-2">
              Start by creating some content for your modules
            </p>
          </div>
        )}
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
                      tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean),
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
                    setFormData((prev) => ({ ...prev, difficulty: e.target.value }))
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
                      learningObjectives: e.target.value.split("\n").filter(Boolean),
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
                      technicalRequirements: e.target.value.split("\n").filter(Boolean),
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
                    setFormData((prev) => ({ ...prev, version: e.target.value }))
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
                    setFormData((prev) => ({ ...prev, language: e.target.value }))
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
                    setFormData((prev) => ({ ...prev, thumbnailUrl: e.target.value }))
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
                  <span className="text-green-400 text-sm">📝 Has Subtitles</span>
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
                  <span className="text-green-400 text-sm">📄 Has Transcript</span>
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
                  <span className="text-green-400 text-sm">🔊 Audio Description</span>
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
                    setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                  }
                  className="rounded bg-gray-700 border-gray-600 text-green-400 focus:ring-green-400"
                />
                <span className="text-green-400 font-semibold">🚀 Publish Immediately</span>
              </label>
            </div>
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
            <FolderIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              [CONTENT MANAGEMENT]
            </h1>
            <p className="text-green-400 mt-1 flex items-center text-sm sm:text-base">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Manage learning content including videos, labs, games, and
              documents
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Content
          </button>
          <button
            onClick={handleMultipleUploadStart}
            disabled={loading}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Multiple Upload</span>
            <span className="sm:hidden">Multi</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border border-green-500/50 text-green-400 px-4 sm:px-6 py-4 rounded-lg flex items-center shadow-lg animate-slideUp">
          <CheckCircleIcon className="w-6 h-6 mr-3 text-green-500 flex-shrink-0" />
          <div>
            <div className="font-semibold">Success!</div>
            <div className="text-sm">{success}</div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/50 text-red-400 px-4 sm:px-6 py-4 rounded-lg flex items-center shadow-lg animate-slideUp">
          <ExclamationCircleIcon className="w-6 h-6 mr-3 text-red-500 flex-shrink-0" />
          <div>
            <div className="font-semibold">Error!</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}

      {/* Enhanced Controls */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-4 sm:p-6 rounded-xl shadow-xl border border-cyan-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-wrap xl:items-center gap-4 lg:gap-6">
            {/* Content Type Filter */}
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
                Filter by Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400 transition-all duration-200"
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
                Filter by Module
              </label>
              <select
                value={filters.moduleId}
                onChange={(e) => handleFilterChange("moduleId", e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-700 text-green-400 transition-all duration-200"
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
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <label className="flex items-center text-sm font-semibold text-cyan-400">
                <EyeIcon className="h-4 w-4 mr-2" />
                View Mode
              </label>
              <div className="flex rounded-lg shadow-sm border border-gray-600 overflow-hidden">
                <button
                  onClick={() => handleViewModeChange("hierarchical")}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    viewMode === "hierarchical"
                      ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  }`}
                >
                  🔗 Hierarchical
                </button>
                <button
                  onClick={() => handleViewModeChange("groupedByModule")}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium border-l border-gray-600 transition-all duration-200 ${
                    viewMode === "groupedByModule"
                      ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  }`}
                >
                  📚 Phase/Module
                </button>
                <button
                  onClick={() => handleViewModeChange("groupedByType")}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium border-l border-gray-600 transition-all duration-200 ${
                    viewMode === "groupedByType"
                      ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  }`}
                >
                  🎯 Type/Section
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-sm">
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
          {viewMode === "hierarchical"
            ? renderHierarchicalView()
            : viewMode === "groupedByModule"
            ? renderGroupedByModule()
            : renderGroupedByType()}
        </>
      )}

      {/* Form Modal */}
      {showForm && renderForm()}

      {/* Multiple Upload Modal */}
      {showMultipleUpload && (
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
                  onClick={closeMultipleUpload}
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
                      .filter(module => module.phaseId === selectedPhaseForUpload)
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
                      onClick={addNewUploadItem}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {multipleUploads.map((item, itemIndex) => (
                      <div key={item.id} className="p-4 bg-gray-800 border border-gray-600 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium text-green-400">
                            Item #{itemIndex + 1}
                          </h4>
                          {multipleUploads.length > 1 && (
                            <button
                              onClick={() => removeUploadItem(item.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-cyan-400 mb-1">Type</label>
                            <select
                              value={item.type}
                              onChange={(e) => updateUploadItem(item.id, "type", e.target.value)}
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
                            <label className="block text-sm text-cyan-400 mb-1">Title*</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateUploadItem(item.id, "title", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                              placeholder="Content title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-cyan-400 mb-1">Section</label>
                            <input
                              type="text"
                              value={item.section}
                              onChange={(e) => updateUploadItem(item.id, "section", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                              placeholder="Content section"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm text-cyan-400 mb-1">Description*</label>
                            <textarea
                              value={item.description}
                              onChange={(e) => updateUploadItem(item.id, "description", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                              rows="2"
                              placeholder="Content description"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-cyan-400 mb-1">Duration (min)</label>
                            <input
                              type="number"
                              value={item.duration}
                              onChange={(e) => updateUploadItem(item.id, "duration", parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                              min="1"
                            />
                          </div>

                          {item.type === "video" && (
                            <div className="md:col-span-2">
                              <label className="block text-sm text-cyan-400 mb-1">Video URL*</label>
                              <input
                                type="url"
                                value={item.url}
                                onChange={(e) => updateUploadItem(item.id, "url", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-green-400"
                                placeholder="https://example.com/video.mp4"
                              />
                            </div>
                          )}

                          {(item.type === "lab" || item.type === "game") && (
                            <div className="md:col-span-3">
                              <label className="block text-sm text-cyan-400 mb-1">Instructions*</label>
                              <textarea
                                value={item.instructions}
                                onChange={(e) => updateUploadItem(item.id, "instructions", e.target.value)}
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
                  onClick={closeMultipleUpload}
                  className="px-6 py-2 text-green-400 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleMultipleUploadSubmit}
                  disabled={loading || !selectedModuleForUpload || multipleUploads.length === 0}
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
      )}
    </div>
  );
};

export default ContentManager;
