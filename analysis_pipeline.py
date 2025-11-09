import os
import json
import google.generativeai as genai

# --- REAL GEMINI API FUNCTION ---

# Configure the Gemini API key
# In VSCode, you'll want to set this in your environment variables.
# For a hackathon, you can just hard-code it, but be careful!
# genai.configure(api_key=os.environ["GEMINI_API_KEY"]) 
# For testing, you can uncomment and paste your key here:
genai.configure(api_key="AIzaSyBVbawAWnvjZHynHW9qf-o7-cWT2mW6_p8")

# Define the JSON schema we want Gemini to return
# This is the "magic" that gives us structured data.
GEMINI_RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "sentiment_score": {
            "type": "NUMBER",
            "description": "A score from -1.0 (very negative) to 1.0 (very positive) representing the customer's overall sentiment."
        },
        "sentiment_summary": {
            "type": "STRING",
            "description": "A brief, one-sentence summary of the customer's sentiment and main complaint."
        },
        "location": {
            "type": "STRING",
            "description": "The primary city and state (e.g., 'Dallas, TX') mentioned by the customer. If not mentioned, return 'null'."
        },
        "resolution_status": {
            "type": "STRING",
            "description": "The status of the customer's issue. Must be one of: 'resolved', 'unresolved', or 'unclear'."
        },
        "key_topics": {
            "type": "ARRAY",
            "items": {"type": "STRING"},
            "description": "A list of 1-3 key topics or entities mentioned, e.g., '5G service', 'billing issue', 'earthquake'."
        }
    },
    "required": ["sentiment_score", "sentiment_summary", "location", "resolution_status", "key_topics"]
}

def analyze_transcript_with_gemini(transcript: str) -> dict:
    """
    Analyzes a call transcript using the Gemini API to extract sentiment,
    location, and other key details.
    
    Returns a Python dictionary based on the GEMINI_RESPONSE_SCHEMA.
    """
    
    # Set up the model configuration to request a JSON response
    generation_config = genai.GenerationConfig(
        response_mime_type="application/json",
        response_schema=GEMINI_RESPONSE_SCHEMA
    )
    
    model = genai.GenerativeModel(
        "gemini-2.5-flash-preview-09-2025",
        generation_config=generation_config
    )
    
    # This is the prompt that instructs the model.
    prompt = f"""
    You are an expert T-Mobile customer support call analyst.
    Analyze the following customer call transcript.
    Extract the sentiment, location, resolution status, and key topics.
    Return the analysis *only* in the requested JSON format.

    Transcript:
    "{transcript}"
    """
    
    try:
        response = model.generate_content(prompt)
        # The API returns the JSON as a text string, so we parse it
        return json.loads(response.text)
        
    except Exception as e:
        error_message = str(e)
        
        # Check for specific error types
        if "API_KEY_INVALID" in error_message or "API key not valid" in error_message:
            print("=" * 80)
            print("❌ ERROR: INVALID OR EXPIRED API KEY")
            print("=" * 80)
            print("Your Gemini API key is either invalid or has expired.")
            print("Please check your API key at: https://aistudio.google.com/app/apikey")
            print("=" * 80)
        elif "quota" in error_message.lower() or "limit" in error_message.lower():
            print("=" * 80)
            print("❌ ERROR: API QUOTA EXCEEDED")
            print("=" * 80)
            print("You've exceeded your API quota or rate limit.")
            print("Error details:", error_message)
            print("=" * 80)
        elif "permission" in error_message.lower() or "denied" in error_message.lower():
            print("=" * 80)
            print("❌ ERROR: PERMISSION DENIED")
            print("=" * 80)
            print("Your API key doesn't have permission to access this resource.")
            print("Error details:", error_message)
            print("=" * 80)
        else:
            print("=" * 80)
            print("❌ ERROR: GEMINI API CALL FAILED")
            print("=" * 80)
            print(f"Error type: {type(e).__name__}")
            print(f"Error details: {error_message}")
            print("=" * 80)
        
        # Fallback to a default error object
        return {
            "sentiment_score": 0.0,
            "sentiment_summary": f"Error analyzing transcript: {error_message}",
            "location": "null",
            "resolution_status": "unclear",
            "key_topics": ["error", "api_failure"]
        }

# --- MOCK FUNCTION FOR TESTING ---

def mock_analyze_transcript(demo_id: str) -> dict:
    """
    Returns a hard-coded dictionary that *looks* like a real Gemini response.
    This allows you to test your code in VSCode *without* making an API call.
    """
    if demo_id == 'demo_1':
        # "T-Mobile Issue" Demo
        return {
            "sentiment_score": -0.8,
            "sentiment_summary": "Customer is very frustrated with terrible 5G service in Dallas.",
            "location": "Dallas, TX",
            "resolution_status": "unresolved",
            "key_topics": ["5G service", "downtown Dallas", "unacceptable"]
        }
    elif demo_id == 'demo_2':
        # "Crisis Event" Demo
        return {
            "sentiment_score": -0.9,
            "sentiment_summary": "Customer is anxious and texts are not going through due to a possible earthquake.",
            "location": "Dallas, TX",
            "resolution_status": "unresolved",
            "key_topics": ["texts not working", "earthquake", "family"]
        }
    else:
        # "Happy Customer" Demo
        return {
            "sentiment_score": 0.9,
            "sentiment_summary": "Customer is very happy with a rep named David who solved their billing issue.",
            "location": "Miami, FL",
            "resolution_status": "resolved",
            "key_topics": ["David (rep)", "billing issue", "amazing"]
        }