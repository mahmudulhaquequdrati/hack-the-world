import { useState, useCallback } from 'react';
import { contentAPI, modulesAPI, phasesAPI } from '../../../services/api';
import { handleApiError } from '../utils/contentUtils';

/**
 * Custom hook for managing content view modes and data transformations
 */
export const useContentViewMode = () => {
  // View mode state
  const [viewMode, setViewMode] = useState("hierarchical");
  const [groupedContent, setGroupedContent] = useState({});
  const [selectedPhaseId, setSelectedPhaseId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [hierarchicalData, setHierarchicalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle view mode change
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    switch (mode) {
      case "hierarchical":
        fetchHierarchicalData();
        break;
      case "groupedByModule":
        fetchAllModulesGrouped();
        break;
      case "groupedByType":
        fetchAllContentGroupedByType();
        break;
    }
  }, []);

  // Fetch hierarchical data (Phases -> Modules -> Content)
  const fetchHierarchicalData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const [phasesResponse, modulesResponse, contentResponse] =
        await Promise.all([
          phasesAPI.getAll(),
          modulesAPI.getAll(),
          contentAPI.getAll(),
        ]);

      const phasesData = phasesResponse.data || [];
      const modulesData = modulesResponse.data || [];
      const contentData = contentResponse.data || [];

      const hierarchical = phasesData.map((phase) => {
        const phaseModules = modulesData.filter(
          (module) => module.phaseId === phase.id
        );
        const modulesWithContent = phaseModules.map((module) => {
          const moduleContent = contentData.filter(
            (content) => content.moduleId === module.id
          );
          return {
            ...module,
            content: moduleContent,
            contentCount: moduleContent.length,
          };
        });

        return {
          ...phase,
          modules: modulesWithContent,
        };
      });

      setHierarchicalData(hierarchical);
      return hierarchical;
    } catch (err) {
      console.error("Error fetching hierarchical data:", err);
      const errorMessage = handleApiError(err, 'fetch hierarchical data');
      setError(errorMessage);
      setHierarchicalData([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch content grouped by modules
  const fetchAllModulesGrouped = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const [modulesResponse, contentResponse] = await Promise.all([
        modulesAPI.getAll(),
        contentAPI.getAll(),
      ]);

      const modulesData = modulesResponse.data || [];
      const contentData = contentResponse.data || [];

      const grouped = {};
      modulesData.forEach((module) => {
        const moduleContent = contentData.filter(
          (content) => content.moduleId === module.id
        );
        if (moduleContent.length > 0) {
          grouped[module.title] = moduleContent;
        }
      });

      setGroupedContent(grouped);
      return grouped;
    } catch (err) {
      console.error("Error fetching grouped content:", err);
      const errorMessage = handleApiError(err, 'fetch grouped content');
      setError(errorMessage);
      setGroupedContent({});
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch content grouped by type
  const fetchAllContentGroupedByType = useCallback(async (contentTypes) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await contentAPI.getAll();
      const contentData = response.data || [];

      const grouped = {};
      contentTypes.forEach((type) => {
        const typeContent = contentData.filter(
          (content) => content.type === type.value
        );
        if (typeContent.length > 0) {
          grouped[type.label] = typeContent;
        }
      });

      setGroupedContent(grouped);
      return grouped;
    } catch (err) {
      console.error("Error fetching content grouped by type:", err);
      const errorMessage = handleApiError(err, 'fetch content grouped by type');
      setError(errorMessage);
      setGroupedContent({});
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh current view data
  const refreshCurrentView = useCallback((contentTypes = []) => {
    switch (viewMode) {
      case "hierarchical":
        return fetchHierarchicalData();
      case "groupedByModule":
        return fetchAllModulesGrouped();
      case "groupedByType":
        return fetchAllContentGroupedByType(contentTypes);
      default:
        return Promise.resolve();
    }
  }, [viewMode, fetchHierarchicalData, fetchAllModulesGrouped, fetchAllContentGroupedByType]);

  // Get current view data
  const getCurrentViewData = useCallback(() => {
    switch (viewMode) {
      case "hierarchical":
        return { type: 'hierarchical', data: hierarchicalData };
      case "groupedByModule":
      case "groupedByType":
        return { type: 'grouped', data: groupedContent };
      default:
        return { type: 'unknown', data: null };
    }
  }, [viewMode, hierarchicalData, groupedContent]);

  // Check if current view has data
  const hasData = useCallback(() => {
    switch (viewMode) {
      case "hierarchical":
        return hierarchicalData.length > 0;
      case "groupedByModule":
      case "groupedByType":
        return Object.keys(groupedContent).length > 0;
      default:
        return false;
    }
  }, [viewMode, hierarchicalData, groupedContent]);

  // Reset expansion states
  const resetExpansionStates = useCallback(() => {
    setSelectedPhaseId("");
    setSelectedModuleId("");
  }, []);

  // Toggle phase expansion
  const togglePhase = useCallback((phaseId) => {
    setSelectedPhaseId(prev => prev === phaseId ? "" : phaseId);
  }, []);

  // Toggle module expansion
  const toggleModule = useCallback((moduleId) => {
    setSelectedModuleId(prev => prev === moduleId ? "" : moduleId);
  }, []);

  // Get view mode label
  const getViewModeLabel = useCallback(() => {
    switch (viewMode) {
      case "hierarchical":
        return "Hierarchical View";
      case "groupedByModule":
        return "Grouped by Module";
      case "groupedByType":
        return "Grouped by Type";
      default:
        return "Unknown View";
    }
  }, [viewMode]);

  // Check if view is hierarchical
  const isHierarchicalView = useCallback(() => {
    return viewMode === "hierarchical";
  }, [viewMode]);

  // Check if view is grouped
  const isGroupedView = useCallback(() => {
    return viewMode === "groupedByModule" || viewMode === "groupedByType";
  }, [viewMode]);

  return {
    // State
    viewMode,
    groupedContent,
    selectedPhaseId,
    selectedModuleId,
    hierarchicalData,
    loading,
    error,

    // Actions
    setViewMode,
    setGroupedContent,
    setSelectedPhaseId,
    setSelectedModuleId,
    setHierarchicalData,
    handleViewModeChange,
    fetchHierarchicalData,
    fetchAllModulesGrouped,
    fetchAllContentGroupedByType,
    refreshCurrentView,
    resetExpansionStates,
    togglePhase,
    toggleModule,

    // Computed values
    getCurrentViewData,
    hasData,
    getViewModeLabel,
    isHierarchicalView,
    isGroupedView,
  };
};