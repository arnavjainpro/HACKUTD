import { NextRequest, NextResponse } from 'next/server';

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_65403f8c8d83b6be7fe6ce847d41fe50c6856111adc67bab';
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID || 'agent_0801k9jzy5jwfy08aksezh9dv4tj';

/**
 * Create Knowledge Base Document in ElevenLabs
 * This uses the proper ElevenLabs Knowledge Base API
 */
export async function POST(request: NextRequest) {
  try {
    const { customerId, product } = await request.json();
    
    console.log('📚 Creating ElevenLabs knowledge base document...');
    
    // STEP 1: Get knowledge base data from our API
    const kbResponse = await fetch(`${request.nextUrl.origin}/api/knowledge-base`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, product }),
    });
    
    if (!kbResponse.ok) {
      throw new Error('Failed to fetch knowledge base');
    }
    
    const { knowledgeBase } = await kbResponse.json();
    
    // STEP 2: Format knowledge base into text for ElevenLabs
    const knowledgeText = `
CUSTOMER SUPPORT CONTEXT

Product Information:
- Name: ${knowledgeBase.productInfo.name}
- Issue: ${knowledgeBase.productInfo.issue}
- Purchase Date: ${knowledgeBase.productInfo.purchaseDate}
- Warranty Status: ${knowledgeBase.productInfo.warrantyStatus}
- Diagnostic Code: ${knowledgeBase.productInfo.diagnosticCode}

Customer History:
- Support Tickets Filed: ${knowledgeBase.customerHistory.supportTickets}
- Store Visits: ${knowledgeBase.customerHistory.storeVisits}
- Previous Solutions Attempted:
${knowledgeBase.customerHistory.previousSolutions.map((s: string) => `  • ${s}`).join('\n')}
- Issue Resolved: ${knowledgeBase.customerHistory.issueResolved ? 'Yes' : 'No'}

Recommended Actions:
${knowledgeBase.recommendedActions.map((action: string, i: number) => `${i + 1}. ${action}`).join('\n')}

Summary:
${knowledgeBase.summary}

Instructions for Agent:
- Reference this specific customer context in your conversation
- Acknowledge their previous attempts and frustration
- Recommend the most appropriate action based on warranty status
- Be empathetic about their multiple support interactions
`.trim();

    console.log('📝 Knowledge base content prepared:', knowledgeText.substring(0, 200) + '...');

    // STEP 3: Update agent with custom prompt (dynamic knowledge base injection)
    // Note: The Knowledge Base Documents API may not be available on all plans
    // Using agent prompt override as a more reliable alternative
    const updateAgentResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${ELEVENLABS_AGENT_ID}`,
      {
        method: 'PATCH',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_config: {
            agent: {
              prompt: {
                prompt: knowledgeText,
              },
            },
          },
        }),
      }
    );

    if (!updateAgentResponse.ok) {
      const errorText = await updateAgentResponse.text();
      console.error('❌ Failed to update agent with knowledge:', errorText);
      throw new Error(`ElevenLabs Agent Update error: ${updateAgentResponse.statusText}`);
    }

    console.log('✅ Agent updated with customer knowledge');
    const agentData = await updateAgentResponse.json();

    return NextResponse.json({
      success: true,
      agentUpdated: true,
      knowledgeBase,
    });

  } catch (error: any) {
    console.error('Error creating knowledge base document:', error);
    return NextResponse.json(
      { error: 'Failed to create knowledge base', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Delete/Reset Agent Prompt
 * Reset agent to default prompt after call
 */
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔄 Resetting agent prompt to default...');

    // Reset agent prompt (you should store the original prompt somewhere)
    // For now, we'll just set a basic prompt
    const resetResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${ELEVENLABS_AGENT_ID}`,
      {
        method: 'PATCH',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_config: {
            agent: {
              prompt: {
                prompt: "You are a helpful T-Mobile customer support agent. Assist customers with their issues professionally and empathetically.",
              },
            },
          },
        }),
      }
    );

    if (!resetResponse.ok) {
      const errorText = await resetResponse.text();
      console.error('❌ Failed to reset agent prompt:', errorText);
    } else {
      console.log('✅ Agent prompt reset to default');
    }

    return NextResponse.json({
      success: true,
      message: 'Agent reset',
    });

  } catch (error: any) {
    console.error('Error resetting agent:', error);
    return NextResponse.json(
      { error: 'Failed to reset agent', details: error.message },
      { status: 500 }
    );
  }
}
