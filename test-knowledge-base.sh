#!/bin/bash

# Test Knowledge Base API
# This script tests the knowledge base pipeline

echo "🧪 Testing Knowledge Base API..."
echo ""

# Test 1: Knowledge Base API
echo "📚 Test 1: Knowledge Base API"
echo "Calling: POST /api/knowledge-base"
curl -X POST http://localhost:3000/api/knowledge-base \
  -H "Content-Type: application/json" \
  -d '{"customerId": "12345", "product": "Samsung Galaxy S23"}' \
  | jq '.' || echo "❌ Failed - Is the frontend server running? (npm run dev)"

echo ""
echo ""

# Test 2: ElevenLabs Init API
echo "🔗 Test 2: ElevenLabs Init API (includes knowledge base)"
echo "Calling: POST /api/elevenlabs-init"
curl -X POST http://localhost:3000/api/elevenlabs-init \
  -H "Content-Type: application/json" \
  -d '{"customerId": "12345", "product": "Samsung Galaxy S23"}' \
  | jq '.' || echo "❌ Failed - Is the frontend server running?"

echo ""
echo ""
echo "✅ Tests complete!"
echo ""
echo "Expected output:"
echo "  Test 1: Should show mock knowledge base data (Samsung Galaxy S23, SIM card issue)"
echo "  Test 2: Should show signedUrl + agentId + timestamp + knowledgeBase"
echo ""
echo "If both tests pass, the pipeline is working correctly!"
