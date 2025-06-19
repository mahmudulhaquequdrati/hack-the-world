import React from "react";
import StatCard from "./StatCard";

const StatsPanel = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 animate-pulse"
          >
            <div className="h-4 bg-gray-600 rounded mb-2"></div>
            <div className="h-8 bg-gray-600 rounded mb-1"></div>
            <div className="h-3 bg-gray-600 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <StatCard
        title="Total Enrollments"
        value={stats.total || 0}
        icon="👥"
        color="cyan"
        subtitle="All time"
        progress={Math.min((stats.total / 100) * 100, 100)}
      />
      <StatCard
        title="Active Students"
        value={stats.active || 0}
        icon="🟢"
        color="green"
        subtitle="Currently learning"
        progress={
          stats.total > 0
            ? (stats.active / stats.total) * 100
            : 0
        }
        trend={{
          direction: "up",
          icon: "📈",
          value: "+12%",
        }}
      />
      <StatCard
        title="Completed"
        value={stats.completed || 0}
        icon="✅"
        color="blue"
        subtitle="Finished courses"
        progress={
          stats.total > 0
            ? (stats.completed / stats.total) * 100
            : 0
        }
      />
      <StatCard
        title="Paused"
        value={stats.paused || 0}
        icon="⏸️"
        color="yellow"
        subtitle="Temporarily stopped"
        progress={
          stats.total > 0
            ? (stats.paused / stats.total) * 100
            : 0
        }
      />
      <StatCard
        title="Dropped"
        value={stats.dropped || 0}
        icon="❌"
        color="red"
        subtitle="Discontinued"
        progress={
          stats.total > 0
            ? (stats.dropped / stats.total) * 100
            : 0
        }
        trend={{
          direction: "down",
          icon: "📉",
          value: "-3%",
        }}
      />
      <StatCard
        title="Avg Progress"
        value={`${stats.averageProgress || 0}%`}
        icon="📊"
        color="purple"
        subtitle="Overall completion"
        progress={stats.averageProgress || 0}
      />
      <StatCard
        title="Success Rate"
        value={`${stats.completionRate || 0}%`}
        icon="🎯"
        color="orange"
        subtitle="Completion rate"
        progress={stats.completionRate || 0}
        trend={{
          direction: stats.completionRate > 75 ? "up" : "stable",
          icon: stats.completionRate > 75 ? "🔥" : "➡️",
          value: `${stats.completionRate || 0}%`,
        }}
      />
    </div>
  );
};

export default StatsPanel;