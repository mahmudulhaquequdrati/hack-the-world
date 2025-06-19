import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createBreadcrumbs, getQuickActions } from "../utils/phaseDetailUtils";

/**
 * Custom hook for managing Phase Detail navigation
 * Handles routing, breadcrumbs, and navigation actions
 */
const usePhaseDetailNavigation = (phaseId, phase) => {
  const navigate = useNavigate();

  /**
   * Navigation actions
   */
  const navigateBack = useCallback(() => {
    navigate("/phases");
  }, [navigate]);

  const navigateToPhases = useCallback(() => {
    navigate("/phases");
  }, [navigate]);

  const navigateToModules = useCallback(() => {
    navigate(`/modules?phaseId=${phaseId}`);
  }, [navigate, phaseId]);

  const navigateToContent = useCallback(() => {
    navigate(`/content?phaseId=${phaseId}`);
  }, [navigate, phaseId]);

  const navigateToModuleDetail = useCallback((moduleId) => {
    navigate(`/modules/${moduleId}`);
  }, [navigate]);

  const navigateToEditPhase = useCallback(() => {
    navigate("/phases"); // Since edit functionality is in phases list
  }, [navigate]);

  /**
   * Breadcrumb navigation data
   */
  const breadcrumbs = useMemo(() => {
    return createBreadcrumbs(phase);
  }, [phase]);

  /**
   * Quick actions configuration
   */
  const quickActions = useMemo(() => {
    if (!phaseId) return [];
    return getQuickActions(phaseId);
  }, [phaseId]);

  /**
   * Handle quick action clicks
   */
  const handleQuickAction = useCallback((actionId) => {
    switch (actionId) {
      case 'view-modules':
        navigateToModules();
        break;
      case 'view-content':
        navigateToContent();
        break;
      case 'back-to-phases':
        navigateToPhases();
        break;
      default:
        console.warn(`Unknown quick action: ${actionId}`);
    }
  }, [navigateToModules, navigateToContent, navigateToPhases]);

  /**
   * Navigation state and helpers
   */
  const navigationState = useMemo(() => ({
    canNavigateBack: true,
    canEdit: true,
    hasQuickActions: quickActions.length > 0,
    currentPath: window.location.pathname,
    isInPhaseDetail: window.location.pathname.includes('/phases/'),
  }), [quickActions.length]);

  /**
   * URL helpers
   */
  const urlHelpers = useMemo(() => ({
    getPhasesUrl: () => "/phases",
    getModulesUrl: () => `/modules?phaseId=${phaseId}`,
    getContentUrl: () => `/content?phaseId=${phaseId}`,
    getModuleDetailUrl: (moduleId) => `/modules/${moduleId}`,
    getEditPhaseUrl: () => "/phases",
  }), [phaseId]);

  /**
   * Handle browser navigation (back/forward)
   */
  const handleBrowserNavigation = useCallback((event) => {
    // Handle browser back/forward if needed
    console.log("Browser navigation:", event);
  }, []);

  return {
    // Navigation actions
    navigateBack,
    navigateToPhases,
    navigateToModules,
    navigateToContent,
    navigateToModuleDetail,
    navigateToEditPhase,
    
    // Quick actions
    quickActions,
    handleQuickAction,
    
    // Navigation data
    breadcrumbs,
    navigationState,
    urlHelpers,
    
    // Utility
    handleBrowserNavigation,
    
    // Convenience flags
    canNavigate: navigationState.canNavigateBack,
    hasActions: navigationState.hasQuickActions,
  };
};

export default usePhaseDetailNavigation;