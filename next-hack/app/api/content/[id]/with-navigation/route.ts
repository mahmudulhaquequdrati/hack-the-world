import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/content/[id]/with-navigation - Get content with navigation
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
      return createErrorResponse('Invalid content ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Find content
    const content = await Content.findOne({ _id: params.id, isActive: true }).populate('module');

    if (!content) {
      return createErrorResponse('Content not found', 404);
    }

    // Get navigation using the instance method
    const navigation = await content.getNavigation();

    return createSuccessResponse(
      { 
        content,
        navigation: {
          previous: navigation.previous ? {
            id: navigation.previous._id,
            title: navigation.previous.title,
            type: navigation.previous.type,
            order: navigation.previous.order
          } : null,
          next: navigation.next ? {
            id: navigation.next._id,
            title: navigation.next.title,
            type: navigation.next.type,
            order: navigation.next.order
          } : null
        }
      },
      'Content with navigation retrieved successfully'
    );

  } catch (error) {
    console.error('Get content with navigation error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}