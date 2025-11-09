import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { product, feedback } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          promotion: `DEMO MODE - Gemini API Key Required\n\n🎁 LOYALTY PROMOTION CAMPAIGN FOR ${product}\n\nBased on customer feedback analysis:\n\n1. EXCLUSIVE OFFER: 20% off next 3 months for loyal customers\n2. UPGRADE INCENTIVE: Free premium features for 60 days\n3. REFERRAL BONUS: $50 credit for each friend referred\n4. EARLY ACCESS: Be first to try new features\n5. CUSTOMER APPRECIATION: Waive activation fees\n\nTarget Audience: Customers with 12+ months tenure\nDelivery Method: Email + SMS + In-app notification\nPromotion Duration: 30 days\nExpected Retention Boost: +15%` 
        },
        { status: 200 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a T-Mobile customer loyalty expert tasked with creating promotional offers to reward and retain loyal customers.

Product: ${product}

Customer Feedback Summary:
${feedback.join('\n')}

Based on this feedback, generate a compelling LOYALTY PROMOTION CAMPAIGN that includes:

1. **Exclusive Offers**: Special discounts or perks for loyal customers (be specific with percentages/amounts)
2. **Upgrade Incentives**: Free trials of premium features or upgrades
3. **Referral Bonuses**: Rewards for bringing in new customers
4. **Early Access**: Exclusive beta features or new service access
5. **Appreciation Gestures**: Fee waivers, credits, or surprise bonuses

For each promotion, include:
- Clear value proposition
- Target customer segment (tenure, usage, etc.)
- Delivery method (email, SMS, app notification)
- Duration and terms
- Expected impact on retention/satisfaction

Format as a professional promotion campaign brief that can be sent to the marketing team.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const promotion = response.text();

    return NextResponse.json({ promotion }, { status: 200 });
  } catch (error) {
    console.error('Promotion generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate promotion' },
      { status: 500 }
    );
  }
}
