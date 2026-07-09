import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const offices = await db.office.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(offices, { status: 200 })
  } catch (error) {
    console.error('Offices GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { city, address, type, order, active } = body

    if (!city || !address || !type) {
      return NextResponse.json({ error: 'city, address, and type are required' }, { status: 400 })
    }

    const office = await db.office.create({
      data: {
        city,
        address,
        type,
        order: order ?? 0,
        active: active ?? true,
      },
    })

    return NextResponse.json(office, { status: 201 })
  } catch (error) {
    console.error('Offices POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}