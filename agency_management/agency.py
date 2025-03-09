from datetime import datetime
import io
import csv
from voice_chat.google_voice_connector import GoogleVoiceConnector

class Agency:
    def __init__(self):
        self.departments = {
            'client_management': ClientManagementDepartment(),
            # Removed creative_content and digital_marketing departments
            'technical_analytics': TechnicalAnalyticsDepartment(),
            'project_management': ProjectManagementDepartment()
        }
        self.projects = []
        self.clients = []
        self._persona_name_cache = {}  # Initialize cache for memoization

    def assign_project(self, project):
        """Assign project to relevant departments based on project requirements"""
        # Basic implementation - assign to all departments
        for department in self.departments.values():
            department.assign_task(project)

    def generate_reports(self):
        """Generate agency-wide reports including persona performance metrics"""
        report = {
            'total_projects': len(self.projects),
            'total_clients': len(self.clients),
            'department_stats': {
                name: {
                    'staff_count': len(dept.staff),
                    'task_count': len(dept.tasks),
                    'agent_stats': self._get_agent_stats(dept)
                } for name, dept in self.departments.items()
            },
            'persona_performance': self._get_persona_performance()
        }
        return report
        
    def _get_agent_stats(self, department):
        """Get statistics for agents in a department"""
        stats = {
            'total_agents': len(department.agents),
            'active_tasks': 0,
            'completed_tasks': 0,
            'failed_tasks': 0
        }
        
        for agent in department.agents:
            if hasattr(agent, 'current_task'):
                if agent.current_task['status'] == 'In Progress':
                    stats['active_tasks'] += 1
                elif agent.current_task['status'] == 'Completed':
                    stats['completed_tasks'] += 1
                elif agent.current_task['status'] == 'Failed':
                    stats['failed_tasks'] += 1
                    
        return stats
        
    def _get_persona_performance(self):
        """Get performance metrics across all personas"""
        performance = {}
        
        # Collect performance data from departments
        for dept in self.departments.values():
            dept_persona_data = dept.get_persona_data()
            
            for persona_data, metrics in dept_persona_data.items():
                persona_name = self._extract_persona_name(persona_data)
                
                if persona_name not in performance:
                    performance[persona_name] = {
                        'tasks_completed': 0,
                        'tasks_failed': 0,
                        'average_duration': 0
                    }
                
                # Update performance metrics
                performance[persona_name]['tasks_completed'] += metrics['tasks_completed']
                performance[persona_name]['tasks_failed'] += metrics['tasks_failed']
                
                # Calculate average duration
                if metrics['task_count'] > 0:
                    # Calculate weighted average
                    total_tasks = performance[persona_name]['tasks_completed']
                    if total_tasks > 0:
                        current_avg = performance[persona_name]['average_duration']
                        current_total = current_avg * (total_tasks - metrics['tasks_completed'])
                        new_avg = (current_total + metrics['total_duration']) / total_tasks
                        performance[persona_name]['average_duration'] = new_avg
        
        # Fallback to old method for backward compatibility
        if not performance:
            for dept in self.departments.values():
                for agent in dept.agents:
                    if agent.persona_data:
                        persona_name = self._extract_persona_name(agent.persona_data)
                        if persona_name not in performance:
                            performance[persona_name] = {
                                'tasks_completed': 0,
                                'tasks_failed': 0,
                                'average_duration': 0
                            }
                            
                        if hasattr(agent, 'current_task'):
                            if agent.current_task['status'] == 'Completed':
                                performance[persona_name]['tasks_completed'] += 1
                                duration = (agent.current_task['end_time'] - 
                                          agent.current_task['start_time']).total_seconds()
                                performance[persona_name]['average_duration'] = (
                                    (performance[persona_name]['average_duration'] * 
                                     (performance[persona_name]['tasks_completed'] - 1) + 
                                     duration) / performance[persona_name]['tasks_completed']
                                )
                            elif agent.current_task['status'] == 'Failed':
                                performance[persona_name]['tasks_failed'] += 1
                            
        return performance
        
    def _extract_persona_name(self, persona_data):
        """Extract persona name from persona data (Memoized)"""
        # Check if result is already in cache
        if persona_data in self._persona_name_cache:
            return self._persona_name_cache[persona_data]
            
        # Look for the persona name in the data
        if "Persona:" in persona_data:
            name = persona_data.split("Persona:")[1].split("\n")[0].strip()
            self._persona_name_cache[persona_data] = name  # Store in cache
            return name
        
        # Store default name in cache
        self._persona_name_cache[persona_data] = "Unnamed Persona"
        return "Unnamed Persona"

    def generate_visual_report(self, report_format='text'):
        """Generate visual representation of agency performance"""
        import json
        report = self.generate_reports()
        
        if report_format == 'text':
            return self._format_text_report(report)
        elif report_format == 'json':
            return json.dumps(report, indent=2)
        elif report_format == 'csv':
            return self._format_csv_report(report)
        else:
            raise ValueError(f"Unsupported report format: {report_format}")
            
    def _format_text_report(self, report):
        """Format report as human-readable text"""
        text = []
        text.append(f"Agency Performance Report")
        text.append(f"Total Projects: {report['total_projects']}")
        text.append(f"Total Clients: {report['total_clients']}")
        text.append("\nDepartment Statistics:")
        
        for dept_name, stats in report['department_stats'].items():
            text.append(f"\n{dept_name.title().replace('_', ' ')}:")
            text.append(f"  Staff: {stats['staff_count']}")
            text.append(f"  Tasks: {stats['task_count']}")
            text.append(f"  Agents: {stats['agent_stats']['total_agents']}")
            text.append(f"  Active Tasks: {stats['agent_stats']['active_tasks']}")
            text.append(f"  Completed Tasks: {stats['agent_stats']['completed_tasks']}")
            text.append(f"  Failed Tasks: {stats['agent_stats']['failed_tasks']}")
            
        text.append("\nPersona Performance:")
        for persona, metrics in report['persona_performance'].items():
            text.append(f"\n{persona}:")
            text.append(f"  Tasks Completed: {metrics['tasks_completed']}")
            text.append(f"  Tasks Failed: {metrics['tasks_failed']}")
            text.append(f"  Average Duration: {metrics['average_duration']:.2f}s")
            
        return "\n".join(text)
        
    def _format_csv_report(self, report):
        """Format report as CSV"""
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Department', 'Staff Count', 'Task Count', 
            'Agents', 'Active Tasks', 'Completed Tasks', 
            'Failed Tasks', 'Persona', 'Tasks Completed', 
            'Tasks Failed', 'Average Duration'
        ])
        
        # Write data
        for dept_name, stats in report['department_stats'].items():
            for persona, metrics in report['persona_performance'].items():
                writer.writerow([
                    dept_name.title().replace('_', ' '),
                    stats['staff_count'],
                    stats['task_count'],
                    stats['agent_stats']['total_agents'],
                    stats['agent_stats']['active_tasks'],
                    stats['agent_stats']['completed_tasks'],
                    stats['agent_stats']['failed_tasks'],
                    persona,
                    metrics['tasks_completed'],
                    metrics['tasks_failed'],
                    f"{metrics['average_duration']:.2f}"
                ])
                
        return output.getvalue()

    def optimize_resources(self):
        """Analyze performance data and suggest resource optimizations"""
        report = self.generate_reports()
        optimizations = []
        
        # Analyze department utilization
        for dept_name, stats in report['department_stats'].items():
            utilization = stats['agent_stats']['active_tasks'] / stats['agent_stats']['total_agents']
            
            if utilization < 0.5:
                optimizations.append(
                    f"Underutilized department: {dept_name} "
                    f"({utilization:.0%} utilization). Consider reallocating resources."
                )
            elif utilization > 0.9:
                optimizations.append(
                    f"Overutilized department: {dept_name} "
                    f"({utilization:.0%} utilization). Consider adding more resources."
                )
                
        # Analyze persona performance
        for persona, metrics in report['persona_performance'].items():
            success_rate = metrics['tasks_completed'] / (
                metrics['tasks_completed'] + metrics['tasks_failed']
            ) if (metrics['tasks_completed'] + metrics['tasks_failed']) > 0 else 0
            
            if success_rate < 0.7:
                optimizations.append(
                    f"Low success rate for persona: {persona} "
                    f"({success_rate:.0%} success). Consider retraining or reconfiguring."
                )
                
        return optimizations
        
    def track_trends(self, historical_data):
        """Analyze performance trends over time"""
        trends = {
            'department_utilization': {},
            'persona_performance': {}
        }
        
        # Calculate department utilization trends
        for dept_name in self.departments.keys():
            utilizations = [
                data['department_stats'][dept_name]['agent_stats']['active_tasks'] / 
                data['department_stats'][dept_name]['agent_stats']['total_agents']
                for data in historical_data
            ]
            trends['department_utilization'][dept_name] = {
                'min': min(utilizations),
                'max': max(utilizations),
                'avg': sum(utilizations) / len(utilizations)
            }
            
        # Calculate persona performance trends
        for persona in historical_data[0]['persona_performance'].keys():
            success_rates = [
                data['persona_performance'][persona]['tasks_completed'] / 
                (data['persona_performance'][persona]['tasks_completed'] + 
                 data['persona_performance'][persona]['tasks_failed'])
                for data in historical_data
            ]
            trends['persona_performance'][persona] = {
                'min': min(success_rates),
                'max': max(success_rates),
                'avg': sum(success_rates) / len(success_rates)
            }
            
        return trends
        
    def generate_insights(self, trends, optimizations):
        """Generate actionable insights from trends and optimizations"""
        insights = []
        
        # Department utilization insights
        for dept_name, stats in trends['department_utilization'].items():
            if stats['avg'] < 0.5:
                insights.append(
                    f"Consistently underutilized department: {dept_name} "
                    f"(average {stats['avg']:.0%} utilization). Consider reallocating staff."
                )
            elif stats['avg'] > 0.9:
                insights.append(
                    f"Consistently overutilized department: {dept_name} "
                    f"(average {stats['avg']:.0%} utilization). Consider hiring more staff."
                )
                
        # Persona performance insights
        for persona, stats in trends['persona_performance'].items():
            if stats['avg'] < 0.7:
                insights.append(
                    f"Consistently underperforming persona: {persona} "
                    f"(average {stats['avg']:.0%} success rate). Consider retraining or reconfiguring."
                )
            elif stats['avg'] > 0.9:
                insights.append(
                    f"Consistently high-performing persona: {persona} "
                    f"(average {stats['avg']:.0%} success rate). Consider replicating configuration."
                )
                
        # Add optimization insights
        insights.extend(optimizations)
        
        return insights
        
    def visualize_trends(self, trends):
        """Generate visual representation of trends"""
        visualizations = {
            'department_utilization': {},
            'persona_performance': {}
        }
        
        # Department utilization visualization
        for dept_name, stats in trends['department_utilization'].items():
            visualizations['department_utilization'][dept_name] = {
                'min': f"{stats['min']:.0%}",
                'max': f"{stats['max']:.0%}", 
                'avg': f"{stats['avg']:.0%}"
            }
            
        # Persona performance visualization
        for persona, stats in trends['persona_performance'].items():
            visualizations['persona_performance'][persona] = {
                'min': f"{stats['min']:.0%}",
                'max': f"{stats['max']:.0%}",
                'avg': f"{stats['avg']:.0%}"
            }
            
        return visualizations
        
    def apply_optimizations(self, optimizations):
        """Automatically apply resource optimizations"""
        applied = []
        
        for optimization in optimizations:
            if "underutilized" in optimization.lower():
                dept_name = optimization.split(":")[0].split()[-1]
                # Reallocate staff from underutilized department
                self._reallocate_staff(dept_name)
                applied.append(f"Reallocated staff from {dept_name}")
            elif "overutilized" in optimization.lower():
                dept_name = optimization.split(":")[0].split()[-1]
                # Add temporary staff to overutilized department
                self._add_temporary_staff(dept_name)
                applied.append(f"Added temporary staff to {dept_name}")
                
        return applied
        
    def _reallocate_staff(self, dept_name):
        """Reallocate staff from underutilized department"""
        # Implementation would include moving staff to other departments
        pass
        
    def _add_temporary_staff(self, dept_name):
        """Add temporary staff to overutilized department"""
        # Implementation would include hiring temporary staff
        pass
        
    def analyze_task_times(self):
        """Analyze task completion times across departments"""
        task_times = {}
        
        for dept_name, dept in self.departments.items():
            times = []
            for agent in dept.agents:
                if hasattr(agent, 'current_task') and agent.current_task['status'] == 'Completed':
                    duration = (agent.current_task['end_time'] - 
                              agent.current_task['start_time']).total_seconds()
                    times.append(duration)
                    
            if times:
                task_times[dept_name] = {
                    'min': min(times),
                    'max': max(times),
                    'avg': sum(times) / len(times)
                }
                
        return task_times
        
    def predict_resource_needs(self, trends):
        """Predict future resource needs based on trends"""
        predictions = {}
        
        # Predict department needs
        for dept_name, stats in trends['department_utilization'].items():
            if stats['avg'] > 0.9 and stats['max'] > 0.95:
                predictions[dept_name] = "High - Consider adding 2-3 staff members"
            elif stats['avg'] > 0.8:
                predictions[dept_name] = "Medium - Consider adding 1-2 staff members"
            else:
                predictions[dept_name] = "Low - Current staffing sufficient"
                
        # Predict persona needs
        for persona, stats in trends['persona_performance'].items():
            if stats['avg'] < 0.7:
                predictions[persona] = "High - Needs retraining or reconfiguration"
            elif stats['avg'] > 0.9:
                predictions[persona] = "Low - High performing, consider replication"
            else:
                predictions[persona] = "Medium - Monitor performance"
                
        return predictions
        
    def generate_recommendations(self, trends, optimizations):
        """Generate performance improvement recommendations"""
        recommendations = []
        
        # Department recommendations
        for dept_name, stats in trends['department_utilization'].items():
            if stats['avg'] > 0.9:
                recommendations.append(
                    f"Department {dept_name} is consistently overutilized. "
                    f"Recommend: Add staff, improve workflows, or redistribute tasks."
                )
            elif stats['avg'] < 0.5:
                recommendations.append(
                    f"Department {dept_name} is underutilized. "
                    f"Recommend: Reallocate staff to busier departments or expand responsibilities."
                )
                
        # Persona recommendations
        for persona, stats in trends['persona_performance'].items():
            if stats['avg'] < 0.7:
                recommendations.append(
                    f"Persona {persona} is underperforming. "
                    f"Recommend: Review configuration, update training data, or adjust task assignments."
                )
            elif stats['avg'] > 0.9:
                recommendations.append(
                    f"Persona {persona} is high performing. "
                    f"Recommend: Analyze configuration for replication opportunities."
                )
                
        # Add optimization recommendations
        recommendations.extend(optimizations)
        
        return recommendations

class Department:
    def __init__(self):
        self.staff = []
        self.tasks = []
        self.agents = []  # New attribute to store department-specific agents
        self.persona_task_completion_data = {}  # Track task completion by persona

    def add_staff(self, employee):
        """Add employee to department staff"""
        if isinstance(employee, Employee):
            self.staff.append(employee)
        else:
            raise ValueError("Must add Employee objects")

    def add_agent(self, agent):
        """Add atomic agent to department"""
        if not isinstance(agent, AtomicAgent):
            raise ValueError("Must add AtomicAgent objects")
        self.agents.append(agent)

    def assign_task(self, task):
        """Assign task to department"""
        self.tasks.append(task)

    def assign_task_to_agent(self, task):
        """Assign task to the most suitable agent in the department"""
        if not self.agents:
            raise ValueError("No agents available in this department")
            
        # First try to find agent with exact specialization match
        for agent in self.agents:
            if agent.specialization == task.get('type'):
                result = agent.perform_task(task)
                self._update_persona_data(agent, result)
                return
                
        # Then try to find agent with matching capability
        for agent in self.agents:
            if task.get('type') in agent.capabilities:
                result = agent.perform_task(task)
                self._update_persona_data(agent, result)
                return
                
        # Finally, assign to first available agent with general capabilities
        for agent in self.agents:
            if "General" in agent.capabilities:
                result = agent.perform_task(task)
                self._update_persona_data(agent, result)
                return
                
        # If no suitable agent found, raise error
        raise ValueError(f"No agent found capable of handling task type: {task.get('type')}")
    
    def _update_persona_data(self, agent, result):
        """Update persona task completion data based on task result"""
        if not agent.persona_data:
            return
            
        persona_name = agent.persona_data
        if persona_name not in self.persona_task_completion_data:
            self.persona_task_completion_data[persona_name] = {
                'tasks_completed': 0,
                'tasks_failed': 0,
                'total_duration': 0,
                'task_count': 0  # Needed for average calculation
            }
            
        if result.status == 'Completed':
            duration = (result.end_time - result.start_time).total_seconds()
            
            persona_data = self.persona_task_completion_data[persona_name]
            persona_data['tasks_completed'] += 1
            persona_data['total_duration'] += duration
            persona_data['task_count'] += 1
        elif result.status == 'Failed':
            persona_data = self.persona_task_completion_data[persona_name]
            persona_data['tasks_failed'] += 1
    
    def get_persona_data(self):
        """Get persona task completion data for this department"""
        return self.persona_task_completion_data

class ClientManagementDepartment(Department):
    def manage_client_relations(self):
        """Handle client communication and relationships"""
        # Implementation would include client communication logic
        pass

# Remove CreativeContentDepartment and DigitalMarketingDepartment classes
# class CreativeContentDepartment(Department):
#     def create_content(self):
#         """Handle content creation tasks"""
#         # Implementation would include content creation logic
#         pass

# class DigitalMarketingDepartment(Department):
#     def run_campaigns(self):
#         """Manage and execute marketing campaigns"""
#         # Implementation would include campaign management logic
#         pass

class TechnicalAnalyticsDepartment(Department):
    def analyze_data(self):
        """Perform data analysis and reporting"""
        # Implementation would include data analysis logic
        pass

class ProjectManagementDepartment(Department):
    def manage_projects(self):
        """Coordinate and oversee projects"""
        # Implementation would include project coordination logic
        pass

class Employee:
    def __init__(self, name, role):
        self.name = name
        self.role = role
        self.tasks = []
        self.agent = None  # New attribute to associate an atomic agent
        self.persona = None  # New attribute to store persona reference

    def assign_task(self, task):
        """Assign task to employee"""
        self.tasks.append(task)

    def assign_agent(self, agent):
        """Assign an atomic agent to this employee"""
        if not isinstance(agent, AtomicAgent):
            raise ValueError("Must assign an AtomicAgent object")
        self.agent = agent
        
    def assign_persona(self, persona_path):
        """Assign a persona from file to this employee"""
        try:
            with open(persona_path, 'r') as f:
                persona_data = f.read()
                # Create agent based on persona specialization
                specialization = self._extract_specialization(persona_data)
                self.agent = AtomicAgent(specialization)
                self.agent.load_persona(persona_data)
                self.persona = persona_data
                
                # Removed service-specific adjustments:
                # if "Marketing Automation" in persona_data:
                #     self.agent.specialization = "Marketing Automation"
                # if "Data Analysis" in persona_data:
                #     self.agent.capabilities.append("Data Analysis")
                # if "CRM Integration" in persona_data:
                #     self.agent.capabilities.append("CRM Integration")
                    
        except Exception as e:
            raise ValueError(f"Failed to load persona: {str(e)}")

    def _extract_specialization(self, persona_data):
        """Extract specialization from persona file content"""
        # Look for the role/specialization in the persona file
        if "CRM/MarTech Manager" in persona_data:
            return "CRM Management"
        # Add more specializations as needed
        return "General"

class AgentResult:
    """Class to represent the result of an agent task execution"""
    def __init__(self, status, start_time, end_time=None, error=None):
        self.status = status
        self.start_time = start_time
        self.end_time = end_time
        self.error = error
    
    def to_dict(self):
        """Convert result to dictionary"""
        return {
            'status': self.status,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'error': self.error
        }

class AtomicAgent:
    def __init__(self, specialization):
        self.specialization = specialization
        self.capabilities = []
        self.persona_data = None

    def load_persona(self, persona_data):
        """Load persona data and extract capabilities"""
        self.persona_data = persona_data
        self._parse_capabilities()
        
    def _parse_capabilities(self):
        """Parse capabilities from persona data"""
        if not self.persona_data:
            return
            
        # Extract core competencies
        if "{Core}" in self.persona_data:
            core_start = self.persona_data.find("{Core}")
            core_end = self.persona_data.find("{Secondary}", core_start)
            core_section = self.persona_data[core_start:core_end]
            
            # Parse each capability
            for line in core_section.split('\n'):
                if '[' in line and ']' in line:
                    capability = line.split(']')[0].split('[')[1]
                    self.capabilities.append(capability)

    def perform_task(self, task):
        """Execute a task based on the agent's specialization and capabilities"""
        if not self.capabilities:
            raise ValueError("Agent has no capabilities loaded")
            
        # Check if task type matches any capabilities
        task_type = task.get('type')
        if task_type in self.capabilities:
            # Execute task using persona-specific logic
            result = self._execute_persona_task(task)
            return result
        else:
            raise ValueError(f"Agent lacks capability for task type: {task_type}")

    def _execute_persona_task(self, task):
        """Execute task using persona-specific logic"""
        if not self.persona_data:
            raise ValueError("No persona data loaded for task execution")
            
        # Track task start time and status
        start_time = datetime.now()
        self.current_task = {
            'type': task.get('type'),
            'start_time': start_time,
            'status': 'In Progress'
        }
        
        try:
            # Removed service-specific task executions; use general task executor only.
            self._execute_general_task(task)
            end_time = datetime.now()
            self.current_task['status'] = 'Completed'
            self.current_task['end_time'] = end_time
            
            # Return a proper result object
            return AgentResult('Completed', start_time, end_time)
            
        except Exception as e:
            self.current_task['status'] = 'Failed'
            self.current_task['error'] = str(e)
            # Return a failed result object
            return AgentResult('Failed', start_time, datetime.now(), str(e))
            
    def _execute_general_task(self, task):
        """Execute general task"""
        # Implementation would include general task handling
        # based on the loaded persona data
        pass

# Removed the following methods:
#     def _execute_marketing_task(self, task):
#         pass
#     def _execute_analysis_task(self, task):
#         pass
#     def _execute_crm_task(self, task):
#         pass

class Project:
    def __init__(self, name, client):
        self.name = name
        self.client = client
        self.tasks = []
        self.status = 'New'

    def add_task(self, task):
        """Add task to project"""
        self.tasks.append(task)

    def update_status(self, status):
        """Update project status"""
        valid_statuses = ['New', 'In Progress', 'Completed', 'On Hold']
        if status in valid_statuses:
            self.status = status
        else:
            raise ValueError(f"Status must be one of: {valid_statuses}")

def setup_voice_chat():
    api_key = "YOUR_GOOGLE_VOICE_API_KEY"  # Replace with your actual API key
    connector = GoogleVoiceConnector(api_key)
    connector.connect()
    return connector

# Example usage
if __name__ == "__main__":
    agency = Agency()

    # Add employees to remaining departments
    agency.departments['client_management'].add_staff(
        Employee('Jordan', 'Digital Account Manager')
    )
    agency.departments['technical_analytics'].add_staff(
        Employee('Taylor', 'Digital Marketing Manager')
    )
    agency.departments['project_management'].add_staff(
        Employee('Alex', 'Project Manager')
    )

    # Create a new project
    new_project = Project('Website Redesign', 'Client A')
    agency.projects.append(new_project)

    # Assign project to departments
    agency.assign_project(new_project)

    # Generate reports
    print(agency.generate_reports())

    voice_connector = setup_voice_chat()
