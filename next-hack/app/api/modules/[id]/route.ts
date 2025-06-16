import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Module from '@/lib/models/Module';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { moduleUpdateSchema, objectIdSchema } from '@/lib/validators/content';
import { RouteContext, RouteParams } from '@/types/route-params';

// GET /api/modules/[id] - Get specific module
export async function GET(request: NextRequest, context: RouteContext<RouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Validate ID
    const idValidation = objectIdSchema.safeParse(params.id);
    if (!idValidation.success) {
      return createErrorResponse('Invalid module ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includePhase = searchParams.get('includePhase') === 'true';

    // Find module
    let moduleQuery = Module.findOne({ _id: params.id, isActive: true });
    
    if (includePhase) {
      moduleQuery = moduleQuery.populate('phase');
    }

    const moduleDoc = await moduleQuery;

    if (!moduleDoc) {
      return createErrorResponse('Module not found', 404);
    }

    return createSuccessResponse(
      { module: moduleDoc },
      'Module retrieved successfully'
    );

  } catch (error) {
    console.error('Get module error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// PUT /api/modules/[id] - Update specific module (Admin only)
export async function PUT(request: NextRequest, context: RouteContext<RouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 15 * 60 * 1000)) { // 10 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate and require admin role
    const user = await authenticate(request);
    requireAdmin(user);

    // Validate ID
    const idValidation = objectIdSchema.safeParse(params.id);
    if (!idValidation.success) {
      return createErrorResponse('Invalid module ID format', 400);
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = moduleUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation failed',
        400,
        validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      );
    }

    // Ensure database connection
    await ensureDBConnection();

    // Update module
    const moduleDoc = await Module.findOneAndUpdate(
      { _id: params.id, isActive: true },
      validationResult.data,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('phase');

    if (!moduleDoc) {
      return createErrorResponse('Module not found', 404);
    }

    return createSuccessResponse(
      { module: moduleDoc },
      'Module updated successfully'
    );

  } catch (error) {
    console.error('Update module error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('unique')) {
        return createErrorResponse('A module with this order already exists in this phase', 409);
      }
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

// DELETE /api/modules/[id] - Soft delete specific module (Admin only)
export async function DELETE(request: NextRequest, context: RouteContext<RouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 15 * 60 * 1000)) { // 10 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate and require admin role
    const user = await authenticate(request);
    requireAdmin(user);

    // Validate ID
    const idValidation = objectIdSchema.safeParse(params.id);
    if (!idValidation.success) {
      return createErrorResponse('Invalid module ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Soft delete module (set isActive to false)
    const moduleDoc = await Module.findOneAndUpdate(
      { _id: params.id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!moduleDoc) {
      return createErrorResponse('Module not found', 404);
    }

    return createSuccessResponse(
      null,
      'Module deleted successfully'
    );

  } catch (error) {
    console.error('Delete module error:', error);
    
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