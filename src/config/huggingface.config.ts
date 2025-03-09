import { HfInference } from '@huggingface/inference';

export const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

// Initialize the Hugging Face client
export const hf = new HfInference(HF_API_TOKEN);

// Default model configurations
export const DEFAULT_MODEL_CONFIG = {
  model: 'gpt2', // Default model
  temperature: 0.7,
  max_length: 100,
  top_p: 0.9,
  repetition_penalty: 1.2,
};

// Model selection based on task type
export const TASK_MODELS = {
  textGeneration: 'gpt2',
  summarization: 'facebook/bart-large-cnn',
  questionAnswering: 'deepset/roberta-base-squad2',
  codeGeneration: 'Salesforce/codegen-350M-mono',
};

// Utility function to select appropriate model
export const getModelForTask = (task: keyof typeof TASK_MODELS) => {
  return TASK_MODELS[task] || DEFAULT_MODEL_CONFIG.model;
};

// Error handling configuration
export const ERROR_HANDLING = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
};
