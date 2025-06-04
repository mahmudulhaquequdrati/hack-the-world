import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon,
  EyeIcon,
  PlayIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { progressAPI } from "../services/api";

const MyGames = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    games: 0,
    challenges: 0,
    notStarted: 0,
    inProgress: 0,
    completed: 0,
    totalDuration: 0,
    averageProgress: 0,
    totalTimeSpent: 0,
    averageScore: 0,
  });
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, not-started, in-progress, completed
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchMyGames();
    }
  }, [user]);

  const fetchMyGames = async () => {
    try {
      setLoading(true);
      setError("");

      // Use the new detailed progress API endpoint
      const response = await progressAPI.getUserGamesProgress(user.id);

      if (response.success && response.data) {
        setGames(response.data.games || []);
        setStatistics(
          response.data.statistics || {
            total: 0,
            games: 0,
            challenges: 0,
            notStarted: 0,
            inProgress: 0,
            completed: 0,
            totalDuration: 0,
            averageProgress: 0,
            totalTimeSpent: 0,
            averageScore: 0,
          }
        );
        setModules(response.data.modules || []);
      } else {
        setError("Failed to load your games. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching my games:", error);
      setError("Failed to load your games. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getGameStatus = (game) => {
    // Now we get real progress data from the server
    if (game.progress) {
      return game.progress.status;
    }
    return "not-started";
  };

  const getGameProgress = (game) => {
    // Get real progress percentage from the server
    if (game.progress) {
      return {
        percentage: game.progress.progressPercentage || 0,
        timeSpent: game.progress.timeSpent || 0,
        score: game.progress.score || null,
        maxScore: game.progress.maxScore || null,
        startedAt: game.progress.startedAt || null,
        completedAt: game.progress.completedAt || null,
      };
    }
    return {
      percentage: 0,
      timeSpent: 0,
      score: null,
      maxScore: null,
      startedAt: null,
      completedAt: null,
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      "not-started": "text-gray-400 bg-gray-900/20 border-gray-500/30",
      "in-progress": "text-yellow-400 bg-yellow-900/20 border-yellow-500/30",
      completed: "text-green-400 bg-green-900/20 border-green-500/30",
      "not-available": "text-red-400 bg-red-900/20 border-red-500/30",
    };
    return colors[status] || colors["not-started"];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "not-started":
        return <DocumentIcon className="w-4 h-4" />;
      case "in-progress":
        return <PlayIcon className="w-4 h-4" />;
      case "completed":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "not-available":
        return <XMarkIcon className="w-4 h-4" />;
      default:
        return <DocumentIcon className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      "not-started": "Not Started",
      "in-progress": "In Progress",
      completed: "Completed",
      "not-available": "Not Available",
    };
    return labels[status] || "Unknown";
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: "bg-green-500 text-black",
      Intermediate: "bg-yellow-500 text-black",
      Advanced: "bg-orange-500 text-black",
      Expert: "bg-red-500 text-white",
    };
    return colors[difficulty] || "bg-gray-500 text-white";
  };

  const getGameTypeColor = (type) => {
    const colors = {
      game: "bg-purple-500 text-white",
      challenge: "bg-indigo-500 text-white",
    };
    return colors[type] || "bg-gray-500 text-white";
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const calculateStats = () => {
    // Use server-provided statistics if available, otherwise fall back to manual calculation
    if (statistics && statistics.total > 0) {
      return {
        total: statistics.total,
        games: statistics.games,
        challenges: statistics.challenges,
        notStarted: statistics.notStarted,
        inProgress: statistics.inProgress,
        completed: statistics.completed,
        totalDuration: statistics.totalDuration,
        averageProgress: statistics.averageProgress,
        totalTimeSpent: statistics.totalTimeSpent,
        averageScore: statistics.averageScore,
      };
    }

    // Fallback to manual calculation if server stats not available
    const stats = {
      total: games.length,
      games: games.filter((g) => g.type === "game").length,
      challenges: games.filter((g) => g.type === "challenge").length,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
      totalDuration: 0,
      averageProgress: 0,
      totalTimeSpent: 0,
      averageScore: 0,
    };

    games.forEach((game) => {
      const status = getGameStatus(game);
      const progress = getGameProgress(game);

      switch (status) {
        case "not-started":
          stats.notStarted++;
          break;
        case "in-progress":
          stats.inProgress++;
          break;
        case "completed":
          stats.completed++;
          break;
      }
      stats.totalDuration += game.duration || 0;
      stats.totalTimeSpent += progress.timeSpent || 0;
    });

    if (games.length > 0) {
      stats.averageProgress = Math.round(
        games.reduce(
          (sum, game) => sum + (getGameProgress(game).percentage || 0),
          0
        ) / games.length
      );
    }

    return stats;
  };

  const filteredGames = games.filter((game) => {
    if (filter !== "all") {
      const status = getGameStatus(game);
      if (status !== filter) return false;
    }

    if (searchTerm) {
      const gameTitle = game.title?.toLowerCase() || "";
      const module = modules.find((m) => m.id === game.moduleId);
      const moduleTitle = module?.title?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      return gameTitle.includes(search) || moduleTitle.includes(search);
    }

    return true;
  });

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyber-green">Loading your games...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cyber-green">
            [MY GAMES]
          </h1>
          <p className="text-green-400 mt-2">
            Challenge yourself with interactive cybersecurity games and puzzles
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm text-gray-400">
            <PuzzlePieceIcon className="w-5 h-5 mr-2" />
            <span>{stats.total} games available</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center">
          <XMarkIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <PuzzlePieceIcon className="w-8 h-8 text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-bold text-cyber-green">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <PuzzlePieceIcon className="w-8 h-8 text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Games</p>
              <p className="text-2xl font-bold text-cyber-green">
                {stats.games}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <PuzzlePieceIcon className="w-8 h-8 text-indigo-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Challenges</p>
              <p className="text-2xl font-bold text-cyber-green">
                {stats.challenges}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-cyber-green">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="w-8 h-8 text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Time Spent</p>
              <p className="text-2xl font-bold text-cyber-green">
                {formatDuration(stats.totalTimeSpent)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      {(stats.averageProgress > 0 || stats.averageScore > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <TrophyIcon className="w-8 h-8 text-orange-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Average Progress</p>
                <p className="text-2xl font-bold text-cyber-green">
                  {stats.averageProgress}%
                </p>
              </div>
            </div>
          </div>

          {stats.averageScore > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Average Score</p>
                  <p className="text-2xl font-bold text-cyber-green">
                    {Math.round(stats.averageScore)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <PlayIcon className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-cyber-green">
                  {stats.inProgress}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All", count: stats.total },
              {
                key: "not-started",
                label: "Not Started",
                count: stats.notStarted,
              },
              {
                key: "in-progress",
                label: "In Progress",
                count: stats.inProgress,
              },
              { key: "completed", label: "Completed", count: stats.completed },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-green-400 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-cyber-green flex items-center">
            <PuzzlePieceIcon className="w-5 h-5 mr-2" />
            Available Games ({filteredGames.length})
          </h3>
        </div>

        {filteredGames.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            <PuzzlePieceIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">
              {filter === "all"
                ? "No games found"
                : `No ${getStatusLabel(filter).toLowerCase()} games`}
            </p>
            <p className="text-sm">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Enroll in modules to access interactive games!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredGames.map((game) => {
              const module = modules.find((m) => m.id === game.moduleId);
              const status = getGameStatus(game);
              const progress = getGameProgress(game);

              return (
                <div
                  key={game.id}
                  className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/80 transition-colors"
                >
                  {/* Game Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <PuzzlePieceIcon className="w-6 h-6 text-purple-400" />
                      <div
                        className={`flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(
                          status
                        )}`}
                      >
                        {getStatusIcon(status)}
                        <span className="ml-1">{getStatusLabel(status)}</span>
                      </div>
                    </div>
                    {game.duration && (
                      <div className="flex items-center text-xs text-gray-400">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {formatDuration(game.duration)}
                      </div>
                    )}
                  </div>

                  {/* Game Content */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-purple-400 text-lg line-clamp-2">
                      {game.title}
                    </h4>

                    <p className="text-sm text-gray-400 line-clamp-3">
                      {game.description || "Game description not available"}
                    </p>

                    {/* Game Type Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${getGameTypeColor(
                          game.type
                        )}`}
                      >
                        {game.type === "game" ? "Game" : "Challenge"}
                      </span>
                      {game.points && (
                        <div className="flex items-center text-xs text-yellow-400">
                          <TrophyIcon className="w-3 h-3 mr-1" />
                          {game.points} pts
                        </div>
                      )}
                    </div>

                    {/* Module Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Module:</span>
                        <span className="text-xs text-green-400">
                          {module?.title || `Module ${game.moduleId}`}
                        </span>
                      </div>
                      {module?.difficulty && (
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(
                            module.difficulty
                          )}`}
                        >
                          {module.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar for In Progress Games */}
                    {status === "in-progress" && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">
                            Progress
                          </span>
                          <span className="text-xs font-medium text-cyber-green">
                            {progress.percentage || 0}%
                          </span>
                        </div>
                        <div className="bg-gray-600 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-indigo-400 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage || 0}%` }}
                          ></div>
                        </div>
                        {progress.timeSpent > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Time Spent: {formatDuration(progress.timeSpent)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Completion Info for Completed Games */}
                    {status === "completed" && (
                      <div className="space-y-1">
                        {progress.score !== null &&
                          progress.maxScore !== null && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                Score
                              </span>
                              <span className="text-xs font-medium text-cyber-green">
                                {progress.score}/{progress.maxScore} (
                                {Math.round(
                                  (progress.score / progress.maxScore) * 100
                                )}
                                %)
                              </span>
                            </div>
                          )}
                        {progress.timeSpent > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              Time Spent
                            </span>
                            <span className="text-xs text-gray-300">
                              {formatDuration(progress.timeSpent)}
                            </span>
                          </div>
                        )}
                        {progress.completedAt && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              Completed
                            </span>
                            <span className="text-xs text-gray-300">
                              {new Date(
                                progress.completedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Section Info */}
                    {game.section && (
                      <div className="text-xs text-gray-500">
                        Section: {game.section}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-600">
                    <div className="flex items-center space-x-2">
                      {module && (
                        <Link
                          to={`/content/${game.id}`}
                          className="text-xs text-green-400 hover:text-cyber-green transition-colors"
                          title="View Module"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                      )}
                    </div>

                    <button
                      className={`flex items-center px-3 py-1 rounded text-xs font-medium transition-colors ${
                        status === "not-started" || status === "in-progress"
                          ? "bg-purple-600 text-white hover:bg-purple-500"
                          : status === "completed"
                          ? "bg-green-600 text-white hover:bg-green-500"
                          : "bg-gray-600 text-gray-300 cursor-not-allowed"
                      }`}
                      disabled={status === "not-available"}
                    >
                      {status === "completed" ? (
                        <>
                          <TrophyIcon className="w-3 h-3 mr-1" />
                          Replay
                        </>
                      ) : status === "not-available" ? (
                        <>
                          <XMarkIcon className="w-3 h-3 mr-1" />
                          Locked
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-3 h-3 mr-1" />
                          {status === "in-progress" ? "Continue" : "Play"}
                        </>
                      )}
                      <ArrowRightIcon className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGames;
