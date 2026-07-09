import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const submission = await db.contactSubmission.findUnique({ where: { id } })
    if (!submission) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updated = await db.contactSubmission.update({
      where: { id },
      data: { read: !submission.read },
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('Contact PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.contactSubmission.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Contact DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}