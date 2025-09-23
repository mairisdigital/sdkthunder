import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - iegūt visus partnerus
export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: [
        { order: 'asc' },
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

// POST - izveidot jaunu partneri
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, tier, description, logo, website, active, order } = body;

    // Validācija
    if (!name || !tier) {
      return NextResponse.json(
        { error: 'Trūkst obligāto lauku' },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        tier,
        description: description !== undefined ? description : null,
        logo: logo !== undefined ? logo : null,
        website: website !== undefined ? website : null,
        active: active !== undefined ? active : true,
        order: order !== undefined ? order : 0
      }
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Kļūda izveidojot partneri:', error);
    return NextResponse.json(
      { error: 'Kļūda izveidojot partneri' },
      { status: 500 }
    );
  }
}