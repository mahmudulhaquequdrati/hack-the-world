/**
 * Creates phase data object for API submission
 * @param {Object} formData - Form data from state
 * @param {Array} phases - All existing phases for order calculation
 * @param {Object} editingPhase - Phase being edited (null for new phases)
 * @returns {Object} Prepared phase data
 */
export const createPhaseData = (formData, phases, editingPhase) => {
  const phaseData = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    icon: formData.icon.trim(),
    color: formData.color,
  };

  // Auto-calculate order for new phases
  if (!editingPhase) {
    // For new phases, set order to be the next available number
    const maxOrder =
      phases.length > 0 ? Math.max(...phases.map((p) => p.order || 0)) : 0;
    phaseData.order = maxOrder + 1;
  } else {
    // For editing, keep the existing order or use form data if provided
    phaseData.order = formData.order.trim()
      ? parseInt(formData.order)
      : editingPhase.order;
  }

  return phaseData;
};

/**
 * Prepares phase orders for batch update
 * @param {Array} phases - Array of phases with order
 * @returns {Array} Array of phase order objects for API
 */
export const preparePhaseOrders = (phases) => {
  return phases.map((phase) => ({
    _id: phase._id,
    order: phase.order,
  }));
};

/**
 * Handles API error formatting
 * @param {Error} error - The error object from API call
 * @param {string} defaultMessage - Default message if no specific error
 * @returns {string} Formatted error message
 */
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  console.error("API Error:", error);
  
  // Check for specific error message in response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for generic error message
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};

/**
 * Clears messages after a specified timeout
 * @param {Function} setSuccess - Success message setter
 * @param {Function} setError - Error message setter
 * @param {number} timeout - Timeout in milliseconds (default: 3000)
 */
export const clearMessages = (setSuccess, setError, timeout = 3000) => {
  setTimeout(() => {
    setSuccess("");
    setError("");
  }, timeout);
};

/**
 * Creates initial form data for new phase
 * @returns {Object} Initial form data
 */
export const createInitialFormData = () => ({
  title: "",
  description: "",
  icon: "",
  color: "green",
  order: "",
});

/**
 * Creates form data from existing phase for editing
 * @param {Object} phase - Phase object to edit
 * @returns {Object} Form data populated with phase values
 */
export const createEditFormData = (phase) => ({
  title: phase.title || "",
  description: phase.description || "",
  icon: phase.icon || "",
  color: phase.color || "green",
  order: phase.order?.toString() || "",
});

/**
 * Optimistically updates phases array for immediate UI response
 * @param {Array} prevPhases - Current phases array
 * @param {Object} updatedPhase - Updated phase data
 * @param {string} operation - Operation type: 'update', 'add', 'delete'
 * @returns {Array} Updated phases array
 */
export const optimisticUpdate = (prevPhases, updatedPhase, operation) => {
  switch (operation) {
    case 'update':
      return prevPhases.map((phase) =>
        phase._id === updatedPhase._id ? { ...phase, ...updatedPhase } : phase
      );
    
    case 'add':
      return [...prevPhases, updatedPhase];
    
    case 'delete':
      return prevPhases.filter((phase) => phase._id !== updatedPhase._id);
    
    default:
      console.warn(`Unknown optimistic update operation: ${operation}`);
      return prevPhases;
  }
};

/**
 * Sorts phases by order for consistent display
 * @param {Array} phases - Array of phases to sort
 * @returns {Array} Sorted phases array
 */
export const sortPhasesByOrder = (phases) => {
  return [...phases].sort((a, b) => (a.order || 0) - (b.order || 0));
};

/**
 * Generates success message based on operation
 * @param {string} operation - Operation type: 'create', 'update', 'delete', 'reorder'
 * @param {Object} phase - Phase object (optional)
 * @returns {string} Success message
 */
export const generateSuccessMessage = (operation, phase = null) => {
  switch (operation) {
    case 'create':
      return "Phase created successfully!";
    case 'update':
      return "Phase updated successfully!";
    case 'delete':
      return `Phase "${phase?.title || 'Unknown'}" deleted successfully!`;
    case 'reorder':
      return "Phase order saved successfully!";
    default:
      return "Operation completed successfully!";
  }
};

/**
 * Validates if phases array has valid structure
 * @param {*} phases - Data to validate as phases array
 * @returns {Array} Valid phases array or empty array
 */
export const ensureValidPhasesArray = (phases) => {
  return Array.isArray(phases) ? phases : [];
};