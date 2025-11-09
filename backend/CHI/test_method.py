import pandas as pd
import numpy as np
import datetime
import requests
import google.generativeai as genai
import os
import time
import json # We need this to parse the batch response
from supabase import create_client, Client
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from backend .env
backend_env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=backend_env_path)

# --- NEW: Supabase Data Loading Function ---

def load_feedback_from_supabase() -> pd.DataFrame:
    """Load feedback data from Supabase instead of CSV"""
    
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")  # Use service key for backend
    
    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in environment.")
        return None
    
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Fetch all feedback records
        response = supabase.table('feedback').select('*').execute()
        
        if not response.data:
            print("No feedback data found in Supabase.")
            return None
            
        # Convert to DataFrame
        df = pd.DataFrame(response.data)
        
        print(f"✅ Loaded {len(df)} feedback records from Supabase")
        
        # Ensure required columns exist
        required_cols = ['transcript', 'product_name', 'timestamp', 'location']
        missing = [col for col in required_cols if col not in df.columns]
        if missing:
            print(f"Warning: Missing columns in Supabase data: {missing}")
            
        return df
        
    except Exception as e:
        print(f"Error loading from Supabase: {e}")
        return None


# --- NEW: Gemini Batch Processing Function ---

def _get_batch_tonality_scores(transcripts: list, model) -> dict:
    """
    Analyzes a BATCH of transcripts in a single API call.
    Returns a dictionary mapping each transcript to its score.
    """
    
    # Create a numbered list of transcripts for the prompt
    prompt_list = "\n".join(
        [f"{i+1}. \"{transcript}\"" for i, transcript in enumerate(transcripts)]
    )
    
    # This prompt is crucial. It asks for a JSON list in the same order.
    prompt = (
        "Analyze the sentiment of the following customer transcripts. "
        "Respond with ONLY a JSON list of floating-point numbers, "
        "one for each transcript, in the same order. Each number "
        "must be between 1.0 (extremely negative) and 10.0 (extremely positive)."
        f"\n\nTranscripts:\n{prompt_list}"
    )

    scores_map = {}
    try:
        response = model.generate_content(prompt)
        
        # Clean the response text (it sometimes includes "```json" markers)
        cleaned_text = response.text.strip().replace("```json", "").replace("```", "")
        
        # Parse the JSON list
        scores = json.loads(cleaned_text)
        
        if len(scores) == len(transcripts):
            # Map transcripts to their scores
            for i, transcript in enumerate(transcripts):
                scores_map[transcript] = max(1.0, min(10.0, float(scores[i])))
        else:
            # Fallback if the list length doesn't match
            print(f"  Gemini Error: Batch response length mismatch. Defaulting to 5.0.")
            for transcript in transcripts:
                scores_map[transcript] = 5.0
                
    except Exception as e:
        print(f"  Gemini Error (defaulting batch to 5.0): {e}")
        # Fallback if JSON parsing fails or API errors
        for transcript in transcripts:
            scores_map[transcript] = 5.0
            
    return scores_map


# --- Weather API Helper (Unchanged) ---
def _get_weather_disaster_status(row, cache):
    location = row['location']
    date_str = row['timestamp'].strftime('%Y-%m-%d')
    cache_key = (location, date_str)
    
    if cache_key in cache:
        return cache[cache_key]

    api_key = os.environ.get("WEATHER_API_KEY")

    print(f"Cache miss. Calling Weather API for: {location} on {date_str}")
    BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
    query_url = (
        f"{BASE_URL}{location}/{date_str}/{date_str}"
        f"?key={api_key}&unitGroup=us&include=days&elements=windspeedmax,precip,snow"
    )
    is_disaster = False

    try:
        response = requests.get(query_url)
        response.raise_for_status() 
        data = response.json()
        if 'days' in data and len(data['days']) > 0:
            day_data = data['days'][0]
            wind = day_data.get('windspeedmax', 0)
            precip = day_data.get('precip', 0)
            snow = day_data.get('snow', 0)
            if (wind and wind > 74) or (precip and precip > 4) or (snow and snow > 24):
                is_disaster = True
                
    except Exception as e:
        print(f"  Weather API Error: {e}")

    cache[cache_key] = is_disaster
    return is_disaster

# --- Main Function (Updated with Supabase and Batching Logic) ---
def enhance_transcript_dataframe(use_supabase: bool = True, csv_file_path: str = None) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Enhanced version that loads from Supabase by default.
    Set use_supabase=False and provide csv_file_path to use CSV instead.
    """
    
    # 1. --- Configure Gemini API ---
    try:
        genai.configure(api_key=os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"))
        model = genai.GenerativeModel('gemini-2.5-flash')
    except KeyError:
        print("Error: Neither GEMINI_API_KEY nor GOOGLE_API_KEY found in environment.")
        return None, None
    except Exception as e:
        print(f"Error configuring Gemini: {e}")
        return None, None

    # 2. --- Load Data (Supabase or CSV) ---
    if use_supabase:
        print("--- Loading feedback from Supabase ---")
        df = load_feedback_from_supabase()
    else:
        print("--- Loading feedback from CSV (legacy) ---")
        if not csv_file_path:
            print("Error: csv_file_path required when use_supabase=False")
            return None, None
        try:
            df = pd.read_csv(csv_file_path)
        except FileNotFoundError:
            print(f"Error: File not found at {csv_file_path}")
            return None, None
    
    if df is None or df.empty:
        print("Error: No data loaded.")
        return None, None

    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    weather_cache = {}
    gemini_cache = {} # This will be our master lookup

    # 3. --- Add 'national_crisis' Column (Weather API) ---
    print("--- Weather API temporarily disabled - setting all crisis events to False ---")
    # print("--- Checking for national crisis events (Weather API) ---")
    # df['national_crisis'] = df.apply(
    #     _get_weather_disaster_status, axis=1, cache=weather_cache
    # )
    df['national_crisis'] = False
    
    # 4. --- Add 'network_outage' Column (Simulation) ---
    df['network_outage'] = False
    # (Your existing simulation logic is unchanged)
    hotspot_indices = df[df['product_name'] == 'Mobile Hotspot'].index
    hotspot_df = df.loc[hotspot_indices].sort_values('timestamp')
    first_half_indices = hotspot_df.index[:len(hotspot_df)//2]
    second_half_indices = hotspot_df.index[len(hotspot_df)//2:]
    outage_mask_1 = np.random.choice([True, False], size=len(first_half_indices), p=[0.60, 0.40])
    df.loc[first_half_indices, 'network_outage'] = outage_mask_1
    outage_mask_2 = np.random.choice([True, False], size=len(second_half_indices), p=[0.85, 0.15])
    df.loc[second_half_indices, 'network_outage'] = outage_mask_2
    other_indices = df[df['product_name'] != 'Mobile Hotspot'].index
    outage_mask_others = np.random.choice([True, False], size=len(other_indices), p=[0.05, 0.95])
    df.loc[other_indices, 'network_outage'] = outage_mask_others

    # 5. --- NEW: Batch-process tonality scores (Gemini API) ---
    print("--- Analyzing transcript tonality (Gemini API in batches) ---")
    
    # First, get a list of only the unique transcripts to analyze
    unique_transcripts = df['transcript'].unique().tolist()
    
    # Split the unique transcripts into batches of 10 (our rate limit)
    batch_size = 10
    batches = [
        unique_transcripts[i:i + batch_size] 
        for i in range(0, len(unique_transcripts), batch_size)
    ]
    
    print(f"Found {len(unique_transcripts)} unique transcripts. Processing in {len(batches)} batches...")
    
    for i, batch in enumerate(batches):
        print(f"  Processing batch {i+1}/{len(batches)}...")
        # Call the new batch function
        scores_map = _get_batch_tonality_scores(batch, model)
        
        # Update our master cache
        gemini_cache.update(scores_map)
        
        # Wait 6.1s *between batches* to respect the 10/min limit
        if i < len(batches) - 1:
            time.sleep(6.1) 
            
    print("--- Tonality analysis complete ---")
    
    # Map the cached scores back to the main DataFrame
    df['tonality_score'] = df['transcript'].map(gemini_cache)

    # 6. --- Calculate Row-Level 'happiness_score' ---
    outage_penalty = 0.8  
    crisis_penalty = 0.9  
    
    def calculate_row_score(row):
        base_score = row['tonality_score']
        if row['network_outage']:
            base_score *= outage_penalty
        if row['national_crisis']:
            base_score *= crisis_penalty
        return max(1.0, min(10.0, base_score))

    df['happiness_score'] = df.apply(calculate_row_score, axis=1)
    
    # 7. --- Create Time Periods (Quartiles) ---
    df['time_period'] = pd.qcut(df['timestamp'], 4, labels=['Q1', 'Q2', 'Q3', 'Q4'])
    
    # 8. --- Create the Final Aggregated CHI Table ---
    print("Aggregating CHI table...")
    df_chi = df.groupby(['product_name', 'time_period'], observed=True)['happiness_score'].mean()
    df_chi = df_chi.reset_index()
    df_chi = df_chi.rename(columns={'happiness_score': 'ConsumerHappinessIndex'})
    df_chi['ConsumerHappinessIndex'] = df_chi['ConsumerHappinessIndex'].round(2)
    
    print("DataFrame successfully enhanced.")
    
    # 9. --- Return BOTH DataFrames ---
    return df, df_chi


if __name__ == "__main__":
    # Run with Supabase by default
    print("🚀 Running CHI calculation from Supabase...")
    df_enhanced, df_chi = enhance_transcript_dataframe(use_supabase=True)
    
    if df_chi is not None:
        print("\n📊 CHI Results:")
        print(df_chi)
        
        # Optionally save to CSV for caching
        output_path = "chi_results.csv"
        df_chi.to_csv(output_path, index=False)
        print(f"✅ CHI data saved to {output_path}")
    else:
        print("❌ Failed to calculate CHI")