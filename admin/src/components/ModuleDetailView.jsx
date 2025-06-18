import {
  ArrowLeftIcon,
  BeakerIcon,
  BookOpenIcon,
  ChartBarIcon,
  ChevronRightIcon,
  ClockIcon,
  CubeIcon,
  DocumentIcon,
  EyeIcon,
  InformationCircleIcon,
  PencilIcon,
  PuzzlePieceIcon,
  StarIcon,
  TrashIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { Gauge } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getIconFromName } from "../lib/iconUtils";
import {
  contentAPI,
  enrollmentAPI,
  modulesAPI,
  phasesAPI,
} from "../services/api";

const ModuleDetailView = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [phase, setPhase] = useState(null);
  const [content, setContent] = useState([]);
  const [contentGrouped, setContentGrouped] = useState({});
  const [enrollmentStats, setEnrollmentStats] = useState(null);
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

      // Fetch grouped content for better organization
      try {
        const groupedResponse = await contentAPI.getByModuleGrouped(moduleId);
        setContentGrouped(groupedResponse.data || {});
      } catch (groupedError) {
        console.warn("Could not fetch grouped content:", groupedError);
      }

      // Fetch enrollment statistics
      try {
        const enrollmentStatsResponse = await enrollmentAPI.getModuleStats(
          moduleId
        );
        setEnrollmentStats(enrollmentStatsResponse.data);
      } catch (enrollmentError) {
        console.warn("Could not fetch enrollment stats:", enrollmentError);
      }

      // Calculate statistics
      calculateStatistics(contentList);
    } catch (error) {
      console.error("Error fetching module data:", error);
      setError(
        error.response?.data?.message || "Failed to load module details"
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (contentList) => {
    const stats = {
      totalContent: contentList.length,
      totalDuration: contentList.reduce(
        (sum, item) => sum + (item.duration || 0),
        0
      ),
    };

    setStatistics(stats);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: "bg-green-900/30 text-green-400 border-green-500/30",
      intermediate: "bg-yellow-900/30 text-yellow-400 border-yellow-500/30",
      advanced: "bg-red-900/30 text-red-400 border-red-500/30",
      expert: "bg-purple-900/30 text-purple-400 border-purple-500/30",
    };
    return (
      colors[difficulty] || "bg-gray-900/30 text-gray-400 border-gray-500/30"
    );
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <VideoCameraIcon className="w-5 h-5" />;
      case "lab":
        return <BeakerIcon className="w-5 h-5" />;
      case "game":
        return <PuzzlePieceIcon className="w-5 h-5" />;
      case "document":
        return <DocumentIcon className="w-5 h-5" />;
      default:
        return <BookOpenIcon className="w-5 h-5" />;
    }
  };

  const getContentTypeColor = (type) => {
    const colors = {
      video: "bg-red-900/30 text-red-400 border-red-500/30",
      lab: "bg-blue-900/30 text-blue-400 border-blue-500/30",
      game: "bg-purple-900/30 text-purple-400 border-purple-500/30",
      document: "bg-green-900/30 text-green-400 border-green-500/30",
    };
    return colors[type] || "bg-gray-900/30 text-gray-400 border-gray-500/30";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyber-green">Loading module details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/modules")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">
            Module Details
          </h1>
        </div>
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/modules")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">
            Module Details
          </h1>
        </div>
        <div className="text-gray-400">Module not found.</div>
      </div>
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
            <div className="flex items-center space-x-3 text-sm">
              <button
                onClick={() => navigate("/modules")}
                className="flex items-center text-green-400 hover:text-green-300 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Modules
              </button>
              {phase && (
                <>
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                  <Link
                    to={`/phases/${phase.id}`}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    {phase.title}
                  </Link>
                </>
              )}
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">{module.title}</span>
            </div>

            {/* Quick Actions Floating Bar */}
            <div className="flex items-center space-x-2 bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-full px-4 py-2 shadow-lg">
              <Link
                to={`/modules`}
                className="flex items-center justify-center p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-600/20 rounded-lg transition-all duration-200 group"
                title="Edit Module"
              >
                <PencilIcon className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium hidden lg:inline group-hover:text-cyan-300">
                  Edit
                </span>
              </Link>

              <div className="w-px h-6 bg-gray-600"></div>

              <button
                onClick={() => {
                  /* Add delete functionality */
                }}
                className="flex items-center justify-center p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all duration-200 group"
                title="Delete Module"
              >
                <TrashIcon className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium hidden lg:inline group-hover:text-red-300">
                  Delete
                </span>
              </button>
            </div>
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
                            {getContentTypeIcon(item.type)}
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
