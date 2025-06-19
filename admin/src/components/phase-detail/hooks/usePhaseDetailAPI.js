import { useCallback, useEffect, useState } from "react";
import { phasesAPI, modulesAPI } from "../../../services/api";
import { handleApiError } from "../utils/phaseDetailUtils";
import { 
  validatePhaseId,
  validateApiResponse 
} from "../utils/phaseDetailValidation";

/**
 * Custom hook for managing Phase Detail API calls
 * Optimized with Promise.allSettled for parallel data fetching
 */
const usePhaseDetailAPI = (phaseId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState(null);
  const [modules, setModules] = useState([]);

  /**
   * Fetch phase data using optimized parallel API calls
   */
  const fetchPhaseData = useCallback(async () => {
    if (!phaseId) {
      setError("Phase ID is required");
      setLoading(false);
      return;
    }

    // Validate phase ID
    const phaseIdValidation = validatePhaseId(phaseId);
    if (!phaseIdValidation.isValid) {
      setError(phaseIdValidation.error);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log("🔄 usePhaseDetailAPI: Starting optimized phase fetch");

      // OPTIMIZED: Use Promise.allSettled to reduce API calls from multiple sequential to 2 parallel
      const [phaseRes, modulesRes] = await Promise.allSettled([
        phasesAPI.getById(phaseId),                    // Phase details
        modulesAPI.getByPhase(phaseId)                 // Modules for this phase
      ]);

      // Handle phase data
      if (phaseRes.status === "fulfilled") {
        const phaseValidation = validateApiResponse(phaseRes.value, 'phase');
        if (phaseValidation.isValid) {
          setPhase(phaseValidation.data);
        } else {
          throw new Error(phaseValidation.error);
        }
      } else {
        throw new Error(handleApiError(phaseRes.reason, "fetch phase details"));
      }

      // Handle modules
      let modulesList = [];
      if (modulesRes.status === "fulfilled") {
        const modulesValidation = validateApiResponse(modulesRes.value, 'modules');
        if (modulesValidation.isValid) {
          modulesList = modulesValidation.data;
          setModules(modulesList);
          console.log(`📊 Loaded ${modulesList.length} modules for phase`);
        } else {
          console.warn("Modules validation failed:", modulesValidation.error);
          setModules([]);
        }
      } else {
        console.warn("Failed to fetch modules:", modulesRes.reason);
        setModules([]);
      }

    } catch (error) {
      const errorMessage = handleApiError(error, "load phase details");
      console.error("Error fetching phase data:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log("✅ usePhaseDetailAPI: Phase fetch completed");
    }
  }, [phaseId]);

  /**
   * Refresh phase data
   */
  const refreshData = useCallback(() => {
    fetchPhaseData();
  }, [fetchPhaseData]);

  /**
   * Reset state
   */
  const resetState = useCallback(() => {
    setPhase(null);
    setModules([]);
    setError("");
    setLoading(true);
  }, []);

  // Auto-fetch when phaseId changes
  useEffect(() => {
    if (phaseId) {
      fetchPhaseData();
    } else {
      resetState();
    }
  }, [phaseId, fetchPhaseData, resetState]);

  return {
    // Data
    phase,
    modules,
    
    // State
    loading,
    error,
    
    // Actions
    fetchPhaseData,
    refreshData,
    resetState,
    
    // Computed properties
    hasData: !!phase,
    hasModules: modules.length > 0,
    isEmpty: !loading && !error && !phase,
  };
};

export default usePhaseDetailAPI;