import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// Type definition for params - this is the correct approach in Next.js 13+ app directory
interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    // Await the params promise to get the actual parameters
    const { id } = await params;
    const data = await req.json();

    const updated = await prisma.calendarEvent.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        date: new Date(data.date),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    // Await the params promise to get the actual parameters
    const { id } = await params;

    const deleted = await prisma.calendarEvent.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}