import asyncio
import logging
import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.lib.messaging.message_broker import MessageBroker
from src.lib.personas.inspira_personas_integration import InspiraPersonaIntegration
from src.lib.llm.beam_chat import FusionStrategy
from src.lib.llm.multimodal_beam import MultiModalBeam, MultiModalPrompt, MultiModalContent, ModalityType

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def run_text_collaboration_demo():
    """Demonstrate text-based collaboration between Inspira personas"""
    logger.info("Starting text-based collaboration demo")
    
    # Initialize the message broker
    broker = MessageBroker()
    
    # Initialize the Inspira persona integration
    integration = InspiraPersonaIntegration(broker)
    integration.initialize_from_file("Inspira_staff.txt")
    
    # List available personas
    personas = integration.list_personas()
    logger.info(f"Loaded {len(personas)} personas:")
    for persona in personas:
        logger.info(f"  - {persona['name']} ({persona['id']}): {persona['title']} - Role: {persona['role']}")
    
    # Define a complex task that requires collaboration
    task_description = """
    Develop a comprehensive strategy for implementing an AI-powered customer service 
    chatbot that can handle multiple languages, understand customer sentiment, and 
    seamlessly escalate complex issues to human agents when necessary. Include technical 
    architecture considerations, ethical guidelines, and implementation phases.
    """
    
    # Select specific personas for this task
    selected_personas = [
        "aurelio_oracle_reyes",  # Chief AI Strategist (Coordinator)
        "kiyoshi_nexus_tanaka",  # Chief Technology Officer (Specialist)
        "sanjay_vector_mehta",   # Chief Operations Officer (Specialist)
        "ryota_coda_varella"     # Cybernetic Architect (Executor)
    ]
    
    # Collaborate on the task
    logger.info("Starting collaboration on chatbot strategy task...")
    result = await integration.collaborate_on_task(task_description, selected_personas)
    
    logger.info("\nCollaboration Result:\n" + "=" * 80)
    print(result)
    logger.info("=" * 80)


async def run_multimodal_demo(image_path):
    """Demonstrate multi-modal capabilities with image analysis"""
    logger.info("Starting multi-modal demo")
    
    # Initialize the message broker
    broker = MessageBroker()
    
    # Initialize the Inspira persona integration
    integration = InspiraPersonaIntegration(broker)
    integration.initialize_from_file("Inspira_staff.txt")
    
    # Initialize the MultiModalBeam
    multimodal_beam = MultiModalBeam(broker)
    
    # Register personas with vision capabilities
    for persona_id, persona in integration.personas.items():
        # For this demo, we'll assume all personas have vision capabilities
        # In a real implementation, you would check for specific capabilities
        llm_config = persona.get_llm_config()
        if llm_config:
            multimodal_beam.register_vision_model(persona_id, llm_config)
    
    # Create a multi-modal prompt with text and image
    elements = [
        MultiModalContent(
            modality_type=ModalityType.TEXT,
            content="Analyze this UI design and provide feedback on usability, accessibility, and visual appeal."
        ),
        MultiModalContent(
            modality_type=ModalityType.IMAGE,
            content=image_path
        )
    ]
    
    prompt = MultiModalPrompt(
        elements=elements,
        system_message="You are a team of UI/UX experts analyzing a design. Provide comprehensive feedback."
    )
    
    # Process the multi-modal prompt
    logger.info("Processing multi-modal prompt...")
    responses = await multimodal_beam.process_multimodal_prompt(prompt)
    
    if responses:
        # Fuse responses using the ensemble strategy
        result = await multimodal_beam.fuse_responses(responses, FusionStrategy.ENSEMBLE)
        
        logger.info("\nMulti-Modal Analysis Result:\n" + "=" * 80)
        print(result.content)
        logger.info("=" * 80)
    else:
        logger.error("No responses received from multi-modal processing")


async def run_hierarchical_task_demo():
    """Demonstrate hierarchical task delegation and execution"""
    logger.info("Starting hierarchical task demo")
    
    # Initialize the message broker
    broker = MessageBroker()
    
    # Initialize the Inspira persona integration
    integration = InspiraPersonaIntegration(broker)
    integration.initialize_from_file("Inspira_staff.txt")
    
    # Get the agent system
    agent_system = integration.agent_system
    
    # Create a complex task with subtasks
    main_task_id = agent_system.create_task(
        "Develop a comprehensive AI ethics framework for our organization"
    )
    
    # Create subtasks with dependencies
    subtask1_id = agent_system.create_task(
        "Research existing AI ethics frameworks and standards",
        assigned_to="aurelio_oracle_reyes"  # Chief AI Strategist
    )
    
    subtask2_id = agent_system.create_task(
        "Identify key ethical considerations for our AI applications",
        assigned_to="kiyoshi_nexus_tanaka"  # Chief Technology Officer
    )
    
    subtask3_id = agent_system.create_task(
        "Draft implementation guidelines for ethical AI development",
        assigned_to="ryota_coda_varella",  # Cybernetic Architect
        dependencies=[subtask1_id, subtask2_id]  # This task depends on the first two
    )
    
    # Final task that depends on all others
    final_task_id = agent_system.create_task(
        "Synthesize all inputs into a final AI ethics framework document",
        assigned_to="sanjay_vector_mehta",  # Chief Operations Officer
        dependencies=[subtask3_id]  # This task depends on the third task
    )
    
    # Simulate task execution (in a real system, agents would handle these tasks)
    logger.info("Simulating task execution...")
    
    # Complete the first two tasks
    agent_system.update_task_status(
        subtask1_id, 
        "completed", 
        "Comprehensive research completed on IEEE, EU, and corporate AI ethics frameworks."
    )
    
    agent_system.update_task_status(
        subtask2_id, 
        "completed", 
        "Identified key considerations: transparency, fairness, privacy, accountability, and safety."
    )
    
    # The third task should now be ready
    agent_system.update_task_status(
        subtask3_id, 
        "completed", 
        "Implementation guidelines drafted with specific practices for each ethical consideration."
    )
    
    # The final task should now be ready
    # Instead of manually updating, let's use BeamChat for the final synthesis
    logger.info("Using BeamChat for final synthesis...")
    
    # Get all completed task results
    task_results = [
        agent_system.tasks[task_id].result 
        for task_id in [subtask1_id, subtask2_id, subtask3_id] 
        if agent_system.tasks[task_id].status == "completed"
    ]
    
    # Create a prompt that includes all previous results
    synthesis_prompt = f"""
    Synthesize the following inputs into a comprehensive AI ethics framework document:
    
    {' '.join(task_results)}
    """
    
    # Collaborate on the final synthesis
    result = await integration.collaborate_on_task(synthesis_prompt)
    
    # Update the final task with the result
    agent_system.update_task_status(final_task_id, "completed", result)
    
    logger.info("\nFinal AI Ethics Framework:\n" + "=" * 80)
    print(agent_system.tasks[final_task_id].result)
    logger.info("=" * 80)


async def main():
    """Run all demos"""
    # Uncomment the demos you want to run
    
    # Text-based collaboration demo
    await run_text_collaboration_demo()
    
    # Multi-modal demo (requires an image file)
    # Replace with the path to an actual UI design image
    # image_path = "path/to/ui_design.jpg"
    # await run_multimodal_demo(image_path)
    
    # Hierarchical task demo
    # await run_hierarchical_task_demo()


if __name__ == "__main__":
    asyncio.run(main())