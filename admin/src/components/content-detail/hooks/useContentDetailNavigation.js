import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

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
      if (module?._id) {
        navigate(`/modules/${module._id}`);
      }
    }, [navigate, module]),

    goToPhase: useCallback(() => {
      if (phase?._id) {
        navigate(`/phases/${phase._id}`);
      }
    }, [navigate, phase]),

    goToEditContent: useCallback(() => {
      if (content?._id) {
        navigate(`/content/${content._id}/edit`);
      }
    }, [navigate, content]),

    goToModuleContent: useCallback(() => {
      if (module?._id) {
        navigate(`/content?moduleId=${module._id}`);
      }
    }, [navigate, module]),

    goToPhaseContent: useCallback(() => {
      if (phase?._id) {
        navigate(`/content?phaseId=${phase._id}`);
      }
    }, [navigate, phase]),

    goToCreateContent: useCallback(() => {
      const params = new URLSearchParams();
      if (module?._id) {
        params.set('moduleId', module._id);
      }
      if (phase?._id) {
        params.set('phaseId', phase._id);
      }
      navigate(`/content/create?${params.toString()}`);
    }, [navigate, module, phase]),

    openContentUrl: useCallback((url, openInNewTab = true) => {
      if (!url) return;
      
      if (openInNewTab) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // For external URLs, use window.location is appropriate
        // For internal navigation, we should use navigate()
        if (url.startsWith('http') || url.startsWith('//')) {
          window.location.href = url;
        } else {
          navigate(url);
        }
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
    if (!content?._id) return [];
    
    return getContentQuickActions(content._id, module?._id, phase?._id);
  }, [content?._id, module?._id, phase?._id]);

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
      if (module?._id) {
        navigate(`/content?moduleId=${module._id}&exclude=${content?._id}`);
      }
    }, [navigate, module, content]),

    /**
     * Navigate to content in same phase
     */
    goToPhaseSiblings: useCallback(() => {
      if (phase?._id) {
        navigate(`/content?phaseId=${phase._id}&exclude=${content?._id}`);
      }
    }, [navigate, phase, content]),

    /**
     * Navigate to content by type
     */
    goToContentByType: useCallback((contentType) => {
      const params = new URLSearchParams();
      params.set('type', contentType);
      
      if (module?._id) {
        params.set('moduleId', module._id);
      }
      if (phase?._id) {
        params.set('phaseId', phase._id);
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
      const params = new URLSearchParams(location.search);
      params.set('tab', tabId);
      
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, [navigate, location]),
  };

  /**
   * URL state management
   */
  const urlState = {
    /**
     * Get current URL parameters
     */
    getUrlParams: useCallback(() => {
      const searchParams = new URLSearchParams(location.search);
      return Object.fromEntries(searchParams.entries());
    }, [location.search]),

    /**
     * Update URL parameters without navigation
     */
    updateUrlParams: useCallback((params) => {
      const searchParams = new URLSearchParams(location.search);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          searchParams.set(key, value);
        } else {
          searchParams.delete(key);
        }
      });

      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }, [navigate, location]),

    /**
     * Get current active tab from URL
     */
    getActiveTab: useCallback(() => {
      const searchParams = new URLSearchParams(location.search);
      return searchParams.get('tab') || 'overview';
    }, [location.search]),
  };

  /**
   * Navigation validation
   */
  const validation = {
    /**
     * Check if navigation to module is possible
     */
    canNavigateToModule: Boolean(module?._id),

    /**
     * Check if navigation to phase is possible
     */
    canNavigateToPhase: Boolean(phase?._id),

    /**
     * Check if editing content is possible
     */
    canEditContent: Boolean(content?._id),

    /**
     * Check if viewing content URL is possible
     */
    canViewContentUrl: Boolean(content?.url),

    /**
     * Check if creating related content is possible
     */
    canCreateRelatedContent: Boolean(module?._id || phase?._id),

    /**
     * Check if content belongs to a module
     */
    hasModule: Boolean(module?._id),

    /**
     * Check if content belongs to a phase
     */
    hasPhase: Boolean(phase?._id),
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