import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserProgress from '@/lib/models/UserProgress';
import UserEnrollment from '@/lib/models/UserEnrollment';
import Content from '@/lib/models/Content';
import User from '@/lib/models/User';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { z } from 'zod';

// Validation schema
const completeContentSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
  score: z.number().optional(),
  maxScore: z.number().optional()
});

// POST /api/progress/content/complete - Mark content as completed
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

    const validation = completeContentSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        `Validation error: ${validation.error.errors.map(e => e.message).join(', ')}`,
        400
      );
    }

    const { contentId, score, maxScore } = validation.data;

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

    // Find or create progress record
    let progress = await UserProgress.findOne({
      userId: user._id,
      contentId: contentId,
      isActive: true
    });

    if (progress) {
      // Update existing progress to completed
      progress.status = 'completed';
      progress.progressPercentage = 100;
      progress.completedAt = new Date();
      progress.lastAccessedAt = new Date();

      if (score !== undefined && score !== null) {
        progress.score = score;
      }

      if (maxScore !== undefined && maxScore !== null) {
        progress.maxScore = maxScore;
      }
    } else {
      // Create new completed progress record
      progress = new UserProgress({
        userId: user._id,
        contentId,
        moduleId: content.moduleId,
        contentType: content.type,
        status: 'completed',
        progressPercentage: 100,
        timeSpent: 0,
        attempts: 1,
        lastPosition: 100,
        startedAt: new Date(),
        completedAt: new Date(),
        lastAccessedAt: new Date(),
        score: score !== undefined ? score : undefined,
        maxScore: maxScore !== undefined ? maxScore : undefined,
        isActive: true
      });
    }

    await progress.save();

    // Update user stats for content completion
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        [`stats.${content.type}sCompleted`]: 1,
        'stats.totalPoints': getContentPoints(content.type)
      }
    });

    // Note: Enrollment progress is automatically updated by UserEnrollment.updateProgress method
    // when individual content items are completed

    // Populate content details
    await progress.populate('contentId', 'title type section moduleId');

    return createSuccessResponse(
      {
        progress,
        pointsAwarded: getContentPoints(content.type)
      },
      'Content completed successfully'
    );

  } catch (error) {
    console.error('Mark content complete error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}

// Helper function to calculate points based on content type
function getContentPoints(contentType: string): number {
  const pointMap: Record<string, number> = {
    video: 10,
    lab: 50,
    game: 30,
    document: 5
  };
  return pointMap[contentType] || 10;
}