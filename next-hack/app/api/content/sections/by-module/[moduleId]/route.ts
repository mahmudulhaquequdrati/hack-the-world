import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { RouteContext, ModuleRouteParams } from '@/types/route-params';

// GET /api/content/sections/by-module/[moduleId] - Get distinct sections by module
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

    // Get distinct sections for the module
    const sections = await Content.getSectionsByModule(params.moduleId);

    // Filter out null/undefined sections and sort
    const validSections = sections
      .filter((section: string | null) => section && section.trim())
      .sort();

    return createSuccessResponse(
      { 
        sections: validSections,
        moduleId: params.moduleId,
        count: validSections.length
      },
      'Sections retrieved successfully'
    );

  } catch (error) {
    console.error('Get sections by module error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}