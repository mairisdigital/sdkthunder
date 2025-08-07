import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

// GET - Iegūt konkrētu vērtību
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const valueId = parseInt(id);

    if (isNaN(valueId)) {
      return NextResponse.json(
        { error: 'Invalid value ID' },
        { status: 400 }
      );
    }

    const value = await prisma.aboutValue.findUnique({
      where: { id: valueId }
    });

    if (!value) {
      return NextResponse.json(
        { error: 'Value not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(value);
  } catch (error) {
    console.error('Error fetching value:', error);
    return NextResponse.json(
      { error: 'Failed to fetch value' },
      { status: 500 }
    );
  }
}

// PUT - Atjaunināt vērtību
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const valueId = parseInt(id);
    const data = await request.json();

    if (isNaN(valueId)) {
      return NextResponse.json(
        { error: 'Invalid value ID' },
        { status: 400 }
      );
    }

    // Validācija
    if (!data.text || data.text.trim() === '') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const value = await prisma.aboutValue.update({
      where: { id: valueId },
      data: {
        text: data.text.trim(),
        order: data.order || 0,
        isActive: data.isActive !== false
      }
    });
    
    return NextResponse.json(value);
  } catch (error) {
    console.error('Error updating value:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Value not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: 'Failed to update value' }, { status: 500 });
  }
}

// DELETE - Dzēst vērtību
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const valueId = parseInt(id);

    if (isNaN(valueId)) {
      return NextResponse.json(
        { error: 'Invalid value ID' },
        { status: 400 }
      );
    }

    await prisma.aboutValue.delete({
      where: { id: valueId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting value:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Value not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: 'Failed to delete value' }, { status: 500 });
  }
}
