import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import { getIconFromName } from "../../../lib/iconUtils";
import { phaseColorClasses } from "../constants/phaseConstants";

const PhaseCard = ({
  phase,
  viewMode,
  draggedPhase,
  dragOverPhase,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onEdit,
  onDelete,
}) => {
  const colors = phaseColorClasses[phase.color] || phaseColorClasses.green;

  if (viewMode === "grid") {
    return (
      <div
        draggable={true}
        onDragStart={(e) => onDragStart(e, phase)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragEnter={(e) => onDragEnter(e, phase)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, phase)}
        className={`relative overflow-hidden rounded-xl border-2 p-6 group transition-all duration-300 cursor-move select-none ${
          draggedPhase?.id === phase.id
            ? "opacity-50 scale-95 rotate-2"
            : dragOverPhase?.id === phase.id
            ? "scale-110 shadow-2xl border-yellow-400 ring-4 ring-yellow-400/30"
            : "hover:scale-105 hover:shadow-lg"
        } ${colors.border} ${colors.bg} ${colors.hoverBorder} ${colors.hoverShadow}`}
      >
        {/* Glow Effect */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${colors.glow}`}
        ></div>

        {/* Status Indicators */}
        <div className="absolute top-2 left-2 flex space-x-1">
          <div
            className={`w-2 h-2 rounded-full animate-pulse shadow-lg bg-${phase.color}-400 shadow-${phase.color}-400/50`}
          ></div>
          {isDragging && (
            <div className="w-2 h-2 rounded-full animate-ping bg-yellow-400 shadow-lg shadow-yellow-400/50"></div>
          )}
        </div>

        {/* Drag Handle Indicator */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col space-y-1 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
            <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
            <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Phase Order Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm ${colors.badge}`}>
            {phase.order}
          </div>
        </div>

        <div className="relative z-10">
          {/* Phase Icon */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`${colors.icon} flex items-center justify-center group-hover:animate-pulse`}>
              {(() => {
                const IconComponent = getIconFromName(phase.icon);
                return <IconComponent className={`w-6 h-6 ${colors.iconText}`} />;
              })()}
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold font-mono uppercase tracking-wider transition-colors ${colors.text} ${colors.hoverText}`}>
                {phase.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm font-mono line-clamp-3 mb-4 leading-relaxed">
            {phase.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className={`relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 transition-all duration-300 ${colors.hoverBorder}`}>
              <div className="text-center">
                <div className={`font-mono text-sm font-bold ${colors.text}`}>
                  PHASE_{phase.order}
                </div>
                <div className={`text-xs font-mono uppercase ${colors.text}`}>
                  {phase.color}_THEME
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link
              to={`/phases/${phase.id}`}
              className={`flex-1 h-10 border transition-all duration-300 rounded-lg flex items-center justify-center font-mono text-sm font-bold uppercase tracking-wider ${colors.button}`}
              title="View Details"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              VIEW
            </Link>
            <button
              onClick={() => onEdit(phase)}
              className="h-10 px-3 bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-cyan-400"
              title="Edit Phase"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(phase)}
              className="h-10 px-3 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-red-400"
              title="Delete Phase"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view for desktop table
  return (
    <tr
      className={`border-b border-green-400/20 hover:bg-gradient-to-r hover:from-green-900/20 hover:to-green-800/20 transition-all duration-300 group bg-gradient-to-r ${
        phase.order % 2 === 0
          ? "from-gray-900/30 to-gray-800/30"
          : "from-gray-800/30 to-gray-900/30"
      }`}
    >
      <td className="p-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-mono border-2 shadow-lg transition-all duration-300 group-hover:scale-110 ${colors.badge}`}>
          {phase.order}
        </div>
      </td>
      <td className="p-4">
        <div className="font-bold text-green-400 font-mono uppercase tracking-wider group-hover:text-green-300 transition-colors">
          {phase.title}
        </div>
      </td>
      <td className="p-4 max-w-md">
        <div className="text-gray-300 text-sm font-mono line-clamp-2 leading-relaxed">
          {phase.description}
        </div>
      </td>
      <td className="p-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-green-400/30 flex items-center justify-center group-hover:animate-pulse transition-all duration-300">
          {(() => {
            const IconComponent = getIconFromName(phase.icon);
            return <IconComponent className="w-5 h-5 text-green-400" />;
          })()}
        </div>
      </td>
      <td className="p-4">
        <div className="flex justify-center gap-2">
          <Link
            to={`/phases/${phase.id}`}
            className="p-3 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-300 rounded-lg text-green-400 hover:text-green-300 shadow-lg hover:shadow-green-400/20"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onEdit(phase)}
            className="p-3 bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 rounded-lg text-cyan-400 hover:text-cyan-300 shadow-lg hover:shadow-cyan-400/20"
            title="Edit Phase"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(phase)}
            className="p-3 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 transition-all duration-300 rounded-lg text-red-400 hover:text-red-300 shadow-lg hover:shadow-red-400/20"
            title="Delete Phase"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Mobile card component for list view
export const PhaseCardMobile = ({ phase, onEdit, onDelete }) => {
  const colors = phaseColorClasses[phase.color] || phaseColorClasses.green;

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-4 space-y-4 hover:border-green-400/50 transition-all duration-300 shadow-lg hover:shadow-green-400/20 relative overflow-hidden group">
      {/* Mobile card glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-mono border-2 shadow-lg ${colors.badge}`}>
            {phase.order}
          </div>
          <div className="flex gap-2">
            <Link
              to={`/phases/${phase.id}`}
              className="p-2 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-300 rounded-lg text-green-400"
            >
              <EyeIcon className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onEdit(phase)}
              className="p-2 bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 rounded-lg text-cyan-400"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(phase)}
              className="p-2 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 transition-all duration-300 rounded-lg text-red-400"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-green-400 font-mono uppercase tracking-wider mb-2">
            ◆ {phase.title}
          </h3>
          <p className="text-gray-300 text-sm font-mono mb-3 leading-relaxed">
            {phase.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-green-400/60 font-mono uppercase">
              <span className="mr-2">ICON:</span>
              <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-800/50 to-black/50 border border-green-400/30 flex items-center justify-center">
                {(() => {
                  const IconComponent = getIconFromName(phase.icon);
                  return <IconComponent className="w-3 h-3 text-green-400" />;
                })()}
              </div>
            </div>
            <div className="text-xs text-green-400/60 font-mono uppercase">
              PHASE_{phase.order}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseCard;