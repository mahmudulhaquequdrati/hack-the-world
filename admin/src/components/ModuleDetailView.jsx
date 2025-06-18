import {
  ArrowLeftIcon,
  BeakerIcon,
  BookOpenIcon,
  ClockIcon,
  CubeIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  EyeIcon,
  FolderIcon,
  PencilIcon,
  PuzzlePieceIcon,
  VideoCameraIcon,
  ChartBarIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
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
      totalDuration: contentList.reduce((sum, item) => sum + (item.duration || 0), 0),
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
      video: "text-red-400",
      lab: "text-blue-400",
      game: "text-purple-400",
      document: "text-green-400",
    };
    return colors[type] || "text-gray-400";
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
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/modules")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <nav className="text-sm text-gray-400 mb-1">
              <Link to="/modules" className="hover:text-green-400">
                Modules
              </Link>
              {phase && (
                <>
                  <span className="mx-2">/</span>
                  <Link
                    to={`/phases/${phase.id}`}
                    className="hover:text-green-400"
                  >
                    {phase.title}
                  </Link>
                </>
              )}
              <span className="mx-2">/</span>
              <span className="text-cyber-green">{module.title}</span>
            </nav>
            <h1 className="text-3xl font-bold text-cyber-green">
              [{module.title.toUpperCase()}]
            </h1>
          </div>
        </div>
        <Link to={`/modules`} className="btn-secondary flex items-center">
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit Module
        </Link>
      </div>

      {/* Module Info Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: module.color || "#00ff00" }}
          >
            <ModuleIcon className="w-8 h-8 text-black" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-bold text-cyber-green">
                {module.title}
              </h2>
              {module.difficulty && (
                <span
                  className={`px-3 py-1 text-xs rounded-full border ${getDifficultyColor(
                    module.difficulty
                  )}`}
                >
                  {module.difficulty.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-gray-300 mb-4">{module.description}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center text-gray-400">
                <span className="font-medium">Order:</span>
                <span className="ml-1 text-cyber-green">#{module.order}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <span className="font-medium">Color:</span>
                <div
                  className="ml-2 w-4 h-4 rounded border border-gray-600"
                  style={{ backgroundColor: module.color }}
                ></div>
                <span className="ml-1 text-gray-300">{module.color}</span>
              </div>
              {module.estimatedHours && (
                <div className="flex items-center text-gray-400">
                  <span className="font-medium">Est. Hours:</span>
                  <span className="ml-1 text-cyber-green">
                    {module.estimatedHours}h
                  </span>
                </div>
              )}
              {phase && (
                <div className="flex items-center text-gray-400">
                  <span className="font-medium">Phase:</span>
                  <Link
                    to={`/phases/${phase.id}`}
                    className="ml-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {phase.title}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpenIcon className="w-8 h-8 text-cyan-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total Content</p>
              <p className="text-2xl font-bold text-cyber-green">
                {statistics.totalContent}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total Duration</p>
              <p className="text-2xl font-bold text-cyber-green">
                {formatDuration(statistics.totalDuration)}
              </p>
            </div>
          </div>
        </div>

        {phase && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <CubeIcon className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Phase</p>
                <p className="text-lg font-bold text-cyber-green">
                  {phase.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {module.difficulty && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationCircleIcon className="w-8 h-8 text-amber-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Difficulty</p>
                <p className="text-lg font-bold text-cyber-green capitalize">
                  {module.difficulty}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enrollment Summary */}
      {enrollmentStats && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyber-green mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Enrollment Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {enrollmentStats.stats?.totalEnrollments || 0}
              </div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {enrollmentStats.stats?.activeEnrollments || 0}
              </div>
              <div className="text-sm text-gray-400">Active</div>
            </div>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {enrollmentStats.stats?.completedEnrollments || 0}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {enrollmentStats.stats?.completionRate || 0}%
              </div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-cyber-green flex items-center">
            <BookOpenIcon className="w-5 h-5 mr-2" />
            Content in this Module ({content.length})
          </h3>
        </div>

        {content.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            <BookOpenIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No content found in this module.</p>
            <p className="text-sm mt-2">
              <Link to="/content" className="text-cyber-green hover:underline">
                Create new content
              </Link>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {content.map((item, index) => (
              <div
                key={item.id}
                className="px-6 py-4 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`${getContentTypeColor(item.type)}`}>
                      {getContentTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-green-400">
                          {item.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.type === "video"
                              ? "bg-red-900/30 text-red-400"
                              : item.type === "lab"
                              ? "bg-blue-900/30 text-blue-400"
                              : item.type === "game"
                              ? "bg-purple-900/30 text-purple-400"
                              : "bg-green-900/30 text-green-400"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {item.description}
                      </p>
                      {item.section && (
                        <p className="text-xs text-gray-500 mt-1">
                          Section: {item.section}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {item.duration && (
                      <div className="flex items-center text-sm text-gray-400">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {formatDuration(item.duration)}
                      </div>
                    )}
                    <Link
                      to={`/content/${item.id}`}
                      className="text-gray-400 hover:text-cyber-green transition-colors"
                      title="View content details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-cyber-green mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to={`/modules`}
            className="flex items-center w-full px-4 py-2 text-left text-cyan-400 hover:bg-gray-700 rounded transition-colors"
          >
            <PencilIcon className="w-5 h-5 mr-3" />
            Edit Module
          </Link>
          <Link
            to={`/content?moduleId=${moduleId}`}
            className="flex items-center w-full px-4 py-2 text-left text-green-400 hover:bg-gray-700 rounded transition-colors"
          >
            <BookOpenIcon className="w-5 h-5 mr-3" />
            View Content
          </Link>
          {phase && (
            <Link
              to={`/phases/${phase.id}`}
              className="flex items-center w-full px-4 py-2 text-left text-purple-400 hover:bg-gray-700 rounded transition-colors"
            >
              <CubeIcon className="w-5 h-5 mr-3" />
              View Phase
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailView;