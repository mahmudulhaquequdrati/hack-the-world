import { CubeIcon, EyeIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import { getIconFromName } from "../../../lib/iconUtils";

const ModulesList = ({
  modules = [],
  onModuleClick,
  className = "",
  showEmptyState = true,
}) => {
  if (modules.length === 0 && showEmptyState) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-xl ${className}`}
      >
        <div className="px-8 py-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <CubeIcon className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Modules in this Phase{" "}
              <span className="text-gray-400 text-lg">(0)</span>
            </h3>
          </div>
        </div>
        <div className="px-8 py-12 text-center text-gray-400">
          <CubeIcon className="w-16 h-16 mx-auto mb-6 opacity-50" />
          <p className="text-lg mb-2">No modules found in this phase.</p>
          <p className="text-sm">
            <Link
              to="/modules"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Create a new module
            </Link>{" "}
            to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-xl ${className}`}
    >
      <div className="px-8 py-6 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <CubeIcon className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            Modules in this Phase{" "}
            <span className="text-gray-400 text-lg">({modules.length})</span>
          </h3>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {modules.map((module) => {
          const ModuleIcon = getIconFromName(module.icon);

          return (
            <div
              key={module.id}
              className="p-6 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs px-2 py-1 bg-gray-600/50 rounded text-gray-300">
                      #{module.order}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className="p-2 rounded-lg border"
                        style={{
                          backgroundColor: `${module.color || "green"}20`,
                          borderColor: `${module.color || "green"}30`,
                        }}
                      >
                        <ModuleIcon
                          className="w-5 h-5"
                          style={{ color: module.color || "green" }}
                        />
                      </div>
                      <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors text-lg">
                        {module.title}
                      </h4>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center space-x-3">
                      {module.difficulty && module.difficultyStyle && (
                        <span
                          className={`inline-block px-3 py-1 text-xs rounded-full font-medium border ${module.difficultyStyle.className}`}
                        >
                          {module.difficultyStyle.label}
                        </span>
                      )}

                      {module.estimatedHoursDisplay && (
                        <div className="flex items-center text-sm text-gray-400">
                          <span className="mr-1">⏱️</span>
                          {module.estimatedHoursDisplay}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Link
                    to={`/modules/${module.id}`}
                    onClick={() => onModuleClick?.(module)}
                    className="p-2 bg-green-600/20 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-600/30 transition-colors opacity-0 group-hover:opacity-100"
                    title="View module details"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModulesList;
