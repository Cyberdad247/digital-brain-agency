#!/usr/bin/env python
# Example script demonstrating the multi-persona agent architecture with LLM integration

import os
import sys
import logging

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.lib.personas.persona_agent_manager import get_persona_manager
from src.lib.personas.zara_kapoor import ZaraKapoor
from src.lib.personas.ryota_varella import RyotaVarella
from src.lib.llm.persona_llm_manager import LLMProvider

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    """Demonstrate the multi-persona agent architecture"""
    logger.info("Initializing persona agent manager...")
    
    # Get the singleton manager instance
    manager = get_persona_manager()
    
    # Register API keys (in a real application, these would be loaded from environment variables or secure storage)
    logger.info("Configuring API keys...")
    try:
        # These are placeholder keys - replace with actual keys in a real application
        # In production, use environment variables or secure key management
        manager.add_api_key(LLMProvider.OPENAI, "default", os.environ.get("OPENAI_API_KEY", "sk-placeholder"))
        manager.add_api_key(LLMProvider.ANTHROPIC, "default", os.environ.get("ANTHROPIC_API_KEY", "sk-ant-placeholder"))
        
        logger.info("API keys configured successfully")
    except Exception as e:
        logger.error(f"Error configuring API keys: {str(e)}")
        return
    
    # Create and register personas
    logger.info("Creating and registering personas...")
    try:
        zara = ZaraKapoor()
        ryota = RyotaVarella()
        
        manager.register_persona(zara)
        manager.register_persona(ryota)
        
        logger.info("Personas registered successfully")
    except Exception as e:
        logger.error(f"Error registering personas: {str(e)}")
        return
    
    # List registered personas
    logger.info("Registered personas:")
    for persona_info in manager.list_personas():
        logger.info(f"  - {persona_info['name']} ({persona_info['id']})")
    
    # Example 1: Find the best persona for a task
    logger.info("\nExample 1: Finding the best persona for a task")
    task = "Optimize this prompt for clarity and precision: 'Please could you maybe generate some kind of analysis of this data?'"
    
    best_persona = manager.get_best_persona_for_task(task)
    if best_persona:
        logger.info(f"Best persona for task: {best_persona.name}")
        
        # Generate a response (this would call the LLM in a real application with valid API keys)
        logger.info(f"Generating response from {best_persona.name}...")
        try:
            # In a demo without valid API keys, this would fail
            # response = best_persona.generate_response(task)
            # logger.info(f"Response: {response}")
            
            # Instead, we'll use the apply_optimizations method which doesn't require API calls
            optimized = best_persona.apply_optimizations(task.split(":")[1].strip())
            logger.info(f"Optimized prompt: {optimized}")
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
    else:
        logger.info("No suitable persona found for this task")
    
    # Example 2: Manually select a persona for a specific task
    logger.info("\nExample 2: Using a specific persona for a task")
    symbolic_task = "Create a symbolic representation of the concept: 'Multi-agent AI systems with collaborative learning'"
    
    ryota_persona = manager.get_persona("ryota-varella-001")
    if ryota_persona:
        logger.info(f"Using {ryota_persona.name} for symbolic representation")
        try:
            # In a demo without valid API keys, this would fail
            # symbolic_result = ryota_persona.create_symbolic_representation("Multi-agent AI systems with collaborative learning")
            # logger.info(f"Symbolic representation: {symbolic_result}")
            
            # Instead, we'll use the apply_optimizations method which doesn't require API calls
            compressed = ryota_persona.apply_optimizations("Multi-agent AI systems with collaborative learning")
            logger.info(f"Compressed representation: {compressed}")
        except Exception as e:
            logger.error(f"Error creating symbolic representation: {str(e)}")
    
    # Example 3: Demonstrate persona collaboration (simulated)
    logger.info("\nExample 3: Multi-persona collaboration (simulated)")
    collab_task = "Design a symbolic AI system with optimized prompts for a customer service application"
    
    logger.info(f"Collaboration task: {collab_task}")
    logger.info(f"Collaborating personas: {zara.name} and {ryota.name}")
    
    # In a real application with valid API keys, we would use:
    # results = manager.collaborate(collab_task, ["zara-kapoor-001", "ryota-varella-001"])
    
    # Simulate the collaboration process
    logger.info("Simulated collaboration process:")
    logger.info(f"1. {zara.name} optimizes the prompts for clarity and user engagement")
    logger.info(f"2. {ryota.name} creates symbolic representations for efficient processing")
    logger.info(f"3. Both personas collaborate on the final system design")
    
    logger.info("\nMulti-persona agent architecture demonstration completed successfully!")

if __name__ == "__main__":
    main()