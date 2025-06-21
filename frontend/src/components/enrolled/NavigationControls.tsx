import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface NavigationControlsProps {
  currentIndex: number;
  totalCount: number;
  isCompleted?: boolean; // Make optional for backward compatibility
  onPrevious: () => void;
  onNext: () => void;
  onMarkComplete?: () => void; // Make optional to prevent duplication
  canGoBack: boolean;
  canGoForward: boolean;
  // T022: Loading states for navigation buttons
  isNavigatingNext?: boolean;
  isNavigatingPrev?: boolean;
  // T026: Option to show/hide completion button to prevent duplication
  showCompletionButton?: boolean;
  // Loading state for completion button
  isCompleting?: boolean;
}

export const NavigationControls = ({
  currentIndex,
  totalCount,
  isCompleted,
  onPrevious,
  onNext,
  onMarkComplete,
  canGoBack,
  canGoForward,
  // T022: Loading states for navigation buttons
  isNavigatingNext = false,
  isNavigatingPrev = false,
  // T026: Default to true for backward compatibility, but allow disabling
  showCompletionButton = true,
  isCompleting = false,
}: NavigationControlsProps) => {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-green-400/30">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoBack || isNavigatingPrev}
        className="border-green-400/30 text-green-400 hover:bg-green-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isNavigatingPrev ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          "← Previous"
        )}
      </Button>

      <div className="flex items-center space-x-4">
        <span className="text-green-400/70 text-sm font-mono">
          {currentIndex + 1} / {totalCount}
        </span>

        {/* T026: Only show completion button if explicitly requested and callback provided */}
        {showCompletionButton && onMarkComplete && (
          <Button
            onClick={onMarkComplete}
            disabled={isCompleted || isCompleting}
            className="bg-green-400 text-black hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Completing...
              </>
            ) : isCompleted ? (
              "Completed"
            ) : (
              "Mark as Completed"
            )}
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={!canGoForward || isNavigatingNext}
        className="border-green-400/30 text-green-400 hover:bg-green-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isNavigatingNext ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          "Next →"
        )}
      </Button>
    </div>
  );
};
