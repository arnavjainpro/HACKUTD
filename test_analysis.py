from analysis_pipeline import analyze_transcript_with_gemini, mock_analyze_transcript
import json

# --- HARD-CODED TRANSCRIPTS FOR TESTING ---
# This is what your "upstream" (ElevenLabs) will provide.
DEMO_TRANSCRIPTS = {
    'demo_1': "Hi, my name is Jane, and my service is terrible in downtown Dallas. I'm paying for 5G, and I can't even load a webpage. This is unacceptable!",
    'demo_2': "Hello? Is T-Mobile down? My texts aren't going through... my family is in the area of the earthquake, and I can't reach them! Is the whole network out?",
    'demo_3': "I just wanted to call and say your rep, David, was amazing. He solved my billing issue in 5 minutes. You guys are the best."
}

def run_mock_test():
    """
    This is how you test in VSCode right now.
    It calls the MOCK function, so it's instant and costs nothing.
    """
    print("--- RUNNING MOCK TEST ---")
    
    demo_id = 'demo_1'
    analysis_data = mock_analyze_transcript(demo_id)
    
    print(f"Successfully analyzed '{demo_id}':")
    print(json.dumps(analysis_data, indent=2))
    
    # You can now test your logic
    if analysis_data["sentiment_score"] < -0.5:
        print("\nTEST PASSED: Sentiment is correctly negative.")
    
    if analysis_data["location"] == "Dallas, TX":
        print("TEST PASSED: Location is correctly extracted.")

def run_real_api_test():
    """
    This test calls the REAL Gemini API.
    Uncomment the final line to run it, but only after you've
    configured your API key in 'analysis_pipeline.py'.
    """
    print("\n--- RUNNING REAL GEMINI API TEST ---")
    
    # Make sure your API key is set in analysis_pipeline.py!
    
    transcript = DEMO_TRANSCRIPTS['demo_3']
    analysis_data = analyze_transcript_with_gemini(transcript)
    
    print(f"Successfully analyzed 'demo_3' with REAL API:")
    print(json.dumps(analysis_data, indent=2))

# --- To test in VSCode ---
if __name__ == "__main__":
    
    # 1. Start by running this test.
    # It proves your logic and data structure work.
    run_mock_test()
    
    # 2. After you set your API key in the other file,
    #    you can uncomment the line below to test the real API.
    run_real_api_test()