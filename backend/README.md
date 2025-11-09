# FastAPI Backend for ElevenLabs Integration

This backend server provides the API endpoint to connect the frontend with ElevenLabs Conversational AI agents.

## Features

- **FastAPI** server with automatic API documentation
- **ElevenLabs Agent Integration** using simulate_conversation API
- **CORS enabled** for frontend communication
- **Real-time conversation simulation** with AI agents

## Setup

### 1. Install Dependencies

```bash
conda activate hackUTDEnv
pip install -r requirements.txt
```

Or install individually:

```bash
pip install fastapi 'uvicorn[standard]' pydantic requests python-dotenv elevenlabs
```

### 2. Configure Environment Variables

Make sure your `ElevenLabs/.env` file contains:

```env
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_AGENT_ID=your_agent_id_here
```

### 3. Start the Server

```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Health Check

```http
GET /
GET /health
```

Returns server status and configuration info.

### Initiate Call

```http
POST /api/call
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_phone": "+1-555-0100",
  "transcript": "The app is confusing to use",
  "product": "T-Mobile App"
}
```

**Response:**

```json
{
  "success": true,
  "conversation": [
    {
      "role": "agent",
      "message": "Hello! Thank you for contacting T-Mobile...",
      "time_in_call_secs": 0.5
    },
    {
      "role": "user",
      "message": "Hi, yes I wanted to follow up about my feedback...",
      "time_in_call_secs": 2.1
    }
  ],
  "analysis": {
    "call_successful": "success",
    "transcript_summary": "Customer discussed app usability issues..."
  },
  "call_successful": "success",
  "transcript_summary": "Customer discussed app usability issues..."
}
```

### Get Agent Info

```http
GET /api/agent-info
```

Returns configured ElevenLabs agent information.

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Architecture

```
Frontend (Next.js)
    ↓
/api/feedback-call (Next.js API route)
    ↓
FastAPI Backend (localhost:8000)
    ↓
ElevenLabs API (simulate_conversation)
    ↓
Returns conversation transcript
    ↓
Gemini AI (generates strategy memo)
    ↓
Returns to frontend
```

## Development

The server runs with hot-reload enabled, so any changes to `main.py` will automatically restart the server.

## Troubleshooting

### "ElevenLabs credentials not found"

- Check that `ElevenLabs/.env` exists and contains valid credentials
- Verify the path in `main.py` points to the correct `.env` file

### "CORS error"

- Ensure the frontend URL (`http://localhost:3000`) is in the `allow_origins` list
- Check that the frontend is making requests to `http://localhost:8000`

### "Connection refused"

- Make sure the FastAPI server is running on port 8000
- Check that no other service is using port 8000

## Testing

Test the endpoint directly:

```bash
curl -X POST http://localhost:8000/api/call \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test Customer",
    "customer_phone": "+1-555-0100",
    "transcript": "The app is confusing"
  }'
```
