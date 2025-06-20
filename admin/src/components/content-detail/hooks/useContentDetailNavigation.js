import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  createContentBreadcrumbs, 
  getContentQuickActions 
} from "../utils/contentDetailUtils";

/**
 * Custom hook for ContentDetailView navigation logic
 * Handles routing, breadcrumbs, and quick actions
 */
const useContentDetailNavigation = (content, module, phase) => {
  const navigate = useNavigate();

  /**
   * Navigation actions
   */
  const actions = {
    goBack: useCallback(() => {
      navigate("/content");
    }, [navigate]),

    goToContent: useCallback(() => {
      navigate("/content");
    }, [navigate]),

    goToModule: useCallback(() => {
      if (module?.id) {
        navigate(`/modules/${module.id}`);
      }
    }, [navigate, module]),

    goToPhase: useCallback(() => {
      if (phase?.id) {
        navigate(`/phases/${phase.id}`);
      }
    }, [navigate, phase]),

    goToEditContent: useCallback(() => {
      if (content?.id) {
        navigate(`/content/${content.id}/edit`);
      }
    }, [navigate, content]),

    goToModuleContent: useCallback(() => {
      if (module?.id) {
        navigate(`/content?moduleId=${module.id}`);
      }
    }, [navigate, module]),

    goToPhaseContent: useCallback(() => {
      if (phase?.id) {
        navigate(`/content?phaseId=${phase.id}`);
      }
    }, [navigate, phase]),

    goToCreateContent: useCallback(() => {
      const params = new URLSearchParams();
      if (module?.id) {
        params.set('moduleId', module.id);
      }
      if (phase?.id) {
        params.set('phaseId', phase.id);
      }
      navigate(`/content/create?${params.toString()}`);
    }, [navigate, module, phase]),

    openContentUrl: useCallback((url, openInNewTab = true) => {
      if (!url) return;
      
      if (openInNewTab) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = url;
      }
    }, []),
  };

  /**
   * Breadcrumb navigation data
   */
  const breadcrumbs = useMemo(() => {
    return createContentBreadcrumbs(content, module);
  }, [content, module]);

  /**
   * Quick action configurations
   */
  const quickActions = useMemo(() => {
    if (!content?.id) return [];
    
    return getContentQuickActions(content.id, module?.id, phase?.id);
  }, [content?.id, module?.id, phase?.id]);

  /**
   * Enhanced quick actions with handlers
   */
  const quickActionsWithHandlers = useMemo(() => {
    return quickActions.map(action => ({
      ...action,
      onClick: () => {
        switch (action.id) {
          case 'edit-content':
            actions.goToEditContent();
            break;
          case 'view-module':
            actions.goToModule();
            break;
          case 'view-phase':
            actions.goToPhase();
            break;
          case 'back-to-content':
            actions.goToContent();
            break;
          case 'open-content':
            actions.openContentUrl(content?.url);
            break;
          default:
            if (action.path) {
              navigate(action.path);
            }
        }
      }
    }));
  }, [quickActions, actions, navigate, content]);

  /**
   * Related content navigation helpers
   */
  const relatedNavigation = {
    /**
     * Navigate to related content item
     */
    goToRelatedContent: useCallback((contentId, options = {}) => {
      const { openInNewTab = false } = options;
      const url = `/content/${contentId}`;
      
      if (openInNewTab) {
        window.open(url, '_blank');
      } else {
        navigate(url);
      }
    }, [navigate]),

    /**
     * Navigate to content in same module
     */
    goToModuleSiblings: useCallback(() => {
      if (module?.id) {
        navigate(`/content?moduleId=${module.id}&exclude=${content?.id}`);
      }
    }, [navigate, module, content]),

    /**
     * Navigate to content in same phase
     */
    goToPhaseSiblings: useCallback(() => {
      if (phase?.id) {
        navigate(`/content?phaseId=${phase.id}&exclude=${content?.id}`);
      }
    }, [navigate, phase, content]),

    /**
     * Navigate to content by type
     */
    goToContentByType: useCallback((contentType) => {
      const params = new URLSearchParams();
      params.set('type', contentType);
      
      if (module?.id) {
        params.set('moduleId', module.id);
      }
      if (phase?.id) {
        params.set('phaseId', phase.id);
      }
      
      navigate(`/content?${params.toString()}`);
    }, [navigate, module, phase]),
  };

  /**
   * Section navigation for content areas
   */
  const sectionNavigation = {
    /**
     * Scroll to content section
     */
    scrollToSection: useCallback((sectionId) => {
      const element = document.getElementById(`content-section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, []),

    /**
     * Navigate to specific content tab
     */
    goToContentTab: useCallback((tabId) => {
      const params = new URLSearchParams(window.location.search);
      params.set('tab', tabId);
      
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    }, []),
  };

  /**
   * URL state management
   */
  const urlState = {
    /**
     * Get current URL parameters
     */
    getUrlParams: useCallback(() => {
      const searchParams = new URLSearchParams(window.location.search);
      return Object.fromEntries(searchParams.entries());
    }, []),

    /**
     * Update URL parameters without navigation
     */
    updateUrlParams: useCallback((params) => {
      const searchParams = new URLSearchParams(window.location.search);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          searchParams.set(key, value);
        } else {
          searchParams.delete(key);
        }
      });

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, '', newUrl);
    }, []),

    /**
     * Get current active tab from URL
     */
    getActiveTab: useCallback(() => {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('tab') || 'overview';
    }, []),
  };

  /**
   * Navigation validation
   */
  const validation = {
    /**
     * Check if navigation to module is possible
     */
    canNavigateToModule: Boolean(module?.id),

    /**
     * Check if navigation to phase is possible
     */
    canNavigateToPhase: Boolean(phase?.id),

    /**
     * Check if editing content is possible
     */
    canEditContent: Boolean(content?.id),

    /**
     * Check if viewing content URL is possible
     */
    canViewContentUrl: Boolean(content?.url),

    /**
     * Check if creating related content is possible
     */
    canCreateRelatedContent: Boolean(module?.id || phase?.id),

    /**
     * Check if content belongs to a module
     */
    hasModule: Boolean(module?.id),

    /**
     * Check if content belongs to a phase
     */
    hasPhase: Boolean(phase?.id),
  };

  /**
   * Content action helpers
   */
  const contentActions = {
    /**
     * Handle content URL opening with proper validation
     */
    handleContentUrl: useCallback(() => {
      if (content?.url) {
        actions.openContentUrl(content.url, true);
      }
    }, [actions, content]),

    /**
     * Get content action label based on type
     */
    getContentActionLabel: useCallback(() => {
      if (!content?.type) return "View Content";
      
      switch (content.type) {
        case "video":
          return "Watch Video";
        case "lab":
          return "Start Lab";
        case "game":
          return "Play Game";
        case "document":
          return "View Document";
        default:
          return "View Content";
      }
    }, [content]),

    /**
     * Get content action icon based on type
     */
    getContentActionIcon: useCallback(() => {
      if (!content?.type) return "PlayIcon";
      
      switch (content.type) {
        case "video":
          return "PlayIcon";
        case "lab":
          return "BeakerIcon";
        case "game":
          return "PuzzlePieceIcon";
        case "document":
          return "DocumentIcon";
        default:
          return "PlayIcon";
      }
    }, [content]),
  };

  return {
    // Navigation actions
    actions,
    
    // Navigation data
    breadcrumbs,
    quickActions: quickActionsWithHandlers,
    
    // Specialized navigation
    relatedNavigation,
    sectionNavigation,
    
    // URL management
    urlState,
    
    // Validation
    validation,
    
    // Content actions
    contentActions,
    
    // Utility functions
    navigate, // Expose navigate for custom navigation
  };
};

export default useContentDetailNavigation;