import { useMemo } from "react";
import useModuleDetailAPI from "./useModuleDetailAPI";
import useModuleDetailNavigation from "./useModuleDetailNavigation";
import useModuleDetailState from "./useModuleDetailState";

/**
 * Composite hook that combines all ModuleDetailView functionality
 * Provides a single interface for the ModuleDetailView component
 */
const useModuleDetailManager = (moduleId) => {
  // Core API hook for data fetching
  const apiHook = useModuleDetailAPI(moduleId);

  // State management hook for data processing
  const stateHook = useModuleDetailState(apiHook.data);

  // Navigation hook for routing and breadcrumbs
  const navigationHook = useModuleDetailNavigation(
    stateHook.module,
    stateHook.phase
  );

  /**
   * Loading state - true if API is loading or if we have invalid data
   */
  const isLoading = useMemo(() => {
    return apiHook.loading || (!apiHook.loading && !stateHook.isValid && !apiHook.error);
  }, [apiHook.loading, stateHook.isValid, apiHook.error]);

  /**
   * Error state with enhanced error information
   */
  const errorState = useMemo(() => {
    if (apiHook.error) {
      return {
        hasError: true,
        message: apiHook.error,
        type: 'api',
        canRetry: true
      };
    }

    if (!apiHook.loading && !stateHook.isValid) {
      const validationErrors = stateHook.validation.errors || [];
      return {
        hasError: true,
        message: validationErrors[0] || "Invalid module data",
        type: 'validation',
        canRetry: false,
        details: validationErrors
      };
    }

    return {
      hasError: false,
      message: null,
      type: null,
      canRetry: false
    };
  }, [apiHook.error, apiHook.loading, stateHook.isValid, stateHook.validation]);

  /**
   * Data availability checks
   */
  const dataState = useMemo(() => {
    const hasModule = Boolean(stateHook.module);
    const hasContent = Boolean(stateHook.content?.length > 0);
    const hasSections = Boolean(Object.keys(stateHook.processedSections).length > 0);

    return {
      hasModule,
      hasContent,
      hasSections,
      hasPhase: Boolean(stateHook.phase),
      isEmpty: !hasModule,
      isContentEmpty: hasModule && !hasContent,
    };
  }, [stateHook.module, stateHook.content, stateHook.processedSections, stateHook.phase]);

  /**
   * Action handlers that combine functionality from multiple hooks
   */
  const actions = useMemo(() => ({
    // API actions
    refetchData: apiHook.refetch,
    clearError: apiHook.clearError,

    // State actions
    ...stateHook.actions,

    // Navigation actions
    ...navigationHook.actions,

    // Combined actions
    handleContentClick: (content) => {
      // You can add analytics or other side effects here
      navigationHook.actions.goToContent(content.id);
    },

    handleRetry: () => {
      apiHook.clearError();
      apiHook.refetch();
    },

    handleBackNavigation: () => {
      if (stateHook.phase?.id) {
        navigationHook.actions.goToPhase();
      } else {
        navigationHook.actions.goToModules();
      }
    },
  }), [apiHook, stateHook.actions, navigationHook.actions, stateHook.phase]);

  /**
   * UI helpers for common operations
   */
  const uiHelpers = useMemo(() => ({
    getLoadingMessage: () => {
      if (apiHook.loading) {
        return "Loading module details...";
      }
      return "Processing module data...";
    },

    getErrorTitle: () => {
      switch (errorState.type) {
        case 'api':
          return "Failed to Load Module";
        case 'validation':
          return "Invalid Module Data";
        default:
          return "Module Error";
      }
    },

    getEmptyStateMessage: () => {
      if (dataState.isContentEmpty) {
        return "This module doesn't have any content yet.";
      }
      if (dataState.isEmpty) {
        return "Module not found.";
      }
      return "No data available.";
    },

    shouldShowContent: () => {
      return !isLoading && !errorState.hasError && dataState.hasModule;
    },

    shouldShowEmptyState: () => {
      return !isLoading && !errorState.hasError && dataState.isContentEmpty;
    },
  }), [errorState, dataState, isLoading]);

  /**
   * Performance metrics for debugging
   */
  const metrics = useMemo(() => ({
    apiCallsCompleted: !apiHook.loading,
    dataProcessingCompleted: stateHook.isValid,
    totalContentItems: stateHook.content?.length || 0,
    totalSections: Object.keys(stateHook.processedSections).length,
    validationErrors: stateHook.validation.errors?.length || 0,
    validationWarnings: stateHook.validation.warnings?.length || 0,
  }), [apiHook.loading, stateHook]);

  return {
    // Loading and error states
    isLoading,
    error: errorState,
    
    // Data state
    data: dataState,
    
    // Core data from state hook
    module: stateHook.module,
    phase: stateHook.phase,
    content: stateHook.content,
    statistics: stateHook.statistics,
    processedSections: stateHook.processedSections,
    
    // UI state
    selectedSection: stateHook.selectedSection,
    viewMode: stateHook.viewMode,
    displayOptions: stateHook.displayOptions,
    moduleStatus: stateHook.moduleStatus,
    
    // Navigation data
    breadcrumbs: navigationHook.breadcrumbs,
    quickActions: navigationHook.quickActions,
    
    // Actions
    actions,
    
    // UI helpers
    ui: uiHelpers,
    
    // Validation info
    validation: stateHook.validation,
    
    // Performance metrics (for debugging)
    metrics,
    
    // Direct access to individual hooks (for advanced usage)
    hooks: {
      api: apiHook,
      state: stateHook,
      navigation: navigationHook,
    }
  };
};

export default useModuleDetailManager;