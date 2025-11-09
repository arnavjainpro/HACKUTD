# Backend - AI Agent

This folder contains the AI agent that securely sends customer recommendations to the dashboard.

## ⚠️ FIRST TIME SETUP REQUIRED

**Before running the agent, you MUST complete Auth0 setup!**

👉 **See: `AUTH0_SETUP_REQUIRED.md` for step-by-step instructions.**

Quick check:
```bash
./check-auth0-setup.sh
```

If you see "Auth0 authentication successful!" you're ready to go.  
If you see "Unauthorized", follow the setup guide.

---

## 📁 Files

- **`agent.js`** - Main agent script that authenticates and sends data
- **`package.json`** - Dependencies (axios)
- **`.env.agent.example`** - Template for environment variables
- **`test-api.sh`** - Script to test the API endpoint

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy the example file
cp .env.agent.example .env.agent

# Edit with your Auth0 M2M credentials
# Get these from Auth0 Dashboard after creating M2M app
nano .env.agent
```

Required variables:
```bash
AUTH0_M2M_CLIENT_ID=your_client_id
AUTH0_M2M_CLIENT_SECRET=your_client_secret
DASHBOARD_API_URL=http://localhost:3000/api/recommendation
```

### 3. Run the Agent

```bash
npm run agent
```

Expected output:
```
🔐 Step 1: Authenticating with Auth0...
✅ Successfully authenticated! Token received.
📤 Step 2: Sending recommendation to dashboard...
✅ Success!
🎉 Agent completed successfully!
```

## 🧪 Testing

Test the API endpoint (make sure dashboard is running):

```bash
./test-api.sh
```

Or test manually:

```bash
# Health check
curl http://localhost:3000/api/recommendation

# Unauthorized POST (should return 401)
curl -X POST http://localhost:3000/api/recommendation \
  -H "Content-Type: application/json" \
  -d '{"customer_id":"TEST"}'
```

## 🔧 Customization

Edit `agent.js` to add your AI logic:

```javascript
// Example: Integrate with Gemini AI
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Generate recommendation
const result = await model.generateContent(customerPrompt);
const recommendation = result.response.text();

// Send to dashboard (existing code handles this)
const payload = {
  customer_id: "CUST-123",
  recommendation: recommendation,
  // ... rest of payload
};
```

## 📊 Payload Format

The agent sends this JSON structure to the dashboard:

```json
{
  "customer_id": "CUST-1103",
  "product": "5G Plus Plan",
  "happiness_index": 0.92,
  "recommendation": "Offer $10 loyalty credit for improved satisfaction",
  "follow_up_status": "pending",
  "timestamp": "2025-11-08T...",
  "agent_version": "1.0.0"
}
```

## 🔒 Security

- ✅ JWT tokens from Auth0
- ✅ Environment variables for secrets
- ✅ Never commit `.env.agent`
- ✅ Use HTTPS in production

## 🚢 Deployment

For production:

1. Update `.env.agent`:
   ```bash
   DASHBOARD_API_URL=https://yourdashboard.vercel.app/api/recommendation
   ```

2. Deploy as:
   - Serverless function (AWS Lambda, Vercel, etc.)
   - Cron job (scheduled task)
   - Event-driven (triggered by webhooks)

## 📚 Documentation

See parent directory for full setup guides:
- `../SETUP_COMPLETE.md` - Quick start
- `../SECURE_API_SETUP.md` - Comprehensive guide
- `../API_INTEGRATION_README.md` - Integration overview
