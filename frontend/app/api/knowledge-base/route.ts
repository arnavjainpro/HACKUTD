import { NextRequest, NextResponse } from 'next/server';

/**
 * Knowledge Base API
 * 
 * Fetches AI-generated knowledge base from backend based on product transcripts
 */

export async function POST(request: NextRequest) {
  try {
    const { productId, product } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log(`📚 Generating knowledge base for Product ID: ${productId} (${product})`);
    
    // Call backend to generate knowledge base using Gemini
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/generate-knowledge-base/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend knowledge base generation failed:', errorText);
      throw new Error(`Backend returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    console.log(`✅ Knowledge base generated successfully`);
    console.log(`   Product: ${data.product_name}`);
    console.log(`   Transcripts analyzed: ${data.total_transcripts_analyzed}`);
    console.log(`   KB Length: ${data.knowledge_base?.length || 0} characters`);
    
    return NextResponse.json({
      success: true,
      knowledgeBase: data.knowledge_base,
      productName: data.product_name,
      metadata: {
        productId: data.product_id,
        transcriptsAnalyzed: data.total_transcripts_analyzed,
        generatedAt: data.generated_at,
        source: data.metadata.source,
        model: data.metadata.model,
      }
    });

  } catch (error: any) {
    console.error('Error generating knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to generate knowledge base', details: error.message },
      { status: 500 }
    );
  }
}
