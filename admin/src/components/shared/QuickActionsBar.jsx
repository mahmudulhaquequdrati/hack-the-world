import React from "react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const QuickActionsBar = ({ 
  editPath, 
  editLabel = "Edit", 
  onDelete, 
  deleteLabel = "Delete",
  showDelete = true 
}) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-full px-4 py-2 shadow-lg">
      <Link
        to={editPath}
        className="flex items-center justify-center p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-600/20 rounded-lg transition-all duration-200 group"
        title={`${editLabel} Item`}
      >
        <PencilIcon className="w-5 h-5" />
        <span className="ml-2 text-sm font-medium hidden lg:inline group-hover:text-cyan-300">
          {editLabel}
        </span>
      </Link>

      {showDelete && (
        <>
          <div className="w-px h-6 bg-gray-600"></div>
          <button
            onClick={onDelete}
            className="flex items-center justify-center p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all duration-200 group"
            title={`${deleteLabel} Item`}
          >
            <TrashIcon className="w-5 h-5" />
            <span className="ml-2 text-sm font-medium hidden lg:inline group-hover:text-red-300">
              {deleteLabel}
            </span>
          </button>
        </>
      )}
    </div>
  );
};

export default QuickActionsBar;