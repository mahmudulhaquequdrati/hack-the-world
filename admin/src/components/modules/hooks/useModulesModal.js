import { useState, useCallback } from 'react';

/**
 * Custom hook for managing module modal states
 * Handles form modal, delete modal, and bulk operations modal
 * @returns {Object} Modal state and functions
 */
const useModulesModal = () => {
  // Form modal states
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  
  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  
  // Bulk operations modal states
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkOperation, setBulkOperation] = useState("");

  /**
   * Opens the main form modal for creating or editing a module
   * @param {Object|null} module - Module to edit or null for new module
   */
  const openFormModal = useCallback((module = null) => {
    setEditingModule(module);
    setShowModal(true);
  }, []);

  /**
   * Closes the main form modal and resets editing state
   */
  const closeFormModal = useCallback(() => {
    setShowModal(false);
    setEditingModule(null);
  }, []);

  /**
   * Opens the delete confirmation modal
   * @param {Object} module - Module to delete
   */
  const openDeleteModal = useCallback((module) => {
    setModuleToDelete(module);
    setShowDeleteModal(true);
  }, []);

  /**
   * Closes the delete confirmation modal and resets delete state
   */
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setModuleToDelete(null);
  }, []);

  /**
   * Opens the bulk operations modal
   * @param {string} operation - Bulk operation type
   */
  const openBulkModal = useCallback((operation) => {
    setBulkOperation(operation);
    setShowBulkModal(true);
  }, []);

  /**
   * Closes the bulk operations modal and resets bulk state
   */
  const closeBulkModal = useCallback(() => {
    setShowBulkModal(false);
    setBulkOperation("");
  }, []);

  /**
   * Handles the delete action by opening the delete modal
   * @param {Object} module - Module to delete
   */
  const handleDelete = useCallback((module) => {
    openDeleteModal(module);
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
    if (!moduleToDelete || !deleteCallback) return;

    try {
      await deleteCallback(moduleToDelete);
      // Close modal immediately for better UX
      closeDeleteModal();
    } catch (error) {
      // Keep modal open on error so user can retry
      console.error('Delete failed:', error);
      // The error will be handled by the deleteCallback
    }
  }, [moduleToDelete, closeDeleteModal]);

  /**
   * Handles bulk operation action
   * @param {string} operation - Bulk operation type
   */
  const handleBulkOperation = useCallback((operation) => {
    openBulkModal(operation);
  }, [openBulkModal]);

  /**
   * Closes all modals
   */
  const closeAllModals = useCallback(() => {
    closeFormModal();
    closeDeleteModal();
    closeBulkModal();
  }, [closeFormModal, closeDeleteModal, closeBulkModal]);

  /**
   * Gets the current modal state
   * @returns {Object} Current modal state
   */
  const getModalState = useCallback(() => ({
    showModal,
    showDeleteModal,
    showBulkModal,
    editingModule,
    moduleToDelete,
    bulkOperation,
    isAnyModalOpen: showModal || showDeleteModal || showBulkModal
  }), [showModal, showDeleteModal, showBulkModal, editingModule, moduleToDelete, bulkOperation]);

  /**
   * Sets editing module directly (useful for external control)
   * @param {Object|null} module - Module to set as editing
   */
  const setEditingModuleExternal = useCallback((module) => {
    setEditingModule(module);
  }, []);

  /**
   * Sets module to delete directly (useful for external control)
   * @param {Object|null} module - Module to set for deletion
   */
  const setModuleToDeleteExternal = useCallback((module) => {
    setModuleToDelete(module);
  }, []);

  /**
   * Sets bulk operation directly (useful for external control)
   * @param {string} operation - Bulk operation to set
   */
  const setBulkOperationExternal = useCallback((operation) => {
    setBulkOperation(operation);
  }, []);

  return {
    // Form Modal State
    showModal,
    editingModule,
    
    // Delete Modal State
    showDeleteModal,
    moduleToDelete,
    
    // Bulk Modal State
    showBulkModal,
    bulkOperation,
    
    // Form Modal Actions
    openFormModal,
    closeFormModal,
    
    // Delete Modal Actions
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
    cancelDelete,
    handleConfirmDelete,
    
    // Bulk Modal Actions
    openBulkModal,
    closeBulkModal,
    handleBulkOperation,
    
    // Utility Actions
    closeAllModals,
    getModalState,
    
    // Direct state setters (for external control)
    setShowModal,
    setShowDeleteModal,
    setShowBulkModal,
    setEditingModule: setEditingModuleExternal,
    setModuleToDelete: setModuleToDeleteExternal,
    setBulkOperation: setBulkOperationExternal
  };
};

export default useModulesModal;