import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const highlights = await db.aboutHighlight.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(highlights, { status: 200 })
  } catch (error) {
    console.error('Highlights GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, order, active } = body

    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const highlight = await db.aboutHighlight.create({
      data: {
        text,
        order: order ?? 0,
        active: active ?? true,
      },
    })

    return NextResponse.json(highlight, { status: 201 })
  } catch (error) {
    console.error('Highlights POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}