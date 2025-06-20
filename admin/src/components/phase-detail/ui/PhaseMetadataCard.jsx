import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

const PhaseMetadataCard = ({ 
  phase, 
  className = "",
  showAllFields = true 
}) => {
  if (!phase) return null;

  const metadataFields = [
    {
      key: 'created',
      label: 'Created',
      value: phase.createdAtFormatted || phase.createdAt 
        ? new Date(phase.createdAt).toLocaleDateString()
        : "N/A",
      show: true
    },
    {
      key: 'updated',
      label: 'Last Updated', 
      value: phase.updatedAtFormatted || phase.updatedAt
        ? new Date(phase.updatedAt).toLocaleDateString()
        : "N/A",
      show: true
    },
    {
      key: 'color',
      label: 'Color',
      value: phase.color,
      show: showAllFields,
      isColor: true
    },
    {
      key: '_id',
      label: 'Phase ID',
      value: phase._id,
      show: showAllFields,
      isMonospace: true
    },
    {
      key: 'order',
      label: 'Order',
      value: `#${phase.order}`,
      show: showAllFields
    },
    {
      key: 'icon',
      label: 'Icon',
      value: phase.icon || 'CubeIcon',
      show: showAllFields,
      isMonospace: true
    }
  ].filter(field => field.show);

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-cyan-600/20 rounded-lg">
          <InformationCircleIcon className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold text-white">
          Phase Metadata
        </h3>
      </div>
      
      <div className="space-y-4">
        {metadataFields.map((field, index) => (
          <div 
            key={field.key}
            className={`flex justify-between items-center py-2 ${
              index < metadataFields.length - 1 ? 'border-b border-gray-700/50' : ''
            }`}
          >
            <span className="text-gray-400 text-sm">{field.label}</span>
            <div className="text-right">
              {field.isColor ? (
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: field.value }}
                    title={field.value}
                  ></div>
                  <span className="text-white font-mono text-xs">
                    {field.value}
                  </span>
                </div>
              ) : (
                <span 
                  className={`text-white font-medium ${
                    field.isMonospace ? 'font-mono text-xs' : ''
                  }`}
                >
                  {field.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional computed metadata */}
      {phase.moduleCount !== undefined && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Total Modules</span>
            <span className="text-white font-medium">
              {phase.moduleCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseMetadataCard;