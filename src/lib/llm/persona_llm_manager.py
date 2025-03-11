from typing import Dict, List, Optional, Any, Union
import json
import os
from dataclasses import dataclass, field
from enum import Enum
import logging

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
    CUSTOM = "custom"


@dataclass
class LLMConfig:
    """Configuration for a specific LLM"""
    provider: LLMProvider
    model_name: str
    api_key: Optional[str] = None
    endpoint: Optional[str] = None
    parameters: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            "provider": self.provider.value,
            "model_name": self.model_name,
            "endpoint": self.endpoint,
            "parameters": self.parameters
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'LLMConfig':
        """Create from dictionary"""
        return cls(
            provider=LLMProvider(data.get("provider", "openai")),
            model_name=data.get("model_name", ""),
            api_key=data.get("api_key"),
            endpoint=data.get("endpoint"),
            parameters=data.get("parameters", {})
        )


@dataclass
class PersonaTraits:
    """Traits that define a persona's behavior and communication style"""
    name: str
    title: str
    expertise: List[str] = field(default_factory=list)
    responsibilities: List[str] = field(default_factory=list)
    voice: Optional[str] = None
    tone: Optional[str] = None
    emotion: Optional[str] = None
    knowledge_areas: List[str] = field(default_factory=list)
    competence_maps: Dict[str, List[str]] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            "name": self.name,
            "title": self.title,
            "expertise": self.expertise,
            "responsibilities": self.responsibilities,
            "voice": self.voice,
            "tone": self.tone,
            "emotion": self.emotion,
            "knowledge_areas": self.knowledge_areas,
            "competence_maps": self.competence_maps
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'PersonaTraits':
        """Create from dictionary"""
        return cls(
            name=data.get("name", ""),
            title=data.get("title", ""),
            expertise=data.get("expertise", []),
            responsibilities=data.get("responsibilities", []),
            voice=data.get("voice"),
            tone=data.get("tone"),
            emotion=data.get("emotion"),
            knowledge_areas=data.get("knowledge_areas", []),
            competence_maps=data.get("competence_maps", {})
        )


class APIKeyManager:
    """Manages API keys for different LLM providers including OpenRouter and Gemini"""
    def __init__(self, config_path: Optional[str] = None):
        self.config_path = config_path or os.path.join(os.path.dirname(__file__), "api_keys.json")
        self.api_keys: Dict[str, Dict[str, str]] = {
            "openrouter": {"default": "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"},
            "gemini": {"default": "AIzaSyBkt2yKxwiKz-EMTc86KrHbDd3ZS4dDXhw"}
        }
        self.load_keys()
    
    def load_keys(self) -> None:
        """Load API keys from configuration file"""
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r') as f:
                    self.api_keys = json.load(f)
                logger.info(f"Loaded API keys from {self.config_path}")
            else:
                logger.warning(f"API key configuration file not found at {self.config_path}")
                self.api_keys = {}
        except Exception as e:
            logger.error(f"Error loading API keys: {str(e)}")
            self.api_keys = {}
    
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
        
        self.api_keys[provider_name][key_id] = api_key
        logger.info(f"Added API key for {provider_name} with ID {key_id}")
        self.save_keys()
    
    def get_key(self, provider: Union[str, LLMProvider], key_id: str = "default") -> Optional[str]:
        """Get an API key for a provider"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name in self.api_keys and key_id in self.api_keys[provider_name]:
            return self.api_keys[provider_name][key_id]
        
        # Try to get from environment variables as fallback
        env_var_name = f"{provider_name.upper()}_API_KEY"
        if os.environ.get(env_var_name):
            return os.environ.get(env_var_name)
        
        logger.warning(f"No API key found for {provider_name} with ID {key_id}")
        return None
    
    def remove_key(self, provider: Union[str, LLMProvider], key_id: str) -> bool:
        """Remove an API key"""
        provider_name = provider.value if isinstance(provider, LLMProvider) else provider
        
        if provider_name in self.api_keys and key_id in self.api_keys[provider_name]:
            del self.api_keys[provider_name][key_id]
            if not self.api_keys[provider_name]:
                del self.api_keys[provider_name]
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


class PersonaLLMManager:
    """Manages LLM configurations for different personas"""
    def __init__(self, config_path: Optional[str] = None):
        self.config_path = config_path or os.path.join(os.path.dirname(__file__), "persona_llm_config.json")
        self.api_key_manager = APIKeyManager()
        self.persona_configs: Dict[str, Dict[str, Any]] = {}
        self.load_config()
    
    def load_config(self) -> None:
        """Load persona LLM configurations from file"""
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r') as f:
                    self.persona_configs = json.load(f)
                logger.info(f"Loaded persona LLM configurations from {self.config_path}")
            else:
                logger.warning(f"Persona LLM configuration file not found at {self.config_path}")
                self.persona_configs = {}
        except Exception as e:
            logger.error(f"Error loading persona LLM configurations: {str(e)}")
            self.persona_configs = {}
    
    def save_config(self) -> None:
        """Save persona LLM configurations to file"""
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
            
            with open(self.config_path, 'w') as f:
                json.dump(self.persona_configs, f, indent=2)
            logger.info(f"Saved persona LLM configurations to {self.config_path}")
        except Exception as e:
            logger.error(f"Error saving persona LLM configurations: {str(e)}")
    
    def set_persona_llm_config(self, persona_id: str, llm_config: LLMConfig, traits: Optional[PersonaTraits] = None) -> None:
        """Set LLM configuration for a persona"""
        if persona_id not in self.persona_configs:
            self.persona_configs[persona_id] = {}
        
        self.persona_configs[persona_id]["llm_config"] = llm_config.to_dict()
        
        if traits:
            self.persona_configs[persona_id]["traits"] = traits.to_dict()
        
        logger.info(f"Set LLM configuration for persona {persona_id}")
        self.save_config()
    
    def get_persona_llm_config(self, persona_id: str) -> Optional[LLMConfig]:
        """Get LLM configuration for a persona"""
        if persona_id in self.persona_configs and "llm_config" in self.persona_configs[persona_id]:
            config_dict = self.persona_configs[persona_id]["llm_config"]
            config = LLMConfig.from_dict(config_dict)
            
            # Inject API key if not present
            if not config.api_key:
                config.api_key = self.api_key_manager.get_key(config.provider)
            
            return config
        
        logger.warning(f"No LLM configuration found for persona {persona_id}")
        return None
    
    def get_persona_traits(self, persona_id: str) -> Optional[PersonaTraits]:
        """Get traits for a persona"""
        if persona_id in self.persona_configs and "traits" in self.persona_configs[persona_id]:
            traits_dict = self.persona_configs[persona_id]["traits"]
            return PersonaTraits.from_dict(traits_dict)
        
        logger.warning(f"No traits found for persona {persona_id}")
        return None
    
    def list_personas(self) -> List[str]:
        """List all personas with configurations"""
        return list(self.persona_configs.keys())
    
    def remove_persona_config(self, persona_id: str) -> bool:
        """Remove configuration for a persona"""
        if persona_id in self.persona_configs:
            del self.persona_configs[persona_id]
            self.save_config()
            logger.info(f"Removed configuration for persona {persona_id}")
            return True
        
        logger.warning(f"No configuration found to remove for persona {persona_id}")
        return False
    
    def get_best_llm_for_traits(self, traits: PersonaTraits) -> LLMConfig:
        """Determine the best LLM configuration based on persona traits"""
        # This is a simplified implementation that could be enhanced with ML-based matching
        # For now, we'll use a rule-based approach
        
        # Default configuration
        default_config = LLMConfig(
            provider=LLMProvider.OPENAI,
            model_name="gpt-4",
            parameters={
                "temperature": 0.7,
                "max_tokens": 1000
            }
        )
        
        # Adjust based on traits
        if traits.tone and "technical" in traits.tone.lower():
            default_config.parameters["temperature"] = 0.3  # More precise for technical personas
        
        if traits.emotion and "creative" in traits.emotion.lower():
            default_config.parameters["temperature"] = 0.9  # More creative
        
        # Check if we have specialized models for certain expertise areas
        if any("code" in exp.lower() for exp in traits.expertise):
            default_config.model_name = "gpt-4-turbo"  # Better for code generation
        
        # Inject API key
        default_config.api_key = self.api_key_manager.get_key(default_config.provider)
        
        return default_config