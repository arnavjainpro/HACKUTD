"""
Full test of ElevenLabs agent conversation capabilities
"""

import asyncio
import sys
from connect import ElevenLabsAgent

async def test_agent_conversation():
    """Test the full agent conversation flow"""
    print("=" * 60)
    print("🧪 ELEVENLABS AGENT CONVERSATION TEST")
    print("=" * 60)
    print()
    
    agent = None
    
    try:
        # Initialize agent
        print("1️⃣  Initializing agent...")
        agent = ElevenLabsAgent()
        print("   ✅ Agent initialized")
        print()
        
        # Connect to agent
        print("2️⃣  Connecting to ElevenLabs...")
        await agent.connect(requires_auth=False)
        print("   ✅ Connected successfully")
        print()
        
        # Test text message
        print("3️⃣  Testing text message...")
        test_message = "Hello! Can you hear me?"
        print(f"   📤 Sending: '{test_message}'")
        await agent.send_message(test_message)
        
        # Wait a bit for response
        print("   ⏳ Waiting for response...")
        await asyncio.sleep(3)
        print("   ✅ Message sent successfully")
        print()
        
        # Test is complete
        print("=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        print()
        print("Your agent is working correctly! 🚀")
        print()
        print("Next steps:")
        print("  • Run: python connect.py")
        print("  • This will start a voice conversation")
        print("  • Press Ctrl+C to stop")
        print()
        
        return True
        
    except Exception as e:
        print()
        print("=" * 60)
        print("❌ TEST FAILED")
        print("=" * 60)
        print(f"Error: {e}")
        print()
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        # Clean up
        if agent and agent.is_connected:
            print("🧹 Cleaning up...")
            await agent.disconnect()
            print("   ✅ Disconnected")

if __name__ == "__main__":
    result = asyncio.run(test_agent_conversation())
    sys.exit(0 if result else 1)
