import { Header } from "@/components/common/Header";
import { DashboardTabs, LearningDashboard } from "@/components/dashboard";
import {
  ACHIEVEMENTS_DATA,
  getAllModules,
  getCompletedModules,
  getEnrolledModules,
  PHASES_DATA,
} from "@/lib/appData";
import { Module } from "@/lib/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
  const [expandedPhases, setExpandedPhases] = useState<string[]>(["beginner"]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  // Use centralized data
  const phases = PHASES_DATA;
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
      <Header navigate={navigate} />

      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        <LearningDashboard enrolledModules={enrolledModules} />

        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          phases={phases}
          expandedPhases={expandedPhases}
          onTogglePhase={togglePhase}
          onModuleClick={handleModuleClick}
          getAllModules={getAllModules}
          getEnrolledModules={getEnrolledModules}
          getCompletedModules={getCompletedModules}
          achievements={achievements}
        />
      </div>
    </div>
  );
};

export default Dashboard;
