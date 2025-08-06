// app/api/admin/partners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - iegūt konkrētu partneri
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Nepareizs partnera ID' },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.findUnique({
      where: { id }
    });

    if (!partner) {
      return NextResponse.json(
        { error: 'Partneris nav atrasts' },
        { status: 404 }
      );
    }

    return NextResponse.json(partner);
  } catch (error) {
    console.error('Kļūda iegūstot partneri:', error);
    return NextResponse.json(
      { error: 'Kļūda iegūstot partneri' },
      { status: 500 }
    );
  }
}

// PUT - atjaunināt partneri
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Nepareizs partnera ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, tier, description, logo, website, active, order } = body;

    // Validācija
    if (!name || !tier) {
      return NextResponse.json(
        { error: 'Trūkst obligāto lauku' },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name,
        tier,
        description: description || null,
        logo: logo || null,
        website: website || null,
        active: active !== undefined ? active : true,
        order: order || 0
      }
    });

    return NextResponse.json(partner);
  } catch (error) {
    console.error('Kļūda atjauninot partneri:', error);
    return NextResponse.json(
      { error: 'Kļūda atjauninot partneri' },
      { status: 500 }
    );
  }
}

// DELETE - dzēst partneri
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Nepareizs partnera ID' },
        { status: 400 }
      );
    }

    await prisma.partner.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kļūda dzēšot partneri:', error);
    return NextResponse.json(
      { error: 'Kļūda dzēšot partneri' },
      { status: 500 }
    );
  }
}