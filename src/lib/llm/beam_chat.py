from typing import Dict, List, Optional, Any, Union, Callable
import logging
import asyncio
from enum import Enum
from dataclasses import dataclass, field

from ..llm.persona_llm_manager import LLMProvider, LLMConfig, PersonaTraits
from ..messaging.message_broker import MessageBroker
from ..messaging.shared_memory import SharedMemoryManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FusionStrategy(Enum):
    """Strategies for fusing multiple model outputs"""
    AUTO_SELECT = "auto_select"  # Automatically select the best response
    CHECKLIST = "checklist"      # Evaluate responses against a checklist
    WEIGHTED = "weighted"        # Weight responses based on model capabilities
    ENSEMBLE = "ensemble"        # Combine multiple responses
    CUSTOM = "custom"            # Custom fusion strategy


@dataclass
class ModelResponse:
    """Response from a single model"""
    model_id: str
    provider: LLMProvider
    content: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    confidence: float = 0.0
    latency: float = 0.0


@dataclass
class FusionResult:
    """Result of fusing multiple model responses"""
    content: str
    source_responses: List[ModelResponse]
    strategy: FusionStrategy
    confidence: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)


class BeamChat:
    """Multi-model decision-making framework for orchestrating AI personas"""
    
    def __init__(self, broker: MessageBroker):
        self.broker = broker
        self.memory = SharedMemoryManager(broker, "beam_chat")
        self.models: Dict[str, LLMConfig] = {}
        self.fusion_strategies: Dict[str, Callable] = {
            FusionStrategy.AUTO_SELECT.value: self._auto_select_fusion,
            FusionStrategy.CHECKLIST.value: self._checklist_fusion,
            FusionStrategy.WEIGHTED.value: self._weighted_fusion,
            FusionStrategy.ENSEMBLE.value: self._ensemble_fusion,
        }
        
        # Subscribe to relevant message topics
        self.broker.subscribe_to_context("beam_chat_request", self._handle_beam_chat_request)
    
    def register_model(self, model_id: str, config: LLMConfig) -> None:
        """Register a model with BeamChat"""
        self.models[model_id] = config
        logger.info(f"Registered model {model_id} with BeamChat")
    
    def register_fusion_strategy(self, strategy_id: str, strategy_func: Callable) -> None:
        """Register a custom fusion strategy"""
        self.fusion_strategies[strategy_id] = strategy_func
        logger.info(f"Registered fusion strategy {strategy_id}")
    
    async def generate_responses(self, prompt: str, system_message: Optional[str] = None, 
                               model_ids: Optional[List[str]] = None) -> List[ModelResponse]:
        """Generate responses from multiple models in parallel"""
        if not model_ids:
            model_ids = list(self.models.keys())
        
        tasks = []
        for model_id in model_ids:
            if model_id in self.models:
                tasks.append(self._generate_response(model_id, prompt, system_message))
        
        responses = await asyncio.gather(*tasks)
        return [r for r in responses if r is not None]
    
    async def _generate_response(self, model_id: str, prompt: str, 
                              system_message: Optional[str] = None) -> Optional[ModelResponse]:
        """Generate response from a single model"""
        try:
            config = self.models[model_id]
            
            # Implementation depends on the provider
            if config.provider == LLMProvider.OPENAI:
                return await self._generate_openai_response(model_id, config, prompt, system_message)
            elif config.provider == LLMProvider.ANTHROPIC:
                return await self._generate_anthropic_response(model_id, config, prompt, system_message)
            else:
                logger.warning(f"Unsupported provider {config.provider} for model {model_id}")
                return None
        except Exception as e:
            logger.error(f"Error generating response from model {model_id}: {str(e)}")
            return None
    
    async def _generate_openai_response(self, model_id: str, config: LLMConfig, 
                                     prompt: str, system_message: Optional[str] = None) -> ModelResponse:
        """Generate response using OpenAI"""
        import openai
        import time
        
        # Set API key
        openai.api_key = config.api_key
        
        # Set custom endpoint if provided
        if config.endpoint:
            openai.api_base = config.endpoint
        
        # Prepare messages
        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})
        
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
    
    async def _generate_anthropic_response(self, model_id: str, config: LLMConfig, 
                                        prompt: str, system_message: Optional[str] = None) -> ModelResponse:
        """Generate response using Anthropic"""
        import anthropic
        import time
        
        # Initialize client
        client = anthropic.Anthropic(api_key=config.api_key)
        
        # Prepare system prompt
        if not system_message:
            system_message = ""
        
        # Generate response
        start_time = time.time()
        response = await client.messages.create(
            model=config.model_name,
            system=system_message,
            messages=[
                {"role": "user", "content": prompt}
            ],
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
    
    async def fuse_responses(self, responses: List[ModelResponse], 
                          strategy: FusionStrategy = FusionStrategy.AUTO_SELECT) -> FusionResult:
        """Fuse multiple model responses using the specified strategy"""
        if not responses:
            raise ValueError("No responses to fuse")
        
        if len(responses) == 1:
            return FusionResult(
                content=responses[0].content,
                source_responses=responses,
                strategy=strategy,
                confidence=responses[0].confidence
            )
        
        strategy_func = self.fusion_strategies.get(strategy.value)
        if not strategy_func:
            raise ValueError(f"Unknown fusion strategy: {strategy}")
        
        return await strategy_func(responses)
    
    async def _auto_select_fusion(self, responses: List[ModelResponse]) -> FusionResult:
        """Automatically select the best response based on confidence and latency"""
        # Simple implementation: select response with highest confidence
        best_response = max(responses, key=lambda r: r.confidence)
        
        return FusionResult(
            content=best_response.content,
            source_responses=responses,
            strategy=FusionStrategy.AUTO_SELECT,
            confidence=best_response.confidence
        )
    
    async def _checklist_fusion(self, responses: List[ModelResponse]) -> FusionResult:
        """Evaluate responses against a checklist of criteria"""
        # This would typically use another LLM to evaluate responses against criteria
        # Simplified implementation for now
        scores = {}
        for i, response in enumerate(responses):
            # Placeholder for actual evaluation logic
            scores[i] = response.confidence
        
        best_idx = max(scores.items(), key=lambda x: x[1])[0]
        best_response = responses[best_idx]
        
        return FusionResult(
            content=best_response.content,
            source_responses=responses,
            strategy=FusionStrategy.CHECKLIST,
            confidence=scores[best_idx],
            metadata={"scores": scores}
        )
    
    async def _weighted_fusion(self, responses: List[ModelResponse]) -> FusionResult:
        """Weight responses based on model capabilities"""
        # This would typically use a weighted combination of responses
        # Simplified implementation for now
        weights = {}
        for i, response in enumerate(responses):
            # Placeholder for actual weighting logic
            weights[i] = response.confidence
        
        # Normalize weights
        total_weight = sum(weights.values())
        if total_weight > 0:
            weights = {k: v / total_weight for k, v in weights.items()}
        
        # Combine responses (simplified - in reality would be more sophisticated)
        combined_content = "\n\n---\n\n".join(
            [f"Model {responses[i].model_id} (weight: {w:.2f}):\n{responses[i].content}" 
             for i, w in weights.items()]
        )
        
        return FusionResult(
            content=combined_content,
            source_responses=responses,
            strategy=FusionStrategy.WEIGHTED,
            confidence=sum(r.confidence * weights[i] for i, r in enumerate(responses)),
            metadata={"weights": weights}
        )
    
    async def _ensemble_fusion(self, responses: List[ModelResponse]) -> FusionResult:
        """Combine multiple responses into a coherent ensemble"""
        # This would typically use another LLM to combine responses
        # Simplified implementation for now
        combined_content = "\n\n---\n\n".join(
            [f"Model {r.model_id}:\n{r.content}" for r in responses]
        )
        
        return FusionResult(
            content=combined_content,
            source_responses=responses,
            strategy=FusionStrategy.ENSEMBLE,
            confidence=sum(r.confidence for r in responses) / len(responses)
        )
    
    def _handle_beam_chat_request(self, message: Dict[str, Any]) -> None:
        """Handle incoming BeamChat requests"""
        payload = message.get('payload', {})
        prompt = payload.get('prompt')
        system_message = payload.get('system_message')
        model_ids = payload.get('model_ids')
        strategy = FusionStrategy(payload.get('strategy', FusionStrategy.AUTO_SELECT.value))
        request_id = payload.get('request_id')
        
        if not prompt or not request_id:
            logger.error("Invalid BeamChat request: missing prompt or request_id")
            return
        
        # Process request asynchronously
        asyncio.create_task(self._process_beam_chat_request(
            request_id, prompt, system_message, model_ids, strategy
        ))
    
    async def _process_beam_chat_request(self, request_id: str, prompt: str, 
                                       system_message: Optional[str] = None,
                                       model_ids: Optional[List[str]] = None,
                                       strategy: FusionStrategy = FusionStrategy.AUTO_SELECT) -> None:
        """Process a BeamChat request asynchronously"""
        try:
            # Generate responses from multiple models
            responses = await self.generate_responses(prompt, system_message, model_ids)
            
            # Fuse responses
            result = await self.fuse_responses(responses, strategy)
            
            # Store result in memory
            self.memory.write(f"result:{request_id}", {
                "content": result.content,
                "confidence": result.confidence,
                "strategy": result.strategy.value,
                "models": [r.model_id for r in result.source_responses]
            })
            
            # Broadcast result
            self.broker.broadcast_system_message(
                'beam_chat_result',
                {
                    'request_id': request_id,
                    'content': result.content,
                    'confidence': result.confidence,
                    'strategy': result.strategy.value,
                    'models': [r.model_id for r in result.source_responses]
                }
            )
        except Exception as e:
            logger.error(f"Error processing BeamChat request {request_id}: {str(e)}")
            self.broker.broadcast_system_message(
                'beam_chat_error',
                {
                    'request_id': request_id,
                    'error': str(e)
                }
            )