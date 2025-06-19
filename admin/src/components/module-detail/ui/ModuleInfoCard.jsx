import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { getColorValue } from "../utils/moduleDetailUtils";

/**
 * Module Info Card Component
 * Displays detailed module metadata in sidebar
 */
const ModuleInfoCard = ({
  module,
  phase = null,
  moduleStatus = null,
  className = "",
}) => {
  if (!module) return null;

  const moduleColor = getColorValue(module.color);

  const infoItems = [
    {
      label: "Order",
      value: module.order ? `#${module.order}` : "Not set",
      show: true,
    },
    {
      label: "Difficulty",
      value: module.difficulty
        ? module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)
        : "Not set",
      show: true,
    },
    {
      label: "Estimated Hours",
      value: module.estimatedHours ? `${module.estimatedHours}h` : "Not set",
      show: true,
    },
    {
      label: "Phase",
      value: phase ? phase.title : "Not assigned",
      show: true,
      isLink: Boolean(phase?.id),
      linkTo: phase?.id ? `/phases/${phase.id}` : null,
    },
    {
      label: "Status",
      value: module.isActive !== false ? "Active" : "Inactive",
      show: true,
      className: module.isActive !== false ? "text-green-400" : "text-red-400",
    },
    {
      label: "Color",
      value: module.color || "#00ff00",
      show: Boolean(module.color),
      isColor: true,
    },
    {
      label: "Icon",
      value: module.icon || "Not set",
      show: Boolean(module.icon),
    },
    {
      label: "Created",
      value: module.createdAtFormatted || "Unknown",
      show: Boolean(module.createdAtFormatted),
    },
    {
      label: "Updated",
      value: module.updatedAtFormatted || "Unknown",
      show: Boolean(module.updatedAtFormatted),
    },
    {
      label: "Module ID",
      value: module.id,
      show: Boolean(module.id),
      isMono: true,
    },
  ].filter((item) => item.show);

  return (
    <div
      className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-cyan-600/20 rounded-lg">
          <InformationCircleIcon className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Module Info</h3>
      </div>

      {/* Info Items */}
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div
            key={item.label}
            className={`flex justify-between items-center py-2 ${
              index < infoItems.length - 1 ? "border-b border-gray-700/50" : ""
            }`}
          >
            <span className="text-gray-400 text-sm font-medium">
              {item.label}
            </span>

            <div className="flex items-center space-x-2">
              {item.isColor ? (
                <>
                  <div
                    className="w-4 h-4 rounded border border-gray-600 flex-shrink-0"
                    style={{ backgroundColor: moduleColor }}
                  ></div>
                  <span
                    className={`text-white font-mono text-xs ${
                      item.className || ""
                    }`}
                  >
                    {item.value}
                  </span>
                </>
              ) : item.isLink ? (
                <a
                  href={item.linkTo}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle navigation if needed
                  }}
                >
                  {item.value}
                </a>
              ) : (
                <span
                  className={`text-white font-medium ${
                    item.isMono ? "font-mono text-xs" : ""
                  } ${item.className || ""}`}
                >
                  {item.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Module Status */}
      {moduleStatus && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            Completion Status
          </h4>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Module Completion</span>
              <span>{moduleStatus.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${moduleStatus.completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Has Content</span>
              <span
                className={
                  moduleStatus.hasContent ? "text-green-400" : "text-red-400"
                }
              >
                {moduleStatus.hasContent ? "✓" : "✗"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Has Phase</span>
              <span
                className={
                  moduleStatus.hasPhase ? "text-green-400" : "text-yellow-400"
                }
              >
                {moduleStatus.hasPhase ? "✓" : "Optional"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Is Active</span>
              <span
                className={
                  moduleStatus.isActive ? "text-green-400" : "text-red-400"
                }
              >
                {moduleStatus.isActive ? "✓" : "✗"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleInfoCard;
