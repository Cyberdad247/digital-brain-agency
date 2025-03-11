# Multi-Provider API Key Management

This document outlines how to use the enhanced API key management system to work with multiple LLM providers including Hugging Face, Ollama, and Gemini.

## Overview

The Digital Brain Agency platform supports multiple LLM providers through a unified API key management system. This system provides:

- Secure storage of API keys
- Key rotation strategies
- Fallback mechanisms
- Model-specific routing
- Rate limit handling

## Supported Providers

The system currently supports the following providers:

- Hugging Face
- OpenAI
- Anthropic
- Cohere
- Azure OpenAI
- Ollama
- Google Gemini
- Custom providers

## Configuration

### Environment Variables

API keys can be configured using environment variables:

```bash
# .env file
HUGGINGFACE_API_KEY="hf_..."
OLLAMA_API_KEY="ollama_..."
GEMINI_API_KEY="..."

# Multiple keys for the same provider
HF_RESEARCH_KEY="hf_..."
HF_PROD_KEY="hf_..."
```

### Programmatic Configuration

```python
from src.lib.llm.api_key_manager import EnhancedAPIKeyManager, LLMProvider

# Create a new key manager instance
key_manager = EnhancedAPIKeyManager()

# Add keys for different providers
key_manager.add_key(LLMProvider.OPENROUTER, "default", os.getenv("OPENROUTER_API_KEY"))
key_manager.add_key(LLMProvider.HUGGINGFACE, "default", os.getenv("HUGGINGFACE_API_KEY"))
key_manager.add_key(LLMProvider.OLLAMA, "default", os.getenv("OLLAMA_API_KEY"))
key_manager.add_key(LLMProvider.GEMINI, "default", os.getenv("GEMINI_API_KEY"))

# Add multiple keys for the same provider (for load balancing)
key_manager.add_key(LLMProvider.HUGGINGFACE, "research", os.getenv("HF_RESEARCH_KEY"))
key_manager.add_key(LLMProvider.HUGGINGFACE, "production", os.getenv("HF_PROD_KEY"))
```

## Key Rotation Strategies

### Round-Robin Load Balancing

```python
# Get the next key in rotation
key_id, api_key = key_manager.get_next_key(LLMProvider.HUGGINGFACE)

# Use the key
if api_key:
    # Make API call with the key
    pass
```

### Model-Specific Routing

```python
# Assign specific models to specific keys
key_manager.assign_model_to_key("meta-llama/Meta-Llama-3-70B-Instruct", LLMProvider.HUGGINGFACE, "production")
key_manager.assign_model_to_key("google/gemma-7b-it", LLMProvider.HUGGINGFACE, "research")

# Get the key for a specific model
key_id, api_key = key_manager.get_key_for_model("meta-llama/Meta-Llama-3-70B-Instruct")
```

### Smart Key Selection

```python
# Get the best key based on usage history and error count
key_id, api_key = key_manager.get_best_key(LLMProvider.GEMINI)
```

## Error Handling and Fallbacks

```python
def query_with_fallback(key_manager, prompt, model_id, provider, max_retries=3):
    for attempt in range(max_retries):
        # Get the best available key
        key_id, api_key = key_manager.get_best_key(provider)
        
        if not api_key:
            print(f"No available API keys for {provider.value}")
            return None
        
        try:
            # Make the API call
            # ...
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
```

## Integration with Ollama

```typescript
// src/config/ollama.config.ts
import axios from 'axios';

export const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
export const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'https://api.ollama.com';

// Initialize the Ollama client
export const createOllamaClient = (apiKey = OLLAMA_API_KEY, baseUrl = OLLAMA_API_URL) => {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
};
```

```python
# Python example
from src.lib.llm.api_key_manager import EnhancedAPIKeyManager, LLMProvider
import requests

key_manager = EnhancedAPIKeyManager()
key_id, api_key = key_manager.get_best_key(LLMProvider.OLLAMA)

if api_key:
    response = requests.post(
        "https://api.ollama.com/api/chat",
        headers={"Authorization": f"Bearer {api_key}"},
        json={"model": "llama3", "messages": [{"role": "user", "content": "Hello"}]}
    )
```

## Integration with Gemini

```typescript
// src/config/gemini.config.ts
import { genai } from '@google/generative-ai';

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Google Generative AI client
export const geminiClient = new genai.GenerativeModel({
  apiKey: GEMINI_API_KEY,
  model: 'gemini-pro',
});
```

```python
# Python example
from src.lib.llm.api_key_manager import EnhancedAPIKeyManager, LLMProvider
import google.generativeai as genai

key_manager = EnhancedAPIKeyManager()
key_id, api_key = key_manager.get_best_key(LLMProvider.GEMINI)

if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Hello")
```

## Security Best Practices

1. **Never hardcode keys** in source files
2. **Rotate keys** regularly
3. Use **key scoping** (create keys with specific permissions)
4. **Monitor usage** through provider dashboards
5. Implement **request throttling**

## Usage Statistics and Monitoring

```python
# Get usage statistics for a key
stats = key_manager.get_key_usage_stats(LLMProvider.HUGGINGFACE, "default")
print(f"Total requests: {stats['total_requests']}")
print(f"Error count: {stats['error_count']}")
print(f"Is rate limited: {stats['is_rate_limited']}")
```

## Complete Example

See the full example in `examples/multi_provider_key_management.py`.