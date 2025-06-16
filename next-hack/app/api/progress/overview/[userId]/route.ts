import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserProgress from '@/lib/models/UserProgress';
import UserEnrollment from '@/lib/models/UserEnrollment';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';

interface RouteParams {
  params: {
    userId: string;
  };
}

// GET /api/progress/overview/[userId] - Get user's overall progress overview
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 50, 15 * 60 * 1000)) { // 50 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Validate user ID
    const idValidation = objectIdSchema.safeParse(params.userId);
    if (!idValidation.success) {
      return createErrorResponse('Invalid user ID format', 400);
    }

    // Check authorization (users can only view their own progress, admins can view any)
    if (user._id.toString() !== params.userId && user.role !== 'admin') {
      return createErrorResponse('Access denied. You can only view your own progress.', 403);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get overall progress statistics
    const overallProgress = await UserProgress.getUserOverallProgress(params.userId);

    // Get enrollment statistics
    const enrollments = await UserEnrollment.getByUser(params.userId);
    const activeEnrollments = enrollments.filter(e => e.status === 'active' || e.status === 'paused');
    const completedEnrollments = enrollments.filter(e => e.status === 'completed');

    // Calculate enrollment progress summary
    const enrollmentStats = {
      total: enrollments.length,
      active: activeEnrollments.length,
      completed: completedEnrollments.length,
      avgProgress: enrollments.length > 0 
        ? enrollments.reduce((sum, e) => sum + e.progressPercentage, 0) / enrollments.length 
        : 0
    };

    // Get recent progress (last 10 items)
    const recentProgress = await UserProgress.find({
      userId: params.userId,
      isActive: true
    })
      .populate(['content', 'module'])
      .sort({ lastAccessedAt: -1 })
      .limit(10);

    // Calculate content type breakdown
    const contentTypeProgress = await UserProgress.aggregate([
      { $match: { userId: new (UserProgress as any).base.Types.ObjectId(params.userId), isActive: true } },
      {
        $group: {
          _id: "$contentType",
          total: { $sum: 1 },
          completed: { 
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } 
          },
          avgProgress: { $avg: "$progressPercentage" },
          totalTimeSpent: { $sum: "$timeSpent" }
        }
      }
    ]);

    return createSuccessResponse(
      { 
        overallProgress,
        enrollmentStats,
        contentTypeProgress,
        recentProgress,
        summary: {
          totalContent: overallProgress.reduce((sum: number, item: any) => sum + item.count, 0),
          completedContent: overallProgress.find((item: any) => item._id === 'completed')?.count || 0,
          totalTimeSpent: overallProgress.reduce((sum: number, item: any) => sum + (item.totalTimeSpent || 0), 0),
          avgScore: overallProgress.reduce((sum: number, item: any) => sum + (item.avgScore || 0), 0) / overallProgress.length || 0
        }
      },
      'User progress overview retrieved successfully'
    );

  } catch (error) {
    console.error('Get progress overview error:', error);
    
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