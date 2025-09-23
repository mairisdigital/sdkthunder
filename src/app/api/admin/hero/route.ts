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
          countdownStartDate: new Date("2025-08-20T00:00:00Z"), // Sākuma datums
          countdownDateLabel: "Datumi:",
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
      countdownStartDate,
      countdownDateLabel,
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
          subtitle: subtitle !== undefined ? subtitle : null,
          locationText: locationText !== undefined ? locationText : null,
          tagline1: tagline1 !== undefined ? tagline1 : null,
          tagline2: tagline2 !== undefined ? tagline2 : null,
          buttonText: buttonText !== undefined ? buttonText : null,
          buttonLink: buttonLink !== undefined ? buttonLink : null,
          countdownTitle: countdownTitle !== undefined ? countdownTitle : null,
          countdownSubtitle: countdownSubtitle !== undefined ? countdownSubtitle : null,
          countdownDate: countdownDate ? new Date(countdownDate) : existingSettings.countdownDate,
          countdownStartDate: countdownStartDate ? new Date(countdownStartDate) : existingSettings.countdownStartDate,
          countdownDateLabel: countdownDateLabel !== undefined ? countdownDateLabel : existingSettings.countdownDateLabel,
          backgroundOverlay: backgroundOverlay !== undefined ? backgroundOverlay : existingSettings.backgroundOverlay,
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
          subtitle: subtitle !== undefined ? subtitle : null,
          locationText: locationText !== undefined ? locationText : null,
          tagline1: tagline1 !== undefined ? tagline1 : null,
          tagline2: tagline2 !== undefined ? tagline2 : null,
          buttonText: buttonText !== undefined ? buttonText : null,
          buttonLink: buttonLink !== undefined ? buttonLink : null,
          countdownTitle: countdownTitle !== undefined ? countdownTitle : null,
          countdownSubtitle: countdownSubtitle !== undefined ? countdownSubtitle : null,
          countdownDate: countdownDate ? new Date(countdownDate) : null,
          countdownStartDate: countdownStartDate ? new Date(countdownStartDate) : null,
          countdownDateLabel: countdownDateLabel !== undefined ? countdownDateLabel : null,
          backgroundOverlay: backgroundOverlay !== undefined ? backgroundOverlay : null,
          backgroundImage: backgroundImage,
          logoImage: logoImage,
          usePatternBg: usePatternBg !== undefined ? usePatternBg : false
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