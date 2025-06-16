import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { enrollmentUpdateSchema, objectIdSchema } from '@/lib/validators/content';
import { RouteContext, RouteParams } from '@/types/route-params';

// GET /api/enrollments/[id] - Get specific enrollment
export async function GET(request: NextRequest, context: RouteContext<RouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
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

    // Find enrollment (user can only access their own enrollments)
    const enrollment = await UserEnrollment.findOne({
      _id: params.id,
      userId: user._id,
      isActive: true
    }).populate('module');

    if (!enrollment) {
      return createErrorResponse('Enrollment not found', 404);
    }

    return createSuccessResponse(
      { enrollment },
      'Enrollment retrieved successfully'
    );

  } catch (error) {
    console.error('Get enrollment error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}

// PUT /api/enrollments/[id] - Update enrollment
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

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = enrollmentUpdateSchema.safeParse(body);
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

    // Ensure database connection
    await ensureDBConnection();

    // Find and update enrollment (user can only update their own enrollments)
    const enrollment = await UserEnrollment.findOne({
      _id: params.id,
      userId: user._id,
      isActive: true
    });

    if (!enrollment) {
      return createErrorResponse('Enrollment not found', 404);
    }

    // Update enrollment with validated data
    Object.assign(enrollment, validationResult.data);
    enrollment.lastAccessedAt = new Date();

    // Handle status changes
    if (validationResult.data.status === 'completed' && enrollment.status !== 'completed') {
      enrollment.completedAt = new Date();
      enrollment.progressPercentage = 100;
      
      // Update user stats
      user.stats.coursesCompleted = (user.stats.coursesCompleted || 0) + 1;
      await user.save();
    }

    await enrollment.save();
    await enrollment.populate('module');

    return createSuccessResponse(
      { enrollment },
      'Enrollment updated successfully'
    );

  } catch (error) {
    console.error('Update enrollment error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}

// DELETE /api/enrollments/[id] - Unenroll from module
export async function DELETE(request: NextRequest, context: RouteContext<RouteParams>) {
  const params = await context.params;
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

    // Ensure database connection
    await ensureDBConnection();

    // Find enrollment (user can only delete their own enrollments)
    const enrollment = await UserEnrollment.findOne({
      _id: params.id,
      userId: user._id,
      isActive: true
    });

    if (!enrollment) {
      return createErrorResponse('Enrollment not found', 404);
    }

    // Prevent unenrollment from completed modules (optional business rule)
    if (enrollment.status === 'completed') {
      return createErrorResponse('Cannot unenroll from completed modules', 400);
    }

    // Soft delete (mark as dropped and inactive)
    enrollment.status = 'dropped';
    enrollment.isActive = false;
    await enrollment.save();

    return createSuccessResponse(
      null,
      'Successfully unenrolled from module'
    );

  } catch (error) {
    console.error('Delete enrollment error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}