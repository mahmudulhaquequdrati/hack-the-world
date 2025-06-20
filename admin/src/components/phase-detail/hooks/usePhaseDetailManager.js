import { useMemo } from "react";
import usePhaseDetailAPI from "./usePhaseDetailAPI";
import usePhaseDetailState from "./usePhaseDetailState";
import usePhaseDetailNavigation from "./usePhaseDetailNavigation";

/**
 * Composite hook that combines all Phase Detail functionality
 * Provides a single interface for all phase detail operations
 */
const usePhaseDetailManager = (phaseId) => {
  
  // Core API management
  const apiManager = usePhaseDetailAPI(phaseId);
  const {
    phase,
    modules,
    loading,
    error,
    fetchPhaseData,
    refreshData,
    resetState,
    hasData,
    hasModules,
    isEmpty
  } = apiManager;

  // State transformations and computed values
  const stateManager = usePhaseDetailState(phase, modules, loading, error);
  const {
    formattedPhase,
    formattedModules,
    statistics,
    validation,
    uiState,
    contentSections,
    dataSummary,
    isComplete
  } = stateManager;

  // Navigation and routing
  const navigationManager = usePhaseDetailNavigation(phaseId, formattedPhase);
  const {
    navigateBack,
    navigateToModuleDetail,
    navigateToEditPhase,
    quickActions,
    handleQuickAction,
    breadcrumbs,
    navigationState,
    urlHelpers
  } = navigationManager;

  /**
   * Composite actions that use multiple managers
   */
  const compositeActions = useMemo(() => ({
    
    /**
     * Refresh all data and reset any error states
     */
    refreshAll: () => {
      refreshData();
    },

    /**
     * Handle module selection with navigation
     */
    handleModuleSelect: (module) => {
      console.log("Selected module:", module.title);
      navigateToModuleDetail(module._id);
    },

    /**
     * Handle error retry
     */
    retryLoad: () => {
      fetchPhaseData();
    },

    /**
     * Reset everything to initial state
     */
    resetAll: () => {
      resetState();
    },

  }), [refreshData, navigateToModuleDetail, fetchPhaseData, resetState]);

  /**
   * Combined status for easy component consumption
   */
  const status = useMemo(() => ({
    isLoading: loading,
    hasError: !!error,
    isEmpty: isEmpty,
    isReady: isComplete && !loading && !error,
    hasContent: hasData && !loading,
    canShowContent: uiState.showContent,
    error: error
  }), [loading, error, isEmpty, isComplete, hasData, uiState.showContent]);

  /**
   * All data needed for UI rendering
   */
  const uiData = useMemo(() => ({
    phase: formattedPhase,
    modules: formattedModules,
    statistics,
    breadcrumbs,
    quickActions,
    contentSections,
    validation
  }), [formattedPhase, formattedModules, statistics, breadcrumbs, quickActions, contentSections, validation]);

  /**
   * All handlers for UI interactions
   */
  const handlers = useMemo(() => ({
    onNavigateBack: navigateBack,
    onModuleClick: compositeActions.handleModuleSelect,
    onQuickAction: handleQuickAction,
    onRefresh: compositeActions.refreshAll,
    onRetry: compositeActions.retryLoad,
    onReset: compositeActions.resetAll,
    onEditPhase: navigateToEditPhase,
  }), [
    navigateBack,
    compositeActions.handleModuleSelect,
    handleQuickAction,
    compositeActions.refreshAll,
    compositeActions.retryLoad,
    compositeActions.resetAll,
    navigateToEditPhase
  ]);

  /**
   * Development and debugging information
   */
  const debug = useMemo(() => ({
    phaseId,
    dataSummary,
    apiState: {
      loading,
      error,
      hasData,
      hasModules,
      isEmpty
    },
    uiState,
    navigationState,
    managers: {
      api: !!apiManager,
      state: !!stateManager,
      navigation: !!navigationManager
    }
  }), [
    phaseId,
    dataSummary,
    loading,
    error,
    hasData,
    hasModules,
    isEmpty,
    uiState,
    navigationState,
    apiManager,
    stateManager,
    navigationManager
  ]);

  return {
    // Status
    status,
    
    // UI Data
    uiData,
    
    // Handlers
    handlers,
    
    // Utilities
    urlHelpers,
    
    // Individual managers (if needed for advanced use)
    managers: {
      api: apiManager,
      state: stateManager,
      navigation: navigationManager
    },
    
    // Development
    debug,
    
    // Convenience exports for common patterns
    isLoading: status.isLoading,
    hasError: status.hasError,
    isReady: status.isReady,
    phase: uiData.phase,
    modules: uiData.modules,
    statistics: uiData.statistics,
  };
};

export default usePhaseDetailManager;