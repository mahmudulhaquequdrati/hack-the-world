import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserProgress from '@/lib/models/UserProgress';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// GET /api/progress - Get user's progress across all content
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
    const status = searchParams.get('status');
    const contentType = searchParams.get('contentType');
    const moduleId = searchParams.get('moduleId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: Record<string, unknown> = { userId: user._id, isActive: true };
    if (status) query.status = status;
    if (contentType) query.contentType = contentType;
    if (moduleId) query.moduleId = moduleId;

    // Get user progress with pagination
    const progressQuery = UserProgress.find(query)
      .populate('content')
      .populate('module')
      .sort({ lastAccessedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const progress = await progressQuery;
    const total = await UserProgress.countDocuments(query);

    // Get overall progress summary
    const overallProgress = await UserProgress.getUserOverallProgress(user._id.toString());

    return createSuccessResponse(
      { 
        progress,
        overallProgress,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      'User progress retrieved successfully'
    );

  } catch (error) {
    console.error('Get progress error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}