import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import Module from '@/lib/models/Module';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { enrollmentSchema } from '@/lib/validators/content';

// GET /api/enrollments - Get user enrollments
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    // const includeModule = searchParams.get('includeModule') !== 'false'; // default true

    // Get user enrollments
    let enrollments;
    if (status === 'active') {
      enrollments = await UserEnrollment.getActiveEnrollments(user._id.toString());
    } else if (status === 'completed') {
      enrollments = await UserEnrollment.getCompletedEnrollments(user._id.toString());
    } else {
      enrollments = await UserEnrollment.getByUser(user._id.toString(), status || undefined);
    }

    return createSuccessResponse(
      { enrollments },
      'User enrollments retrieved successfully'
    );

  } catch (error) {
    console.error('Get enrollments error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/enrollments - Enroll in module
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 15 * 60 * 1000)) { // 10 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = enrollmentSchema.safeParse(body);
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

    const { moduleId } = validationResult.data;

    // Ensure database connection
    await ensureDBConnection();

    // Verify that the module exists and is active
    const moduleDoc = await Module.findOne({ _id: moduleId, isActive: true });
    if (!moduleDoc) {
      return createErrorResponse('Module not found or not available', 404);
    }

    // Check if user is already enrolled
    const existingEnrollment = await UserEnrollment.findOne({
      userId: user._id,
      moduleId,
      isActive: true
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === 'dropped') {
        // Re-activate dropped enrollment
        existingEnrollment.status = 'active';
        existingEnrollment.lastAccessedAt = new Date();
        await existingEnrollment.save();
        await existingEnrollment.populate('module');
        
        return createSuccessResponse(
          { enrollment: existingEnrollment },
          'Enrollment reactivated successfully'
        );
      } else {
        return createErrorResponse('Already enrolled in this module', 409);
      }
    }

    // Create new enrollment
    const enrollment = new UserEnrollment({
      userId: user._id,
      moduleId,
      status: 'active',
      enrolledAt: new Date(),
      lastAccessedAt: new Date(),
      progressPercentage: 0,
      completedSections: 0,
      totalSections: 0, // This should be calculated based on module content
      timeSpent: 0,
      isActive: true
    });

    await enrollment.save();
    await enrollment.populate('module');

    // Update user stats (enrollment count)
    // Note: We don't track totalEnrollments in the User stats schema
    // This could be tracked separately if needed
    await user.save();

    return createSuccessResponse(
      { enrollment },
      'Successfully enrolled in module',
      201
    );

  } catch (error) {
    console.error('Create enrollment error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('unique')) {
        return createErrorResponse('Already enrolled in this module', 409);
      }
      if (error.message.includes('token')) {
        return createErrorResponse(error.message, 401);
      }
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}