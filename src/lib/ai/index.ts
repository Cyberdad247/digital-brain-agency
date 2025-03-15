import { geminiService, GeminiState, GeminiResponse, ConversationMessage, PainPoint, Solution } from './gemini';
import { vectorDBService } from './vectordb';

// Re-export types and services
export {
  geminiService,
  vectorDBService,
  GeminiState,
  GeminiResponse,
  ConversationMessage,
  PainPoint,
  Solution
};

// Initialize vector database with environment variables
const initializeVectorDB = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  
  if (supabaseUrl && supabaseKey) {
    vectorDBService.initialize({
      supabaseUrl,
      supabaseKey,
      tableName: 'conversation_embeddings'
    });
  } else {
    console.warn('Supabase credentials not found in environment variables. Vector database features will be disabled.');
  }
};

// Call initialization function
initializeVectorDB();
