# ElevenLabs Agent Connection

This directory contains the code to connect to an ElevenLabs Conversational AI agent.

## Setup

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your credentials:

   - `ELEVENLABS_API_KEY`: Your ElevenLabs API key
   - `ELEVENLABS_AGENT_ID`: Your agent ID

3. **Run the agent:**
   ```bash
   python connect.py
   ```

## Usage

### Basic Text Conversation

```python
from connect import ElevenLabsAgent
import asyncio

async def chat():
    agent = ElevenLabsAgent()
    await agent.connect()
    await agent.send_message("Hello!")
    await agent.disconnect()

asyncio.run(chat())
```

### Voice Conversation

```python
from connect import ElevenLabsAgent
import asyncio

async def voice_chat():
    agent = ElevenLabsAgent()
    await agent.connect()
    await agent.start_listening()
    # Conversation runs until you stop it
    await asyncio.sleep(60)  # 60 seconds
    await agent.disconnect()

asyncio.run(voice_chat())
```

### With Custom Parameters

```python
agent = ElevenLabsAgent(
    api_key="your_api_key",
    agent_id="your_agent_id"
)

await agent.connect(
    requires_auth=True,
    custom_llm_extra_body={
        "temperature": 0.7,
        "max_tokens": 500
    }
)
```

## Features

- ✅ Async/await support
- ✅ Text and voice input
- ✅ Real-time transcription
- ✅ Latency monitoring
- ✅ Error handling
- ✅ Clean connection management

## API Key Setup

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
2. Create or select your conversational AI agent
3. Copy the Agent ID
4. Get your API key from Settings → API Keys

## Troubleshooting

**Import errors:**

```bash
pip install --upgrade elevenlabs
```

**Audio issues:**

```bash
# macOS
brew install portaudio
pip install pyaudio

# Linux
sudo apt-get install portaudio19-dev
pip install pyaudio
```

**Connection errors:**

- Verify your API key is correct
- Check your agent ID
- Ensure you have internet connectivity
