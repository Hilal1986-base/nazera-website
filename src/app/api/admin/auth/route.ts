import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const setting = await db.siteSetting.findUnique({
      where: { key: 'admin_password' },
    })

    if (!setting) {
      return NextResponse.json({ success: false }, { status: 200 })
    }

    const match = password === setting.value
    return NextResponse.json({ success: match }, { status: 200 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}