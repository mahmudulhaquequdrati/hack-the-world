import React from "react";
import { getProgressColor, getProgressIcon } from "../utils/enrollmentUtils";

const CircularProgress = ({
  percentage,
  size = 60,
  strokeWidth = 6,
  showLabel = true,
  showIcon = false,
  animated = true,
  color = null,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const progressColor = color || getProgressColor(percentage);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className={`${animated ? "animate-pulse" : ""}`}
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          strokeLinecap="round"
          className={animated ? "transition-all duration-1000 ease-out" : ""}
          style={{
            strokeDashoffset: animated ? offset : circumference,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {showIcon ? (
          <span className="text-xs">{getProgressIcon(percentage)}</span>
        ) : showLabel ? (
          <span className="text-xs font-bold text-white">{percentage}%</span>
        ) : null}
      </div>
    </div>
  );
};

export default CircularProgress;