import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/service';

export async function POST(req: NextRequest) {
  try {
    const { questionText, studentAnswer, maxMarks, rubricPoints } = await req.json();
    const evaluation = await aiService.evaluateDescriptiveAnswer(
      questionText,
      studentAnswer,
      maxMarks,
      rubricPoints
    );
    return NextResponse.json(evaluation);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to evaluate descriptive answer', details: error.message },
      { status: 500 }
    );
  }
}
