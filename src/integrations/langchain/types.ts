export interface LangChainConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LangChainMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LangChainResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: LangChainMessage;
    finish_reason: string;
    index: number;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
