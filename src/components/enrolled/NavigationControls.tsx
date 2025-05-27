import { Button } from "@/components/ui/button";

interface NavigationControlsProps {
  currentIndex: number;
  totalCount: number;
  isCompleted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMarkComplete: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
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
}: NavigationControlsProps) => {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-green-400/30">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoBack}
        className="border-green-400/30 text-green-400 hover:bg-green-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Previous
      </Button>

      <div className="flex items-center space-x-4">
        <span className="text-green-400/70 text-sm font-mono">
          {currentIndex + 1} / {totalCount}
        </span>
        <Button
          onClick={onMarkComplete}
          disabled={isCompleted}
          className="bg-green-400 text-black hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleted ? "✓ Completed" : "Mark Complete"}
        </Button>
      </div>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={!canGoForward}
        className="border-green-400/30 text-green-400 hover:bg-green-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </Button>
    </div>
  );
};
