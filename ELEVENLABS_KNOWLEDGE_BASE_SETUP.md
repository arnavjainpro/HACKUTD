# ElevenLabs Knowledge Base Setup Guide

## Problem

The ElevenLabs Web SDK doesn't support passing custom context/knowledge base data directly to the agent during a conversation session. The agent needs to be configured to access customer-specific information.

## Solutions

### ✅ Solution 1: Update Agent System Prompt (RECOMMENDED - Quick)

Go to the [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai) and update your agent's system prompt to include instructions about customer context:

```
You are a helpful T-Mobile customer support agent.

IMPORTANT: You will receive customer-specific context at the start of each call, including:
- Product information (device name, issue, purchase date)
- Warranty status and remaining months
- Customer history (support tickets, store visits, previous attempts)
- Recommended actions for resolving their issue

Use this context to provide personalized, efficient support. Always reference the specific issue and recommend the appropriate action based on the warranty status.

When the customer connects, greet them and acknowledge their specific issue if provided.
```

### ✅ Solution 2: Use Client Tools (RECOMMENDED - Dynamic)

Create a **Client Tool** in your ElevenLabs agent that fetches the knowledge base:

1. Go to your agent settings in ElevenLabs Dashboard
2. Add a new **Client Tool** with:

   - **Name**: `get_customer_context`
   - **Description**: "Retrieves customer-specific context including product info, warranty status, and recommended actions"
   - **Parameters**:
     ```json
     {
       "customerId": "string",
       "product": "string"
     }
     ```

3. Implement the client tool handler in the frontend:

```typescript
const conversation = await Conversation.startSession({
  signedUrl,
  clientTools: {
    get_customer_context: async () => {
      // Return the knowledge base data
      return {
        product: knowledgeBase.productInfo,
        warranty: knowledgeBase.productInfo.warrantyStatus,
        history: knowledgeBase.customerHistory,
        recommended_actions: knowledgeBase.recommendedActions,
        summary: knowledgeBase.summary,
      };
    },
  },
  // ... other config
});
```

4. Update your agent's system prompt to use the tool:

```
At the start of the conversation, call the get_customer_context tool to retrieve customer information.
```

### ⚠️ Solution 3: Backend API Endpoint (For Future Gemini Integration)

Create an API endpoint that the ElevenLabs agent can call:

1. **Create API endpoint**: `/api/customer-context/:customerId/:product`
2. **Configure in ElevenLabs**: Add this as a **Custom Function** in agent settings
3. **Agent will call** this endpoint during the conversation to fetch context

This is the approach we should use when implementing Gemini CSV analysis.

## Current Implementation Status

✅ **Done:**

- Knowledge base API created (`/api/knowledge-base`)
- Mock data structure for broken phone issue
- Knowledge base fetched and logged in console
- Pipeline structure: Product Page → CallModal → elevenlabs-init → knowledge-base

❌ **Not Done:**

- ElevenLabs agent doesn't have access to the knowledge base data
- Agent system prompt not updated to reference customer context
- Client tools not implemented

## Next Steps

### Immediate (5 minutes):

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
2. Find your agent: `agent_0801k9jzy5jwfy08aksezh9dv4tj`
3. Click **Edit** → **System Prompt**
4. Add the recommended prompt from Solution 1 above
5. Save and test

### Short-term (When ready for production):

1. Implement **Client Tools** (Solution 2) for dynamic knowledge base access
2. Test with real customer scenarios
3. Replace mock data with Gemini CSV analysis

### Long-term (Full production):

1. Create dedicated backend endpoint for customer context
2. Configure ElevenLabs agent to call this endpoint
3. Implement caching and optimization
4. Add analytics and monitoring

## Testing

After updating the agent prompt, test by:

1. Starting a call from the product page
2. Check console for: `📚 Knowledge base loaded: ...`
3. Say something like "What's my issue?" or "Can you help me?"
4. Agent should reference the Samsung Galaxy S23 SIM card slot issue

## Code Locations

- **Knowledge Base API**: `/frontend/app/api/knowledge-base/route.ts`
- **ElevenLabs Init**: `/frontend/app/api/elevenlabs-init/route.ts`
- **Call Modal**: `/frontend/components/CallModal.tsx`
- **Product Page**: `/frontend/app/dashboard/product/[product]/page.tsx`

## Mock Data Being Sent

```json
{
  "summary": "Customer has T-Mobile Samsung Galaxy S23 with faulty SIM card slot...",
  "productInfo": {
    "name": "Samsung Galaxy S23",
    "issue": "Faulty SIM card slot",
    "warrantyStatus": "Active",
    "warrantyMonthsRemaining": 9
  },
  "customerHistory": {
    "supportTickets": 3,
    "storeVisits": 2,
    "previousAttempts": ["SIM card replacement", "Network reset"]
  },
  "recommendedActions": [
    "Authorize warranty replacement for immediate resolution",
    "Schedule repair appointment at authorized service center",
    "Offer loaner device during repair period"
  ]
}
```

## Important Notes

- The Web SDK **CANNOT** pass custom data in `startSession()`
- Agent configuration happens in ElevenLabs Dashboard, not in code
- For dynamic context, use **Client Tools** or **API endpoints**
- Current code logs the knowledge base but agent can't access it yet
- **You MUST update the agent prompt manually** for this to work
