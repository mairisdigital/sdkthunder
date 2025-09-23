import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - Iegūt TopBar iestatījumus
export async function GET() {
  try {
    let settings = await prisma.topBarSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Ja nav iestatījumu, izveidojam default
    if (!settings) {
      settings = await prisma.topBarSettings.create({
        data: {
          email: 'info@sdkthunder.com',
          emailLabel: 'E-PASTS:',
          location: 'Rīga, Latvija.',
          locationLabel: 'NĀKAMĀ PIETURA:',
          facebook: '#',
          instagram: '#',
          youtube: '#'
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching TopBar settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TopBar settings' },
      { status: 500 }
    );
  }
}

// POST - Saglabāt TopBar iestatījumus
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, emailLabel, location, locationLabel, facebook, instagram, youtube } = body;

    // Bez validācijas - ļaujam tukšus laukus

    // Meklējam esošos iestatījumus
    const existingSettings = await prisma.topBarSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    let settings;
    if (existingSettings) {
      // Atjauninām esošos
      settings = await prisma.topBarSettings.update({
        where: { id: existingSettings.id },
        data: {
          email: email !== undefined ? email : null,
          emailLabel: emailLabel !== undefined ? emailLabel : null,
          location: location !== undefined ? location : null,
          locationLabel: locationLabel !== undefined ? locationLabel : null,
          facebook: facebook || null,
          instagram: instagram || null,
          youtube: youtube || null,
        }
      });
    } else {
      // Izveidojam jaunus
      settings = await prisma.topBarSettings.create({
        data: {
          email: email !== undefined ? email : null,
          emailLabel: emailLabel !== undefined ? emailLabel : null,
          location: location !== undefined ? location : null,
          locationLabel: locationLabel !== undefined ? locationLabel : null,
          facebook: facebook || null,
          instagram: instagram || null,
          youtube: youtube || null,
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving TopBar settings:', error);
    return NextResponse.json(
      { error: 'Failed to save TopBar settings' },
      { status: 500 }
    );
  }
}