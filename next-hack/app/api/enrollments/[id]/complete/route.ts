import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import User from '@/lib/models/User';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { z } from 'zod';

interface RouteParams {
  params: {
    id: string;
  };
}

const completeEnrollmentSchema = z.object({
  grade: z.number().min(0).max(100).optional(),
  feedback: z.string().trim().max(1000).optional(),
});

// PUT /api/enrollments/[id]/complete - Complete enrollment
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 15 * 60 * 1000)) { // 10 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Validate ID
    const idValidation = objectIdSchema.safeParse(params.id);
    if (!idValidation.success) {
      return createErrorResponse('Invalid enrollment ID format', 400);
    }

    // Parse request body (optional grade and feedback)
    let validatedData = {};
    try {
      const body = await request.json();
      const validationResult = completeEnrollmentSchema.safeParse(body);
      if (!validationResult.success) {
        return createErrorResponse(
          'Validation failed',
          400,
          validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        );
      }
      validatedData = validationResult.data;
    } catch {
      // Empty body is acceptable for completion
    }

    // Ensure database connection
    await ensureDBConnection();

    // Find enrollment (user can only complete their own enrollments)
    const enrollment = await UserEnrollment.findOne({
      _id: params.id,
      userId: user._id,
      isActive: true
    });

    if (!enrollment) {
      return createErrorResponse('Enrollment not found', 404);
    }

    // Check if enrollment can be completed
    if (enrollment.status === 'completed') {
      return createErrorResponse('Enrollment is already completed', 400);
    }

    if (enrollment.status === 'dropped') {
      return createErrorResponse('Cannot complete a dropped enrollment', 400);
    }

    // Complete enrollment using the instance method
    const { grade, feedback } = validatedData as { grade?: number; feedback?: string };
    await enrollment.complete(grade, feedback);

    // Update user stats
    const userDoc = await User.findById(user._id);
    if (userDoc) {
      userDoc.stats.totalCompletedModules = (userDoc.stats.totalCompletedModules || 0) + 1;
      
      // Update streak if this completion happened today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastActivity = new Date(userDoc.lastActiveAt || 0);
      lastActivity.setHours(0, 0, 0, 0);
      
      if (lastActivity.getTime() === today.getTime()) {
        // User was already active today, maintain streak
        userDoc.lastActiveAt = new Date();
      } else if (lastActivity.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
        // User was active yesterday, increment streak
        userDoc.currentStreak = (userDoc.currentStreak || 0) + 1;
        userDoc.longestStreak = Math.max(userDoc.longestStreak || 0, userDoc.currentStreak);
        userDoc.lastActiveAt = new Date();
      } else {
        // Reset streak
        userDoc.currentStreak = 1;
        userDoc.lastActiveAt = new Date();
      }
      
      await userDoc.save();
    }

    await enrollment.populate('module');

    return createSuccessResponse(
      { enrollment },
      'Enrollment completed successfully'
    );

  } catch (error) {
    console.error('Complete enrollment error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}