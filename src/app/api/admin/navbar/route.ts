import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - Iegūt Navbar iestatījumus
export async function GET() {
  try {
    // Iegūstam navbar iestatījumus
    let settings = await prisma.navbarSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Iegūstam menu items
    const menuItems = await prisma.navbarMenuItem.findMany({
      orderBy: { order: 'asc' }
    });

    // Ja nav iestatījumu, izveidojam default
    if (!settings) {
      settings = await prisma.navbarSettings.create({
        data: {
          logoText: 'SDK',
          logoSubtext: 'THUNDER'
        }
      });
    }

    // Ja nav menu items, izveidojam default
    if (menuItems.length === 0) {
      const defaultMenuItems = [
        { name: 'SĀKUMS', href: '/', order: 1, active: true },
        { name: 'GALERIJA', href: '/gallery', order: 2 },
        { name: 'VIETAS', href: '/locations', order: 3 },
        { name: 'KALENDĀRS', href: '/calendar', order: 4 },
        { name: 'JAUNUMI', href: '/news', order: 5 },
        { name: 'PAR MUMS', href: '/about', order: 6 },
        { name: 'KONTAKTI', href: '/contacts', order: 7 },
      ];

      await prisma.navbarMenuItem.createMany({
        data: defaultMenuItems
      });

      // Iegūstam izveidotos items
      const createdItems = await prisma.navbarMenuItem.findMany({
        orderBy: { order: 'asc' }
      });

      return NextResponse.json({
        settings,
        menuItems: createdItems
      });
    }

    return NextResponse.json({
      settings,
      menuItems
    });
  } catch (error) {
    console.error('Error fetching Navbar settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Navbar settings' },
      { status: 500 }
    );
  }
}

// POST - Saglabāt Navbar iestatījumus
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { logoText, logoSubtext, menuItems } = body;

    // Validācija
    if (!logoText || !logoSubtext) {
      return NextResponse.json(
        { error: 'Logo text and subtext are required' },
        { status: 400 }
      );
    }

    // Atjauninām navbar iestatījumus
    const existingSettings = await prisma.navbarSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    let settings;
    if (existingSettings) {
      settings = await prisma.navbarSettings.update({
        where: { id: existingSettings.id },
        data: {
          logoText,
          logoSubtext,
        }
      });
    } else {
      settings = await prisma.navbarSettings.create({
        data: {
          logoText,
          logoSubtext,
        }
      });
    }

    // Atjauninām menu items
    if (menuItems && Array.isArray(menuItems)) {
      // Dzēšam esošos items
      await prisma.navbarMenuItem.deleteMany();

      // Izveidojam jaunos
      await prisma.navbarMenuItem.createMany({
        data: menuItems.map((item: any, index: number) => ({
          name: item.name,
          href: item.href,
          order: index + 1,
          active: item.active || false,
          visible: item.visible !== false,
        }))
      });
    }

    // Iegūstam atjaunintos datus
    const updatedMenuItems = await prisma.navbarMenuItem.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      settings,
      menuItems: updatedMenuItems
    });
  } catch (error) {
    console.error('Error saving Navbar settings:', error);
    return NextResponse.json(
      { error: 'Failed to save Navbar settings' },
      { status: 500 }
    );
  }
}