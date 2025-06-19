import { useState } from 'react';
import { createInitialFormData, createEditFormData } from '../utils/phaseUtils';

/**
 * Custom hook for managing phase form state and operations
 * @returns {Object} Form management state and functions
 */
const usePhasesFormManagement = () => {
  const [formData, setFormData] = useState(createInitialFormData());

  /**
   * Handles input changes in the form
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Opens modal and prepares form data
   * @param {Object|null} phase - Phase to edit or null for new phase
   * @param {Function} setEditingPhase - Function to set editing phase state
   * @param {Function} setShowModal - Function to show modal
   * @param {Function} clearMessages - Function to clear error/success messages
   */
  const openModal = (phase, setEditingPhase, setShowModal, clearMessages) => {
    // Clear any existing messages
    if (clearMessages) clearMessages();

    if (phase) {
      // Editing existing phase
      setEditingPhase(phase);
      setFormData(createEditFormData(phase));
    } else {
      // Creating new phase
      setEditingPhase(null);
      setFormData(createInitialFormData());
    }
    
    setShowModal(true);
  };

  /**
   * Closes modal and resets form
   * @param {Function} setShowModal - Function to hide modal
   * @param {Function} setEditingPhase - Function to clear editing phase
   * @param {Function} clearMessages - Function to clear error/success messages
   */
  const closeModal = (setShowModal, setEditingPhase, clearMessages) => {
    setShowModal(false);
    setEditingPhase(null);
    if (clearMessages) clearMessages();
  };

  /**
   * Resets form to initial state
   */
  const resetForm = () => {
    setFormData(createInitialFormData());
  };

  /**
   * Sets form data directly (useful for external updates)
   * @param {Object} newFormData - New form data to set
   */
  const setFormDataDirect = (newFormData) => {
    setFormData(newFormData);
  };

  /**
   * Updates a specific field in form data
   * @param {string} field - Field name to update
   * @param {*} value - New value for the field
   */
  const updateFormField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Gets current form values
   * @returns {Object} Current form data
   */
  const getFormData = () => formData;

  /**
   * Checks if form has been modified from initial state
   * @param {Object} initialData - Initial data to compare against
   * @returns {boolean} True if form has been modified
   */
  const isFormDirty = (initialData = createInitialFormData()) => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  };

  return {
    formData,
    handleInputChange,
    openModal,
    closeModal,
    resetForm,
    setFormData: setFormDataDirect,
    updateFormField,
    getFormData,
    isFormDirty
  };
};

export default usePhasesFormManagement;