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
          logoImage: undefined, // Sākotnēji nav logo
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
      eventStartDate,
      eventEndDate,
      eventYear,
      eventType,
      eventTeams,
      buttonText,
      buttonLink,
      logoImage,
      backgroundGradient,
      customColorFrom,
      customColorTo,
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
          title: title !== undefined ? title : undefined,
          subtitle: subtitle !== undefined ? subtitle : undefined,
          eventTitle: eventTitle !== undefined ? eventTitle : undefined,
          eventSubtitle: eventSubtitle !== undefined ? eventSubtitle : undefined,
          eventDescription: eventDescription !== undefined ? eventDescription : undefined,
          eventLocation: eventLocation !== undefined ? eventLocation : undefined,
          eventDates: eventDates !== undefined ? eventDates : undefined,
          eventStartDate: eventStartDate ? new Date(eventStartDate) : existingSettings.eventStartDate,
          eventEndDate: eventEndDate ? new Date(eventEndDate) : existingSettings.eventEndDate,
          eventYear: eventYear !== undefined ? eventYear : undefined,
          eventType: eventType !== undefined ? eventType : undefined,
          eventTeams: eventTeams !== undefined ? eventTeams : undefined,
          buttonText: buttonText !== undefined ? buttonText : undefined,
          buttonLink: buttonLink !== undefined ? buttonLink : undefined,
          logoImage: logoImage,
          backgroundGradient: backgroundGradient !== undefined ? backgroundGradient : existingSettings.backgroundGradient,
          customColorFrom: customColorFrom !== undefined ? customColorFrom : existingSettings.customColorFrom,
          customColorTo: customColorTo !== undefined ? customColorTo : existingSettings.customColorTo,
          showAdditionalText: showAdditionalText !== undefined ? showAdditionalText : existingSettings.showAdditionalText,
          additionalText: additionalText !== undefined ? additionalText : undefined,
          additionalButtonText: additionalButtonText !== undefined ? additionalButtonText : undefined,
          additionalButtonLink: additionalButtonLink !== undefined ? additionalButtonLink : undefined
        }
      });
    } else {
      // Izveidojam jaunus
      settings = await prisma.eventsSettings.create({
        data: {
          title: title !== undefined ? title : undefined,
          subtitle: subtitle !== undefined ? subtitle : undefined,
          eventTitle: eventTitle !== undefined ? eventTitle : undefined,
          eventSubtitle: eventSubtitle !== undefined ? eventSubtitle : undefined,
          eventDescription: eventDescription !== undefined ? eventDescription : undefined,
          eventLocation: eventLocation !== undefined ? eventLocation : undefined,
          eventDates: eventDates !== undefined ? eventDates : undefined,
          eventStartDate: eventStartDate ? new Date(eventStartDate) : undefined,
          eventEndDate: eventEndDate ? new Date(eventEndDate) : undefined,
          eventYear: eventYear !== undefined ? eventYear : undefined,
          eventType: eventType !== undefined ? eventType : undefined,
          eventTeams: eventTeams !== undefined ? eventTeams : undefined,
          buttonText: buttonText !== undefined ? buttonText : undefined,
          buttonLink: buttonLink !== undefined ? buttonLink : undefined,
          logoImage: logoImage,
          backgroundGradient: backgroundGradient !== undefined ? backgroundGradient : undefined,
          customColorFrom: customColorFrom || undefined,
          customColorTo: customColorTo || undefined,
          showAdditionalText: showAdditionalText !== undefined ? showAdditionalText : false,
          additionalText: additionalText !== undefined ? additionalText : undefined,
          additionalButtonText: additionalButtonText !== undefined ? additionalButtonText : undefined,
          additionalButtonLink: additionalButtonLink !== undefined ? additionalButtonLink : undefined
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