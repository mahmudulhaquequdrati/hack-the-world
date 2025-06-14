import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "green" | "blue" | "white";
  fullScreen?: boolean;
  centered?: boolean;
}

export const LoadingSpinner = ({
  message = "LOADING...",
  size = "lg",
  className,
  color = "green",
  fullScreen = false,
  centered = true,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const colorClasses = {
    green: "border-green-400",
    blue: "border-blue-400",
    white: "border-white",
  };

  const spinner = (
    <div className={cn("text-center", !fullScreen && "p-4")}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 mx-auto mb-4",
          sizeClasses[size],
          colorClasses[color]
        )}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className={cn(
          "font-mono text-sm",
          color === "green" && "text-green-400",
          color === "blue" && "text-blue-400",
          color === "white" && "text-white"
        )}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={cn(
        "min-h-screen bg-black text-green-400 relative flex items-center justify-center",
        className
      )}>
        {spinner}
      </div>
    );
  }

  if (centered) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        {spinner}
      </div>
    );
  }

  return <div className={className}>{spinner}</div>;
};
