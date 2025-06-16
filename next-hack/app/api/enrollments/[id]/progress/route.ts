import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { progressUpdateSchema, objectIdSchema } from '@/lib/validators/content';

interface RouteParams {
  params: {
    id: string;
  };
}

// PUT /api/enrollments/[id]/progress - Update enrollment progress
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Update status if provided
    if (status && status !== enrollment.status) {
      enrollment.status = status;
      if (status === 'completed') {
        enrollment.completedAt = new Date();
        
        // Update user stats
        user.stats.totalCompletedModules = (user.stats.totalCompletedModules || 0) + 1;
        await user.save();
      }
      await enrollment.save();
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