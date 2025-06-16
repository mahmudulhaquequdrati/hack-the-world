import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserProgress from '@/lib/models/UserProgress';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';

interface RouteParams {
  params: {
    userId: string;
    moduleId: string;
  };
}

// GET /api/progress/module/[userId]/[moduleId] - Get user's progress for specific module
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Validate IDs
    const userIdValidation = objectIdSchema.safeParse(params.userId);
    const moduleIdValidation = objectIdSchema.safeParse(params.moduleId);
    
    if (!userIdValidation.success) {
      return createErrorResponse('Invalid user ID format', 400);
    }
    
    if (!moduleIdValidation.success) {
      return createErrorResponse('Invalid module ID format', 400);
    }

    // Check authorization (users can only view their own progress, admins can view any)
    if (user._id.toString() !== params.userId && user.role !== 'admin') {
      return createErrorResponse('Access denied. You can only view your own progress.', 403);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get user's progress for all content in this module
    const moduleProgress = await UserProgress.getByModule(params.userId, params.moduleId);

    // Get module progress summary
    const progressSummary = await UserProgress.getModuleProgressSummary(params.userId, params.moduleId);

    // Calculate overall module statistics
    const totalItems = moduleProgress.length;
    const completedItems = moduleProgress.filter(p => p.status === 'completed').length;
    const inProgressItems = moduleProgress.filter(p => p.status === 'in_progress').length;
    const notStartedItems = moduleProgress.filter(p => p.status === 'not_started').length;

    const totalTimeSpent = moduleProgress.reduce((sum, p) => sum + p.timeSpent, 0);
    const avgProgress = totalItems > 0 
      ? moduleProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / totalItems 
      : 0;

    // Group progress by content type
    const progressByType = moduleProgress.reduce((acc: any, progress) => {
      if (!acc[progress.contentType]) {
        acc[progress.contentType] = [];
      }
      acc[progress.contentType].push(progress);
      return acc;
    }, {});

    return createSuccessResponse(
      { 
        moduleProgress,
        progressSummary,
        progressByType,
        statistics: {
          totalItems,
          completedItems,
          inProgressItems,
          notStartedItems,
          completionRate: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
          avgProgress,
          totalTimeSpent
        }
      },
      'Module progress retrieved successfully'
    );

  } catch (error) {
    console.error('Get module progress error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('token')) {
        return createErrorResponse(error.message, 401);
      }
      if (error.message.includes('Access denied')) {
        return createErrorResponse(error.message, 403);
      }
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}