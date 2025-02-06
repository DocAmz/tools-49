import { processColor } from '@/features/color-converter/core/processColor';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {

  console.log('Inside POST function');

  try {
    const { inputProfile, outputProfile, rgb } = await request.json();

      // Validate the request body
      if (!inputProfile) {
        return NextResponse.json(
          { error: 'Invalid request body: Missing inputProfile' },
          { status: 400 }
        );
      }
      if (!outputProfile) {
        return NextResponse.json(
          { error: 'Invalid request body: Missing outputProfile' },
          { status: 400 }
        );
      }
      if (!rgb) {
        return NextResponse.json(
          { error: 'Invalid request body: Missing rgb' },
          { status: 400 }
        );
      }
      if (!rgb.r) {
        return NextResponse.json(
          { error: 'Invalid request body: Missing rgb.r' },
          { status: 400 }
        );
      }
      if (!rgb.g) {
        return NextResponse.json(
          { error: 'Invalid request body: Missing rgb.g' },
          { status: 400 }
        );
      }
      if (!rgb.b) {
        return NextResponse.json(
          { error: 'Invalid request body: Missing rgb.b' },
          { status: 400 }
        );
      }
    console.log('Before processColor function');
    const processedColors = await processColor({ inputProfile, outputProfile, rgb });
    console.log('After processColor function');
    return NextResponse.json({
      original: rgb,
      processed: processedColors,
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Conversion failed',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}