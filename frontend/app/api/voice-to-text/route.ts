import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Deepgram API key not configured' },
        { status: 500 }
      );
    }

    const { audio } = await request.json();
    if (!audio) {
      return NextResponse.json(
        { error: 'No audio data provided' },
        { status: 400 }
      );
    }

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(audio, 'base64');
    
    // Make direct API call to Deepgram
    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'audio/wav'
      },
      body: audioBuffer
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to transcribe audio');
    }

    const result = await response.json();
    
    if (!result.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
      return NextResponse.json(
        { error: 'No transcription results' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      text: result.results.channels[0].alternatives[0].transcript
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 