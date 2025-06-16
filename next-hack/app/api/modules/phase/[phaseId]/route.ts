import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Module from '@/lib/models/Module';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { RouteContext, PhaseRouteParams } from '@/types/route-params';

// GET /api/modules/phase/[phaseId] - Get modules by phase
export async function GET(request: NextRequest, context: RouteContext<PhaseRouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Validate phase ID
    const idValidation = objectIdSchema.safeParse(params.phaseId);
    if (!idValidation.success) {
      return createErrorResponse('Invalid phase ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get modules by phase using the static method
    const modules = await Module.getByPhase(params.phaseId);

    return createSuccessResponse(
      { modules },
      'Modules for phase retrieved successfully'
    );

  } catch (error) {
    console.error('Get modules by phase error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}