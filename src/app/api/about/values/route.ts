import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - Iegūt visas vērtības
export async function GET() {
  try {
    const values = await prisma.aboutValue.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
    });
    return NextResponse.json(values);
  } catch (error) {
    console.error('Error fetching values:', error);
    return NextResponse.json({ error: 'Failed to fetch values' }, { status: 500 });
  }
}

// POST - Izveidot jaunu vērtību
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validācija
    if (!data.text || data.text.trim() === '') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const value = await prisma.aboutValue.create({
      data: {
        text: data.text.trim(),
        order: data.order || 0,
        isActive: data.isActive !== false
      }
    });
    
    return NextResponse.json(value, { status: 201 });
  } catch (error) {
    console.error('Error creating value:', error);
    return NextResponse.json({ error: 'Failed to create value' }, { status: 500 });
  }
}
