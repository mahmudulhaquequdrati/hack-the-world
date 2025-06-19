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


  // Simplified to overview only - removed dashboard mode tabs

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const fetchStats = async () => {
      try {
        console.log("🔄 Dashboard: Starting stats fetch");
        
        // OPTIMIZED: Use modules/with-phases to get phases + modules + content counts in one call
        // This replaces the original 3 separate API calls
        const [phasesWithModulesRes, contentRes] = await Promise.allSettled([
          modulesAPI.getWithPhases(),
          contentAPI.getAll(),
        ]);

        if (!isMounted) return; // Component unmounted, skip state update

        const phasesData = phasesWithModulesRes.status === "fulfilled" ? phasesWithModulesRes.value.data || [] : [];
        
        // Calculate totals from consolidated data
        const totalPhases = phasesData.length;
        const allModules = phasesData.reduce((acc, phase) => [...acc, ...(phase.modules || [])], []);
        const totalModules = allModules.length;
        
        // Get content count
        const totalContent = contentRes.status === "fulfilled" ? contentRes.value.data?.length || 0 : 0;
        
        // OPTIMIZED: Fetch enrollment statistics for all modules in single batch call
        let totalEnrollments = 0;
        let activeEnrollments = 0;

        if (allModules.length > 0) {
          try {
            const moduleIds = allModules.map(module => module.id);
            console.log("📊 Dashboard: Fetching batch stats for modules:", moduleIds.length);
            
            const batchStatsRes = await enrollmentAPI.getBatchModuleStats(moduleIds);
            
            if (!isMounted) return; // Component unmounted, skip state update
            
            if (batchStatsRes.success && batchStatsRes.data) {
              Object.values(batchStatsRes.data).forEach((moduleStats) => {
                if (moduleStats && moduleStats.stats) {
                  totalEnrollments += moduleStats.stats.totalEnrollments || 0;
                  activeEnrollments += moduleStats.stats.activeEnrollments || 0;
                }
              });
            }
          } catch (error) {
            console.warn("Error fetching batch enrollment statistics:", error);
          }
        }

        if (!isMounted) return; // Component unmounted, skip state update

        setStats({
          totalPhases,
          totalModules,
          totalContent,
          totalEnrollments,
          activeEnrollments,
          loading: false,
          error: null,
        });

        console.log("✅ Dashboard: Stats fetch completed");

      } catch (error) {
        console.error("Error fetching stats:", error);
        if (isMounted) {
          setStats((prev) => ({
            ...prev,
            loading: false,
            error: "Failed to load statistics",
          }));
        }
      }
    };

    fetchStats();
    
    // Cleanup function
    return () => {
      isMounted = false;
      console.log("🧹 Dashboard: Component unmounting, canceling requests");
    };
  }, []);


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
  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Header with Terminal Style */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-green-400 font-mono text-lg">🔧</span>
            <h2 className="text-3xl font-bold text-green-400 font-mono uppercase tracking-wider">
              ADMIN_CONTROL_CENTER
            </h2>
          </div>
          <div className="bg-black/60 border border-green-400/30 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-green-400 font-mono text-sm">
              ~/hack-admin$ monitor --platform-status --real-time
            </p>
          </div>
        </div>

        {/* Statistics Cards with Terminal Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(
            (stat, index) => (
              <Link
                key={index}
                to={stat.link}
                className="relative overflow-hidden rounded-xl border-2 border-green-400/30 bg-gradient-to-br from-gray-900/80 to-black/80 p-6 group hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-mono text-green-400/80 uppercase tracking-wider mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-green-400 font-mono">{stats.loading ? "..." : stat.value}</p>
                    <p className="text-xs text-green-300/60 font-mono mt-1">SYSTEM_METRIC</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-400/20 border-2 border-green-400/40 flex items-center justify-center group-hover:animate-pulse">
                    <span className="text-green-400 text-xl font-mono">{index === 0 ? '📊' : index === 1 ? '📝' : index === 2 ? '📁' : '👥'}</span>
                  </div>
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

      {/* Dashboard Overview Content */}
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
      </div>

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
