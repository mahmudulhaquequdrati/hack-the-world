import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing module selection logic
 * Handles individual selection, bulk selection, and phase-level selection
 * @param {Array} modules - Array of all modules
 * @returns {Object} Selection state and functions
 */
const useModulesSelection = (modules = []) => {
  const [selectedModules, setSelectedModules] = useState(new Set());

  /**
   * Handles selecting/deselecting all modules
   */
  const handleSelectAll = useCallback(() => {
    if (selectedModules.size === modules.length) {
      // If all modules are selected, deselect all
      setSelectedModules(new Set());
    } else {
      // Otherwise, select all modules
      setSelectedModules(new Set(modules.map((m) => m._id)));
    }
  }, [modules, selectedModules.size]);

  /**
   * Handles toggling selection for a single module
   * @param {string} moduleId - ID of the module to toggle
   */
  const handleToggleSelection = useCallback((moduleId) => {
    const newSelected = new Set(selectedModules);
    if (newSelected.has(moduleId)) {
      newSelected.delete(moduleId);
    } else {
      newSelected.add(moduleId);
    }
    setSelectedModules(newSelected);
  }, [selectedModules]);

  /**
   * Handles clearing all selections
   */
  const handleClearSelection = useCallback(() => {
    setSelectedModules(new Set());
  }, []);

  /**
   * Handles selecting/deselecting all modules in a specific phase
   * @param {Array} phaseModules - Array of modules in the phase
   */
  const handlePhaseSelection = useCallback((phaseModules) => {
    const phaseModuleIds = phaseModules.map((m) => m._id);
    const allSelected = phaseModuleIds.every((id) => selectedModules.has(id));
    const newSelected = new Set(selectedModules);

    if (allSelected) {
      // Deselect all modules in this phase
      phaseModuleIds.forEach((id) => newSelected.delete(id));
    } else {
      // Select all modules in this phase
      phaseModuleIds.forEach((id) => newSelected.add(id));
    }
    
    setSelectedModules(newSelected);
  }, [selectedModules]);

  /**
   * Selects specific modules by their IDs
   * @param {Array} moduleIds - Array of module IDs to select
   * @param {boolean} replace - Whether to replace current selection or add to it
   */
  const selectModules = useCallback((moduleIds, replace = false) => {
    if (replace) {
      setSelectedModules(new Set(moduleIds));
    } else {
      const newSelected = new Set(selectedModules);
      moduleIds.forEach(id => newSelected.add(id));
      setSelectedModules(newSelected);
    }
  }, [selectedModules]);

  /**
   * Deselects specific modules by their IDs
   * @param {Array} moduleIds - Array of module IDs to deselect
   */
  const deselectModules = useCallback((moduleIds) => {
    const newSelected = new Set(selectedModules);
    moduleIds.forEach(id => newSelected.delete(id));
    setSelectedModules(newSelected);
  }, [selectedModules]);

  /**
   * Checks if a module is selected
   * @param {string} moduleId - ID of the module to check
   * @returns {boolean} True if module is selected
   */
  const isModuleSelected = useCallback((moduleId) => {
    return selectedModules.has(moduleId);
  }, [selectedModules]);

  /**
   * Checks if all modules in a phase are selected
   * @param {Array} phaseModules - Array of modules in the phase
   * @returns {boolean} True if all phase modules are selected
   */
  const areAllPhaseModulesSelected = useCallback((phaseModules) => {
    if (phaseModules.length === 0) return false;
    return phaseModules.every((m) => selectedModules.has(m._id));
  }, [selectedModules]);

  /**
   * Checks if some (but not all) modules in a phase are selected
   * @param {Array} phaseModules - Array of modules in the phase
   * @returns {boolean} True if some phase modules are selected
   */
  const areSomePhaseModulesSelected = useCallback((phaseModules) => {
    if (phaseModules.length === 0) return false;
    const selectedInPhase = phaseModules.filter((m) => selectedModules.has(m._id));
    return selectedInPhase.length > 0 && selectedInPhase.length < phaseModules.length;
  }, [selectedModules]);

  /**
   * Gets the count of selected modules in a specific phase
   * @param {Array} phaseModules - Array of modules in the phase
   * @returns {number} Count of selected modules in the phase
   */
  const getPhaseSelectionCount = useCallback((phaseModules) => {
    return phaseModules.filter((m) => selectedModules.has(m._id)).length;
  }, [selectedModules]);

  /**
   * Gets array of selected module objects
   * @returns {Array} Array of selected module objects
   */
  const getSelectedModules = useCallback(() => {
    return modules.filter(module => selectedModules.has(module._id));
  }, [modules, selectedModules]);

  /**
   * Gets array of selected module IDs
   * @returns {Array} Array of selected module IDs
   */
  const getSelectedModuleIds = useCallback(() => {
    return Array.from(selectedModules);
  }, [selectedModules]);

  /**
   * Selects modules by filter criteria
   * @param {Function} filterFn - Filter function to determine which modules to select
   * @param {boolean} replace - Whether to replace current selection or add to it
   */
  const selectModulesByFilter = useCallback((filterFn, replace = false) => {
    const matchingModules = modules.filter(filterFn);
    const moduleIds = matchingModules.map(m => m._id);
    selectModules(moduleIds, replace);
  }, [modules, selectModules]);

  /**
   * Selection statistics and computed values
   */
  const selectionStats = useMemo(() => {
    const selectedCount = selectedModules.size;
    const totalCount = modules.length;
    const isAllSelected = selectedCount === totalCount && totalCount > 0;
    const isNoneSelected = selectedCount === 0;
    const isSomeSelected = selectedCount > 0 && selectedCount < totalCount;
    
    // Get selected modules grouped by phase
    const selectedByPhase = {};
    modules.forEach(module => {
      if (selectedModules.has(module._id)) {
        const phaseId = module.phaseId;
        if (!selectedByPhase[phaseId]) {
          selectedByPhase[phaseId] = [];
        }
        selectedByPhase[phaseId].push(module);
      }
    });

    return {
      selectedCount,
      totalCount,
      isAllSelected,
      isNoneSelected,
      isSomeSelected,
      selectedByPhase,
      selectionPercentage: totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0
    };
  }, [selectedModules, modules]);

  return {
    // Selection state
    selectedModules,
    
    // Basic selection actions
    handleSelectAll,
    handleToggleSelection,
    handleClearSelection,
    
    // Phase-level selection actions
    handlePhaseSelection,
    areAllPhaseModulesSelected,
    areSomePhaseModulesSelected,
    getPhaseSelectionCount,
    
    // Advanced selection actions
    selectModules,
    deselectModules,
    selectModulesByFilter,
    
    // Query functions
    isModuleSelected,
    getSelectedModules,
    getSelectedModuleIds,
    
    // Statistics
    selectionStats,
    
    // Direct state setter (for external control)
    setSelectedModules
  };
};

export default useModulesSelection;