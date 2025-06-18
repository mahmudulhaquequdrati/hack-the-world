import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const ErrorState = ({ 
  error, 
  title = "Details", 
  onBack, 
  backPath = "" 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="text-green-400 hover:text-cyber-green transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-cyber-green">{title}</h1>
      </div>
      <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );
};

export default ErrorState;