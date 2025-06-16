import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { RouteContext, ModuleRouteParams } from '@/types/route-params';

// GET /api/content/module/[moduleId]/first - Get first content in module
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

    // Get first content by module using the static method
    const content = await Content.getFirstByModule(params.moduleId);

    if (!content) {
      return createErrorResponse('No content found for this module', 404);
    }

    return createSuccessResponse(
      { content },
      'First content for module retrieved successfully'
    );

  } catch (error) {
    console.error('Get first content by module error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}