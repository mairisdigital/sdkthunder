import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

// GET - Iegūt konkrētu galerijas ierakstu
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = parseInt(id);
    
    const item = await prisma.galleryItem.findUnique({
      where: { id: itemId }
    });
    
    if (!item) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery item' },
      { status: 500 }
    );
  }
}

// PUT - Atjaunināt galerijas ierakstu
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = parseInt(id);
    const body = await request.json();
    
    const item = await prisma.galleryItem.update({
      where: { id: itemId },
      data: {
        title: body.title,
        type: body.type,
        url: body.url,
        thumbnail: body.thumbnail,
        category: body.category,
        tags: body.tags,
        description: body.description,
        author: body.author,
        featured: body.featured,
        order: body.order,
        duration: body.duration,
        views: body.views,
        likes: body.likes
      }
    });
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

// DELETE - Dzēst galerijas ierakstu
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = parseInt(id);
    
    await prisma.galleryItem.delete({
      where: { id: itemId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}