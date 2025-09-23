import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - Iegūt partneru iestatījumus
export async function GET() {
  try {
    let settings = await prisma.partnersSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Ja nav iestatījumu, izveidojam tukšus
    if (!settings) {
      settings = await prisma.partnersSettings.create({
        data: {
          title: undefined,
          subtitle: undefined,
          ctaTitle: undefined,
          ctaSubtitle: undefined,
          ctaButtonText: undefined,
          ctaButtonLink: undefined,
          isActive: false
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

    // Bez validācijas - ļaujam tukšus laukus

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
          title: title !== undefined ? title : undefined,
          subtitle: subtitle !== undefined ? subtitle : undefined,
          ctaTitle: ctaTitle !== undefined ? ctaTitle : undefined,
          ctaSubtitle: ctaSubtitle !== undefined ? ctaSubtitle : undefined,
          ctaButtonText: ctaButtonText !== undefined ? ctaButtonText : undefined,
          ctaButtonLink: ctaButtonLink !== undefined ? ctaButtonLink : undefined,
          isActive: isActive !== undefined ? isActive : existingSettings.isActive
        }
      });
    } else {
      // Izveidojam jaunus
      settings = await prisma.partnersSettings.create({
        data: {
          title: title !== undefined ? title : undefined,
          subtitle: subtitle !== undefined ? subtitle : undefined,
          ctaTitle: ctaTitle !== undefined ? ctaTitle : undefined,
          ctaSubtitle: ctaSubtitle !== undefined ? ctaSubtitle : undefined,
          ctaButtonText: ctaButtonText !== undefined ? ctaButtonText : undefined,
          ctaButtonLink: ctaButtonLink !== undefined ? ctaButtonLink : undefined,
          isActive: isActive !== undefined ? isActive : false
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