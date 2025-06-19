import { useCallback, useEffect, useState } from "react";
import { contentAPI, modulesAPI, phasesAPI } from "../../../services/api";
import { handleApiError } from "../utils/moduleDetailUtils";

/**
 * Custom hook for ModuleDetailView API operations
 * Handles optimized data fetching with fallback strategies
 */
const useModuleDetailAPI = (moduleId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    module: null,
    phase: null,
    content: [],
    contentBySections: {},
    statistics: {
      totalContent: 0,
      totalDuration: 0,
    }
  });

  /**
   * Fetch module data with optimized API calls
   */
  const fetchModuleData = useCallback(async () => {
    if (!moduleId) {
      setError("Module ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log("🔄 useModuleDetailAPI: Starting optimized module fetch");

      // OPTIMIZED: Use comprehensive endpoints to reduce API calls from 3 to 2
      const [moduleWithPhaseRes, moduleOverviewRes] = await Promise.allSettled([
        modulesAPI.getByIdWithPhase(moduleId), // Module + Phase in one call
        contentAPI.getModuleOverview(moduleId), // Content + Statistics in one call
      ]);

      let moduleData = null;
      let phaseData = null;
      let contentList = [];
      let contentSections = {};
      let statsData = {
        totalContent: 0,
        totalDuration: 0,
      };

      // Handle module and phase data
      if (moduleWithPhaseRes.status === "fulfilled") {
        const moduleRes = moduleWithPhaseRes.value.data || moduleWithPhaseRes.value;
        moduleData = moduleRes;

        // Extract phase data if available
        if (moduleRes.phase) {
          phaseData = moduleRes.phase;
        } else if (moduleRes.phaseId) {
          // Fallback: fetch phase if not populated in the response
          try {
            const phaseResponse = await phasesAPI.getById(moduleRes.phaseId);
            phaseData = phaseResponse.data;
          } catch (phaseError) {
            console.warn("Could not fetch phase details:", phaseError);
          }
        }
      } else {
        // Fallback to individual calls if comprehensive endpoint fails
        console.warn(
          "Module with phase endpoint failed, falling back to individual calls"
        );
        const moduleResponse = await modulesAPI.getById(moduleId);
        moduleData = moduleResponse.data;

        if (moduleData.phaseId) {
          try {
            const phaseResponse = await phasesAPI.getById(moduleData.phaseId);
            phaseData = phaseResponse.data;
          } catch (phaseError) {
            console.warn("Could not fetch phase details:", phaseError);
          }
        }
      }

      // Handle content overview data
      if (moduleOverviewRes.status === "fulfilled") {
        const overviewData = moduleOverviewRes.value.data || moduleOverviewRes.value;

        if (overviewData.contentBySections) {
          // OPTIMIZED: Preserve section structure for proper display
          contentSections = overviewData.contentBySections;

          // Also create flat list for backwards compatibility
          Object.values(overviewData.contentBySections).forEach((section) => {
            if (Array.isArray(section)) {
              contentList.push(...section);
            }
          });
        } else if (overviewData.content) {
          contentList = overviewData.content;
          // Group content by sections if no section data available
          const grouped = contentList.reduce((acc, item) => {
            const section = item.section || "General";
            if (!acc[section]) acc[section] = [];
            acc[section].push(item);
            return acc;
          }, {});
          contentSections = grouped;
        } else {
          // FIXED: Handle API response where content is directly in data object by section keys
          // API returns: {"something": [...], "anotherSection": [...]}
          const sections = {};
          let hasContent = false;

          Object.entries(overviewData).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0 && value[0]._id) {
              // This looks like a content array
              sections[key] = value.map((item) => ({
                ...item,
                id: item._id || item.id, // Normalize id field
              }));
              contentList.push(...sections[key]);
              hasContent = true;
            }
          });

          if (hasContent) {
            contentSections = sections;
          }
        }

        // Use statistics from overview if available
        if (overviewData.statistics) {
          statsData = overviewData.statistics;
        } else {
          // Calculate statistics from content list
          statsData = calculateContentStatistics(contentList);
        }
      } else {
        // Fallback to individual content fetch
        console.warn(
          "Module overview endpoint failed, falling back to individual content fetch"
        );
        const contentResponse = await contentAPI.getByModule(moduleId);
        contentList = contentResponse.data || [];
        statsData = calculateContentStatistics(contentList);

        // Group content by sections for fallback
        const grouped = contentList.reduce((acc, item) => {
          const section = item.section || "General";
          if (!acc[section]) acc[section] = [];
          acc[section].push(item);
          return acc;
        }, {});
        contentSections = grouped;
      }

      // Update state with all data
      setData({
        module: moduleData,
        phase: phaseData,
        content: contentList,
        contentBySections: contentSections,
        statistics: statsData,
      });

    } catch (error) {
      console.error("Error fetching module data:", error);
      setError(handleApiError(error, "load module details"));
    } finally {
      setLoading(false);
      console.log("✅ useModuleDetailAPI: Module fetch completed");
    }
  }, [moduleId]);

  /**
   * Refetch data (useful for refresh operations)
   */
  const refetch = useCallback(() => {
    return fetchModuleData();
  }, [fetchModuleData]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError("");
  }, []);

  // Auto-fetch when moduleId changes
  useEffect(() => {
    if (moduleId) {
      fetchModuleData();
    }
  }, [fetchModuleData, moduleId]);

  return {
    loading,
    error,
    data,
    refetch,
    clearError,
  };
};

/**
 * Helper function to calculate content statistics
 * @param {Array} content - Content array
 * @returns {Object} Statistics
 */
const calculateContentStatistics = (content = []) => {
  const videoCount = content.filter(c => c.type === 'video').length;
  const labCount = content.filter(c => c.type === 'lab').length;
  const gameCount = content.filter(c => c.type === 'game').length;
  const documentCount = content.filter(c => c.type === 'document').length;
  
  const totalDuration = content.reduce((sum, c) => sum + (c.duration || 0), 0);
  const averageDuration = content.length > 0 
    ? Math.round((totalDuration / content.length) * 10) / 10
    : 0;

  return {
    totalContent: content.length,
    totalDuration,
    averageDuration,
    videoCount,
    labCount,
    gameCount,
    documentCount,
    contentByType: {
      video: videoCount,
      lab: labCount,
      game: gameCount,
      document: documentCount,
    }
  };
};

export default useModuleDetailAPI;