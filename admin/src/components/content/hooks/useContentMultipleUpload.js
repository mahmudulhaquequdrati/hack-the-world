import { useState, useCallback } from 'react';
import { createUploadItemTemplate } from '../utils/contentUtils';
import { validateMultipleUploads } from '../utils/contentValidation';

/**
 * Custom hook for managing multiple content upload functionality
 */
export const useContentMultipleUpload = () => {
  // Multiple upload state
  const [showMultipleUpload, setShowMultipleUpload] = useState(false);
  const [multipleUploads, setMultipleUploads] = useState([]);
  const [selectedPhaseForUpload, setSelectedPhaseForUpload] = useState("");
  const [selectedModuleForUpload, setSelectedModuleForUpload] = useState("");
  const [uploadErrors, setUploadErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  // Initialize multiple upload
  const startMultipleUpload = useCallback(() => {
    setShowMultipleUpload(true);
    setMultipleUploads([createUploadItemTemplate()]);
    setSelectedPhaseForUpload("");
    setSelectedModuleForUpload("");
    setUploadErrors({});
    setUploadProgress({});
  }, []);

  // Add new upload item
  const addNewUploadItem = useCallback(() => {
    setMultipleUploads((prev) => [...prev, createUploadItemTemplate()]);
  }, []);

  // Remove upload item
  const removeUploadItem = useCallback((id) => {
    setMultipleUploads((prev) => prev.filter((item) => item.id !== id));
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  }, []);

  // Update upload item
  const updateUploadItem = useCallback((id, field, value) => {
    setMultipleUploads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    
    // Clear errors for this field
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors[id]) {
        delete newErrors[id][field];
        if (Object.keys(newErrors[id]).length === 0) {
          delete newErrors[id];
        }
      }
      return newErrors;
    });
  }, []);

  // Update upload item array field
  const updateUploadItemArray = useCallback((id, field, index, value) => {
    setMultipleUploads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newArray = [...(item[field] || [])];
          newArray[index] = value;
          return { ...item, [field]: newArray };
        }
        return item;
      })
    );
  }, []);

  // Add array item to upload item
  const addUploadItemArrayItem = useCallback((id, field, defaultValue = "") => {
    setMultipleUploads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { 
            ...item, 
            [field]: [...(item[field] || []), defaultValue] 
          };
        }
        return item;
      })
    );
  }, []);

  // Remove array item from upload item
  const removeUploadItemArrayItem = useCallback((id, field, index) => {
    setMultipleUploads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { 
            ...item, 
            [field]: (item[field] || []).filter((_, i) => i !== index)
          };
        }
        return item;
      })
    );
  }, []);

  // Validate all upload items
  const validateUploadItems = useCallback(() => {
    const validation = validateMultipleUploads(multipleUploads);
    
    if (!validation.isValid) {
      setUploadErrors(validation.itemErrors || {});
    } else {
      setUploadErrors({});
    }
    
    return validation;
  }, [multipleUploads]);

  // Validate individual upload item
  const validateSingleUploadItem = useCallback((item) => {
    const errors = {};
    
    if (!item.title?.trim()) {
      errors.title = "Title is required";
    }
    
    if (!item.description?.trim()) {
      errors.description = "Description is required";
    }
    
    if (item.type === "video" && !item.url?.trim()) {
      errors.url = "URL is required for video content";
    }
    
    if ((item.type === "lab" || item.type === "game") && !item.instructions?.trim()) {
      errors.instructions = "Instructions are required for lab and game content";
    }
    
    if (item.duration && (isNaN(item.duration) || item.duration < 1)) {
      errors.duration = "Duration must be a positive number";
    }
    
    return errors;
  }, []);

  // Set upload progress for an item
  const setItemUploadProgress = useCallback((id, progress) => {
    setUploadProgress(prev => ({
      ...prev,
      [id]: progress
    }));
  }, []);

  // Close multiple upload modal
  const closeMultipleUpload = useCallback(() => {
    setShowMultipleUpload(false);
    setMultipleUploads([]);
    setSelectedPhaseForUpload("");
    setSelectedModuleForUpload("");
    setUploadErrors({});
    setUploadProgress({});
  }, []);

  // Duplicate upload item
  const duplicateUploadItem = useCallback((id) => {
    const itemToDuplicate = multipleUploads.find(item => item.id === id);
    if (itemToDuplicate) {
      const duplicatedItem = {
        ...itemToDuplicate,
        id: Date.now() + Math.random(),
        title: `${itemToDuplicate.title} (Copy)`,
      };
      setMultipleUploads(prev => [...prev, duplicatedItem]);
    }
  }, [multipleUploads]);

  // Clear all upload items
  const clearAllUploadItems = useCallback(() => {
    setMultipleUploads([createUploadItemTemplate()]);
    setUploadErrors({});
    setUploadProgress({});
  }, []);

  // Get upload statistics
  const getUploadStatistics = useCallback(() => {
    const total = multipleUploads.length;
    const completed = Object.values(uploadProgress).filter(progress => progress === 100).length;
    const errored = Object.keys(uploadErrors).length;
    const pending = total - completed - errored;
    
    return {
      total,
      completed,
      errored,
      pending,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [multipleUploads, uploadProgress, uploadErrors]);

  // Check if ready to submit
  const isReadyToSubmit = useCallback(() => {
    return (
      multipleUploads.length > 0 &&
      selectedModuleForUpload &&
      Object.keys(uploadErrors).length === 0 &&
      multipleUploads.every(item => item.title?.trim() && item.description?.trim())
    );
  }, [multipleUploads, selectedModuleForUpload, uploadErrors]);

  // Get filtered modules for upload (by selected phase)
  const getFilteredModulesForUpload = useCallback((modules) => {
    if (!selectedPhaseForUpload) return modules;
    return modules.filter(module => module.phaseId === selectedPhaseForUpload);
  }, [selectedPhaseForUpload]);

  // Auto-fill items based on pattern
  const autoFillItems = useCallback((pattern) => {
    if (pattern === 'sequential') {
      setMultipleUploads(prev => 
        prev.map((item, index) => ({
          ...item,
          title: item.title || `Content Item ${index + 1}`,
          section: item.section || `Section ${index + 1}`
        }))
      );
    } else if (pattern === 'video-series') {
      setMultipleUploads(prev => 
        prev.map((item, index) => ({
          ...item,
          type: 'video',
          title: item.title || `Video ${index + 1}`,
          section: item.section || `Episode ${index + 1}`
        }))
      );
    }
  }, []);

  return {
    // State
    showMultipleUpload,
    multipleUploads,
    selectedPhaseForUpload,
    selectedModuleForUpload,
    uploadErrors,
    uploadProgress,

    // Actions
    setSelectedPhaseForUpload,
    setSelectedModuleForUpload,
    startMultipleUpload,
    addNewUploadItem,
    removeUploadItem,
    updateUploadItem,
    updateUploadItemArray,
    addUploadItemArrayItem,
    removeUploadItemArrayItem,
    duplicateUploadItem,
    clearAllUploadItems,
    closeMultipleUpload,
    setItemUploadProgress,
    autoFillItems,

    // Validation
    validateUploadItems,
    validateSingleUploadItem,

    // Computed values
    getUploadStatistics,
    isReadyToSubmit,
    getFilteredModulesForUpload,
  };
};