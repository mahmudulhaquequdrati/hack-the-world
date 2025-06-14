import {
  DashboardTabs,
  LearningDashboard,
  ProgressOverview,
} from "@/components/dashboard";
import {
  useGetCurrentUserEnrollmentsQuery,
  useGetPhasesWithModulesQuery,
  useGetUserAchievementsQuery,
  useGetStreakStatusQuery,
} from "@/features/api/apiSlice";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { getCoursePath, getEnrollPath } from "@/lib/pathUtils";
import { Module } from "@/lib/types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("progress");
  const { user } = useAuthRTK();

  // Fetch real data from API with enriched module content statistics
  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useGetCurrentUserEnrollmentsQuery(undefined, {
      skip: !user,
    });

  const { data: phasesWithModules, isLoading: modulesLoading } = useGetPhasesWithModulesQuery();
  
  // Fetch real achievement and streak data
  const { data: achievementsData, isLoading: achievementsLoading } = useGetUserAchievementsQuery(
    undefined,
    { skip: !user }
  );
  const { data: streakData, isLoading: streakLoading } = useGetStreakStatusQuery(
    undefined,
    { skip: !user }
  );
  
  // Extract all modules from phases with enhanced content statistics
  const allModules = React.useMemo(() => {
    if (!phasesWithModules) return [];
    return phasesWithModules.flatMap(phase => 
      (phase.modules || []).map(module => ({
        ...module,
        // Add enhanced content statistics like in CyberSecOverview
        labs: module.content?.labs?.length || 0,
        games: module.content?.games?.length || 0,
        videos: module.content?.videos?.length || 0,
        assets: module.content?.documents?.length || 0,
      }))
    );
  }, [phasesWithModules]);

  // Process real achievements data
  const achievements = React.useMemo(() => {
    if (!achievementsData?.success || !achievementsData?.data) return [];
    return achievementsData.data.slice(0, 6); // Show only first 6 in dashboard
  }, [achievementsData]);

  // Convert enrollment data to enrolled modules format
  const enrolledModules: Module[] = React.useMemo(() => {
    if (!enrollmentsData?.success || !allModules || !enrollmentsData.data)
      return [];

    return enrollmentsData.data
      .map((enrollment) => {
        const module = allModules.find((m) => m.id === enrollment.moduleId);
        if (!module) return null;

        return {
          ...module,
          enrolled: true,
          progress: enrollment.progressPercentage,
          completed: enrollment.isCompleted,
          enrolledAt: enrollment.enrolledAt,
        };
      })
      .filter(Boolean) as Module[];
  }, [enrollmentsData, allModules]);

  // Helper functions for dashboard tabs
  const getAllModulesHelper = () => allModules || [];
  const getEnrolledModulesHelper = () => enrolledModules;
  const getPhasesHelper = () => phasesWithModules || [];

  const handleModuleClick = (module: Module) => {
    if (module.enrolled) {
      navigate(getEnrollPath(module.id), {
        state: { fromDashboard: true },
      });
    } else {
      navigate(getCoursePath(module.id), {
        state: { fromDashboard: true },
      });
    }
  };

  // Show loading state while data is being fetched
  if (enrollmentsLoading || modulesLoading || achievementsLoading || streakLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400">
        <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
          <div className="text-center">
            <div className="animate-pulse text-green-400/60 font-mono">
              Loading dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        <LearningDashboard 
          enrolledModules={enrolledModules} 
          streakData={streakData?.success ? streakData.data : undefined}
        />

        <ProgressOverview />

        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onModuleClick={handleModuleClick}
          getAllModules={getAllModulesHelper}
          getEnrolledModules={getEnrolledModulesHelper}
          getPhases={getPhasesHelper}
          achievements={achievements}
        />
      </div>
    </div>
  );
};

export default Dashboard;
