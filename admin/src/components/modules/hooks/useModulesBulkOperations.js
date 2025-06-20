import { useState, useCallback } from 'react';
import { modulesAPI } from '../../../services/api';
import { 
  createBulkUpdateData, 
  handleApiError, 
  generateSuccessMessage,
  optimisticUpdate
} from '../utils/moduleUtils';
import { validateBulkOperation } from '../utils/moduleValidation';

/**
 * Custom hook for managing bulk operations on modules
 * @param {Array} modules - Array of all modules
 * @param {Array} modulesWithPhases - Array of phases with modules
 * @param {Function} setModules - Function to update modules state
 * @param {Function} setModulesWithPhases - Function to update modulesWithPhases state
 * @param {Function} fetchData - Function to refetch data on error
 * @returns {Object} Bulk operations state and functions
 */
const useModulesBulkOperations = (
  modules = [], 
  modulesWithPhases = [], 
  setModules, 
  setModulesWithPhases, 
  fetchData
) => {
  // Bulk operations state
  const [bulkFormData, setBulkFormData] = useState({
    phaseId: "",
    difficulty: "",
    isActive: true,
    color: "",
  });
  const [bulkOperationLoading, setBulkOperationLoading] = useState(false);

  /**
   * Handles bulk operation submission
   * @param {string} operation - Bulk operation type
   * @param {Set} selectedModules - Set of selected module IDs
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const handleBulkSubmit = useCallback(async (operation, selectedModules, onSuccess, onError) => {
    // Validate bulk operation
    const validation = validateBulkOperation(operation, bulkFormData, Array.from(selectedModules));
    if (!validation.isValid) {
      const errorMessage = validation.errors.join(", ");
      if (onError) onError(errorMessage);
      return;
    }

    try {
      setBulkOperationLoading(true);

      const moduleIds = Array.from(selectedModules);
      const updateData = createBulkUpdateData(operation, bulkFormData);

      console.log("🔄 Bulk updating modules:", moduleIds, updateData);

      // Optimistic bulk update - apply changes immediately to both state arrays
      const { updatedModules, updatedModulesWithPhases } = optimisticUpdate(
        modules, 
        modulesWithPhases, 
        updateData, 
        'bulk_update', 
        moduleIds
      );
      
      setModules(updatedModules);
      setModulesWithPhases(updatedModulesWithPhases);

      // Execute bulk update
      const updatePromises = moduleIds.map((moduleId) =>
        modulesAPI.update(moduleId, updateData)
      );

      await Promise.all(updatePromises);

      console.log("✅ Bulk update completed successfully");
      const successMessage = generateSuccessMessage('bulk', null, moduleIds.length);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(successMessage, moduleIds.length);
      }

      // Reset bulk form data
      setBulkFormData({
        phaseId: "",
        difficulty: "",
        isActive: true,
        color: "",
      });

      return successMessage;
    } catch (error) {
      console.error("❌ Error in bulk update:", error);
      const errorMessage = handleApiError(error, "Failed to update modules");
      
      // Rollback optimistic updates on error by refetching
      if (fetchData) {
        await fetchData();
      }

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }

      throw error; // Re-throw for component handling
    } finally {
      setBulkOperationLoading(false);
    }
  }, [bulkFormData, modules, modulesWithPhases, setModules, setModulesWithPhases, fetchData]);

  /**
   * Handles bulk operation for phase updates
   * @param {Set} selectedModules - Set of selected module IDs
   * @param {string} phaseId - New phase ID for modules
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const handleBulkPhaseUpdate = useCallback(async (selectedModules, phaseId, onSuccess, onError) => {
    const tempBulkData = { ...bulkFormData, phaseId };
    setBulkFormData(tempBulkData);
    
    return handleBulkSubmit("updatePhase", selectedModules, onSuccess, onError);
  }, [bulkFormData, handleBulkSubmit]);

  /**
   * Handles bulk operation for difficulty updates
   * @param {Set} selectedModules - Set of selected module IDs
   * @param {string} difficulty - New difficulty for modules
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const handleBulkDifficultyUpdate = useCallback(async (selectedModules, difficulty, onSuccess, onError) => {
    const tempBulkData = { ...bulkFormData, difficulty };
    setBulkFormData(tempBulkData);
    
    return handleBulkSubmit("updateDifficulty", selectedModules, onSuccess, onError);
  }, [bulkFormData, handleBulkSubmit]);

  /**
   * Handles bulk operation for status updates
   * @param {Set} selectedModules - Set of selected module IDs
   * @param {boolean} isActive - New active status for modules
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const handleBulkStatusUpdate = useCallback(async (selectedModules, isActive, onSuccess, onError) => {
    const tempBulkData = { ...bulkFormData, isActive };
    setBulkFormData(tempBulkData);
    
    return handleBulkSubmit("updateStatus", selectedModules, onSuccess, onError);
  }, [bulkFormData, handleBulkSubmit]);

  /**
   * Handles bulk operation for color updates
   * @param {Set} selectedModules - Set of selected module IDs
   * @param {string} color - New color for modules
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const handleBulkColorUpdate = useCallback(async (selectedModules, color, onSuccess, onError) => {
    const tempBulkData = { ...bulkFormData, color };
    setBulkFormData(tempBulkData);
    
    return handleBulkSubmit("updateColor", selectedModules, onSuccess, onError);
  }, [bulkFormData, handleBulkSubmit]);

  /**
   * Resets bulk form data to initial state
   */
  const resetBulkFormData = useCallback(() => {
    setBulkFormData({
      phaseId: "",
      difficulty: "",
      isActive: true,
      color: "",
    });
  }, []);

  /**
   * Updates a specific field in bulk form data
   * @param {string} field - Field name to update
   * @param {*} value - New value for the field
   */
  const updateBulkFormField = useCallback((field, value) => {
    setBulkFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  /**
   * Gets current bulk form data
   * @returns {Object} Current bulk form data
   */
  const getBulkFormData = useCallback(() => bulkFormData, [bulkFormData]);

  /**
   * Checks if bulk form is valid for a specific operation
   * @param {string} operation - Bulk operation type
   * @returns {boolean} True if bulk form is valid for the operation
   */
  const isBulkFormValid = useCallback((operation) => {
    switch (operation) {
      case "updatePhase":
        return !!bulkFormData.phaseId?.trim();
      case "updateDifficulty":
        return !!bulkFormData.difficulty?.trim();
      case "updateColor":
        return !!bulkFormData.color?.trim();
      case "updateStatus":
        return typeof bulkFormData.isActive === "boolean";
      default:
        return false;
    }
  }, [bulkFormData]);

  /**
   * Validates if bulk operation can be performed
   * @param {string} operation - Bulk operation type
   * @param {Set} selectedModules - Set of selected module IDs
   * @returns {Object} { isValid, errors }
   */
  const validateBulkOperationRequest = useCallback((operation, selectedModules) => {
    return validateBulkOperation(operation, bulkFormData, Array.from(selectedModules));
  }, [bulkFormData]);

  /**
   * Gets suggested values for bulk operations based on selected modules
   * @param {Set} selectedModules - Set of selected module IDs
   * @returns {Object} Suggested values for bulk form
   */
  const getSuggestedBulkValues = useCallback((selectedModules) => {
    const selectedModuleObjects = modules.filter(m => selectedModules.has(m._id));
    
    if (selectedModuleObjects.length === 0) {
      return {};
    }

    // Find common values among selected modules
    const phases = [...new Set(selectedModuleObjects.map(m => m.phaseId))];
    const difficulties = [...new Set(selectedModuleObjects.map(m => m.difficulty))];
    const colors = [...new Set(selectedModuleObjects.map(m => m.color))];
    const statuses = [...new Set(selectedModuleObjects.map(m => m.isActive))];

    return {
      commonPhase: phases.length === 1 ? phases[0] : null,
      commonDifficulty: difficulties.length === 1 ? difficulties[0] : null,
      commonColor: colors.length === 1 ? colors[0] : null,
      commonStatus: statuses.length === 1 ? statuses[0] : null,
      hasMultiplePhases: phases.length > 1,
      hasMultipleDifficulties: difficulties.length > 1,
      hasMultipleColors: colors.length > 1,
      hasMultipleStatuses: statuses.length > 1
    };
  }, [modules]);

  return {
    // Bulk form state
    bulkFormData,
    bulkOperationLoading,
    
    // Primary bulk operations
    handleBulkSubmit,
    
    // Specific bulk operations
    handleBulkPhaseUpdate,
    handleBulkDifficultyUpdate,
    handleBulkStatusUpdate,
    handleBulkColorUpdate,
    
    // Form management
    setBulkFormData,
    resetBulkFormData,
    updateBulkFormField,
    getBulkFormData,
    
    // Validation
    isBulkFormValid,
    validateBulkOperationRequest,
    
    // Utilities
    getSuggestedBulkValues
  };
};

export default useModulesBulkOperations;