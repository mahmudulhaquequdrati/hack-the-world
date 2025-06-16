import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { progressUpdateSchema, objectIdSchema } from '@/lib/validators/content';
import { RouteContext, RouteParams } from '@/types/route-params';

// PUT /api/enrollments/[id]/progress - Update enrollment progress
export async function PUT(request: NextRequest, context: RouteContext<RouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 50, 15 * 60 * 1000)) { // 50 requests per 15 minutes (high for progress updates)
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Validate ID
    const idValidation = objectIdSchema.safeParse(params.id);
    if (!idValidation.success) {
      return createErrorResponse('Invalid enrollment ID format', 400);
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = progressUpdateSchema.safeParse(body);
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

    const { progressPercentage, status } = validationResult.data;

    // Ensure database connection
    await ensureDBConnection();

    // Find enrollment (user can only update their own enrollments)
    const enrollment = await UserEnrollment.findOne({
      _id: params.id,
      userId: user._id,
      isActive: true
    });

    if (!enrollment) {
      return createErrorResponse('Enrollment not found', 404);
    }

    // Update progress using the instance method
    await enrollment.updateProgress(progressPercentage);

    // Update status if provided - map progress status to enrollment status
    if (status) {
      let enrollmentStatus: 'active' | 'completed' | 'paused' | 'dropped';
      switch (status) {
        case 'not_started':
        case 'in_progress':
          enrollmentStatus = 'active';
          break;
        case 'completed':
          enrollmentStatus = 'completed';
          break;
        default:
          enrollmentStatus = 'active';
      }
      
      if (enrollmentStatus !== enrollment.status) {
        enrollment.status = enrollmentStatus;
        if (enrollmentStatus === 'completed') {
          enrollment.completedAt = new Date();
          
          // Update user stats
          user.stats.coursesCompleted = (user.stats.coursesCompleted || 0) + 1;
          await user.save();
        }
        await enrollment.save();
      }
    }

    await enrollment.populate('module');

    return createSuccessResponse(
      { enrollment },
      'Enrollment progress updated successfully'
    );

  } catch (error) {
    console.error('Update enrollment progress error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}