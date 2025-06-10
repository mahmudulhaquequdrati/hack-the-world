import useProgressTracking from "@/hooks/useProgressTracking";
import { Lesson } from "@/lib/types";
import { useEffect, useRef } from "react";
import { ContentContainer } from "./ContentContainer";
import { LoadingContent } from "./LoadingContent";
import { NavigationControls } from "./NavigationControls";
import { TextContent } from "./TextContent";

interface FullScreenContentProps {
  lesson: Lesson;
  currentIndex: number;
  totalCount: number;
  isCompleted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMarkComplete: () => void;
  onOpenInNewTab?: () => void;
}

export const FullScreenContent = ({
  lesson,
  currentIndex,
  totalCount,
  isCompleted,
  onPrevious,
  onNext,
  onMarkComplete,
  onOpenInNewTab,
}: FullScreenContentProps) => {
  // Progress tracking
  const progressTracking = useProgressTracking();
  const contentStartedRef = useRef(false);

  // Get actual MongoDB content ID directly from lesson
  const contentId = lesson.contentId || "";

  // Auto-start content tracking when lesson loads
  useEffect(() => {
    if (contentId && !contentStartedRef.current) {
      contentStartedRef.current = true;
      progressTracking.startContent(contentId);
    }
  }, [contentId, progressTracking]);

  // Handle manual completion with progress tracking
  const handleMarkComplete = async () => {
    if (contentId) {
      await progressTracking.markAsComplete(contentId);
    }
    onMarkComplete();
  };

  const renderContent = () => {
    switch (lesson.type) {
      case "text":
        return (
          <TextContent
            content={lesson.content}
            description={lesson.description || "No description available"}
          />
        );
      case "lab":
        return (
          <LoadingContent
            title="Lab Environment Loading..."
            description={lesson.description || "Loading lab environment..."}
          />
        );
      case "game":
        return (
          <LoadingContent
            title="Game Loading..."
            description={lesson.description || "Loading game..."}
          />
        );
      default:
        return (
          <div className="text-center text-green-400 font-mono">
            Content type not supported yet.
          </div>
        );
    }
  };

  return (
    <ContentContainer
      title={lesson.title}
      contentType={lesson.type}
      onOpenInNewTab={
        (lesson.type === "lab" || lesson.type === "game") && onOpenInNewTab
          ? onOpenInNewTab
          : undefined
      }
    >
      {renderContent()}
      <NavigationControls
        currentIndex={currentIndex}
        totalCount={totalCount}
        isCompleted={isCompleted}
        onPrevious={onPrevious}
        onNext={onNext}
        onMarkComplete={handleMarkComplete}
        canGoBack={currentIndex > 0}
        canGoForward={currentIndex < totalCount - 1}
      />
    </ContentContainer>
  );
};
