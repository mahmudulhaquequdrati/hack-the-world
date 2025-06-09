import { DataService } from "@/lib/dataService";
import { useEffect, useState } from "react";

// Generic hook for data fetching with loading and error states
export function useAsyncData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchFunction();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = () => {
    setLoading(true);
    setError(null);
    fetchFunction()
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "An error occurred")
      )
      .finally(() => setLoading(false));
  };

  return { data, loading, error, refetch };
}

// Specific hooks for common data operations
export function usePhases() {
  return useAsyncData(() => DataService.getPhases());
}

export function usePhase(phaseId: string) {
  return useAsyncData(() => DataService.getPhaseById(phaseId), [phaseId]);
}

export function useModulesByPhase(phaseId: string) {
  return useAsyncData(() => DataService.getModulesByPhase(phaseId), [phaseId]);
}

export function useModule(moduleId: string) {
  return useAsyncData(() => DataService.getModuleById(moduleId), [moduleId]);
}

export function useCourse(courseId: string) {
  return useAsyncData(() => DataService.getCourseById(courseId), [courseId]);
}

export function useGamesByModule(moduleId: string) {
  return useAsyncData(() => DataService.getGamesByModule(moduleId), [moduleId]);
}

export function useLabsByModule(moduleId: string) {
  return useAsyncData(() => DataService.getLabsByModule(moduleId), [moduleId]);
}

export function useUserEnrollments() {
  return useAsyncData(() => DataService.getUserEnrollments());
}

export function useUserProgress() {
  return useAsyncData(() => DataService.getUserProgress());
}

// Hook for enrollment actions
export function useEnrollment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enroll = async (moduleId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await DataService.enrollInModule(moduleId);
      if (!result.success) {
        throw new Error(result.message || "Enrollment failed");
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Enrollment failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unenroll = async (moduleId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await DataService.unenrollFromModule(moduleId);
      if (!result.success) {
        throw new Error(result.message || "Unenrollment failed");
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unenrollment failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { enroll, unenroll, loading, error };
}

// Hook for progress tracking
export function useProgressTracking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = async (moduleId: string, progress: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await DataService.updateProgress(moduleId, progress);
      if (!result.success) {
        throw new Error("Progress update failed");
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Progress update failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProgress, loading, error };
}

// Hook to get data source information
export function useDataSource() {
  const [dataSource, setDataSource] = useState<string>("Loading...");

  useEffect(() => {
    const checkDataSource = async () => {
      // Wait a bit for DataService to initialize
      await new Promise((resolve) => setTimeout(resolve, 100));
      setDataSource(DataService.getDataSource());
    };

    checkDataSource();
  }, []);

  const refreshStatus = async () => {
    await DataService.refreshApiStatus();
    setDataSource(DataService.getDataSource());
  };

  return { dataSource, refreshStatus };
}
