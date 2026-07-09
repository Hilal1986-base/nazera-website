import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const links = await db.footerLink.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(links, { status: 200 })
  } catch (error) {
    console.error('FooterLinks GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, label, href, order } = body

    if (!category || !label) {
      return NextResponse.json({ error: 'category and label are required' }, { status: 400 })
    }

    const link = await db.footerLink.create({
      data: {
        category,
        label,
        href: href ?? '#',
        order: order ?? 0,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('FooterLinks POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}