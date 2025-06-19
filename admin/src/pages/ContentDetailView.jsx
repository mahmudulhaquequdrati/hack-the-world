import {
  BookOpenIcon,
  ClockIcon,
  CubeIcon,
  EyeIcon,
  LinkIcon,
  PlayIcon,
  StarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Gauge } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { contentAPI, modulesAPI, phasesAPI } from "../services/api";
import {
  formatDuration,
  getContentTypeIcon,
  getContentTypeColor,
} from "../utils/contentHelpers.jsx";
import Breadcrumb from "../components/shared/Breadcrumb";
import ErrorState from "../components/shared/ErrorState";
import LoadingState from "../components/shared/LoadingState";
import NotFoundState from "../components/shared/NotFoundState";
import QuickActionsBar from "../components/shared/QuickActionsBar";

const ContentDetailView = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [module, setModule] = useState(null);
  const [phase, setPhase] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (contentId) {
      fetchContentData();
    }
  }, [contentId]);

  const fetchContentData = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 ContentDetailView: Starting optimized content fetch");

      // OPTIMIZED: Use admin-specific endpoint for content + module (no progress tracking)
      // This replaces the original 4 separate API calls with simple admin-focused data
      const [contentWithModuleRes] = await Promise.allSettled([
        contentAPI.getByIdWithModule(contentId), // Simple endpoint for admin details
      ]);

      if (contentWithModuleRes.status === "fulfilled") {
        const response = contentWithModuleRes.value;
        const contentData = response.data || response;

        // Set content data (includes module information)
        setContent(contentData);

        // Extract module data from the response
        if (contentData.module) {
          setModule(contentData.module);

          // Get phase info from module if available, or fetch it
          if (contentData.module.phase) {
            setPhase(contentData.module.phase);
          } else if (contentData.module.phaseId) {
            // Fetch phase if not populated in module
            try {
              const phaseResponse = await phasesAPI.getById(
                contentData.module.phaseId
              );
              setPhase(phaseResponse.data);
            } catch (phaseError) {
              console.warn("Could not fetch phase details:", phaseError);
            }
          }

          // REMOVED: Unnecessary related content API call
          // For admin content details, we don't need to show related content
          // This eliminates one API call and focuses on the content itself
        }
      } else {
        // Fallback to basic content fetch if optimized endpoint fails
        console.warn(
          "Admin content endpoint failed, falling back to basic calls"
        );
        const contentResponse = await contentAPI.getById(contentId);
        const contentData = contentResponse.data;
        setContent(contentData);

        // If content has module ID, fetch module and related content
        if (contentData.module?.id || contentData.moduleId) {
          const moduleId = contentData.module?.id || contentData.moduleId;

          try {
            // Fetch module details
            const moduleResponse = await modulesAPI.getById(moduleId);
            const moduleData = moduleResponse.data;
            setModule(moduleData);

            // Fetch phase if module has phaseId
            if (moduleData.phaseId) {
              try {
                const phaseResponse = await phasesAPI.getById(
                  moduleData.phaseId
                );
                setPhase(phaseResponse.data);
              } catch (phaseError) {
                console.warn("Could not fetch phase details:", phaseError);
              }
            }

            // REMOVED: Related content fetch - not needed for admin content details
          } catch (moduleError) {
            console.warn("Could not fetch module details:", moduleError);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching content data:", error);
      setError(
        error.response?.data?.message || "Failed to load content details"
      );
    } finally {
      setLoading(false);
      console.log("✅ ContentDetailView: Content fetch completed");
    }
  };

  if (loading) {
    return <LoadingState message="Loading content details..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Content Details"
        onBack={() => navigate("/content")}
      />
    );
  }

  if (!content) {
    return (
      <NotFoundState
        title="Content Details"
        message="Content not found."
        onBack={() => navigate("/content")}
      />
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
            <Breadcrumb
              onBack={() => navigate("/content")}
              backLabel="Content"
              items={[
                ...(phase
                  ? [{ label: phase.title, href: `/phases/${phase.id}` }]
                  : []),
                ...(module
                  ? [{ label: module.title, href: `/modules/${module.id}` }]
                  : []),
                { label: content.title },
              ]}
            />

            <QuickActionsBar
              editPath="/content"
              editLabel="Edit"
              showDelete={false}
            />
          </div>

          {/* Hero Content */}
          <div className="flex items-start space-x-6">
            {/* Large Content Type Icon */}
            <div
              className={`p-4 rounded-2xl border-2 ${getContentTypeColor(
                content.type
              )} backdrop-blur-sm`}
            >
              {getContentTypeIcon(content.type, "w-12 h-12")}
            </div>

            {/* Title and Meta */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getContentTypeColor(
                    content.type
                  )}`}
                >
                  {content.type}
                </span>
                {content.section && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                    {content.section}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
                {content.title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
                {content.description}
              </p>

              {/* Key Metrics */}
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center text-gray-400">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    {formatDuration(content.duration || 0)}
                  </span>
                </div>
                {module && (
                  <div className="flex items-center text-gray-400">
                    <CubeIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">{module.title}</span>
                  </div>
                )}
                {phase && (
                  <div className="flex items-center text-gray-400">
                    <StarIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">{phase.title}</span>
                  </div>
                )}
                {module?.difficulty && (
                  <div className="flex items-center text-gray-400">
                    <Gauge className="w-5 h-5 mr-2" />
                    <span className="font-medium">{module.difficulty}</span>
                  </div>
                )}
              </div>

              {/* Primary Action Button */}
              {content.url && (
                <div className="mt-8">
                  <a
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <PlayIcon className="w-6 h-6 mr-3" />
                    {content.type === "video"
                      ? "Watch Video"
                      : content.type === "lab"
                      ? "Start Lab"
                      : content.type === "game"
                      ? "Play Game"
                      : "View Document"}
                  </a>
                </div>
              )}
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
              {/* Instructions Section */}
              {content.instructions && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <BookOpenIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Instructions
                    </h2>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                      {content.instructions}
                    </div>
                  </div>
                </div>
              )}

              {/* Resources Section */}
              {content.resources && content.resources.length > 0 && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <LinkIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Resources{" "}
                      <span className="text-gray-400 text-lg">
                        ({content.resources.length})
                      </span>
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {content.resources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-gray-700/50 rounded-xl border border-gray-600/50 hover:bg-gray-700 transition-colors"
                      >
                        <div className="p-2 bg-purple-600/20 rounded-lg mr-4">
                          <LinkIcon className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-gray-300 font-medium">
                          {resource}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REMOVED: Related Content Section - not needed for admin details */}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Content Info Card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-cyan-600/20 rounded-lg">
                    <InformationCircleIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Content Info</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400 text-sm">Type</span>
                    <span className="text-white font-medium capitalize">
                      {content.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400 text-sm">Duration</span>
                    <span className="text-white font-medium">
                      {formatDuration(content.duration || 0)}
                    </span>
                  </div>
                  {content.section && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                      <span className="text-gray-400 text-sm">Section</span>
                      <span className="text-white font-medium">
                        {content.section}
                      </span>
                    </div>
                  )}
                  {content.order && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                      <span className="text-gray-400 text-sm">Order</span>
                      <span className="text-white font-medium">
                        #{content.order}
                      </span>
                    </div>
                  )}
                  {content.isActive !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                      <span className="text-gray-400 text-sm">Status</span>
                      <span
                        className={`font-medium ${
                          content.isActive ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {content.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400 text-sm">Content ID</span>
                    <span className="text-white font-mono text-xs">
                      {content.id}
                    </span>
                  </div>
                  {content.createdAt && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                      <span className="text-gray-400 text-sm">Created</span>
                      <span className="text-white text-xs">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {content.updatedAt && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400 text-sm">Updated</span>
                      <span className="text-white text-xs">
                        {new Date(content.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Metadata Card */}
              {content.metadata && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <StarIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Metadata</h3>
                  </div>
                  <div className="space-y-4">
                    {content.metadata.difficulty && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400 text-sm">
                          Difficulty
                        </span>
                        <span className="text-white font-medium">
                          {content.metadata.difficulty}
                        </span>
                      </div>
                    )}
                    {content.metadata.estimatedTime && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400 text-sm">Est. Time</span>
                        <span className="text-white font-medium">
                          {content.metadata.estimatedTime}
                        </span>
                      </div>
                    )}
                    {content.metadata.tags &&
                      content.metadata.tags.length > 0 && (
                        <div className="py-2 border-b border-gray-700/50">
                          <span className="text-gray-400 text-sm block mb-2">
                            Tags
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {content.metadata.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-600/50 rounded text-xs text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    {content.metadata.prerequisites &&
                      content.metadata.prerequisites.length > 0 && (
                        <div className="py-2 border-b border-gray-700/50">
                          <span className="text-gray-400 text-sm block mb-2">
                            Prerequisites
                          </span>
                          <div className="space-y-1">
                            {content.metadata.prerequisites.map(
                              (prereq, index) => (
                                <div key={index} className="text-white text-sm">
                                  • {prereq}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    {content.metadata.tools &&
                      content.metadata.tools.length > 0 && (
                        <div className="py-2 border-b border-gray-700/50">
                          <span className="text-gray-400 text-sm block mb-2">
                            Tools
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {content.metadata.tools.map((tool, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs border border-blue-600/30"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    {content.metadata.objectives &&
                      content.metadata.objectives.length > 0 && (
                        <div className="py-2">
                          <span className="text-gray-400 text-sm block mb-2">
                            Learning Objectives
                          </span>
                          <div className="space-y-1">
                            {content.metadata.objectives.map(
                              (objective, index) => (
                                <div key={index} className="text-white text-sm">
                                  {index + 1}. {objective}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailView;
