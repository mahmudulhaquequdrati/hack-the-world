import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserAchievement from '@/lib/models/UserAchievement';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// GET /api/achievements/user - Get user's achievements
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'completed' or 'in_progress'
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Get user achievements based on status
    let userAchievements;
    if (status === 'completed') {
      userAchievements = await UserAchievement.getCompletedByUser(user._id.toString());
    } else if (status === 'in_progress') {
      userAchievements = await UserAchievement.getInProgressByUser(user._id.toString());
    } else {
      userAchievements = await UserAchievement.getByUser(user._id.toString());
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedAchievements = userAchievements.slice(startIndex, startIndex + limit);

    return createSuccessResponse(
      { 
        achievements: paginatedAchievements,
        pagination: {
          page,
          limit,
          total: userAchievements.length,
          pages: Math.ceil(userAchievements.length / limit)
        }
      },
      'User achievements retrieved successfully'
    );

  } catch (error) {
    console.error('Get user achievements error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}