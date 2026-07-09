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
    if (body.category !== undefined) data.category = body.category
    if (body.label !== undefined) data.label = body.label
    if (body.href !== undefined) data.href = body.href
    if (body.order !== undefined) data.order = body.order

    const link = await db.footerLink.update({
      where: { id },
      data,
    })

    return NextResponse.json(link, { status: 200 })
  } catch (error) {
    console.error('FooterLink PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.footerLink.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('FooterLink DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}