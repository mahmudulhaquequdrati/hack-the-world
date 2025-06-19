import { 
  ArrowLeftIcon,
  CubeIcon,
  DocumentIcon 
} from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import { getIconFromName } from "../../../lib/iconUtils";

const QuickActionsCard = ({ 
  phaseId,
  onNavigateBack,
  quickActions = [],
  className = "",
  customActions = []
}) => {
  
  // Default actions if none provided
  const defaultActions = [
    {
      id: 'view-modules',
      label: 'View All Modules',
      path: `/modules?phaseId=${phaseId}`,
      icon: CubeIcon,
      color: 'green',
      type: 'link'
    },
    {
      id: 'view-content',
      label: 'View Phase Content',
      path: `/content?phaseId=${phaseId}`,
      icon: DocumentIcon,
      color: 'green',
      type: 'link'
    },
    {
      id: 'back-to-phases',
      label: 'Back to Phases',
      icon: ArrowLeftIcon,
      color: 'gray',
      type: 'button',
      onClick: onNavigateBack
    }
  ];

  const actions = quickActions.length > 0 ? quickActions : defaultActions;
  const allActions = [...actions, ...customActions];

  const getActionStyles = (action) => {
    const baseStyles = "flex items-center w-full px-4 py-3 text-left rounded-lg transition-all group";
    
    switch (action.color) {
      case 'green':
        return `${baseStyles} text-green-400 hover:bg-gray-700/50`;
      case 'blue':
        return `${baseStyles} text-blue-400 hover:bg-gray-700/50`;
      case 'gray':
        return `${baseStyles} text-gray-400 hover:bg-gray-700/50`;
      default:
        return `${baseStyles} text-green-400 hover:bg-gray-700/50`;
    }
  };

  const getIconStyles = (action) => {
    const baseStyles = "w-5 h-5 mr-3";
    
    switch (action.color) {
      case 'green':
        return `${baseStyles} group-hover:text-green-300`;
      case 'blue':
        return `${baseStyles} group-hover:text-blue-300`;
      case 'gray':
        return `${baseStyles} group-hover:text-gray-300`;
      default:
        return `${baseStyles} group-hover:text-green-300`;
    }
  };

  const getTextStyles = (action) => {
    switch (action.color) {
      case 'green':
        return "group-hover:text-green-300";
      case 'blue':
        return "group-hover:text-blue-300";
      case 'gray':
        return "group-hover:text-gray-300";
      default:
        return "group-hover:text-green-300";
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-600/20 rounded-lg">
          <DocumentIcon className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-white">
          Quick Actions
        </h3>
      </div>
      
      <div className="space-y-3">
        {allActions.map((action) => {
          // Handle both React component icons and string icon names
          const IconComponent = typeof action.icon === 'string' 
            ? getIconFromName(action.icon) 
            : action.icon;
          
          if (action.type === 'button' || action.onClick) {
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={getActionStyles(action)}
              >
                <IconComponent className={getIconStyles(action)} />
                <span className={getTextStyles(action)}>{action.label}</span>
              </button>
            );
          }
          
          if (action.path) {
            return (
              <Link
                key={action.id}
                to={action.path}
                className={getActionStyles(action)}
              >
                <IconComponent className={getIconStyles(action)} />
                <span className={getTextStyles(action)}>{action.label}</span>
              </Link>
            );
          }
          
          return null;
        })}
      </div>

      {/* Action count indicator */}
      {allActions.length > 3 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 text-center">
            {allActions.length} actions available
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickActionsCard;