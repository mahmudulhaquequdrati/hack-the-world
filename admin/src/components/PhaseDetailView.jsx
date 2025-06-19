import {
  ArrowLeftIcon,
  CubeIcon,
  DocumentIcon,
  EyeIcon,
  InformationCircleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getIconFromName } from "../lib/iconUtils";
import {
  modulesAPI,
  phasesAPI,
} from "../services/api";

const PhaseDetailView = () => {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(null);
  const [modules, setModules] = useState([]);
  const [statistics, setStatistics] = useState({
    totalModules: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (phaseId) {
      fetchPhaseData();
    }
  }, [phaseId]);

  const fetchPhaseData = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 PhaseDetailView: Starting optimized phase fetch");

      // OPTIMIZED: Use Promise.allSettled to reduce API calls from multiple sequential to 2 parallel
      const [phaseRes, modulesRes] = await Promise.allSettled([
        phasesAPI.getById(phaseId),                    // Phase details
        modulesAPI.getByPhase(phaseId)                 // Modules for this phase
      ]);

      // Handle phase data
      if (phaseRes.status === "fulfilled") {
        setPhase(phaseRes.value.data);
      } else {
        throw new Error("Failed to fetch phase details");
      }

      // Handle modules
      let modulesList = [];
      if (modulesRes.status === "fulfilled") {
        modulesList = modulesRes.value.data || [];
        setModules(modulesList);
        
        // Simple statistics calculation (just module count)
        setStatistics({
          totalModules: modulesList.length,
        });
        
        console.log(`📊 Loaded ${modulesList.length} modules for phase`);
      } else {
        throw new Error("Failed to fetch modules for this phase");
      }
    } catch (error) {
      console.error("Error fetching phase data:", error);
      setError(error.response?.data?.message || "Failed to load phase details");
    } finally {
      setLoading(false);
      console.log("✅ PhaseDetailView: Phase fetch completed");
    }
  };


  const getModuleProgressColor = (moduleIndex) => {
    const colors = [
      "bg-green-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
    ];
    return colors[moduleIndex % colors.length];
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mb-4"></div>
          <div className="text-green-400 font-mono">Loading phase details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/phases")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">Phase Details</h1>
        </div>
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!phase) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/phases")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">Phase Details</h1>
        </div>
        <div className="text-gray-400">Phase not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-purple-500/10"></div>
        <div className="relative px-6 py-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/phases")}
                className="p-2 bg-gray-700/50 rounded-lg text-green-400 hover:text-green-300 hover:bg-gray-700 transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <nav className="text-sm text-gray-400 flex items-center">
                <Link to="/phases" className="hover:text-green-400 transition-colors">
                  Phases
                </Link>
                <span className="mx-2 text-gray-600">/</span>
                <span className="text-green-400">{phase.title}</span>
              </nav>
            </div>
            <Link 
              to={`/phases`} 
              className="px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-600/30 hover:text-green-300 transition-all flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Phase
            </Link>
          </div>

          {/* Hero Content */}
          <div className="flex items-start space-x-6">
            {/* Large Phase Icon */}
            <div
              className="p-4 rounded-2xl border-2 backdrop-blur-sm flex items-center justify-center"
              style={{
                backgroundColor: `${phase.color || "#00ff00"}30`,
                borderColor: `${phase.color || "#00ff00"}50`,
              }}
            >
              {(() => {
                const PhaseIcon = getIconFromName(phase.icon);
                return (
                  <PhaseIcon
                    className="w-12 h-12"
                    style={{ color: phase.color || "#00ff00" }}
                  />
                );
              })()}
            </div>

            {/* Title and Meta */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-900/30 text-purple-400 border border-purple-500/30">
                  Phase
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-600/50 text-gray-300">
                  #{phase.order}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
                {phase.title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
                {phase.description}
              </p>

              {/* Key Metrics */}
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center text-gray-400">
                  <CubeIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    {statistics.totalModules} Modules
                  </span>
                </div>
                <div className="flex items-center text-gray-400">
                  <span className="text-xs px-2 py-1 bg-gray-600/50 rounded text-gray-300 uppercase">
                    #{phase.order}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Statistics Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <CubeIcon className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-lg text-gray-400 font-medium">Total Modules in Phase</p>
                <p className="text-4xl font-bold text-white">
                  {statistics.totalModules}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Modules available in this learning phase
                </p>
              </div>
            </div>
          </div>

          {/* Modules List */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-xl">
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

            {modules.length === 0 ? (
              <div className="px-8 py-12 text-center text-gray-400">
                <CubeIcon className="w-16 h-16 mx-auto mb-6 opacity-50" />
                <p className="text-lg mb-2">No modules found in this phase.</p>
                <p className="text-sm">
                  <Link to="/modules" className="text-green-400 hover:text-green-300 transition-colors">
                    Create a new module
                  </Link>{" "}
                  to get started.
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {modules.map((module, index) => {
                  const ModuleIcon = getIconFromName(module.icon);
                  return (
                    <div
                      key={module.id}
                      className="p-6 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full ${getModuleProgressColor(
                                index
                              )}`}
                            ></div>
                            <span className="text-xs px-2 py-1 bg-gray-600/50 rounded text-gray-300">
                              #{module.order}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div
                                className="p-2 rounded-lg border"
                                style={{
                                  backgroundColor: `${module.color || "#00ff00"}20`,
                                  borderColor: `${module.color || "#00ff00"}30`,
                                }}
                              >
                                <ModuleIcon
                                  className="w-5 h-5"
                                  style={{ color: module.color || "#00ff00" }}
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
                              {module.difficulty && (
                                <span
                                  className={`inline-block px-3 py-1 text-xs rounded-full font-medium border ${
                                    module.difficulty === "beginner"
                                      ? "bg-green-900/30 text-green-400 border-green-500/30"
                                      : module.difficulty === "intermediate"
                                      ? "bg-yellow-900/30 text-yellow-400 border-yellow-500/30"
                                      : module.difficulty === "advanced"
                                      ? "bg-red-900/30 text-red-400 border-red-500/30"
                                      : "bg-purple-900/30 text-purple-400 border-purple-500/30"
                                  }`}
                                >
                                  {module.difficulty}
                                </span>
                              )}

                              {module.estimatedHours && (
                                <div className="flex items-center text-sm text-gray-400">
                                  <span className="mr-1">⏱️</span>
                                  {module.estimatedHours}h estimated
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Link
                            to={`/modules/${module.id}`}
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
            )}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Phase Metadata */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-cyan-600/20 rounded-lg">
                  <InformationCircleIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Phase Metadata
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400 text-sm">Created</span>
                  <span className="text-white font-medium">
                    {phase.createdAt
                      ? new Date(phase.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400 text-sm">Last Updated</span>
                  <span className="text-white font-medium">
                    {phase.updatedAt
                      ? new Date(phase.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400 text-sm">Color</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded border border-gray-600"
                      style={{ backgroundColor: phase.color }}
                    ></div>
                    <span className="text-white font-mono text-xs">
                      {phase.color}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 text-sm">Phase ID</span>
                  <span className="text-white font-mono text-xs">
                    {phase.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <DocumentIcon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Quick Actions
                </h3>
              </div>
              <div className="space-y-3">
                <Link
                  to={`/modules?phaseId=${phaseId}`}
                  className="flex items-center w-full px-4 py-3 text-left text-green-400 hover:bg-gray-700/50 rounded-lg transition-all group"
                >
                  <CubeIcon className="w-5 h-5 mr-3 group-hover:text-green-300" />
                  <span className="group-hover:text-green-300">View All Modules</span>
                </Link>
                <Link
                  to={`/content?phaseId=${phaseId}`}
                  className="flex items-center w-full px-4 py-3 text-left text-green-400 hover:bg-gray-700/50 rounded-lg transition-all group"
                >
                  <DocumentIcon className="w-5 h-5 mr-3 group-hover:text-green-300" />
                  <span className="group-hover:text-green-300">View Phase Content</span>
                </Link>
                <button
                  onClick={() => navigate("/phases")}
                  className="flex items-center w-full px-4 py-3 text-left text-gray-400 hover:bg-gray-700/50 rounded-lg transition-all group"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-3 group-hover:text-gray-300" />
                  <span className="group-hover:text-gray-300">Back to Phases</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseDetailView;
