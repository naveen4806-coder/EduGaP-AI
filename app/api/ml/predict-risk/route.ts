import { NextRequest, NextResponse } from 'next/server';
import { predictStudentRisk } from '@/lib/ml/client';
import { StudentFeatureSnapshot } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: StudentFeatureSnapshot = await req.json();
    const result = await predictStudentRisk(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to predict student risk', details: error.message },
      { status: 500 }
    );
  }
}
