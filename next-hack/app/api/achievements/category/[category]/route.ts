import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Achievement from '@/lib/models/Achievement';
import UserAchievement from '@/lib/models/UserAchievement';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { RouteContext, CategoryRouteParams } from '@/types/route-params';

// GET /api/achievements/category/[category] - Get achievements by category
export async function GET(request: NextRequest, context: RouteContext<CategoryRouteParams>) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Decode category parameter
    const params = await context.params;
    const category = decodeURIComponent(params.category);

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeUserProgress = searchParams.get('includeUserProgress') === 'true';

    // Get achievements by category
    const achievements = await Achievement.getByCategory(category);

    if (achievements.length === 0) {
      return createErrorResponse('No achievements found for this category', 404);
    }

    // Include user progress if requested and user is authenticated
    let userAchievements = null;
    if (includeUserProgress) {
      try {
        const user = await authenticate(request);
        if (user) {
          userAchievements = await UserAchievement.getByUser(user._id.toString());
        }
      } catch {
        // User not authenticated, continue without user progress
      }
    }

    // Map achievements with user progress if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const achievementsWithProgress = achievements.map((achievement: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userAchievement = userAchievements?.find((ua: any) => 
        ua.achievementId.toString() === achievement._id.toString()
      );
      
      return {
        ...achievement.toObject(),
        userProgress: userAchievement ? {
          progress: userAchievement.progress,
          isCompleted: userAchievement.isCompleted,
          completedAt: userAchievement.completedAt,
          earnedRewards: userAchievement.earnedRewards
        } : null
      };
    });

    return createSuccessResponse(
      { 
        category,
        achievements: includeUserProgress ? achievementsWithProgress : achievements,
        total: achievements.length
      },
      `Achievements for category '${category}' retrieved successfully`
    );

  } catch (error) {
    console.error('Get achievements by category error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}