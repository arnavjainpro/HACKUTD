# Secure API Integration Setup Guide

This guide explains how to set up secure Machine-to-Machine (M2M) authentication between your AI agent and the T-Mobile Customer Happiness Hub dashboard.

## 🏗️ Architecture Overview

```
AI Agent (External Script)
    ↓ (1) Request Access Token
Auth0 (Client Credentials Flow)
    ↓ (2) Return JWT Token
AI Agent
    ↓ (3) POST /api/recommendation with JWT
Next.js Dashboard API
    ↓ (4) Verify JWT & Process
Database / Storage
```

## 📋 Prerequisites

- Auth0 account with your application already set up
- Next.js dashboard running (already configured)
- Node.js installed for running the agent script

## 🔐 Step 1: Create Auth0 API

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **APIs**
3. Click **Create API**
4. Fill in the details:
   - **Name**: `HackUTD Recommendation API`
   - **Identifier**: `https://hackutd.api` (must match exactly)
   - **Signing Algorithm**: RS256
5. Click **Create**

## 🤖 Step 2: Create Machine-to-Machine Application

1. In Auth0 Dashboard, go to **Applications** → **Applications**
2. Click **Create Application**
3. Select **Machine to Machine Applications**
4. Name it: `HackUTD Agent`
5. Select the API you just created: `HackUTD Recommendation API`
6. Grant permissions (authorize the API)
7. Click **Create**

### Save Your Credentials

After creation, you'll see:
- **Client ID** (e.g., `abc123xyz...`)
- **Client Secret** (click "reveal" to see it)

⚠️ **Keep these secure!** Never commit them to Git.

## 🔧 Step 3: Configure Environment Variables

### For the Dashboard (Frontend)

Your `frontend/.env.local` is already updated with:

```bash
AUTH0_AUDIENCE='https://hackutd.api'
```

### For the Agent Script

Create a file `.env.agent` in the root directory:

```bash
# Copy from .env.agent.example
cp .env.agent.example .env.agent
```

Then edit `.env.agent` and add your M2M credentials:

```bash
AUTH0_M2M_CLIENT_ID=your_actual_m2m_client_id
AUTH0_M2M_CLIENT_SECRET=your_actual_m2m_client_secret
DASHBOARD_API_URL=http://localhost:3000/api/recommendation
```

⚠️ **Important**: Add `.env.agent` to your `.gitignore` to avoid committing secrets!

## 🚀 Step 4: Test the Integration

### Start Your Dashboard

```bash
cd frontend
npm run dev
```

Dashboard will run at: `http://localhost:3000`

### Run the Agent Script

In a new terminal:

```bash
# Load environment variables and run agent
node agent.js
```

### Expected Output

```
🔐 Step 1: Authenticating with Auth0...
✅ Successfully authenticated! Token received.

📤 Step 2: Sending recommendation to dashboard...
Payload: {
  "customer_id": "CUST-1103",
  "product": "5G Plus Plan",
  "happiness_index": 0.92,
  "recommendation": "Offer $10 loyalty credit for improved satisfaction",
  "follow_up_status": "pending",
  "timestamp": "2025-11-08T..."
}

✅ Success!
Status: 200
Response: {
  "message": "Secure recommendation received",
  "customer_id": "CUST-1103",
  "status": "success"
}

🎉 Agent completed successfully!
```

## 📡 API Endpoint Details

### POST `/api/recommendation`

**Authentication**: Bearer JWT token (from Auth0 M2M)

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "customer_id": "CUST-1103",
  "product": "5G Plus Plan",
  "happiness_index": 0.92,
  "recommendation": "Offer $10 loyalty credit for improved satisfaction",
  "follow_up_status": "pending"
}
```

**Success Response** (200):
```json
{
  "message": "Secure recommendation received",
  "customer_id": "CUST-1103",
  "status": "success"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing JWT token
- `405 Method Not Allowed`: Non-POST request
- `500 Internal Server Error`: Server error

### GET `/api/recommendation`

Test endpoint to verify API is running.

**Response** (200):
```json
{
  "message": "Recommendation API endpoint is active",
  "methods": ["POST"],
  "requiresAuth": true
}
```

## 🧪 Testing with cURL

```bash
# Get access token
TOKEN=$(curl -s --request POST \
  --url https://dev-zomn2cogr6v6k0n2.us.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id":"YOUR_M2M_CLIENT_ID",
    "client_secret":"YOUR_M2M_CLIENT_SECRET",
    "audience":"https://hackutd.api",
    "grant_type":"client_credentials"
  }' | jq -r '.access_token')

# Test the API
curl -X POST http://localhost:3000/api/recommendation \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST-TEST",
    "product": "Test Product",
    "happiness_index": 0.95,
    "recommendation": "Test recommendation",
    "follow_up_status": "pending"
  }'
```

## 🔒 Security Best Practices

1. ✅ **Never commit secrets**: Use `.gitignore` for `.env.agent`
2. ✅ **Rotate credentials regularly**: Change M2M secrets periodically
3. ✅ **Use HTTPS in production**: Never send tokens over HTTP
4. ✅ **Limit token scope**: Only grant necessary permissions
5. ✅ **Monitor API usage**: Check Auth0 logs for suspicious activity

## 🚢 Deployment to Production

### Update Environment Variables

For **Vercel** (or your hosting platform):

1. Add to Vercel Environment Variables:
   ```
   AUTH0_AUDIENCE=https://hackutd.api
   ```

2. Update agent's `.env.agent`:
   ```bash
   DASHBOARD_API_URL=https://yourdashboard.vercel.app/api/recommendation
   ```

### Deploy

```bash
cd frontend
vercel --prod
```

## 🐛 Troubleshooting

### "Unauthorized - Invalid token"

- Verify your M2M Client ID and Secret are correct
- Ensure the `audience` matches exactly: `https://hackutd.api`
- Check that the M2M app is authorized for your API in Auth0

### "Missing or invalid authorization header"

- Ensure you're sending: `Authorization: Bearer <token>`
- Token should not have extra quotes or whitespace

### Agent script fails to authenticate

- Double-check `.env.agent` file exists and has correct values
- Verify Auth0 domain is correct: `dev-zomn2cogr6v6k0n2.us.auth0.com`
- Ensure M2M app has permissions for the API

### Network errors

- Verify dashboard is running: `http://localhost:3000`
- Check firewall/network settings
- Try testing with cURL first to isolate the issue

## 📚 Next Steps

1. **Add Database Integration**: Store recommendations in a database
2. **Create Dashboard UI**: Display received recommendations in the dashboard
3. **Add Webhooks**: Trigger real-time updates when recommendations arrive
4. **Implement Rate Limiting**: Protect your API from abuse
5. **Add Logging**: Use a service like LogRocket or Sentry

## 🎯 Hackathon Integration

This setup allows your external AI agent to:
- ✅ Securely authenticate with your dashboard
- ✅ Send customer recommendations
- ✅ Track happiness scores
- ✅ Manage follow-up actions

Perfect for demonstrating a complete customer service automation system! 🚀
