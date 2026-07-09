import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const item = await db.service.update({ where: { id }, data: body });
  return NextResponse.json(item);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}