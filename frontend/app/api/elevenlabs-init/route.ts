import { NextResponse } from 'next/server';

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_65403f8c8d83b6be7fe6ce847d41fe50c6856111adc67bab';
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID || 'agent_0801k9jzy5jwfy08aksezh9dv4tj';

export async function POST() {
  try {
    // Get a signed URL from ElevenLabs for the conversation
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      signedUrl: data.signed_url,
      agentId: ELEVENLABS_AGENT_ID,
    });
  } catch (error: any) {
    console.error('Error getting ElevenLabs signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to initialize call', details: error.message },
      { status: 500 }
    );
  }
}
