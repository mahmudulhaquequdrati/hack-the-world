import { useState, useCallback } from 'react';
import { modulesAPI, phasesAPI } from '../../../services/api';
import { 
  createModuleData, 
  prepareModuleOrders, 
  handleApiError, 
  generateSuccessMessage,
  ensureValidArray,
  optimisticUpdate,
  processModulesWithPhasesResponse
} from '../utils/moduleUtils';
import { validateModuleData } from '../utils/moduleValidation';

/**
 * Custom hook for managing module API operations with triple state synchronization
 * Manages: modules, phases, modulesWithPhases arrays
 * @returns {Object} API state and functions
 */
const useModulesAPI = () => {
  // Core data state
  const [modules, setModules] = useState([]);
  const [phases, setPhases] = useState([]);
  const [modulesWithPhases, setModulesWithPhases] = useState([]);
  
  // Loading and status states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Fetches all data (modules, phases, modulesWithPhases) from the API
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Fetching modules and phases data...");

      const [modulesRes, phasesRes, modulesWithPhasesRes] =
        await Promise.allSettled([
          modulesAPI.getAll(),
          phasesAPI.getAll(),
          modulesAPI.getWithPhases(),
        ]);

      // Process modules response
      if (modulesRes.status === "fulfilled") {
        console.log("✅ Modules fetched successfully:", modulesRes.value);
        const modulesData = ensureValidArray(modulesRes.value.data);
        
        setModules(prevModules => {
          console.log("🔄 Updating modules state from", prevModules.length, "to", modulesData.length, "modules");
          return [...modulesData];
        });
      } else {
        console.error("❌ Error fetching modules:", modulesRes.reason);
      }

      // Process phases response
      if (phasesRes.status === "fulfilled") {
        console.log("✅ Phases fetched successfully:", phasesRes.value);
        const phasesData = ensureValidArray(phasesRes.value.data);
        
        setPhases(prevPhases => {
          console.log("🔄 Updating phases state from", prevPhases.length, "to", phasesData.length, "phases");
          return [...phasesData];
        });
      } else {
        console.error("❌ Error fetching phases:", phasesRes.reason);
      }

      // Process modulesWithPhases response
      if (modulesWithPhasesRes.status === "fulfilled") {
        console.log("✅ Modules with phases fetched successfully:", modulesWithPhasesRes.value);
        const modulesWithPhasesData = ensureValidArray(modulesWithPhasesRes.value.data);
        
        setModulesWithPhases(prevModulesWithPhases => {
          console.log("🔄 Updating modulesWithPhases state from", prevModulesWithPhases.length, "to", modulesWithPhasesData.length, "items");
          return [...modulesWithPhasesData];
        });
      } else {
        console.error("❌ Error fetching modules with phases:", modulesWithPhasesRes.reason);
      }

      // Set error if all failed
      if (modulesRes.status === "rejected" && phasesRes.status === "rejected") {
        setError("Failed to load data. Please check your connection and authentication.");
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setError("Failed to load data. Please check your connection and authentication.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handles module creation and update with optimistic updates and triple state sync
   * @param {Object} formData - Form data from the form
   * @param {Object} editingModule - Module being edited (null for new)
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const handleSubmit = useCallback(async (formData, editingModule, onSuccess, onError) => {
    setError("");
    setSaving(true);

    try {
      // Create module data object
      const moduleData = createModuleData(formData, modules, editingModule);

      // Validate module data
      const validation = validateModuleData(moduleData, modules, editingModule);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      console.log("Submitting module data:", validation.validatedData);

      let responseData;

      if (editingModule) {
        console.log("🔄 Updating module:", editingModule.id);
        
        // Optimistic update for editing - update both arrays
        const { updatedModules, updatedModulesWithPhases } = optimisticUpdate(
          modules, 
          modulesWithPhases, 
          validation.validatedData, 
          'update', 
          editingModule.id
        );
        
        setModules(updatedModules);
        setModulesWithPhases(updatedModulesWithPhases);

        const response = await modulesAPI.update(editingModule.id, validation.validatedData);
        responseData = response.data;
        console.log("✅ Module updated:", responseData);

        // Update with server response data
        const { updatedModules: finalModules, updatedModulesWithPhases: finalModulesWithPhases } = optimisticUpdate(
          modules, 
          modulesWithPhases, 
          responseData, 
          'update', 
          editingModule.id
        );
        
        setModules(finalModules);
        setModulesWithPhases(finalModulesWithPhases);
      } else {
        console.log("🔄 Creating new module");
        const response = await modulesAPI.create(validation.validatedData);
        responseData = response.data;
        console.log("✅ Module created:", responseData);

        // Optimistic add for new module - add to both arrays
        const { updatedModules, updatedModulesWithPhases } = optimisticUpdate(
          modules, 
          modulesWithPhases, 
          responseData, 
          'add'
        );
        
        setModules(updatedModules);
        setModulesWithPhases(updatedModulesWithPhases);
      }

      const successMessage = generateSuccessMessage(editingModule ? 'update' : 'create');
      setSuccess(successMessage);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(responseData, successMessage);
      }

      return responseData;
    } catch (error) {
      console.error("Error saving module:", error);
      const errorMessage = handleApiError(error, "Failed to save module");
      setError(errorMessage);

      // Rollback optimistic updates on error by refetching
      await fetchData();

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }

      throw error; // Re-throw for component handling
    } finally {
      setSaving(false);
    }
  }, [modules, modulesWithPhases, fetchData]);

  /**
   * Handles module deletion with optimistic updates and triple state sync
   * @param {Object} moduleToDelete - Module to delete
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const confirmDelete = useCallback(async (moduleToDelete, onSuccess, onError) => {
    if (!moduleToDelete) return;

    try {
      setSaving(true);
      setError("");

      console.log("🔄 Deleting module:", moduleToDelete.id);

      // Optimistic removal - remove from both arrays immediately
      const { updatedModules, updatedModulesWithPhases } = optimisticUpdate(
        modules, 
        modulesWithPhases, 
        null, 
        'delete', 
        moduleToDelete.id
      );
      
      setModules(updatedModules);
      setModulesWithPhases(updatedModulesWithPhases);

      const response = await modulesAPI.delete(moduleToDelete.id);
      console.log("✅ Module deleted:", response);

      const successMessage = generateSuccessMessage('delete', moduleToDelete);
      setSuccess(successMessage);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(successMessage);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("❌ Error deleting module:", error);
      const errorMessage = handleApiError(error, "Failed to delete module");
      setError(errorMessage);

      // Rollback optimistic deletion on error by refetching
      await fetchData();

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  }, [modules, modulesWithPhases, fetchData]);

  /**
   * Saves reordered modules to backend
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const saveModuleOrder = useCallback(async (onSuccess, onError) => {
    try {
      setSaving(true);
      setError("");

      // Prepare module orders for batch update
      const moduleOrders = prepareModuleOrders(modulesWithPhases);

      // Send batch update to backend
      const response = await modulesAPI.batchUpdateOrder({ moduleOrders });

      const successMessage = generateSuccessMessage('reorder');
      setSuccess(successMessage);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(successMessage);
      }

      // Use the response data instead of fetching fresh data to avoid race condition
      if (response.data && Array.isArray(response.data)) {
        const updatedModulesWithPhases = processModulesWithPhasesResponse(response, modulesWithPhases);
        setModulesWithPhases(updatedModulesWithPhases);
        setModules(response.data);
      } else {
        // Fallback to fetching fresh data with a small delay
        setTimeout(async () => {
          await fetchData();
        }, 500);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error saving module order:", error);
      const errorMessage = handleApiError(error, "Failed to save module order");
      setError(errorMessage);

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  }, [modulesWithPhases, fetchData]);

  /**
   * Resets module order by refetching from server
   * @param {Function} onReset - Reset callback
   */
  const resetModuleOrder = useCallback(async (onReset) => {
    await fetchData(); // Reload original order
    setSuccess("");
    setError("");
    
    if (onReset) {
      onReset();
    }
  }, [fetchData]);

  /**
   * Clears error and success messages
   */
  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  /**
   * Sets modules directly (for external updates like drag & drop)
   * @param {Array|Function} newModules - New modules array or updater function
   */
  const setModulesExternal = useCallback((newModules) => {
    setModules(newModules);
  }, []);

  /**
   * Sets modulesWithPhases directly (for external updates like drag & drop)
   * @param {Array|Function} newModulesWithPhases - New modulesWithPhases array or updater function
   */
  const setModulesWithPhasesExternal = useCallback((newModulesWithPhases) => {
    setModulesWithPhases(newModulesWithPhases);
  }, []);

  return {
    // Data
    modules,
    phases,
    modulesWithPhases,
    loading,
    saving,
    error,
    success,
    
    // Actions
    fetchData,
    handleSubmit,
    confirmDelete,
    saveModuleOrder,
    resetModuleOrder,
    clearMessages,
    
    // External state setters (for drag & drop, etc.)
    setModules: setModulesExternal,
    setModulesWithPhases: setModulesWithPhasesExternal,
    
    // Direct state setters (for external control)
    setError,
    setSuccess,
    setLoading,
    setSaving
  };
};

export default useModulesAPI;