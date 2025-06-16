import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserProgress from '@/lib/models/UserProgress';
import UserEnrollment from '@/lib/models/UserEnrollment';
import Content from '@/lib/models/Content';
import User from '@/lib/models/User';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { z } from 'zod';

// Validation schema
const updateProgressSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
  progressPercentage: z.number().min(0).max(100, 'Progress percentage must be between 0 and 100')
});

// POST /api/progress/content/update - Update content progress
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    const validation = updateProgressSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        `Validation error: ${validation.error.errors.map(e => e.message).join(', ')}`,
        400
      );
    }

    const { contentId, progressPercentage } = validation.data;

    // Ensure database connection
    await ensureDBConnection();

    // Check if content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return createErrorResponse('Content not found', 404);
    }

    // Check if user is enrolled in the module
    const enrollment = await UserEnrollment.findByUserAndModule(
      user._id.toString(),
      content.moduleId.toString()
    );
    if (!enrollment) {
      return createErrorResponse('User is not enrolled in this module', 403);
    }

    // Find or create progress record
    let progress = await UserProgress.findByUserAndContent(user._id.toString(), contentId);
    let isNewProgress = false;
    let wasCompleted = false;

    if (progress) {
      // Update existing progress
      wasCompleted = progress.status === 'completed';
      progress.progressPercentage = progressPercentage;
      progress.lastAccessedAt = new Date();

      // Auto-complete if 90% or more for videos
      if (content.type === 'video' && progressPercentage >= 90) {
        progress.status = 'completed';
        progress.progressPercentage = 100;
        progress.completedAt = new Date();
      } else if (progressPercentage > 0 && progress.status === 'not_started') {
        progress.status = 'in_progress';
        progress.startedAt = new Date();
      }
    } else {
      // Create new progress record
      isNewProgress = true;
      const status = 
        content.type === 'video' && progressPercentage >= 90
          ? 'completed'
          : progressPercentage > 0
            ? 'in_progress'
            : 'not_started';

      progress = new UserProgress({
        userId: user._id,
        contentId,
        moduleId: content.moduleId,
        contentType: content.type,
        status,
        progressPercentage: content.type === 'video' && progressPercentage >= 90 ? 100 : progressPercentage,
        timeSpent: 0,
        attempts: 0,
        lastPosition: progressPercentage,
        startedAt: progressPercentage > 0 ? new Date() : undefined,
        completedAt: status === 'completed' ? new Date() : undefined,
        lastAccessedAt: new Date(),
        isActive: true
      });
    }

    await progress.save();

    // If video was auto-completed (90%+), award points and update stats
    if (content.type === 'video' && progressPercentage >= 90 && !wasCompleted) {
      await User.findByIdAndUpdate(user._id, {
        $inc: {
          'stats.videosCompleted': 1,
          'stats.totalPoints': 10 // Points for video completion
        }
      });

      // Update enrollment progress
      await UserEnrollment.updateProgressForUser(user._id.toString(), content.moduleId.toString(), {
        progressPercentage: Math.min(100, progressPercentage + 10) // Increment progress
      });
    }

    // Populate content details
    await progress.populate('contentId', 'title type section moduleId');

    const responseData: Record<string, unknown> = {
      progress,
      isNewProgress,
      autoCompleted: content.type === 'video' && progressPercentage >= 90 && !wasCompleted
    };

    if (content.type === 'video' && progressPercentage >= 90 && !wasCompleted) {
      responseData.pointsAwarded = 10;
    }

    return createSuccessResponse(
      responseData,
      progress.status === 'completed' 
        ? 'Content completed successfully' 
        : 'Content progress updated successfully'
    );

  } catch (error) {
    console.error('Update content progress error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}