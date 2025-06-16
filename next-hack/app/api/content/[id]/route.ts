import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { contentUpdateSchema, objectIdSchema } from '@/lib/validators/content';
import { RouteContext, RouteParams } from '@/types/route-params';

// GET /api/content/[id] - Get specific content
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
      return createErrorResponse('Invalid content ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeModule = searchParams.get('includeModule') === 'true';

    // Find content
    let contentQuery = Content.findOne({ _id: params.id, isActive: true });
    
    if (includeModule) {
      contentQuery = contentQuery.populate('module');
    }

    const content = await contentQuery;

    if (!content) {
      return createErrorResponse('Content not found', 404);
    }

    return createSuccessResponse(
      { content },
      'Content retrieved successfully'
    );

  } catch (error) {
    console.error('Get content error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// PUT /api/content/[id] - Update specific content (Admin only)
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
      return createErrorResponse('Invalid content ID format', 400);
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = contentUpdateSchema.safeParse(body);
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

    // Update content
    const content = await Content.findOneAndUpdate(
      { _id: params.id, isActive: true },
      validationResult.data,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('module');

    if (!content) {
      return createErrorResponse('Content not found', 404);
    }

    return createSuccessResponse(
      { content },
      'Content updated successfully'
    );

  } catch (error) {
    console.error('Update content error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('unique')) {
        return createErrorResponse('Content with this order already exists in this module', 409);
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

// DELETE /api/content/[id] - Soft delete specific content (Admin only)
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
      return createErrorResponse('Invalid content ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Check for permanent deletion query parameter
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    let content;
    if (permanent) {
      // Permanently delete content
      content = await Content.findOneAndDelete({ _id: params.id });
    } else {
      // Soft delete content (set isActive to false)
      content = await Content.findOneAndUpdate(
        { _id: params.id, isActive: true },
        { isActive: false },
        { new: true }
      );
    }

    if (!content) {
      return createErrorResponse('Content not found', 404);
    }

    return createSuccessResponse(
      null,
      permanent ? 'Content permanently deleted successfully' : 'Content deleted successfully'
    );

  } catch (error) {
    console.error('Delete content error:', error);
    
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