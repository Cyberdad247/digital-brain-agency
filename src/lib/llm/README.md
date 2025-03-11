# BeamChat Multi-Agent Architecture

This module implements an advanced multi-agent architecture that orchestrates AI personas with multi-modal capabilities and hierarchical collaboration patterns.

## System Overview

BeamChat operates as a multi-modal decision-making framework that orchestrates interactions between AI agents or personas. The system is designed to leverage the strengths of multiple models and personas to generate more comprehensive and accurate responses.

### Core Components

1. **BeamChat**: The central orchestration engine that manages multi-model collaboration and response fusion
2. **HierarchicalAgentSystem**: Manages a hierarchical system of AI agents with different roles and responsibilities
3. **MultiModalBeam**: Extends BeamChat with multi-modal capabilities for processing text, images, audio, and video
4. **InspiraPersonaIntegration**: Connects the Inspira staff personas with the BeamChat system

## Key Features

### 1. Multi-Model Collaboration

- Simultaneously engages diverse AI models (e.g., OpenAI, Anthropic) to generate responses
- Combines the strengths of different models for richer outputs
- Reduces hallucinations by aggregating responses from multiple models

### 2. Fusion Techniques

- **Auto-Select**: Automatically selects the best response based on confidence and latency
- **Checklist**: Evaluates responses against a checklist of criteria
- **Weighted**: Weights responses based on model capabilities
- **Ensemble**: Combines multiple responses into a coherent ensemble

### 3. Hierarchical Agent Teams

- **Coordinator Agents**: Manage and delegate tasks to other agents
- **Specialist Agents**: Handle specific domain tasks
- **Critic Agents**: Evaluate outputs and provide feedback
- **Researcher Agents**: Gather information
- **Executor Agents**: Implement actions

### 4. Multi-Modal Processing

- Process text, images, audio, and video inputs
- Integrate vision-language models for analyzing visual data
- Support for multi-modal prompts with mixed content types

## Usage Examples

### Basic Text Collaboration

```python
from src.lib.messaging.message_broker import MessageBroker
from src.lib.personas.inspira_personas_integration import InspiraPersonaIntegration

# Initialize the message broker
broker = MessageBroker()

# Initialize the Inspira persona integration
integration = InspiraPersonaIntegration(broker)
integration.initialize_from_file("Inspira_staff.txt")

# Define a task and select personas
task_description = "Develop a comprehensive AI strategy..."
selected_personas = [
    "aurelio_oracle_reyes",  # Chief AI Strategist
    "kiyoshi_nexus_tanaka",  # Chief Technology Officer
]

# Collaborate on the task
result = await integration.collaborate_on_task(task_description, selected_personas)
print(result)
```

### Multi-Modal Processing

```python
from src.lib.llm.multimodal_beam import MultiModalBeam, MultiModalPrompt, MultiModalContent, ModalityType
from src.lib.llm.beam_chat import FusionStrategy

# Initialize the MultiModalBeam
multimodal_beam = MultiModalBeam(broker)

# Register personas with vision capabilities
for persona_id, persona in integration.personas.items():
    llm_config = persona.get_llm_config()
    if llm_config:
        multimodal_beam.register_vision_model(persona_id, llm_config)

# Create a multi-modal prompt with text and image
elements = [
    MultiModalContent(
        modality_type=ModalityType.TEXT,
        content="Analyze this UI design..."
    ),
    MultiModalContent(
        modality_type=ModalityType.IMAGE,
        content="path/to/image.jpg"
    )
]

prompt = MultiModalPrompt(
    elements=elements,
    system_message="You are a team of UI/UX experts..."
)

# Process the multi-modal prompt
responses = await multimodal_beam.process_multimodal_prompt(prompt)
result = await multimodal_beam.fuse_responses(responses, FusionStrategy.ENSEMBLE)
print(result.content)
```

### Hierarchical Task Management

```python
# Get the agent system
agent_system = integration.agent_system

# Create a complex task with subtasks
main_task_id = agent_system.create_task(
    "Develop a comprehensive AI ethics framework"
)

# Create subtasks with dependencies
subtask1_id = agent_system.create_task(
    "Research existing AI ethics frameworks",
    assigned_to="aurelio_oracle_reyes"  # Chief AI Strategist
)

subtask2_id = agent_system.create_task(
    "Identify key ethical considerations",
    assigned_to="kiyoshi_nexus_tanaka",  # Chief Technology Officer
    dependencies=[subtask1_id]  # This task depends on the first task
)

# Update task status
agent_system.update_task_status(
    subtask1_id, 
    "completed", 
    "Comprehensive research completed..."
)
```

## Performance Optimizations

- **Parallel Execution**: All model requests are executed in parallel using asyncio
- **Efficient Memory Management**: Shared memory system for efficient data sharing between agents
- **Lightweight Architecture**: Optimized for rapid scaling of multi-agent workflows

## Future Directions

- **Temporal Reasoning**: Extend with video analysis capabilities to predict future states
- **Cross-Domain Generalization**: Apply insights from agent-based modeling theory
- **Ethical Guardrails**: Develop automated moderation tools for content filtering

## Integration with Existing Systems

The BeamChat system is designed to integrate seamlessly with the existing persona framework. It leverages the EnhancedAIPersona base class and the PersonaLLMManager to configure and manage LLM settings for different personas.

For more detailed examples, see the `examples/beam_chat_demo.py` file.