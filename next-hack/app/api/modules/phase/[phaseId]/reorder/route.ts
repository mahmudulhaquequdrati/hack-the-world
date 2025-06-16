import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Module from '@/lib/models/Module';
import Phase from '@/lib/models/Phase';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { z } from 'zod';
import { RouteContext, PhaseRouteParams } from '@/types/route-params';

// Validation schema
const moduleOrderSchema = z.object({
  moduleId: z.string().min(1, 'Module ID is required'),
  order: z.number().min(1, 'Order must be at least 1')
});

const reorderSchema = z.object({
  moduleOrders: z.array(moduleOrderSchema).min(1, 'At least one module order is required')
});

// PUT /api/modules/phase/[phaseId]/reorder - Reorder modules within a phase (Admin only)
export async function PUT(request: NextRequest, context: RouteContext<PhaseRouteParams>) {
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

    // Validate phase ID
    const phaseIdValidation = objectIdSchema.safeParse(params.phaseId);
    if (!phaseIdValidation.success) {
      return createErrorResponse('Invalid phase ID format', 400);
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    const validation = reorderSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        `Validation error: ${validation.error.errors.map(e => e.message).join(', ')}`,
        400
      );
    }

    const { moduleOrders } = validation.data;

    // Ensure database connection
    await ensureDBConnection();

    // Check if phase exists
    const phase = await Phase.findById(params.phaseId);
    if (!phase) {
      return createErrorResponse(`Phase with ID '${params.phaseId}' not found`, 404);
    }

    // Validate that all module IDs are valid ObjectIds
    const moduleIds = moduleOrders.map(item => item.moduleId);
    for (const moduleId of moduleIds) {
      const moduleIdValidation = objectIdSchema.safeParse(moduleId);
      if (!moduleIdValidation.success) {
        return createErrorResponse(`Invalid module ID format: ${moduleId}`, 400);
      }
    }

    // Validate that all modules exist and belong to this phase
    const modules = await Module.find({
      _id: { $in: moduleIds },
      phaseId: params.phaseId,
      isActive: true
    });

    if (modules.length !== moduleIds.length) {
      return createErrorResponse(
        "Some modules not found or don't belong to this phase",
        400
      );
    }

    // Update module orders
    const updatePromises = moduleOrders.map(({ moduleId, order }) =>
      Module.findOneAndUpdate(
        { _id: moduleId, phaseId: params.phaseId },
        { order },
        { new: true }
      )
    );

    const updatedModules = await Promise.all(updatePromises);

    // Filter out any null results (shouldn't happen but safety check)
    const validUpdatedModules = updatedModules.filter(module => module !== null);

    return createSuccessResponse(
      {
        modules: validUpdatedModules,
        phaseId: params.phaseId,
        totalUpdated: validUpdatedModules.length
      },
      'Module order updated successfully'
    );

  } catch (error) {
    console.error('Reorder modules error:', error);
    
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