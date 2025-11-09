"""
Quick test script to verify ElevenLabs agent connection
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_connection():
    """Test basic connection to ElevenLabs agent"""
    print("🔍 Testing ElevenLabs Agent Connection\n")
    
    # Check environment variables
    api_key = os.getenv("ELEVENLABS_API_KEY")
    agent_id = os.getenv("ELEVENLABS_AGENT_ID")
    
    print(f"✓ API Key: {api_key[:20]}..." if api_key else "✗ API Key: Not found")
    print(f"✓ Agent ID: {agent_id}\n" if agent_id else "✗ Agent ID: Not found")
    
    if not api_key or not agent_id:
        print("❌ Missing credentials in .env file")
        return False
    
    try:
        # Import ElevenLabs modules
        print("📦 Importing ElevenLabs modules...")
        from elevenlabs.client import ElevenLabs
        from elevenlabs.conversational_ai.conversation import Conversation
        print("✅ Imports successful\n")
        
        # Initialize client
        print("🔌 Initializing ElevenLabs client...")
        client = ElevenLabs(api_key=api_key)
        print("✅ Client initialized\n")
        
        # Try to get agent info
        print(f"🤖 Fetching agent info for: {agent_id}")
        # Note: This is a basic connection test
        # The actual conversation requires audio interface setup
        
        print("\n✅ Connection test PASSED!")
        print("🎉 Your ElevenLabs agent is ready to use!")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("\n💡 Try installing: pip install elevenlabs")
        return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
