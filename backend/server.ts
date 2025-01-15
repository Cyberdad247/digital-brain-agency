import express from 'express';
import cors from 'cors';
import { localLLM } from '../src/integrations/local-llm/index.ts';
import { GoogleGemini } from '../src/integrations/google-gemini/index.ts';

const app = express();
const PORT = 3001;

// Initialize LLM providers
const googleGemini = new GoogleGemini();
const localModels = localLLM.models;

// Middleware
app.use(cors());
app.use(express.json());

// Chatbot state
let isOnline = true;

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Chatbot toggle endpoint
app.post('/api/chatbot/toggle', (req, res) => {
  isOnline = !isOnline;
  res.json({ 
    status: 'success',
    mode: isOnline ? 'online' : 'offline'
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = isOnline 
      ? await googleGemini.generateResponse(message)
      : { response: 'Local LLM not implemented yet' };

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Chatbot initialized in', isOnline ? 'online' : 'offline', 'mode');
});
