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

  // OPTIMIZED: Apply CyberSecOverview efficient pattern - comprehensive query + enrollments
  const { 
    data: phasesWithModules, 
    isLoading: phasesLoading 
  } = useGetPhasesWithModulesQuery();
  
  const { 
    data: enrollmentsData, 
    isLoading: enrollmentsLoading 
  } = useGetCurrentUserEnrollmentsQuery(undefined, { skip: !user });
  
  const { 
    data: achievementsData, 
    isLoading: achievementsLoading 
  } = useGetUserAchievementsQuery(undefined, { skip: !user });
  
  const { 
    data: streakData, 
    isLoading: streakLoading 
  } = useGetStreakStatusQuery(undefined, { skip: !user });

  // TODO: Replace above 4 API calls with single consolidated endpoint:
  // const { data: dashboardData, isLoading: dashboardLoading } = useGetDashboardDataQuery(undefined, { skip: !user });

  // OPTIMIZED: Apply CyberSecOverview enrollment mapping pattern for O(1) lookups
  const enrollmentMap = React.useMemo(() => {
    const map = new Map();
    if (enrollmentsData?.success && enrollmentsData?.data) {
      enrollmentsData.data.forEach((enrollment) => {
        map.set(enrollment.moduleId, {
          enrollmentId: enrollment.id,
          status: enrollment.status,
          progressPercentage: enrollment.progressPercentage,
          isCompleted: enrollment.isCompleted,
          isActive: enrollment.isActive,
          enrolledAt: enrollment.enrolledAt,
        });
      });
    }
    return map;
  }, [enrollmentsData]);
  
  // Extract all modules from phases with enhanced content statistics + enrollment info
  const allModules = React.useMemo(() => {
    if (!phasesWithModules) return [];
    return phasesWithModules.flatMap(phase => 
      (phase.modules || []).map(module => {
        const enrollmentInfo = enrollmentMap.get(module.id);
        return {
          ...module,
          // Add enhanced content statistics like in CyberSecOverview
          labs: module.content?.labs?.length || 0,
          games: module.content?.games?.length || 0,
          videos: module.content?.videos?.length || 0,
          assets: module.content?.documents?.length || 0,
          // Add enrollment status using efficient map lookup
          enrolled: !!enrollmentInfo,
          completed: enrollmentInfo?.isCompleted || false,
          progress: enrollmentInfo?.progressPercentage || 0,
          enrollmentInfo,
        };
      })
    );
  }, [phasesWithModules, enrollmentMap]);

  // Process real achievements data
  const achievements = React.useMemo(() => {
    if (!achievementsData?.success || !achievementsData?.data) return [];
    return achievementsData.data.slice(0, 6); // Show only first 6 in dashboard
  }, [achievementsData]);

  // OPTIMIZED: Use efficient enrollment filtering instead of nested loops
  const enrolledModules: Module[] = React.useMemo(() => {
    return allModules.filter(module => module.enrolled);
  }, [allModules]);

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

  // OPTIMIZED: Single loading check - prioritize core data first
  const isLoadingCoreData = phasesLoading;
  const isLoadingUserData = enrollmentsLoading || achievementsLoading || streakLoading;
  
  if (isLoadingCoreData || (user && isLoadingUserData)) {
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
