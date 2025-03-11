from typing import Dict, List, Optional, Any, Union
import logging
from ..llm.persona_llm_manager import PersonaLLMManager, LLMConfig, PersonaTraits, LLMProvider
from ...lib.messaging.message_broker import MessageBroker
from ...lib.messaging.shared_memory import SharedMemoryManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedAIPersona:
    """Enhanced base class for AI personas with LLM integration"""
    def __init__(self, 
                 persona_id: str,
                 name: str, 
                 title: str, 
                 expertise: List[str], 
                 responsibilities: List[str],
                 voice: Optional[str] = None,
                 tone: Optional[str] = None,
                 emotion: Optional[str] = None,
                 knowledge_areas: List[str] = None,
                 competence_maps: Dict[str, List[str]] = None):
        
        self.persona_id = persona_id
        self.name = name
        self.title = title
        self.expertise = expertise
        self.responsibilities = responsibilities
        self.voice = voice
        self.tone = tone
        self.emotion = emotion
        self.knowledge_areas = knowledge_areas or []
        self.competence_maps = competence_maps or {}
        
        # Initialize messaging and memory components
        self.broker = MessageBroker()
        self.memory = SharedMemoryManager(self.broker, f"persona:{self.persona_id}")
        
        # Initialize LLM manager
        self.llm_manager = PersonaLLMManager()
        
        # Load or create LLM configuration
        self._initialize_llm_config()
    
    def _initialize_llm_config(self) -> None:
        """Initialize LLM configuration for this persona"""
        # Try to load existing configuration
        self.llm_config = self.llm_manager.get_persona_llm_config(self.persona_id)
        
        if not self.llm_config:
            # Create traits object
            traits = PersonaTraits(
                name=self.name,
                title=self.title,
                expertise=self.expertise,
                responsibilities=self.responsibilities,
                voice=self.voice,
                tone=self.tone,
                emotion=self.emotion,
                knowledge_areas=self.knowledge_areas,
                competence_maps=self.competence_maps
            )
            
            # Get recommended LLM configuration based on traits
            self.llm_config = self.llm_manager.get_best_llm_for_traits(traits)
            
            # Save configuration
            self.llm_manager.set_persona_llm_config(self.persona_id, self.llm_config, traits)
            
            logger.info(f"Created new LLM configuration for persona {self.persona_id}")
    
    def update_llm_config(self, 
                         provider: Optional[Union[str, LLMProvider]] = None,
                         model_name: Optional[str] = None,
                         parameters: Optional[Dict[str, Any]] = None,
                         endpoint: Optional[str] = None,
                         api_key: Optional[str] = None) -> None:
        """Update LLM configuration for this persona"""
        if not self.llm_config:
            logger.error(f"Cannot update LLM config for persona {self.persona_id}: No configuration exists")
            return
        
        # Update configuration
        if provider:
            if isinstance(provider, str):
                self.llm_config.provider = LLMProvider(provider)
            else:
                self.llm_config.provider = provider
        
        if model_name:
            self.llm_config.model_name = model_name
        
        if parameters:
            self.llm_config.parameters.update(parameters)
        
        if endpoint:
            self.llm_config.endpoint = endpoint
        
        if api_key:
            self.llm_config.api_key = api_key
        
        # Save updated configuration
        traits = PersonaTraits(
            name=self.name,
            title=self.title,
            expertise=self.expertise,
            responsibilities=self.responsibilities,
            voice=self.voice,
            tone=self.tone,
            emotion=self.emotion,
            knowledge_areas=self.knowledge_areas,
            competence_maps=self.competence_maps
        )
        
        self.llm_manager.set_persona_llm_config(self.persona_id, self.llm_config, traits)
        logger.info(f"Updated LLM configuration for persona {self.persona_id}")
    
    def get_llm_config(self) -> Optional[LLMConfig]:
        """Get current LLM configuration"""
        return self.llm_config
    
    def apply_optimizations(self, content: str) -> str:
        """Apply persona-specific optimizations to content"""
        # Base implementation does nothing
        return content
    
    def generate_response(self, prompt: str, system_message: Optional[str] = None) -> str:
        """Generate a response using the configured LLM"""
        if not self.llm_config or not self.llm_config.api_key:
            logger.error(f"Cannot generate response for persona {self.persona_id}: No valid LLM configuration")
            return "Error: No valid LLM configuration available."
        
        try:
            # Apply persona-specific optimizations to the prompt
            optimized_prompt = self.apply_optimizations(prompt)
            
            # Generate response based on provider
            if self.llm_config.provider == LLMProvider.OPENAI:
                return self._generate_openai_response(optimized_prompt, system_message)
            elif self.llm_config.provider == LLMProvider.ANTHROPIC:
                return self._generate_anthropic_response(optimized_prompt, system_message)
            else:
                logger.warning(f"Unsupported LLM provider: {self.llm_config.provider}")
                return f"Error: Unsupported LLM provider {self.llm_config.provider}"
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return f"Error generating response: {str(e)}"
    
    def _generate_openai_response(self, prompt: str, system_message: Optional[str] = None) -> str:
        """Generate response using OpenAI"""
        try:
            import openai
            
            # Set API key
            openai.api_key = self.llm_config.api_key
            
            # Set custom endpoint if provided
            if self.llm_config.endpoint:
                openai.api_base = self.llm_config.endpoint
            
            # Prepare messages
            messages = []
            
            # Add system message if provided
            if system_message:
                messages.append({"role": "system", "content": system_message})
            else:
                # Create default system message based on persona traits
                default_system = f"You are {self.name}, {self.title}. "
                if self.voice:
                    default_system += f"Speak in a {self.voice} voice. "
                if self.tone:
                    default_system += f"Use a {self.tone} tone. "
                
                messages.append({"role": "system", "content": default_system})
            
            # Add user message
            messages.append({"role": "user", "content": prompt})
            
            # Generate response
            response = openai.ChatCompletion.create(
                model=self.llm_config.model_name,
                messages=messages,
                **self.llm_config.parameters
            )
            
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error generating OpenAI response: {str(e)}")
            raise
    
    def _generate_anthropic_response(self, prompt: str, system_message: Optional[str] = None) -> str:
        """Generate response using Anthropic"""
        try:
            import anthropic
            
            # Initialize client
            client = anthropic.Anthropic(api_key=self.llm_config.api_key)
            
            # Prepare system prompt
            if not system_message:
                system_message = f"You are {self.name}, {self.title}."
                if self.voice:
                    system_message += f" Speak in a {self.voice} voice."
                if self.tone:
                    system_message += f" Use a {self.tone} tone."
            
            # Generate response
            response = client.messages.create(
                model=self.llm_config.model_name,
                system=system_message,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                **self.llm_config.parameters
            )
            
            return response.content[0].text
        except Exception as e:
            logger.error(f"Error generating Anthropic response: {str(e)}")
            raise
    
    def handle_message(self, message: Dict[str, Any]) -> None:
        """Handle incoming messages from the message broker"""
        # Base implementation does nothing
        pass
    
    def subscribe_to_topics(self, topics: List[str]) -> None:
        """Subscribe to message topics"""
        for topic in topics:
            self.broker.subscribe_to_context(topic, self.handle_message)
        
        logger.info(f"Persona {self.persona_id} subscribed to topics: {topics}")
    
    def broadcast_message(self, context: str, payload: Dict[str, Any]) -> None:
        """Broadcast a message to other personas"""
        self.broker.route_message(self.persona_id, context, payload)
        logger.info(f"Persona {self.persona_id} broadcast message with context: {context}")