export interface AIRequest {
  persona: string;
  prompt: string;
  context?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface AIResponse {
  response: string;
  persona: string;
  timestamp: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIError {
  error: string;
  statusCode: number;
}
