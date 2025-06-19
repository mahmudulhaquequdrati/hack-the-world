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
import Breadcrumb from "../components/shared/Breadcrumb";
import ErrorState from "../components/shared/ErrorState";
import LoadingState from "../components/shared/LoadingState";
import NotFoundState from "../components/shared/NotFoundState";
import QuickActionsBar from "../components/shared/QuickActionsBar";
import { getIconFromName } from "../lib/iconUtils";
import { contentAPI, modulesAPI, phasesAPI } from "../services/api";
import {
  calculateContentStatistics,
  formatDuration,
  getContentTypeColor,
  getContentTypeIcon,
  getDifficultyColor,
} from "../utils/contentHelpers.jsx";

const ModuleDetailView = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [phase, setPhase] = useState(null);
  const [content, setContent] = useState([]);
  const [contentBySections, setContentBySections] = useState({});
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
      console.log("🔄 ModuleDetailView: Starting optimized module fetch");

      // OPTIMIZED: Use comprehensive endpoints to reduce API calls from 3 to 2
      const [moduleWithPhaseRes, moduleOverviewRes] = await Promise.allSettled([
        modulesAPI.getByIdWithPhase(moduleId), // Module + Phase in one call
        contentAPI.getModuleOverview(moduleId), // Content + Statistics in one call
      ]);

      // Handle module and phase data
      if (moduleWithPhaseRes.status === "fulfilled") {
        const moduleData =
          moduleWithPhaseRes.value.data || moduleWithPhaseRes.value;
        setModule(moduleData);

        // Extract phase data if available
        if (moduleData.phase) {
          setPhase(moduleData.phase);
        } else if (moduleData.phaseId) {
          // Fallback: fetch phase if not populated in the response
          try {
            const phaseResponse = await phasesAPI.getById(moduleData.phaseId);
            setPhase(phaseResponse.data);
          } catch (phaseError) {
            console.warn("Could not fetch phase details:", phaseError);
          }
        }
      } else {
        // Fallback to individual calls if comprehensive endpoint fails
        console.warn(
          "Module with phase endpoint failed, falling back to individual calls"
        );
        const moduleResponse = await modulesAPI.getById(moduleId);
        const moduleData = moduleResponse.data;
        setModule(moduleData);

        if (moduleData.phaseId) {
          try {
            const phaseResponse = await phasesAPI.getById(moduleData.phaseId);
            setPhase(phaseResponse.data);
          } catch (phaseError) {
            console.warn("Could not fetch phase details:", phaseError);
          }
        }
      }

      // Handle content overview data
      let contentList = [];
      if (moduleOverviewRes.status === "fulfilled") {
        const overviewData =
          moduleOverviewRes.value.data || moduleOverviewRes.value;

        if (overviewData.contentBySections) {
          // OPTIMIZED: Preserve section structure for proper display
          setContentBySections(overviewData.contentBySections);

          // Also create flat list for backwards compatibility
          Object.values(overviewData.contentBySections).forEach((section) => {
            if (Array.isArray(section)) {
              contentList.push(...section);
            }
          });
          setContent(contentList);
        } else if (overviewData.content) {
          contentList = overviewData.content;
          setContent(contentList);
          // Group content by sections if no section data available
          const grouped = contentList.reduce((acc, item) => {
            const section = item.section || "General";
            if (!acc[section]) acc[section] = [];
            acc[section].push(item);
            return acc;
          }, {});
          setContentBySections(grouped);
        } else {
          // FIXED: Handle API response where content is directly in data object by section keys
          // API returns: {"something": [...], "anotherSection": [...]}
          const sections = {};
          let hasContent = false;

          Object.entries(overviewData).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0 && value[0]._id) {
              // This looks like a content array
              sections[key] = value.map((item) => ({
                ...item,
                id: item._id || item.id, // Normalize id field
              }));
              contentList.push(...sections[key]);
              hasContent = true;
            }
          });

          if (hasContent) {
            setContentBySections(sections);
            setContent(contentList);
          }
        }

        // Use statistics from overview if available
        if (overviewData.statistics) {
          setStatistics(overviewData.statistics);
        } else {
          // Calculate statistics from content list
          setStatistics(calculateContentStatistics(contentList));
        }
      } else {
        // Fallback to individual content fetch
        console.warn(
          "Module overview endpoint failed, falling back to individual content fetch"
        );
        const contentResponse = await contentAPI.getByModule(moduleId);
        contentList = contentResponse.data || [];
        setContent(contentList);
        setStatistics(calculateContentStatistics(contentList));

        // Group content by sections for fallback
        const grouped = contentList.reduce((acc, item) => {
          const section = item.section || "General";
          if (!acc[section]) acc[section] = [];
          acc[section].push(item);
          return acc;
        }, {});
        setContentBySections(grouped);
      }
    } catch (error) {
      console.error("Error fetching module data:", error);
      setError(
        error.response?.data?.message || "Failed to load module details"
      );
    } finally {
      setLoading(false);
      console.log("✅ ModuleDetailView: Module fetch completed");
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
              {/* Content by Sections */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <BookOpenIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Content by Sections{" "}
                    <span className="text-gray-400 text-lg">
                      ({content.length} total)
                    </span>
                  </h2>
                </div>

                {Object.keys(contentBySections).length === 0 ? (
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
                  <div className="space-y-6">
                    {Object.entries(contentBySections).map(
                      ([sectionName, sectionContent]) => (
                        <div key={sectionName} className="space-y-4">
                          {/* Section Header */}
                          <div className="flex items-center space-x-3 pb-2 border-b border-gray-600/50">
                            <h3 className="text-lg font-semibold text-white">
                              {sectionName}
                            </h3>
                            <span className="px-2 py-1 bg-gray-600/50 rounded-full text-xs text-gray-300">
                              {sectionContent.length} items
                            </span>
                          </div>

                          {/* Section Content Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {sectionContent.map((item) => (
                              <div
                                key={item.id}
                                className="p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
                              >
                                {/* Content Header */}
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`p-2 rounded-lg border ${getContentTypeColor(
                                        item.type
                                      )}`}
                                    >
                                      {getContentTypeIcon(item.type, "w-5 h-5")}
                                    </div>
                                    <div>
                                      <h4 className="text-white font-medium group-hover:text-green-400 transition-colors leading-tight">
                                        {item.title}
                                      </h4>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-xs px-2 py-1 bg-gray-600/50 rounded text-gray-300 uppercase">
                                          {item.type}
                                        </span>
                                        <span className="text-gray-400 text-xs">
                                          {formatDuration(item.duration || 0)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <Link
                                    to={`/content/${item.id}`}
                                    className="p-2 bg-green-600/20 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-600/30 transition-colors opacity-0 group-hover:opacity-100"
                                    title="View Details"
                                  >
                                    <EyeIcon className="w-4 h-4" />
                                  </Link>
                                </div>

                                {/* Content Description */}
                                {item.description && (
                                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                                    {item.description}
                                  </p>
                                )}

                                {/* Content Footer */}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600/30">
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    {item.order && <span>#{item.order}</span>}
                                    {item.isActive !== undefined && (
                                      <span
                                        className={`px-2 py-1 rounded ${
                                          item.isActive
                                            ? "bg-green-600/20 text-green-400"
                                            : "bg-red-600/20 text-red-400"
                                        }`}
                                      >
                                        {item.isActive ? "Active" : "Inactive"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
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
