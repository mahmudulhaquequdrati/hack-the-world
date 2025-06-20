import { useCallback, useEffect, useState } from "react";
import { contentAPI, modulesAPI, phasesAPI } from "../../../services/api";
import { handleApiError } from "../utils/contentDetailUtils";

/**
 * Custom hook for ContentDetailView API operations
 * Handles optimized content fetching with module and phase data
 */
const useContentDetailAPI = (contentId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    content: null,
    module: null,
    phase: null,
    relatedContent: [],
  });

  /**
   * Fetch content data with optimized API calls
   */
  const fetchContentData = useCallback(async () => {
    if (!contentId) {
      setError("Content ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log("🔄 useContentDetailAPI: Starting optimized content fetch");

      // OPTIMIZED: Use admin-specific endpoint for content + module (no progress tracking)
      // This replaces the original 4 separate API calls with simple admin-focused data
      const [contentWithModuleRes] = await Promise.allSettled([
        contentAPI.getByIdWithModule(contentId), // Simple endpoint for admin details
      ]);

      let contentData = null;
      let moduleData = null;
      let phaseData = null;
      let relatedContentData = [];

      if (contentWithModuleRes.status === "fulfilled") {
        const response = contentWithModuleRes.value;

        contentData = response.data || response;

        // Extract module data from the response
        if (contentData.module) {
          moduleData = contentData.module;

          // Get phase info from module if available, or fetch it
          if (contentData.module.phase) {
            phaseData = contentData.module.phase;
          } else if (contentData.module.phaseId) {
            // Fetch phase if not populated in module
            try {
              const phaseResponse = await phasesAPI.getById(
                contentData.module.phaseId
              );
              phaseData = phaseResponse.data;
            } catch (phaseError) {
              console.warn("Could not fetch phase details:", phaseError);
            }
          }

          // For admin content details, we don't need to show related content
          // This eliminates one API call and focuses on the content itself
        }
      } else {
        // Fallback to basic content fetch if optimized endpoint fails
        console.warn(
          "Admin content endpoint failed, falling back to basic calls"
        );
        const contentResponse = await contentAPI.getById(contentId);
        contentData = contentResponse.data;

        // If content has module ID, fetch module and related content
        if (contentData.module?.id || contentData.moduleId) {
          const moduleId = contentData.module?.id || contentData.moduleId;

          try {
            // Fetch module details
            const moduleResponse = await modulesAPI.getById(moduleId);
            moduleData = moduleResponse.data;

            // Fetch phase if module has phaseId
            if (moduleData.phaseId) {
              try {
                const phaseResponse = await phasesAPI.getById(
                  moduleData.phaseId
                );
                phaseData = phaseResponse.data;
              } catch (phaseError) {
                console.warn("Could not fetch phase details:", phaseError);
              }
            }
          } catch (moduleError) {
            console.warn("Could not fetch module details:", moduleError);
          }
        }
      }

      // Update state with all data
      setData({
        content: contentData,
        module: moduleData,
        phase: phaseData,
        relatedContent: relatedContentData,
      });
    } catch (error) {
      console.error("Error fetching content data:", error);
      setError(handleApiError(error, "load content details"));
    } finally {
      setLoading(false);
      console.log("✅ useContentDetailAPI: Content fetch completed");
    }
  }, [contentId]);

  /**
   * Refetch data (useful for refresh operations)
   */
  const refetch = useCallback(() => {
    return fetchContentData();
  }, [fetchContentData]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError("");
  }, []);

  // Auto-fetch when contentId changes
  useEffect(() => {
    if (contentId) {
      fetchContentData();
    }
  }, [fetchContentData, contentId]);

  return {
    loading,
    error,
    data,
    refetch,
    clearError,
  };
};

export default useContentDetailAPI;
