"""
Test ElevenLabs Agent using Simulate Conversation API
No audio or pyaudio required - pure text-based simulation!
"""

import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def simulate_conversation(agent_id, api_key, simulated_user_prompt, new_turns_limit=5):
    """
    Simulate a conversation with an ElevenLabs agent using the API.
    
    Args:
        agent_id (str): Your agent ID
        api_key (str): Your ElevenLabs API key
        simulated_user_prompt (str): The prompt describing how the simulated user should behave
        new_turns_limit (int): Maximum number of conversation turns to simulate
    
    Returns:
        dict: The simulation response with conversation and analysis
    """
    
    url = f"https://api.elevenlabs.io/v1/convai/agents/{agent_id}/simulate-conversation"
    
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json"
    }
    
    payload = {
        "simulation_specification": {
            "simulated_user_config": {
                "prompt": {
                    "prompt": simulated_user_prompt
                }
            }
        },
        "new_turns_limit": new_turns_limit
    }
    
    print(f"🚀 Starting simulation with agent: {agent_id}")
    print(f"📝 Simulated user: {simulated_user_prompt}\n")
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"API Error {response.status_code}: {response.text}")


def print_conversation(result):
    """Pretty print the simulated conversation"""
    
    print("=" * 70)
    print("💬 CONVERSATION TRANSCRIPT")
    print("=" * 70)
    print()
    
    simulated_conversation = result.get("simulated_conversation", [])
    
    for i, turn in enumerate(simulated_conversation, 1):
        role = turn.get("role", "unknown")
        message = turn.get("message", "")
        time_in_call = turn.get("time_in_call_secs", 0)
        
        # Format role with emoji
        role_display = "🤖 AGENT" if role == "agent" else "👤 USER"
        
        print(f"Turn {i} ({time_in_call}s) - {role_display}")
        print(f"  {message}")
        print()
    
    # Print analysis
    print("=" * 70)
    print("📊 ANALYSIS")
    print("=" * 70)
    
    analysis = result.get("analysis", {})
    
    call_successful = analysis.get("call_successful", "unknown")
    summary = analysis.get("transcript_summary", "No summary available")
    
    print(f"\n✅ Call Success: {call_successful}")
    print(f"\n📝 Summary:")
    print(f"  {summary}")
    print()


def main():
    """Run a test simulation"""
    
    # Get credentials from environment
    agent_id = os.getenv("ELEVENLABS_AGENT_ID")
    api_key = os.getenv("ELEVENLABS_API_KEY")
    
    if not agent_id or not api_key:
        print("❌ Error: Missing ELEVENLABS_AGENT_ID or ELEVENLABS_API_KEY")
        print("   Please check your .env file")
        return
    
    # Define the simulated user behavior
    simulated_user_prompt = """
    You are a potential customer calling to inquire about services.
    You are polite, ask relevant questions, and want to understand what the agent can help you with.
    Keep your responses natural and conversational.
    """
    
    try:
        # Run the simulation
        result = simulate_conversation(
            agent_id=agent_id,
            api_key=api_key,
            simulated_user_prompt=simulated_user_prompt,
            new_turns_limit=10
        )
        
        # Print the results
        print_conversation(result)
        
        # Save to file for review
        output_file = "simulation_result.json"
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"💾 Full results saved to: {output_file}")
        print("\n✅ Simulation completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
