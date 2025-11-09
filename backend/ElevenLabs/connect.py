"""
ElevenLabs Conversational AI Agent Connection
This script connects to an ElevenLabs conversational AI agent using WebSockets.
"""

import asyncio
import os
import json
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from dotenv import load_dotenv

# Try to import audio interface (optional)
try:
    from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface
    # Test if pyaudio is actually available
    import pyaudio
    AUDIO_AVAILABLE = True
except ImportError:
    AUDIO_AVAILABLE = False
    DefaultAudioInterface = None
    print("⚠️  PyAudio not available. Audio features will be disabled.")
    print("   Install with: pip install pyaudio")


# Simple text-only audio interface (no actual audio)
class TextOnlyAudioInterface:
    """A minimal audio interface for text-only conversations"""
    def __init__(self):
        pass
    
    def start(self):
        pass
    
    def stop(self):
        pass
    
    async def get_audio(self):
        # Return None to indicate no audio available
        return None


# Load environment variables
load_dotenv()


class ElevenLabsAgent:
    """Handles connection and interaction with ElevenLabs Conversational AI Agent"""
    
    def __init__(self, api_key=None, agent_id=None):
        """
        Initialize the ElevenLabs agent connection.
        
        Args:
            api_key (str, optional): ElevenLabs API key. Defaults to env variable.
            agent_id (str, optional): Agent ID. Defaults to env variable.
        """
        self.api_key = api_key or os.getenv("ELEVENLABS_API_KEY")
        self.agent_id = agent_id or os.getenv("ELEVENLABS_AGENT_ID")
        
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY is required")
        if not self.agent_id:
            raise ValueError("ELEVENLABS_AGENT_ID is required")
        
        # Initialize ElevenLabs client
        self.client = ElevenLabs(api_key=self.api_key)
        self.conversation = None
        self.is_connected = False
        
    async def connect(self, requires_auth=True, custom_llm_extra_body=None, audio_enabled=None):
        """
        Connect to the ElevenLabs agent.
        
        Args:
            requires_auth (bool): Whether authentication is required
            custom_llm_extra_body (dict): Custom parameters for the LLM
            audio_enabled (bool): Enable audio interface. If None, auto-detect based on pyaudio availability
        """
        # Auto-detect audio availability if not specified
        if audio_enabled is None:
            audio_enabled = AUDIO_AVAILABLE
        
        if audio_enabled and not AUDIO_AVAILABLE:
            print("⚠️  Audio requested but pyaudio not installed. Using text-only mode.")
            audio_enabled = False
        
        try:
            print(f"🔌 Connecting to ElevenLabs agent: {self.agent_id}")
            
            # Prepare conversation config
            conversation_config = {
                "client": self.client,
                "agent_id": self.agent_id,
                "requires_auth": requires_auth,
                "callback_agent_response": self._on_agent_response,
                "callback_agent_response_correction": self._on_agent_response_correction,
                "callback_user_transcript": self._on_user_transcript,
                "callback_latency_measurement": self._on_latency_measurement,
            }
            
            # Add audio interface - use real audio if available, otherwise text-only
            if audio_enabled and AUDIO_AVAILABLE:
                conversation_config["audio_interface"] = DefaultAudioInterface()
                print("🎤 Audio interface enabled")
            else:
                conversation_config["audio_interface"] = TextOnlyAudioInterface()
                print("💬 Text-only mode (no audio)")
            
            # Create conversation with the agent
            self.conversation = Conversation(**conversation_config)
            
            # Add custom LLM parameters if provided
            if custom_llm_extra_body:
                await self.conversation.start_session(
                    custom_llm_extra_body=custom_llm_extra_body
                )
            else:
                await self.conversation.start_session()
            
            self.is_connected = True
            print("✅ Successfully connected to ElevenLabs agent")
            
        except Exception as e:
            print(f"❌ Failed to connect to agent: {e}")
            raise
    
    async def send_message(self, message):
        """
        Send a text message to the agent.
        
        Args:
            message (str): Text message to send
        """
        if not self.is_connected or not self.conversation:
            raise RuntimeError("Not connected to agent. Call connect() first.")
        
        try:
            await self.conversation.send_user_input(message)
            print(f"📤 Sent message: {message}")
        except Exception as e:
            print(f"❌ Error sending message: {e}")
            raise
    
    async def start_listening(self):
        """Start listening for user audio input"""
        if not self.is_connected or not self.conversation:
            raise RuntimeError("Not connected to agent. Call connect() first.")
        
        try:
            print("🎤 Starting audio input...")
            await self.conversation.start_listening()
        except Exception as e:
            print(f"❌ Error starting audio: {e}")
            raise
    
    async def stop_listening(self):
        """Stop listening for user audio input"""
        if self.conversation:
            try:
                await self.conversation.stop_listening()
                print("🔇 Stopped audio input")
            except Exception as e:
                print(f"❌ Error stopping audio: {e}")
    
    async def disconnect(self):
        """Disconnect from the agent"""
        if self.conversation:
            try:
                await self.conversation.end_session()
                self.is_connected = False
                print("👋 Disconnected from agent")
            except Exception as e:
                print(f"❌ Error disconnecting: {e}")
    
    # Callback handlers
    def _on_agent_response(self, response):
        """Called when agent responds"""
        print(f"🤖 Agent: {response}")
    
    def _on_agent_response_correction(self, original, corrected):
        """Called when agent response is corrected"""
        print(f"✏️  Correction: '{original}' → '{corrected}'")
    
    def _on_user_transcript(self, transcript):
        """Called when user speech is transcribed"""
        print(f"👤 User: {transcript}")
    
    def _on_latency_measurement(self, latency_ms):
        """Called with latency measurements"""
        print(f"⏱️  Latency: {latency_ms}ms")


async def main():
    """Example usage of the ElevenLabs agent"""
    
    # Initialize agent
    agent = ElevenLabsAgent()
    
    try:
        # Connect to the agent
        await agent.connect()
        
        # Example: Send a text message
        # await agent.send_message("Hello, how are you?")
        
        # Example: Start audio conversation
        print("\n🎙️  Starting voice conversation...")
        print("Press Ctrl+C to stop\n")
        await agent.start_listening()
        
        # Keep the conversation running
        while agent.is_connected:
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Stopping conversation...")
    except Exception as e:
        print(f"\n❌ Error: {e}")
    finally:
        # Clean up
        await agent.disconnect()


if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main())
