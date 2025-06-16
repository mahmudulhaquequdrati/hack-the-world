import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserProgress from '@/lib/models/UserProgress';
import UserEnrollment from '@/lib/models/UserEnrollment';
import Content from '@/lib/models/Content';
import User from '@/lib/models/User';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { RouteContext, UserContentParams } from '@/types/route-params';

// GET /api/progress/content/[userId]/[contentType] - Get user progress by content type
export async function GET(request: NextRequest, context: RouteContext<UserContentParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Validate userId
    const userIdValidation = objectIdSchema.safeParse(params.userId);
    if (!userIdValidation.success) {
      return createErrorResponse('Invalid user ID format', 400);
    }

    // Validate content type
    const validContentTypes = ['video', 'lab', 'game', 'document'];
    if (!validContentTypes.includes(params.contentType)) {
      return createErrorResponse(
        `Invalid content type. Must be one of: ${validContentTypes.join(', ')}`,
        400
      );
    }

    // Check if user exists
    const targetUser = await User.findById(params.userId);
    if (!targetUser) {
      return createErrorResponse('User not found', 404);
    }

    // Authorization - admin can access any user, users can only access their own
    if (user.role !== 'admin' && user._id.toString() !== params.userId) {
      return createErrorResponse('Not authorized to access this progress', 403);
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const status = searchParams.get('status');

    // Ensure database connection
    await ensureDBConnection();

    // Get user's enrollments
    const enrollments = await UserEnrollment.find({
      userId: params.userId,
      status: { $in: ['active', 'completed'] }
    }).populate('moduleId', 'title description difficulty phase');

    if (enrollments.length === 0) {
      return createSuccessResponse(
        {
          content: [],
          statistics: {
            total: 0,
            completed: 0,
            inProgress: 0,
            notStarted: 0,
            averageProgress: 0
          },
          modules: []
        },
        `User ${params.contentType} progress retrieved successfully`
      );
    }

    const enrolledModuleIds = enrollments.map(e => e.moduleId._id.toString());

    // Build content query
    const contentQuery: Record<string, unknown> = {
      moduleId: { $in: enrolledModuleIds },
      type: params.contentType,
      isActive: true
    };

    if (moduleId) {
      const moduleIdValidation = objectIdSchema.safeParse(moduleId);
      if (!moduleIdValidation.success) {
        return createErrorResponse('Invalid module ID format', 400);
      }
      contentQuery.moduleId = moduleId;
    }

    // Get content
    const content = await Content.find(contentQuery)
      .populate('moduleId', 'title description difficulty phase')
      .sort({ moduleId: 1, createdAt: 1 });

    if (content.length === 0) {
      return createSuccessResponse(
        {
          content: [],
          statistics: {
            total: 0,
            completed: 0,
            inProgress: 0,
            notStarted: 0,
            averageProgress: 0
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          modules: enrollments.map((e: any) => ({
            id: e.moduleId._id,
            title: e.moduleId.title,
            description: e.moduleId.description,
            difficulty: e.moduleId.difficulty
          }))
        },
        `No ${params.contentType} content found for enrolled modules`
      );
    }

    // Get progress for all content
    const contentIds = content.map(c => c._id.toString());
    const progressRecords = await UserProgress.find({
      userId: params.userId,
      contentId: { $in: contentIds },
      isActive: true
    });

    // Create progress map for quick lookup
    const progressMap = new Map();
    progressRecords.forEach(p => {
      progressMap.set(p.contentId.toString(), p);
    });

    // Build response data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contentWithProgress = content.map((c: any) => {
      const progress = progressMap.get(c._id.toString());
      return {
        id: c._id,
        title: c.title,
        description: c.description,
        type: c.type,
        section: c.section,
        duration: c.duration,
        order: c.order,
        moduleId: c.moduleId._id,
        module: {
          title: c.moduleId.title,
          description: c.moduleId.description,
          difficulty: c.moduleId.difficulty
        },
        progress: progress ? {
          status: progress.status,
          progressPercentage: progress.progressPercentage,
          score: progress.score,
          maxScore: progress.maxScore,
          timeSpent: progress.timeSpent,
          attempts: progress.attempts,
          startedAt: progress.startedAt,
          completedAt: progress.completedAt,
          lastAccessedAt: progress.lastAccessedAt
        } : {
          status: 'not_started',
          progressPercentage: 0,
          score: null,
          maxScore: null,
          timeSpent: 0,
          attempts: 0,
          startedAt: null,
          completedAt: null,
          lastAccessedAt: null
        }
      };
    });

    // Filter by status if provided
    const filteredContent = status 
      ? contentWithProgress.filter(c => c.progress.status === status)
      : contentWithProgress;

    // Calculate statistics
    const total = contentWithProgress.length;
    const completed = contentWithProgress.filter(c => c.progress.status === 'completed').length;
    const inProgress = contentWithProgress.filter(c => c.progress.status === 'in_progress').length;
    const notStarted = contentWithProgress.filter(c => c.progress.status === 'not_started').length;
    const averageProgress = total > 0 
      ? contentWithProgress.reduce((sum, c) => sum + c.progress.progressPercentage, 0) / total 
      : 0;

    // Get unique modules
    const modules = Array.from(
      new Map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        enrollments.map((e: any) => [
          e.moduleId._id.toString(),
          {
            id: e.moduleId._id,
            title: e.moduleId.title,
            description: e.moduleId.description,
            difficulty: e.moduleId.difficulty,
            phase: e.moduleId.phase
          }
        ])
      ).values()
    );

    return createSuccessResponse(
      {
        content: filteredContent,
        statistics: {
          total,
          completed,
          inProgress,
          notStarted,
          averageProgress: Math.round(averageProgress * 100) / 100
        },
        modules,
        filters: {
          contentType: params.contentType,
          moduleId,
          status
        }
      },
      `User ${params.contentType} progress retrieved successfully`
    );

  } catch (error) {
    console.error('Get user content type progress error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('token') || error.message.includes('authorization')) {
        return createErrorResponse(error.message, 401);
      }
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}