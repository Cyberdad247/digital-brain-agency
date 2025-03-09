/**
 * Entry point for LLM services
 */

export { huggingFaceService } from './huggingface';

// Types for LLM responses
export interface LLMTextResponse {
  text: string;
  error?: string;
}

export interface LLMImageResponse {
  imageData: ArrayBuffer;
  error?: string;
}

// Export main service interface
export interface LLMService {
  generateText(prompt: string): Promise<string>;
  generateImage(prompt: string): Promise<ArrayBuffer>;
}