import { normalizeColor } from "./moduleValidation";

/**
 * Creates module data object for API submission
 * @param {Object} formData - Form data from state
 * @param {Array} modules - All existing modules for order calculation
 * @param {Object} editingModule - Module being edited (null for new modules)
 * @returns {Object} Prepared module data
 */
export const createModuleData = (formData, modules, editingModule) => {
  // Normalize and validate color value
  const colorValue = normalizeColor(formData.color);

  // Handle prerequisites - convert to ObjectIds or leave empty
  let prerequisitesArray = [];
  if (formData.prerequisites && formData.prerequisites.trim()) {
    const prereqStrings = formData.prerequisites
      .split(",")
      .map((prereq) => prereq.trim())
      .filter(Boolean);

    // For now, skip prerequisites validation and send empty array
    // TODO: Implement proper module selection UI for prerequisites
    console.warn("Prerequisites entered but will be ignored:", prereqStrings);
    console.log("Note: Prerequisites must be valid MongoDB ObjectIds of existing modules");
    prerequisitesArray = [];
  }

  const moduleData = {
    phaseId: formData.phaseId,
    title: formData.title.trim(),
    description: formData.description.trim(),
    icon: formData.icon.trim() || "Shield",
    difficulty: formData.difficulty,
    color: colorValue,
    topics: formData.topics
      ? formData.topics
          .split(",")
          .map((topic) => topic.trim())
          .filter(Boolean)
      : [],
    prerequisites: prerequisitesArray, // Send empty array for now
    learningOutcomes: formData.learningOutcomes
      ? formData.learningOutcomes
          .split(",")
          .map((outcome) => outcome.trim())
          .filter(Boolean)
      : [],
    isActive: formData.isActive,
  };

  // Auto-calculate order for new modules
  if (!editingModule) {
    // For new modules, find max order in the selected phase and add 1
    const phaseModules = modules.filter((m) => m.phaseId === formData.phaseId);
    const maxOrder =
      phaseModules.length > 0
        ? Math.max(...phaseModules.map((m) => m.order || 0))
        : 0;
    moduleData.order = maxOrder + 1;
  } else {
    // For editing, keep existing order
    moduleData.order = editingModule.order;
  }

  return moduleData;
};

/**
 * Prepares module orders for batch update
 * @param {Array} modulesWithPhases - Array of phases with modules
 * @returns {Array} Array of module order objects for API
 */
export const prepareModuleOrders = (modulesWithPhases) => {
  const moduleOrders = [];

  modulesWithPhases.forEach((phase) => {
    phase.modules.forEach((module) => {
      moduleOrders.push({
        id: module.id,
        order: module.order,
      });
    });
  });

  return moduleOrders;
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
 * Creates initial form data for new module
 * @returns {Object} Initial form data
 */
export const createInitialFormData = () => ({
  phaseId: "",
  title: "",
  description: "",
  icon: "",
  difficulty: "",
  color: "green",
  topics: "",
  prerequisites: "",
  learningOutcomes: "",
  isActive: true,
});

/**
 * Creates form data from existing module for editing
 * @param {Object} module - Module object to edit
 * @returns {Object} Form data populated with module values
 */
export const createEditFormData = (module) => {
  // Normalize color value from database
  let colorValue = module.color || "green";
  if (typeof colorValue === "string") {
    colorValue = normalizeColor(colorValue);
  }

  return {
    phaseId: module.phaseId || "",
    title: module.title || "",
    description: module.description || "",
    icon: module.icon || "",
    difficulty: module.difficulty || "",
    color: colorValue,
    topics: Array.isArray(module.topics) ? module.topics.join(", ") : "",
    prerequisites: Array.isArray(module.prerequisites)
      ? module.prerequisites.join(", ")
      : "",
    learningOutcomes: Array.isArray(module.learningOutcomes)
      ? module.learningOutcomes.join(", ")
      : "",
    isActive: module.isActive !== false,
  };
};

/**
 * Optimistically updates modules arrays for immediate UI response
 * @param {Array} prevModules - Current modules array
 * @param {Array} prevModulesWithPhases - Current modulesWithPhases array
 * @param {Object} moduleData - Module data for update
 * @param {string} operation - Operation type: 'update', 'add', 'delete'
 * @param {string} moduleId - Module ID for update/delete operations
 * @returns {Object} { updatedModules, updatedModulesWithPhases }
 */
export const optimisticUpdate = (prevModules, prevModulesWithPhases, moduleData, operation, moduleId = null) => {
  let updatedModules = [...prevModules];
  let updatedModulesWithPhases = [...prevModulesWithPhases];

  switch (operation) {
    case 'update':
      // Update modules array
      updatedModules = prevModules.map(module =>
        module.id === moduleId
          ? { ...module, ...moduleData }
          : module
      );

      // Update modulesWithPhases array
      updatedModulesWithPhases = prevModulesWithPhases.map(phase => ({
        ...phase,
        modules: phase.modules.map(module =>
          module.id === moduleId
            ? { ...module, ...moduleData }
            : module
        )
      }));
      break;

    case 'add':
      // Add to modules array
      updatedModules = [...prevModules, moduleData];

      // Add to modulesWithPhases array
      updatedModulesWithPhases = prevModulesWithPhases.map(phase =>
        phase.id === moduleData.phaseId
          ? {
              ...phase,
              modules: [...phase.modules, moduleData].sort((a, b) => a.order - b.order)
            }
          : phase
      );
      break;

    case 'delete':
      // Remove from modules array
      updatedModules = prevModules.filter(module => module.id !== moduleId);

      // Remove from modulesWithPhases array
      updatedModulesWithPhases = prevModulesWithPhases.map(phase => ({
        ...phase,
        modules: phase.modules.filter(module => module.id !== moduleId)
      }));
      break;

    case 'bulk_update':
      const moduleIds = Array.isArray(moduleId) ? moduleId : [moduleId];
      
      // Update modules array
      updatedModules = prevModules.map(module =>
        moduleIds.includes(module.id)
          ? { ...module, ...moduleData }
          : module
      );

      // Update modulesWithPhases array
      updatedModulesWithPhases = prevModulesWithPhases.map(phase => ({
        ...phase,
        modules: phase.modules.map(module =>
          moduleIds.includes(module.id)
            ? { ...module, ...moduleData }
            : module
        )
      }));
      break;

    default:
      console.warn(`Unknown optimistic update operation: ${operation}`);
  }

  return {
    updatedModules,
    updatedModulesWithPhases
  };
};

/**
 * Sorts modules by order for consistent display
 * @param {Array} modules - Array of modules to sort
 * @returns {Array} Sorted modules array
 */
export const sortModulesByOrder = (modules) => {
  return [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));
};

/**
 * Generates success message based on operation
 * @param {string} operation - Operation type: 'create', 'update', 'delete', 'reorder', 'bulk'
 * @param {Object} module - Module object (optional)
 * @param {number} count - Count for bulk operations
 * @returns {string} Success message
 */
export const generateSuccessMessage = (operation, module = null, count = 0) => {
  switch (operation) {
    case 'create':
      return "Module created successfully!";
    case 'update':
      return "Module updated successfully!";
    case 'delete':
      return "Module deleted successfully!";
    case 'reorder':
      return "Module order saved successfully!";
    case 'bulk':
      return `Successfully updated ${count} modules`;
    default:
      return "Operation completed successfully!";
  }
};

/**
 * Validates if arrays have valid structure
 * @param {*} data - Data to validate as array
 * @returns {Array} Valid array or empty array
 */
export const ensureValidArray = (data) => {
  return Array.isArray(data) ? data : [];
};

/**
 * Processes modules with phases response data
 * @param {Object} response - API response from modules with phases
 * @param {Array} currentModulesWithPhases - Current modulesWithPhases state
 * @returns {Array} Processed modulesWithPhases array
 */
export const processModulesWithPhasesResponse = (response, currentModulesWithPhases) => {
  if (response.data && Array.isArray(response.data)) {
    // Group the updated modules by phase
    const phaseMap = new Map();

    // Initialize phase map with current phases
    currentModulesWithPhases.forEach((phase) => {
      phaseMap.set(phase.id, {
        ...phase,
        modules: [],
      });
    });

    // Add modules to their respective phases
    response.data.forEach((module) => {
      const phaseId = module.phaseId || module.phase?._id || module.phase?.id;
      if (phaseId && phaseMap.has(phaseId)) {
        phaseMap.get(phaseId).modules.push(module);
      }
    });

    // Convert map back to array and sort modules by order
    return Array.from(phaseMap.values()).map((phase) => ({
      ...phase,
      modules: sortModulesByOrder(phase.modules),
    }));
  }

  return ensureValidArray(response);
};

/**
 * Creates bulk operation update data
 * @param {string} operation - Bulk operation type
 * @param {Object} bulkFormData - Bulk form data
 * @returns {Object} Update data for API
 */
export const createBulkUpdateData = (operation, bulkFormData) => {
  const updateData = {};

  // Prepare update data based on operation
  if (operation === "updatePhase" && bulkFormData.phaseId) {
    updateData.phaseId = bulkFormData.phaseId;
  }
  if (operation === "updateDifficulty" && bulkFormData.difficulty) {
    updateData.difficulty = bulkFormData.difficulty;
  }
  if (operation === "updateStatus") {
    updateData.isActive = bulkFormData.isActive;
  }
  if (operation === "updateColor" && bulkFormData.color) {
    updateData.color = bulkFormData.color;
  }

  return updateData;
};

/**
 * Calculates statistics from modules data
 * @param {Array} modules - Array of modules
 * @param {Array} phases - Array of phases
 * @param {Set} selectedModules - Set of selected module IDs
 * @returns {Object} Statistics object
 */
export const calculateStatistics = (modules, phases, selectedModules) => {
  return {
    totalModules: modules.length,
    totalPhases: phases.length,
    selectedCount: selectedModules.size,
    activeModules: modules.filter(m => m.isActive).length,
    inactiveModules: modules.filter(m => !m.isActive).length,
    modulesByDifficulty: {
      beginner: modules.filter(m => m.difficulty === 'beginner').length,
      intermediate: modules.filter(m => m.difficulty === 'intermediate').length,
      advanced: modules.filter(m => m.difficulty === 'advanced').length,
      expert: modules.filter(m => m.difficulty === 'expert').length,
    }
  };
};