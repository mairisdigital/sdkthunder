import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { MediaType } from '@prisma/client';

// GET - Iegūt visus galerijas ierakstus
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    
    const where: {
      category?: string;
      type?: MediaType;
    } = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (type) {
      where.type = type as MediaType;
    }
    
    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

// POST - Izveidot jaunu galerijas ierakstu
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const item = await prisma.galleryItem.create({
      data: {
        title: body.title,
        type: body.type || 'PHOTO',
        url: body.url,
        thumbnail: body.thumbnail,
        category: body.category || 'all',
        tags: body.tags || [],
        description: body.description,
        author: body.author || 'SDKThunder',
        featured: body.featured || false,
        order: body.order || 0,
        duration: body.duration
      }
    });
    
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}