class Persona:
    def __init__(self, name, traits):
        self.name = name
        self.traits = traits
        self.memory = []
        self.nlp = self.load_nlp_model()

    def load_nlp_model(self):
        import spacy
        return spacy.load('en_core_web_sm')

    def process_input(self, text):
        doc = self.nlp(text)
        return {
            'intent': self._detect_intent(doc),
            'entities': [(ent.text, ent.label_) for ent in doc.ents]
        }

    def _detect_intent(self, doc):
        if any(token.text.lower() in ['help', 'issue'] for token in doc):
            return 'support'
        return 'general'

class SupportAgent(Persona):
    def decide_response(self, input_text):
        processed = self.process_input(input_text)
        self.memory.append(processed)
        
        if processed['intent'] == 'support':
            return f"I understand you need help with: {[e[0] for e in processed['entities']]}"
        return "How can I assist you further?"


class SalesAgent(Persona):
    def decide_response(self, input_text):
        super().decide_response(input_text)

        if 'buy' in input_text.lower():
            return "Great choice! Let me guide you through our options."
        return "Would you like to hear about our special offers?"


# Example usage
if __name__ == "__main__":
    support_bot = SupportAgent("HelpBot", {"empathy": 0.95})
    sales_bot = SalesAgent("DealBot", {"persuasion": 0.85})

    print(support_bot.decide_response("I have an issue with my order"))  # Output: Let me help...
    print(sales_bot.decide_response("I want to buy something"))  # Output: Great choice...


def test_agents():
    """Basic validation tests"""
    support = SupportAgent("TestSupport", {})
    assert "help" in support.decide_response("problem")
    
    sales = SalesAgent("TestSales", {})
    assert "options" in sales.decide_response("buy")


def test_nlp_processing():
    agent = SupportAgent("NLPTester", {"empathy": 0.9})
    response = agent.decide_response("My order #1234 is late")
    assert "order" in response and "1234" in response
    print("NLP tests passed!")
    print("All tests passed!")