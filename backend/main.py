"""
FastAPI Backend for ElevenLabs Agent Integration
Handles phone call simulations and connects frontend to ElevenLabs API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
import json
from dotenv import load_dotenv
from typing import Optional, List, Dict
from pathlib import Path
import pandas as pd
from google import genai
import sys
from supabase import create_client, Client

# Add CHI folder to Python path
CHI_PATH = Path(__file__).parent / "CHI"
sys.path.insert(0, str(CHI_PATH))

# Import CHI calculation function
try:
    from test_method import enhance_transcript_dataframe
    print("✅ CHI module loaded successfully")
except ImportError as e:
    print(f"⚠️  Warning: Could not import CHI module: {e}")
    enhance_transcript_dataframe = None

# Load environment variables from ElevenLabs directory
env_path = Path(__file__).parent / "ElevenLabs" / ".env"
load_dotenv(dotenv_path=env_path)

# Also load from backend .env for Supabase credentials
backend_env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=backend_env_path)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase_client: Optional[Client] = None
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        print("✅ Supabase client initialized")
    except Exception as e:
        print(f"⚠️  Warning: Failed to initialize Supabase: {e}")
else:
    print("⚠️  Warning: Supabase credentials not found in .env")

app = FastAPI(
    title="ElevenLabs Agent API",
    description="Backend API for T-Mobile customer feedback calls",
    version="1.0.0"
)

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class CallRequest(BaseModel):
    customer_name: str
    customer_phone: str
    transcript: str
    product: Optional[str] = None


class ConversationTurn(BaseModel):
    role: str
    message: Optional[str] = ""  # Make message optional with default empty string
    time_in_call_secs: float


class CallResponse(BaseModel):
    success: bool
    conversation: List[ConversationTurn]
    analysis: Dict
    call_successful: str
    transcript_summary: str


# ElevenLabs API Configuration
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_AGENT_ID = os.getenv("ELEVENLABS_AGENT_ID")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not ELEVENLABS_API_KEY or not ELEVENLABS_AGENT_ID:
    print("⚠️  Warning: ElevenLabs credentials not found in .env file")

if GOOGLE_API_KEY:
    # Configure the new Gemini client
    genai_client = genai.Client(api_key=GOOGLE_API_KEY)
    print("✅ Gemini API configured")
else:
    print("⚠️  Warning: Google API key not found in .env file")
    genai_client = None


# Global cache for CHI data (refresh every hour)
chi_cache = {
    "data": None,
    "last_updated": None
}

def get_chi_data(force_refresh=False):
    """Get CHI data from cache or recalculate from Supabase"""
    from datetime import datetime, timedelta
    
    # Check if cache is still valid (1 hour)
    if (not force_refresh and 
        chi_cache["data"] is not None and 
        chi_cache["last_updated"] and
        datetime.now() - chi_cache["last_updated"] < timedelta(hours=1)):
        print("📊 Using cached CHI data")
        return chi_cache["data"]
    
    print("📊 Calculating CHI from Supabase...")
    
    if enhance_transcript_dataframe is None:
        print("❌ CHI module not loaded")
        return None
        
    try:
        df_enhanced, df_chi = enhance_transcript_dataframe(use_supabase=True)
        
        if df_chi is not None:
            chi_cache["data"] = df_chi
            chi_cache["last_updated"] = datetime.now()
            print(f"✅ CHI data cached ({len(df_chi)} records)")
            return df_chi
        else:
            print("❌ Failed to calculate CHI")
            return None
            
    except Exception as e:
        print(f"❌ Error calculating CHI: {e}")
        import traceback
        traceback.print_exc()
        return None


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "ElevenLabs Agent API",
        "agent_configured": bool(ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID)
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "elevenlabs_configured": bool(ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID),
        "agent_id": ELEVENLABS_AGENT_ID[:20] + "..." if ELEVENLABS_AGENT_ID else None
    }


@app.post("/api/call", response_model=CallResponse)
async def initiate_call(request: CallRequest):
    """
    Initiate a phone call using ElevenLabs agent
    
    This endpoint:
    1. Takes customer info and their original feedback
    2. Simulates a conversation with ElevenLabs agent
    3. Returns the conversation transcript and analysis
    """
    
    if not ELEVENLABS_API_KEY or not ELEVENLABS_AGENT_ID:
        raise HTTPException(
            status_code=500,
            detail="ElevenLabs credentials not configured"
        )
    
    try:
        # Create simulated user prompt based on customer feedback
        simulated_user_prompt = f"""
        You are {request.customer_name}, a T-Mobile customer who previously left feedback: "{request.transcript}"
        
        You are receiving a follow-up call from T-Mobile to discuss your feedback in more detail.
        
        Instructions:
        - Be conversational and natural
        - Provide specific details about your complaint
        - Explain what frustrated you and why it matters
        - Be honest but polite
        - Give constructive criticism
        - Share what would make the experience better
        
        Keep responses concise (2-3 sentences each turn).
        """
        
        # Call ElevenLabs simulate conversation API
        url = f"https://api.elevenlabs.io/v1/convai/agents/{ELEVENLABS_AGENT_ID}/simulate-conversation"
        
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "simulation_specification": {
                "simulated_user_config": {
                    "prompt": {
                        "prompt": simulated_user_prompt
                    }
                }
            },
            "new_turns_limit": 8  # Allow for a substantive conversation
        }
        
        print(f"📞 Initiating call to {request.customer_name} ({request.customer_phone})")
        print(f"📝 Original feedback: {request.transcript}")
        
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"ElevenLabs API error: {response.text}"
            )
        
        result = response.json()
        
        # Extract conversation and analysis
        simulated_conversation = result.get("simulated_conversation", [])
        analysis = result.get("analysis", {})
        
        # Format conversation turns - filter out any turns with None messages
        conversation_turns = [
            ConversationTurn(
                role=turn.get("role", "unknown"),
                message=turn.get("message") or "",  # Use "or" to handle None
                time_in_call_secs=turn.get("time_in_call_secs", 0.0)
            )
            for turn in simulated_conversation
            if turn.get("message") is not None  # Skip turns with None messages
        ]
        
        print(f"✅ Call completed - {len(conversation_turns)} turns")
        
        return CallResponse(
            success=True,
            conversation=conversation_turns,
            analysis=analysis,
            call_successful=analysis.get("call_successful", "unknown"),
            transcript_summary=analysis.get("transcript_summary", "")
        )
        
    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="ElevenLabs API request timed out"
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Network error: {str(e)}"
        )
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.get("/api/agent-info")
async def get_agent_info():
    """Get information about the configured ElevenLabs agent"""
    
    if not ELEVENLABS_API_KEY or not ELEVENLABS_AGENT_ID:
        raise HTTPException(
            status_code=500,
            detail="ElevenLabs credentials not configured"
        )
    
    return {
        "agent_id": ELEVENLABS_AGENT_ID,
        "configured": True,
        "status": "ready"
    }


@app.get("/api/chi/product/{product_id}")
async def get_chi_by_product(product_id: int):
    """
    Get CHI (Customer Happiness Index) data for a specific product from Supabase
    
    Product IDs:
    1 - Mobile Hotspot
    2 - Magenta Max
    3 - Business Unlimited
    """
    
    if not supabase_client:
        raise HTTPException(
            status_code=503,
            detail="Supabase not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to .env"
        )
    
    try:
        # Map product_id to product_name
        product_map = {
            1: "Mobile Hotspot",
            2: "Magenta Max",
            3: "Business Unlimited"
        }
        
        product_name = product_map.get(product_id)
        if not product_name:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid product_id {product_id}. Must be 1, 2, or 3."
            )
        
        # Fetch from Supabase feedback table
        response = supabase_client.table('feedback').select('*').eq('product_name', product_name).execute()
        
        if not response.data:
            return {
                "success": False,
                "product_id": product_id,
                "product_name": product_name,
                "message": f"No data found for {product_name}",
                "rows": []
            }
        
        rows = response.data
        
        # Print to terminal
        print(f"\n{'='*80}")
        print(f"📊 Product ID: {product_id}")
        print(f"📦 Product Name: {product_name}")
        print(f"📝 Total Rows: {len(rows)}")
        print(f"{'='*80}\n")
        
        for idx, row in enumerate(rows, 1):
            print(f"Row {idx}:")
            print(f"  Location: {row.get('location', 'N/A')}")
            print(f"  Transcript: {row.get('transcript', 'N/A')}")
            print(f"  Timestamp: {row.get('timestamp', 'N/A')}")
            print("-" * 80)
        
        return {
            "success": True,
            "product_id": product_id,
            "product_name": product_name,
            "total_rows": len(rows),
            "rows": rows
        }
        
    except Exception as e:
        print(f"❌ Error reading CHI data from Supabase: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error reading CHI data: {str(e)}"
        )


@app.get("/api/chi/happiness")
async def get_all_product_happiness():
    """
    Calculate and return happiness index for all products from Supabase
    Returns happiness as percentage (0-100) based on sentiment analysis
    """
    
    if not supabase_client:
        raise HTTPException(
            status_code=503,
            detail="Supabase not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to .env"
        )
    
    try:
        # Fetch all feedback from Supabase
        response = supabase_client.table('feedback').select('*').execute()
        
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="No feedback data found in Supabase"
            )
        
        # Convert to DataFrame for easier processing
        df = pd.DataFrame(response.data)
        
        # Simple sentiment analysis based on keywords
        positive_keywords = ['great', 'excellent', 'perfect', 'rock-solid', 'exceeded', 
                           'saving', 'fantastic', 'helpful', 'reliable', 'breeze']
        negative_keywords = ['broken', 'error', 'stuck', 'forced', 'confused', 'nightmare',
                           'jacked', 'invisible', 'blank', 'nothing']
        
        def calculate_sentiment(transcript):
            """Calculate sentiment score from -1 (negative) to 1 (positive)"""
            transcript_lower = str(transcript).lower()
            positive_count = sum(1 for keyword in positive_keywords if keyword in transcript_lower)
            negative_count = sum(1 for keyword in negative_keywords if keyword in transcript_lower)
            
            # Normalize to -1 to 1 range
            total = positive_count + negative_count
            if total == 0:
                return 0  # Neutral
            return (positive_count - negative_count) / max(total, 1)
        
        # Calculate sentiment for each row
        df['sentiment'] = df['transcript'].apply(calculate_sentiment)
        
        # Map product names to IDs
        product_id_map = {
            "Mobile Hotspot": 1,
            "Magenta Max": 2,
            "Business Unlimited": 3
        }
        
        # Calculate happiness index per product (convert from -1/1 to 0-100 percentage)
        product_happiness = {}
        
        for product_name in df['product_name'].unique():
            product_df = df[df['product_name'] == product_name]
            product_id = product_id_map.get(product_name, 0)
            
            # Average sentiment score
            avg_sentiment = product_df['sentiment'].mean()
            
            # Convert from -1/1 scale to 0/100 percentage
            # -1 = 0%, 0 = 50%, 1 = 100%
            happiness_percentage = int(((avg_sentiment + 1) / 2) * 100)
            
            product_happiness[product_id] = {
                "product_id": product_id,
                "product_name": product_name,
                "happiness_percentage": happiness_percentage,
                "avg_sentiment": round(avg_sentiment, 3),
                "total_transcripts": len(product_df)
            }
        
        print(f"\n🎯 Product Happiness Index Calculated:")
        for product_id, data in product_happiness.items():
            print(f"  {data['product_name']}: {data['happiness_percentage']}%")
        
        return {
            "success": True,
            "products": product_happiness
        }
        
    except Exception as e:
        print(f"❌ Error calculating happiness: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating happiness: {str(e)}"
        )


@app.get("/api/chi/quarterly/{product_id}")
async def get_quarterly_chi(product_id: int):
    """
    Get quarterly CHI (Customer Happiness Index) for a product from real df_chi data
    Returns Q1, Q2, Q3, Q4 happiness scores
    """
    
    product_map = {
        1: "Mobile Hotspot",
        2: "Magenta Max", 
        3: "Business Unlimited"
    }
    
    product_name = product_map.get(product_id)
    if not product_name:
        return {"success": False, "error": "Invalid product_id"}
    
    # Get real CHI data
    df_chi = get_chi_data()
    
    if df_chi is None:
        # Fallback to mock data if CHI calculation fails - DIFFERENT DATA PER PRODUCT
        print(f"⚠️  Using fallback mock data for product {product_id}")
        
        # Product-specific mock data
        mock_data_by_product = {
            1: [  # Mobile Hotspot - showing decline
                {"quarter": "Q1", "score": 55},
                {"quarter": "Q2", "score": 48},
                {"quarter": "Q3", "score": 35},
                {"quarter": "Q4", "score": 28}
            ],
            2: [  # Magenta Max - showing recovery
                {"quarter": "Q1", "score": 30},
                {"quarter": "Q2", "score": 42},
                {"quarter": "Q3", "score": 58},
                {"quarter": "Q4", "score": 65}
            ],
            3: [  # Business Unlimited - showing strong performance
                {"quarter": "Q1", "score": 65},
                {"quarter": "Q2", "score": 72},
                {"quarter": "Q3", "score": 78},
                {"quarter": "Q4", "score": 85}
            ]
        }
        
        mock_data = mock_data_by_product.get(product_id, [
            {"quarter": "Q1", "score": 50},
            {"quarter": "Q2", "score": 55},
            {"quarter": "Q3", "score": 60},
            {"quarter": "Q4", "score": 65}
        ])
        
        return {"success": True, "product_id": product_id, "product_name": product_name, "quarterly_data": mock_data}
    
    try:
        # Filter for this product
        product_data = df_chi[df_chi['product_name'] == product_name]
        
        if product_data.empty:
            print(f"⚠️ No CHI data found for {product_name}")
            return {"success": False, "error": f"No CHI data for {product_name}"}
        
        # Convert to frontend format (scale to 0-100 percentage)
        quarterly_data = []
        for _, row in product_data.iterrows():
            # ConsumerHappinessIndex is already on a 1-10 scale, convert to 0-100
            score = int((row['ConsumerHappinessIndex'] / 10) * 100)
            quarterly_data.append({
                "quarter": row['time_period'],
                "score": score
            })
        
        print(f"\n📊 Quarterly CHI for {product_name} (from df_chi):")
        for q in quarterly_data:
            print(f"  {q['quarter']}: {q['score']}%")
        
        return {
            "success": True,
            "product_id": product_id,
            "product_name": product_name,
            "quarterly_data": quarterly_data
        }
        
    except Exception as e:
        print(f"❌ Error processing CHI data: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error processing CHI data: {str(e)}"
        )


@app.get("/api/test-gemini")
async def test_gemini():
    """Test Gemini API connection"""
    if not genai_client:
        raise HTTPException(status_code=500, detail="Gemini not configured")
    
    try:
        response = genai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents="Say hello in JSON format with a 'message' field"
        )
        return {"success": True, "response": response.text}
    except Exception as e:
        return {"success": False, "error": str(e)}


class EmailGenerationRequest(BaseModel):
    product_name: str
    product_id: int
    transcripts: List[str]
    email_type: str  # "tech_ticket" or "loyalty_promotion"


@app.post("/api/generate-emails")
async def generate_emails(request: EmailGenerationRequest):
    """
    Generate both tech support ticket and loyalty promotion emails using Gemini
    Returns both emails in a single response for efficiency
    """
    
    if not genai_client:
        raise HTTPException(status_code=500, detail="Gemini not configured")
    
    try:
        # Prepare transcript summary
        transcript_summary = "\n".join([f"- {t}" for t in request.transcripts[:15]])  # Limit to 15 transcripts
        
        # Create comprehensive prompt for both email types
        prompt = f"""You are a T-Mobile customer service AI assistant. Generate TWO professional emails based on customer feedback for the product "{request.product_name}".

**Customer Feedback Transcripts:**
{transcript_summary}

Generate the following TWO emails in JSON format:

1. **Tech Support Ticket Email** - To be sent to: chithra.sathish.akilan@gmail.com
   - Summarize the technical issues from the transcripts
   - Prioritize critical issues
   - Suggest immediate actions needed
   - Professional tone for internal technical team

2. **Loyalty Promotion Email** - To be sent to: customers@gmail.com
   - Thank customers for being loyal T-Mobile users
   - Mention their current product ({request.product_name})
   - Research and mention 2-3 current hot T-Mobile services/promotions (use your knowledge of T-Mobile offerings)
   - Personalized recommendations based on their current usage
   - Friendly, promotional tone

Respond in EXACTLY this JSON format:
{{
  "tech_ticket": {{
    "subject": "Tech Support Ticket Subject Line",
    "body": "Full email body with proper formatting",
    "priority": "high" or "medium" or "low",
    "issues_summary": ["Issue 1", "Issue 2", "Issue 3"]
  }},
  "loyalty_promotion": {{
    "subject": "Promotion Email Subject Line",
    "body": "Full email body with proper formatting",
    "services_mentioned": ["Service 1", "Service 2", "Service 3"],
    "call_to_action": "Clear CTA text"
  }}
}}

Make both emails professional, concise, and actionable. The tech ticket should be 150-200 words, the promotion should be 200-250 words."""

        print(f"\n📧 Generating emails for {request.product_name}...")
        
        # Call Gemini API
        response = genai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        # Parse response
        response_text = response.text.strip()
        
        # Clean response (remove markdown code blocks if present)
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()
        elif response_text.startswith("```"):
            response_text = response_text.replace("```", "").strip()
        
        emails = json.loads(response_text)
        
        print(f"✅ Emails generated successfully")
        print(f"   Tech Ticket: {emails['tech_ticket']['subject']}")
        print(f"   Promotion: {emails['loyalty_promotion']['subject']}")
        
        return {
            "success": True,
            "product_name": request.product_name,
            "tech_ticket": emails['tech_ticket'],
            "loyalty_promotion": emails['loyalty_promotion'],
            "recipient_tech": "chithra.sathish.akilan@gmail.com",
            "recipient_promotion": "customers@gmail.com"
        }
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON Parse Error: {e}")
        print(f"Raw response: {response_text}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse Gemini response: {str(e)}"
        )
    except Exception as e:
        print(f"❌ Error generating emails: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating emails: {str(e)}"
        )


@app.get("/api/chi/recommendation/{product_id}")
async def get_product_recommendation(product_id: int):
    """
    Use Gemini AI to analyze product CHI data and transcripts from Supabase
    Returns one of three recommendations: Engage, Fix, or Reward
    Along with 3 actionable bullet points
    """
    
    if not genai_client:
        raise HTTPException(
            status_code=500,
            detail="Google API key not configured"
        )
    
    if not supabase_client:
        raise HTTPException(
            status_code=503,
            detail="Supabase not configured"
        )
    
    try:
        # Map product_id to product_name
        product_map = {
            1: "Mobile Hotspot",
            2: "Magenta Max",
            3: "Business Unlimited"
        }
        
        product_name = product_map.get(product_id)
        if not product_name:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid product_id {product_id}"
            )
        
        # Fetch data from Supabase
        response = supabase_client.table('feedback').select('*').eq('product_name', product_name).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for {product_name}"
            )
        
        # Convert to DataFrame
        df = pd.DataFrame(response.data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])  # Parse timestamps
        
        # Calculate CHI score using same sentiment analysis
        positive_keywords = ['great', 'excellent', 'perfect', 'rock-solid', 'exceeded', 
                           'saving', 'fantastic', 'helpful', 'reliable', 'breeze']
        negative_keywords = ['broken', 'error', 'stuck', 'forced', 'confused', 'nightmare',
                           'jacked', 'invisible', 'blank', 'nothing']
        
        def calculate_sentiment(transcript):
            transcript_lower = str(transcript).lower()
            positive_count = sum(1 for keyword in positive_keywords if keyword in transcript_lower)
            negative_count = sum(1 for keyword in negative_keywords if keyword in transcript_lower)
            total = positive_count + negative_count
            if total == 0:
                return 0
            return (positive_count - negative_count) / max(total, 1)
        
        df['sentiment'] = df['transcript'].apply(calculate_sentiment)
        avg_sentiment = df['sentiment'].mean()
        chi_percentage = int(((avg_sentiment + 1) / 2) * 100)
        
        # Prepare transcript samples for Gemini (limit to 10 most recent)
        recent_transcripts = df.nlargest(10, 'timestamp')['transcript'].tolist()
        transcript_summary = "\n".join([f"- {t}" for t in recent_transcripts])
        
        # Create Gemini prompt
        prompt = f"""You are analyzing customer feedback for a telecom product called "{product_name}".

Product CHI (Customer Happiness Index): {chi_percentage}% 
Total Transcripts Analyzed: {len(df)}

Sample Customer Transcripts:
{transcript_summary}

Based on this data, you need to recommend ONE of these three actions:
1. **Fix** - If there are critical technical issues or CHI is very low (< 40%)
2. **Engage** - If customer sentiment is mixed or moderate (40-70%)
3. **Reward** - If customers are highly satisfied and CHI is high (> 70%)

Respond in EXACTLY this JSON format:
{{
  "action": "Fix" or "Engage" or "Reward",
  "header": "A descriptive 3-5 word header",
  "color": "red" or "purple" or "green" (red for Fix, purple for Engage, green for Reward),
  "points": [
    "First actionable bullet point based on transcript analysis",
    "Second actionable bullet point based on transcript analysis", 
    "Third actionable bullet point based on transcript analysis"
  ]
}}

Make the bullet points specific to the actual issues/feedback found in the transcripts. Be concise and actionable."""

        print(f"\n🤖 Asking Gemini for recommendation on {product_name}...")
        
        # Call Gemini API with new client
        response = genai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        # Parse the response
        response_text = response.text.strip()
        
        # Clean response (remove markdown code blocks if present)
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()
        elif response_text.startswith("```"):
            response_text = response_text.replace("```", "").strip()
        
        recommendation = json.loads(response_text)
        
        print(f"✅ Gemini Recommendation: {recommendation['action']}")
        print(f"   Header: {recommendation['header']}")
        
        return {
            "success": True,
            "product_id": product_id,
            "product_name": product_name,
            "chi_percentage": chi_percentage,
            "total_transcripts": len(df),
            "recommendation": recommendation
        }
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON Parse Error: {e}")
        print(f"Raw response: {response_text}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse Gemini response: {str(e)}"
        )
    except Exception as e:
        print(f"❌ Error generating recommendation: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendation: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FastAPI server...")
    print(f"📡 Agent ID: {ELEVENLABS_AGENT_ID}")
    print(f"🌐 Server will be available at: http://localhost:8000")
    print(f"📚 API Docs at: http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
