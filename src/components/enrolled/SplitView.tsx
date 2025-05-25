import { Button } from "@/components/ui/button";
import { Maximize2, Sparkles, Video } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";

interface SplitViewProps {
  leftPane: ReactNode;
  rightPane: ReactNode;
  leftPaneWidth: number;
  videoMinimized: boolean;
  playgroundMinimized: boolean;
  isResizing: boolean;
  onLeftPaneWidthChange: (width: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  onShowBoth: () => void;
  onRestoreVideo: () => void;
  onRestorePlayground: () => void;
}

const SplitView = ({
  leftPane,
  rightPane,
  leftPaneWidth,
  videoMinimized,
  playgroundMinimized,
  isResizing,
  onLeftPaneWidthChange,
  onResizeStart,
  onResizeEnd,
  onShowBoth,
  onRestoreVideo,
  onRestorePlayground,
}: SplitViewProps) => {
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return;

      const container = resizeRef.current.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 30% and 70%
      const constrainedWidth = Math.max(30, Math.min(70, newWidth));
      onLeftPaneWidthChange(constrainedWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        onResizeEnd();
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, onLeftPaneWidthChange, onResizeEnd]);

  return (
    <div className="flex gap-2 mb-6 relative h-min">
      {/* Show Both Button - when both are minimized */}
      {videoMinimized && playgroundMinimized && (
        <div className="w-full flex items-center justify-center">
          <Button
            onClick={onShowBoth}
            className="bg-green-400 text-black hover:bg-green-300"
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Show Both Panes
          </Button>
        </div>
      )}

      {/* Floating restore buttons */}
      {videoMinimized && !playgroundMinimized && (
        <div className="absolute top-4 right-16 z-10">
          <Button
            onClick={onRestoreVideo}
            className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30 rounded-full w-10 h-10 p-0"
          >
            <Video className="w-4 h-4" />
          </Button>
        </div>
      )}

      {playgroundMinimized && !videoMinimized && (
        <div className="absolute top-4 right-16 z-10">
          <Button
            onClick={onRestorePlayground}
            className="bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30 rounded-full w-10 h-10 p-0"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Left Pane - Content */}
      {!videoMinimized && (
        <div
          className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden transition-all duration-300"
          style={{
            width: playgroundMinimized ? "100%" : `${leftPaneWidth}%`,
            minWidth: "300px",
          }}
        >
          {leftPane}
        </div>
      )}

      {/* Resize Handle */}
      {!videoMinimized && !playgroundMinimized && (
        <div
          ref={resizeRef}
          className="w-1 bg-green-400/30 hover:bg-green-400/60 cursor-col-resize transition-colors relative group"
          onMouseDown={onResizeStart}
        >
          <div className="absolute inset-0 w-3 -ml-1" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-green-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Right Pane - AI Playground */}
      {!playgroundMinimized && (
        <div
          className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden transition-all duration-300"
          style={{
            width: videoMinimized ? "100%" : `${100 - leftPaneWidth}%`,
            minWidth: "300px",
          }}
        >
          {rightPane}
        </div>
      )}
    </div>
  );
};

export default SplitView;
