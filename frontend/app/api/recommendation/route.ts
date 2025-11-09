import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, createRemoteJWKSet } from 'jose';

const AUTH0_DOMAIN = process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-zomn2cogr6v6k0n2.us.auth0.com';
const AUDIENCE = process.env.AUTH0_AUDIENCE || 'https://hackutd.api';

// Create JWKS for token verification
const JWKS = createRemoteJWKSet(new URL(`${AUTH0_DOMAIN}/.well-known/jwks.json`));

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${AUTH0_DOMAIN}/`,
      audience: AUDIENCE,
    });
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();

    // Log the secure recommendation
    console.log('✅ Secure recommendation received:', {
      timestamp: new Date().toISOString(),
      customer_id: body.customer_id,
      product: body.product,
      happiness_index: body.happiness_index,
      recommendation: body.recommendation,
      follow_up_status: body.follow_up_status,
      authenticated_client: payload.sub,
    });

    // TODO: Store in database
    // Example: await db.recommendations.create({ data: body });

    return NextResponse.json(
      {
        message: 'Secure recommendation received',
        customer_id: body.customer_id,
        status: 'success',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing recommendation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests to test if the endpoint is alive
export async function GET() {
  return NextResponse.json(
    {
      message: 'Recommendation API endpoint is active',
      methods: ['POST'],
      requiresAuth: true,
    },
    { status: 200 }
  );
}
