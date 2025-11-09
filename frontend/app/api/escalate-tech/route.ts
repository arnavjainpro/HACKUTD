import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { product, issues } = await request.json();

    if (!issues || issues.length === 0) {
      return NextResponse.json(
        { error: 'No issues provided' },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create the prompt
    const prompt = `You are a T-Mobile Product Manager creating a JIRA ticket for the engineering team.

Product: ${product}

Customer Technical Reports:
${issues.map((issue: string, idx: number) => `${idx + 1}. ${issue}`).join('\n')}

Generate a single, concise JIRA ticket that summarizes:
1. **Summary** (one-line ticket title)
2. **Description** (core technical issue)
3. **Affected Locations** (if mentioned)
4. **Customer Impact** (severity and user experience)
5. **Recommended Priority** (P0/P1/P2)

Format as a ready-to-paste JIRA ticket.`;

    console.log('🤖 Calling Gemini API for tech escalation...');
    
    // Call Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const ticket = response.text();

    console.log('✅ Gemini ticket generated');

    return NextResponse.json({
      ticket,
      product,
      issueCount: issues.length
    });

  } catch (error: any) {
    console.error('Error in /api/escalate-tech:', error);
    return NextResponse.json(
      { error: 'Failed to generate ticket', details: error.message },
      { status: 500 }
    );
  }
}
