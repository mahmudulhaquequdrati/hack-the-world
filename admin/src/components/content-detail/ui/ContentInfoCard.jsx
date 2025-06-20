import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import { formatDuration } from "../../../utils/contentHelpers.jsx";

/**
 * Content Info Card Component
 * Displays detailed content metadata in sidebar
 */
const ContentInfoCard = ({
  content,
  module = null,
  className = "",
}) => {
  if (!content) return null;

  const infoItems = [
    {
      label: "Type",
      value: content.type
        ? content.type.charAt(0).toUpperCase() + content.type.slice(1)
        : "Unknown",
    },
    {
      label: "Duration",
      value: content.duration
        ? formatDuration(content.duration)
        : "Not specified",
    },
    {
      label: "Section",
      value: content.section || "Not assigned",
    },
    {
      label: "Order",
      value: content.order ? `#${content.order}` : "Not set",
    },
    {
      label: "Module",
      value: module ? module.title : "Not assigned",
      isLink: Boolean(module?._id),
      linkTo: module?._id ? `/modules/${module._id}` : null,
    },
    {
      label: "Status",
      value: content.isActive !== false ? "Active" : "Inactive",
      className: content.isActive !== false ? "text-green-400" : "text-red-400",
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
        <h3 className="text-lg font-bold text-white">Content Info</h3>
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

            <div className="flex items-center space-x-2 max-w-[60%] text-right">
              {item.isLink && item.linkTo ? (
                <Link
                  to={item.linkTo}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium truncate"
                  title={item.value}
                >
                  {item.value}
                </Link>
              ) : (
                <span
                  className={`font-medium truncate ${
                    item.isMono ? "font-mono text-xs" : ""
                  } ${item.className || "text-white"}`}
                  title={item.value}
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

export default ContentInfoCard;
