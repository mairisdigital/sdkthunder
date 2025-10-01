import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const articleId = parseInt(id, 10);

    if (isNaN(articleId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Increment view count
    const updated = await prisma.news.update({
      where: { id: articleId },
      data: {
        views: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ success: true, views: updated.views });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 });
  }
}
