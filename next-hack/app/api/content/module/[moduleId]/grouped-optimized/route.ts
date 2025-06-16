import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';

interface RouteParams {
  params: {
    moduleId: string;
  };
}

// GET /api/content/module/[moduleId]/grouped-optimized - Get optimized grouped content
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // Get optimized grouped content using the static method
    const optimizedContent = await Content.getByModuleGroupedOptimized(params.moduleId);

    // Transform the result to a more convenient format
    const contentBySection = optimizedContent.reduce((acc: any, section: any) => {
      acc[section._id || 'default'] = section.content;
      return acc;
    }, {});

    return createSuccessResponse(
      { 
        contentBySection,
        optimizedContent 
      },
      'Optimized grouped content for module retrieved successfully'
    );

  } catch (error) {
    console.error('Get optimized grouped content by module error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}