import { useState, useCallback } from 'react';

/**
 * Custom hook for managing phase modal states
 * @returns {Object} Modal state and functions
 */
const usePhasesModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [phaseToDelete, setPhaseToDelete] = useState(null);

  /**
   * Opens the main form modal for creating or editing a phase
   * @param {Object|null} phase - Phase to edit or null for new phase
   */
  const openFormModal = useCallback((phase = null) => {
    setEditingPhase(phase);
    setShowModal(true);
  }, []);

  /**
   * Closes the main form modal and resets editing state
   */
  const closeFormModal = useCallback(() => {
    setShowModal(false);
    setEditingPhase(null);
  }, []);

  /**
   * Opens the delete confirmation modal
   * @param {Object} phase - Phase to delete
   */
  const openDeleteModal = useCallback((phase) => {
    setPhaseToDelete(phase);
    setShowDeleteModal(true);
  }, []);

  /**
   * Closes the delete confirmation modal and resets delete state
   */
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setPhaseToDelete(null);
  }, []);

  /**
   * Handles the delete action by opening the delete modal
   * @param {Object} phase - Phase to delete
   */
  const handleDelete = useCallback((phase) => {
    openDeleteModal(phase);
  }, [openDeleteModal]);

  /**
   * Handles canceling the delete action
   */
  const cancelDelete = useCallback(() => {
    closeDeleteModal();
  }, [closeDeleteModal]);

  /**
   * Handles confirming the delete action
   * @param {Function} deleteCallback - Function to call for actual deletion
   */
  const handleConfirmDelete = useCallback(async (deleteCallback) => {
    if (!phaseToDelete || !deleteCallback) return;

    try {
      await deleteCallback(phaseToDelete);
      // Close modal immediately for better UX
      closeDeleteModal();
    } catch (error) {
      // Keep modal open on error so user can retry
      console.error('Delete failed:', error);
      // The error will be handled by the deleteCallback
    }
  }, [phaseToDelete, closeDeleteModal]);

  /**
   * Closes all modals
   */
  const closeAllModals = useCallback(() => {
    closeFormModal();
    closeDeleteModal();
  }, [closeFormModal, closeDeleteModal]);

  /**
   * Gets the current modal state
   * @returns {Object} Current modal state
   */
  const getModalState = useCallback(() => ({
    showModal,
    showDeleteModal,
    editingPhase,
    phaseToDelete,
    isAnyModalOpen: showModal || showDeleteModal
  }), [showModal, showDeleteModal, editingPhase, phaseToDelete]);

  /**
   * Sets editing phase directly (useful for external control)
   * @param {Object|null} phase - Phase to set as editing
   */
  const setEditingPhaseExternal = useCallback((phase) => {
    setEditingPhase(phase);
  }, []);

  /**
   * Sets phase to delete directly (useful for external control)
   * @param {Object|null} phase - Phase to set for deletion
   */
  const setPhaseToDeleteExternal = useCallback((phase) => {
    setPhaseToDelete(phase);
  }, []);

  return {
    // State
    showModal,
    showDeleteModal,
    editingPhase,
    phaseToDelete,
    
    // Form Modal Actions
    openFormModal,
    closeFormModal,
    
    // Delete Modal Actions
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
    cancelDelete,
    handleConfirmDelete,
    
    // Utility Actions
    closeAllModals,
    getModalState,
    
    // Direct state setters (for external control)
    setShowModal,
    setShowDeleteModal,
    setEditingPhase: setEditingPhaseExternal,
    setPhaseToDelete: setPhaseToDeleteExternal
  };
};

export default usePhasesModal;