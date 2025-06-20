import { useMemo } from "react";
import useContentDetailAPI from "./useContentDetailAPI";
import useContentDetailNavigation from "./useContentDetailNavigation";
import useContentDetailState from "./useContentDetailState";

/**
 * Composite hook that combines all ContentDetailView functionality
 * Provides a single interface for the ContentDetailView component
 */
const useContentDetailManager = (contentId) => {
  // Core API hook for data fetching
  const apiHook = useContentDetailAPI(contentId);

  // State management hook for data processing
  const stateHook = useContentDetailState(apiHook.data);

  // Navigation hook for routing and breadcrumbs
  const navigationHook = useContentDetailNavigation(
    stateHook.content,
    stateHook.module,
    stateHook.phase
  );

  /**
   * Loading state - true if API is loading or if we have invalid data
   */
  const isLoading = useMemo(() => {
    return (
      apiHook.loading ||
      (!apiHook.loading && !stateHook.isValid && !apiHook.error)
    );
  }, [apiHook.loading, stateHook.isValid, apiHook.error]);

  /**
   * Error state with enhanced error information
   */
  const errorState = useMemo(() => {
    if (apiHook.error) {
      return {
        hasError: true,
        message: apiHook.error,
        type: "api",
        canRetry: true,
      };
    }

    if (!apiHook.loading && !stateHook.isValid) {
      const validationErrors = stateHook.validation.errors || [];
      return {
        hasError: true,
        message: validationErrors[0] || "Invalid content data",
        type: "validation",
        canRetry: false,
        details: validationErrors,
      };
    }

    return {
      hasError: false,
      message: null,
      type: null,
      canRetry: false,
    };
  }, [apiHook.error, apiHook.loading, stateHook.isValid, stateHook.validation]);

  /**
   * Data availability checks
   */
  const dataState = useMemo(() => {
    const hasContent = Boolean(stateHook.content);
    const hasModule = Boolean(stateHook.module);
    const hasPhase = Boolean(stateHook.phase);
    const hasInstructions = Boolean(stateHook.content?.instructions);
    const hasResources = Boolean(stateHook.content?.resources?.length > 0);

    return {
      hasContent,
      hasModule,
      hasPhase,
      hasInstructions,
      hasResources,
      isEmpty: !hasContent,
      isContentComplete: Boolean(
        hasContent &&
          stateHook.content?.title &&
          stateHook.content?.description &&
          stateHook.content?.type
      ),
    };
  }, [stateHook.content, stateHook.module, stateHook.phase]);

  /**
   * Action handlers that combine functionality from multiple hooks
   */
  const actions = useMemo(
    () => ({
      // API actions
      refetchData: apiHook.refetch,
      clearError: apiHook.clearError,

      // State actions
      ...stateHook.actions,

      // Navigation actions
      ...navigationHook.actions,

      // Combined actions
      handleContentUrlClick: () => {
        if (stateHook.content?.url) {
          navigationHook.contentActions.handleContentUrl();
        }
      },

      handleRetry: () => {
        apiHook.clearError();
        apiHook.refetch();
      },

      handleBackNavigation: () => {
        if (stateHook.module?._id) {
          navigationHook.actions.goToModule();
        } else {
          navigationHook.actions.goToContent();
        }
      },

      handleEditContent: () => {
        if (stateHook.content?._id) {
          navigationHook.actions.goToEditContent();
        }
      },

      handleViewModule: () => {
        if (stateHook.module?._id) {
          navigationHook.actions.goToModule();
        }
      },

      handleViewPhase: () => {
        if (stateHook.phase?._id) {
          navigationHook.actions.goToPhase();
        }
      },
    }),
    [
      apiHook,
      stateHook.actions,
      navigationHook.actions,
      stateHook.content,
      stateHook.module,
      stateHook.phase,
      navigationHook.contentActions,
    ]
  );

  /**
   * UI helpers for common operations
   */
  const uiHelpers = useMemo(
    () => ({
      getLoadingMessage: () => {
        if (apiHook.loading) {
          return "Loading content details...";
        }
        return "Processing content data...";
      },

      getErrorTitle: () => {
        switch (errorState.type) {
          case "api":
            return "Failed to Load Content";
          case "validation":
            return "Invalid Content Data";
          default:
            return "Content Error";
        }
      },

      getEmptyStateMessage: () => {
        if (dataState.isEmpty) {
          return "Content not found.";
        }
        return "No data available.";
      },

      shouldShowContent: () => {
        return !isLoading && !errorState.hasError && dataState.hasContent;
      },

      shouldShowEmptyState: () => {
        return !isLoading && !errorState.hasError && dataState.isEmpty;
      },

      getContentActionLabel: () => {
        return navigationHook.contentActions.getContentActionLabel();
      },

      getContentActionIcon: () => {
        return navigationHook.contentActions.getContentActionIcon();
      },

      // Content type helpers
      getContentTypeColor: () => {
        if (!stateHook.content?.type)
          return "bg-gray-600/20 text-gray-400 border-gray-500/30";

        switch (stateHook.content.type) {
          case "video":
            return "bg-red-600/20 text-red-400 border-red-500/30";
          case "lab":
            return "bg-green-600/20 text-green-400 border-green-500/30";
          case "game":
            return "bg-purple-600/20 text-purple-400 border-purple-500/30";
          case "document":
            return "bg-blue-600/20 text-blue-400 border-blue-500/30";
          default:
            return "bg-gray-600/20 text-gray-400 border-gray-500/30";
        }
      },

      // Difficulty helpers (with capitalization fix)
      getDifficultyDisplay: () => {
        const difficulty =
          stateHook.module?.difficulty ||
          stateHook.content?.metadata?.difficulty;
        if (!difficulty) return null;

        // Capitalize difficulty properly
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
      },

      getDifficultyColor: () => {
        const difficulty = (
          stateHook.module?.difficulty ||
          stateHook.content?.metadata?.difficulty ||
          ""
        ).toLowerCase();

        switch (difficulty) {
          case "beginner":
            return "bg-green-600/20 text-green-400 border-green-500/30";
          case "intermediate":
            return "bg-yellow-600/20 text-yellow-400 border-yellow-500/30";
          case "advanced":
            return "bg-orange-600/20 text-orange-400 border-orange-500/30";
          case "expert":
            return "bg-red-600/20 text-red-400 border-red-500/30";
          default:
            return "bg-gray-600/20 text-gray-400 border-gray-500/30";
        }
      },
    }),
    [
      errorState,
      dataState,
      isLoading,
      apiHook.loading,
      navigationHook.contentActions,
      stateHook.content,
      stateHook.module,
    ]
  );

  /**
   * Performance metrics for debugging
   */
  const metrics = useMemo(
    () => ({
      apiCallsCompleted: !apiHook.loading,
      dataProcessingCompleted: stateHook.isValid,
      hasValidContent: Boolean(stateHook.content),
      hasValidModule: Boolean(stateHook.module),
      hasValidPhase: Boolean(stateHook.phase),
      validationErrors: stateHook.validation.errors?.length || 0,
      validationWarnings: stateHook.validation.warnings?.length || 0,
      contentSectionCount: stateHook.displaySections?.length || 0,
    }),
    [apiHook.loading, stateHook]
  );

  return {
    // Loading and error states
    isLoading,
    error: errorState,

    // Data state
    data: dataState,

    // Core data from state hook
    content: stateHook.content,
    module: stateHook.module,
    phase: stateHook.phase,
    relatedContent: stateHook.relatedContent,

    // Processed data
    processedResources: stateHook.processedResources,
    metadataBreakdown: stateHook.metadataBreakdown,
    displaySections: stateHook.displaySections,

    // UI state
    activeSection: stateHook.activeSection,
    contentStatus: stateHook.contentStatus,

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
    },
  };
};

export default useContentDetailManager;
