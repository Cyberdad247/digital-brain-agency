import { genai } from '@google/generative-ai';

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Google Generative AI client
export const geminiClient = new genai.GenerativeModel({
  apiKey: GEMINI_API_KEY,
  model: 'gemini-pro',
});

// Default model configurations
export const DEFAULT_GEMINI_CONFIG = {
  model: 'gemini-pro',
  temperature: 0.7,
  maxOutputTokens: 1024,
  topP: 0.9,
  topK: 40,
};

// Model selection based on task type
export const GEMINI_TASK_MODELS = {
  textGeneration: 'gemini-pro',
  codeGeneration: 'gemini-pro',
  imageGeneration: 'gemini-pro-vision',
  multimodal: 'gemini-pro-vision',
};

// Utility function to select appropriate model
export const getGeminiModelForTask = (task: keyof typeof GEMINI_TASK_MODELS) => {
  return GEMINI_TASK_MODELS[task] || DEFAULT_GEMINI_CONFIG.model;
};

// Error handling configuration
export const GEMINI_ERROR_HANDLING = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
};