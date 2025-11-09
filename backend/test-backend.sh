#!/bin/bash
# Test script for FastAPI backend

echo "🧪 Testing FastAPI Backend Integration"
echo "========================================"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:8000/health)
echo "Response: $HEALTH_RESPONSE"
echo ""

# Test 2: Root endpoint
echo "2️⃣  Testing root endpoint..."
ROOT_RESPONSE=$(curl -s http://localhost:8000/)
echo "Response: $ROOT_RESPONSE"
echo ""

# Test 3: Agent Info
echo "3️⃣  Testing agent info endpoint..."
AGENT_RESPONSE=$(curl -s http://localhost:8000/api/agent-info)
echo "Response: $AGENT_RESPONSE"
echo ""

# Test 4: Call Endpoint (if server is running)
echo "4️⃣  Testing call endpoint with sample data..."
CALL_RESPONSE=$(curl -s -X POST http://localhost:8000/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test Customer",
    "customer_phone": "+1-555-0100",
    "transcript": "The mobile app is very confusing to navigate. I cannot find the pay bill button.",
    "product": "T-Mobile App"
  }')

# Pretty print the response if jq is available
if command -v jq &> /dev/null; then
    echo "$CALL_RESPONSE" | jq '.'
else
    echo "$CALL_RESPONSE"
fi

echo ""
echo "✅ Testing complete!"
echo ""
echo "💡 Tip: Install jq for better JSON formatting: brew install jq"
