import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Module from '@/lib/models/Module';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';

// GET /api/modules/with-phases - Get all modules with phase information
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get modules with phases using the static method
    const modules = await Module.getAllWithPhases();

    return createSuccessResponse(
      { modules },
      'Modules with phases retrieved successfully'
    );

  } catch (error) {
    console.error('Get modules with phases error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}