import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Module from '@/lib/models/Module';
import Phase from '@/lib/models/Phase';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { moduleSchema } from '@/lib/validators/content';

// GET /api/modules - Get all modules
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
    const includePhases = searchParams.get('includePhases') === 'true';
    const phaseId = searchParams.get('phaseId');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = { isActive: true };
    if (phaseId) {
      query = { ...query, phaseId };
    }

    let modulesQuery = Module.find(query).sort({ order: 1 });
    
    if (includePhases) {
      modulesQuery = modulesQuery.populate('phase');
    }

    const modules = await modulesQuery;

    return createSuccessResponse(
      { modules },
      'Modules retrieved successfully'
    );

  } catch (error) {
    console.error('Get modules error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/modules - Create new module (Admin only)
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
    const validationResult = moduleSchema.safeParse(body);
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

    // Verify that the phase exists
    const phaseDoc = await Phase.findOne({ _id: validationResult.data.phaseId, isActive: true });
    if (!phaseDoc) {
      return createErrorResponse('Phase not found', 404);
    }

    // Create new module
    const moduleDoc = new Module(validationResult.data);
    await moduleDoc.save();

    // Populate phase information
    await moduleDoc.populate('phase');

    return createSuccessResponse(
      { module: moduleDoc },
      'Module created successfully',
      201
    );

  } catch (error) {
    console.error('Create module error:', error);
    
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