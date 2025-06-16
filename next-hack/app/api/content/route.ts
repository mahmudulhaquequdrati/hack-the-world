import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import Module from '@/lib/models/Module';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { contentSchema } from '@/lib/validators/content';

// GET /api/content - Get all content
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeModule = searchParams.get('includeModule') === 'true';
    const type = searchParams.get('type');
    const moduleId = searchParams.get('moduleId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: Record<string, unknown> = { isActive: true };
    if (type) query.type = type;
    if (moduleId) query.moduleId = moduleId;

    // Build content query
    let contentQuery = Content.find(query)
      .sort({ order: 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    if (includeModule) {
      contentQuery = contentQuery.populate('module');
    }

    const content = await contentQuery;
    const total = await Content.countDocuments(query);

    return createSuccessResponse(
      { 
        content,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      'Content retrieved successfully'
    );

  } catch (error) {
    console.error('Get content error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/content - Create new content (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 15 * 60 * 1000)) { // 10 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Authenticate and require admin role
    const user = await authenticate(request);
    requireAdmin(user);

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validationResult = contentSchema.safeParse(body);
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

    // Verify that the module exists
    const moduleDoc = await Module.findOne({ _id: validationResult.data.moduleId, isActive: true });
    if (!moduleDoc) {
      return createErrorResponse('Module not found', 404);
    }

    // Create new content
    const content = new Content(validationResult.data);
    await content.save();

    // Populate module information
    await content.populate('module');

    return createSuccessResponse(
      { content },
      'Content created successfully',
      201
    );

  } catch (error) {
    console.error('Create content error:', error);
    
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