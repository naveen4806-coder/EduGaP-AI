import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/service';

export async function POST(req: NextRequest) {
  try {
    const { sourceText, topic, count } = await req.json();
    const questions = await aiService.generateQuestionsFromText(
      sourceText || '',
      topic || 'Grade 10 Mathematics',
      count || 3
    );
    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate questions', details: error.message },
      { status: 500 }
    );
  }
}
