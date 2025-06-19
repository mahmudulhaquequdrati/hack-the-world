import React from "react";
import { getStatusConfig } from "../utils/enrollmentUtils";
import { sizeClasses } from "../constants/enrollmentConstants";

const StatusIndicator = ({ status, showPulse = true, size = "sm", showLabel = true }) => {
  const config = getStatusConfig(status);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} ${config.color} rounded-full ${
          showPulse && status === "active" ? "animate-pulse" : ""
        }`}
      />
      {showLabel && (
        <span className="text-xs text-gray-300">{config.label}</span>
      )}
    </div>
  );
};

export default StatusIndicator;