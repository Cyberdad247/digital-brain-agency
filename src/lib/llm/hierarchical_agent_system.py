from typing import Dict, List, Optional, Any, Union, Callable
import logging
import asyncio
from enum import Enum
from dataclasses import dataclass, field

from ..llm.persona_llm_manager import LLMProvider, LLMConfig, PersonaTraits
from ..llm.beam_chat import BeamChat, FusionStrategy, ModelResponse, FusionResult
from ..messaging.message_broker import MessageBroker
from ..messaging.shared_memory import SharedMemoryManager
from ..personas.enhanced_ai_persona import EnhancedAIPersona

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AgentRole(Enum):
    """Roles for agents in a hierarchical system"""
    COORDINATOR = "coordinator"  # Manages and delegates tasks
    SPECIALIST = "specialist"    # Handles specific domain tasks
    CRITIC = "critic"            # Evaluates outputs and provides feedback
    RESEARCHER = "researcher"    # Gathers information
    EXECUTOR = "executor"        # Implements actions


@dataclass
class AgentTask:
    """Task assigned to an agent"""
    task_id: str
    description: str
    assigned_to: str  # persona_id
    status: str = "pending"  # pending, in_progress, completed, failed
    result: Optional[Any] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    dependencies: List[str] = field(default_factory=list)  # List of task_ids this task depends on


class HierarchicalAgentSystem:
    """Manages a hierarchical system of AI agents with different roles"""
    
    def __init__(self, broker: MessageBroker):
        self.broker = broker
        self.memory = SharedMemoryManager(broker, "hierarchical_agents")
        self.beam_chat = BeamChat(broker)
        self.agents: Dict[str, Dict[str, Any]] = {}  # persona_id -> {persona, role, capabilities}
        self.tasks: Dict[str, AgentTask] = {}
        
        # Subscribe to relevant message topics
        self.broker.subscribe_to_context("agent_task_request", self._handle_task_request)
        self.broker.subscribe_to_context("agent_task_update", self._handle_task_update)
        self.broker.subscribe_to_context("agent_collaboration_request", self._handle_collaboration_request)
    
    def register_agent(self, persona: EnhancedAIPersona, role: AgentRole, 
                      capabilities: List[str] = None) -> None:
        """Register an agent with the system"""
        self.agents[persona.persona_id] = {
            "persona": persona,
            "role": role,
            "capabilities": capabilities or []
        }
        
        # Register the agent's LLM configuration with BeamChat
        llm_config = persona.get_llm_config()
        if llm_config:
            self.beam_chat.register_model(persona.persona_id, llm_config)
        
        logger.info(f"Registered agent {persona.name} ({persona.persona_id}) with role {role.value}")
    
    def get_agents_by_role(self, role: AgentRole) -> List[str]:
        """Get all agent IDs with a specific role"""
        return [agent_id for agent_id, info in self.agents.items() if info["role"] == role]
    
    def get_agents_by_capability(self, capability: str) -> List[str]:
        """Get all agent IDs with a specific capability"""
        return [agent_id for agent_id, info in self.agents.items() 
                if capability in info["capabilities"]]
    
    def create_task(self, description: str, assigned_to: Optional[str] = None, 
                   dependencies: List[str] = None) -> str:
        """Create a new task and optionally assign it to an agent"""
        import uuid
        task_id = str(uuid.uuid4())
        
        # If no agent specified, assign to a coordinator
        if not assigned_to:
            coordinators = self.get_agents_by_role(AgentRole.COORDINATOR)
            if coordinators:
                assigned_to = coordinators[0]
            else:
                logger.warning("No coordinator agents available for task assignment")
                assigned_to = "unassigned"
        
        task = AgentTask(
            task_id=task_id,
            description=description,
            assigned_to=assigned_to,
            dependencies=dependencies or []
        )
        
        self.tasks[task_id] = task
        
        # Notify the assigned agent
        if assigned_to != "unassigned":
            self.broker.route_message(
                "system",
                "agent_task_assignment",
                {
                    "task_id": task_id,
                    "description": description,
                    "dependencies": dependencies or []
                }
            )
        
        return task_id
    
    def update_task_status(self, task_id: str, status: str, result: Optional[Any] = None) -> bool:
        """Update the status of a task"""
        if task_id not in self.tasks:
            logger.warning(f"Task {task_id} not found")
            return False
        
        self.tasks[task_id].status = status
        if result is not None:
            self.tasks[task_id].result = result
        
        # Broadcast task update
        self.broker.broadcast_system_message(
            "task_status_update",
            {
                "task_id": task_id,
                "status": status,
                "result": result
            }
        )
        
        # Check if any dependent tasks can now be started
        self._check_dependent_tasks(task_id)
        
        return True
    
    def _check_dependent_tasks(self, completed_task_id: str) -> None:
        """Check if any tasks depending on the completed task can now be started"""
        for task_id, task in self.tasks.items():
            if (task.status == "pending" and 
                completed_task_id in task.dependencies and
                all(self.tasks[dep].status == "completed" for dep in task.dependencies)):
                
                # All dependencies are completed, task can be started
                self.update_task_status(task_id, "ready")
                
                # Notify the assigned agent
                self.broker.route_message(
                    "system",
                    "agent_task_ready",
                    {
                        "task_id": task_id,
                        "description": task.description
                    }
                )
    
    async def collaborate_on_task(self, task_id: str, agent_ids: List[str], 
                               fusion_strategy: FusionStrategy = FusionStrategy.ENSEMBLE) -> Optional[FusionResult]:
        """Have multiple agents collaborate on a task using BeamChat"""
        if task_id not in self.tasks:
            logger.warning(f"Task {task_id} not found")
            return None
        
        task = self.tasks[task_id]
        
        # Generate responses from all specified agents
        responses = await self.beam_chat.generate_responses(
            prompt=task.description,
            system_message=f"Collaborate on this task: {task.description}",
            model_ids=agent_ids
        )
        
        if not responses:
            logger.warning(f"No responses generated for task {task_id}")
            return None
        
        # Fuse responses using the specified strategy
        result = await self.beam_chat.fuse_responses(responses, fusion_strategy)
        
        # Update task with the result
        self.update_task_status(task_id, "completed", result.content)
        
        return result
    
    def _handle_task_request(self, message: Dict[str, Any]) -> None:
        """Handle incoming task requests"""
        payload = message.get('payload', {})
        description = payload.get('description')
        assigned_to = payload.get('assigned_to')
        dependencies = payload.get('dependencies')
        
        if not description:
            logger.error("Invalid task request: missing description")
            return
        
        task_id = self.create_task(description, assigned_to, dependencies)
        
        # Respond with the created task ID
        self.broker.route_message(
            "system",
            "agent_task_created",
            {
                "task_id": task_id,
                "status": "pending"
            }
        )
    
    def _handle_task_update(self, message: Dict[str, Any]) -> None:
        """Handle incoming task updates"""
        payload = message.get('payload', {})
        task_id = payload.get('task_id')
        status = payload.get('status')
        result = payload.get('result')
        
        if not task_id or not status:
            logger.error("Invalid task update: missing task_id or status")
            return
        
        self.update_task_status(task_id, status, result)
    
    def _handle_collaboration_request(self, message: Dict[str, Any]) -> None:
        """Handle incoming collaboration requests"""
        payload = message.get('payload', {})
        task_id = payload.get('task_id')
        agent_ids = payload.get('agent_ids')
        strategy = payload.get('strategy', FusionStrategy.ENSEMBLE.value)
        
        if not task_id or not agent_ids:
            logger.error("Invalid collaboration request: missing task_id or agent_ids")
            return
        
        # Process collaboration request asynchronously
        asyncio.create_task(self._process_collaboration_request(
            task_id, agent_ids, FusionStrategy(strategy)
        ))
    
    async def _process_collaboration_request(self, task_id: str, agent_ids: List[str],
                                          strategy: FusionStrategy) -> None:
        """Process a collaboration request asynchronously"""
        try:
            result = await self.collaborate_on_task(task_id, agent_ids, strategy)
            
            if result:
                # Store result in memory
                self.memory.write(f"collaboration:{task_id}", {
                    "content": result.content,
                    "confidence": result.confidence,
                    "strategy": result.strategy.value,
                    "agents": agent_ids
                })
                
                # Broadcast result
                self.broker.broadcast_system_message(
                    'collaboration_result',
                    {
                        'task_id': task_id,
                        'content': result.content,
                        'confidence': result.confidence,
                        'strategy': result.strategy.value,
                        'agents': agent_ids
                    }
                )
        except Exception as e:
            logger.error(f"Error processing collaboration request for task {task_id}: {str(e)}")
            self.broker.broadcast_system_message(
                'collaboration_error',
                {
                    'task_id': task_id,
                    'error': str(e)
                }
            )