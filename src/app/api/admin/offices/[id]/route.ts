import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const data: Record<string, unknown> = {}
    if (body.city !== undefined) data.city = body.city
    if (body.address !== undefined) data.address = body.address
    if (body.type !== undefined) data.type = body.type
    if (body.order !== undefined) data.order = body.order
    if (body.active !== undefined) data.active = body.active

    const office = await db.office.update({
      where: { id },
      data,
    })

    return NextResponse.json(office, { status: 200 })
  } catch (error) {
    console.error('Office PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.office.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Office DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}