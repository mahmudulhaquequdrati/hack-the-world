import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";
import { contentAPI, modulesAPI, phasesAPI } from "../services/api";

// Import extracted components
import ContentCard from "./content/views/ContentCard";
import ContentFiltersAndControls from "./content/ContentFiltersAndControls";
import ContentFormModal from "./content/ContentFormModal";
import MultipleUploadModal from "./content/MultipleUploadModal";
import ActionButtons from "./content/ui/ActionButtons";
import TerminalHeader from "./content/ui/TerminalHeader";

const ContentManager = () => {
  // Core data state
  const [content, setContent] = useState([]);
  const [modules, setModules] = useState([]);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Section auto-complete state
  const [availableSections, setAvailableSections] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [sectionInputValue, setSectionInputValue] = useState("");

  // Filters
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

  // View modes
  const [viewMode, setViewMode] = useState("hierarchical");
  const [groupedContent, setGroupedContent] = useState({});
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

  // Computed values
  const filteredSections = useMemo(() => {
    if (!sectionInputValue) return availableSections;
    return availableSections.filter((section) =>
      section.toLowerCase().includes(sectionInputValue.toLowerCase())
    );
  }, [availableSections, sectionInputValue]);

  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.moduleId && item.moduleId !== filters.moduleId) return false;
      return true;
    });
  }, [content, filters]);

  // Initialize data
  useEffect(() => {
    fetchModules();
    fetchPhases();
    fetchContent();
  }, []);

  // Data fetching functions
  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getAll();
      setContent(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to fetch content");
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await modulesAPI.getAll();
      setModules(response.data || []);
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError("Failed to fetch modules");
    }
  };

  const fetchPhases = async () => {
    try {
      const response = await phasesAPI.getAll();
      setPhases(response.data || []);
    } catch (err) {
      console.error("Error fetching phases:", err);
      setError("Failed to fetch phases");
    }
  };

  // View mode handlers
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    switch (mode) {
      case "hierarchical":
        fetchHierarchicalData();
        break;
      case "groupedByModule":
        fetchAllModulesGrouped();
        break;
      case "groupedByType":
        fetchAllContentGroupedByType();
        break;
    }
  };

  const fetchHierarchicalData = async () => {
    try {
      setLoading(true);
      const [phasesResponse, modulesResponse, contentResponse] =
        await Promise.all([
          phasesAPI.getAll(),
          modulesAPI.getAll(),
          contentAPI.getAll(),
        ]);

      const phasesData = phasesResponse.data || [];
      const modulesData = modulesResponse.data || [];
      const contentData = contentResponse.data || [];

      const hierarchical = phasesData.map((phase) => {
        const phaseModules = modulesData.filter(
          (module) => module.phaseId === phase.id
        );
        const modulesWithContent = phaseModules.map((module) => {
          const moduleContent = contentData.filter(
            (content) => content.moduleId === module.id
          );
          return {
            ...module,
            content: moduleContent,
            contentCount: moduleContent.length,
          };
        });

        return {
          ...phase,
          modules: modulesWithContent,
        };
      });

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
      const [modulesResponse, contentResponse] = await Promise.all([
        modulesAPI.getAll(),
        contentAPI.getAll(),
      ]);

      const modulesData = modulesResponse.data || [];
      const contentData = contentResponse.data || [];

      const grouped = {};
      modulesData.forEach((module) => {
        const moduleContent = contentData.filter(
          (content) => content.moduleId === module.id
        );
        if (moduleContent.length > 0) {
          grouped[module.title] = moduleContent;
        }
      });

      setGroupedContent(grouped);
    } catch (err) {
      console.error("Error fetching grouped content:", err);
      setError("Failed to fetch grouped content");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllContentGroupedByType = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getAll();
      const contentData = response.data || [];

      const grouped = {};
      contentTypes.forEach((type) => {
        const typeContent = contentData.filter(
          (content) => content.type === type.value
        );
        if (typeContent.length > 0) {
          grouped[type.label] = typeContent;
        }
      });

      setGroupedContent(grouped);
    } catch (err) {
      console.error("Error fetching content grouped by type:", err);
      setError("Failed to fetch content grouped by type");
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
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
    setSectionInputValue("");
    setAvailableSections([]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const contentData = {
        ...formData,
        section: sectionInputValue || formData.section,
      };

      if (editingContent) {
        await contentAPI.update(editingContent.id, contentData);
        setSuccess("Content updated successfully!");
      } else {
        await contentAPI.create(contentData);
        setSuccess("Content created successfully!");
      }

      setShowForm(false);
      resetForm();
      fetchContent();

      // Refresh current view
      if (viewMode === "groupedByModule") {
        fetchAllModulesGrouped();
      } else if (viewMode === "groupedByType") {
        fetchAllContentGroupedByType();
      } else if (viewMode === "hierarchical") {
        fetchHierarchicalData();
      }
    } catch (err) {
      console.error("Error saving content:", err);
      setError("Failed to save content");
    } finally {
      setLoading(false);
    }
  };

  // Section handlers
  const handleSectionInputChange = (e) => {
    setSectionInputValue(e.target.value);
    setFormData((prev) => ({ ...prev, section: e.target.value }));
  };

  const handleSectionInputFocus = () => {
    if (formData.moduleId) {
      setShowSectionDropdown(true);
      fetchSectionsByModule(formData.moduleId);
    }
  };

  const handleSectionInputBlur = () => {
    setTimeout(() => {
      setShowSectionDropdown(false);
    }, 200);
  };

  const handleSectionSelect = (section) => {
    setSectionInputValue(section);
    setFormData((prev) => ({ ...prev, section }));
    setShowSectionDropdown(false);
  };

  const fetchSectionsByModule = async (moduleId) => {
    try {
      setSectionLoading(true);
      const response = await contentAPI.getSectionsByModule(moduleId);
      setAvailableSections(response.data || []);
    } catch (err) {
      console.error("Error fetching sections:", err);
      setAvailableSections([]);
    } finally {
      setSectionLoading(false);
    }
  };

  // Content action handlers
  const handleEdit = (contentItem) => {
    setEditingContent(contentItem);
    setFormData({
      ...contentItem,
      resources: contentItem.resources || [],
      tags: contentItem.tags || [],
      prerequisites: contentItem.prerequisites || [],
      learningObjectives: contentItem.learningObjectives || [],
      technicalRequirements: contentItem.technicalRequirements || [],
      accessibility: contentItem.accessibility || {
        hasSubtitles: false,
        hasTranscript: false,
        hasAudioDescription: false,
      },
    });
    setSectionInputValue(contentItem.section || "");
    setShowForm(true);
  };

  const handleDelete = async (contentItem) => {
    if (
      !window.confirm(`Are you sure you want to delete "${contentItem.title}"?`)
    ) {
      return;
    }

    try {
      setLoading(true);
      await contentAPI.delete(contentItem.id);
      setSuccess("Content deleted successfully!");
      fetchContent();

      // Refresh current view
      if (viewMode === "groupedByModule") {
        fetchAllModulesGrouped();
      } else if (viewMode === "groupedByType") {
        fetchAllContentGroupedByType();
      } else if (viewMode === "hierarchical") {
        fetchHierarchicalData();
      }
    } catch (err) {
      console.error("Error deleting content:", err);
      setError("Failed to delete content");
    } finally {
      setLoading(false);
    }
  };

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Multiple upload handlers
  const handleMultipleUploadStart = () => {
    setShowMultipleUpload(true);
    setMultipleUploads([
      {
        id: Date.now(),
        type: "video",
        title: "",
        description: "",
        section: "",
        url: "",
        instructions: "",
        duration: 1,
        resources: [],
      },
    ]);
  };

  const addNewUploadItem = () => {
    setMultipleUploads((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "video",
        title: "",
        description: "",
        section: "",
        url: "",
        instructions: "",
        duration: 1,
        resources: [],
      },
    ]);
  };

  const removeUploadItem = (id) => {
    setMultipleUploads((prev) => prev.filter((item) => item.id !== id));
  };

  const updateUploadItem = (id, field, value) => {
    setMultipleUploads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleMultipleUploadSubmit = async () => {
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
        if (
          (item.type === "lab" || item.type === "game") &&
          !item.instructions
        ) {
          setError("Instructions are required for lab and game content");
          return;
        }
      }

      // Create all content items
      const createPromises = multipleUploads.map((item) => {
        const contentData = {
          ...item,
          moduleId: selectedModuleForUpload,
        };
        delete contentData.id;
        return contentAPI.create(contentData);
      });

      await Promise.all(createPromises);

      setSuccess(
        `Successfully created ${multipleUploads.length} content items`
      );
      setShowMultipleUpload(false);
      setMultipleUploads([]);
      setSelectedPhaseForUpload("");
      setSelectedModuleForUpload("");
      fetchContent();

      // Refresh current view
      if (viewMode === "groupedByModule") {
        fetchAllModulesGrouped();
      } else if (viewMode === "groupedByType") {
        fetchAllContentGroupedByType();
      } else if (viewMode === "hierarchical") {
        fetchHierarchicalData();
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

  // Render hierarchical view
  const renderHierarchicalView = () => {
    return (
      <div className="space-y-8">
        {hierarchicalData.map((phase) => (
          <div
            key={phase.id}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
            {/* Phase Header */}
            <div
              className="relative z-10 flex items-center justify-between mb-6 cursor-pointer p-4 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300"
              onClick={() =>
                setSelectedPhaseId(selectedPhaseId === phase.id ? "" : phase.id)
              }
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-400/50 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-green-400/20">
                  <span className="text-2xl font-bold text-green-400 font-mono">
                    P
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wider">
                    📚 {phase.title}
                  </h2>
                  <p className="text-sm text-gray-400 font-mono">
                    ◆ {phase.modules.length} modules •{" "}
                    {phase.modules.reduce((sum, m) => sum + m.contentCount, 0)}{" "}
                    content items
                  </p>
                </div>
              </div>
              <div className="text-green-400 text-2xl font-mono">
                {selectedPhaseId === phase.id ? "▲" : "▼"}
              </div>
            </div>

            {/* Modules */}
            {selectedPhaseId === phase.id && (
              <div className="relative z-10 space-y-4 mt-6">
                {phase.modules.map((module) => (
                  <div key={module.id} className="ml-6">
                    <div
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-400/30 rounded-xl cursor-pointer hover:border-cyan-400/50 transition-all duration-300"
                      onClick={() =>
                        setSelectedModuleId(
                          selectedModuleId === module.id ? "" : module.id
                        )
                      }
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 border-2 border-cyan-400/50 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-cyan-400/20">
                          <span className="text-lg font-bold text-cyan-400 font-mono">
                            M
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-cyan-400 font-mono">
                            📖 {module.title}
                          </h3>
                          <p className="text-sm text-gray-400 font-mono">
                            ◆ {module.contentCount} content items
                          </p>
                        </div>
                      </div>
                      <div className="text-cyan-400 text-xl font-mono">
                        {selectedModuleId === module.id ? "▲" : "▼"}
                      </div>
                    </div>

                    {/* Content Items */}
                    {selectedModuleId === module.id &&
                      module.content.length > 0 && (
                        <div className="mt-4 ml-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {module.content.map((contentItem) => (
                              <ContentCard
                                key={contentItem.id}
                                contentItem={contentItem}
                                contentTypes={contentTypes}
                                onEdit={handleEdit}
                                onDelete={() => handleDelete(contentItem)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedModuleId === module.id &&
                      module.content.length === 0 && (
                        <div className="mt-4 ml-6 text-center text-gray-500 py-8">
                          <p className="font-mono">
                            No content items found in this module
                          </p>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render grouped view
  const renderGroupedView = () => {
    return (
      <div className="space-y-6">
        {Object.entries(groupedContent).map(([groupName, groupContent]) => (
          <div
            key={groupName}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wider mb-4">
                📁 {groupName} ({groupContent.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupContent.map((contentItem) => (
                  <ContentCard
                    key={contentItem.id}
                    contentItem={contentItem}
                    contentTypes={contentTypes}
                    onEdit={handleEdit}
                    onDelete={() => handleDelete(contentItem)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Terminal Header */}
        <TerminalHeader
          title="CONTENT_MANAGEMENT"
          subtitle="./manage --learning-content --cybersec-platform --enhanced"
        />

        {/* Action Buttons */}
        <ActionButtons
          onAddContent={() => setShowForm(true)}
          onBulkUpload={handleMultipleUploadStart}
          loading={loading}
        />

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            <span className="font-mono">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center">
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            <span className="font-mono">{error}</span>
          </div>
        )}

        {/* Filters and Controls */}
        <ContentFiltersAndControls
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          contentTypes={contentTypes}
          modules={modules}
          content={filteredContent}
        />

        {/* Content Display */}
        {loading ? (
          <div className="text-center text-green-400 py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <p className="mt-2 font-mono">Loading content...</p>
          </div>
        ) : (
          <div>
            {viewMode === "hierarchical" && renderHierarchicalView()}
            {(viewMode === "groupedByModule" || viewMode === "groupedByType") &&
              renderGroupedView()}
          </div>
        )}

        {/* Form Modal */}
        <ContentFormModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          editingContent={editingContent}
          formData={formData}
          setFormData={setFormData}
          modules={modules}
          availableSections={availableSections}
          sectionInputValue={sectionInputValue}
          setSectionInputValue={setSectionInputValue}
          showSectionDropdown={showSectionDropdown}
          setShowSectionDropdown={setShowSectionDropdown}
          sectionLoading={sectionLoading}
          filteredSections={filteredSections}
          onSubmit={handleFormSubmit}
          loading={loading}
          onSectionInputChange={handleSectionInputChange}
          onSectionInputFocus={handleSectionInputFocus}
          onSectionInputBlur={handleSectionInputBlur}
          onSectionSelect={handleSectionSelect}
          onResetForm={resetForm}
          contentTypes={contentTypes}
        />

        {/* Multiple Upload Modal */}
        <MultipleUploadModal
          isOpen={showMultipleUpload}
          onClose={closeMultipleUpload}
          phases={phases}
          modules={modules}
          selectedPhaseForUpload={selectedPhaseForUpload}
          setSelectedPhaseForUpload={setSelectedPhaseForUpload}
          selectedModuleForUpload={selectedModuleForUpload}
          setSelectedModuleForUpload={setSelectedModuleForUpload}
          multipleUploads={multipleUploads}
          onAddNewUploadItem={addNewUploadItem}
          onRemoveUploadItem={removeUploadItem}
          onUpdateUploadItem={updateUploadItem}
          onSubmit={handleMultipleUploadSubmit}
          contentTypes={contentTypes}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default ContentManager;
