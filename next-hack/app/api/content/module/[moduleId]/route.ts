import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { RouteContext, ModuleRouteParams } from '@/types/route-params';


// GET /api/content/module/[moduleId] - Get content by module
export async function GET(request: NextRequest, context: RouteContext<ModuleRouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Validate module ID
    const idValidation = objectIdSchema.safeParse(params.moduleId);
    if (!idValidation.success) {
      return createErrorResponse('Invalid module ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get content by module using the static method
    const content = await Content.getByModule(params.moduleId);

    return createSuccessResponse(
      { content },
      'Content for module retrieved successfully'
    );

  } catch (error) {
    console.error('Get content by module error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}