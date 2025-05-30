import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface LoadingSkeletonProps {
  type?: "stats" | "card" | "header" | "list";
  className?: string;
  count?: number;
}

const LoadingSkeleton = ({
  type = "card",
  className = "",
  count = 1,
}: LoadingSkeletonProps) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Terminal-style loading animation
  const TerminalSkeleton = () => (
    <div className="bg-black/80 border border-green-400/30 rounded-lg p-4 font-mono">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse delay-200"></div>
        <span className="text-green-400 text-sm">terminal@hack-the-world</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-green-400">$</span>
          <span className="ml-2 text-green-300">loading data{dots}</span>
          <div className="w-2 h-4 bg-green-400 ml-1 animate-pulse"></div>
        </div>
        <div className="flex items-center">
          <span className="text-green-400/50">•</span>
          <div className="ml-2 h-3 bg-gradient-to-r from-green-400/50 to-transparent rounded flex-1 animate-pulse"></div>
        </div>
        <div className="flex items-center">
          <span className="text-green-400/50">•</span>
          <div className="ml-2 h-3 bg-gradient-to-r from-green-400/30 to-transparent rounded w-3/4 animate-pulse delay-100"></div>
        </div>
      </div>
    </div>
  );

  // Stats card skeleton
  const StatsSkeleton = () => (
    <Card className="bg-black/50 border-green-400/30">
      <CardContent className="p-4 text-center">
        <div className="w-6 h-6 bg-green-400/30 rounded mx-auto mb-2 animate-pulse"></div>
        <div className="h-6 bg-gradient-to-r from-green-400/50 to-transparent rounded mb-1 animate-pulse"></div>
        <div className="h-3 bg-gradient-to-r from-green-300/30 to-transparent rounded w-16 mx-auto animate-pulse delay-100"></div>
      </CardContent>
    </Card>
  );

  // Course card skeleton
  const CardSkeleton = () => (
    <Card className="bg-black/50 border-green-400/30 hover:border-green-400/50 transition-all">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-400/30 rounded animate-pulse"></div>
          <div className="flex-1">
            <div className="h-6 bg-gradient-to-r from-green-400/50 to-transparent rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-green-300/30 to-transparent rounded w-24 animate-pulse delay-100"></div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gradient-to-r from-green-300/30 to-transparent rounded animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-green-300/20 to-transparent rounded w-3/4 animate-pulse delay-100"></div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-400 text-xs">$</span>
            <div className="h-3 bg-gradient-to-r from-green-400/40 to-transparent rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-1 bg-black/50 border border-green-400/20 rounded overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400/50 to-green-400/20 w-1/3 animate-pulse"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center">
              <div
                className="h-3 bg-gradient-to-r from-green-300/30 to-transparent rounded mb-1 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              ></div>
              <div
                className="h-4 bg-gradient-to-r from-green-400/50 to-transparent rounded w-8 mx-auto animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              ></div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <div className="h-9 bg-gradient-to-r from-green-400/30 to-green-400/10 rounded flex-1 animate-pulse"></div>
          <div className="h-9 bg-gradient-to-r from-green-400/20 to-transparent rounded w-20 animate-pulse delay-100"></div>
        </div>
      </CardContent>
    </Card>
  );

  // Header skeleton
  const HeaderSkeleton = () => (
    <div className="text-center space-y-4">
      <div className="h-8 bg-gradient-to-r from-green-400/50 to-transparent rounded w-64 mx-auto animate-pulse"></div>
      <div className="h-16 bg-gradient-to-r from-green-400/30 to-transparent rounded w-96 mx-auto animate-pulse delay-100"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gradient-to-r from-green-300/30 to-transparent rounded w-48 mx-auto animate-pulse delay-200"></div>
        <div className="h-2 bg-gradient-to-r from-green-400/40 to-transparent rounded w-80 mx-auto animate-pulse delay-300"></div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case "stats":
        return <StatsSkeleton />;
      case "card":
        return <CardSkeleton />;
      case "header":
        return <HeaderSkeleton />;
      case "list":
        return <TerminalSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  if (count === 1) {
    return <div className={className}>{renderSkeleton()}</div>;
  }

  return (
    <div className={className}>
      {[...Array(count)].map((_, index) => (
        <div key={index} style={{ animationDelay: `${index * 200}ms` }}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
