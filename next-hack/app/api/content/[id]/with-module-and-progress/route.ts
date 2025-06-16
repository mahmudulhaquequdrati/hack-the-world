import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import UserProgress from '@/lib/models/UserProgress';
import UserEnrollment from '@/lib/models/UserEnrollment';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/content/[id]/with-module-and-progress - Get content with module and progress info
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
    const idValidation = objectIdSchema.safeParse(params.id);
    if (!idValidation.success) {
      return createErrorResponse('Invalid content ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Find content with module and phase information
    const content = await Content.findOne({ 
      _id: params.id, 
      isActive: true 
    }).populate({
      path: 'module',
      populate: {
        path: 'phase',
        model: 'Phase'
      }
    });

    if (!content) {
      return createErrorResponse('Content not found', 404);
    }

    // Check if user is enrolled in the module
    const enrollment = await UserEnrollment.findOne({
      userId: user._id,
      moduleId: content.moduleId,
      isActive: true
    });

    if (!enrollment) {
      return createErrorResponse('You must be enrolled in this module to access this content', 403);
    }

    // Find or create user progress for this content
    let progress = await UserProgress.findOne({
      userId: user._id,
      contentId: params.id,
      isActive: true
    });

    // Auto-start content if no progress exists
    if (!progress) {
      progress = new UserProgress({
        userId: user._id,
        contentId: params.id,
        moduleId: content.moduleId,
        contentType: content.type,
        status: 'not_started',
        progressPercentage: 0,
        timeSpent: 0,
        attempts: 0,
        lastAccessedAt: new Date(),
        isActive: true
      });
      
      await progress.save();
    } else {
      // Update last accessed time
      progress.lastAccessedAt = new Date();
      await progress.save();
    }

    // Get navigation context (previous/next content)
    const navigation = await content.getNavigation();

    // Build response with all related data
    const response = {
      content: {
        ...content.toObject(),
        module: content.module,
      },
      progress: {
        id: progress._id,
        status: progress.status,
        progressPercentage: progress.progressPercentage,
        timeSpent: progress.timeSpent,
        score: progress.score,
        attempts: progress.attempts,
        lastPosition: progress.lastPosition,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
        lastAccessedAt: progress.lastAccessedAt,
        notes: progress.notes
      },
      enrollment: {
        id: enrollment._id,
        status: enrollment.status,
        progressPercentage: enrollment.progressPercentage,
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt
      },
      navigation: {
        previous: navigation.previous ? {
          id: navigation.previous._id,
          title: navigation.previous.title,
          type: navigation.previous.type,
          order: navigation.previous.order
        } : null,
        next: navigation.next ? {
          id: navigation.next._id,
          title: navigation.next.title,
          type: navigation.next.type,
          order: navigation.next.order
        } : null
      }
    };

    return createSuccessResponse(
      response,
      'Content with module and progress retrieved successfully'
    );

  } catch (error) {
    console.error('Get content with module and progress error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('token')) {
        return createErrorResponse(error.message, 401);
      }
      if (error.message.includes('enrolled')) {
        return createErrorResponse(error.message, 403);
      }
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}