import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Phase from '@/lib/models/Phase';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { phaseUpdateSchema, objectIdSchema } from '@/lib/validators/content';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/phases/[id] - Get specific phase
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Validate ID
    const idValidation = objectIdSchema.safeParse(params.id);
    if (!idValidation.success) {
      return createErrorResponse('Invalid phase ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeModules = searchParams.get('includeModules') === 'true';

    // Find phase
    let phaseQuery = Phase.findOne({ _id: params.id, isActive: true });
    
    if (includeModules) {
      phaseQuery = phaseQuery.populate({
        path: 'modules',
        match: { isActive: true },
        options: { sort: { order: 1 } }
      });
    }

    const phase = await phaseQuery;

    if (!phase) {
      return createErrorResponse('Phase not found', 404);
    }

    return createSuccessResponse(
      { phase },
      'Phase retrieved successfully'
    );

  } catch (error) {
    console.error('Get phase error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// PUT /api/phases/[id] - Update specific phase (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
      return createErrorResponse('Invalid phase ID format', 400);
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = phaseUpdateSchema.safeParse(body);
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

    // Update phase
    const phase = await Phase.findOneAndUpdate(
      { _id: params.id, isActive: true },
      validationResult.data,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!phase) {
      return createErrorResponse('Phase not found', 404);
    }

    return createSuccessResponse(
      { phase },
      'Phase updated successfully'
    );

  } catch (error) {
    console.error('Update phase error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('unique')) {
        return createErrorResponse('A phase with this order or title already exists', 409);
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

// DELETE /api/phases/[id] - Soft delete specific phase (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
      return createErrorResponse('Invalid phase ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Soft delete phase (set isActive to false)
    const phase = await Phase.findOneAndUpdate(
      { _id: params.id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!phase) {
      return createErrorResponse('Phase not found', 404);
    }

    return createSuccessResponse(
      null,
      'Phase deleted successfully'
    );

  } catch (error) {
    console.error('Delete phase error:', error);
    
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