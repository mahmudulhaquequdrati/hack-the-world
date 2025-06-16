import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserProgress from '@/lib/models/UserProgress';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';

interface RouteParams {
  params: {
    contentId: string;
  };
}

// GET /api/progress/content/[contentId] - Get user's progress for specific content
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Validate content ID
    const idValidation = objectIdSchema.safeParse(params.contentId);
    if (!idValidation.success) {
      return createErrorResponse('Invalid content ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Find user's progress for this content
    const progress = await UserProgress.findOne({
      userId: user._id,
      contentId: params.contentId,
      isActive: true
    }).populate(['content', 'module']);

    if (!progress) {
      // Return default progress state if no record exists
      return createSuccessResponse(
        { 
          progress: {
            contentId: params.contentId,
            status: 'not_started',
            progressPercentage: 0,
            timeSpent: 0,
            attempts: 0,
            lastPosition: 0
          }
        },
        'No progress found for this content'
      );
    }

    return createSuccessResponse(
      { progress },
      'Content progress retrieved successfully'
    );

  } catch (error) {
    console.error('Get content progress error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}