import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import UserEnrollment from '@/lib/models/UserEnrollment';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// GET /api/enrollments/admin/all - Get all enrollments with pagination (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 50, 15 * 60 * 1000)) { // 50 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate and require admin role
    const user = await authenticate(request);
    requireAdmin(user);

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const moduleId = searchParams.get('moduleId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: Record<string, unknown> = { isActive: true };
    if (status) query.status = status;
    if (moduleId) query.moduleId = moduleId;

    // Get enrollments with user and module population
    const enrollments = await UserEnrollment.find(query)
      .populate('user', 'username email profile.firstName profile.lastName')
      .populate('module', 'title description phase')
      .sort({ enrolledAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await UserEnrollment.countDocuments(query);

    // Calculate summary statistics
    const summaryStats = await UserEnrollment.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProgress: { $avg: '$progressPercentage' }
        }
      }
    ]);

    return createSuccessResponse(
      { 
        enrollments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        summary: summaryStats,
        filters: {
          status,
          moduleId
        }
      },
      'All enrollments retrieved successfully'
    );

  } catch (error) {
    console.error('Get all enrollments error:', error);
    
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