import { ReactNode, useEffect, useRef } from "react";

interface SplitViewProps {
  leftPane: ReactNode;
  rightPane: ReactNode;
  leftPaneWidth: number;
  videoMaximized: boolean;
  playgroundMaximized: boolean;
  isResizing: boolean;
  onLeftPaneWidthChange: (width: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
}

const SplitView = ({
  leftPane,
  rightPane,
  leftPaneWidth,
  videoMaximized,
  playgroundMaximized,
  isResizing,
  onLeftPaneWidthChange,
  onResizeStart,
  onResizeEnd,
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
      {/* Left Pane - Video Player */}
      {!playgroundMaximized && (
        <div
          className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden transition-all duration-300"
          style={{
            width: videoMaximized ? "100%" : `${leftPaneWidth}%`,
            minWidth: "300px",
          }}
        >
          {leftPane}
        </div>
      )}

      {/* Resize Handle - only show when both panes are visible */}
      {!videoMaximized && !playgroundMaximized && (
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
      {!videoMaximized && (
        <div
          className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden transition-all duration-300"
          style={{
            width: playgroundMaximized ? "100%" : `${100 - leftPaneWidth}%`,
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
