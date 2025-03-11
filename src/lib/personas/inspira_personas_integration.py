from typing import Dict, List, Optional, Any, Union
import logging
import re

from ..personas.enhanced_ai_persona import EnhancedAIPersona
from ..llm.persona_llm_manager import LLMProvider, LLMConfig, PersonaTraits
from ..llm.hierarchical_agent_system import HierarchicalAgentSystem, AgentRole
from ..messaging.message_broker import MessageBroker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class InspiraPersonaFactory:
    """Factory class for creating Inspira personas from staff definitions"""
    
    def __init__(self, broker: MessageBroker):
        self.broker = broker
        self.agent_system = HierarchicalAgentSystem(broker)
    
    def load_personas_from_file(self, file_path: str) -> Dict[str, EnhancedAIPersona]:
        """Load personas from the Inspira staff file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse the content to extract persona definitions
            personas = {}
            
            # Split by persona sections (starting with # and a number)
            sections = re.split(r'#\s+\d+️⃣\s+', content)
            
            # Process each section (skip the first if it's just the intro)
            for section in sections[1:] if len(sections) > 1 else sections:
                persona = self._parse_persona_section(section)
                if persona:
                    personas[persona.persona_id] = persona
            
            logger.info(f"Loaded {len(personas)} personas from {file_path}")
            return personas
        except Exception as e:
            logger.error(f"Error loading personas from {file_path}: {str(e)}")
            return {}
    
    def _parse_persona_section(self, section: str) -> Optional[EnhancedAIPersona]:
        """Parse a persona section from the staff file"""
        try:
            # Extract name and title
            name_match = re.search(r'\*\*Name:\*\*\s+([^\n]+)', section)
            title_match = re.search(r'\*\*Title:\*\*\s+([^\n]+)', section)
            
            if not name_match or not title_match:
                return None
            
            name = name_match.group(1).strip()
            title = title_match.group(1).strip()
            
            # Generate a persona ID
            persona_id = name.lower().replace(' ', '_').replace('"', '').replace('\'', '')
            
            # Extract expertise and responsibilities from Character Insights
            expertise = []
            responsibilities = []
            
            # Look for Character Insights section
            insights_match = re.search(r'## Character Insights\s+(.+?)\s+##', section, re.DOTALL)
            if insights_match:
                insights = insights_match.group(1)
                
                # Extract expertise
                expertise_match = re.search(r'\*\*Expertise:\*\*\s+([^\n]+)', insights)
                if expertise_match:
                    expertise = [e.strip() for e in expertise_match.group(1).split(',')]
                
                # Extract responsibilities
                resp_match = re.search(r'\*\*Responsibilities:\*\*\s+([^\n]+)', insights)
                if resp_match:
                    responsibilities = [r.strip() for r in resp_match.group(1).split(',')]
            
            # Extract voice, tone, and emotion from Speech & Cognitive Style
            voice = None
            tone = None
            emotion = None
            
            # Look for Speech & Cognitive Style section
            style_match = re.search(r'## Speech & Cognitive Style\s+(.+?)\s+##', section, re.DOTALL)
            if style_match:
                style = style_match.group(1)
                
                # Extract voice
                voice_match = re.search(r'\*\*Communication:\*\*\s+([^\n]+)', style)
                if voice_match:
                    voice = voice_match.group(1).strip()
                
                # Extract tone
                tone_match = re.search(r'\*\*Tone:\*\*\s+([^\n]+)', style)
                if tone_match:
                    tone = tone_match.group(1).strip()
                
                # Extract emotion
                emotion_match = re.search(r'\*\*Style:\*\*\s+([^\n]+)', style)
                if emotion_match:
                    emotion = emotion_match.group(1).strip()
            
            # Extract competence maps from Enhanced Skill Chains
            competence_maps = {}
            
            # Look for Enhanced Skill Chains section
            chains_match = re.search(r'## Enhanced Skill Chains\s+(.+?)\s+##', section, re.DOTALL)
            if chains_match:
                chains = chains_match.group(1)
                
                # Extract core competencies
                core_match = re.search(r'\*\*\{Core\}:\*\*\s+```\s+(.+?)\s+```', chains, re.DOTALL)
                if core_match:
                    competence_maps['core'] = [line.strip() for line in core_match.group(1).split('\n') if line.strip()]
                
                # Extract secondary competencies
                secondary_match = re.search(r'\*\*\{Secondary\}:\*\*\s+```\s+(.+?)\s+```', chains, re.DOTALL)
                if secondary_match:
                    competence_maps['secondary'] = [line.strip() for line in secondary_match.group(1).split('\n') if line.strip()]
                
                # Extract tertiary competencies
                tertiary_match = re.search(r'\*\*\{Tertiary\}:\*\*\s+```\s+(.+?)\s+```', chains, re.DOTALL)
                if tertiary_match:
                    competence_maps['tertiary'] = [line.strip() for line in tertiary_match.group(1).split('\n') if line.strip()]
                
                # Extract support chain
                support_match = re.search(r'\*\*\{Support\}:\*\*\s+```\s+(.+?)\s+```', chains, re.DOTALL)
                if support_match:
                    competence_maps['support'] = [line.strip() for line in support_match.group(1).split('\n') if line.strip()]
            
            # Create the persona
            persona = EnhancedAIPersona(
                persona_id=persona_id,
                name=name,
                title=title,
                expertise=expertise,
                responsibilities=responsibilities,
                voice=voice,
                tone=tone,
                emotion=emotion,
                knowledge_areas=expertise,  # Use expertise as knowledge areas for simplicity
                competence_maps=competence_maps
            )
            
            return persona
        except Exception as e:
            logger.error(f"Error parsing persona section: {str(e)}")
            return None
    
    def register_personas_with_agent_system(self, personas: Dict[str, EnhancedAIPersona]) -> None:
        """Register personas with the hierarchical agent system"""
        for persona_id, persona in personas.items():
            # Determine the appropriate role based on the persona's title
            role = self._determine_agent_role(persona.title)
            
            # Determine capabilities based on expertise and responsibilities
            capabilities = list(set(persona.expertise + persona.responsibilities))
            
            # Register with the agent system
            self.agent_system.register_agent(persona, role, capabilities)
            
            logger.info(f"Registered persona {persona.name} with role {role.value}")
    
    def _determine_agent_role(self, title: str) -> AgentRole:
        """Determine the appropriate agent role based on the persona's title"""
        title_lower = title.lower()
        
        if any(term in title_lower for term in ['chief', 'ceo', 'strategist', 'director']):
            return AgentRole.COORDINATOR
        elif any(term in title_lower for term in ['engineer', 'developer', 'programmer']):
            return AgentRole.EXECUTOR
        elif any(term in title_lower for term in ['analyst', 'researcher', 'scientist']):
            return AgentRole.RESEARCHER
        elif any(term in title_lower for term in ['critic', 'evaluator', 'tester']):
            return AgentRole.CRITIC
        else:
            return AgentRole.SPECIALIST


class InspiraPersonaIntegration:
    """Integration class for connecting Inspira personas with BeamChat"""
    
    def __init__(self, broker: MessageBroker):
        self.broker = broker
        self.factory = InspiraPersonaFactory(broker)
        self.personas: Dict[str, EnhancedAIPersona] = {}
        self.agent_system = self.factory.agent_system
    
    def initialize_from_file(self, file_path: str) -> None:
        """Initialize the integration from a staff file"""
        # Load personas from file
        self.personas = self.factory.load_personas_from_file(file_path)
        
        # Register personas with the agent system
        self.factory.register_personas_with_agent_system(self.personas)
        
        logger.info(f"Initialized {len(self.personas)} personas from {file_path}")
    
    def get_persona(self, persona_id: str) -> Optional[EnhancedAIPersona]:
        """Get a persona by ID"""
        return self.personas.get(persona_id)
    
    def list_personas(self) -> List[Dict[str, Any]]:
        """List all registered personas with their basic information"""
        return [
            {
                "id": persona.persona_id,
                "name": persona.name,
                "title": persona.title,
                "role": self.factory._determine_agent_role(persona.title).value
            }
            for persona in self.personas.values()
        ]
    
    async def collaborate_on_task(self, task_description: str, persona_ids: Optional[List[str]] = None) -> str:
        """Have personas collaborate on a task using BeamChat"""
        # If no specific personas are specified, use all available personas
        if not persona_ids:
            persona_ids = list(self.personas.keys())
        
        # Create a task in the agent system
        task_id = self.agent_system.create_task(task_description)
        
        # Have the specified personas collaborate on the task
        result = await self.agent_system.collaborate_on_task(task_id, persona_ids)
        
        if result:
            return result.content
        else:
            return f"Error: Failed to collaborate on task '{task_description}'"