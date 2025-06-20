import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import { getIconFromName } from "../../../lib/iconUtils";
import {
  getDifficultyColor,
  getModuleColorClasses,
} from "../constants/moduleConstants";

const ModuleCard = ({
  module,
  draggedModule,
  dragOverModule,
  isDraggingModule,
  selectedModules,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onEdit,
  onDelete,
  onToggleSelection,
  saving,
}) => {
  const contentCount =
    (module.content?.videos?.length || 0) +
    (module.content?.documents?.length || 0) +
    (module.content?.labs?.length || 0) +
    (module.content?.games?.length || 0);

  const difficultyColors = getDifficultyColor(module.difficulty);
  const colorClasses = getModuleColorClasses(module.color);

  const isSelected = selectedModules.has(module._id);
  const isDragged = draggedModule?._id === module._id;
  const isDraggedOver = dragOverModule?._id === module._id;

  const getCardClasses = () => {
    let classes = `relative overflow-hidden rounded-xl border-2 p-6 group transition-all duration-300 cursor-move select-none ${colorClasses.border}`;

    if (isDragged) {
      classes += " opacity-50 scale-95 rotate-1";
    } else if (isDraggedOver) {
      classes +=
        " scale-110 shadow-2xl border-yellow-400 ring-4 ring-yellow-400/30";
    } else {
      classes += " hover:scale-105 hover:shadow-lg";
    }

    return classes;
  };

  const handleCardClick = (e) => {
    // Don't select if clicking on action buttons
    if (e.target.closest("button") || e.target.closest("a")) {
      return;
    }

    onToggleSelection(module._id);
  };

  return (
    <div
      key={module._id}
      draggable={true}
      onDragStart={(e) => onDragStart(e, module)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={(e) => onDragEnter(e, module)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, module)}
      onClick={handleCardClick}
      className={getCardClasses()}
    >
      {/* Module card glow effect */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colorClasses.glow}`}
      ></div>

      {/* Status Indicators */}
      <div className="absolute top-2 left-2 flex space-x-1">
        <div
          className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${colorClasses.status}`}
        ></div>
        {isDraggingModule && (
          <div className="w-2 h-2 rounded-full animate-ping bg-yellow-400 shadow-lg shadow-yellow-400/50"></div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-6 h-6 bg-purple-600 border-2 border-purple-400 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      {/* Module Drag Handle Indicator */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col space-y-0.5 opacity-40 hover:opacity-80 transition-opacity duration-300">
          <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
          <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 w-full">
            <div
              className={`w-12 h-12 p-2 rounded-lg bg-gradient-to-br from-gray-800/50 to-black/50 border-2 shadow-lg flex items-center justify-center group-hover:animate-pulse ${colorClasses.icon}`}
            >
              {(() => {
                const IconComponent = getIconFromName(module.icon);
                return (
                  <IconComponent
                    className={`w-full h-full ${colorClasses.statText}`}
                  />
                );
              })()}
            </div>
            <div className="w-full">
              <h4
                className={`font-bold font-mono uppercase tracking-wider transition-colors line-clamp-1 ${colorClasses.text}`}
              >
                {module.title}
              </h4>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Module Order Badge */}
            <div className="z-10">
              <div
                className={`w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center font-mono font-bold text-sm ${colorClasses.badge}`}
              >
                {module.order}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm font-mono line-clamp-2 mb-4 leading-relaxed mt-4">
          {module.description}
        </p>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className={`relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 transition-all duration-300 ${colorClasses.stats}`}
          >
            <div className="text-center">
              <div
                className={`font-mono text-sm font-bold ${colorClasses.statText}`}
              >
                {contentCount}
              </div>
              <div
                className={`text-xs font-mono uppercase ${colorClasses.statSubtext}`}
              >
                CONTENT
              </div>
            </div>
          </div>
          <div
            className={`relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 transition-all duration-300 ${colorClasses.stats}`}
          >
            <div className="text-center">
              <div
                className={`font-mono text-sm font-bold ${colorClasses.statText}`}
              >
                {module.difficulty?.toUpperCase() || "UNSET"}
              </div>
              <div
                className={`text-xs font-mono uppercase ${colorClasses.statSubtext}`}
              >
                DIFFICULTY
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/modules/${module._id}`}
            className={`flex-1 h-10 border transition-all duration-300 rounded-lg flex items-center justify-center font-mono text-xs font-bold uppercase tracking-wider ${
              module.color === "green"
                ? "bg-green-400/10 border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 text-green-400"
                : module.color === "blue"
                ? "bg-blue-400/10 border-blue-400/30 hover:bg-blue-400/20 hover:border-blue-400/50 text-blue-400"
                : module.color === "red"
                ? "bg-red-400/10 border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 text-red-400"
                : module.color === "yellow"
                ? "bg-yellow-400/10 border-yellow-400/30 hover:bg-yellow-400/20 hover:border-yellow-400/50 text-yellow-400"
                : module.color === "purple"
                ? "bg-purple-400/10 border-purple-400/30 hover:bg-purple-400/20 hover:border-purple-400/50 text-purple-400"
                : module.color === "pink"
                ? "bg-pink-400/10 border-pink-400/30 hover:bg-pink-400/20 hover:border-pink-400/50 text-pink-400"
                : module.color === "indigo"
                ? "bg-indigo-400/10 border-indigo-400/30 hover:bg-indigo-400/20 hover:border-indigo-400/50 text-indigo-400"
                : module.color === "cyan"
                ? "bg-cyan-400/10 border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 text-cyan-400"
                : module.color === "orange"
                ? "bg-orange-400/10 border-orange-400/30 hover:bg-orange-400/20 hover:border-orange-400/50 text-orange-400"
                : module.color === "gray"
                ? "bg-gray-400/10 border-gray-400/30 hover:bg-gray-400/20 hover:border-gray-400/50 text-gray-400"
                : "bg-green-400/10 border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 text-green-400"
            }`}
            title="View Details"
          >
            <EyeIcon className="w-3 h-3 mr-1" />
            VIEW
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(module);
            }}
            className="h-10 px-3 bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-cyan-400"
            title="Edit Module"
          >
            <PencilIcon className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(module);
            }}
            className="h-10 px-3 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-red-400"
            title="Delete Module"
            disabled={saving}
          >
            <TrashIcon className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
