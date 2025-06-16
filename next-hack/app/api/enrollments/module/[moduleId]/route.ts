import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';

interface RouteParams {
  params: {
    moduleId: string;
  };
}

// GET /api/enrollments/module/[moduleId] - Get user's enrollment for specific module
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate user
    const user = await authenticate(request);

    // Validate module ID
    const idValidation = objectIdSchema.safeParse(params.moduleId);
    if (!idValidation.success) {
      return createErrorResponse('Invalid module ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Find user's enrollment for this module
    const enrollment = await UserEnrollment.findOne({
      userId: user._id,
      moduleId: params.moduleId,
      isActive: true
    }).populate('module');

    if (!enrollment) {
      return createErrorResponse('Enrollment not found for this module', 404);
    }

    return createSuccessResponse(
      { enrollment },
      'Module enrollment retrieved successfully'
    );

  } catch (error) {
    console.error('Get module enrollment error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}