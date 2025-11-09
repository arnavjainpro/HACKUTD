# 🚨 IMPORTANT: ElevenLabs Agent Configuration Required

## The Problem

Your ElevenLabs agent doesn't know about the Samsung phone or any customer knowledge because the agent needs to be configured to use the **client tool** we just created.

## What We Just Built

✅ **Client Tool**: `get_customer_context()` - Provides customer-specific data including:

- Product info (Samsung Galaxy S23, faulty SIM slot)
- Warranty status (Active, 9 months remaining)
- Customer history (3 support tickets, 2 store visits)
- Recommended actions (warranty replacement, service center, loaner device)

## What You Need to Do NOW

### Step 1: Update Agent System Prompt (5 minutes)

1. Go to **[ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)**
2. Find your agent: `agent_0801k9jzy5jwfy08aksezh9dv4tj`
3. Click **Edit** → **System Prompt**
4. **Add this at the beginning of your system prompt:**

```
IMPORTANT: Before greeting the customer, immediately call the get_customer_context() function to retrieve their information.

You have access to a client tool called get_customer_context() that provides:
- Product information (device name, issue, warranty status)
- Customer history (support tickets, store visits, previous attempts)
- Recommended actions for resolving their issue

Always reference this context in your conversation. Acknowledge the specific issue and recommend appropriate actions based on the warranty status.
```

5. Click **Save**

### Step 2: Test It (2 minutes)

1. Go to your product page in the app
2. Click the call button
3. Accept the incoming call
4. Open browser console (F12)
5. Look for this log:

   ```
   🔧 Agent requesting customer context via client tool
   ```

6. The agent should now say something like:
   > "Hi! I can see you're calling about your Samsung Galaxy S23 with a faulty SIM card slot. I understand you've already tried [previous attempts] and visited the store twice. Since your device is still under warranty with 9 months remaining, I can help you with a warranty replacement..."

## How It Works

```
User Clicks Call
      ↓
Product Page passes customerId + product to CallModal
      ↓
CallModal requests signed URL from /api/elevenlabs-init
      ↓
elevenlabs-init fetches knowledge base from /api/knowledge-base
      ↓
CallModal creates client tool: get_customer_context()
      ↓
ElevenLabs agent calls get_customer_context() (if configured)
      ↓
Client tool returns knowledge base data
      ↓
Agent uses data to provide personalized support
```

## What Happens Without Configuration

❌ Agent will NOT automatically call `get_customer_context()`
❌ Agent will NOT know about the Samsung phone issue
❌ Agent will give generic support instead of personalized help

## What Happens After Configuration

✅ Agent calls `get_customer_context()` at start of call
✅ Agent receives complete customer knowledge base
✅ Agent provides specific, personalized support
✅ Agent references warranty status and recommends proper actions

## Console Logs You Should See

When everything is working:

```
📞 Requesting new ElevenLabs session with knowledge base...
📚 Fetching knowledge base...
✅ Knowledge base loaded: {...}
✅ Got signed URL for agent...
📚 Knowledge base loaded: Customer has T-Mobile Samsung...
🎙️ Connected to ElevenLabs agent
✅ Agent has access to customer context via client tool
📋 Issue: Faulty SIM card slot
🎯 Actions: ["Authorize warranty replacement...", ...]
🔧 Agent requesting customer context via client tool  ← THIS IS THE KEY!
💡 Agent can call get_customer_context() to access knowledge base
```

## Troubleshooting

### "I don't see the 🔧 Agent requesting customer context log"

→ The agent system prompt wasn't updated. Go to ElevenLabs dashboard and add the prompt.

### "Agent still doesn't know about my phone"

→ Make sure the agent prompt says "immediately call the get_customer_context() function"

### "Knowledge base is empty or wrong"

→ Check `/api/knowledge-base` - it should return mock data about Samsung Galaxy S23

## Future: Gemini Integration

When you're ready to add real CSV data analysis:

1. Update `/frontend/app/api/knowledge-base/route.ts`
2. Replace the mock data with Gemini API call
3. Pass CSV data to Gemini for analysis
4. Return structured knowledge base

The pipeline is already set up - just swap the mock data!

## Files Modified

- ✅ `/frontend/components/CallModal.tsx` - Added client tool
- ✅ `/frontend/app/api/elevenlabs-init/route.ts` - Fetches knowledge base
- ✅ `/frontend/app/api/knowledge-base/route.ts` - Returns mock data
- ✅ `/frontend/app/dashboard/product/[product]/page.tsx` - Passes customerId + product

## Need Help?

Check the detailed guide: `ELEVENLABS_KNOWLEDGE_BASE_SETUP.md`
