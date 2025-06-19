import { useEffect, useMemo } from 'react';
import { useContentFormManagement } from './useContentFormManagement';
import { useContentAPI } from './useContentAPI';
import { useContentModal } from './useContentModal';
import { useContentViewMode } from './useContentViewMode';
import { useContentFilters } from './useContentFilters';
import { useContentSections } from './useContentSections';
import { useContentMultipleUpload } from './useContentMultipleUpload';

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
    hierarchicalData: viewModeManagement.hierarchicalData,
    groupedContent: viewModeManagement.groupedContent,
    selectedPhaseId: viewModeManagement.selectedPhaseId,
    selectedModuleId: viewModeManagement.selectedModuleId,
    setSelectedPhaseId: viewModeManagement.setSelectedPhaseId,
    setSelectedModuleId: viewModeManagement.setSelectedModuleId,

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