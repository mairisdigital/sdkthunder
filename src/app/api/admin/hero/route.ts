// src/app/api/admin/hero/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - Iegūt HeroSection iestatījumus
export async function GET() {
  try {
    let settings = await prisma.heroSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Ja nav iestatījumu, izveidojam default
    if (!settings) {
      settings = await prisma.heroSettings.create({
        data: {
          title: "SDKThunder",
          subtitle: "SPORTA DRAUGU KLUBS",
          locationText: "Nākamā pietura - Xiaomi Arēna, Rīga, Latvija.",
          tagline1: "Mēs Ticam !",
          tagline2: "Jūs Varat !",
          buttonText: "KALENDĀRS",
          buttonLink: "/calendar",
          countdownTitle: "FIBA EuroBasket",
          countdownSubtitle: "2025",
          countdownDate: new Date("2025-08-27T00:00:00Z"), // Piemēra datums
          backgroundOverlay: "#7c2d12",
          backgroundImage: null,
          logoImage: null,
          usePatternBg: true
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching Hero settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Hero settings' },
      { status: 500 }
    );
  }
}

// POST - Saglabāt HeroSection iestatījumus
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      subtitle, 
      locationText, 
      tagline1, 
      tagline2, 
      buttonText, 
      buttonLink, 
      countdownTitle, 
      countdownSubtitle, 
      countdownDate,
      backgroundOverlay,
      backgroundImage,
      logoImage,
      usePatternBg
    } = body;

    // Validācija
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Meklējam esošos iestatījumus
    const existingSettings = await prisma.heroSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    let settings;
    if (existingSettings) {
      // Atjauninām esošos
      settings = await prisma.heroSettings.update({
        where: { id: existingSettings.id },
        data: {
          title,
          subtitle: subtitle || "SPORTA DRAUGU KLUBS",
          locationText: locationText || "Nākamā pietura - Xiaomi Arēna, Rīga, Latvija.",
          tagline1: tagline1 !== undefined ? tagline1 : "Mēs Ticam !",
          tagline2: tagline2 !== undefined ? tagline2 : "Jūs Varat !",
          buttonText: buttonText || "KALENDĀRS",
          buttonLink: buttonLink || "/calendar",
          countdownTitle: countdownTitle || "FIBA EuroBasket",
          countdownSubtitle: countdownSubtitle || "2025",
          countdownDate: countdownDate ? new Date(countdownDate) : existingSettings.countdownDate,
          backgroundOverlay: backgroundOverlay || "#7c2d12",
          backgroundImage: backgroundImage !== undefined ? backgroundImage : existingSettings.backgroundImage,
          logoImage: logoImage !== undefined ? logoImage : existingSettings.logoImage,
          usePatternBg: usePatternBg !== undefined ? usePatternBg : existingSettings.usePatternBg
        }
      });
    } else {
      // Izveidojam jaunus
      settings = await prisma.heroSettings.create({
        data: {
          title,
          subtitle: subtitle || "SPORTA DRAUGU KLUBS",
          locationText: locationText || "Nākamā pietura - Xiaomi Arēna, Rīga, Latvija.",
          tagline1: tagline1 !== undefined ? tagline1 : "Mēs Ticam !",
          tagline2: tagline2 !== undefined ? tagline2 : "Jūs Varat !",
          buttonText: buttonText || "KALENDĀRS",
          buttonLink: buttonLink || "/calendar",
          countdownTitle: countdownTitle || "FIBA EuroBasket",
          countdownSubtitle: countdownSubtitle || "2025",
          countdownDate: countdownDate ? new Date(countdownDate) : new Date("2025-08-27T00:00:00Z"),
          backgroundOverlay: backgroundOverlay || "#7c2d12",
          backgroundImage: backgroundImage,
          logoImage: logoImage,
          usePatternBg: usePatternBg !== undefined ? usePatternBg : true
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving Hero settings:', error);
    return NextResponse.json(
      { error: 'Failed to save Hero settings' },
      { status: 500 }
    );
  }
}