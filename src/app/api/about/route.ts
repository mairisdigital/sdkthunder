import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET - Iegūt About satura datus
export async function GET() {
  try {
    const [content, values, stats] = await Promise.all([
      prisma.aboutContent.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.aboutValue.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.aboutStat.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      })
    ]);

    return NextResponse.json({
      content: content || {
        title: "Kā radās SDKThunder",
        mainStory: "Mūsu stāsts sākās 2018. gadā...",
        foundedYear: "2018"
      },
      values,
      stats
    });
  } catch (error) {
    console.error('Error fetching about data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    );
  }
}

// PUT - Atjaunināt About saturu
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    // Sagatavojam pilnus datus create operācijai
    const defaultContent = {
      title: "Kā radās SDKThunder",
      mainStory: "Mūsu stāsts sākās 2018. gadā FIBA Women's Basketball World Cup Final, Tenerifes salā, Spānijā...",
      foundedYear: "2018",
      ctaSubtext: "Ja tev ir kaislība basketbolam un vēlies atbalstīt Latvijas sportistus, mēs vienmēr esam atvērti jauniem biedriem.",
      contactButtonText: "Sazināties ar mums",
      learnMoreButtonText: "Uzzināt vairāk",
      isActive: true
    };

    // Apvienojam default datus ar ienākošajiem datiem
    const contentData = {
      ...defaultContent,
      ...data.content,
      id: undefined // Noņemam id no datiem
    };

    const updatedContent = await prisma.aboutContent.upsert({
      where: { 
        id: data.content.id || 0 
      },
      update: contentData,
      create: contentData
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    );
  }
}
    