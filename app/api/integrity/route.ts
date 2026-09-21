import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store/mock-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = db.recordIntegrityEvent({
      assessmentId: body.assessmentId,
      attemptId: body.attemptId,
      studentId: body.studentId,
      studentName: body.studentName,
      eventType: body.eventType,
      eventTime: body.eventTime || new Date().toISOString(),
      details: body.details || {},
      severity: body.severity || 'warning',
    });
    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to record integrity event', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ events: db.integrityEvents });
}
