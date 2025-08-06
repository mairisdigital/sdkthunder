import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    const articles = await prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' }
    })
    return NextResponse.json(articles)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Neizdevās ielādēt jaunumus.' }, { status: 500 })
  }
}