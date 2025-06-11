import React from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
  message: string;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message,
  className = "",
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center ${className}`}
    >
      <div className="bg-black/90 border border-green-400/30 p-6 rounded">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-5 w-5 border-2 border-green-400 border-t-transparent rounded-full" />
          <p className="text-green-400 font-mono">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
