import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Save to database
    await db.contactSubmission.create({
      data: {
        name: name as string,
        email: email as string,
        company: (company as string) || '',
        message: message as string,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Thank you for your message.' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}