#!/bin/bash

# Test script for the recommendation API endpoint
# Run this from the project root or backend folder

echo "🧪 Testing T-Mobile Customer Happiness Hub API"
echo "=============================================="
echo ""

# Test 1: Health Check (GET)
echo "📍 Test 1: Health Check (GET /api/recommendation)"
echo "Expected: 200 OK with API info"
echo ""

HEALTH_CHECK=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:3000/api/recommendation)
HTTP_STATUS=$(echo "$HEALTH_CHECK" | grep HTTP_STATUS | cut -d: -f2)
RESPONSE=$(echo "$HEALTH_CHECK" | grep -v HTTP_STATUS)

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ SUCCESS: Health check passed"
  echo "Response: $RESPONSE"
else
  echo "❌ FAILED: Health check failed with status $HTTP_STATUS"
  echo "Response: $RESPONSE"
fi

echo ""
echo "=============================================="
echo ""

# Test 2: Unauthorized POST (no token)
echo "📍 Test 2: Unauthorized POST (no authentication)"
echo "Expected: 401 Unauthorized"
echo ""

UNAUTH_TEST=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "TEST-001",
    "product": "Test Product",
    "happiness_index": 0.95,
    "recommendation": "Test recommendation",
    "follow_up_status": "pending"
  }' \
  http://localhost:3000/api/recommendation)

HTTP_STATUS=$(echo "$UNAUTH_TEST" | grep HTTP_STATUS | cut -d: -f2)
RESPONSE=$(echo "$UNAUTH_TEST" | grep -v HTTP_STATUS)

if [ "$HTTP_STATUS" = "401" ]; then
  echo "✅ SUCCESS: Correctly rejected unauthorized request"
  echo "Response: $RESPONSE"
else
  echo "⚠️  UNEXPECTED: Got status $HTTP_STATUS instead of 401"
  echo "Response: $RESPONSE"
fi

echo ""
echo "=============================================="
echo ""
echo "📝 Next Steps:"
echo "1. Complete Auth0 API setup (see API_INTEGRATION_README.md)"
echo "2. Configure .env.agent with your M2M credentials"
echo "3. Run: node agent.js"
echo ""
echo "For full testing with authentication, follow the setup guide!"
