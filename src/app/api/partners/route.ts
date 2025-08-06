import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - iegūt aktīvos partnerus publiskajai lapai
export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      where: {
        active: true
      },
      orderBy: [
        { order: 'asc' },
        { tier: 'asc' }, // GOLD, SILVER, BRONZE, PARTNER
        { createdAt: 'desc' }
      ]
    });
    
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Kļūda iegūstot partnerus:', error);
    return NextResponse.json(
      { error: 'Kļūda iegūstot partnerus' },
      { status: 500 }
    );
  }
}