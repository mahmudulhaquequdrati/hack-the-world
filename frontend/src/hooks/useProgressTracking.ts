import { useCompleteContentMutation } from "@/features/api/apiSlice";
import { useCallback, useRef } from "react";

// T037: Simplified for 2-API system - only keep essential types and functions
export interface ContentProgressStatus {
  contentId: string;
  status: "not-started" | "in-progress" | "completed";
  progressPercentage: number;
  alreadyStarted?: boolean;
  startedAt?: string;
  completedAt?: string | null;
  score?: number | null;
  maxScore?: number | null;
}

interface ProgressValidationResult {
  shouldStart: boolean;
  existingProgress: ContentProgressStatus | null;
  reason: string;
}

export const useProgressTracking = () => {
  const [completeContent] = useCompleteContentMutation();

  const completionNotifiedRef = useRef(new Set<string>());

  // Simple cache for basic progress validation (optional)
  const progressValidationCache = useRef(
    new Map<string, ContentProgressStatus>()
  );

  // Cache invalidation callbacks for components to listen to changes
  const cacheInvalidationCallbacks = useRef(new Set<() => void>());

  // Register callback for cache invalidation events
  const onCacheInvalidation = useCallback((callback: () => void) => {
    cacheInvalidationCallbacks.current.add(callback);

    // Return cleanup function
    return () => {
      cacheInvalidationCallbacks.current.delete(callback);
    };
  }, []);

  // Notify all listening components about cache invalidation
  const notifyCacheInvalidation = useCallback(() => {
    cacheInvalidationCallbacks.current.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Cache invalidation callback error:", error);
      }
    });
  }, []);

  // Enhanced cache invalidation with notification
  const invalidateProgressCache = useCallback(
    (contentId?: string) => {
      if (contentId) {
        progressValidationCache.current.delete(contentId);
        console.log(`Cache invalidated for content: ${contentId}`);
      } else {
        progressValidationCache.current.clear();
        console.log("All progress cache cleared");
      }

      // Notify all listening components
      notifyCacheInvalidation();
    },
    [notifyCacheInvalidation]
  );

  // T037: Simplified progress completion handler
  const handleCompleteContent = useCallback(
    async (contentId: string, score?: number, maxScore?: number) => {
      try {
        const result = await completeContent({
          contentId,
          ...(score !== undefined && { score }),
          ...(maxScore !== undefined && { maxScore }),
        }).unwrap();

        // Update cache with completion status
        const completedProgress: ContentProgressStatus = {
          contentId,
          status: "completed",
          progressPercentage: 100,
          alreadyStarted: true,
          completedAt: new Date().toISOString(),
        };

        progressValidationCache.current.set(contentId, completedProgress);
        completionNotifiedRef.current.add(contentId);

        // Notify components of progress update
        notifyCacheInvalidation();

        return result;
      } catch (error) {
        console.error("Failed to complete content:", error);
        throw error;
      }
    },
    [completeContent, notifyCacheInvalidation]
  );

  // Legacy compatibility - mark lesson completion (simplified)
  const markLessonComplete = useCallback(
    async (lessonId: string) => {
      return handleCompleteContent(lessonId);
    },
    [handleCompleteContent]
  );

  // Legacy compatibility - no-op functions for components that still expect them
  const handleStartContent = useCallback(async (contentId: string) => {
    console.warn(
      "handleStartContent is deprecated - use getContentWithModuleAndProgress API instead"
    );
    return null;
  }, []);

  const checkContentProgress = useCallback(
    async (contentId: string): Promise<ProgressValidationResult> => {
      console.warn(
        "checkContentProgress is deprecated - use getContentWithModuleAndProgress API instead"
      );
      return {
        shouldStart: false,
        existingProgress: null,
        reason: "Function deprecated - use 2-API system instead",
      };
    },
    []
  );

  return {
    // Core functionality for 2-API system
    handleCompleteContent,
    invalidateProgressCache,
    onCacheInvalidation,

    // Legacy compatibility (deprecated but maintained for existing components)
    markLessonComplete,
    handleStartContent, // No-op
    checkContentProgress, // No-op

    // Cache management
    progressCache: progressValidationCache.current,
    completionNotified: completionNotifiedRef.current,
  };
};

export default useProgressTracking;
