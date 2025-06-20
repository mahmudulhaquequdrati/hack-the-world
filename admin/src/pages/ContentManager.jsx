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

// Import the main hook and API
import { useContentManager } from "../components/content/hooks/useContentManager";
import { contentAPI } from "../services/api";

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
    expandedPhases,
    expandedModules,
    setExpandedPhases,
    setExpandedModules,
    
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
    
    // Drag-and-drop management
    draggedContent,
    dragOverContent,
    isDragging,
    sectionChanges,
    hasUnsavedChanges,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    getSectionChanges,
    clearSectionChanges,
    clearAllChanges,
    updateSectionContent,
    
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
    
    // Additional functions for save order
    clearMessages,
    refreshCurrentView,
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

        {/* Save Order Button - Only show when there are unsaved changes */}
        {hasUnsavedChanges && (
          <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-400/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 font-mono mb-1">
                  🔄 UNSAVED CHANGES DETECTED
                </h3>
                <p className="text-sm text-gray-400 font-mono">
                  You have {Object.keys(sectionChanges).length} section(s) with reordered content. Save changes to persist the new order.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearAllChanges}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-mono text-sm rounded-lg transition-colors"
                >
                  DISCARD
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Save all section changes and update local state with server response
                      for (const [sectionKey, changes] of Object.entries(sectionChanges)) {
                        const response = await contentAPI.reorderInSection(
                          changes.moduleId,
                          changes.section,
                          changes.contentOrders
                        );
                        
                        // Update local state with server response instead of refreshing all data
                        // API client returns response.data, and server response is { data: [...] }
                        const updatedContent = response.data || response;
                        if (updatedContent && Array.isArray(updatedContent)) {
                          updateSectionContent(changes.moduleId, changes.section, updatedContent);
                        } else {
                          console.warn('Invalid response data format:', response);
                        }
                        
                        // Clear section changes after successful update
                        clearSectionChanges(changes.moduleId, changes.section);
                      }
                      
                      // Clear any existing messages - changes saved successfully
                      clearMessages();
                    } catch (error) {
                      console.error('Failed to save content order:', error);
                      // On error, refresh data to ensure consistency
                      refreshCurrentView();
                      alert('Failed to save content order. Please try again.');
                    }
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-700 disabled:opacity-50 text-white font-mono text-sm rounded-lg transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      SAVING...
                    </>
                  ) : (
                    'SAVE ORDER'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

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
            expandedPhases={expandedPhases}
            setExpandedPhases={setExpandedPhases}
            expandedModules={expandedModules}
            setExpandedModules={setExpandedModules}
            contentTypes={contentTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            modules={modules}
            phases={phases}
            // Drag-and-drop props
            isDragAndDropEnabled={viewMode === "hierarchical"}
            draggedContent={draggedContent}
            dragOverContent={dragOverContent}
            isDragging={isDragging}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            updateSectionContent={updateSectionContent}
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
