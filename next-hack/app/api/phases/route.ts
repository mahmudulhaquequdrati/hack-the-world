import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Phase from '@/lib/models/Phase';
import { authenticate, requireAdmin, createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { phaseSchema } from '@/lib/validators/content';

// GET /api/phases - Get all phases
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
    const includeModules = searchParams.get('includeModules') === 'true';

    let phases;
    if (includeModules) {
      phases = await Phase.getWithModules();
    } else {
      phases = await Phase.getActive();
    }

    return createSuccessResponse(
      { phases },
      'Phases retrieved successfully'
    );

  } catch (error) {
    console.error('Get phases error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/phases - Create new phase (Admin only)
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
    const validationResult = phaseSchema.safeParse(body);
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

    // Create new phase
    const phase = new Phase(validationResult.data);
    await phase.save();

    return createSuccessResponse(
      { phase },
      'Phase created successfully',
      201
    );

  } catch (error) {
    console.error('Create phase error:', error);
    
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