# ⚠️ Auth0 Setup Required!

## The Issue

The agent script is failing because the **Auth0 Machine-to-Machine (M2M) authentication is not set up yet**.

Error: `Unauthorized` when trying to authenticate with Auth0.

## Why This Happens

You have credentials in `.env.agent`, but Auth0 needs to be configured to:
1. Create an API (with identifier `https://hackutd.api`)
2. Create a Machine-to-Machine application
3. Authorize that M2M app to access the API

## 🔧 Fix It Now (10 Minutes)

### Step 1: Create Auth0 API

1. Go to [Auth0 Dashboard](https://manage.auth0.com/dashboard/)
2. Click **Applications** → **APIs** in the sidebar
3. Click **Create API** button
4. Fill in:
   ```
   Name: HackUTD Recommendation API
   Identifier: https://hackutd.api
   Signing Algorithm: RS256
   ```
   ⚠️ **IMPORTANT**: The identifier MUST be exactly `https://hackutd.api`
5. Click **Create**

### Step 2: Create Machine-to-Machine Application

1. In Auth0 Dashboard, go to **Applications** → **Applications**
2. Click **Create Application**
3. Choose **Machine to Machine Applications**
4. Fill in:
   ```
   Name: HackUTD Agent
   ```
5. Select the API you just created: **HackUTD Recommendation API**
6. Click **Authorize** → **Create**

### Step 3: Get Your Credentials

After creating the M2M app:
1. You'll see the **Settings** tab
2. Find and copy:
   - **Client ID** (starts with a letter, ~32 characters)
   - **Client Secret** (click "Show" to reveal, ~64 characters)

### Step 4: Update .env.agent

```bash
cd backend
nano .env.agent
```

Replace with your actual credentials:
```bash
AUTH0_M2M_CLIENT_ID=your_actual_client_id_here
AUTH0_M2M_CLIENT_SECRET=your_actual_client_secret_here
AUTH0_AUDIENCE=https://hackutd.api
DASHBOARD_API_URL=http://localhost:3000/api/recommendation
```

Save the file (Ctrl+O, Enter, Ctrl+X in nano).

### Step 5: Verify Setup

```bash
cd backend
./check-auth0-setup.sh
```

This will test your Auth0 configuration and tell you if everything is correct.

### Step 6: Run the Agent

```bash
# Make sure dashboard is running first
cd ../frontend
npm run dev

# In a new terminal, run the agent
cd backend
npm run agent
```

## 🧪 Quick Test

Run the setup checker to diagnose the issue:

```bash
cd backend
./check-auth0-setup.sh
```

This will tell you exactly what's wrong and how to fix it.

## ✅ Expected Success Output

When properly configured, you should see:

```
🔐 Step 1: Authenticating with Auth0...
✅ Successfully authenticated! Token received.

📤 Step 2: Sending recommendation to dashboard...
✅ Success!
Status: 200

🎉 Agent completed successfully!
```

## 📚 Need More Help?

See the detailed guides:
- `../SETUP_COMPLETE.md` - Complete setup guide
- `../SECURE_API_SETUP.md` - Comprehensive Auth0 setup
- `README.md` - Backend documentation

## Common Issues

### "Unauthorized" Error
→ M2M app not created or not authorized for the API  
→ Follow Steps 1-4 above

### "Invalid Credentials"
→ Wrong Client ID or Secret  
→ Double-check values in Auth0 dashboard

### "audience is not allowed"
→ API identifier doesn't match  
→ Must be exactly `https://hackutd.api`

---

**Don't skip the Auth0 setup!** The agent needs proper M2M authentication to work. Follow the steps above and you'll be good to go! 🚀
