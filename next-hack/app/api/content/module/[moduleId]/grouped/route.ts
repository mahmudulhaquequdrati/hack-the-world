import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { RouteContext, ModuleRouteParams } from '@/types/route-params';


// GET /api/content/module/[moduleId]/grouped - Get content grouped by type
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

    // Get content grouped by type using the static method
    const groupedContent = await Content.getByModuleGrouped(params.moduleId);

    // Transform the result to a more convenient format
    const contentByType = groupedContent.reduce((acc: Record<string, unknown>, group: { _id: string; items: unknown[]; count: number }) => {
      acc[group._id] = {
        type: group._id,
        items: group.items,
        count: group.count
      };
      return acc;
    }, {});

    return createSuccessResponse(
      { 
        contentByType,
        groupedContent 
      },
      'Grouped content for module retrieved successfully'
    );

  } catch (error) {
    console.error('Get grouped content by module error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}