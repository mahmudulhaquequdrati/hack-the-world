import { useState, useCallback } from 'react';
import { 
  createDefaultFormData, 
  populateFormFromContent, 
  createContentData 
} from '../utils/contentUtils';
import { validateComprehensive } from '../utils/contentValidation';

/**
 * Custom hook for managing content form state and operations
 */
export const useContentFormManagement = () => {
  // Form state
  const [formData, setFormData] = useState(createDefaultFormData());
  const [editingContent, setEditingContent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sectionInputValue, setSectionInputValue] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [formWarnings, setFormWarnings] = useState([]);

  // Reset form to default state
  const resetForm = useCallback(() => {
    setFormData(createDefaultFormData());
    setEditingContent(null);
    setSectionInputValue("");
    setFormErrors([]);
    setFormWarnings([]);
  }, []);

  // Populate form for editing
  const handleEdit = useCallback((contentItem) => {
    const populatedData = populateFormFromContent(contentItem);
    setEditingContent(contentItem);
    setFormData(populatedData);
    setSectionInputValue(contentItem.section || "");
    setFormErrors([]);
    setFormWarnings([]);
    setShowForm(true);
  }, []);

  // Handle form data changes
  const handleFormDataChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle nested form data changes (for objects like accessibility)
  const handleNestedFormDataChange = useCallback((parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  }, []);

  // Handle array field changes
  const handleArrayFieldChange = useCallback((field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  }, []);

  // Add item to array field
  const addArrayItem = useCallback((field, defaultValue = "") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  }, []);

  // Remove item from array field
  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  // Handle section input changes
  const handleSectionInputChange = useCallback((e) => {
    const value = e.target.value;
    setSectionInputValue(value);
    setFormData(prev => ({ ...prev, section: value }));
  }, []);

  // Validate form data
  const validateForm = useCallback((availableSections = []) => {
    const contentData = createContentData(formData, sectionInputValue);
    const validation = validateComprehensive(contentData, availableSections);
    
    setFormErrors(validation.errors);
    setFormWarnings(validation.warnings);
    
    return validation.isValid;
  }, [formData, sectionInputValue]);

  // Get form data for submission
  const getSubmissionData = useCallback(() => {
    return createContentData(formData, sectionInputValue);
  }, [formData, sectionInputValue]);

  // Open form for new content
  const openNewContentForm = useCallback(() => {
    resetForm();
    setShowForm(true);
  }, [resetForm]);

  // Close form
  const closeForm = useCallback(() => {
    setShowForm(false);
    resetForm();
  }, [resetForm]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    const defaultData = createDefaultFormData();
    
    // Compare current form data with default data
    const fieldsToCheck = [
      'title', 'description', 'url', 'instructions', 'moduleId',
      'type', 'section', 'duration', 'estimatedTime'
    ];
    
    return fieldsToCheck.some(field => 
      formData[field] !== defaultData[field] && 
      formData[field] !== ""
    ) || sectionInputValue !== "";
  }, [formData, sectionInputValue]);

  // Get form state summary
  const getFormStateSummary = useCallback(() => {
    return {
      isEditing: !!editingContent,
      hasErrors: formErrors.length > 0,
      hasWarnings: formWarnings.length > 0,
      hasUnsavedChanges: hasUnsavedChanges(),
      isValid: formErrors.length === 0
    };
  }, [editingContent, formErrors, formWarnings, hasUnsavedChanges]);

  // Handle form submission preparation
  const prepareSubmission = useCallback((availableSections = []) => {
    const isValid = validateForm(availableSections);
    
    if (!isValid) {
      return { success: false, errors: formErrors };
    }
    
    const submissionData = getSubmissionData();
    
    return { 
      success: true, 
      data: submissionData,
      isEditing: !!editingContent,
      editingId: editingContent?._id
    };
  }, [validateForm, formErrors, getSubmissionData, editingContent]);

  return {
    // State
    formData,
    editingContent,
    showForm,
    sectionInputValue,
    formErrors,
    formWarnings,
    
    // Actions
    setFormData,
    resetForm,
    handleEdit,
    handleFormDataChange,
    handleNestedFormDataChange,
    handleArrayFieldChange,
    addArrayItem,
    removeArrayItem,
    handleSectionInputChange,
    setSectionInputValue,
    validateForm,
    getSubmissionData,
    openNewContentForm,
    closeForm,
    setShowForm,
    
    // Computed values
    hasUnsavedChanges,
    getFormStateSummary,
    prepareSubmission,
  };
};