# Multi-Persona Agent Architecture with LLM Integration

This module implements a flexible multi-persona agent architecture that automatically infuses specific LLM configurations based on persona traits and provides manual API key management capabilities.

## System Overview

### Core Components

1. **Enhanced AI Personas**: Base class and implementations for AI personas with LLM integration
2. **Persona LLM Manager**: Manages LLM configurations for different personas
3. **API Key Manager**: Securely stores and manages API keys for different LLM providers
4. **Persona Agent Manager**: Coordinates persona registration, selection, and collaboration

### Architecture Diagram

```
┌─────────────────────────┐      ┌─────────────────────────┐
│                         │      │                         │
│    Persona Agent        │◄────►│    Persona LLM          │
│    Manager              │      │    Manager              │
│                         │      │                         │
└───────────┬─────────────┘      └───────────┬─────────────┘
            │                                │
            │                                │
            ▼                                ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│                         │      │                         │
│    Enhanced AI          │◄────►│    API Key              │
│    Persona              │      │    Manager              │
│                         │      │                         │
└───────────┬─────────────┘      └─────────────────────────┘
            │
            │
            ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│                         │      │                         │
│    Concrete Persona     │◄────►│    Message Broker &     │
│    Implementations      │      │    Shared Memory        │
│                         │      │                         │
└─────────────────────────┘      └─────────────────────────┘
```

## Key Features

### 1. Persona-Specific LLM Integration

- Each persona automatically gets assigned an appropriate LLM configuration based on its traits
- LLM parameters (temperature, tokens, etc.) are tuned to match persona characteristics
- Support for multiple LLM providers (OpenAI, Anthropic, etc.)

### 2. Secure API Key Management

- Centralized storage and management of API keys
- Support for multiple keys per provider
- Fallback to environment variables
- Key rotation capabilities

### 3. Trait-Based Persona Selection

- Automatic selection of the most appropriate persona for a given task
- Matching based on expertise, responsibilities, and knowledge areas

### 4. Multi-Persona Collaboration

- Coordinate multiple personas working together on complex tasks
- Message passing between personas via shared broker
- Memory sharing for collaborative work

## Usage Examples

### Registering a New Persona

```python
from src.lib.personas.persona_agent_manager import get_persona_manager
from src.lib.personas.zara_kapoor import ZaraKapoor

# Get the singleton manager instance
manager = get_persona_manager()

# Create and register a persona
zara = ZaraKapoor()
manager.register_persona(zara)
```

### Configuring API Keys

```python
from src.lib.personas.persona_agent_manager import get_persona_manager
from src.lib.llm.persona_llm_manager import LLMProvider

manager = get_persona_manager()

# Add API keys
manager.add_api_key(LLMProvider.OPENAI, "default", "sk-...")
manager.add_api_key(LLMProvider.ANTHROPIC, "default", "sk-ant-...")
```

### Finding the Best Persona for a Task

```python
from src.lib.personas.persona_agent_manager import get_persona_manager

manager = get_persona_manager()

# Find the best persona for a task
task = "Optimize this prompt for clarity and precision"
best_persona = manager.get_best_persona_for_task(task)

if best_persona:
    response = best_persona.generate_response(task)
    print(f"{best_persona.name} says: {response}")
```

### Multi-Persona Collaboration

```python
from src.lib.personas.persona_agent_manager import get_persona_manager

manager = get_persona_manager()

# Collaborate with multiple personas
task = "Design a symbolic AI system with optimized prompts"
results = manager.collaborate(task, ["zara-kapoor-001", "ryota-varella-001"])

for persona_id, result in results["results"].items():
    print(f"{result['name']}: {result['response'][:100]}...")
```

## Extending the System

### Creating a New Persona

To create a new persona, extend the `EnhancedAIPersona` class:

```python
from src.lib.personas.enhanced_ai_persona import EnhancedAIPersona
from src.lib.llm.persona_llm_manager import LLMProvider

class MyNewPersona(EnhancedAIPersona):
    def __init__(self):
        super().__init__(
            persona_id="my-persona-001",
            name="My Persona Name",
            title="My Persona Title",
            expertise=["Area 1", "Area 2"],
            responsibilities=["Task 1", "Task 2"],
            voice="Description of voice",
            tone="Description of tone",
            emotion="Primary emotion"
        )
        
        # Customize LLM configuration
        self.update_llm_config(
            provider=LLMProvider.OPENAI,
            model_name="gpt-4",
            parameters={
                "temperature": 0.7,
                "max_tokens": 1000
            }
        )
    
    def apply_optimizations(self, content: str) -> str:
        # Implement persona-specific content processing
        return content
    
    def handle_message(self, message: Dict[str, Any]) -> None:
        # Implement message handling logic
        pass
```