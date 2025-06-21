import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  createModuleBreadcrumbs, 
  getModuleQuickActions 
} from "../utils/moduleDetailUtils";

/**
 * Custom hook for ModuleDetailView navigation logic
 * Handles routing, breadcrumbs, and quick actions
 */
const useModuleDetailNavigation = (module, phase) => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Navigation actions
   */
  const actions = {
    goBack: useCallback(() => {
      navigate("/modules");
    }, [navigate]),

    goToPhase: useCallback(() => {
      if (phase?._id) {
        navigate(`/phases/${phase._id}`);
      }
    }, [navigate, phase]),

    goToModules: useCallback(() => {
      navigate("/modules");
    }, [navigate]),

    goToContent: useCallback((contentId) => {
      if (contentId) {
        navigate(`/content/${contentId}`);
      }
    }, [navigate]),

    goToEditModule: useCallback(() => {
      if (module?._id) {
        navigate(`/modules/${module._id}/edit`);
      }
    }, [navigate, module]),

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
  };

  /**
   * Breadcrumb navigation data
   */
  const breadcrumbs = useMemo(() => {
    return createModuleBreadcrumbs(module, phase);
  }, [module, phase]);

  /**
   * Quick action configurations
   */
  const quickActions = useMemo(() => {
    if (!module?._id) return [];
    
    return getModuleQuickActions(module._id, phase?._id);
  }, [module?._id, phase?._id]);

  /**
   * Enhanced quick actions with handlers
   */
  const quickActionsWithHandlers = useMemo(() => {
    return quickActions.map(action => ({
      ...action,
      onClick: () => {
        switch (action.id) {
          case 'view-content':
            actions.goToModuleContent();
            break;
          case 'edit-module':
            actions.goToEditModule();
            break;
          case 'back-to-phase':
            actions.goToPhase();
            break;
          case 'back-to-modules':
            actions.goToModules();
            break;
          default:
            if (action.path) {
              navigate(action.path);
            }
        }
      }
    }));
  }, [quickActions, actions, navigate]);

  /**
   * Content navigation helpers
   */
  const contentNavigation = {
    /**
     * Get navigation items for content sections
     */
    getSectionNavigation: useCallback((sections) => {
      return Object.keys(sections).map(sectionName => ({
        id: sectionName,
        label: sectionName,
        count: sections[sectionName]?.items?.length || 0,
        onClick: () => {
          // Scroll to section or highlight it
          const element = document.getElementById(`section-${sectionName}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }));
    }, []),

    /**
     * Navigate to specific content item
     */
    goToContentItem: useCallback((contentId, options = {}) => {
      const { openInNewTab = false } = options;
      const url = `/content/${contentId}`;
      
      if (openInNewTab) {
        window.open(url, '_blank');
      } else {
        navigate(url);
      }
    }, [navigate]),

    /**
     * Navigate to content list with filters
     */
    goToContentWithFilters: useCallback((filters = {}) => {
      const params = new URLSearchParams();
      
      if (module?._id) {
        params.set('moduleId', module._id);
      }
      if (phase?._id) {
        params.set('phaseId', phase._id);
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      navigate(`/content?${params.toString()}`);
    }, [navigate, module, phase]),
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
  };

  /**
   * Navigation validation
   */
  const validation = {
    /**
     * Check if navigation to phase is possible
     */
    canNavigateToPhase: Boolean(phase?._id),

    /**
     * Check if editing module is possible
     */
    canEditModule: Boolean(module?._id),

    /**
     * Check if viewing content is possible
     */
    canViewContent: Boolean(module?._id),

    /**
     * Check if creating content is possible
     */
    canCreateContent: Boolean(module?._id || phase?._id),
  };

  return {
    // Navigation actions
    actions,
    
    // Navigation data
    breadcrumbs,
    quickActions: quickActionsWithHandlers,
    
    // Content navigation
    contentNavigation,
    
    // URL management
    urlState,
    
    // Validation
    validation,
    
    // Utility functions
    navigate, // Expose navigate for custom navigation
  };
};

export default useModuleDetailNavigation;