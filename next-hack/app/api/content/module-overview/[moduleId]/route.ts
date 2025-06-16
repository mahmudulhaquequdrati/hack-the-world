import { NextRequest } from 'next/server';
import { ensureDBConnection } from '@/lib/mongodb/connection';
import Content from '@/lib/models/Content';
import { createErrorResponse, createSuccessResponse, getClientIP, rateLimit } from '@/lib/middleware/auth';
import { objectIdSchema } from '@/lib/validators/content';
import { RouteContext, ModuleRouteParams } from '@/types/route-params';

// GET /api/content/module-overview/[moduleId] - Get module overview with sections and content
export async function GET(request: NextRequest, context: RouteContext<ModuleRouteParams>) {
  const params = await context.params;
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return createErrorResponse('Too many requests, please try again later', 429);
    }

    // Validate module ID
    const moduleIdValidation = objectIdSchema.safeParse(params.moduleId);
    if (!moduleIdValidation.success) {
      return createErrorResponse('Invalid module ID format', 400);
    }

    // Ensure database connection
    await ensureDBConnection();

    // Get content for module overview
    const content = await Content.find({ 
      moduleId: params.moduleId, 
      isActive: true 
    })
      .select('title description type section order duration')
      .sort({ section: 1, order: 1, createdAt: 1 })
      .lean();

    // Group content by section
    const groupedContent: Record<string, unknown[]> = {};
    const sections: string[] = [];

    content.forEach((item) => {
      const section = item.section || 'General';
      
      if (!groupedContent[section]) {
        groupedContent[section] = [];
        if (!sections.includes(section)) {
          sections.push(section);
        }
      }
      
      groupedContent[section].push({
        id: item._id,
        title: item.title,
        description: item.description,
        type: item.type,
        order: item.order,
        duration: item.duration
      });
    });

    // Sort sections (General first, then alphabetically)
    sections.sort((a, b) => {
      if (a === 'General') return -1;
      if (b === 'General') return 1;
      return a.localeCompare(b);
    });

    // Calculate statistics
    const stats = {
      totalContent: content.length,
      contentByType: content.reduce((acc: Record<string, number>, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {}),
      totalSections: sections.length,
      averageContentPerSection: sections.length > 0 ? Math.round((content.length / sections.length) * 10) / 10 : 0
    };

    return createSuccessResponse(
      {
        moduleId: params.moduleId,
        sections,
        groupedContent,
        statistics: stats
      },
      'Module overview retrieved successfully'
    );

  } catch (error) {
    console.error('Get module overview error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}