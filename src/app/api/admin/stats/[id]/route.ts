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
    if (body.value !== undefined) data.value = Number(body.value)
    if (body.suffix !== undefined) data.suffix = body.suffix
    if (body.label !== undefined) data.label = body.label
    if (body.description !== undefined) data.description = body.description
    if (body.iconName !== undefined) data.iconName = body.iconName
    if (body.order !== undefined) data.order = body.order
    if (body.active !== undefined) data.active = body.active

    const stat = await db.stat.update({
      where: { id },
      data,
    })

    return NextResponse.json(stat, { status: 200 })
  } catch (error) {
    console.error('Stat PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.stat.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Stat DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}