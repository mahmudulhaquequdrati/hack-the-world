import { useState } from 'react';
import { createInitialFormData, createEditFormData } from '../utils/moduleUtils';

/**
 * Custom hook for managing module form state and operations
 * @returns {Object} Form management state and functions
 */
const useModulesFormManagement = () => {
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
   * Opens modal and prepares form data for module
   * @param {Object|null} module - Module to edit or null for new module
   * @param {Function} setEditingModule - Function to set editing module state
   * @param {Function} setShowModal - Function to show modal
   * @param {Function} clearMessages - Function to clear error/success messages
   */
  const openModal = (module, setEditingModule, setShowModal, clearMessages) => {
    // Clear any existing messages
    if (clearMessages) clearMessages();

    if (module) {
      // Editing existing module
      setEditingModule(module);
      setFormData(createEditFormData(module));
    } else {
      // Creating new module
      setEditingModule(null);
      setFormData(createInitialFormData());
    }
    
    setShowModal(true);
  };

  /**
   * Closes modal and resets form
   * @param {Function} setShowModal - Function to hide modal
   * @param {Function} setEditingModule - Function to clear editing module
   * @param {Function} clearMessages - Function to clear error/success messages
   */
  const closeModal = (setShowModal, setEditingModule, clearMessages) => {
    setShowModal(false);
    setEditingModule(null);
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

  /**
   * Validates if required fields are filled
   * @returns {boolean} True if all required fields are filled
   */
  const isFormValid = () => {
    return !!(
      formData.phaseId?.trim() &&
      formData.title?.trim() &&
      formData.description?.trim() &&
      formData.difficulty?.trim()
    );
  };

  /**
   * Sets form data from module object (alternative to openModal)
   * @param {Object} module - Module object to populate form with
   */
  const populateFormFromModule = (module) => {
    if (module) {
      setFormData(createEditFormData(module));
    } else {
      setFormData(createInitialFormData());
    }
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
    isFormDirty,
    isFormValid,
    populateFormFromModule
  };
};

export default useModulesFormManagement;