import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  const events = await prisma.calendarEvent.findMany({
    orderBy: { date: 'asc' },
  })
  return NextResponse.json(events)
}

export async function POST(req: Request) {
  const data = await req.json();

  const event = await prisma.calendarEvent.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      date: new Date(data.date),
    },
  });

  return NextResponse.json(event);
}