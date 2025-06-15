import {
  ArrowLeftIcon,
  BeakerIcon,
  BookOpenIcon,
  ChevronRightIcon,
  ClockIcon,
  CubeIcon,
  DocumentIcon,
  EyeIcon,
  FolderIcon,
  LinkIcon,
  PencilIcon,
  PlayIcon,
  PuzzlePieceIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { contentAPI, modulesAPI, phasesAPI } from "../services/api";

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

  const getContentTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <VideoCameraIcon className="w-6 h-6" />;
      case "lab":
        return <BeakerIcon className="w-6 h-6" />;
      case "game":
        return <PuzzlePieceIcon className="w-6 h-6" />;
      case "document":
        return <DocumentIcon className="w-6 h-6" />;
      default:
        return <BookOpenIcon className="w-6 h-6" />;
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

  const getContentTypeBadgeColor = (type) => {
    const colors = {
      video: "bg-red-500",
      lab: "bg-blue-500",
      game: "bg-purple-500",
      document: "bg-green-500",
    };
    return colors[type] || "bg-gray-500";
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
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm">
        <Link
          to="/content"
          className="text-green-400 hover:text-cyber-green transition-colors"
        >
          Content Management
        </Link>
        <ChevronRightIcon className="w-4 h-4 text-gray-500" />
        {phase && (
          <>
            <Link
              to={`/phases/${phase.id}`}
              className="text-green-400 hover:text-cyber-green transition-colors"
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
              className="text-green-400 hover:text-cyber-green transition-colors"
            >
              {module.title}
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
          </>
        )}
        <span className="text-gray-400">{content.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
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
        <div className="flex items-center space-x-3">
          <Link
            to={`/content`}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Edit Content</span>
          </Link>
        </div>
      </div>

      {/* Content Info Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg border border-cyan-500/30 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div
              className={`p-3 rounded-lg border ${getContentTypeColor(
                content.type
              )}`}
            >
              {getContentTypeIcon(content.type)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{content.title}</h2>
              <p className="text-gray-400 mt-2 max-w-2xl">
                {content.description}
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${getContentTypeBadgeColor(
                    content.type
                  )}`}
                >
                  {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                </span>
                {content.section && (
                  <div className="flex items-center text-cyan-400">
                    <FolderIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">{content.section}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-400">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {formatDuration(content.duration || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Content Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instructions/Details */}
          {content.instructions && (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BookOpenIcon className="w-5 h-5 mr-2 text-cyan-400" />
                Instructions
              </h3>
              <div className="text-gray-300 whitespace-pre-wrap">
                {content.instructions}
              </div>
            </div>
          )}

          {/* Resources */}
          {content.resources && content.resources.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <LinkIcon className="w-5 h-5 mr-2 text-cyan-400" />
                Resources
              </h3>
              <div className="space-y-3">
                {content.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-700 rounded-lg"
                  >
                    <LinkIcon className="w-4 h-4 text-cyan-400 mr-3" />
                    <span className="text-gray-300">{resource}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Content */}
          {relatedContent.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CubeIcon className="w-5 h-5 mr-2 text-cyan-400" />
                Related Content ({relatedContent.length})
              </h3>
              <div className="space-y-3">
                {relatedContent.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded ${getContentTypeBadgeColor(
                          item.type
                        )}`}
                      >
                        {getContentTypeIcon(item.type)}
                      </div>
                      <div>
                        <div className="text-green-400 font-medium">
                          {item.title}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {item.type} • {formatDuration(item.duration || 0)}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/content/${item.id}`}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
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
        <div className="space-y-6">
          {/* Content URL/Link */}
          {content.url && (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <PlayIcon className="w-5 h-5 mr-2 text-cyan-400" />
                Access Content
              </h3>
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
              >
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

          {/* Module Information */}
          {module && (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CubeIcon className="w-5 h-5 mr-2 text-cyan-400" />
                Module Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Module</span>
                  <Link
                    to={`/modules/${module.id}`}
                    className="block text-green-400 hover:text-cyber-green transition-colors font-medium"
                  >
                    {module.title}
                  </Link>
                </div>
                {phase && (
                  <div>
                    <span className="text-gray-400 text-sm">Phase</span>
                    <Link
                      to={`/phases/${phase.id}`}
                      className="block text-green-400 hover:text-cyber-green transition-colors font-medium"
                    >
                      {phase.title}
                    </Link>
                  </div>
                )}
                {module.difficulty && (
                  <div>
                    <span className="text-gray-400 text-sm">Difficulty</span>
                    <div className="text-white font-medium capitalize">
                      {module.difficulty}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Info</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">Type</span>
                <div className="text-white font-medium capitalize">{content.type}</div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Duration</span>
                <div className="text-white font-medium">
                  {formatDuration(content.duration || 0)}
                </div>
              </div>
              {content.section && (
                <div>
                  <span className="text-gray-400 text-sm">Section</span>
                  <div className="text-white font-medium">{content.section}</div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/content`}
                className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
              >
                <PencilIcon className="w-4 h-4 inline mr-2" />
                Edit Content
              </Link>
              {module && (
                <Link
                  to={`/modules/${module.id}`}
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-center"
                >
                  <EyeIcon className="w-4 h-4 inline mr-2" />
                  View Module
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailView;
