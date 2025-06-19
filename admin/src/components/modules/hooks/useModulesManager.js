import { useState, useEffect, useCallback } from 'react';
import useModulesAPI from './useModulesAPI';
import useModulesFormManagement from './useModulesFormManagement';
import useModulesModal from './useModulesModal';
import useModulesSelection from './useModulesSelection';
import useModulesBulkOperations from './useModulesBulkOperations';
import useModuleDragAndDrop from './useModuleDragAndDrop';

/**
 * Composite hook that combines all module management functionality
 * Provides a single interface for the ModulesManagerEnhanced component
 * @returns {Object} Complete module management state and functions
 */
const useModulesManager = () => {
  // Filter state
  const [selectedPhase, setSelectedPhase] = useState("");
  const [hasModuleChanges, setHasModuleChanges] = useState(false);

  // Initialize all sub-hooks
  const api = useModulesAPI();
  const form = useModulesFormManagement();
  const modal = useModulesModal();
  const selection = useModulesSelection(api.modules);
  
  // Bulk operations hook - needs modules, modulesWithPhases and API functions
  const bulkOps = useModulesBulkOperations(
    api.modules,
    api.modulesWithPhases,
    api.setModules,
    api.setModulesWithPhases,
    api.fetchData
  );
  
  // Drag and drop hook - needs modulesWithPhases and setters
  const dragDrop = useModuleDragAndDrop(
    api.modulesWithPhases,
    api.setModulesWithPhases,
    setHasModuleChanges,
    api.setSuccess
  );

  // Initialize data loading
  useEffect(() => {
    api.fetchData();
  }, [api.fetchData]);

  // Enhanced form modal handlers that integrate with modal and API hooks
  const openModal = useCallback((module = null) => {
    form.openModal(
      module,
      modal.setEditingModule,
      modal.setShowModal,
      api.clearMessages
    );
  }, [form, modal, api]);

  const closeModal = useCallback(() => {
    form.closeModal(
      modal.setShowModal,
      modal.setEditingModule,
      api.clearMessages
    );
  }, [form, modal, api]);

  // Enhanced submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      await api.handleSubmit(
        form.formData,
        modal.editingModule,
        // Success callback
        (responseData, successMessage) => {
          // Auto-close modal after 1.5 seconds on success
          setTimeout(() => {
            closeModal();
          }, 1500);
        },
        // Error callback
        (errorMessage) => {
          // Error is already set by the API hook
          console.error('Submit error:', errorMessage);
        }
      );
    } catch (error) {
      // Error handling is done in the API hook
      console.error('Submit failed:', error);
    }
  }, [api, form, modal, closeModal]);

  // Enhanced delete handlers
  const handleDelete = useCallback((module) => {
    modal.handleDelete(module);
  }, [modal]);

  const confirmDelete = useCallback(async () => {
    try {
      await api.confirmDelete(
        modal.moduleToDelete,
        // Success callback
        (successMessage) => {
          modal.closeDeleteModal();
        },
        // Error callback
        (errorMessage) => {
          // Keep modal open on error for retry
          console.error('Delete error:', errorMessage);
        }
      );
    } catch (error) {
      // Error handling is done in the API hook
      console.error('Delete failed:', error);
    }
  }, [api, modal]);

  // Enhanced order management
  const saveModuleOrder = useCallback(async () => {
    try {
      await api.saveModuleOrder(
        // Success callback
        (successMessage) => {
          setHasModuleChanges(false);
        },
        // Error callback
        (errorMessage) => {
          setHasModuleChanges(false);
        }
      );
    } catch (error) {
      console.error('Save order failed:', error);
      setHasModuleChanges(false);
    }
  }, [api]);

  const resetModuleOrder = useCallback(async () => {
    try {
      await api.resetModuleOrder(() => {
        setHasModuleChanges(false);
      });
    } catch (error) {
      console.error('Reset order failed:', error);
      setHasModuleChanges(false);
    }
  }, [api]);

  // Enhanced bulk operations handlers
  const handleBulkOperation = useCallback((operation) => {
    modal.handleBulkOperation(operation);
    api.clearMessages();
  }, [modal, api]);

  const handleBulkSubmit = useCallback(async () => {
    try {
      await bulkOps.handleBulkSubmit(
        modal.bulkOperation,
        selection.selectedModules,
        // Success callback
        (successMessage, count) => {
          api.setSuccess(successMessage);
          modal.closeBulkModal();
          selection.handleClearSelection();
          
          // Clear success message after 3 seconds
          setTimeout(() => api.setSuccess(""), 3000);
        },
        // Error callback
        (errorMessage) => {
          api.setError(errorMessage);
          
          // Clear error message after 5 seconds
          setTimeout(() => api.setError(""), 5000);
        }
      );
    } catch (error) {
      console.error('Bulk operation failed:', error);
    }
  }, [bulkOps, modal, selection, api]);

  const closeBulkModal = useCallback(() => {
    modal.closeBulkModal();
    bulkOps.resetBulkFormData();
    api.clearMessages();
  }, [modal, bulkOps, api]);

  // Phase-based filtering
  const getFilteredModulesWithPhases = useCallback(() => {
    if (!selectedPhase) {
      return api.modulesWithPhases;
    }
    
    return api.modulesWithPhases.filter(phase => phase.id === selectedPhase);
  }, [api.modulesWithPhases, selectedPhase]);

  // Phase selection helper for bulk operations
  const handlePhaseSelectionToggle = useCallback((phaseModules) => {
    selection.handlePhaseSelection(phaseModules);
  }, [selection]);

  return {
    // Data & Loading States
    modules: api.modules,
    phases: api.phases,
    modulesWithPhases: api.modulesWithPhases,
    loading: api.loading,
    saving: api.saving,
    error: api.error,
    success: api.success,

    // Filter Management
    selectedPhase,
    setSelectedPhase,
    hasModuleChanges,
    getFilteredModulesWithPhases,

    // Form Management
    formData: form.formData,
    handleInputChange: form.handleInputChange,
    openModal,
    closeModal,
    handleSubmit,
    setFormData: form.setFormData,

    // Modal Management
    showModal: modal.showModal,
    showDeleteModal: modal.showDeleteModal,
    showBulkModal: modal.showBulkModal,
    editingModule: modal.editingModule,
    moduleToDelete: modal.moduleToDelete,
    bulkOperation: modal.bulkOperation,
    handleDelete,
    confirmDelete,
    cancelDelete: modal.cancelDelete,

    // Selection Management
    selectedModules: selection.selectedModules,
    handleSelectAll: selection.handleSelectAll,
    handleToggleSelection: selection.handleToggleSelection,
    handleClearSelection: selection.handleClearSelection,
    handlePhaseSelectionToggle,
    selectionStats: selection.selectionStats,

    // Bulk Operations
    bulkFormData: bulkOps.bulkFormData,
    setBulkFormData: bulkOps.setBulkFormData,
    handleBulkOperation,
    handleBulkSubmit,
    closeBulkModal,
    bulkOperationLoading: bulkOps.bulkOperationLoading,

    // Drag & Drop
    draggedModule: dragDrop.draggedModule,
    dragOverModule: dragDrop.dragOverModule,
    isDraggingModule: dragDrop.isDraggingModule,
    handleModuleDragStart: dragDrop.handleModuleDragStart,
    handleModuleDragEnd: dragDrop.handleModuleDragEnd,
    handleModuleDragOver: dragDrop.handleModuleDragOver,
    handleModuleDragEnter: dragDrop.handleModuleDragEnter,
    handleModuleDragLeave: dragDrop.handleModuleDragLeave,
    handleModuleDrop: dragDrop.handleModuleDrop,

    // Order Management
    saveModuleOrder,
    resetModuleOrder,

    // API Actions
    fetchData: api.fetchData,
    clearMessages: api.clearMessages,

    // Utility functions for advanced usage
    form: form,
    modal: modal,
    api: api,
    selection: selection,
    bulkOps: bulkOps,
    dragDrop: dragDrop
  };
};

export default useModulesManager;