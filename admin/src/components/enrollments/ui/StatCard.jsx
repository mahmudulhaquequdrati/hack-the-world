import React from "react";
import { cardColorClasses, animationClasses } from "../constants/enrollmentConstants";

const StatCard = ({
  title,
  value,
  icon,
  color = "gray",
  subtitle,
  progress,
  trend,
  onClick,
  className = "",
}) => {
  const baseClasses = "bg-gray-800 rounded-lg p-4 border border-gray-700 transition-all duration-300";
  const colorClasses = cardColorClasses[color] || cardColorClasses.gray;
  const hoverClasses = onClick ? "cursor-pointer hover:scale-105" : "";

  return (
    <div
      className={`${baseClasses} ${colorClasses} ${hoverClasses} ${animationClasses.fadeIn} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`text-${color}-400 text-sm font-semibold`}>{title}</div>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              trend.direction === "up"
                ? "bg-green-600 text-white"
                : trend.direction === "down"
                ? "bg-red-600 text-white"
                : "bg-gray-600 text-white"
            }`}
          >
            {trend.icon} {trend.value}
          </span>
        )}
      </div>
      {subtitle && <div className="text-xs text-gray-400 mb-2">{subtitle}</div>}
      {progress !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className={`h-1 rounded-full bg-${color}-500 transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;