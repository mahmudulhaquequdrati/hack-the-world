import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { RouteContext, RouteParams } from '@/types/route-params';

// PUT /api/enrollments/[id]/pause - Pause enrollment
export async function PUT(request: NextRequest, context: RouteContext<RouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 20, 15 * 60 * 1000)) { // 20 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Validate ID
    const idValidation = objectIdSchema.safeParse(params.id);
    if (!idValidation.success) {
      return createErrorResponse('Invalid enrollment ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Find enrollment (user can only pause their own enrollments)
    const enrollment = await UserEnrollment.findOne({
      _id: params.id,
      userId: user._id,
      isActive: true
    });

    if (!enrollment) {
      return createErrorResponse('Enrollment not found', 404);
    }

    // Check if enrollment can be paused
    if (enrollment.status !== 'active') {
      return createErrorResponse(`Cannot pause enrollment with status: ${enrollment.status}`, 400);
    }

    // Pause enrollment using the instance method
    await enrollment.pause();
    await enrollment.populate('module');

    return createSuccessResponse(
      { enrollment },
      'Enrollment paused successfully'
    );

  } catch (error) {
    console.error('Pause enrollment error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}