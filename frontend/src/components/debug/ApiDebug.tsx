import { useGetPhasesWithModulesQuery } from "@/features/api/apiSlice";
import { Phase } from "@/lib/types";
import { ChevronDown, ChevronUp, Settings, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

const ApiDebug = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const {
    data: phasesWithModules,
    isLoading: dataLoading,
    error: dataError,
  } = useGetPhasesWithModulesQuery();

  // Only show in development mode
  if (import.meta.env.MODE !== "development") {
    return null;
  }

  const hasErrors = !!dataError;
  const isConnected = !!phasesWithModules;
  const totalModules =
    phasesWithModules?.reduce(
      (total, phase) => total + (phase.modules?.length || 0),
      0
    ) || 0;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed State */}
      {isCollapsed && (
        <div
          className="bg-black/90 border border-green-500/50 rounded-lg p-3 cursor-pointer hover:border-green-400 transition-colors shadow-lg"
          onClick={() => setIsCollapsed(false)}
        >
          <div className="flex items-center space-x-2">
            {hasErrors ? (
              <WifiOff className="w-4 h-4 text-red-400" />
            ) : isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <Settings className="w-4 h-4 text-yellow-400 animate-spin" />
            )}
            <span className="text-xs font-mono text-green-400">
              {hasErrors ? "API ERROR" : isConnected ? "API OK" : "LOADING"}
            </span>
            <ChevronUp className="w-3 h-3 text-green-400/70" />
          </div>
        </div>
      )}

      {/* Expanded State */}
      {!isCollapsed && (
        <div className="bg-black/95 border border-green-500/50 rounded-lg p-4 min-w-[280px] shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-green-400" />
              <span className="text-green-300 font-bold text-sm font-mono">
                API Debug
              </span>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-green-400/70 hover:text-green-400 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* API Status */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-green-400/70">API URL:</span>
              <span className="text-green-400 text-right truncate max-w-32">
                {import.meta.env.VITE_API_URL || "Not set"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-green-400/70">Phases:</span>
              <span
                className={`${
                  dataError
                    ? "text-red-400"
                    : dataLoading
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {dataLoading && "Loading..."}
                {dataError && "Error!"}
                {phasesWithModules && `${phasesWithModules.length} loaded`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-green-400/70">Modules:</span>
              <span
                className={`${
                  dataError
                    ? "text-red-400"
                    : dataLoading
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {dataLoading && "Loading..."}
                {dataError && "Error!"}
                {phasesWithModules && `${totalModules} total`}
              </span>
            </div>

            {/* Error Details */}
            {dataError && (
              <div className="mt-3 pt-2 border-t border-green-500/30">
                <div className="text-red-400 text-xs mb-1">
                  <div className="font-semibold">API Error:</div>
                  <div className="opacity-80">{JSON.stringify(dataError)}</div>
                </div>
              </div>
            )}

            {/* Phase Details (only when expanded and no errors) */}
            {phasesWithModules && !hasErrors && (
              <div className="mt-3 pt-2 border-t border-green-500/30">
                <div className="text-green-400/70 mb-1">
                  Phases with Modules:
                </div>
                <div className="max-h-20 overflow-y-auto text-xs space-y-1">
                  {phasesWithModules.map((p: Phase) => (
                    <div key={p.id} className="text-green-400/80">
                      {p.id}: {p.title} ({p.modules?.length || 0} modules)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebug;
