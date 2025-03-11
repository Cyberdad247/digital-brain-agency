import os
import sys
import time
from typing import Dict, Any, Optional

# Add the project root to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.lib.llm.api_key_manager import EnhancedAPIKeyManager, LLMProvider


def setup_key_manager() -> EnhancedAPIKeyManager:
    """Initialize and configure the API key manager"""
    # Create a new key manager instance
    key_manager = EnhancedAPIKeyManager()
    
    # Add keys for different providers
    # In production, these would come from environment variables or a secure vault
    key_manager.add_key(LLMProvider.HUGGINGFACE, "default", os.getenv("HF_API_KEY", "hf_dummy_key"))
    key_manager.add_key(LLMProvider.OLLAMA, "default", os.getenv("OLLAMA_API_KEY", "ollama_dummy_key"))
    key_manager.add_key(LLMProvider.GEMINI, "default", os.getenv("GEMINI_API_KEY", "gemini_dummy_key"))
    
    # Add multiple keys for the same provider (for load balancing)
    key_manager.add_key(LLMProvider.HUGGINGFACE, "research", os.getenv("HF_RESEARCH_KEY", "hf_research_dummy_key"))
    key_manager.add_key(LLMProvider.HUGGINGFACE, "production", os.getenv("HF_PROD_KEY", "hf_prod_dummy_key"))
    
    # Assign specific models to specific keys
    key_manager.assign_model_to_key("meta-llama/Meta-Llama-3-70B-Instruct", LLMProvider.HUGGINGFACE, "production")
    key_manager.assign_model_to_key("google/gemma-7b-it", LLMProvider.HUGGINGFACE, "research")
    
    return key_manager


def query_with_fallback(key_manager: EnhancedAPIKeyManager, prompt: str, model_id: str, 
                       provider: LLMProvider, max_retries: int = 3) -> Optional[str]:
    """Query an LLM with automatic fallback to other keys if one fails"""
    for attempt in range(max_retries):
        # Get the best available key based on usage history and error count
        key_id, api_key = key_manager.get_best_key(provider)
        
        if not api_key:
            print(f"No available API keys for {provider.value}")
            return None
        
        try:
            print(f"Attempt {attempt+1} using key {key_id} (last 4 chars: ...{api_key[-4:]})")
            
            # This is where you would make the actual API call
            # For demonstration purposes, we'll simulate success/failure
            if attempt < max_retries - 1 and key_id == "default":
                # Simulate an error for demonstration purposes
                raise Exception("Simulated API error")
            
            # Simulate successful response
            response = f"Response from {provider.value} using key {key_id} for prompt: {prompt[:20]}..."
            return response
            
        except Exception as e:
            print(f"Error with key {key_id}: {str(e)}")
            # Mark this key as having an error
            key_manager.mark_key_error(provider, key_id)
            
            # If it's a rate limit error, mark it as such with a retry time
            if "rate limit" in str(e).lower():
                key_manager.mark_key_error(provider, key_id, is_rate_limit=True, retry_after=60)
    
    print("All API keys exhausted")
    return None


def model_specific_routing(key_manager: EnhancedAPIKeyManager, prompt: str, model_id: str) -> Optional[str]:
    """Route requests to specific keys based on the model being used"""
    # Get the key specifically assigned to this model
    key_id, api_key = key_manager.get_key_for_model(model_id)
    
    if not key_id or not api_key:
        print(f"No specific key assigned for model {model_id}, using round-robin")
        # Fall back to the default provider for this model type
        if "llama" in model_id.lower():
            return query_with_fallback(key_manager, prompt, model_id, LLMProvider.HUGGINGFACE)
        elif "gemma" in model_id.lower() or "gemini" in model_id.lower():
            return query_with_fallback(key_manager, prompt, model_id, LLMProvider.GEMINI)
        else:
            return query_with_fallback(key_manager, prompt, model_id, LLMProvider.OLLAMA)
    
    try:
        print(f"Using dedicated key {key_id} for model {model_id}")
        # This is where you would make the actual API call with the specific key
        response = f"Response using dedicated key for model {model_id}: {prompt[:20]}..."
        return response
    except Exception as e:
        print(f"Error with dedicated key for model {model_id}: {str(e)}")
        # Fall back to other keys
        if "llama" in model_id.lower():
            return query_with_fallback(key_manager, prompt, model_id, LLMProvider.HUGGINGFACE)
        elif "gemma" in model_id.lower():
            return query_with_fallback(key_manager, prompt, model_id, LLMProvider.GEMINI)
        else:
            return query_with_fallback(key_manager, prompt, model_id, LLMProvider.OLLAMA)


def demonstrate_key_rotation():
    """Demonstrate key rotation and fallback strategies"""
    key_manager = setup_key_manager()
    
    print("\n=== Available Providers ===")
    providers = key_manager.list_providers()
    for provider in providers:
        keys = key_manager.list_keys_for_provider(provider)
        print(f"{provider}: {len(keys)} keys - {', '.join(keys)}")
    
    print("\n=== Round-Robin Key Rotation ===")
    prompt = "Explain the concept of API key rotation in a paragraph."
    
    # Demonstrate round-robin rotation
    for i in range(5):
        key_id, api_key = key_manager.get_next_key(LLMProvider.HUGGINGFACE)
        print(f"Request {i+1} using key: {key_id}")
    
    print("\n=== Fallback Strategy ===")
    response = query_with_fallback(key_manager, prompt, "generic-model", LLMProvider.HUGGINGFACE)
    print(f"Final response: {response}")
    
    print("\n=== Model-Specific Routing ===")
    models = ["meta-llama/Meta-Llama-3-70B-Instruct", "google/gemma-7b-it", "mistralai/Mistral-7B-Instruct-v0.2"]
    
    for model in models:
        print(f"\nQuerying model: {model}")
        response = model_specific_routing(key_manager, prompt, model)
        print(f"Response: {response}")
    
    print("\n=== Key Usage Statistics ===")
    for provider in providers:
        for key_id in key_manager.list_keys_for_provider(provider):
            stats = key_manager.get_key_usage_stats(provider, key_id)
            print(f"{provider} - {key_id}: {stats['total_requests']} requests, {stats['error_count']} errors")


if __name__ == "__main__":
    demonstrate_key_rotation()