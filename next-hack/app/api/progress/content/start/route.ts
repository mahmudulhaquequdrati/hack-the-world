import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserProgress from '@/lib/models/UserProgress';
import UserEnrollment from '@/lib/models/UserEnrollment';
import Content from '@/lib/models/Content';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { z } from 'zod';

// Validation schema
const startContentSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required')
});

// POST /api/progress/content/start - Mark content as started
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

    const validation = startContentSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        `Validation error: ${validation.error.errors.map(e => e.message).join(', ')}`,
        400
      );
    }

    const { contentId } = validation.data;

    // Ensure database connection
    await ensureDBConnection();

    // Check if content exists
    const content = await Content.findById(contentId);
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
      return createErrorResponse('User is not enrolled in this module', 403);
    }

    // Find existing progress record
    let progress = await UserProgress.findByUserAndContent(user._id.toString(), contentId);

    // Progress validation - Skip if already in progress or completed
    if (
      progress &&
      (progress.status === 'in_progress' || progress.status === 'completed')
    ) {
      // Content already started or completed - return existing progress without making changes
      await progress.populate('contentId', 'title type section moduleId');

      return createSuccessResponse(
        {
          progress,
          alreadyStarted: true // Flag for frontend to know no action was taken
        },
        `Content already ${progress.status}`
      );
    }

    if (progress) {
      // Mark as started if not already started (status is "not_started")
      if (progress.status === 'not_started') {
        progress.status = 'in_progress';
        progress.progressPercentage = 1;
        progress.startedAt = new Date();
        progress.lastAccessedAt = new Date();
        await progress.save();
      }
    } else {
      // Create new progress record in "in_progress" state
      progress = new UserProgress({
        userId: user._id,
        contentId,
        moduleId: content.moduleId,
        status: 'in_progress',
        progressPercentage: 1,
        timeSpent: 0,
        attempts: 0,
        lastPosition: 0,
        startedAt: new Date(),
        lastAccessedAt: new Date(),
        isActive: true
      });
      await progress.save();
    }

    // Populate content details
    await progress.populate('contentId', 'title type section moduleId');

    return createSuccessResponse(
      {
        progress,
        alreadyStarted: false
      },
      'Content started successfully'
    );

  } catch (error) {
    console.error('Mark content started error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}