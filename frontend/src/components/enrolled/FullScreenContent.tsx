import useProgressTracking from "@/hooks/useProgressTracking";
import { Lesson } from "@/lib/types";
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
  // T013: Enhanced navigation props with server-side validation
  canGoBack?: boolean;
  canGoForward?: boolean;
  // T022: Loading states for navigation buttons
  isNavigatingNext?: boolean;
  isNavigatingPrev?: boolean;
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
  // T013: Enhanced navigation props with server-side validation
  canGoBack,
  canGoForward,
  // T022: Loading states for navigation buttons
  isNavigatingNext,
  isNavigatingPrev,
}: FullScreenContentProps) => {
  // Progress tracking (simplified for 2-API system)
  const progressTracking = useProgressTracking();

  // Get actual MongoDB content ID directly from lesson
  const contentId = lesson.contentId || "";

  // Handle manual completion with progress tracking
  const handleMarkComplete = async () => {
    if (contentId) {
      await progressTracking.handleCompleteContent(contentId);
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
        canGoBack={canGoBack !== undefined ? canGoBack : currentIndex > 0}
        canGoForward={
          canGoForward !== undefined
            ? canGoForward
            : currentIndex < totalCount - 1
        }
        // TODO: Future enhancement - use navigationTitles for enhanced button tooltips
        // navigationTitles={navigationTitles}
        isNavigatingNext={isNavigatingNext}
        isNavigatingPrev={isNavigatingPrev}
      />
    </ContentContainer>
  );
};
