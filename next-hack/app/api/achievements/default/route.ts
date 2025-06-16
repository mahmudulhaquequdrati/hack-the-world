import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Achievement from '@/lib/models/Achievement';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// POST /api/achievements/default - Create default achievements (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 5, 60 * 60 * 1000)) { // 5 requests per hour (this is a rare operation)
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate and require admin role
    const user = await authenticate(request);
    requireAdmin(user);

    // Ensure database connection
    await ensureDBConnection();

    // Create default achievements
    const createdAchievements = await Achievement.createDefaultAchievements();

    if (createdAchievements.length === 0) {
      return createSuccessResponse(
        { message: 'Default achievements already exist' },
        'Default achievements already exist'
      );
    }

    return createSuccessResponse(
      { 
        achievements: createdAchievements,
        count: createdAchievements.length
      },
      'Default achievements created successfully',
      201
    );

  } catch (error) {
    console.error('Create default achievements error:', error);
    
    if (error instanceof Error) {
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