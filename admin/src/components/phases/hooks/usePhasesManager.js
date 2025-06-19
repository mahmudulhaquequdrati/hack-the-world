import { useState, useEffect, useCallback } from 'react';
import usePhasesAPI from './usePhasesAPI';
import usePhasesFormManagement from './usePhasesFormManagement';
import usePhasesModal from './usePhasesModal';
import usePhaseDragAndDrop from './usePhaseDragAndDrop';

/**
 * Composite hook that combines all phase management functionality
 * Provides a single interface for the PhasesManager component
 * @returns {Object} Complete phase management state and functions
 */
const usePhasesManager = () => {
  // View mode state
  const [viewMode, setViewMode] = useState("grid");
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize all sub-hooks
  const api = usePhasesAPI();
  const form = usePhasesFormManagement();
  const modal = usePhasesModal();
  
  // Drag and drop hook - needs phases and setPhases from API hook
  const dragDrop = usePhaseDragAndDrop(
    api.phases, 
    api.setPhases, 
    setHasChanges, 
    api.setSuccess
  );

  // Initialize data loading
  useEffect(() => {
    api.fetchPhases();
  }, [api.fetchPhases]);

  // Enhanced form modal handlers that integrate with modal and API hooks
  const openModal = useCallback((phase = null) => {
    form.openModal(
      phase,
      modal.setEditingPhase,
      modal.setShowModal,
      api.clearMessages
    );
  }, [form, modal, api]);

  const closeModal = useCallback(() => {
    form.closeModal(
      modal.setShowModal,
      modal.setEditingPhase,
      api.clearMessages
    );
  }, [form, modal, api]);

  // Enhanced submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      await api.handleSubmit(
        form.formData,
        modal.editingPhase,
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
  const handleDelete = useCallback((phase) => {
    modal.handleDelete(phase);
  }, [modal]);

  const confirmDelete = useCallback(async () => {
    try {
      await api.confirmDelete(
        modal.phaseToDelete,
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
  const savePhaseOrder = useCallback(async () => {
    try {
      await api.savePhaseOrder(
        // Success callback
        (successMessage) => {
          setHasChanges(false);
        },
        // Error callback
        (errorMessage) => {
          setHasChanges(false);
        }
      );
    } catch (error) {
      console.error('Save order failed:', error);
      setHasChanges(false);
    }
  }, [api]);

  const resetPhaseOrder = useCallback(async () => {
    try {
      await api.resetPhaseOrder(() => {
        setHasChanges(false);
      });
    } catch (error) {
      console.error('Reset order failed:', error);
      setHasChanges(false);
    }
  }, [api]);

  return {
    // Data & Loading States
    phases: api.phases,
    loading: api.loading,
    saving: api.saving,
    error: api.error,
    success: api.success,

    // View Management
    viewMode,
    setViewMode,
    hasChanges,

    // Form Management
    formData: form.formData,
    handleInputChange: form.handleInputChange,
    openModal,
    closeModal,
    handleSubmit,

    // Modal Management
    showModal: modal.showModal,
    showDeleteModal: modal.showDeleteModal,
    editingPhase: modal.editingPhase,
    phaseToDelete: modal.phaseToDelete,
    handleDelete,
    confirmDelete,
    cancelDelete: modal.cancelDelete,

    // Drag & Drop
    draggedPhase: dragDrop.draggedPhase,
    dragOverPhase: dragDrop.dragOverPhase,
    isDragging: dragDrop.isDragging,
    handleDragStart: dragDrop.handleDragStart,
    handleDragEnd: dragDrop.handleDragEnd,
    handleDragOver: dragDrop.handleDragOver,
    handleDragEnter: dragDrop.handleDragEnter,
    handleDragLeave: dragDrop.handleDragLeave,
    handleDrop: dragDrop.handleDrop,

    // Order Management
    savePhaseOrder,
    resetPhaseOrder,

    // API Actions
    fetchPhases: api.fetchPhases,
    clearMessages: api.clearMessages,

    // Utility functions for advanced usage
    form: form,
    modal: modal,
    api: api,
    dragDrop: dragDrop
  };
};

export default usePhasesManager;