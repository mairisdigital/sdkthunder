import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - Iegūt partneru iestatījumus
export async function GET() {
  try {
    let settings = await prisma.partnersSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Ja nav iestatījumu, izveidojam default
    if (!settings) {
      settings = await prisma.partnersSettings.create({
        data: {
          title: "Mūsu Partneri",
          subtitle: "Mūsu foršie draugi, atbalstītāji un sadarbības partneri",
          ctaTitle: "Vēlies kļūt par mūsu partneri?",
          ctaSubtitle: "Sazinies ar mums un kopā veidosim nākotni!",
          ctaButtonText: "Sazināties ar mums",
          ctaButtonLink: "/contact",
          isActive: true
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching Partners settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Partners settings' },
      { status: 500 }
    );
  }
}

// POST - Saglabāt partneru iestatījumus
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      ctaTitle,
      ctaSubtitle,
      ctaButtonText,
      ctaButtonLink,
      isActive
    } = body;

    // Validācija
    if (!title || !ctaTitle) {
      return NextResponse.json(
        { error: 'Title and CTA title are required' },
        { status: 400 }
      );
    }

    // Meklējam esošos iestatījumus
    const existingSettings = await prisma.partnersSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    let settings;
    if (existingSettings) {
      // Atjauninām esošos
      settings = await prisma.partnersSettings.update({
        where: { id: existingSettings.id },
        data: {
          title: title || "Mūsu Partneri",
          subtitle: subtitle || "Mūsu foršie draugi, atbalstītāji un sadarbības partneri",
          ctaTitle: ctaTitle || "Vēlies kļūt par mūsu partneri?",
          ctaSubtitle: ctaSubtitle || "Sazinies ar mums un kopā veidosim nākotni!",
          ctaButtonText: ctaButtonText || "Sazināties ar mums",
          ctaButtonLink: ctaButtonLink || "/contact",
          isActive: isActive !== undefined ? isActive : true
        }
      });
    } else {
      // Izveidojam jaunus
      settings = await prisma.partnersSettings.create({
        data: {
          title: title || "Mūsu Partneri",
          subtitle: subtitle || "Mūsu foršie draugi, atbalstītāji un sadarbības partneri",
          ctaTitle: ctaTitle || "Vēlies kļūt par mūsu partneri?",
          ctaSubtitle: ctaSubtitle || "Sazinies ar mums un kopā veidosim nākotni!",
          ctaButtonText: ctaButtonText || "Sazināties ar mums",
          ctaButtonLink: ctaButtonLink || "/contact",
          isActive: isActive !== undefined ? isActive : true
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving Partners settings:', error);
    return NextResponse.json(
      { error: 'Failed to save Partners settings' },
      { status: 500 }
    );
  }
}