import { DashboardTabs, LearningDashboard } from "@/components/dashboard";
import {
  ACHIEVEMENTS_DATA,
  getAllModules,
  getEnrolledModules,
} from "@/lib/appData";
import { Module } from "@/lib/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("progress");

  // Use centralized data
  const achievements = ACHIEVEMENTS_DATA;
  const enrolledModules = getEnrolledModules();

  const handleModuleClick = (module: Module) => {
    if (module.enrolled) {
      navigate(module.enrollPath, {
        state: {
          from: "dashboard",
        },
      });
    } else {
      navigate(module.path, {
        state: {
          from: "dashboard",
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        <LearningDashboard enrolledModules={enrolledModules} />

        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onModuleClick={handleModuleClick}
          getAllModules={getAllModules}
          getEnrolledModules={getEnrolledModules}
          achievements={achievements}
        />
      </div>
    </div>
  );
};

export default Dashboard;
