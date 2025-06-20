import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

/**
 * Module Info Card Component
 * Displays detailed module metadata in sidebar
 */
const ModuleInfoCard = ({ module, phase = null, className = "" }) => {
  if (!module) return null;

  const infoItems = [
    {
      label: "Order",
      value: module.order ? `#${module.order}` : "Not set",
    },
    {
      label: "Phase",
      value: phase ? phase.title : "Not assigned",
      isLink: Boolean(phase?.id),
      linkTo: phase?.id ? `/phases/${phase.id}` : null,
    },
    {
      label: "Difficulty",
      value: module.difficulty
        ? module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)
        : "Not set",
    },
    {
      label: "Status",
      value: module.isActive !== false ? "Active" : "Inactive",
      className: module.isActive !== false ? "text-green-400" : "text-red-400",
    },
    {
      label: "Duration",
      value: module.estimatedHours
        ? `${module.estimatedHours} hours`
        : "Not set",
    },
  ];

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
              {item.isLink ? (
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
                  className={`text-white font-medium ${item.className || ""}`}
                >
                  {item.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleInfoCard;
