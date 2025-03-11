from typing import Dict, List, Optional, Any, Union, Tuple
import json
import os
import time
from enum import Enum
import logging
from itertools import cycle

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMProvider(Enum):
    """Supported LLM providers"""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    HUGGINGFACE = "huggingface"
    COHERE = "cohere"
    AZURE = "azure"
    LOCAL = "local"
    OLLAMA = "ollama"
    GEMINI = "gemini"
    GROQ = "groq"
    CUSTOM = "custom"


class KeyStatus:
    """Tracks the status of an API key"""
    def __init__(self):
        self.last_used = 0
        self.error_count = 0
        self.rate_limit_until = 0
        self.total_requests = 0
        
    def mark_used(self):
        """Mark this key as used"""
        self.last_used = time.time()
        self.total_requests += 1
        
    def mark_error(self, is_rate_limit=False, retry_after=60):
        """Mark this key as having an error"""
        self.error_count += 1
        if is_rate_limit:
            self.rate_limit_until = time.time() + retry_after
            
    def is_rate_limited(self) -> bool:
        """Check if this key is currently rate limited"""
        return time.time() < self.rate_limit_until
    
    def reset_errors(self):
        """Reset error count"""
        self.error_count = 0


class EnhancedAPIKeyManager:
    """Advanced API key manager with rotation and fallback strategies"""
    def __init__(self, config_path: Optional[str] = None):
        self.config_path = config_path or os.path.join(os.path.dirname(__file__), "api_keys.json")
        self.api_keys: Dict[str, Dict[str, str]] = {}
        self.key_status: Dict[str, Dict[str, KeyStatus]] = {}
        self.key_cyclers: Dict[str, Any] = {}
        self.model_key_mapping: Dict[str, Tuple[str, str]] = {}
        self.load_keys()
        
    def load_keys(self) -> None:
        """Load API keys from configuration file"""
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r') as f:
                    self.api_keys = json.load(f)
                logger.info(f"Loaded API keys from {self.config_path}")
                
                # Initialize key status tracking for all keys
                for provider, keys in self.api_keys.items():
                    if provider not in self.key_status:
                        self.key_status[provider] = {}
                    
                    for key_id in keys:
                        if key_id not in self.key_status[provider]:
                            self.key_status[provider][key_id] = KeyStatus()
                    
                    # Create cycler for round-robin access
                    self._update_key_cycler(provider)
            else:
                logger.warning(f"API key configuration file not found at {self.config_path}")
                self.api_keys = {}
        except Exception as e:
            logger.error(f"Error loading API keys: {str(e)}")
            self.api_keys = {}
    
    def _update_key_cycler(self, provider: str) -> None:
        """Update the key cycler for a provider"""
        if provider in self.api_keys and self.api_keys[provider]:
            self.key_cyclers[provider] = cycle(list(self.api_keys[provider].keys()))
    
    def save_keys(self) -> None:
        """Save API keys to configuration file"""
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
            
            # Save keys without exposing them in logs
            with open(self.config_path, 'w') as f:
                json.dump(self.api_keys, f, indent=2)
            logger.info(f"Saved API keys to {self.config_path}")
        except Exception as e:
            logger.error(f"Error saving API keys: {str(e)}")
    
    def add_key(self, provider: Union[str, LLMProvider], key_id: str, api_key: str) -> None:
        """Add or update an API key"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name not in self.api_keys:
            self.api_keys[provider_name] = {}
            self.key_status[provider_name] = {}
        
        self.api_keys[provider_name][key_id] = api_key
        
        # Initialize key status if new
        if key_id not in self.key_status[provider_name]:
            self.key_status[provider_name][key_id] = KeyStatus()
        
        # Update cycler
        self._update_key_cycler(provider_name)
        
        logger.info(f"Added API key for {provider_name} with ID {key_id}")
        self.save_keys()
    
    def get_key(self, provider: Union[str, LLMProvider], key_id: str = "default") -> Optional[str]:
        """Get an API key for a provider"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name in self.api_keys and key_id in self.api_keys[provider_name]:
            # Mark key as used
            if provider_name in self.key_status and key_id in self.key_status[provider_name]:
                self.key_status[provider_name][key_id].mark_used()
            return self.api_keys[provider_name][key_id]
        
        # Try to get from environment variables as fallback
        env_var_name = f"{provider_name.upper()}_API_KEY"
        if os.environ.get(env_var_name):
            return os.environ.get(env_var_name)
        
        logger.warning(f"No API key found for {provider_name} with ID {key_id}")
        return None
    
    def get_next_key(self, provider: Union[str, LLMProvider]) -> Tuple[Optional[str], Optional[str]]:
        """Get the next available API key using round-robin strategy"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name not in self.key_cyclers or provider_name not in self.api_keys:
            logger.warning(f"No keys available for provider {provider_name}")
            return None, None
        
        # Try to find a non-rate-limited key
        for _ in range(len(self.api_keys[provider_name])):
            key_id = next(self.key_cyclers[provider_name])
            
            # Skip rate-limited keys
            if self.key_status[provider_name][key_id].is_rate_limited():
                continue
                
            api_key = self.api_keys[provider_name][key_id]
            self.key_status[provider_name][key_id].mark_used()
            return key_id, api_key
        
        logger.warning(f"All keys for {provider_name} are currently rate-limited")
        return None, None
    
    def get_key_for_model(self, model_id: str) -> Tuple[Optional[str], Optional[str]]:
        """Get the API key assigned to a specific model"""
        if model_id in self.model_key_mapping:
            provider_name, key_id = self.model_key_mapping[model_id]
            if provider_name in self.api_keys and key_id in self.api_keys[provider_name]:
                api_key = self.api_keys[provider_name][key_id]
                self.key_status[provider_name][key_id].mark_used()
                return key_id, api_key
        
        logger.warning(f"No key mapping found for model {model_id}")
        return None, None
    
    def assign_model_to_key(self, model_id: str, provider: Union[str, LLMProvider], key_id: str) -> None:
        """Assign a specific model to use a specific key"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name in self.api_keys and key_id in self.api_keys[provider_name]:
            self.model_key_mapping[model_id] = (provider_name, key_id)
            logger.info(f"Assigned model {model_id} to use key {key_id} from provider {provider_name}")
        else:
            logger.warning(f"Cannot assign model {model_id} to non-existent key {key_id} from provider {provider_name}")
    
    def mark_key_error(self, provider: Union[str, LLMProvider], key_id: str, 
                       is_rate_limit: bool = False, retry_after: int = 60) -> None:
        """Mark a key as having an error"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name in self.key_status and key_id in self.key_status[provider_name]:
            self.key_status[provider_name][key_id].mark_error(is_rate_limit, retry_after)
            logger.info(f"Marked key {key_id} from {provider_name} as having an error")
            if is_rate_limit:
                logger.info(f"Key {key_id} from {provider_name} rate-limited for {retry_after} seconds")
    
    def get_best_key(self, provider: Union[str, LLMProvider]) -> Tuple[Optional[str], Optional[str]]:
        """Get the best available key based on usage and error history"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name not in self.key_status or not self.key_status[provider_name]:
            return self.get_next_key(provider_name)
        
        # Find key with lowest error count that isn't rate limited
        available_keys = [
            (key_id, status) for key_id, status in self.key_status[provider_name].items()
            if not status.is_rate_limited()
        ]
        
        if not available_keys:
            logger.warning(f"No available keys for {provider_name}")
            return None, None
        
        # Sort by error count (ascending) and then by last used (ascending)
        sorted_keys = sorted(available_keys, key=lambda x: (x[1].error_count, x[1].last_used))
        best_key_id = sorted_keys[0][0]
        
        if best_key_id in self.api_keys[provider_name]:
            self.key_status[provider_name][best_key_id].mark_used()
            return best_key_id, self.api_keys[provider_name][best_key_id]
        
        return None, None
    
    def remove_key(self, provider: Union[str, LLMProvider], key_id: str) -> bool:
        """Remove an API key"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name in self.api_keys and key_id in self.api_keys[provider_name]:
            del self.api_keys[provider_name][key_id]
            
            # Also remove from status tracking
            if provider_name in self.key_status and key_id in self.key_status[provider_name]:
                del self.key_status[provider_name][key_id]
            
            # Update model mappings
            for model_id, (prov, kid) in list(self.model_key_mapping.items()):
                if prov == provider_name and kid == key_id:
                    del self.model_key_mapping[model_id]
            
            # Update cycler
            self._update_key_cycler(provider_name)
            
            if not self.api_keys[provider_name]:
                del self.api_keys[provider_name]
                if provider_name in self.key_status:
                    del self.key_status[provider_name]
                if provider_name in self.key_cyclers:
                    del self.key_cyclers[provider_name]
            
            self.save_keys()
            logger.info(f"Removed API key for {provider_name} with ID {key_id}")
            return True
        
        logger.warning(f"No API key found to remove for {provider_name} with ID {key_id}")
        return False
    
    def list_providers(self) -> List[str]:
        """List all providers with registered API keys"""
        return list(self.api_keys.keys())
    
    def list_keys_for_provider(self, provider: Union[str, LLMProvider]) -> List[str]:
        """List all key IDs for a provider"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name in self.api_keys:
            return list(self.api_keys[provider_name].keys())
        return []
    
    def get_key_usage_stats(self, provider: Union[str, LLMProvider], key_id: str) -> Dict[str, Any]:
        """Get usage statistics for a key"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name in self.key_status and key_id in self.key_status[provider_name]:
            status = self.key_status[provider_name][key_id]
            return {
                "total_requests": status.total_requests,
                "error_count": status.error_count,
                "last_used": status.last_used,
                "is_rate_limited": status.is_rate_limited(),
                "rate_limit_ends": status.rate_limit_until
            }
        
        return {}


# Example usage
def query_with_fallback(prompt: str