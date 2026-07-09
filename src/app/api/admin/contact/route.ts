import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const submissions = await db.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(submissions, { status: 200 })
  } catch (error) {
    console.error('Contact GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}