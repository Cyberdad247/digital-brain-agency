from typing import Dict, List, Optional, Any, Union
import logging
import importlib
from .enhanced_ai_persona import EnhancedAIPersona
from ..llm.persona_llm_manager import PersonaLLMManager, LLMConfig, PersonaTraits, LLMProvider, APIKeyManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PersonaAgentManager:
    """Manager class for persona agents with LLM integration"""
    
    def __init__(self):
        self.personas: Dict[str, EnhancedAIPersona] = {}
        self.llm_manager = PersonaLLMManager()
        self.api_key_manager = APIKeyManager()
    
    def register_persona(self, persona: EnhancedAIPersona) -> None:
        """Register a persona with the manager"""
        if persona.persona_id in self.personas:
            logger.warning(f"Persona {persona.persona_id} is already registered. Updating registration.")
        
        self.personas[persona.persona_id] = persona
        logger.info(f"Registered persona: {persona.name} ({persona.persona_id})")
    
    def get_persona(self, persona_id: str) -> Optional[EnhancedAIPersona]:
        """Get a persona by ID"""
        if persona_id not in self.personas:
            logger.warning(f"Persona {persona_id} not found")
            return None
        
        return self.personas[persona_id]
    
    def list_personas(self) -> List[Dict[str, Any]]:
        """List all registered personas with their basic information"""
        return [
            {
                "id": persona.persona_id,
                "name": persona.name,
                "title": persona.title,
                "llm_config": persona.get_llm_config().to_dict() if persona.get_llm_config() else None
            }
            for persona in self.personas.values()
        ]
    
    def load_persona_by_name(self, class_name: str) -> Optional[EnhancedAIPersona]:
        """Dynamically load and instantiate a persona by class name"""
        try:
            # Try to import from personas module
            module = importlib.import_module(f"src.lib.personas.{class_name.lower()}")
            persona_class = getattr(module, class_name)
            
            # Instantiate the persona
            persona = persona_class()
            
            # Register the persona
            self.register_persona(persona)
            
            return persona
        except (ImportError, AttributeError) as e:
            logger.error(f"Failed to load persona {class_name}: {str(e)}")
            return None
    
    def configure_llm_for_persona(self, 
                                  persona_id: str, 
                                  provider: Union[str, LLMProvider],
                                  model_name: str,
                                  parameters: Optional[Dict[str, Any]] = None,
                                  api_key: Optional[str] = None,
                                  endpoint: Optional[str] = None) -> bool:
        """Configure LLM settings for a specific persona"""
        persona = self.get_persona(persona_id)
        if not persona:
            return False
        
        # Update LLM configuration
        persona.update_llm_config(
            provider=provider,
            model_name=model_name,
            parameters=parameters or {},
            api_key=api_key,
            endpoint=endpoint
        )
        
        return True
    
    def add_api_key(self, provider: Union[str, LLMProvider], key_id: str, api_key: str) -> None:
        """Add an API key for a provider"""
        self.api_key_manager.add_key(provider, key_id, api_key)
    
    def get_api_key(self, provider: Union[str, LLMProvider], key_id: str = "default") -> Optional[str]:
        """Get an API key for a provider"""
        return self.api_key_manager.get_key(provider, key_id)
    
    def list_api_keys(self) -> Dict[str, List[str]]:
        """List all registered API keys by provider"""
        result = {}
        for provider in self.api_key_manager.list_providers():
            result[provider] = self.api_key_manager.list_keys_for_provider(provider)
        return result
    
    def remove_api_key(self, provider: Union[str, LLMProvider], key_id: str) -> bool:
        """Remove an API key"""
        return self.api_key_manager.remove_key(provider, key_id)
    
    def get_best_persona_for_task(self, task_description: str) -> Optional[EnhancedAIPersona]:
        """Find the best persona for a specific task based on expertise matching"""
        if not self.personas:
            logger.warning("No personas registered")
            return None
        
        # This is a simplified implementation that could be enhanced with ML-based matching
        # For now, we'll use a simple keyword matching approach
        
        best_match = None
        best_score = 0
        
        for persona in self.personas.values():
            score = 0
            
            # Check expertise keywords
            for expertise in persona.expertise:
                if expertise.lower() in task_description.lower():
                    score += 2
            
            # Check responsibilities
            for responsibility in persona.responsibilities:
                if responsibility.lower() in task_description.lower():
                    score += 1
            
            # Check knowledge areas
            for area in persona.knowledge_areas:
                if area.lower() in task_description.lower():
                    score += 1
            
            if score > best_score:
                best_score = score
                best_match = persona
        
        # If no good match found, return None
        if best_score == 0:
            logger.warning(f"No suitable persona found for task: {task_description}")
            return None
        
        logger.info(f"Selected persona {best_match.name} for task with score {best_score}")
        return best_match
    
    def collaborate(self, task: str, personas: List[str]) -> Dict[str, Any]:
        """Facilitate collaboration between multiple personas on a task"""
        results = {}
        primary_persona = None
        
        # Validate that all requested personas exist
        for persona_id in personas:
            if persona_id not in self.personas:
                logger.warning(f"Persona {persona_id} not found for collaboration")
                return {"error": f"Persona {persona_id} not found"}
        
        # Determine primary persona based on task description if not specified
        if not personas:
            primary_persona = self.get_best_persona_for_task(task)
            if not primary_persona:
                return {"error": "No suitable persona found for this task"}
            personas = [primary_persona.persona_id]
        
        # Execute task with each persona
        for persona_id in personas:
            persona = self.personas[persona_id]
            
            # Generate response from this persona
            response = persona.generate_response(task)
            results[persona_id] = {
                "name": persona.name,
                "response": response
            }
        
        return {
            "task": task,
            "results": results
        }

# Create a singleton instance
_instance = None

def get_persona_manager() -> PersonaAgentManager:
    """Get the singleton instance of the PersonaAgentManager"""
    global _instance
    if _instance is None:
        _instance = PersonaAgentManager()
    return _instance