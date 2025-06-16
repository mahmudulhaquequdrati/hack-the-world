import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { RouteContext, TypeRouteParams } from '@/types/route-params';

// GET /api/content/type/[type] - Get content by type
export async function GET(request: NextRequest, context: RouteContext<TypeRouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Validate content type
    const validContentTypes = ['video', 'lab', 'game', 'document'];
    if (!validContentTypes.includes(params.type)) {
      return createErrorResponse('Invalid content type. Must be one of: video, lab, game, document', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: Record<string, unknown> = { 
      type: params.type, 
      isActive: true 
    };
    
    if (moduleId) {
      query.moduleId = moduleId;
    }

    // Get content by type using static method with additional filtering
    const contentQuery = Content.find(query)
      .populate('module')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const content = await contentQuery;
    const total = await Content.countDocuments(query);

    return createSuccessResponse(
      { 
        content,
        type: params.type,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      `${params.type} content retrieved successfully`
    );

  } catch (error) {
    console.error('Get content by type error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}