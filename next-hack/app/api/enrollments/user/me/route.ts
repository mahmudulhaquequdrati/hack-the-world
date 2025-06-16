import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import { authenticate, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// GET /api/enrollments/user/me - Get current user enrollments (alias endpoint)
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Get user enrollments based on status
    let enrollments;
    if (status === 'active') {
      enrollments = await UserEnrollment.getActiveEnrollments(user._id.toString());
    } else if (status === 'completed') {
      enrollments = await UserEnrollment.getCompletedEnrollments(user._id.toString());
    } else {
      enrollments = await UserEnrollment.getByUser(user._id.toString(), status || undefined);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedEnrollments = enrollments.slice(startIndex, startIndex + limit);

    return createSuccessResponse(
      { 
        enrollments: paginatedEnrollments,
        pagination: {
          page,
          limit,
          total: enrollments.length,
          pages: Math.ceil(enrollments.length / limit)
        }
      },
      'Current user enrollments retrieved successfully'
    );

  } catch (error) {
    console.error('Get current user enrollments error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return createErrorResponse(error.message, 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}