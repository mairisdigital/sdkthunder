import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - Iegūt visas statistikas
export async function GET() {
  try {
    const stats = await prisma.aboutStat.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
    });
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

// POST - Izveidot jaunu statistiku
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validācija
    if (!data.icon || !data.number || !data.label) {
      return NextResponse.json(
        { error: 'Icon, number and label are required' },
        { status: 400 }
      );
    }

    const stat = await prisma.aboutStat.create({
      data: {
        icon: data.icon,
        number: data.number,
        label: data.label,
        color: data.color || 'from-blue-500 to-blue-600',
        order: data.order || 0,
        isActive: data.isActive !== false
      }
    });
    
    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    console.error('Error creating stat:', error);
    return NextResponse.json({ error: 'Failed to create stat' }, { status: 500 });
  }
}
