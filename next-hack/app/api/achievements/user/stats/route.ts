import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserAchievement from '@/lib/models/UserAchievement';
import Achievement from '@/lib/models/Achievement';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { AchievementStatsRaw, DifficultyItem, DifficultyStats, UserRankInfo } from '@/types/route-params';

// GET /api/achievements/user/stats - Get user's achievement statistics
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 50, 15 * 60 * 1000)) { // 50 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Ensure database connection
    await ensureDBConnection();

    // Get total available achievements
    const totalAvailableAchievements = await Achievement.countDocuments({ isActive: true });

    // Get user achievement statistics
    const userStats = await UserAchievement.getUserStats(user._id.toString());
    const stats: AchievementStatsRaw = (userStats[0] as AchievementStatsRaw) || {
      totalAchievements: 0,
      completedAchievements: 0,
      inProgressAchievements: 0,
      totalPoints: 0,
      avgProgress: 0,
      achievementsByDifficulty: []
    };

    // Process achievements by difficulty
    const difficultyStats: DifficultyStats = stats.achievementsByDifficulty.reduce((acc: DifficultyStats, item: DifficultyItem) => {
      if (!acc[item.difficulty]) {
        acc[item.difficulty] = { total: 0, completed: 0 };
      }
      acc[item.difficulty].total += 1;
      if (item.isCompleted) {
        acc[item.difficulty].completed += 1;
      }
      return acc;
    }, {});

    // Get recent achievements (last 10 completed)
    const recentAchievements = await UserAchievement.find({
      userId: user._id,
      isCompleted: true,
      isActive: true
    })
      .populate('achievement')
      .sort({ completedAt: -1 })
      .limit(10);

    // Calculate completion rate
    const completionRate = totalAvailableAchievements > 0 
      ? (stats.completedAchievements / totalAvailableAchievements) * 100 
      : 0;

    // Get user's rank (based on total points)
    const userRank = await UserAchievement.aggregate([
      {
        $group: {
          _id: "$userId",
          totalPoints: { $sum: "$earnedRewards.points" }
        }
      },
      {
        $group: {
          _id: null,
          users: { $push: { userId: "$_id", points: "$totalPoints" } }
        }
      },
      {
        $project: {
          rank: {
            $add: [
              {
                $indexOfArray: [
                  {
                    $map: {
                      input: {
                        $sortArray: {
                          input: "$users",
                          sortBy: { points: -1 }
                        }
                      },
                      as: "user",
                      in: "$$user.userId"
                    }
                  },
                  user._id
                ]
              },
              1
            ]
          },
          totalUsers: { $size: "$users" }
        }
      }
    ]);

    const rankInfo: UserRankInfo = userRank[0] || { rank: 1, totalUsers: 1 };

    return createSuccessResponse(
      { 
        stats: {
          ...stats,
          totalAvailableAchievements,
          completionRate: Math.round(completionRate * 100) / 100,
          difficultyStats,
          rank: rankInfo.rank,
          totalUsers: rankInfo.totalUsers
        },
        recentAchievements
      },
      'User achievement statistics retrieved successfully'
    );

  } catch (error) {
    console.error('Get user achievement stats error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}