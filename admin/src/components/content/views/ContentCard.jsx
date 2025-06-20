import React from "react";
import { Link } from "react-router-dom";

const ContentCard = ({ 
  contentItem, 
  contentTypes, 
  onEdit, 
  onDelete,
  showContext = false,
  contextData = null,
  // Drag-and-drop props
  isDraggable = false,
  isDragging = false,
  isDraggedOver = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop
}) => {
  const contentType = contentTypes.find((type) => type.value === contentItem.type);

  const getContentTypeStyles = (type) => {
    switch (type) {
      case "video":
        return "bg-blue-900/20 text-blue-400 border-blue-400/30";
      case "lab":
        return "bg-purple-900/20 text-purple-400 border-purple-400/30";
      case "game":
        return "bg-green-900/20 text-green-400 border-green-400/30";
      case "document":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-400/30";
      default:
        return "bg-gray-900/20 text-gray-400 border-gray-400/30";
    }
  };

  return (
    <div
      key={contentItem._id}
      draggable={isDraggable}
      onDragStart={(e) => isDraggable && onDragStart?.(e, contentItem)}
      onDragEnd={(e) => isDraggable && onDragEnd?.(e)}
      onDragOver={(e) => isDraggable && onDragOver?.(e)}
      onDragEnter={(e) => isDraggable && onDragEnter?.(e, contentItem)}
      onDragLeave={(e) => isDraggable && onDragLeave?.(e)}
      onDrop={(e) => isDraggable && onDrop?.(e, contentItem)}
      className={`
        bg-gradient-to-br from-gray-800/80 to-black/80 border rounded-xl p-4 transition-all duration-300 group relative overflow-hidden
        ${isDraggable ? 'cursor-move' : ''}
        ${isDraggedOver ? 'border-cyan-400/70 shadow-lg shadow-cyan-400/20 scale-105' : 'border-gray-600/50'}
        ${isDragging ? 'opacity-50 scale-95' : 'hover:border-green-400/50 hover:shadow-lg hover:shadow-green-400/10'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        {/* Content Type Badge and Duration */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {isDraggable && (
              <span className="text-gray-500 text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                ⋮⋮
              </span>
            )}
            {contentItem.order && (
              <span className="text-xs font-mono text-gray-400 bg-gray-700/50 px-2 py-1 rounded border border-gray-600/50">
                #{contentItem.order}
              </span>
            )}
            <span 
              className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold font-mono uppercase tracking-wider border ${getContentTypeStyles(contentItem.type)}`}
            >
              {contentType?.icon} {contentType?.label}
            </span>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {contentItem.duration}m
          </span>
        </div>

        {/* Title and Description */}
        <h5 className="font-medium text-green-400 mb-1 line-clamp-2 group-hover:text-green-300 transition-colors font-mono">
          ◆ {contentItem.title}
        </h5>
        <p className="text-xs text-gray-400 line-clamp-2 mb-2 font-mono">
          {contentItem.description}
        </p>

        {/* Context Information */}
        {showContext && contextData && (
          <div className="mb-3 space-y-1">
            {/* Section */}
            {contentItem.section && (
              <div className="text-xs text-cyan-400 font-mono">
                📁 Section: {contentItem.section}
              </div>
            )}
            
            {/* Module */}
            {contextData.module && (
              <div className="text-xs text-blue-400 font-mono">
                📖 Module: {contextData.module.title}
              </div>
            )}
            
            {/* Phase */}
            {contextData.phase && (
              <div className="text-xs text-purple-400 font-mono">
                📚 Phase: {contextData.phase.title}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/content/${contentItem._id}`}
            className="text-xs text-green-400 hover:text-green-300 transition-colors font-mono uppercase tracking-wider hover:bg-green-400/10 px-2 py-1 rounded border border-green-400/30 hover:border-green-400/50"
          >
            VIEW
          </Link>
          <button
            onClick={() => onEdit(contentItem)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono uppercase tracking-wider hover:bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/30 hover:border-cyan-400/50"
          >
            EDIT
          </button>
          <button
            onClick={() => onDelete(contentItem)}
            className="text-xs text-red-400 hover:text-red-300 transition-colors font-mono uppercase tracking-wider hover:bg-red-400/10 px-2 py-1 rounded border border-red-400/30 hover:border-red-400/50"
          >
            DEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;