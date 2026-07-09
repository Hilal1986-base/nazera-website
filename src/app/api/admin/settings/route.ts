import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const items = await db.siteSetting.findMany();
  const map: Record<string, string> = {};
  items.forEach((s) => { map[s.key] = s.value; });
  return NextResponse.json(map);
}

export async function PUT(request: Request) {
  const body: Record<string, string> = await request.json();
  const operations = Object.entries(body).map(([key, value]) =>
    db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
  );
  await Promise.all(operations);
  return NextResponse.json({ success: true });
}