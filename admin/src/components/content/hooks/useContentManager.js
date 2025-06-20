import { useEffect, useMemo } from 'react';
import { useContentFormManagement } from './useContentFormManagement';
import { useContentAPI } from './useContentAPI';
import { useContentModal } from './useContentModal';
import { useContentViewMode } from './useContentViewMode';
import { useContentFilters } from './useContentFilters';
import { useContentSections } from './useContentSections';
import { useContentMultipleUpload } from './useContentMultipleUpload';
import useContentDragAndDrop from './useContentDragAndDrop';

/**
 * Composite hook that combines all content management functionality
 * This is the main hook used by ContentManager component
 */
export const useContentManager = () => {
  // Initialize all sub-hooks
  const formManagement = useContentFormManagement();
  const apiManagement = useContentAPI();
  const modalManagement = useContentModal();
  const viewModeManagement = useContentViewMode();
  const filterManagement = useContentFilters();
  const sectionManagement = useContentSections();
  const multipleUploadManagement = useContentMultipleUpload();
  const dragAndDropManagement = useContentDragAndDrop(
    () => {}, // setHasChanges placeholder
    (message) => apiManagement.showSuccessMessage(message)
  );

  // Content types configuration
  const contentTypes = [
    { value: "video", label: "Video", icon: "🎥", color: "bg-blue-500" },
    { value: "lab", label: "Lab", icon: "🧪", color: "bg-purple-500" },
    { value: "game", label: "Game", icon: "🎮", color: "bg-green-500" },
    { value: "document", label: "Document", icon: "📄", color: "bg-yellow-500" },
  ];

  // Initialize data on mount
  useEffect(() => {
    apiManagement.initializeData();
    viewModeManagement.fetchHierarchicalData();
  }, []);

  // Auto-refresh sections when module changes in form
  useEffect(() => {
    if (formManagement.formData.moduleId) {
      sectionManagement.refreshSectionsForModule(formManagement.formData.moduleId);
    } else {
      sectionManagement.clearSections();
    }
  }, [formManagement.formData.moduleId]);

  // Filtered content based on current filters
  const filteredContent = useMemo(() => {
    return filterManagement.filterContent(apiManagement.content);
  }, [apiManagement.content, filterManagement.filters]);

  // Filtered sections for autocomplete
  const filteredSections = useMemo(() => {
    return sectionManagement.getFilteredSections(formManagement.sectionInputValue);
  }, [sectionManagement.availableSections, formManagement.sectionInputValue]);

  // Apply filters to hierarchical data
  const filteredHierarchicalData = useMemo(() => {
    if (!viewModeManagement.hierarchicalData.length) return [];
    
    return viewModeManagement.hierarchicalData.map(phase => ({
      ...phase,
      modules: phase.modules.map(module => ({
        ...module,
        content: filterManagement.filterContent(module.content),
        contentCount: filterManagement.filterContent(module.content).length
      }))
    }));
    // Note: Removed filter that hides phases with no content - show all phases regardless
  }, [viewModeManagement.hierarchicalData, filterManagement.filters, filterManagement.filterContent]);

  // Apply filters to grouped data
  const filteredGroupedContent = useMemo(() => {
    if (!Object.keys(viewModeManagement.groupedContent).length) return {};
    
    const filtered = {};
    Object.entries(viewModeManagement.groupedContent).forEach(([groupName, groupContent]) => {
      const filteredGroup = filterManagement.filterContent(groupContent);
      if (filteredGroup.length > 0) {
        filtered[groupName] = filteredGroup;
      }
    });
    
    return filtered;
  }, [viewModeManagement.groupedContent, filterManagement.filters, filterManagement.filterContent]);

  // Update section content in hierarchical data for drag-and-drop
  const updateSectionContent = (moduleId, section, updatedContent) => {
    viewModeManagement.setHierarchicalData(prevData => {
      return prevData.map(phase => ({
        ...phase,
        modules: phase.modules.map(module => {
          if (module.id === moduleId) {
            // Replace content for this section
            const otherContent = module.content.filter(c => c.section !== section);
            
            // Ensure updatedContent is properly sorted (server should return it sorted)
            const sortedUpdatedContent = [...updatedContent].sort((a, b) => {
              if (a.section !== b.section) {
                return a.section.localeCompare(b.section);
              }
              if (a.order && b.order) {
                return a.order - b.order;
              }
              return new Date(a.createdAt) - new Date(b.createdAt);
            });
            
            // Combine and sort all content
            const newContent = [...otherContent, ...sortedUpdatedContent].sort((a, b) => {
              if (a.section !== b.section) {
                return a.section.localeCompare(b.section);
              }
              if (a.order && b.order) {
                return a.order - b.order;
              }
              return new Date(a.createdAt) - new Date(b.createdAt);
            });
            
            return {
              ...module,
              content: newContent
            };
          }
          return module;
        })
      }));
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const preparation = formManagement.prepareSubmission(sectionManagement.availableSections);
    
    if (!preparation.success) {
      return;
    }

    const result = await apiManagement.submitContent(
      preparation.data,
      preparation.isEditing,
      preparation.editingId,
      viewModeManagement.viewMode,
      viewModeManagement.hierarchicalData,
      viewModeManagement.setHierarchicalData,
      viewModeManagement.groupedContent,
      viewModeManagement.setGroupedContent,
      contentTypes
    );

    if (result.success) {
      formManagement.closeForm();
      
      // Refresh view data for grouped views to ensure consistency
      if (viewModeManagement.viewMode === "groupedByModule") {
        setTimeout(() => viewModeManagement.fetchAllModulesGrouped(), 100);
      } else if (viewModeManagement.viewMode === "groupedByType") {
        setTimeout(() => viewModeManagement.fetchAllContentGroupedByType(contentTypes), 100);
      }
    }
  };

  // Handle content edit
  const handleEdit = (contentItem) => {
    formManagement.handleEdit(contentItem);
  };

  // Handle content delete
  const handleDelete = (contentItem) => {
    modalManagement.openDeleteModal(contentItem);
  };

  // Confirm delete
  const confirmDelete = async () => {
    const deleteHandler = (contentToDelete) =>
      apiManagement.deleteContent(
        contentToDelete,
        viewModeManagement.viewMode,
        viewModeManagement.hierarchicalData,
        viewModeManagement.setHierarchicalData,
        viewModeManagement.groupedContent,
        viewModeManagement.setGroupedContent,
        contentTypes
      );

    const result = await modalManagement.confirmDelete(deleteHandler);
    
    if (result?.success) {
      // Refresh view data for grouped views
      if (viewModeManagement.viewMode === "groupedByModule") {
        setTimeout(() => viewModeManagement.fetchAllModulesGrouped(), 100);
      } else if (viewModeManagement.viewMode === "groupedByType") {
        setTimeout(() => viewModeManagement.fetchAllContentGroupedByType(contentTypes), 100);
      }
    }
  };

  // Handle multiple upload submit
  const handleMultipleUploadSubmit = async () => {
    const validation = multipleUploadManagement.validateUploadItems();
    
    if (!validation.isValid) {
      apiManagement.showErrorMessage("Please fix validation errors before submitting");
      return;
    }

    if (!multipleUploadManagement.selectedModuleForUpload) {
      apiManagement.showErrorMessage("Please select a module for upload");
      return;
    }

    const result = await apiManagement.createMultipleContent(
      multipleUploadManagement.multipleUploads,
      multipleUploadManagement.selectedModuleForUpload,
      viewModeManagement.viewMode,
      viewModeManagement.hierarchicalData,
      viewModeManagement.setHierarchicalData,
      viewModeManagement.groupedContent,
      viewModeManagement.setGroupedContent,
      contentTypes
    );

    if (result.success) {
      multipleUploadManagement.closeMultipleUpload();
      
      // Refresh view data for grouped views
      if (viewModeManagement.viewMode === "groupedByModule") {
        setTimeout(() => viewModeManagement.fetchAllModulesGrouped(), 100);
      } else if (viewModeManagement.viewMode === "groupedByType") {
        setTimeout(() => viewModeManagement.fetchAllContentGroupedByType(contentTypes), 100);
      }
    }
  };

  // Handle view mode change with content types
  const handleViewModeChange = (mode) => {
    viewModeManagement.handleViewModeChange(mode);
    if (mode === "groupedByType") {
      setTimeout(() => viewModeManagement.fetchAllContentGroupedByType(contentTypes), 100);
    }
  };

  // Handle section input changes
  const handleSectionInputChange = (e) => {
    formManagement.handleSectionInputChange(e);
  };

  const handleSectionInputFocus = () => {
    sectionManagement.handleSectionInputFocus(formManagement.formData.moduleId);
  };

  const handleSectionInputBlur = () => {
    sectionManagement.handleSectionInputBlur();
  };

  const handleSectionSelect = (section) => {
    sectionManagement.handleSectionSelect(section, (selectedSection) => {
      formManagement.setSectionInputValue(selectedSection);
      formManagement.handleFormDataChange('section', selectedSection);
    });
  };

  return {
    // Content types
    contentTypes,

    // Core data
    content: apiManagement.content,
    modules: apiManagement.modules,
    phases: apiManagement.phases,
    filteredContent,

    // Loading states
    loading: apiManagement.loading || viewModeManagement.loading,
    saving: apiManagement.saving,

    // Messages
    error: apiManagement.error || viewModeManagement.error || sectionManagement.sectionError,
    success: apiManagement.success,

    // Form management
    showForm: formManagement.showForm,
    formData: formManagement.formData,
    editingContent: formManagement.editingContent,
    sectionInputValue: formManagement.sectionInputValue,
    formErrors: formManagement.formErrors,
    formWarnings: formManagement.formWarnings,
    setFormData: formManagement.setFormData,
    resetForm: formManagement.resetForm,
    openNewContentForm: formManagement.openNewContentForm,
    closeForm: formManagement.closeForm,
    setShowForm: formManagement.setShowForm,
    setSectionInputValue: formManagement.setSectionInputValue,

    // Section management
    availableSections: sectionManagement.availableSections,
    filteredSections,
    showSectionDropdown: sectionManagement.showSectionDropdown,
    sectionLoading: sectionManagement.sectionLoading,
    setShowSectionDropdown: sectionManagement.setShowSectionDropdown,

    // View mode management
    viewMode: viewModeManagement.viewMode,
    hierarchicalData: filteredHierarchicalData,
    groupedContent: filteredGroupedContent,
    expandedPhases: viewModeManagement.expandedPhases,
    expandedModules: viewModeManagement.expandedModules,
    setExpandedPhases: viewModeManagement.setExpandedPhases,
    setExpandedModules: viewModeManagement.setExpandedModules,

    // Filter management
    filters: filterManagement.filters,
    handleFilterChange: filterManagement.handleFilterChange,
    hasActiveFilters: filterManagement.hasActiveFilters,
    resetFilters: filterManagement.resetFilters,

    // Modal management
    showDeleteModal: modalManagement.showDeleteModal,
    contentToDelete: modalManagement.contentToDelete,
    closeDeleteModal: modalManagement.closeDeleteModal,

    // Multiple upload management
    showMultipleUpload: multipleUploadManagement.showMultipleUpload,
    multipleUploads: multipleUploadManagement.multipleUploads,
    selectedPhaseForUpload: multipleUploadManagement.selectedPhaseForUpload,
    selectedModuleForUpload: multipleUploadManagement.selectedModuleForUpload,
    setSelectedPhaseForUpload: multipleUploadManagement.setSelectedPhaseForUpload,
    setSelectedModuleForUpload: multipleUploadManagement.setSelectedModuleForUpload,
    addNewUploadItem: multipleUploadManagement.addNewUploadItem,
    removeUploadItem: multipleUploadManagement.removeUploadItem,
    updateUploadItem: multipleUploadManagement.updateUploadItem,
    closeMultipleUpload: multipleUploadManagement.closeMultipleUpload,
    startMultipleUpload: multipleUploadManagement.startMultipleUpload,

    // Drag-and-drop management
    draggedContent: dragAndDropManagement.draggedContent,
    dragOverContent: dragAndDropManagement.dragOverContent,
    isDragging: dragAndDropManagement.isDragging,
    sectionChanges: dragAndDropManagement.sectionChanges,
    hasUnsavedChanges: dragAndDropManagement.hasUnsavedChanges,
    handleDragStart: dragAndDropManagement.handleDragStart,
    handleDragEnd: dragAndDropManagement.handleDragEnd,
    handleDragOver: dragAndDropManagement.handleDragOver,
    handleDragEnter: dragAndDropManagement.handleDragEnter,
    handleDragLeave: dragAndDropManagement.handleDragLeave,
    handleDrop: dragAndDropManagement.handleDrop,
    getSectionChanges: dragAndDropManagement.getSectionChanges,
    clearSectionChanges: dragAndDropManagement.clearSectionChanges,
    clearAllChanges: dragAndDropManagement.clearAllChanges,
    updateSectionContent,

    // Event handlers
    handleFormSubmit,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete: modalManagement.closeDeleteModal,
    handleViewModeChange,
    handleSectionInputChange,
    handleSectionInputFocus,
    handleSectionInputBlur,
    handleSectionSelect,
    handleMultipleUploadSubmit,
    handleMultipleUploadStart: multipleUploadManagement.startMultipleUpload,

    // Utility functions
    clearMessages: apiManagement.clearMessages,
    refreshCurrentView: () => viewModeManagement.refreshCurrentView(contentTypes),
  };
};