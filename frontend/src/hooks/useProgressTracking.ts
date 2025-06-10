import {
  useCompleteContentMutation,
  useStartContentMutation,
  useUpdateContentProgressMutation,
} from "@/features/api/apiSlice";
import ProgressService from "@/lib/progressService";
import { useCallback, useRef } from "react";

export const useProgressTracking = () => {
  const [startContent] = useStartContentMutation();
  const [completeContent] = useCompleteContentMutation();
  const [updateContentProgress] = useUpdateContentProgressMutation();

  const completionNotifiedRef = useRef(new Set<string>());

  // Start content tracking when content is first accessed
  const handleStartContent = useCallback(
    async (contentId: string) => {
      try {
        const result = await startContent({ contentId }).unwrap();
        console.log("Content started:", result.data);
        return result.data;
      } catch (error) {
        console.error("Failed to start content:", error);
        return null;
      }
    },
    [startContent]
  );

  // Complete content manually or with score
  const handleCompleteContent = useCallback(
    async (contentId: string, score?: number, maxScore?: number) => {
      try {
        const result = await completeContent({
          contentId,
          ...(score !== undefined && { score }),
          ...(maxScore !== undefined && { maxScore }),
        }).unwrap();
        console.log("Content completed:", result.data);
        return result.data;
      } catch (error) {
        console.error("Failed to complete content:", error);
        return null;
      }
    },
    [completeContent]
  );

  // Update content progress percentage
  const handleUpdateProgress = useCallback(
    async (contentId: string, progressPercentage: number) => {
      // Use service to check if we should update
      if (
        !ProgressService.shouldUpdateProgress(contentId, progressPercentage)
      ) {
        return null;
      }

      try {
        const result = await updateContentProgress({
          contentId,
          progressPercentage,
        }).unwrap();

        // Mark that we reported this progress
        ProgressService.markProgressReported(contentId, progressPercentage);
        console.log("Content progress updated:", result.data);
        return result.data;
      } catch (error) {
        console.error("Failed to update content progress:", error);
        return null;
      }
    },
    [updateContentProgress]
  );

  // Video-specific progress tracking
  const handleVideoProgress = useCallback(
    async (contentId: string, currentTime: number, duration: number) => {
      const progressPercentage = ProgressService.calculateVideoProgress(
        currentTime,
        duration
      );

      // Check if we should report this progress (every 10%)
      if (
        ProgressService.shouldReportVideoProgress(progressPercentage, contentId)
      ) {
        const result = await handleUpdateProgress(
          contentId,
          progressPercentage
        );

        // Check for auto-completion at 90%
        if (
          result &&
          result.status === "completed" &&
          !completionNotifiedRef.current.has(contentId)
        ) {
          completionNotifiedRef.current.add(contentId);
          return { ...result, autoCompleted: true };
        }

        return result;
      }

      return null;
    },
    [handleUpdateProgress]
  );

  // Handle lab/game completion with scores
  const handleLabGameCompletion = useCallback(
    async (contentId: string, score: number, maxScore: number) => {
      return await handleCompleteContent(contentId, score, maxScore);
    },
    [handleCompleteContent]
  );

  // Handle manual mark as complete
  const handleMarkAsComplete = useCallback(
    async (contentId: string) => {
      return await handleCompleteContent(contentId);
    },
    [handleCompleteContent]
  );

  return {
    startContent: handleStartContent,
    completeContent: handleCompleteContent,
    updateProgress: handleUpdateProgress,
    trackVideoProgress: handleVideoProgress,
    completeLabGame: handleLabGameCompletion,
    markAsComplete: handleMarkAsComplete,
  };
};

export default useProgressTracking;
