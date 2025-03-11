import axios from 'axios';

export const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
export const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'https://api.ollama.com';

// Initialize the Ollama client
export const createOllamaClient = (apiKey = OLLAMA_API_KEY, baseUrl = OLLAMA_API_URL) => {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
};

// Default model configurations
export const DEFAULT_OLLAMA_CONFIG = {
  model: 'llama3',
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 0.9,
  top_k: 40,
  repeat_penalty: 1.1,
};

// Model selection based on task type
export const OLLAMA_TASK_MODELS = {
  textGeneration: 'llama3',
  codeGeneration: 'codellama',
  chatCompletion: 'llama3',
  embeddings: 'nomic-embed-text',
};

// Utility function to select appropriate model
export const getOllamaModelForTask = (task: keyof typeof OLLAMA_TASK_MODELS) => {
  return OLLAMA_TASK_MODELS[task] || DEFAULT_OLLAMA_CONFIG.model;
};

// Error handling configuration
export const OLLAMA_ERROR_HANDLING = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
};