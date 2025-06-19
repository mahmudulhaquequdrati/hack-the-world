import { useMemo } from "react";
import { 
  formatPhaseData, 
  calculateStatistics, 
  formatModuleData,
  isPhaseDataValid 
} from "../utils/phaseDetailUtils";

/**
 * Custom hook for managing Phase Detail state transformations
 * Handles data formatting, statistics calculation, and derived state
 */
const usePhaseDetailState = (phase, modules, loading, error) => {
  
  /**
   * Formatted phase data with computed properties
   */
  const formattedPhase = useMemo(() => {
    return formatPhaseData(phase, modules);
  }, [phase, modules]);

  /**
   * Comprehensive statistics for the phase
   */
  const statistics = useMemo(() => {
    return calculateStatistics(modules);
  }, [modules]);

  /**
   * Formatted modules with computed properties
   */
  const formattedModules = useMemo(() => {
    return modules.map((module) => formatModuleData(module));
  }, [modules]);

  /**
   * Validation state
   */
  const validation = useMemo(() => ({
    isPhaseValid: isPhaseDataValid(phase),
    hasValidModules: Array.isArray(modules) && modules.length > 0,
    isDataComplete: !loading && !error && phase && modules,
  }), [phase, modules, loading, error]);

  /**
   * UI state flags
   */
  const uiState = useMemo(() => ({
    showLoadingState: loading && !phase,
    showErrorState: !!error && !loading,
    showEmptyState: !loading && !error && !phase,
    showPhaseNotFound: !loading && !error && phase === null,
    showContent: !loading && !error && validation.isPhaseValid,
    showModulesEmpty: !loading && !error && validation.isPhaseValid && modules.length === 0,
  }), [loading, error, phase, validation, modules.length]);

  /**
   * Content sections visibility
   */
  const contentSections = useMemo(() => ({
    showHeroSection: validation.isPhaseValid,
    showStatistics: validation.isPhaseValid,
    showModulesList: validation.isPhaseValid,
    showMetadata: validation.isPhaseValid,
    showQuickActions: validation.isPhaseValid,
  }), [validation.isPhaseValid]);

  /**
   * Data summary for debugging/logging
   */
  const dataSummary = useMemo(() => ({
    phaseId: phase?.id || null,
    phaseTitle: phase?.title || null,
    moduleCount: modules.length,
    totalHours: statistics.totalEstimatedHours,
    hasError: !!error,
    isLoading: loading,
  }), [phase, modules.length, statistics.totalEstimatedHours, error, loading]);

  return {
    // Formatted data
    formattedPhase,
    formattedModules,
    statistics,
    
    // Validation
    validation,
    
    // UI state
    uiState,
    contentSections,
    
    // Utility
    dataSummary,
    
    // Computed flags for easy access
    isValid: validation.isPhaseValid,
    hasModules: validation.hasValidModules,
    isComplete: validation.isDataComplete,
    isEmpty: uiState.showEmptyState,
    isLoading: loading,
    hasError: !!error,
  };
};

export default usePhaseDetailState;