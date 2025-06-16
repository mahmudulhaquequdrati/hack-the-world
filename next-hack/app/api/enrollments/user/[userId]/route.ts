import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { RouteContext, UserRouteParams } from '@/types/route-params';

// GET /api/enrollments/user/[userId] - Get enrollments for specific user (Admin only)
export async function GET(request: NextRequest, context: RouteContext<UserRouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 50, 15 * 60 * 1000)) { // 50 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate and require admin role
    const user = await authenticate(request);
    requireAdmin(user);

    // Validate user ID
    const idValidation = objectIdSchema.safeParse(params.userId);
    if (!idValidation.success) {
      return createErrorResponse('Invalid user ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Get user enrollments
    const enrollments = await UserEnrollment.getByUser(params.userId, status || undefined);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedEnrollments = enrollments.slice(startIndex, startIndex + limit);

    // Get total count for pagination
    const total = enrollments.length;

    return createSuccessResponse(
      { 
        enrollments: paginatedEnrollments,
        user: { id: params.userId },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      'User enrollments retrieved successfully'
    );

  } catch (error) {
    console.error('Get user enrollments error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('token') || error.message.includes('authorization')) {
        return createErrorResponse(error.message, 401);
      }
      if (error.message.includes('admin')) {
        return createErrorResponse(error.message, 403);
      }
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}