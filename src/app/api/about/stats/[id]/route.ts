import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

// GET - Iegūt konkrētu statistiku
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const statId = parseInt(id);

    if (isNaN(statId)) {
      return NextResponse.json(
        { error: 'Invalid stat ID' },
        { status: 400 }
      );
    }

    const stat = await prisma.aboutStat.findUnique({
      where: { id: statId }
    });

    if (!stat) {
      return NextResponse.json(
        { error: 'Stat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(stat);
  } catch (error) {
    console.error('Error fetching stat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stat' },
      { status: 500 }
    );
  }
}

// PUT - Atjaunināt statistiku
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const statId = parseInt(id);
    const data = await request.json();

    if (isNaN(statId)) {
      return NextResponse.json(
        { error: 'Invalid stat ID' },
        { status: 400 }
      );
    }

    // Validācija
    if (!data.icon || !data.number || !data.label) {
      return NextResponse.json(
        { error: 'Icon, number and label are required' },
        { status: 400 }
      );
    }

    const stat = await prisma.aboutStat.update({
      where: { id: statId },
      data: {
        icon: data.icon,
        number: data.number,
        label: data.label,
        color: data.color || 'from-blue-500 to-blue-600',
        order: data.order || 0,
        isActive: data.isActive !== false
      }
    });
    
    return NextResponse.json(stat);
  } catch (error) {
    console.error('Error updating stat:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Stat not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 });
  }
}

// DELETE - Dzēst statistiku
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const statId = parseInt(id);

    if (isNaN(statId)) {
      return NextResponse.json(
        { error: 'Invalid stat ID' },
        { status: 400 }
      );
    }

    await prisma.aboutStat.delete({
      where: { id: statId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stat:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Stat not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: 'Failed to delete stat' }, { status: 500 });
  }
}
