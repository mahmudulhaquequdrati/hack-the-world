import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { modulesAPI, phasesAPI } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPhases: 0,
    totalModules: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [modulesRes, phasesRes] = await Promise.allSettled([
          modulesAPI.getAll(),
          phasesAPI.getAll(),
        ]);

        setStats({
          totalPhases:
            phasesRes.status === "fulfilled"
              ? phasesRes.value.data?.length || 0
              : 0,
          totalModules:
            modulesRes.status === "fulfilled"
              ? modulesRes.value.data?.length || 0
              : 0,
          loading: false,
          error: null,
        });
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
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="terminal-window">
        <h1 className="text-3xl font-bold text-cyber-green mb-2">
          [ADMIN DASHBOARD]
        </h1>
        <p className="text-green-400">
          Hack The World - Content Management System
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
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
        ))}
      </div>

      {stats.error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {stats.error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
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
              <span className="text-cyber-green font-semibold">CONNECTED</span>
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
            <button className="w-full btn-secondary opacity-50 cursor-not-allowed">
              Content Management (Coming Soon)
            </button>
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
