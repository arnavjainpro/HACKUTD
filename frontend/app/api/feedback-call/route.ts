import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { id, transcript, phone } = await request.json();

    if (!transcript || !phone) {
      return NextResponse.json(
        { error: 'Missing transcript or phone number' },
        { status: 400 }
      );
    }

    console.log(`📞 Simulating ElevenLabs call to ${phone}...`);
    
    // STEP 1: Simulate ElevenLabs AI phone call
    // In production, this would call ElevenLabs API to make a real phone call
    // For demo purposes, we'll simulate the customer's detailed response
    
    const simulatedResponses: { [key: string]: string } = {
      'setup instructions': 'Yeah, I was on the main page and couldn\'t find the "Pay Bill" button at all. I had to dig through three menus just to pay my bill. Super frustrating!',
      'bill': 'I got charged $20 extra this month with no warning. When I called support, they said it was a "rate adjustment" but I was never notified via email or text.',
      'customer service': 'I was on hold for 45 minutes and when someone finally picked up, they transferred me to another department where I waited another 30 minutes.',
      'default': 'The app experience was really confusing. I spent 20 minutes trying to find basic features that should be obvious.'
    };

    // Determine which simulated response to use based on transcript content
    let customerDetailedResponse = simulatedResponses.default;
    for (const [key, response] of Object.entries(simulatedResponses)) {
      if (transcript.toLowerCase().includes(key)) {
        customerDetailedResponse = response;
        break;
      }
    }

    console.log(`🎤 Simulated customer response received`);

    // STEP 2: Send the NEW detailed feedback to Gemini for strategy memo
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const strategyPrompt = `You are a Director of Product Strategy at T-Mobile.

A customer was contacted for follow-up feedback. Here is their detailed response:

"${customerDetailedResponse}"

Original complaint context: "${transcript}"

Generate a comprehensive **Product Strategy Memo** with:

1. **Root Cause Problem**: Identify the core UX/product issue
2. **Business Impact**: Explain why this matters (customer retention, support costs, etc.)
3. **Recommendations**: Provide 2-3 specific, actionable fixes
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
