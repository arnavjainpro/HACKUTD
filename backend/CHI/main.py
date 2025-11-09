import pandas as pd
import os
from dotenv import load_dotenv  # <-- Import this

# --- Load environment variables from .env file ---
# This MUST be at the top, before other imports
load_dotenv()

# Now we can import our function
from test_method import enhance_transcript_dataframe

def run_test():
    """
    Main function to run the test.
    """
    print("--- 🚀 Starting DataFrame Enhancement Test ---")

    # --- API Key Checks (Simplified) ---
    # We just check if the environment variables are loaded
    if "GOOGLE_API_KEY" not in os.environ or "WEATHER_API_KEY" not in os.environ:
        print("--- ❌ Test Failed ---")
        print("Could not find API keys. Make sure your .env file exists and is correct.")
        return

    # 1. Define the path to your original CSV
    csv_filename = 'product_transcripts.csv'
    
    print(f"Loading and enhancing '{csv_filename}'...")
    
    # 2. Call the function (no longer needs API key argument)
    df_main, df_chi = enhance_transcript_dataframe(csv_filename)
    
    # 3. Check the result and print verification
    if df_main is not None and df_chi is not None:
        print("\n--- ✅ Test Verification Passed ---")
        
        print("\n--- Head of Main Enhanced DataFrame ---")
        print(df_main.head())
        
        print(f"\n--- 🌟 Final Consumer Happiness Index (CHI) Table 🌟 ---")
        print(df_chi.to_string())
    
    else:
        print("\n--- ❌ Test Failed ---")
        print(f"The function returned 'None'. Please check errors above.")

if __name__ == "__main__":
    run_test()