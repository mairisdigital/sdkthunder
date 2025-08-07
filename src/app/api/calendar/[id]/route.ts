import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();

  const updated = await prisma.calendarEvent.update({
    where: { id: Number(params.id) },
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      date: new Date(data.date),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const deleted = await prisma.calendarEvent.delete({
    where: { id: Number(params.id) },
  })
  return NextResponse.json(deleted)
}