import { NextRequest, NextResponse } from 'next/server';
import { generateHexagram, getHexagramName } from '@/lib/iching/hexagram';
import { generateConsultationInterpretation } from '@/lib/openai/consultation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    // Generate a hexagram
    const generatedHexagram = generateHexagram();
    const hexagramName = getHexagramName(generatedHexagram.number);

    const hexagram = {
      number: generatedHexagram.number,
      name: hexagramName,
      chineseName: '乾', // Default Chinese name for testing
      lines: generatedHexagram.lines,
      changingLines: generatedHexagram.changingLines,
    };

    // Get AI interpretation
    const interpretation = await generateConsultationInterpretation({
      question,
      hexagram,
    });

    return NextResponse.json({
      success: true,
      hexagram,
      interpretation,
    });
  } catch (error) {
    console.error('AI test error:', error);
    return NextResponse.json(
      {
        error: `AI test failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
      { status: 500 }
    );
  }
}
