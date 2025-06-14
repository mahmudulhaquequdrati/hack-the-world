import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserAchievementsQuery } from "@/features/api/apiSlice";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";
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
import { useMemo, useState } from "react";
import { AchievementCard } from "./AchievementCard";

interface Achievement {
  title: string;
  description: string;
  earned: boolean;
  icon: React.ComponentType<{ className?: string }>;
  category: 'module' | 'lab' | 'game' | 'xp' | 'general';
  progress?: number;
  target?: number;
  xp?: number;
}

interface AchievementsTabProps {
  achievements: Achievement[];
  enrolledModules: Module[];
}

// Helper function to map icon names to components
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    BookOpen,
    Award,
    Star,
    Trophy,
    Target,
    Zap,
    Gamepad2,
    Users,
  };
  return iconMap[iconName] || Trophy;
};

export const AchievementsTab = ({ achievements, enrolledModules }: AchievementsTabProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch real achievement data
  const { 
    data: achievementData, 
    isLoading: achievementsLoading, 
    error: achievementsError 
  } = useGetUserAchievementsQuery();
  
  // Get current user data for real stats
  const { data: currentUser } = useGetCurrentUserQuery();

  // Convert API data to component format
  const apiAchievements = useMemo(() => {
    if (!achievementData?.success || !achievementData?.data) return [];
    
    return achievementData.data.map(achievement => ({
      title: achievement.title,
      description: achievement.description,
      earned: achievement.userProgress.isCompleted,
      icon: getIconComponent(achievement.icon),
      category: achievement.category,
      progress: achievement.userProgress.progress,
      target: achievement.userProgress.target,
      xp: achievement.rewards.xp,
    }));
  }, [achievementData]);

  // Fallback to dynamic achievements if API fails
  const dynamicAchievements = useMemo(() => {
    const completedModules = enrolledModules.filter(m => m.completed);
    const userStats = currentUser?.data?.user?.stats;
    const totalLabs = userStats?.labsCompleted || 0;
    const totalGames = userStats?.gamesCompleted || 0;
    const totalXP = userStats?.totalPoints || 0;
    
    const moduleAchievements: Achievement[] = [
      {
        title: "First Steps",
        description: "Complete your first module",
        earned: completedModules.length >= 1,
        icon: BookOpen,
        category: 'module',
        progress: completedModules.length,
        target: 1,
        xp: 50
      },
      {
        title: "Learning Streak",
        description: "Complete 3 modules",
        earned: completedModules.length >= 3,
        icon: Award,
        category: 'module',
        progress: completedModules.length,
        target: 3,
        xp: 150
      },
      {
        title: "Knowledge Seeker",
        description: "Complete 5 modules",
        earned: completedModules.length >= 5,
        icon: Star,
        category: 'module',
        progress: completedModules.length,
        target: 5,
        xp: 300
      },
      {
        title: "Module Master",
        description: "Complete 10 modules",
        earned: completedModules.length >= 10,
        icon: Trophy,
        category: 'module',
        progress: completedModules.length,
        target: 10,
        xp: 500
      }
    ];

    const labAchievements: Achievement[] = [
      {
        title: "Lab Rookie",
        description: "Access your first lab",
        earned: totalLabs >= 1,
        icon: Target,
        category: 'lab',
        progress: totalLabs,
        target: 1,
        xp: 25
      },
      {
        title: "Hands-On Learner",
        description: "Access 5 labs",
        earned: totalLabs >= 5,
        icon: Zap,
        category: 'lab',
        progress: totalLabs,
        target: 5,
        xp: 100
      },
      {
        title: "Lab Expert",
        description: "Access 15 labs",
        earned: totalLabs >= 15,
        icon: Award,
        category: 'lab',
        progress: totalLabs,
        target: 15,
        xp: 250
      }
    ];

    const gameAchievements: Achievement[] = [
      {
        title: "Game On",
        description: "Play your first game",
        earned: totalGames >= 1,
        icon: Gamepad2,
        category: 'game',
        progress: totalGames,
        target: 1,
        xp: 25
      },
      {
        title: "Gaming Enthusiast",
        description: "Play 5 games",
        earned: totalGames >= 5,
        icon: Star,
        category: 'game',
        progress: totalGames,
        target: 5,
        xp: 100
      },
      {
        title: "Game Master",
        description: "Play 10 games",
        earned: totalGames >= 10,
        icon: Trophy,
        category: 'game',
        progress: totalGames,
        target: 10,
        xp: 200
      }
    ];

    const xpAchievements: Achievement[] = [
      {
        title: "XP Collector",
        description: "Earn 100 XP",
        earned: totalXP >= 100,
        icon: Star,
        category: 'xp',
        progress: totalXP,
        target: 100,
        xp: 50
      },
      {
        title: "XP Hunter",
        description: "Earn 500 XP",
        earned: totalXP >= 500,
        icon: Award,
        category: 'xp',
        progress: totalXP,
        target: 500,
        xp: 100
      },
      {
        title: "XP Legend",
        description: "Earn 1000 XP",
        earned: totalXP >= 1000,
        icon: Trophy,
        category: 'xp',
        progress: totalXP,
        target: 1000,
        xp: 200
      }
    ];

    const generalAchievements: Achievement[] = [
      {
        title: "Welcome Aboard",
        description: "Join the platform",
        earned: true,
        icon: Users,
        category: 'general',
        xp: 10
      },
      {
        title: "Explorer",
        description: "Enroll in your first course",
        earned: enrolledModules.length >= 1,
        icon: BookOpen,
        category: 'general',
        progress: enrolledModules.length,
        target: 1,
        xp: 25
      }
    ];

    return [...moduleAchievements, ...labAchievements, ...gameAchievements, ...xpAchievements, ...generalAchievements];
  }, [enrolledModules, currentUser]);

  // Use API achievements if available, otherwise fallback to dynamic
  const allAchievements = useMemo(() => {
    if (apiAchievements.length > 0) {
      return apiAchievements;
    }
    return [...dynamicAchievements, ...achievements];
  }, [apiAchievements, dynamicAchievements, achievements]);

  // Filter achievements by category
  const filteredAchievements = useMemo(() => {
    if (activeCategory === 'all') return allAchievements;
    return allAchievements.filter(achievement => achievement.category === activeCategory);
  }, [allAchievements, activeCategory]);

  // Use API stats if available, otherwise calculate
  const stats = useMemo(() => {
    if (achievementData?.success && achievementData?.stats) {
      return {
        earned: achievementData.stats.completed,
        total: achievementData.stats.total,
        percentage: achievementData.stats.percentage,
        totalXP: achievementData.stats.totalXP,
      };
    }
    
    // Fallback calculation
    const earnedCount = allAchievements.filter(a => a.earned).length;
    const totalCount = allAchievements.length;
    const totalXP = allAchievements.filter(a => a.earned).reduce((sum, a) => sum + (a.xp || 0), 0);
    
    return {
      earned: earnedCount,
      total: totalCount,
      percentage: Math.round((earnedCount / totalCount) * 100),
      totalXP
    };
  }, [achievementData, allAchievements]);

  const categoryStats = useMemo(() => {
    const categories = ['module', 'lab', 'game', 'xp', 'general'];
    return categories.map(category => {
      const categoryAchievements = allAchievements.filter(a => a.category === category);
      const earnedCount = categoryAchievements.filter(a => a.earned).length;
      return {
        category,
        earned: earnedCount,
        total: categoryAchievements.length,
        percentage: categoryAchievements.length > 0 ? Math.round((earnedCount / categoryAchievements.length) * 100) : 0
      };
    });
  }, [allAchievements]);

  // Show loading state
  if (achievementsLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Terminal className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-mono text-sm">
              ~/achievements$ loading data...
            </span>
          </div>
          <div className="text-center py-12">
            <div className="text-green-400 font-mono">Loading achievements...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-mono text-sm">
            ~/achievements$ cat progress.log | sort -k2,3
          </span>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">
            ACHIEVEMENT_SYSTEM
          </h3>
          <p className="text-green-300/70 font-mono text-sm">
            Progress tracking • Badge collection • XP rewards
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-400/10 to-green-400/5 border border-green-400/30 rounded-lg p-4">
            <div className="text-green-400 font-mono text-sm font-bold mb-1">
              TOTAL_ACHIEVEMENTS
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {stats.earned}/{stats.total}
            </div>
            <div className="text-green-300/70 text-xs font-mono">
              {stats.percentage}% completed
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border border-yellow-400/30 rounded-lg p-4">
            <div className="text-yellow-400 font-mono text-sm font-bold mb-1">
              TOTAL_XP_EARNED
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {stats.totalXP}
            </div>
            <div className="text-yellow-300/70 text-xs font-mono">
              experience points
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-400/10 to-blue-400/5 border border-blue-400/30 rounded-lg p-4">
            <div className="text-blue-400 font-mono text-sm font-bold mb-1">
              MODULES_COMPLETED
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {enrolledModules.filter(m => m.completed).length}
            </div>
            <div className="text-blue-300/70 text-xs font-mono">
              learning milestones
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-400/10 to-purple-400/5 border border-purple-400/30 rounded-lg p-4">
            <div className="text-purple-400 font-mono text-sm font-bold mb-1">
              NEXT_LEVEL_IN
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {Math.max(0, (Math.floor(stats.totalXP / 500) + 1) * 500 - stats.totalXP)}
            </div>
            <div className="text-purple-300/70 text-xs font-mono">
              XP to level {Math.floor(stats.totalXP / 500) + 1}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
          <TabsList className="bg-black/50 border border-green-400/30 grid grid-cols-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black font-mono text-xs"
            >
              ALL ({allAchievements.length})
            </TabsTrigger>
            <TabsTrigger
              value="module"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-black font-mono text-xs"
            >
              MODULES ({categoryStats.find(s => s.category === 'module')?.total || 0})
            </TabsTrigger>
            <TabsTrigger
              value="lab"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-mono text-xs"
            >
              LABS ({categoryStats.find(s => s.category === 'lab')?.total || 0})
            </TabsTrigger>
            <TabsTrigger
              value="game"
              className="data-[state=active]:bg-red-400 data-[state=active]:text-black font-mono text-xs"
            >
              GAMES ({categoryStats.find(s => s.category === 'game')?.total || 0})
            </TabsTrigger>
            <TabsTrigger
              value="xp"
              className="data-[state=active]:bg-purple-400 data-[state=active]:text-black font-mono text-xs"
            >
              XP ({categoryStats.find(s => s.category === 'xp')?.total || 0})
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black font-mono text-xs"
            >
              GENERAL ({categoryStats.find(s => s.category === 'general')?.total || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-4">
            {filteredAchievements.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
                <h4 className="text-green-400 font-mono text-lg mb-2">
                  NO_ACHIEVEMENTS_FOUND
                </h4>
                <p className="text-green-300/60 font-mono text-sm">
                  Start learning to unlock achievements
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAchievements.map((achievement, index) => (
                  <AchievementCard key={`${achievement.category}-${index}`} achievement={achievement} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};