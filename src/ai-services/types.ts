export class AIServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class FileValidationError extends AIServiceError {
  constructor(message: string) {
    super(message, 'FILE_VALIDATION_ERROR');
    this.name = 'FileValidationError';
  }
}

export interface AIServiceResponse<T> {
  data?: T;
  error?: AIServiceError;
}

export interface AIServiceConfig {
  apiKey?: string;
  endpoint?: string;
  timeout?: number;
  maxRetries?: number;
  rateLimits?: {
    requests: number;
    duration: number;
  };
  requiredModules?: string[];
  moduleConfig?: {
    speech?: {
      language?: string;
      model?: string;
    };
    llm?: {
      provider?: string;
      model?: string;
    };
    multimodal?: {
      inputTypes?: string[];
      modelVersion?: string;
    };
  };
}