from InsightOracleAgent import InsightOracleAgent
from CodeCrafterAgent import CodeCrafterAgent
from UXVisionaryAgent import UXVisionaryAgent
import logging

class DigitalBrainAgency:
    def __init__(self):
        self.insight_agent = InsightOracleAgent()
        self.code_agent = CodeCrafterAgent()
        self.design_agent = UXVisionaryAgent()
        self.logger = self._setup_logging()

    def _setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        return logging.getLogger('DigitalBrainAgency')

    def execute_task(self, task_type, requirements):
        try:
            if task_type == 'analysis':
                return self.insight_agent.analyze_data(requirements)
            elif task_type == 'code':
                return self.code_agent.generate_code(requirements)
            elif task_type == 'design':
                return self.design_agent.generate_design(requirements)
            else:
                raise ValueError(f"Unknown task type: {task_type}")
        except Exception as e:
            self.logger.error(f"Error executing task: {str(e)}")
            raise

if __name__ == "__main__":
    agency = DigitalBrainAgency()
    # Example usage
    try:
        analysis_results = agency.execute_task('analysis', {})
        print(analysis_results)
    except Exception as e:
        print(f"Error: {str(e)}")
