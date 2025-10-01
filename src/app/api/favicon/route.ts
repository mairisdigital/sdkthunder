import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.navbarSettings.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { faviconUrl: true }
    });

    return NextResponse.json({
      faviconUrl: settings?.faviconUrl || null
    });
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return NextResponse.json(
      { faviconUrl: null },
      { status: 500 }
    );
  }
}
