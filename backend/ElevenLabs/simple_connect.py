"""
Simple ElevenLabs Agent WebSocket Connection (No Audio Required)
This version works without pyaudio by using direct WebSocket communication.
"""

import asyncio
import os
import json
import websockets
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class SimpleElevenLabsAgent:
    """Simplified WebSocket-based ElevenLabs agent (no audio required)"""
    
    def __init__(self, api_key=None, agent_id=None):
        """
        Initialize the agent.
        
        Args:
            api_key (str): ElevenLabs API key
            agent_id (str): Agent ID
        """
        self.api_key = api_key or os.getenv("ELEVENLABS_API_KEY")
        self.agent_id = agent_id or os.getenv("ELEVENLABS_AGENT_ID")
        
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY is required")
        if not self.agent_id:
            raise ValueError("ELEVENLABS_AGENT_ID is required")
        
        self.websocket = None
        self.is_connected = False
        
    async def connect(self):
        """Connect to the ElevenLabs agent via WebSocket"""
        try:
            print(f"🔌 Connecting to agent: {self.agent_id}")
            
            # WebSocket URL for ElevenLabs conversational AI
            ws_url = f"wss://api.elevenlabs.io/v1/convai/conversation?agent_id={self.agent_id}"
            
            # Connect with API key header
            self.websocket = await websockets.connect(
                ws_url,
                extra_headers={"xi-api-key": self.api_key}
            )
            
            self.is_connected = True
            print("✅ Connected successfully!")
            
            # Start listening for messages
            asyncio.create_task(self._listen())
            
        except Exception as e:
            print(f"❌ Connection error: {e}")
            raise
    
    async def _listen(self):
        """Listen for messages from the agent"""
        try:
            async for message in self.websocket:
                try:
                    data = json.loads(message)
                    await self._handle_message(data)
                except json.JSONDecodeError:
                    # Binary audio data
                    print(f"📦 Received binary data ({len(message)} bytes)")
        except websockets.exceptions.ConnectionClosed:
            print("🔌 Connection closed")
            self.is_connected = False
    
    async def _handle_message(self, data):
        """Handle incoming JSON messages"""
        msg_type = data.get("type")
        
        if msg_type == "conversation_initiation_metadata":
            print("🎬 Conversation started")
            agent_output_audio_format = data.get("agent_output_audio_format", "pcm_16000")
            print(f"   Audio format: {agent_output_audio_format}")
            
        elif msg_type == "agent_response":
            text = data.get("text", "")
            print(f"🤖 Agent: {text}")
            
        elif msg_type == "user_transcript":
            text = data.get("text", "")
            print(f"👤 User: {text}")
            
        elif msg_type == "interruption":
            print("⚡ Interruption detected")
            
        elif msg_type == "ping":
            # Respond to ping
            await self.websocket.send(json.dumps({"type": "pong"}))
            
        else:
            print(f"📨 Message: {msg_type}")
            print(f"   Data: {data}")
    
    async def send_text(self, text):
        """Send a text message to the agent"""
        if not self.is_connected:
            raise RuntimeError("Not connected")
        
        message = {
            "type": "user_input",
            "text": text
        }
        
        await self.websocket.send(json.dumps(message))
        print(f"📤 Sent: {text}")
    
    async def disconnect(self):
        """Disconnect from the agent"""
        if self.websocket:
            await self.websocket.close()
            self.is_connected = False
            print("👋 Disconnected")


async def main():
    """Example usage"""
    agent = SimpleElevenLabsAgent()
    
    try:
        await agent.connect()
        
        # Wait a moment for initialization
        await asyncio.sleep(2)
        
        # Send a test message
        await agent.send_text("Hello! Can you introduce yourself?")
        
        # Keep listening
        await asyncio.sleep(10)
        
    except KeyboardInterrupt:
        print("\n⏹️  Stopping...")
    finally:
        await agent.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
