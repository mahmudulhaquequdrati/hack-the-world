import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Breadcrumb = ({ items, onBack, backLabel = "Back" }) => {
  return (
    <div className="flex items-center space-x-3 text-sm">
      <button
        onClick={onBack}
        className="flex items-center text-green-400 hover:text-green-300 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        {backLabel}
      </button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRightIcon className="w-4 h-4 text-gray-500" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-400">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;