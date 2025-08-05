import { AchievementsTab } from "@/components/dashboard";
import {
  useGetCurrentUserEnrollmentsQuery,
  useGetPhasesWithModulesQuery,
  useGetUserAchievementsQuery,
} from "@/features/api/apiSlice";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { Module } from "@/lib/types";
import {
  Award,
  BookOpen,
  Gamepad2,
  Star,
  Target,
  Terminal,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import React from "react";

const AchievementsPage = () => {
  const { user } = useAuthRTK();

  const { data: phasesWithModules, isLoading: phasesLoading } =
    useGetPhasesWithModulesQuery();

  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useGetCurrentUserEnrollmentsQuery(undefined, { skip: !user });

  const { data: achievementsData, isLoading: achievementsLoading } =
    useGetUserAchievementsQuery(undefined, { skip: !user });

  // Process enrollment data similar to dashboard
  const enrollmentMap = React.useMemo(() => {
    if (!enrollmentsData?.success || !enrollmentsData.data) return new Map();

    const map = new Map();
    enrollmentsData.data.forEach((enrollment) => {
      map.set(enrollment.moduleId, {
        enrolled: true,
        progress: enrollment.progress,
        completedAt: enrollment.completedAt,
      });
    });
    return map;
  }, [enrollmentsData]);

  const allModules = React.useMemo(() => {
    if (!phasesWithModules) return [];

    return phasesWithModules.flatMap((phase) =>
      phase.modules.map((module) => {
        const enrollmentInfo = enrollmentMap.get(module._id);
        return {
          ...module,
          enrolled: !!enrollmentInfo?.enrolled,
          progress: enrollmentInfo?.progress || 0,
          completed: !!enrollmentInfo?.completedAt,
        };
      })
    );
  }, [phasesWithModules, enrollmentMap]);

  const enrolledModules: Module[] = React.useMemo(() => {
    return allModules.filter((module) => module.enrolled);
  }, [allModules]);

  // Helper function to map icon names to components
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<
      string,
      React.ComponentType<{ className?: string }>
    > = {
      BookOpen,
      Award,
      Star,
      Trophy,
      Target,
      Zap,
      Gamepad2,
      Users,
      Terminal,
    };
    return iconMap[iconName] || Trophy;
  };

  // Process achievements data
  const achievements = React.useMemo(() => {
    if (!achievementsData?.success || !achievementsData?.data) return [];
    return achievementsData.data.map((achievement) => ({
      title: achievement.title,
      description: achievement.description,
      earned: achievement.userProgress?.isCompleted || false,
      icon: getIconComponent(achievement.icon),
      category: achievement.category,
    }));
  }, [achievementsData]);

  const isLoading = phasesLoading || enrollmentsLoading || achievementsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400">
        <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
          <div className="text-center">
            <div className="animate-pulse text-green-400/60 font-mono">
              Loading achievements...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-400/50 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 font-mono">
              {">> "}Achievements
            </h1>
            <p className="text-yellow-400/80 font-mono text-sm">
              Your cybersecurity accomplishments
            </p>
          </div>
        </div>

        {/* Achievements Content */}
        <AchievementsTab
          achievements={achievements}
          enrolledModules={enrolledModules}
        />
      </div>
    </div>
  );
};

export default AchievementsPage;
