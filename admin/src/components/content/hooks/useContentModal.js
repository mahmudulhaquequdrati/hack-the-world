import { useState, useCallback } from 'react';

/**
 * Custom hook for managing content modal states
 */
export const useContentModal = () => {
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  // Open delete modal
  const openDeleteModal = useCallback((contentItem) => {
    setContentToDelete(contentItem);
    setShowDeleteModal(true);
  }, []);

  // Close delete modal
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setContentToDelete(null);
  }, []);

  // Confirm delete action
  const confirmDelete = useCallback(async (deleteHandler) => {
    if (!contentToDelete || !deleteHandler) return;

    const result = await deleteHandler(contentToDelete);
    
    if (result.success) {
      closeDeleteModal();
    }
    
    return result;
  }, [contentToDelete, closeDeleteModal]);

  return {
    // State
    showDeleteModal,
    contentToDelete,
    
    // Actions
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };
};