#!/bin/bash

echo "🔍 Checking Auth0 Configuration..."
echo "=================================="
echo ""

# Check if .env.agent exists
if [ ! -f ".env.agent" ]; then
  echo "❌ ERROR: .env.agent file not found!"
  echo ""
  echo "📝 Create it by running:"
  echo "   cp .env.agent.example .env.agent"
  echo "   nano .env.agent"
  echo ""
  exit 1
fi

# Source the .env.agent file
source .env.agent

# Check if variables are set
echo "✓ Checking environment variables..."

if [ -z "$AUTH0_M2M_CLIENT_ID" ]; then
  echo "❌ AUTH0_M2M_CLIENT_ID is not set"
  MISSING=1
else
  echo "✓ AUTH0_M2M_CLIENT_ID: ${AUTH0_M2M_CLIENT_ID:0:10}..."
fi

if [ -z "$AUTH0_M2M_CLIENT_SECRET" ]; then
  echo "❌ AUTH0_M2M_CLIENT_SECRET is not set"
  MISSING=1
else
  echo "✓ AUTH0_M2M_CLIENT_SECRET: ${AUTH0_M2M_CLIENT_SECRET:0:10}..."
fi

if [ -z "$AUTH0_AUDIENCE" ]; then
  echo "❌ AUTH0_AUDIENCE is not set"
  MISSING=1
else
  echo "✓ AUTH0_AUDIENCE: $AUTH0_AUDIENCE"
fi

if [ -z "$DASHBOARD_API_URL" ]; then
  echo "❌ DASHBOARD_API_URL is not set"
  MISSING=1
else
  echo "✓ DASHBOARD_API_URL: $DASHBOARD_API_URL"
fi

echo ""

if [ -n "$MISSING" ]; then
  echo "❌ Some environment variables are missing!"
  echo "📝 Edit .env.agent and add the missing values"
  exit 1
fi

echo "=================================="
echo ""
echo "🧪 Testing Auth0 Authentication..."
echo ""

# Test Auth0 token endpoint
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" --request POST \
  --url "https://dev-zomn2cogr6v6k0n2.us.auth0.com/oauth/token" \
  --header 'content-type: application/json' \
  --data "{
    \"client_id\":\"$AUTH0_M2M_CLIENT_ID\",
    \"client_secret\":\"$AUTH0_M2M_CLIENT_SECRET\",
    \"audience\":\"$AUTH0_AUDIENCE\",
    \"grant_type\":\"client_credentials\"
  }")

HTTP_CODE=$(echo "$RESPONSE" | grep HTTP_CODE | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v HTTP_CODE)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Auth0 authentication successful!"
  echo "✅ Access token received"
  echo ""
  echo "🎉 Your Auth0 configuration is correct!"
  echo ""
  echo "Next steps:"
  echo "1. Make sure your dashboard is running: cd ../frontend && npm run dev"
  echo "2. Run the agent: npm run agent"
else
  echo "❌ Auth0 authentication failed!"
  echo "HTTP Status: $HTTP_CODE"
  echo ""
  echo "Response:"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  echo ""
  echo "=================================="
  echo ""
  echo "🔧 Troubleshooting:"
  echo ""
  
  if echo "$BODY" | grep -q "Unauthorized\|access_denied"; then
    echo "❌ Your M2M credentials are invalid or the setup is incomplete."
    echo ""
    echo "📋 Follow these steps:"
    echo ""
    echo "1️⃣  CREATE AUTH0 API:"
    echo "   • Go to: https://manage.auth0.com/dashboard/"
    echo "   • Navigate to: Applications → APIs"
    echo "   • Click: Create API"
    echo "   • Name: HackUTD Recommendation API"
    echo "   • Identifier: https://hackutd.api  ⚠️  MUST MATCH EXACTLY"
    echo "   • Algorithm: RS256"
    echo ""
    echo "2️⃣  CREATE MACHINE-TO-MACHINE APP:"
    echo "   • Go to: Applications → Applications"
    echo "   • Click: Create Application"
    echo "   • Type: Machine to Machine Applications"
    echo "   • Name: HackUTD Agent"
    echo "   • Select API: HackUTD Recommendation API"
    echo "   • Click: Authorize"
    echo ""
    echo "3️⃣  UPDATE YOUR .env.agent FILE:"
    echo "   • Copy the Client ID from your M2M app"
    echo "   • Copy the Client Secret (click 'reveal')"
    echo "   • Update .env.agent with the correct values"
    echo ""
    echo "4️⃣  RUN THIS SCRIPT AGAIN:"
    echo "   ./check-auth0-setup.sh"
    echo ""
  fi
  
  exit 1
fi
