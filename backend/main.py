"""
FastAPI Backend for ElevenLabs Agent Integration
Handles phone call simulations and connects frontend to ElevenLabs API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv
from typing import Optional, List, Dict
from pathlib import Path

# Load environment variables from ElevenLabs directory
env_path = Path(__file__).parent / "ElevenLabs" / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(
    title="ElevenLabs Agent API",
    description="Backend API for T-Mobile customer feedback calls",
    version="1.0.0"
)

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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

if not ELEVENLABS_API_KEY or not ELEVENLABS_AGENT_ID:
    print("⚠️  Warning: ElevenLabs credentials not found in .env file")


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


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FastAPI server...")
    print(f"📡 Agent ID: {ELEVENLABS_AGENT_ID}")
    print(f"🌐 Server will be available at: http://localhost:8000")
    print(f"📚 API Docs at: http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
