/**
 * Enhanced Statistics Grid Component for Modules Management
 * Displays real-time statistics about modules, phases, and selections
 */
const StatisticsGrid = ({ modules = [], phases = [], selectedModules = new Set() }) => {
  // Calculate statistics
  const totalModules = modules.length;
  const totalPhases = phases.length;
  const selectedCount = selectedModules.size;
  const activeModules = modules.filter((m) => m.isActive).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Total Modules */}
      <div className="bg-gradient-to-br from-green-900/30 to-black/80 border border-green-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-green-400/50 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 text-center">
          <div className="text-3xl font-bold text-green-400 font-mono mb-1">
            {totalModules}
          </div>
          <div className="text-xs text-green-400/60 font-mono uppercase tracking-wider">
            ◆ TOTAL MODULES
          </div>
          <div className="w-full bg-green-400/20 h-1 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Total Phases */}
      <div className="bg-gradient-to-br from-blue-900/30 to-black/80 border border-blue-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-blue-400/50 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 text-center">
          <div className="text-3xl font-bold text-blue-400 font-mono mb-1">
            {totalPhases}
          </div>
          <div className="text-xs text-blue-400/60 font-mono uppercase tracking-wider">
            ◆ TOTAL PHASES
          </div>
          <div className="w-full bg-blue-400/20 h-1 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Selected Modules */}
      <div className="bg-gradient-to-br from-purple-900/30 to-black/80 border border-purple-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-purple-400/50 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 text-center">
          <div className="text-3xl font-bold text-purple-400 font-mono mb-1">
            {selectedCount}
          </div>
          <div className="text-xs text-purple-400/60 font-mono uppercase tracking-wider">
            ◆ SELECTED
          </div>
          <div className="w-full bg-purple-400/20 h-1 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Active Modules */}
      <div className="bg-gradient-to-br from-cyan-900/30 to-black/80 border border-cyan-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-cyan-400/50 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 text-center">
          <div className="text-3xl font-bold text-cyan-400 font-mono mb-1">
            {activeModules}
          </div>
          <div className="text-xs text-cyan-400/60 font-mono uppercase tracking-wider">
            ◆ ACTIVE
          </div>
          <div className="w-full bg-cyan-400/20 h-1 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsGrid;