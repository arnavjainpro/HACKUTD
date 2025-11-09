import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const FASTAPI_BACKEND = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const { id, transcript, phone, customerName } = await request.json();

    if (!transcript || !phone) {
      return NextResponse.json(
        { error: 'Missing transcript or phone number' },
        { status: 400 }
      );
    }

    console.log(`📞 Initiating ElevenLabs call to ${customerName || 'customer'} at ${phone}...`);
    
    // STEP 1: Call FastAPI backend to initiate ElevenLabs agent conversation
    const backendResponse = await fetch(`${FASTAPI_BACKEND}/api/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: customerName || 'Customer',
        customer_phone: phone,
        transcript: transcript,
      }),
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      throw new Error(`Backend error: ${error.detail || 'Unknown error'}`);
    }

    const callData = await backendResponse.json();
    console.log(`✅ Call completed - ${callData.conversation.length} conversation turns`);
    
    // Extract the full conversation transcript
    const conversationTranscript = callData.conversation
      .map((turn: any) => `${turn.role.toUpperCase()}: ${turn.message}`)
      .join('\n\n');
    
    const customerDetailedResponse = callData.conversation
      .filter((turn: any) => turn.role === 'user')
      .map((turn: any) => turn.message)
      .join(' ');

    console.log(`🎤 Customer detailed feedback received from ElevenLabs agent`);

    // STEP 2: Send the conversation to Gemini for strategy memo
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const strategyPrompt = `You are a Director of Product Strategy at T-Mobile.

An AI agent just completed a follow-up call with a customer. Here is the full conversation:

${conversationTranscript}

Original complaint context: "${transcript}"

Customer's detailed response during the call:
"${customerDetailedResponse}"

Generate a comprehensive **Product Strategy Memo** with:

1. **Root Cause Problem**: Identify the core UX/product issue from the conversation
2. **Business Impact**: Explain why this matters (customer retention, support costs, etc.)
3. **Recommendations**: Provide 2-3 specific, actionable fixes based on the conversation
4. **User Story**: Write one draft user story for the development team

Format professionally as an internal strategy document.`;

    console.log('🤖 Calling Gemini API for strategy memo...');
    
    const result = await model.generateContent(strategyPrompt);
    const response = await result.response;
    const memo = response.text();

    console.log('✅ Strategy memo generated');

    return NextResponse.json({
      memo,
      customerResponse: customerDetailedResponse,
      conversationTranscript,
      callSuccessful: callData.call_successful,
      callCompleted: true,
      id
    });

  } catch (error: any) {
    console.error('Error in /api/feedback-call:', error);
    return NextResponse.json(
      { error: 'Failed to complete call and generate memo', details: error.message },
      { status: 500 }
    );
  }
}
