import {
  ArrowLeftIcon,
  BeakerIcon,
  BookOpenIcon,
  ChevronRightIcon,
  ClockIcon,
  CubeIcon,
  DocumentIcon,
  EyeIcon,
  LinkIcon,
  PencilIcon,
  PlayIcon,
  PuzzlePieceIcon,
  VideoCameraIcon,
  StarIcon,
  ChartBarIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  ShareIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { contentAPI, modulesAPI, phasesAPI } from "../services/api";
import { Gauge } from "lucide-react";

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

      // Fetch content details
      const contentResponse = await contentAPI.getById(contentId);
      const contentData = contentResponse.data;
      setContent(contentData);

      // Fetch module details if content has a moduleId
      if (contentData.module?.id || contentData.moduleId) {
        try {
          const moduleId = contentData.module?.id || contentData.moduleId;
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

          // Fetch related content from the same module
          try {
            const relatedResponse = await contentAPI.getByModule(moduleId);
            const relatedList = relatedResponse.data || [];
            // Filter out current content
            setRelatedContent(
              relatedList.filter((item) => item.id !== contentId)
            );
          } catch (relatedError) {
            console.warn("Could not fetch related content:", relatedError);
          }
        } catch (moduleError) {
          console.warn("Could not fetch module details:", moduleError);
        }
      }
    } catch (error) {
      console.error("Error fetching content data:", error);
      setError(
        error.response?.data?.message || "Failed to load content details"
      );
    } finally {
      setLoading(false);
    }
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

  const getContentTypeIcon = (type, size = "w-6 h-6") => {
    switch (type) {
      case "video":
        return <VideoCameraIcon className={size} />;
      case "lab":
        return <BeakerIcon className={size} />;
      case "game":
        return <PuzzlePieceIcon className={size} />;
      case "document":
        return <DocumentIcon className={size} />;
      default:
        return <BookOpenIcon className={size} />;
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
        <div className="text-cyber-green">Loading content details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/content")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">
            Content Details
          </h1>
        </div>
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/content")}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">
            Content Details
          </h1>
        </div>
        <div className="text-gray-400">Content not found.</div>
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
            <div className="flex items-center space-x-3 text-sm">
              <button
                onClick={() => navigate("/content")}
                className="flex items-center text-green-400 hover:text-green-300 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Content
              </button>
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              {phase && (
                <>
                  <Link
                    to={`/phases/${phase.id}`}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    {phase.title}
                  </Link>
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                </>
              )}
              {module && (
                <>
                  <Link
                    to={`/modules/${module.id}`}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    {module.title}
                  </Link>
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                </>
              )}
              <span className="text-gray-400">{content.title}</span>
            </div>

            {/* Quick Actions Floating Bar */}
            <div className="flex items-center space-x-2 bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-full px-4 py-2 shadow-lg">
              <Link
                to={`/content`}
                className="flex items-center justify-center p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-600/20 rounded-lg transition-all duration-200 group"
                title="Edit Content"
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
                title="Delete Content"
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
                {module.difficulty && (
                  <div className="flex items-center text-gray-400">
                    {/* Difficulty */}
                    <Gauge className="w-5 h-5 mr-2" />
                    <span className={`font-medium`}>{module.difficulty}</span>
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

              {/* Related Content Section */}
              {relatedContent.length > 0 && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-green-600/20 rounded-lg">
                      <CubeIcon className="w-6 h-6 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Related Content{" "}
                      <span className="text-gray-400 text-lg">
                        ({relatedContent.length})
                      </span>
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {relatedContent.slice(0, 5).map((item) => (
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
                </div>
              )}
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
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm">Content ID</span>
                    <span className="text-white font-mono text-xs">
                      {content.id}
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

export default ContentDetailView;
