import os
from typing import Dict, Any, Optional

# Add the project root to the path so we can import our modules
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.lib.llm.api_key_manager import EnhancedAPIKeyManager, LLMProvider
from groq import Groq

def setup_groq_client(key_manager: EnhancedAPIKeyManager) -> Optional[Groq]:
    """Initialize Groq client with API key from our key manager"""
    # Get API key for Groq
    api_key = key_manager.get_key(LLMProvider.GROQ)
    if not api_key:
        print("No API key found for Groq")
        return None
    
    return Groq(api_key=api_key)

def query_groq_model(client: Groq, prompt: str, model: str = "llama-3.3-70b-versatile") -> Optional[str]:
    """Send a query to Groq model and return the response"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=model
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error querying Groq model: {str(e)}")
        return None

def main():
    # Initialize API key manager
    key_manager = EnhancedAPIKeyManager()
    
    # Add Groq API key (in production, use environment variables)
    key_manager.add_key(LLMProvider.GROQ, "default", os.getenv("GROQ_API_KEY", ""))
    
    # Initialize Groq client
    client = setup_groq_client(key_manager)
    if not client:
        return
    
    # Example prompt
    prompt = "Explain the importance of fast language models"
    
    # Query the model
    response = query_groq_model(client, prompt)
    if response:
        print("Groq Response:")
        print(response)

if __name__ == "__main__":
    main()