from typing import Dict, List, Optional, Any, Union, Callable
import logging
import asyncio
from enum import Enum
from dataclasses import dataclass, field
import base64
from pathlib import Path

from ..llm.persona_llm_manager import LLMProvider, LLMConfig, PersonaTraits
from ..llm.beam_chat import BeamChat, FusionStrategy, ModelResponse, FusionResult
from ..messaging.message_broker import MessageBroker
from ..messaging.shared_memory import SharedMemoryManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModalityType(Enum):
    """Types of modalities supported by the multimodal system"""
    TEXT = "text"
    IMAGE = "image"
    AUDIO = "audio"
    VIDEO = "video"


@dataclass
class MultiModalContent:
    """Content with multiple modalities"""
    modality_type: ModalityType
    content: Any  # Text string, image bytes, etc.
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class MultiModalPrompt:
    """Prompt containing multiple modalities"""
    elements: List[MultiModalContent]
    system_message: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


class MultiModalBeam(BeamChat):
    """Extension of BeamChat with multi-modal capabilities"""
    
    def __init__(self, broker: MessageBroker):
        super().__init__(broker)
        self.memory = SharedMemoryManager(broker, "multimodal_beam")
        self.vision_models: Dict[str, LLMConfig] = {}
        
        # Subscribe to relevant message topics
        self.broker.subscribe_to_context("multimodal_request", self._handle_multimodal_request)
    
    def register_vision_model(self, model_id: str, config: LLMConfig) -> None:
        """Register a vision-capable model"""
        self.vision_models[model_id] = config
        # Also register with the base BeamChat for text capabilities
        self.register_model(model_id, config)
        logger.info(f"Registered vision model {model_id}")
    
    async def process_multimodal_prompt(self, prompt: MultiModalPrompt, 
                                      model_ids: Optional[List[str]] = None) -> List[ModelResponse]:
        """Process a multi-modal prompt with multiple models"""
        if not model_ids:
            # Use only vision-capable models by default for multimodal prompts
            model_ids = list(self.vision_models.keys())
        else:
            # Filter to ensure only vision-capable models are used
            model_ids = [m for m in model_ids if m in self.vision_models]
        
        if not model_ids:
            logger.warning("No vision-capable models available for multimodal processing")
            return []
        
        tasks = []
        for model_id in model_ids:
            tasks.append(self._process_with_model(model_id, prompt))
        
        responses = await asyncio.gather(*tasks)
        return [r for r in responses if r is not None]
    
    async def _process_with_model(self, model_id: str, prompt: MultiModalPrompt) -> Optional[ModelResponse]:
        """Process a multimodal prompt with a specific model"""
        try:
            config = self.vision_models[model_id]
            
            # Implementation depends on the provider
            if config.provider == LLMProvider.OPENAI:
                return await self._process_openai_multimodal(model_id, config, prompt)
            elif config.provider == LLMProvider.ANTHROPIC:
                return await self._process_anthropic_multimodal(model_id, config, prompt)
            else:
                logger.warning(f"Unsupported provider {config.provider} for multimodal processing")
                return None
        except Exception as e:
            logger.error(f"Error processing multimodal prompt with model {model_id}: {str(e)}")
            return None
    
    async def _process_openai_multimodal(self, model_id: str, config: LLMConfig, 
                                       prompt: MultiModalPrompt) -> ModelResponse:
        """Process multimodal prompt using OpenAI's vision capabilities"""
        import openai
        import time
        
        # Set API key
        openai.api_key = config.api_key
        
        # Set custom endpoint if provided
        if config.endpoint:
            openai.api_base = config.endpoint
        
        # Prepare messages
        messages = []
        if prompt.system_message:
            messages.append({"role": "system", "content": prompt.system_message})
        
        # Construct the user message with multiple modalities
        user_message_content = []
        
        for element in prompt.elements:
            if element.modality_type == ModalityType.TEXT:
                user_message_content.append({"type": "text", "text": element.content})
            elif element.modality_type == ModalityType.IMAGE:
                # Handle different image input formats
                if isinstance(element.content, str):
                    # Assume it's a file path or URL
                    if element.content.startswith(('http://', 'https://')):
                        # It's a URL
                        user_message_content.append({
                            "type": "image_url",
                            "image_url": {"url": element.content}
                        })
                    else:
                        # It's a file path, read and encode
                        image_path = Path(element.content)
                        if image_path.exists():
                            with open(image_path, "rb") as image_file:
                                base64_image = base64.b64encode(image_file.read()).decode('utf-8')
                                user_message_content.append({
                                    "type": "image_url",
                                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                                })
                elif isinstance(element.content, bytes):
                    # It's already bytes, encode directly
                    base64_image = base64.b64encode(element.content).decode('utf-8')
                    user_message_content.append({
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                    })
        
        messages.append({"role": "user", "content": user_message_content})
        
        # Generate response
        start_time = time.time()
        response = await openai.ChatCompletion.acreate(
            model=config.model_name,
            messages=messages,
            **config.parameters
        )
        end_time = time.time()
        
        return ModelResponse(
            model_id=model_id,
            provider=config.provider,
            content=response.choices[0].message.content,
            metadata={"response": response},
            confidence=1.0,  # OpenAI doesn't provide confidence scores
            latency=end_time - start_time
        )
    
    async def _process_anthropic_multimodal(self, model_id: str, config: LLMConfig, 
                                          prompt: MultiModalPrompt) -> ModelResponse:
        """Process multimodal prompt using Anthropic's vision capabilities"""
        import anthropic
        import time
        
        # Initialize client
        client = anthropic.Anthropic(api_key=config.api_key)
        
        # Prepare system prompt
        system_message = prompt.system_message or ""
        
        # Construct the user message with multiple modalities
        user_message_content = []
        
        for element in prompt.elements:
            if element.modality_type == ModalityType.TEXT:
                user_message_content.append({"type": "text", "text": element.content})
            elif element.modality_type == ModalityType.IMAGE:
                # Handle different image input formats
                if isinstance(element.content, str):
                    # Assume it's a file path or URL
                    if element.content.startswith(('http://', 'https://')):
                        # It's a URL
                        user_message_content.append({
                            "type": "image",
                            "source": {"type": "url", "url": element.content}
                        })
                    else:
                        # It's a file path, read and encode
                        image_path = Path(element.content)
                        if image_path.exists():
                            with open(image_path, "rb") as image_file:
                                media_bytes = image_file.read()
                                user_message_content.append({
                                    "type": "image",
                                    "source": {"type": "base64", "media_type": "image/jpeg", "data": base64.b64encode(media_bytes).decode('utf-8')}
                                })
                elif isinstance(element.content, bytes):
                    # It's already bytes, encode directly
                    user_message_content.append({
                        "type": "image",
                        "source": {"type": "base64", "media_type": "image/jpeg", "data": base64.b64encode(element.content).decode('utf-8')}
                    })
        
        # Generate response
        start_time = time.time()
        response = await client.messages.create(
            model=config.model_name,
            system=system_message,
            messages=[{"role": "user", "content": user_message_content}],
            **config.parameters
        )
        end_time = time.time()
        
        return ModelResponse(
            model_id=model_id,
            provider=config.provider,
            content=response.content[0].text,
            metadata={"response": response},
            confidence=1.0,  # Anthropic doesn't provide confidence scores
            latency=end_time - start_time
        )
    
    def _handle_multimodal_request(self, message: Dict[str, Any]) -> None:
        """Handle incoming multimodal requests"""
        payload = message.get('payload', {})
        elements = payload.get('elements', [])
        system_message = payload.get('system_message')
        model_ids = payload.get('model_ids')
        strategy = FusionStrategy(payload.get('strategy', FusionStrategy.AUTO_SELECT.value))
        request_id = payload.get('request_id')
        
        if not elements or not request_id:
            logger.error("Invalid multimodal request: missing elements or request_id")
            return
        
        # Convert elements to MultiModalContent objects
        modal_elements = []
        for element in elements:
            modality = element.get('modality')
            content = element.get('content')
            metadata = element.get('metadata', {})
            
            if not modality or not content:
                logger.warning(f"Skipping invalid element in request {request_id}")
                continue
            
            try:
                modal_elements.append(MultiModalContent(
                    modality_type=ModalityType(modality),
                    content=content,
                    metadata=metadata
                ))
            except ValueError:
                logger.warning(f"Unsupported modality type: {modality}")
        
        if not modal_elements:
            logger.error(f"No valid elements in multimodal request {request_id}")
            return
        
        # Create MultiModalPrompt
        prompt = MultiModalPrompt(
            elements=modal_elements,
            system_message=system_message,
            metadata=payload.get('metadata', {})
        )
        
        # Process request asynchronously
        asyncio.create_task(self._process_multimodal_request(
            request_id, prompt, model_ids, strategy
        ))
    
    async def _process_multimodal_request(self, request_id: str, prompt: MultiModalPrompt,
                                        model_ids: Optional[List[str]] = None,
                                        strategy: FusionStrategy = FusionStrategy.AUTO_SELECT) -> None:
        """Process a multimodal request asynchronously"""
        try:
            # Generate responses from multiple models
            responses = await self.process_multimodal_prompt(prompt, model_ids)
            
            if not responses:
                raise ValueError("No responses generated from multimodal models")
            
            # Fuse responses
            result = await self.fuse_responses(responses, strategy)
            
            # Store result in memory
            self.memory.write(f"multimodal_result:{request_id}", {
                "content": result.content,
                "confidence": result.confidence,
                "strategy": result.strategy.value,
                "models": [r.model_id for r in result.source_responses]
            })
            
            # Broadcast result
            self.broker.broadcast_system_message(
                'multimodal_result',
                {
                    'request_id': request_id,
                    'content': result.content,
                    'confidence': result.confidence,
                    'strategy': result.strategy.value,
                    'models': [r.model_id for r in result.source_responses]
                }
            )
        except Exception as e:
            logger.error(f"Error processing multimodal request {request_id}: {str(e)}")
            self.broker.broadcast_system_message(
                'multimodal_error',
                {
                    'request_id': request_id,
                    'error': str(e)
                }
            )