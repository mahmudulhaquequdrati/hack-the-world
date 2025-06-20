import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import React from "react";

// Import extracted components
import ContentFiltersAndControls from "../components/content/ContentFiltersAndControls";
import ContentFormModal from "../components/content/ContentFormModal";
import MultipleUploadModal from "../components/content/MultipleUploadModal";
import ContentDeleteConfirmationModal from "../components/content/ContentDeleteConfirmationModal";
import ActionButtons from "../components/content/ui/ActionButtons";
import TerminalHeader from "../components/content/ui/TerminalHeader";
import StatisticsGrid from "../components/content/ui/StatisticsGrid";
import ViewModeRenderer from "../components/content/ui/ViewModeRenderer";

// Import the main hook
import { useContentManager } from "../components/content/hooks/useContentManager";

const ContentManager = () => {
  // Use the main content manager hook
  const {
    // Content types
    contentTypes,
    
    // Core data
    content,
    modules,
    phases,
    filteredContent,
    
    // Loading states
    loading,
    saving,
    
    // Messages
    error,
    success,
    
    // Form management
    showForm,
    formData,
    editingContent,
    sectionInputValue,
    availableSections,
    filteredSections,
    showSectionDropdown,
    sectionLoading,
    setFormData,
    setSectionInputValue,
    setShowSectionDropdown,
    setShowForm,
    
    // View mode management
    viewMode,
    hierarchicalData,
    groupedContent,
    selectedPhaseId,
    selectedModuleId,
    setSelectedPhaseId,
    setSelectedModuleId,
    
    // Filter management
    filters,
    handleFilterChange,
    
    // Modal management
    showDeleteModal,
    contentToDelete,
    
    // Multiple upload management
    showMultipleUpload,
    multipleUploads,
    selectedPhaseForUpload,
    selectedModuleForUpload,
    setSelectedPhaseForUpload,
    setSelectedModuleForUpload,
    addNewUploadItem,
    removeUploadItem,
    updateUploadItem,
    
    // Event handlers
    handleFormSubmit,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleViewModeChange,
    handleSectionInputChange,
    handleSectionInputFocus,
    handleSectionInputBlur,
    handleSectionSelect,
    handleMultipleUploadSubmit,
    handleMultipleUploadStart,
    openNewContentForm,
    closeMultipleUpload,
    resetForm,
  } = useContentManager();



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
          onAddContent={openNewContentForm}
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

        {/* Statistics Grid */}
        <StatisticsGrid content={filteredContent} contentTypes={contentTypes} />

        {/* View Mode and Controls */}
        <ContentFiltersAndControls
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          content={filteredContent}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Content Display */}
        {loading ? (
          <div className="text-center text-green-400 py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <p className="mt-2 font-mono">Loading content...</p>
          </div>
        ) : (
          <ViewModeRenderer
            viewMode={viewMode}
            hierarchicalData={hierarchicalData}
            groupedContent={groupedContent}
            selectedPhaseId={selectedPhaseId}
            setSelectedPhaseId={setSelectedPhaseId}
            selectedModuleId={selectedModuleId}
            setSelectedModuleId={setSelectedModuleId}
            contentTypes={contentTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            modules={modules}
            phases={phases}
          />
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
          loading={saving}
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
          loading={saving}
          error={error}
        />

        {/* Delete Confirmation Modal */}
        <ContentDeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          contentToDelete={contentToDelete}
          saving={saving}
        />
      </div>
    </div>
  );
};

export default ContentManager;
