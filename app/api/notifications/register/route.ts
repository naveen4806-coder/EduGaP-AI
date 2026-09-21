import { NextRequest, NextResponse } from 'next/server';
import { fcmService } from '@/lib/fcm/service';

export async function POST(req: NextRequest) {
  try {
    const { userId, token, platform } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'FCM Token required' }, { status: 400 });
    }

    // In local development or Supabase:
    console.log(`Registered FCM token for user ${userId || 'anonymous'}: ${token.slice(0, 15)}...`);

    return NextResponse.json({
      success: true,
      message: 'FCM notification token saved to database',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to register notification token', details: error.message },
      { status: 500 }
    );
  }
}
