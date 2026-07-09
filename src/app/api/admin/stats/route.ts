import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const stats = await db.stat.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    console.error('Stats GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { value, suffix, label, description, iconName, order, active } = body

    if (label === undefined || value === undefined) {
      return NextResponse.json({ error: 'label and value are required' }, { status: 400 })
    }

    const stat = await db.stat.create({
      data: {
        value: Number(value),
        suffix: suffix ?? '+',
        label,
        description: description ?? '',
        iconName: iconName ?? '',
        order: order ?? 0,
        active: active ?? true,
      },
    })

    return NextResponse.json(stat, { status: 201 })
  } catch (error) {
    console.error('Stats POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}