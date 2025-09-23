import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Neizdevās ielādēt rakstus.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const created = await prisma.news.create({
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        image: data.image,         // string vai null
        category: data.category,
        tags: data.tags,           // string[]
        author: data.author,
        published: data.published,
        featured: data.featured,
        trending: data.trending,
        readTime: data.readTime,
        // views/comments/likes atļausim pēc noklusējuma 0
        publishedAt: data.published ? new Date(data.publishedAt) : undefined
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Neizdevās izveidot rakstu.' }, { status: 500 });
  }
}