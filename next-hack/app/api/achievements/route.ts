import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Achievement from '@/lib/models/Achievement';
import UserAchievement from '@/lib/models/UserAchievement';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { achievementSchema } from '@/lib/validators/content';

// GET /api/achievements - Get all achievements
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const includeUserProgress = searchParams.get('includeUserProgress') === 'true';

    // Get achievements
    let achievements;
    if (category) {
      achievements = await Achievement.getByCategory(category);
    } else if (difficulty) {
      achievements = await Achievement.getByDifficulty(difficulty);
    } else {
      achievements = await Achievement.getActive();
    }

    // Include user progress if requested and user is authenticated
    let userAchievements = null;
    if (includeUserProgress) {
      try {
        const user = await authenticate(request, false); // Don't throw if no auth
        if (user) {
          userAchievements = await UserAchievement.getByUser(user._id.toString());
        }
      } catch {
        // User not authenticated, continue without user progress
      }
    }

    // Map achievements with user progress if available
    const achievementsWithProgress = achievements.map((achievement: any) => {
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
        achievements: includeUserProgress ? achievementsWithProgress : achievements,
        total: achievements.length
      },
      'Achievements retrieved successfully'
    );

  } catch (error) {
    console.error('Get achievements error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/achievements - Create new achievement (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 15 * 60 * 1000)) { // 10 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate and require admin role
    const user = await authenticate(request);
    requireAdmin(user);

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = achievementSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation failed',
        400,
        validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      );
    }

    // Ensure database connection
    await ensureDBConnection();

    // Create new achievement
    const achievement = new Achievement(validationResult.data);
    await achievement.save();

    return createSuccessResponse(
      { achievement },
      'Achievement created successfully',
      201
    );

  } catch (error) {
    console.error('Create achievement error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('unique')) {
        return createErrorResponse('An achievement with this slug already exists', 409);
      }
      if (error.message.includes('token') || error.message.includes('authorization')) {
        return createErrorResponse(error.message, 401);
      }
      if (error.message.includes('admin')) {
        return createErrorResponse(error.message, 403);
      }
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}