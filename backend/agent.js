import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env.agent" });

// Auth0 Configuration (Machine-to-Machine)
const AUTH0_DOMAIN = "dev-zomn2cogr6v6k0n2.us.auth0.com";
const CLIENT_ID = process.env.AUTH0_M2M_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTH0_M2M_CLIENT_SECRET;
const AUDIENCE = process.env.AUTH0_AUDIENCE || "https://hackutd.api";

// Dashboard API endpoint (local or deployed)
const DASHBOARD_API_URL =
  process.env.DASHBOARD_API_URL || "http://localhost:3000/api/recommendation";

async function sendRecommendationToDashboard() {
  try {
    console.log("🔐 Step 1: Authenticating with Auth0...");
    console.log("🔎 Sending token request with:", {
      domain: AUTH0_DOMAIN,
      client_id: CLIENT_ID,
      audience: AUDIENCE,
    });

    // Step 1: Get access token using Client Credentials flow
    const tokenRes = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: AUDIENCE,
    });

    const accessToken = tokenRes.data.access_token;
    console.log("✅ Successfully authenticated! Token received.");

    // Step 2: Prepare the recommendation payload
    const payload = {
      customer_id: "CUST-1103",
      product: "5G Plus Plan",
      happiness_index: 0.92,
      recommendation: "Offer $10 loyalty credit for improved satisfaction",
      follow_up_status: "pending",
      timestamp: new Date().toISOString(),
      agent_version: "1.0.0",
    };

    console.log("\n📤 Step 2: Sending recommendation to dashboard...");
    console.log("Payload:", JSON.stringify(payload, null, 2));

    // Step 3: Send payload to your secure API endpoint
    const res = await axios.post(DASHBOARD_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("\n✅ Success!");
    console.log("Status:", res.status);
    console.log("Response:", res.data);

    return res.data;
  } catch (error) {
    console.error("\n❌ Error during execution:");
    console.error(error.response?.data || error.message);
    console.error("\n💥 Agent failed:", error.response?.statusText || error.message);
    process.exit(1);
  }
}

// Run the agent
sendRecommendationToDashboard()
  .then(() => {
    console.log("\n🎉 Agent completed successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n💥 Agent failed:", err.message);
    process.exit(1);
  });
