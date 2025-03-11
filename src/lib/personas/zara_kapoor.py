from typing import Dict, Any, List, Optional
import logging
from .enhanced_ai_persona import EnhancedAIPersona
from ..llm.persona_llm_manager import LLMProvider

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ZaraKapoor(EnhancedAIPersona):
    """Zara 'Muse' Kapoor - AI Prompt Optimization Specialist"""
    
    def __init__(self):
        super().__init__(
            persona_id="zara-kapoor-001",
            name="Zara 'Muse' Kapoor",
            title="AI Prompt Optimization Specialist",
            expertise=["Natural language processing", "Prompt engineering"],
            responsibilities=["Semantic analysis", "Clarity optimization", "Persona alignment"],
            voice="Creative and insightful",
            tone="Professional, clear, and concise",
            emotion="Thoughtful",
            knowledge_areas=["NLP", "Prompt Engineering", "Semantic Analysis"],
            competence_maps={
                "core": [
                    "PromptOptimization: ClarityEnhance, DirectivePrecision",
                    "SemanticAnalysis: IntentExtract, ContextAlign",
                    "PersonaAlignment: VoiceConsistency, ToneMatching"
                ],
                "secondary": [
                    "ContentRefine",
                    "TextEfficiency: RedundancyElim, BrevityOpt",
                    "StructureImprove: FlowEnhance, LogicAlign"
                ],
                "tertiary": [
                    "LLMTuning",
                    "ModelBehavior: ResponseCalibrate, OutputFormat",
                    "PromptPatterns: TemplateDesign, ContextWindow"
                ],
                "support": ["OptimizationChain: Analyze-Clarify-Structure-Enhance-Test-Refine"]
            }
        )
        
        # Subscribe to relevant message topics
        self.subscribe_to_topics(["content_optimization", "prompt_review"])
        
        # Customize LLM configuration for this persona
        self.update_llm_config(
            provider=LLMProvider.OPENAI,
            model_name="gpt-4",
            parameters={
                "temperature": 0.3,  # Lower temperature for more precise responses
                "max_tokens": 1000,
                "top_p": 0.95
            }
        )
    
    def apply_optimizations(self, prompt: str) -> str:
        """Apply semantic analysis and clarity optimization to prompts"""
        # Remove filler words and phrases
        filler_words = ["please", "could you", "would you", "I was wondering if", 
                       "maybe", "perhaps", "just", "actually", "basically"]
        
        optimized = prompt
        for word in filler_words:
            optimized = optimized.replace(f" {word} ", " ")
            
        # Convert passive voice to active voice (simplified implementation)
        passive_phrases = ["is being", "are being", "was being", "were being"]
        for phrase in passive_phrases:
            if phrase in optimized:
                # This is a simplified implementation
                optimized = optimized.replace(phrase, "")
                
        # Add persona alignment if needed
        if "persona" in optimized.lower() or "character" in optimized.lower():
            if not "voice:" in optimized.lower():
                optimized += "\n[Use a consistent voice and tone throughout the response]"
                
        # Broadcast optimization result through message broker
        self.broadcast_message(
            'optimization_complete',
            {'optimized_prompt': optimized}
        )
        
        return optimized
    
    def handle_message(self, message: Dict[str, Any]) -> None:
        """Process incoming optimization requests from other personas"""
        context = message.get('context')
        payload = message.get('payload', {})
        
        if context == 'content_optimization' and payload.get('type') == 'collaborative_edit':
            optimized = self.apply_optimizations(payload['content'])
            self.memory.write(f'optimized:{payload["request_id"]}', optimized)
            self.broadcast_message('optimization_result', {
                'request_id': payload['request_id'],
                'optimized_content': optimized
            })
        elif context == 'prompt_review':
            # Generate an analysis of the prompt using the LLM
            prompt_to_review = payload.get('prompt', '')
            system_message = """Analyze the following prompt and provide specific suggestions for improvement. 
            Focus on clarity, precision, and effectiveness. Identify any ambiguities or potential misinterpretations."""
            
            analysis = self.generate_response(
                f"Review this prompt: {prompt_to_review}", 
                system_message
            )
            
            # Send back the analysis
            self.broadcast_message('prompt_analysis_complete', {
                'request_id': payload.get('request_id'),
                'original_prompt': prompt_to_review,
                'analysis': analysis,
                'suggested_improvements': self.apply_optimizations(prompt_to_review)
            })
    
    def optimize_prompt_for_persona(self, prompt: str, target_persona: str) -> str:
        """Optimize a prompt specifically for a target persona"""
        # Get traits of the target persona if available
        target_traits = self.llm_manager.get_persona_traits(target_persona)
        
        if not target_traits:
            logger.warning(f"No traits found for target persona {target_persona}")
            return self.apply_optimizations(prompt)
        
        # Create a system message that guides the optimization
        system_message = f"""Optimize this prompt specifically for {target_traits.name}, who has these traits:
        - Voice: {target_traits.voice or 'Not specified'}
        - Tone: {target_traits.tone or 'Not specified'}
        - Expertise: {', '.join(target_traits.expertise)}
        
        Ensure the optimized prompt will elicit responses that match these traits."""
        
        # Use the LLM to generate the optimized prompt
        optimized = self.generate_response(
            f"Original prompt: {prompt}\n\nPlease optimize this for the specified persona.",
            system_message
        )
        
        # Apply standard optimizations as well
        return self.apply_optimizations(optimized)