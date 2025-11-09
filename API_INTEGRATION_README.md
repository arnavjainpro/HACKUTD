# 🚀 T-Mobile Customer Happiness Hub - Secure API Integration

## ✅ What I've Set Up For You

I've created a complete secure API integration system for your hackathon project! Here's what's ready:

### 📁 Files Created

1. **`/frontend/app/api/recommendation/route.ts`**
   - Secure API endpoint that accepts AI agent recommendations
   - Uses JWT token verification with Auth0
   - Supports both POST (submit data) and GET (health check)

2. **`/agent.js`**
   - Example AI agent script that authenticates and sends data
   - Includes detailed logging and error handling
   - Ready to customize with your AI logic

3. **`.env.agent.example`**
   - Template for agent configuration
   - Shows what environment variables you need

4. **`SECURE_API_SETUP.md`**
   - Complete step-by-step setup guide
   - Includes troubleshooting tips
   - Production deployment instructions

## 🎯 Quick Start (3 Steps)

### Step 1: Create Auth0 API

1. Go to [Auth0 Dashboard](https://manage.auth0.com/) → Applications → APIs
2. Click **Create API**
3. Settings:
   - Name: `HackUTD Recommendation API`
   - Identifier: `https://hackutd.api` ⚠️ Must match exactly!
   - Algorithm: RS256
4. Save

### Step 2: Create Machine-to-Machine App

1. Auth0 Dashboard → Applications → Applications
2. Click **Create Application**
3. Choose **Machine to Machine Applications**
4. Name: `HackUTD Agent`
5. Select your API: `HackUTD Recommendation API`
6. Authorize and save
7. **Copy the Client ID and Client Secret** (you'll need these!)

### Step 3: Configure Your Agent

```bash
# Create the agent environment file
cp .env.agent.example .env.agent

# Edit .env.agent and add your credentials:
AUTH0_M2M_CLIENT_ID=<paste your Client ID>
AUTH0_M2M_CLIENT_SECRET=<paste your Client Secret>
DASHBOARD_API_URL=http://localhost:3000/api/recommendation
```

## 🧪 Test It!

### Start Your Dashboard
```bash
cd frontend
npm run dev
```

### Run the Agent (in a new terminal)
```bash
node agent.js
```

You should see:
```
🔐 Step 1: Authenticating with Auth0...
✅ Successfully authenticated! Token received.
📤 Step 2: Sending recommendation to dashboard...
✅ Success!
🎉 Agent completed successfully!
```

## 📡 How It Works

```
┌─────────────────┐
│   AI Agent      │
│  (agent.js)     │
└────────┬────────┘
         │ (1) Request token
         ▼
┌─────────────────┐
│     Auth0       │
│ (Authentication)│
└────────┬────────┘
         │ (2) Return JWT
         ▼
┌─────────────────┐
│   AI Agent      │
│  (with token)   │
└────────┬────────┘
         │ (3) POST /api/recommendation
         ▼
┌─────────────────┐
│  Next.js API    │
│  (route.ts)     │
└────────┬────────┘
         │ (4) Verify JWT & Process
         ▼
┌─────────────────┐
│   Dashboard     │
│   (Display)     │
└─────────────────┘
```

## 🔒 Security Features

- ✅ **JWT Token Verification**: Only authenticated agents can send data
- ✅ **Auth0 Integration**: Industry-standard authentication
- ✅ **Environment Variables**: Secrets never committed to Git
- ✅ **HTTPS Ready**: Secure for production deployment
- ✅ **Error Handling**: Graceful failures with detailed logs

## 📊 API Endpoint

**URL**: `POST /api/recommendation`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "customer_id": "CUST-1103",
  "product": "5G Plus Plan",
  "happiness_index": 0.92,
  "recommendation": "Offer $10 loyalty credit",
  "follow_up_status": "pending"
}
```

**Response** (200 Success):
```json
{
  "message": "Secure recommendation received",
  "customer_id": "CUST-1103",
  "status": "success"
}
```

## 🎨 Customize the Agent

Edit `agent.js` to add your AI logic:

```javascript
// Example: Connect to your Gemini AI
const aiRecommendation = await callGeminiAPI(customerData);

const payload = {
  customer_id: customerData.id,
  product: customerData.product,
  happiness_index: aiRecommendation.score,
  recommendation: aiRecommendation.text,
  follow_up_status: "pending"
};

// Send to dashboard (code already there!)
```

## 🚢 Deploy to Production

### Update Vercel Environment Variables
1. Go to your Vercel project settings
2. Add: `AUTH0_AUDIENCE=https://hackutd.api`

### Update Agent for Production
```bash
# In .env.agent, change:
DASHBOARD_API_URL=https://yourdashboard.vercel.app/api/recommendation
```

## ❓ Troubleshooting

### "Unauthorized" error
- Double-check your M2M Client ID and Secret
- Verify the audience is exactly: `https://hackutd.api`
- Ensure the M2M app is authorized in Auth0

### Agent can't connect
- Make sure dashboard is running: `http://localhost:3000`
- Check `.env.agent` file exists and has values
- Try: `curl http://localhost:3000/api/recommendation` to test endpoint

### Need Help?
See the full guide: `SECURE_API_SETUP.md`

## 🎯 Next Steps for Your Hackathon

1. ✅ Complete Auth0 setup (Steps 1-3 above)
2. ✅ Test the integration
3. 🔄 Add your AI logic to `agent.js`
4. 🎨 Display recommendations in your dashboard UI
5. 🚀 Deploy and demo!

## 📚 What You Have Now

- ✅ Secure API endpoint (`/api/recommendation`)
- ✅ Working agent script (`agent.js`)
- ✅ JWT authentication
- ✅ Environment variable setup
- ✅ Complete documentation
- ✅ Ready for production deployment

**You're all set!** 🎉 Follow the Quick Start steps above to complete the Auth0 configuration, then you can start sending secure recommendations from your AI agent to your dashboard.

Need more details? Check out `SECURE_API_SETUP.md` for the complete guide.
