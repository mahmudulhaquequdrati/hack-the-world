import { UsersIcon } from "@heroicons/react/24/outline";

/**
 * Enhanced Terminal Header Component for Users Management
 * Provides a cybersecurity-themed header with terminal styling
 */
const TerminalHeader = ({ userCount, loading }) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-400/50 flex items-center justify-center animate-pulse">
          <UsersIcon className="w-6 h-6 text-green-400" />
        </div>
        <h2 className="text-4xl font-bold text-green-400 font-mono uppercase tracking-wider relative">
          <span className="relative z-10">USER_MANAGEMENT</span>
          <div className="absolute inset-0 bg-green-400/20 blur-lg rounded"></div>
        </h2>
      </div>
      <div className="bg-gradient-to-r from-black/80 via-green-900/20 to-black/80 border border-green-400/30 rounded-xl p-4 max-w-3xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
        <div className="relative z-10 flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-green-400 font-mono text-sm ml-4">
            <span className="text-green-300">admin@hacktheworld:</span>
            <span className="text-blue-400">~/users</span>
            <span className="text-green-400">
              $ ./manage --user-management --admin-panel
              {userCount > 0 && ` --total-users=${userCount}`}
              {loading && " --loading"}
            </span>
            <span className="animate-ping text-green-400">█</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TerminalHeader;