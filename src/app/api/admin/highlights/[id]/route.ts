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
    if (body.text !== undefined) data.text = body.text
    if (body.order !== undefined) data.order = body.order
    if (body.active !== undefined) data.active = body.active

    const highlight = await db.aboutHighlight.update({
      where: { id },
      data,
    })

    return NextResponse.json(highlight, { status: 200 })
  } catch (error) {
    console.error('Highlight PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.aboutHighlight.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Highlight DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}