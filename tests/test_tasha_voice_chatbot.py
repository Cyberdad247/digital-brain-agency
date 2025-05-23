import unittest
import sys
import os
from unittest.mock import MagicMock, patch

# Add the parent directory to the path so we can import the voice_chat module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from voice_chat.tasha_voice_chatbot import TashaVoiceChatbot
from voice_chat.prompt_optimizer import SelfImprovingPromptOptimizer

class TestTashaVoiceChatbot(unittest.TestCase):
    def setUp(self):
        # Mock the LLM provider manager
        self.mock_provider_manager = MagicMock()
        self.mock_provider_manager.get_credentials.return_value = {
            "api_key": "test_api_key",
            "project_id": "test_project"
        }
        
        # Create a mock for the SelfImprovingPromptOptimizer
        self.mock_optimizer = MagicMock()
        
        # Patch the dependencies
        with patch('voice_chat.tasha_voice_chatbot.LLMProviderManager') as mock_manager_class, \
             patch('voice_chat.tasha_voice_chatbot.SelfImprovingPromptOptimizer') as mock_optimizer_class:
            
            mock_manager_class.return_value = self.mock_provider_manager
            mock_optimizer_class.return_value = self.mock_optimizer
            
            self.tasha = TashaVoiceChatbot("openrouter")
    
    def test_initialization(self):
        """Test that the chatbot initializes correctly"""
        self.assertEqual(self.tasha.api_key, "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")
        self.assertEqual(self.tasha.persona["voice"], "energetic_confident")
        self.assertEqual(self.tasha.persona["context_window"], 10)
        self.assertEqual(self.tasha.persona["security"], "Larissa_Shield_protocols")
        self.assertEqual(self.tasha.persona["multilingual"], "English/Spanish")
        self.assertEqual(self.tasha.persona["prosody"], "MuseMaestro_tuning")
    
    def test_generate_greeting(self):
        """Test the greeting generation functionality"""
        # Configure the mock to return a specific value
        expected_greeting = "Optimized Prompt: Tasha: Greet user warmly. Use SocialSpark's urban energy [[enhanced-invisioned-marketing-staff.txt]]."
        self.mock_optimizer.optimize_prompt.return_value = expected_greeting
        
        # Call the method
        result = self.tasha.generate_greeting()
        
        # Assert the result is what we expect
        self.assertEqual(result, expected_greeting)
        
        # Verify persona parameters and optimization modules
        self.assertEqual(self.tasha.persona["voice"], "energetic_confident")
        self.assertEqual(self.tasha.persona["context_window"], 10)
        
        # Verify the optimizer was called with the correct parameters
        self.mock_optimizer.optimize_prompt.assert_called_once_with(
            prompt="Tasha: Greet user warmly. Use SocialSpark's urban energy [[enhanced-invisioned-marketing-staff.txt]].",
            context="customer_service",
            modules=["CRMBeacon", "SocialSpark"],
            iterations=3
        )
    
    def test_identify_pain_points(self):
        """Test the pain point identification functionality"""
        expected_result = "Optimized Prompt: Ask open-ended questions to identify pain points."
        self.mock_optimizer.optimize_prompt.return_value = expected_result
        
        result = self.tasha.identify_pain_points()
        
        self.assertEqual(result, expected_result)
        self.mock_optimizer.optimize_prompt.assert_called_once_with(
            prompt="Ask open-ended questions to identify pain points. Use InsightOracle's analytics [[Inspira_staff.txt]].",
            context="problem_solving",
            modules=["InsightOracle", "CRMBeacon"],
            iterations=2
        )
    
    def test_propose_solutions(self):
        """Test the solution proposal functionality"""
        expected_result = "Optimized Prompt: Propose solutions using AdAlchemy's ROI strategies."
        self.mock_optimizer.optimize_prompt.return_value = expected_result
        
        result = self.tasha.propose_solutions()
        
        self.assertEqual(result, expected_result)
        self.mock_optimizer.optimize_prompt.assert_called_once_with(
            prompt="Propose solutions using AdAlchemy's ROI strategies and DataAlchemist's insights [[enhanced-invisioned-marketing-staff.txt]].",
            context="sales",
            modules=["AdAlchemy", "DataAlchemist"],
            iterations=2
        )

    def test_conversation_flow(self):
        """Test the complete conversation state flow"""
        # Test initial state
        self.assertEqual(self.tasha.conversation_state, 'greeting')
        
        # Test state transitions
        self.tasha.process_user_input("Hi")
        self.assertEqual(self.tasha.conversation_state, 'identifying_pain_points')
        
        self.tasha.process_user_input("I need help")
        self.assertEqual(self.tasha.conversation_state, 'proposing_solutions')
        
        self.tasha.process_user_input("Okay")
        self.assertEqual(self.tasha.conversation_state, 'scheduling_followup')

    def test_error_handling(self):
        """Test error recovery mechanism"""
        # Force an error
        self.mock_optimizer.optimize_prompt.side_effect = Exception("API failure")
        
        response = self.tasha.process_user_input("test")
        self.assertEqual(response, "Apologies, I encountered an issue. Let's try that again.")
        self.assertEqual(self.tasha.conversation_state, 'error')
        
        # Test recovery
        self.mock_optimizer.optimize_prompt.side_effect = None
        response = self.tasha.process_user_input("retry")
        self.assertEqual(self.tasha.conversation_state, 'greeting')
    
    def test_schedule_followup(self):
        """Test the follow-up scheduling functionality"""
        expected_result = "Optimized Prompt: Schedule follow-ups via FlowForge and OfficeAnchor."
        self.mock_optimizer.optimize_prompt.return_value = expected_result
        
        result = self.tasha.schedule_followup()
        
        self.assertEqual(result, expected_result)
        self.mock_optimizer.optimize_prompt.assert_called_once_with(
            prompt="Schedule follow-ups via FlowForge and OfficeAnchor. Ensure <300ms latency [[Pasted_Text_1741293889131.txt]].",
            context="automation",
            modules=["FlowForge", "OfficeAnchor"],
            iterations=1
        )
    
    def test_process_user_input(self):
        """Test the user input processing functionality"""
        # Mock the generate_greeting method to return a specific value
        expected_response = "Hello, how can I help you today?"
        with patch.object(self.tasha, 'generate_greeting', return_value=expected_response):
            result = self.tasha.process_user_input("Hello")
            self.assertEqual(result, expected_response)
    
    def test_process_user_input_with_pain_points(self):
        """Test processing user input that indicates pain points"""
        # Mock the identify_pain_points method
        expected_response = "I understand you're having issues with marketing. Let me help identify the specific challenges."
        
        # Create a more sophisticated mock that returns different values based on the input
        def side_effect(input_text):
            if "marketing" in input_text.lower():
                return expected_response
            return "Default response"
        
        with patch.object(self.tasha, 'identify_pain_points', return_value=expected_response):
            result = self.tasha.process_user_input("I need help with marketing")
            self.assertEqual(result, expected_response)
    
    def test_process_user_input_with_solution_request(self):
        """Test processing user input that requests solutions"""
        expected_response = "Here are some solutions that can help with your digital marketing needs."
        with patch.object(self.tasha, 'propose_solutions', return_value=expected_response):
            result = self.tasha.process_user_input("What solutions do you offer?")
            self.assertEqual(result, expected_response)
    
    def test_process_user_input_with_followup_request(self):
        """Test processing user input that requests a follow-up"""
        expected_response = "I'd be happy to schedule a follow-up meeting with you."
        with patch.object(self.tasha, 'schedule_followup', return_value=expected_response):
            result = self.tasha.process_user_input("Can we schedule a follow-up?")
            self.assertEqual(result, expected_response)

if __name__ == '__main__':
    unittest.main()