import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET - Iegūt Events sadaļas iestatījumus
export async function GET() {
  try {
    let settings = await prisma.eventsSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Ja nav iestatījumu, izveidojam default
    if (!settings) {
      settings = await prisma.eventsSettings.create({
        data: {
          title: "Tuvākie sporta",
          subtitle: "pasākumi",
          eventTitle: "FIBA EuroBasket 2025",
          eventSubtitle: "",
          eventDescription: "2025. gada Eiropas vīriešu basketbola čempionāts.",
          eventLocation: "Rīga, Latvija",
          eventDates: "27/08 - 14/09",
          eventYear: "2025",
          eventType: "Čempionāts",
          eventTeams: "24 komandas",
          buttonText: "PILNS KALENDĀRS",
          buttonLink: "/calendar",
          logoImage: null, // Sākotnēji nav logo
          backgroundGradient: "from-red-600 to-red-700",
          showAdditionalText: true,
          additionalText: "Vairāk sporta pasākumu un spēļu skatīties kalendārā",
          additionalButtonText: "Skatīt visus pasākumus",
          additionalButtonLink: "/calendar"
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching Events settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Events settings' },
      { status: 500 }
    );
  }
}

// POST - Saglabāt Events sadaļas iestatījumus
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title,
      subtitle,
      eventTitle,
      eventSubtitle,
      eventDescription,
      eventLocation,
      eventDates,
      eventYear,
      eventType,
      eventTeams,
      buttonText,
      buttonLink,
      logoImage,
      backgroundGradient,
      showAdditionalText,
      additionalText,
      additionalButtonText,
      additionalButtonLink
    } = body;

    // Validācija
    if (!title || !eventTitle) {
      return NextResponse.json(
        { error: 'Title and event title are required' },
        { status: 400 }
      );
    }

    // Meklējam esošos iestatījumus
    const existingSettings = await prisma.eventsSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    let settings;
    if (existingSettings) {
      // Atjauninām esošos
      settings = await prisma.eventsSettings.update({
        where: { id: existingSettings.id },
        data: {
          title,
          subtitle: subtitle || "pasākumi",
          eventTitle,
          eventSubtitle: eventSubtitle || "",
          eventDescription: eventDescription || "",
          eventLocation: eventLocation || "Rīga, Latvija",
          eventDates: eventDates || "27/08 - 14/09",
          eventYear: eventYear || "2025",
          eventType: eventType || "Čempionāts",
          eventTeams: eventTeams || "24 komandas",
          buttonText: buttonText || "PILNS KALENDĀRS",
          buttonLink: buttonLink || "/calendar",
          logoImage: logoImage,
          backgroundGradient: backgroundGradient || "from-red-600 to-red-700",
          showAdditionalText: showAdditionalText !== undefined ? showAdditionalText : true,
          additionalText: additionalText || "Vairāk sporta pasākumu un spēļu skatīties kalendārā",
          additionalButtonText: additionalButtonText || "Skatīt visus pasākumus",
          additionalButtonLink: additionalButtonLink || "/calendar"
        }
      });
    } else {
      // Izveidojam jaunus
      settings = await prisma.eventsSettings.create({
        data: {
          title,
          subtitle: subtitle || "pasākumi",
          eventTitle,
          eventSubtitle: eventSubtitle || "",
          eventDescription: eventDescription || "",
          eventLocation: eventLocation || "Rīga, Latvija",
          eventDates: eventDates || "27/08 - 14/09",
          eventYear: eventYear || "2025",
          eventType: eventType || "Čempionāts",
          eventTeams: eventTeams || "24 komandas",
          buttonText: buttonText || "PILNS KALENDĀRS",
          buttonLink: buttonLink || "/calendar",
          logoImage: logoImage,
          backgroundGradient: backgroundGradient || "from-red-600 to-red-700",
          showAdditionalText: showAdditionalText !== undefined ? showAdditionalText : true,
          additionalText: additionalText || "Vairāk sporta pasākumu un spēļu skatīties kalendārā",
          additionalButtonText: additionalButtonText || "Skatīt visus pasākumus",
          additionalButtonLink: additionalButtonLink || "/calendar"
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving Events settings:', error);
    return NextResponse.json(
      { error: 'Failed to save Events settings' },
      { status: 500 }
    );
  }
}