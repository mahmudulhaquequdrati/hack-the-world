import {
  BookOpenIcon,
  ClockIcon,
  EyeIcon,
  InformationCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Gauge } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getIconFromName } from "../lib/iconUtils";
import {
  contentAPI,
  modulesAPI,
  phasesAPI,
} from "../services/api";
import {
  formatDuration,
  getContentTypeIcon,
  getContentTypeColor,
  getDifficultyColor,
  calculateContentStatistics,
} from "../utils/contentHelpers.jsx";
import LoadingState from "./shared/LoadingState";
import ErrorState from "./shared/ErrorState";
import NotFoundState from "./shared/NotFoundState";
import Breadcrumb from "./shared/Breadcrumb";
import QuickActionsBar from "./shared/QuickActionsBar";

const ModuleDetailView = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [phase, setPhase] = useState(null);
  const [content, setContent] = useState([]);
  const [statistics, setStatistics] = useState({
    totalContent: 0,
    totalDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (moduleId) {
      fetchModuleData();
    }
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch module details
      const moduleResponse = await modulesAPI.getById(moduleId);
      const moduleData = moduleResponse.data;
      setModule(moduleData);

      // Fetch phase details if module has a phaseId
      if (moduleData.phaseId) {
        try {
          const phaseResponse = await phasesAPI.getById(moduleData.phaseId);
          setPhase(phaseResponse.data);
        } catch (phaseError) {
          console.warn("Could not fetch phase details:", phaseError);
        }
      }

      // Fetch content for this module
      const contentResponse = await contentAPI.getByModule(moduleId);
      const contentList = contentResponse.data || [];
      setContent(contentList);


      // Calculate statistics
      setStatistics(calculateContentStatistics(contentList));
    } catch (error) {
      console.error("Error fetching module data:", error);
      setError(
        error.response?.data?.message || "Failed to load module details"
      );
    } finally {
      setLoading(false);
    }
  };






  if (loading) {
    return <LoadingState message="Loading module details..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Module Details"
        onBack={() => navigate("/modules")}
      />
    );
  }

  if (!module) {
    return (
      <NotFoundState
        title="Module Details"
        message="Module not found."
        onBack={() => navigate("/modules")}
      />
    );
  }

  const ModuleIcon = getIconFromName(module.icon);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-purple-500/10"></div>
        <div className="relative px-6 py-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Breadcrumb
              onBack={() => navigate("/modules")}
              backLabel="Modules"
              items={[
                ...(phase
                  ? [{ label: phase.title, href: `/phases/${phase.id}` }]
                  : []),
                { label: module.title },
              ]}
            />

            <QuickActionsBar
              editPath="/modules"
              editLabel="Edit"
              showDelete={false}
            />
          </div>

          {/* Hero Content */}
          <div className="flex items-start space-x-6">
            {/* Large Module Icon */}
            <div
              className="p-4 rounded-2xl border-2 backdrop-blur-sm flex items-center justify-center"
              style={{
                backgroundColor: `${module.color || "#00ff00"}30`,
                borderColor: `${module.color || "#00ff00"}50`,
              }}
            >
              <ModuleIcon
                className="w-12 h-12"
                style={{ color: module.color || "#00ff00" }}
              />
            </div>

            {/* Title and Meta */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-900/30 text-blue-400 border border-blue-500/30">
                  Module
                </span>
                {module.difficulty && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDifficultyColor(
                      module.difficulty
                    )}`}
                  >
                    {module.difficulty}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
                {module.title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
                {module.description}
              </p>

              {/* Key Metrics */}
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center text-gray-400">
                  <BookOpenIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    {statistics.totalContent} Content
                  </span>
                </div>
                <div className="flex items-center text-gray-400">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    {formatDuration(statistics.totalDuration)}
                  </span>
                </div>
                {phase && (
                  <div className="flex items-center text-gray-400">
                    <StarIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">{phase.title}</span>
                  </div>
                )}
                {module.estimatedHours && (
                  <div className="flex items-center text-gray-400">
                    <Gauge className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      {module.estimatedHours}h est.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Content Sections - Card Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-3 space-y-8">
              {/* Content List */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <BookOpenIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Content{" "}
                    <span className="text-gray-400 text-lg">
                      ({content.length})
                    </span>
                  </h2>
                </div>

                {content.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <BookOpenIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No content found in this module.</p>
                    <p className="text-sm mt-2">
                      <Link
                        to="/content"
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        Create new content
                      </Link>{" "}
                      to get started.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {content.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600/50 hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-lg border ${getContentTypeColor(
                              item.type
                            )}`}
                          >
                            {getContentTypeIcon(item.type, "w-5 h-5")}
                          </div>
                          <div>
                            <div className="text-white font-medium group-hover:text-green-400 transition-colors">
                              {item.title}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {item.type} • {formatDuration(item.duration || 0)}
                              {item.section && ` • ${item.section}`}
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/content/${item.id}`}
                          className="p-2 bg-green-600/20 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-600/30 transition-colors"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Module Info Card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-cyan-600/20 rounded-lg">
                    <InformationCircleIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Module Info</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400 text-sm">Order</span>
                    <span className="text-white font-medium">
                      #{module.order}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400 text-sm">Difficulty</span>
                    <span className="text-white font-medium capitalize">
                      {module.difficulty || "Not set"}
                    </span>
                  </div>
                  {module.estimatedHours && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                      <span className="text-gray-400 text-sm">
                        Estimated Hours
                      </span>
                      <span className="text-white font-medium">
                        {module.estimatedHours}h
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400 text-sm">Color</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border border-gray-600"
                        style={{ backgroundColor: module.color }}
                      ></div>
                      <span className="text-white font-mono text-xs">
                        {module.color}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm">Module ID</span>
                    <span className="text-white font-mono text-xs">
                      {module.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailView;
