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
      if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

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

    const isDesktopResize = typeof window !== 'undefined' && window.innerWidth >= 1024;

    if (isResizing && isDesktopResize) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, onLeftPaneWidthChange, onResizeEnd]);

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 mb-6 relative">
      {/* Left Pane - Video Player */}
      {!playgroundMaximized && (
        <div
          className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden transition-all duration-300 w-full lg:w-auto"
          style={{
            width: videoMaximized 
              ? "100%" 
              : isDesktop 
                ? `${leftPaneWidth}%` 
                : "100%",
            minWidth: isDesktop ? "300px" : "auto",
          }}
        >
          {leftPane}
        </div>
      )}

      {/* Resize Handle - only show when both panes are visible and on desktop */}
      {!videoMaximized && !playgroundMaximized && (
        <div
          ref={resizeRef}
          className="hidden lg:block w-1 bg-green-400/30 hover:bg-green-400/60 cursor-col-resize transition-colors relative group"
          onMouseDown={onResizeStart}
        >
          <div className="absolute inset-0 w-3 -ml-1" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-green-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Right Pane - AI Playground */}
      {!videoMaximized && (
        <div
          className="bg-black/50 border border-green-400/30 rounded-lg overflow-hidden transition-all duration-300 w-full lg:w-auto"
          style={{
            width: playgroundMaximized 
              ? "100%" 
              : isDesktop 
                ? `${100 - leftPaneWidth}%` 
                : "100%",
            minWidth: isDesktop ? "300px" : "auto",
          }}
        >
          {rightPane}
        </div>
      )}
    </div>
  );
};

export default SplitView;
