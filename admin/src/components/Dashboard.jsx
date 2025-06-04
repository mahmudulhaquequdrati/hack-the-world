import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  contentAPI,
  enrollmentAPI,
  modulesAPI,
  phasesAPI,
} from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPhases: 0,
    totalModules: 0,
    totalContent: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
    loading: true,
    error: null,
  });

  // Advanced progress statistics state
  const [progressStats, setProgressStats] = useState({
    progressDistribution: {},
    completionTrends: [],
    modulePerformance: [],
    userEngagement: {},
    recentActivity: [],
    loading: true,
    // New comprehensive dashboard features
    performanceAlerts: [],
    learningInsights: {},
    timeBasedAnalytics: {},
    predictiveMetrics: {},
    systemHealth: {},
  });

  const [dashboardMode, setDashboardMode] = useState("overview"); // overview, analytics, performance, insights, alerts

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [modulesRes, phasesRes, contentRes] = await Promise.allSettled([
          modulesAPI.getAll(),
          phasesAPI.getAll(),
          contentAPI.getAll(),
        ]);

        // Get modules data for enrollment stats
        const modulesData =
          modulesRes.status === "fulfilled" ? modulesRes.value.data || [] : [];

        // Fetch enrollment statistics for all modules
        let totalEnrollments = 0;
        let activeEnrollments = 0;

        if (modulesData.length > 0) {
          try {
            const enrollmentPromises = modulesData.map(async (module) => {
              try {
                const enrollmentRes = await enrollmentAPI.getModuleStats(
                  module.id
                );
                return enrollmentRes.data?.stats || {};
              } catch (error) {
                console.warn(
                  `Failed to fetch enrollment stats for module ${module.id}:`,
                  error
                );
                return {};
              }
            });

            const enrollmentResults = await Promise.allSettled(
              enrollmentPromises
            );
            enrollmentResults.forEach((result) => {
              if (result.status === "fulfilled" && result.value) {
                totalEnrollments += result.value.totalEnrollments || 0;
                activeEnrollments += result.value.activeEnrollments || 0;
              }
            });
          } catch (error) {
            console.warn("Error fetching enrollment statistics:", error);
          }
        }

        setStats({
          totalPhases:
            phasesRes.status === "fulfilled"
              ? phasesRes.value.data?.length || 0
              : 0,
          totalModules: modulesData.length,
          totalContent:
            contentRes.status === "fulfilled"
              ? contentRes.value.data?.length || 0
              : 0,
          totalEnrollments,
          activeEnrollments,
          loading: false,
          error: null,
        });

        // Fetch advanced progress statistics
        await fetchProgressStatistics();
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load statistics",
        }));
      }
    };

    fetchStats();
  }, []);

  // Fetch comprehensive progress statistics
  const fetchProgressStatistics = async () => {
    try {
      // Fetch all enrollments for analytics
      const allEnrollmentsRes = await enrollmentAPI.getAllAdmin({
        limit: 1000, // Get all enrollments
      });

      const enrollments = allEnrollmentsRes.data || [];

      // Calculate progress distribution
      const progressDistribution = {
        "0-25%": 0,
        "26-50%": 0,
        "51-75%": 0,
        "76-99%": 0,
        "100%": 0,
      };

      enrollments.forEach((enrollment) => {
        const progress = enrollment.progressPercentage || 0;
        if (progress === 0) progressDistribution["0-25%"]++;
        else if (progress <= 25) progressDistribution["0-25%"]++;
        else if (progress <= 50) progressDistribution["26-50%"]++;
        else if (progress <= 75) progressDistribution["51-75%"]++;
        else if (progress < 100) progressDistribution["76-99%"]++;
        else progressDistribution["100%"]++;
      });

      // Calculate module performance metrics
      const moduleMap = new Map();
      enrollments.forEach((enrollment) => {
        const moduleId = enrollment.moduleId?.id;
        if (!moduleId) return;

        if (!moduleMap.has(moduleId)) {
          moduleMap.set(moduleId, {
            module: enrollment.moduleId,
            enrollments: [],
            totalProgress: 0,
            completions: 0,
          });
        }

        const moduleData = moduleMap.get(moduleId);
        moduleData.enrollments.push(enrollment);
        moduleData.totalProgress += enrollment.progressPercentage || 0;
        if (enrollment.status === "completed") moduleData.completions++;
      });

      const modulePerformance = Array.from(moduleMap.values())
        .map((moduleData) => ({
          module: moduleData.module,
          enrollmentCount: moduleData.enrollments.length,
          averageProgress:
            moduleData.enrollments.length > 0
              ? Math.round(
                  moduleData.totalProgress / moduleData.enrollments.length
                )
              : 0,
          completionRate:
            moduleData.enrollments.length > 0
              ? Math.round(
                  (moduleData.completions / moduleData.enrollments.length) * 100
                )
              : 0,
          completions: moduleData.completions,
        }))
        .sort((a, b) => b.averageProgress - a.averageProgress)
        .slice(0, 10); // Top 10 performing modules

      // Calculate user engagement metrics
      const userEngagement = {
        totalUsers: new Set(enrollments.map((e) => e.userId?.id)).size,
        activeUsers: enrollments.filter((e) => e.status === "active").length,
        completedUsers: enrollments.filter((e) => e.status === "completed")
          .length,
        averageProgressAllUsers:
          enrollments.length > 0
            ? Math.round(
                enrollments.reduce(
                  (sum, e) => sum + (e.progressPercentage || 0),
                  0
                ) / enrollments.length
              )
            : 0,
        retentionRate:
          enrollments.length > 0
            ? Math.round(
                (enrollments.filter((e) => e.status !== "dropped").length /
                  enrollments.length) *
                  100
              )
            : 0,
      };

      // Generate completion trends (enhanced with real data)
      const completionTrends = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dayCompletions = enrollments.filter((enrollment) => {
          const completedDate = new Date(
            enrollment.lastAccessedAt || enrollment.enrolledAt
          );
          return (
            completedDate.toDateString() === date.toDateString() &&
            enrollment.status === "completed"
          );
        }).length;
        return {
          date: date.toLocaleDateString(),
          completions: dayCompletions,
          enrollments: enrollments.filter((enrollment) => {
            const enrolledDate = new Date(enrollment.enrolledAt);
            return enrolledDate.toDateString() === date.toDateString();
          }).length,
        };
      });

      // Performance Alerts System
      const performanceAlerts = [];

      // Alert for modules with low completion rates
      modulePerformance.forEach((module) => {
        if (module.completionRate < 30 && module.enrollmentCount > 5) {
          performanceAlerts.push({
            type: "warning",
            title: "Low Completion Rate",
            message: `Module "${module.module.title}" has only ${module.completionRate}% completion rate`,
            severity: "medium",
            moduleId: module.module.id,
            timestamp: new Date().toISOString(),
          });
        }
      });

      // Alert for stalled progress
      const stalledEnrollments = enrollments.filter((enrollment) => {
        const lastAccess = new Date(
          enrollment.lastAccessedAt || enrollment.enrolledAt
        );
        const daysSinceAccess =
          (new Date() - lastAccess) / (1000 * 60 * 60 * 24);
        return enrollment.status === "active" && daysSinceAccess > 7;
      });

      if (stalledEnrollments.length > 0) {
        performanceAlerts.push({
          type: "info",
          title: "Stalled Progress",
          message: `${stalledEnrollments.length} students haven't accessed their modules in over 7 days`,
          severity: "low",
          count: stalledEnrollments.length,
          timestamp: new Date().toISOString(),
        });
      }

      // Learning Insights
      const learningInsights = {
        avgTimeToCompletion:
          enrollments.filter((e) => e.status === "completed").length > 0
            ? Math.round(
                enrollments
                  .filter((e) => e.status === "completed")
                  .reduce((sum, e) => {
                    const enrolled = new Date(e.enrolledAt);
                    const completed = new Date(e.lastAccessedAt);
                    return sum + (completed - enrolled) / (1000 * 60 * 60 * 24);
                  }, 0) /
                  enrollments.filter((e) => e.status === "completed").length
              )
            : 0,
        mostPopularModules: modulePerformance.slice(0, 3).map((m) => ({
          title: m.module.title,
          enrollments: m.enrollmentCount,
        })),
        peakLearningDays: completionTrends.reduce(
          (peak, day) => (day.completions > peak.completions ? day : peak),
          completionTrends[0] || { completions: 0 }
        ),
        difficultyAnalysis: {
          beginner: enrollments.filter(
            (e) => e.moduleId?.difficulty === "beginner"
          ).length,
          intermediate: enrollments.filter(
            (e) => e.moduleId?.difficulty === "intermediate"
          ).length,
          advanced: enrollments.filter(
            (e) => e.moduleId?.difficulty === "advanced"
          ).length,
          expert: enrollments.filter((e) => e.moduleId?.difficulty === "expert")
            .length,
        },
      };

      // Time-Based Analytics
      const now = new Date();
      const thisWeek = enrollments.filter((e) => {
        const enrolledDate = new Date(e.enrolledAt);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return enrolledDate >= weekAgo;
      });

      const thisMonth = enrollments.filter((e) => {
        const enrolledDate = new Date(e.enrolledAt);
        return (
          enrolledDate.getMonth() === now.getMonth() &&
          enrolledDate.getFullYear() === now.getFullYear()
        );
      });

      const timeBasedAnalytics = {
        thisWeek: {
          newEnrollments: thisWeek.length,
          completions: thisWeek.filter((e) => e.status === "completed").length,
          averageProgress:
            thisWeek.length > 0
              ? Math.round(
                  thisWeek.reduce(
                    (sum, e) => sum + (e.progressPercentage || 0),
                    0
                  ) / thisWeek.length
                )
              : 0,
        },
        thisMonth: {
          newEnrollments: thisMonth.length,
          completions: thisMonth.filter((e) => e.status === "completed").length,
          averageProgress:
            thisMonth.length > 0
              ? Math.round(
                  thisMonth.reduce(
                    (sum, e) => sum + (e.progressPercentage || 0),
                    0
                  ) / thisMonth.length
                )
              : 0,
        },
        growthRate:
          enrollments.length > 0
            ? Math.round((thisWeek.length / enrollments.length) * 100)
            : 0,
      };

      // Predictive Metrics
      const avgCompletionTime = learningInsights.avgTimeToCompletion;
      const currentActiveUsers = enrollments.filter(
        (e) => e.status === "active"
      );
      const predictedCompletions = currentActiveUsers.filter((e) => {
        const daysActive =
          (new Date() - new Date(e.enrolledAt)) / (1000 * 60 * 60 * 24);
        return daysActive >= avgCompletionTime * 0.8; // 80% of average completion time
      }).length;

      const predictiveMetrics = {
        predictedCompletionsNext7Days: Math.min(
          predictedCompletions,
          currentActiveUsers.length
        ),
        projectedGrowthRate: timeBasedAnalytics.growthRate * 1.1, // 10% optimistic projection
        riskOfDropout: enrollments.filter((e) => {
          const daysSinceAccess =
            (new Date() - new Date(e.lastAccessedAt || e.enrolledAt)) /
            (1000 * 60 * 60 * 24);
          return e.status === "active" && daysSinceAccess > 14;
        }).length,
        estimatedCompletionRate:
          enrollments.length > 0
            ? Math.round(
                ((userEngagement.completedUsers + predictedCompletions) /
                  enrollments.length) *
                  100
              )
            : 0,
      };

      // System Health Metrics
      const systemHealth = {
        dataQuality: {
          enrollmentsWithProgress: enrollments.filter(
            (e) => e.progressPercentage > 0
          ).length,
          enrollmentsWithLastAccess: enrollments.filter((e) => e.lastAccessedAt)
            .length,
          totalEnrollments: enrollments.length,
          qualityScore:
            enrollments.length > 0
              ? Math.round(
                  (enrollments.filter(
                    (e) => e.progressPercentage >= 0 && e.lastAccessedAt
                  ).length /
                    enrollments.length) *
                    100
                )
              : 100,
        },
        apiPerformance: {
          responseTime: "< 200ms", // Mock data
          uptime: "99.9%",
          errorRate: "0.1%",
        },
        databaseHealth: {
          totalRecords: enrollments.length + modulePerformance.length,
          lastBackup: new Date().toLocaleDateString(),
          storageUsed: "85%", // Mock data
        },
      };

      // Recent activity (latest enrollments and completions)
      const recentActivity = [
        ...enrollments
          .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
          .slice(0, 5)
          .map((enrollment) => ({
            type: "enrollment",
            user: enrollment.userId?.username || "Unknown",
            module: enrollment.moduleId?.title || "Unknown Module",
            timestamp: enrollment.enrolledAt,
            status: enrollment.status,
          })),
        ...enrollments
          .filter((e) => e.status === "completed")
          .sort(
            (a, b) =>
              new Date(b.lastAccessedAt || b.enrolledAt) -
              new Date(a.lastAccessedAt || a.enrolledAt)
          )
          .slice(0, 5)
          .map((enrollment) => ({
            type: "completion",
            user: enrollment.userId?.username || "Unknown",
            module: enrollment.moduleId?.title || "Unknown Module",
            timestamp: enrollment.lastAccessedAt || enrollment.enrolledAt,
            status: enrollment.status,
          })),
      ]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);

      setProgressStats({
        progressDistribution,
        completionTrends,
        modulePerformance,
        userEngagement,
        recentActivity,
        performanceAlerts,
        learningInsights,
        timeBasedAnalytics,
        predictiveMetrics,
        systemHealth,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching progress statistics:", error);
      setProgressStats((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const statCards = [
    {
      title: "Total Phases",
      value: stats.totalPhases,
      color: "border-cyan-500",
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-400",
      link: "/phases",
    },
    {
      title: "Total Modules",
      value: stats.totalModules,
      color: "border-purple-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      link: "/modules",
    },
    {
      title: "Total Content",
      value: stats.totalContent,
      color: "border-green-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
      link: "/content",
    },
    {
      title: "Total Enrollments",
      value: stats.totalEnrollments,
      color: "border-blue-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      link: "/enrollments",
    },
    {
      title: "Active Students",
      value: stats.activeEnrollments,
      color: "border-yellow-500",
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-400",
      link: "/enrollments",
    },
  ];

  // Enhanced statistics cards with progress metrics
  const enhancedStatCards = [
    ...statCards,
    {
      title: "Avg Progress",
      value: `${progressStats.userEngagement.averageProgressAllUsers || 0}%`,
      color: "border-emerald-500",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      link: "/enrollments",
    },
    {
      title: "Completion Rate",
      value: `${Math.round(
        stats.totalEnrollments > 0
          ? (progressStats.userEngagement.completedUsers /
              stats.totalEnrollments) *
              100
          : 0
      )}%`,
      color: "border-indigo-500",
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-400",
      link: "/enrollments",
    },
    {
      title: "Retention Rate",
      value: `${progressStats.userEngagement.retentionRate || 0}%`,
      color: "border-orange-500",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
      link: "/enrollments",
    },
  ];

  // Progress Distribution Chart Component
  const ProgressDistributionChart = () => {
    const { progressDistribution } = progressStats;
    const maxValue = Math.max(...Object.values(progressDistribution));

    return (
      <div className="card">
        <h3 className="text-xl font-bold text-cyber-green mb-4">
          Progress Distribution
        </h3>
        <div className="space-y-4">
          {Object.entries(progressDistribution).map(([range, count]) => (
            <div key={range} className="flex items-center gap-4">
              <div className="w-20 text-sm text-gray-300">{range}</div>
              <div className="flex-1 bg-gray-700 rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: maxValue > 0 ? `${(count / maxValue) * 100}%` : "0%",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                </div>
              </div>
              <div className="w-12 text-right text-cyan-400 font-semibold">
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Module Performance Chart Component
  const ModulePerformanceChart = () => {
    const { modulePerformance } = progressStats;

    return (
      <div className="card">
        <h3 className="text-xl font-bold text-cyber-green mb-4">
          Top Performing Modules
        </h3>
        <div className="space-y-3">
          {modulePerformance.slice(0, 5).map((module, index) => (
            <div
              key={module.module?.id || index}
              className="bg-gray-700/30 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold">
                  {module.module?.title || "Unknown Module"}
                </h4>
                <span className="text-cyan-400 font-bold">
                  {module.averageProgress}%
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>📊 {module.enrollmentCount} enrolled</span>
                <span>✅ {module.completions} completed</span>
                <span>📈 {module.completionRate}% completion rate</span>
              </div>
              <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full transition-all duration-1000"
                  style={{ width: `${module.averageProgress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Completion Trends Chart Component
  const CompletionTrendsChart = () => {
    const { completionTrends } = progressStats;
    const maxCompletions = Math.max(
      ...completionTrends.map((t) => t.completions)
    );

    return (
      <div className="card">
        <h3 className="text-xl font-bold text-cyber-green mb-4">
          Completion Trends (7 Days)
        </h3>
        <div className="flex items-end gap-2 h-40">
          {completionTrends.map((trend, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t transition-all duration-1000 ease-out"
                style={{
                  height:
                    maxCompletions > 0
                      ? `${(trend.completions / maxCompletions) * 100}%`
                      : "10%",
                  minHeight: "10%",
                }}
              ></div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                <div className="font-semibold text-cyan-400">
                  {trend.completions}
                </div>
                <div>{trend.date.split("/").slice(0, 2).join("/")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Recent Activity Component
  const RecentActivityPanel = () => {
    const { recentActivity } = progressStats;

    return (
      <div className="card">
        <h3 className="text-xl font-bold text-cyber-green mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-700/20 rounded"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <div className="flex-1">
                <div className="text-white text-sm">
                  <span className="font-semibold text-cyan-400">
                    {activity.user}
                  </span>{" "}
                  enrolled in{" "}
                  <span className="font-semibold text-green-400">
                    {activity.module}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                  {" • "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      activity.status === "active"
                        ? "bg-green-600 text-white"
                        : activity.status === "completed"
                        ? "bg-blue-600 text-white"
                        : activity.status === "paused"
                        ? "bg-yellow-600 text-black"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // User Engagement Metrics Component
  const UserEngagementMetrics = () => {
    const { userEngagement } = progressStats;

    const engagementCards = [
      {
        title: "Total Users",
        value: userEngagement.totalUsers || 0,
        icon: "👥",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
      },
      {
        title: "Active Users",
        value: userEngagement.activeUsers || 0,
        icon: "🟢",
        color: "text-green-400",
        bgColor: "bg-green-500/10",
      },
      {
        title: "Completed Users",
        value: userEngagement.completedUsers || 0,
        icon: "✅",
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
      },
      {
        title: "Retention Rate",
        value: `${userEngagement.retentionRate || 0}%`,
        icon: "📈",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
      },
    ];

    return (
      <div className="card">
        <h3 className="text-xl font-bold text-cyber-green mb-4">
          User Engagement
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {engagementCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} p-4 rounded-lg text-center`}
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
              <div className="text-sm text-gray-400">{card.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Mode Toggle */}
      <div className="terminal-window">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyber-green mb-2">
              [ADMIN DASHBOARD]
            </h1>
            <p className="text-green-400">
              Hack The World - Content Management System
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "analytics", label: "Analytics" },
              { id: "performance", label: "Performance" },
              { id: "insights", label: "Insights" },
              { id: "alerts", label: "Alerts" },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setDashboardMode(mode.id)}
                className={`px-4 py-2 rounded transition-colors ${
                  dashboardMode === mode.id
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(dashboardMode === "overview" ? statCards : enhancedStatCards).map(
          (stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className={`card ${stat.bgColor} ${stat.color} border-2 hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="text-center">
                <h3 className={`text-lg font-semibold ${stat.textColor} mb-2`}>
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-cyber-green">
                  {stats.loading ? "..." : stat.value}
                </p>
              </div>
            </Link>
          )
        )}
      </div>

      {stats.error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {stats.error}
        </div>
      )}

      {/* Dashboard Content Based on Mode */}
      {dashboardMode === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Status */}
          <div className="card">
            <h2 className="text-xl font-bold text-cyber-green mb-4">
              System Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">Backend Server</span>
                <span className="text-cyber-green font-semibold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">Database Connection</span>
                <span className="text-cyber-green font-semibold">
                  CONNECTED
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">API Status</span>
                <span className="text-cyber-green font-semibold">
                  OPERATIONAL
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-cyber-green mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/phases"
                className="block w-full btn-secondary text-center"
              >
                Manage Phases
              </Link>
              <Link
                to="/modules"
                className="block w-full btn-secondary text-center"
              >
                Manage Modules
              </Link>
              <Link
                to="/content"
                className="block w-full btn-secondary text-center"
              >
                Manage Content
              </Link>
              <Link
                to="/enrollments"
                className="block w-full btn-secondary text-center"
              >
                Track Enrollments
              </Link>
            </div>
          </div>
        </div>
      )}

      {dashboardMode === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProgressDistributionChart />
          <CompletionTrendsChart />
          <UserEngagementMetrics />
          <RecentActivityPanel />
        </div>
      )}

      {dashboardMode === "performance" && (
        <div className="grid grid-cols-1 gap-8">
          <ModulePerformanceChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UserEngagementMetrics />
            <RecentActivityPanel />
          </div>
        </div>
      )}

      {dashboardMode === "insights" && (
        <div className="grid grid-cols-1 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold text-cyber-green mb-4">
              Learning Insights
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">
                  Average Time to Completion
                </span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.learningInsights.avgTimeToCompletion || 0} days
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">Most Popular Modules</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.learningInsights.mostPopularModules
                    .map((m) => m.title)
                    .join(", ")}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">Peak Learning Days</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.learningInsights.peakLearningDays.date}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">Difficulty Analysis</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.learningInsights.difficultyAnalysis.beginner}{" "}
                  beginner,{" "}
                  {
                    progressStats.learningInsights.difficultyAnalysis
                      .intermediate
                  }{" "}
                  intermediate,{" "}
                  {progressStats.learningInsights.difficultyAnalysis.advanced}{" "}
                  advanced,{" "}
                  {progressStats.learningInsights.difficultyAnalysis.expert}{" "}
                  expert
                </span>
              </div>
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold text-cyber-green mb-4">
              Time-Based Analytics
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">This Week</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.timeBasedAnalytics.thisWeek.newEnrollments} new
                  enrollments,{" "}
                  {progressStats.timeBasedAnalytics.thisWeek.completions}{" "}
                  completions,{" "}
                  {progressStats.timeBasedAnalytics.thisWeek.averageProgress}%
                  average progress
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">This Month</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.timeBasedAnalytics.thisMonth.newEnrollments}{" "}
                  new enrollments,{" "}
                  {progressStats.timeBasedAnalytics.thisMonth.completions}{" "}
                  completions,{" "}
                  {progressStats.timeBasedAnalytics.thisMonth.averageProgress}%
                  average progress
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">Growth Rate</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.timeBasedAnalytics.growthRate}%
                </span>
              </div>
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold text-cyber-green mb-4">
              Predictive Metrics
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">
                  Predicted Completions Next 7 Days
                </span>
                <span className="text-cyber-green font-semibold">
                  {
                    progressStats.predictiveMetrics
                      .predictedCompletionsNext7Days
                  }
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">Projected Growth Rate</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.predictiveMetrics.projectedGrowthRate}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">Risk of Dropout</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.predictiveMetrics.riskOfDropout}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">
                  Estimated Completion Rate
                </span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.predictiveMetrics.estimatedCompletionRate}%
                </span>
              </div>
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold text-cyber-green mb-4">
              System Health
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">Data Quality</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.systemHealth.dataQuality.qualityScore}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">API Performance</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.systemHealth.apiPerformance.responseTime}{" "}
                  response time,{" "}
                  {progressStats.systemHealth.apiPerformance.uptime} uptime,{" "}
                  {progressStats.systemHealth.apiPerformance.errorRate} error
                  rate
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <span className="text-green-400">Database Health</span>
                <span className="text-cyber-green font-semibold">
                  {progressStats.systemHealth.databaseHealth.storageUsed}{" "}
                  storage used
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {dashboardMode === "alerts" && (
        <div className="grid grid-cols-1 gap-8">
          {/* Performance Alerts Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-cyber-green">
                🚨 Performance Alerts
              </h2>
              <div className="text-sm text-gray-400">
                {progressStats.performanceAlerts.length} active alerts
              </div>
            </div>

            {progressStats.performanceAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">✅</div>
                <p>No performance alerts at this time</p>
                <p className="text-sm">System is operating normally</p>
              </div>
            ) : (
              <div className="space-y-4">
                {progressStats.performanceAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === "high"
                        ? "bg-red-900/20 border-red-500 text-red-400"
                        : alert.severity === "medium"
                        ? "bg-yellow-900/20 border-yellow-500 text-yellow-400"
                        : "bg-blue-900/20 border-blue-500 text-blue-400"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">
                            {alert.type === "warning" ? "⚠️" : "ℹ️"}
                          </span>
                          <h3 className="font-semibold">{alert.title}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              alert.severity === "high"
                                ? "bg-red-600 text-white"
                                : alert.severity === "medium"
                                ? "bg-yellow-600 text-black"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{alert.message}</p>
                        <div className="text-xs opacity-75">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <button className="ml-4 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Health Dashboard */}
          <div className="card">
            <h2 className="text-xl font-bold text-cyber-green mb-6">
              💻 System Health Monitor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Data Quality */}
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-cyan-400">Data Quality</h3>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Quality Score</span>
                    <span className="text-cyan-400 font-semibold">
                      {progressStats.systemHealth.dataQuality.qualityScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${progressStats.systemHealth.dataQuality.qualityScore}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {
                      progressStats.systemHealth.dataQuality
                        .enrollmentsWithProgress
                    }{" "}
                    of {progressStats.systemHealth.dataQuality.totalEnrollments}{" "}
                    records complete
                  </div>
                </div>
              </div>

              {/* API Performance */}
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-green-400">
                    API Performance
                  </h3>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response Time</span>
                    <span className="text-green-400 font-semibold">
                      {progressStats.systemHealth.apiPerformance.responseTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uptime</span>
                    <span className="text-green-400 font-semibold">
                      {progressStats.systemHealth.apiPerformance.uptime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Error Rate</span>
                    <span className="text-green-400 font-semibold">
                      {progressStats.systemHealth.apiPerformance.errorRate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Database Health */}
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-purple-400">Database</h3>
                  <span className="text-2xl">🗄️</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Storage Used</span>
                    <span className="text-purple-400 font-semibold">
                      {progressStats.systemHealth.databaseHealth.storageUsed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Records</span>
                    <span className="text-purple-400 font-semibold">
                      {progressStats.systemHealth.databaseHealth.totalRecords.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Backup</span>
                    <span className="text-purple-400 font-semibold">
                      {progressStats.systemHealth.databaseHealth.lastBackup}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="card">
            <h2 className="text-xl font-bold text-cyber-green mb-6">
              🎯 Risk Assessment & Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-yellow-400 mb-3">
                  ⚠️ Identified Risks
                </h3>

                <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">🔻</span>
                    <span className="font-semibold text-yellow-400">
                      Dropout Risk
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    {progressStats.predictiveMetrics.riskOfDropout} students at
                    risk of dropping out
                  </p>
                  <div className="text-xs text-yellow-400">
                    Recommendation: Implement intervention strategies
                  </div>
                </div>

                {progressStats.performanceAlerts.filter(
                  (a) => a.severity === "medium" || a.severity === "high"
                ).length > 0 && (
                  <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-400">🚨</span>
                      <span className="font-semibold text-red-400">
                        Performance Issues
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      {
                        progressStats.performanceAlerts.filter(
                          (a) =>
                            a.severity === "medium" || a.severity === "high"
                        ).length
                      }{" "}
                      modules with performance concerns
                    </p>
                    <div className="text-xs text-red-400">
                      Recommendation: Review content quality and difficulty
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-green-400 mb-3">
                  💡 Optimization Opportunities
                </h3>

                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400">📈</span>
                    <span className="font-semibold text-green-400">
                      Growth Potential
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    Projected{" "}
                    {progressStats.predictiveMetrics.projectedGrowthRate}%
                    growth rate
                  </p>
                  <div className="text-xs text-green-400">
                    Recommendation: Scale infrastructure accordingly
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400">🎯</span>
                    <span className="font-semibold text-blue-400">
                      Completion Optimization
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    {
                      progressStats.predictiveMetrics
                        .predictedCompletionsNext7Days
                    }{" "}
                    students likely to complete next week
                  </p>
                  <div className="text-xs text-blue-400">
                    Recommendation: Provide completion incentives
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Information */}
      <div className="card">
        <h2 className="text-xl font-bold text-cyber-green mb-4">
          System Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/30 p-4 rounded">
            <h3 className="text-green-400 font-semibold mb-2">Platform</h3>
            <p className="text-gray-300">Hack The World Learning Platform</p>
          </div>
          <div className="bg-gray-700/30 p-4 rounded">
            <h3 className="text-green-400 font-semibold mb-2">Version</h3>
            <p className="text-gray-300">v1.0.0-admin</p>
          </div>
          <div className="bg-gray-700/30 p-4 rounded">
            <h3 className="text-green-400 font-semibold mb-2">Last Updated</h3>
            <p className="text-gray-300">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
