import { useState, useCallback } from 'react';
import { phasesAPI } from '../../../services/api';
import { 
  createPhaseData, 
  preparePhaseOrders, 
  handleApiError, 
  generateSuccessMessage,
  ensureValidPhasesArray,
  optimisticUpdate
} from '../utils/phaseUtils';
import { validatePhaseData } from '../utils/phaseValidation';

/**
 * Custom hook for managing phase API operations
 * @returns {Object} API state and functions
 */
const usePhasesAPI = () => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Fetches all phases from the API
   * @param {boolean} showLoader - Whether to show loading state
   */
  const fetchPhases = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");
      console.log("🔄 Fetching phases...");
      
      const response = await phasesAPI.getAll();
      console.log("✅ Phases fetched:", response.data);

      // Ensure we have a valid array
      const phasesData = ensureValidPhasesArray(response.data);

      // Force state update using functional update to ensure React detects the change
      setPhases((prevPhases) => {
        console.log(
          "🔄 Updating phases state from",
          prevPhases.length,
          "to",
          phasesData.length,
          "phases"
        );
        return [...phasesData];
      });
    } catch (error) {
      console.error("❌ Error fetching phases:", error);
      const errorMessage = handleApiError(error, "Failed to load phases");
      setError(errorMessage);
      setPhases([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  /**
   * Handles phase creation and update with optimistic updates
   * @param {Object} formData - Form data from the form
   * @param {Object} editingPhase - Phase being edited (null for new)
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const handleSubmit = useCallback(async (formData, editingPhase, onSuccess, onError) => {
    setError("");
    setSaving(true);

    try {
      // Create phase data object
      const phaseData = createPhaseData(formData, phases, editingPhase);

      // Validate phase data
      const validation = validatePhaseData(phaseData, phases, editingPhase);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      let responseData;

      if (editingPhase) {
        console.log("🔄 Updating phase:", editingPhase._id, validation.validatedData);

        // Optimistic update for editing
        setPhases((prevPhases) =>
          optimisticUpdate(prevPhases, { ...editingPhase, ...validation.validatedData }, 'update')
        );

        const response = await phasesAPI.update(editingPhase._id, validation.validatedData);
        responseData = response.data;
        console.log("✅ Phase updated:", responseData);

        // Update with server response data
        setPhases((prevPhases) =>
          optimisticUpdate(prevPhases, responseData, 'update')
        );
      } else {
        console.log("🔄 Creating new phase:", validation.validatedData);
        const response = await phasesAPI.create(validation.validatedData);
        responseData = response.data;
        console.log("✅ Phase created:", responseData);

        // Optimistic add for new phase
        setPhases((prevPhases) => optimisticUpdate(prevPhases, responseData, 'add'));
      }

      const successMessage = generateSuccessMessage(editingPhase ? 'update' : 'create');
      setSuccess(successMessage);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(responseData, successMessage);
      }

      return responseData;
    } catch (error) {
      console.error("Error saving phase:", error);
      const errorMessage = handleApiError(error, "Failed to save phase");
      setError(errorMessage);

      // Rollback optimistic updates on error by refetching
      await fetchPhases(false);

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }

      throw error; // Re-throw for component handling
    } finally {
      setSaving(false);
    }
  }, [phases, fetchPhases]);

  /**
   * Handles phase deletion with optimistic updates
   * @param {Object} phaseToDelete - Phase to delete
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const confirmDelete = useCallback(async (phaseToDelete, onSuccess, onError) => {
    if (!phaseToDelete) return;

    try {
      setSaving(true);
      setError("");

      console.log("🔄 Deleting phase:", phaseToDelete._id);

      // Optimistic removal - remove from UI immediately
      const phaseToDeleteId = phaseToDelete._id;
      setPhases((prevPhases) => 
        optimisticUpdate(prevPhases, { _id: phaseToDeleteId }, 'delete')
      );

      const response = await phasesAPI.delete(phaseToDeleteId);
      console.log("✅ Phase deleted:", response);

      const successMessage = generateSuccessMessage('delete', phaseToDelete);
      setSuccess(successMessage);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(successMessage);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("❌ Error deleting phase:", error);
      const errorMessage = handleApiError(error, "Failed to delete phase");
      setError(errorMessage);

      // Rollback optimistic deletion on error by refetching
      await fetchPhases(false);

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  }, [fetchPhases]);

  /**
   * Saves reordered phases to backend
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  const savePhaseOrder = useCallback(async (onSuccess, onError) => {
    try {
      setSaving(true);
      setError("");

      // Prepare order updates for batch API
      const phaseOrders = preparePhaseOrders(phases);

      // Send batch update to backend using new batch endpoint
      await phasesAPI.batchUpdateOrder({ phaseOrders });

      const successMessage = generateSuccessMessage('reorder');
      setSuccess(successMessage);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(successMessage);
      }

      // Refresh data to ensure consistency
      await fetchPhases(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error saving phase order:", error);
      const errorMessage = handleApiError(error, "Failed to save phase order. Please try again.");
      setError(errorMessage);

      // Refresh to restore original order on error
      await fetchPhases(false);

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  }, [phases, fetchPhases]);

  /**
   * Resets phase order by refetching from server
   * @param {Function} onReset - Reset callback
   */
  const resetPhaseOrder = useCallback(async (onReset) => {
    await fetchPhases(false); // Reload original order without loader
    setSuccess("");
    setError("");
    
    if (onReset) {
      onReset();
    }
  }, [fetchPhases]);

  /**
   * Clears error and success messages
   */
  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  /**
   * Sets phases directly (for external updates like drag & drop)
   * @param {Array|Function} newPhases - New phases array or updater function
   */
  const setPhasesExternal = useCallback((newPhases) => {
    setPhases(newPhases);
  }, []);

  return {
    // Data
    phases,
    loading,
    saving,
    error,
    success,
    
    // Actions
    fetchPhases,
    handleSubmit,
    confirmDelete,
    savePhaseOrder,
    resetPhaseOrder,
    clearMessages,
    setPhases: setPhasesExternal,
    
    // Direct state setters (for external control)
    setError,
    setSuccess,
    setLoading,
    setSaving
  };
};

export default usePhasesAPI;