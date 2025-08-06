import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idString } = await params;
  const id = parseInt(idString, 10);
  
  const article = await prisma.news.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ error: 'Raksts nav atrasts.' }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString, 10);
    const data = await req.json();
    
    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        image: data.image,
        category: data.category,
        tags: data.tags,
        author: data.author,
        published: data.published,
        featured: data.featured,
        trending: data.trending,
        readTime: data.readTime,
        views: data.views,
        comments: data.comments,
        likes: data.likes,
        publishedAt: data.published ? new Date(data.publishedAt) : null
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Neizdevās atjaunināt rakstu.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString, 10);
    
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Neizdevās dzēst rakstu.' }, { status: 500 });
  }
}
