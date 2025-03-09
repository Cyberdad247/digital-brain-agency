/**
 * AI Services Entry Point
 * Provides a unified interface for AI-related services including speech, LLM, and multimodal analysis.
 */

// Core Services
export type { SpeechRecognitionResult, TranscriptionResponse } from './speech/transcription';
export { transcribeAudio } from './speech/transcription';

export type { LLMResponse, GenerationOptions } from './llm/generation';
export { generateText, generateImage } from './llm/generation';

export type { AnalysisResult } from './multimodal/analysis';
export { analyzeContent } from './multimodal/analysis';

// Service Configuration
export type { AIServiceConfig } from './config';
export { defaultConfig, mergeConfig } from './config';

// Error Handling
export { AIServiceError, FileValidationError } from './types';
export type { AIServiceResponse } from './types';

// Service Initialization
export { initializeAIServices } from './init';

// Rate Limiting
export type { RateLimiterConfig } from './utils/rate-limiter';
export { RateLimiter } from './utils/rate-limiter';

// Security Utilities
export type { FileValidationOptions } from './utils/security';
export { validateFileUpload, sanitizeInput } from './utils/security';